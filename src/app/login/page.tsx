"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShowcasePanel } from "@/components/auth/auth-showcase-panel";
import { FormField } from "@/components/shared/form-field";
import { Logo } from "@/components/layout/logo";
import { useLoginMutation } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api-client";
import { loginSchema, type LoginInput } from "@/lib/validation/auth.schema";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();

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
      await loginMutation.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Signed in.");
      const returnUrl = searchParams.get("returnUrl");
      router.push(returnUrl && returnUrl.startsWith("/") ? returnUrl : "/account");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <div className="flex flex-1 lg:min-h-[640px]">
      <AuthShowcasePanel
        categoryId="cat-footwear"
        headline="Welcome back to your game."
        description="Sign in to track orders, manage your wishlist, and breeze through checkout."
      />

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
          <div className="flex flex-col items-center gap-3 text-center lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
            <div className="mb-6 space-y-1 text-center lg:text-left">
              <h1 className="text-2xl font-semibold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to continue to your account.</p>
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

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
