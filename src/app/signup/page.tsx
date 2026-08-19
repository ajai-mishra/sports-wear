"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShowcasePanel } from "@/components/auth/auth-showcase-panel";
import { FormField } from "@/components/shared/form-field";
import { Logo } from "@/components/layout/logo";
import { useSignupMutation } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api-client";
import { signupSchema, type SignupInput } from "@/lib/validation/auth.schema";

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupInput) {
    try {
      const response = await signupMutation.mutateAsync(data);
      toast.success("Account created — verify your email to continue.");
      router.push(`/verify-otp?email=${encodeURIComponent(response.email)}`);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <div className="flex flex-1 lg:min-h-[720px]">
      <AuthShowcasePanel
        categoryId="cat-jerseys-tshirts"
        headline="Join Sports Wear."
        description="Create an account to save your favorites, speed through checkout, and track every order."
      />

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
          <div className="flex flex-col items-center gap-3 text-center lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
            <div className="mb-6 space-y-1 text-center lg:text-left">
              <h1 className="text-2xl font-semibold">Create your account</h1>
              <p className="text-sm text-muted-foreground">Sign up to start shopping.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {errors.root && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
              )}

              <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </FormField>

              <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </FormField>

              <FormField label="Phone number" htmlFor="phone" error={errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </FormField>

              <FormField label="Password" htmlFor="password" error={errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </FormField>

              <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
