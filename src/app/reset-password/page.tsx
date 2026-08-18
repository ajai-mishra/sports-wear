"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/shared/page-container";
import { useResetPasswordMutation } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api-client";
import { resetPasswordSchema } from "@/lib/validation/auth.schema";

// resetPasswordSchema only requires newPassword once (that's all the API needs), but the UX
// for a reset form needs a confirm-password check — extended here at the page level.
const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPasswordMutation();
  const email = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { email, otp: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetPasswordFormInput) {
    try {
      await resetPasswordMutation.mutateAsync({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success("Password updated. Sign in with your new password.");
      router.push("/login");
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
            <h1 className="text-xl font-semibold">Reset password</h1>
            <p className="text-sm text-muted-foreground">
              Enter the verification code sent to{" "}
              <span className="font-medium text-foreground">{email}</span> and choose a new password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <input type="hidden" {...register("email")} />

          <FormField
            label="Verification code"
            htmlFor="otp"
            error={errors.otp?.message}
            description="For this demo, the verification code is always 123456."
          >
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              aria-invalid={!!errors.otp}
              {...register("otp")}
            />
          </FormField>

          <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
          </FormField>

          <FormField
            label="Confirm new password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </FormField>

          <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
