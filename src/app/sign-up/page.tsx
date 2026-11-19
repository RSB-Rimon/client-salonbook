"use client";

import { type FormEvent, useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  GitBranch,
  ImagePlus,
  LockKeyhole,
  Mail,
  Scissors,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/app/lib/auth-client";

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .regex(/[A-Z]/, "Password needs at least one uppercase letter.")
    .regex(/[a-z]/, "Password needs at least one lowercase letter."),
  image: z.union([
    z.literal(""),
    z.string().trim().url("Enter a valid image URL."),
  ]),
});

export default function SignUpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordHasMinLength = password.length >= 6;
  const passwordHasUppercase = /[A-Z]/.test(password);
  const passwordHasLowercase = /[a-z]/.test(password);

  async function handleEmailSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const formValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      image: String(formData.get("image") ?? ""),
    };

    const validation = signUpSchema.safeParse(formValues);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    const user = validation.data;

    // Keep password out of browser logs while showing the submitted profile fields.
    console.log("SalonBook sign-up form data:", {
      ...user,
      password: "[redacted]",
    });

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image || undefined,
        callbackURL: "/dashboard",
      });

      if (error) {
        setErrorMessage(error.message || "Registration failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGitHubSignUp() {
    setErrorMessage("");
    setIsGitHubLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });

      if (error) {
        setErrorMessage(error.message || "GitHub sign up could not be started.");
        setIsGitHubLoading(false);
      }
    } catch {
      setErrorMessage("GitHub sign up could not be started. Please try again.");
      setIsGitHubLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-76px)] bg-[#f8f4ef] px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[680px] w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#eadfd3] bg-white shadow-[0_24px_80px_-38px_rgba(56,37,30,0.32)] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-[#493126] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#f7e8d8]">
              <Scissors size={18} /> SalonBook
            </Link>
            <div className="mt-24 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#f1d9c5]">
              <Sparkles size={14} /> Your self-care, made simple
            </div>
            <h1 className="mt-6 max-w-sm text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Make space for the version of you that feels great.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#e5d4c8]">
              Discover salon services and keep every appointment in one calm, easy place.
            </p>
          </div>
          <p className="relative text-xs tracking-wide text-[#d5b9a5]">
            Your next salon visit is just a few steps away.
          </p>
        </aside>

        <section className="flex items-center px-6 py-8 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6e4434]">
                <Scissors size={18} /> SalonBook
              </Link>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a0755e]">Join SalonBook</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#38251e]">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#77665c]">
              A simple way to plan a little time for yourself.
            </p>

            {errorMessage && (
              <p className="mt-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4236]" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleEmailSignUp}>
              <div>
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a58e7e]" size={18} />
                  <Input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" className="pl-11" required minLength={2} />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a58e7e]" size={18} />
                  <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-11" required />
                </div>
              </div>

              <div>
                <Label htmlFor="image">
                  Profile image URL <span className="font-normal text-[#9b8a7e]">(optional)</span>
                </Label>
                <div className="relative">
                  <ImagePlus className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a58e7e]" size={18} />
                  <Input id="image" name="image" type="url" autoComplete="url" placeholder="https://example.com/photo.jpg" className="pl-11" />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a58e7e]" size={18} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="pl-11 pr-12"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-[#8f7b6d] hover:bg-[#f7eee6] hover:text-[#493126]"
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#88766a]" aria-label="Password requirements">
                  <li className={passwordHasMinLength ? "text-[#47734c]" : ""}>6+ characters</li>
                  <li className={passwordHasUppercase ? "text-[#47734c]" : ""}>One uppercase</li>
                  <li className={passwordHasLowercase ? "text-[#47734c]" : ""}>One lowercase</li>
                </ul>
              </div>

              <Button className="h-11 w-full rounded-full bg-[#6e4434] text-white hover:bg-[#543326]" type="submit" disabled={isLoading || isGitHubLoading}>
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.14em] text-[#a49387]">
              <span className="h-px flex-1 bg-[#eadfd3]" /> or sign up with <span className="h-px flex-1 bg-[#eadfd3]" />
            </div>
            <Button className="h-11 w-full rounded-full border-[#dfd1c5] bg-white text-[#493a32] hover:bg-[#fbf7f2]" variant="outline" type="button" onClick={handleGitHubSignUp} disabled={isLoading || isGitHubLoading}>
              <GitBranch size={18} /> {isGitHubLoading ? "Connecting to GitHub…" : "Continue with GitHub"}
            </Button>
            <p className="mt-5 text-center text-sm text-[#77665c]">
              Already have an account? <Link className="font-semibold text-[#8a573e] underline-offset-4 hover:underline" href="/sign-in">Sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

