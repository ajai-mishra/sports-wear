"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/shared/page-container";
import { useForgotPasswordMutation } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api-client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth.schema";

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  const submittedEmail = getValues("email");

  return (
    <PageContainer className="flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="text-xl font-semibold">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a verification code to reset your password.
            </p>
          </div>
        </div>

        {forgotPasswordMutation.isSuccess ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>{forgotPasswordMutation.data.message}</AlertDescription>
            </Alert>
            <Button
              className="w-full"
              render={
                <Link href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`} />
              }
              nativeButton={false}
            >
              Continue to reset password
            </Button>
          </div>
        ) : (
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

            <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
              {forgotPasswordMutation.isPending ? "Sending..." : "Send verification code"}
            </Button>
          </form>
        )}

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
