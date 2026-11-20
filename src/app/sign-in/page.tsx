
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Scissors,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Validation
const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// Reusable Field
type FormFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: ReactNode;
  registration: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  rightElement?: ReactNode;
};

function FormField({
  id,
  label,
  placeholder,
  type = "text",
  icon,
  registration,
  error,
  disabled,
  autoComplete,
  rightElement,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-stone-700">
        {label}
      </Label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-stone-400">
          {icon}
        </span>

        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`h-12 border-stone-200 bg-stone-50 pl-10 ${
            rightElement ? "pr-12" : "pr-4"
          } ${error ? "border-red-400" : ""}`}
          {...registration}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

// Sign In Page
export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setServerError("");

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message || "Invalid email or password.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#29251f] p-10 text-white lg:flex">
          <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-12 size-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-amber-700/20 blur-3xl" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-amber-600">
              <Scissors className="size-6" />
            </span>
            <span className="text-2xl font-bold">SalonBook</span>
          </Link>

          <div className="relative z-10 max-w-sm">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-300">
              <Sparkles className="size-4" />
              Welcome back
            </span>

            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Your next
              <span className="block text-amber-400">
                beauty experience
              </span>
              starts here.
            </h2>

            <p className="mt-5 text-sm leading-7 text-stone-300">
              Sign in to manage your appointments, discover salon
              services, and enjoy a seamless booking experience.
            </p>
          </div>

          <p className="relative z-10 text-xs text-stone-400">
            © 2026 SalonBook. All rights reserved.
          </p>
        </section>

        {/* Right Side */}
        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 flex items-center gap-2 text-xl font-bold text-stone-900 lg:hidden"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-amber-700 text-white">
                <Scissors className="size-5" />
              </span>
              SalonBook
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-700">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Enter your credentials to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
            >
              <FormField
                id="email"
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                icon={<Mail className="size-4" />}
                registration={register("email")}
                error={errors.email?.message}
                autoComplete="email"
                disabled={isSubmitting}
              />

              <FormField
                id="password"
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                icon={<Lock className="size-4" />}
                registration={register("password")}
                error={errors.password?.message}
                autoComplete="current-password"
                disabled={isSubmitting}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-stone-400 transition hover:text-stone-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />

              {serverError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-amber-700 text-sm font-semibold text-white shadow-md shadow-amber-700/15 transition hover:bg-amber-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 border-t border-stone-100 pt-6 text-center">
              <p className="text-sm text-stone-500">
                Don@apost have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-amber-700 transition hover:text-amber-800 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
