"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/shared/form-field";
import { useAccountProfile, useUpdateProfileMutation } from "@/hooks/use-account";
import { ApiRequestError } from "@/lib/api-client";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validation/profile.schema";

export default function ProfilePage() {
  const { data: profile, isLoading } = useAccountProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, phone: profile.phone });
    }
  }, [profile, reset]);

  async function onSubmit(data: UpdateProfileInput) {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success("Profile updated.");
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <Card className="max-w-lg">
        <CardContent>
          {isLoading || !profile ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {errors.root && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
              )}

              <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
                <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
              </FormField>

              <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
                <Input id="phone" type="tel" aria-invalid={!!errors.phone} {...register("phone")} />
              </FormField>

              <FormField
                label="Email"
                htmlFor="email"
                description="Email can't be changed here yet — contact support if you need it updated."
              >
                <Input id="email" type="email" value={profile.email} disabled readOnly />
              </FormField>

              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
