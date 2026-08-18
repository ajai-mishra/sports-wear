"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/shared/page-container";
import { useLoginMutation, useLogoutMutation } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api-client";
import { loginSchema, type LoginInput } from "@/lib/validation/auth.schema";
import { STAFF_ROLES } from "@/types/auth.types";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      const { user } = await loginMutation.mutateAsync(data);

      if (!STAFF_ROLES.includes(user.role)) {
        // Only staff may use the admin login — sign the customer right back
        // out rather than leaving them authenticated on an admin surface.
        await logoutMutation.mutateAsync();
        setError("root", { message: "This login is for store staff only." });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Signed in.");
      const returnUrl = searchParams.get("returnUrl");
      router.push(returnUrl && returnUrl.startsWith("/admin") ? returnUrl : "/admin");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <PageContainer className="flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="text-xl font-semibold">Admin sign in</h1>
            <p className="text-sm text-muted-foreground">Sign in with your staff account to continue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending || logoutMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
