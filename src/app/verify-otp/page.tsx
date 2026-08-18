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
import { useVerifyOtpMutation } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api-client";
import { verifyOtpSchema, type VerifyOtpInput } from "@/lib/validation/auth.schema";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const verifyOtpMutation = useVerifyOtpMutation();
  const email = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: "" },
  });

  async function onSubmit(data: VerifyOtpInput) {
    try {
      await verifyOtpMutation.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Email verified. Welcome!");
      router.push("/account");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  function handleResendCode() {
    // Mocked — there is no separate resend endpoint at this stage, the code is always MOCK_OTP_CODE.
    toast.success("Verification code resent.");
  }

  return (
    <PageContainer className="flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="text-xl font-semibold">Verify your email</h1>
            <p className="text-sm text-muted-foreground">
              We sent a code to <span className="font-medium text-foreground">{email}</span>
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

          <Button type="submit" className="w-full" disabled={verifyOtpMutation.isPending}>
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify email"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            className="font-medium text-primary hover:underline"
          >
            Resend code
          </button>
        </p>
      </div>
    </PageContainer>
  );
}
