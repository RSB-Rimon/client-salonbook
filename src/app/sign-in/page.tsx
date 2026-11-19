"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GitBranch, LockKeyhole, Mail, Scissors, Sparkles } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setMessage(result.error.message || "We couldn't sign you in. Check your details and try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGitHubSignIn() {
    setMessage("");
    setIsGitHubLoading(true);
    try {
      const result = await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" });
      if (result.error) {
        setMessage(result.error.message || "GitHub sign in could not be started.");
        setIsGitHubLoading(false);
      }
    } catch {
      setMessage("GitHub sign in could not be started. Please try again.");
      setIsGitHubLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-76px)] bg-[#f8f4ef] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid min-h-[620px] w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#eadfd3] bg-white shadow-[0_24px_80px_-38px_rgba(56,37,30,0.32)] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-[#493126] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#f7e8d8]"><Scissors size={18} /> SalonBook</Link>
            <div className="mt-24 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#f1d9c5]"><Sparkles size={14} /> A little time, just for you</div>
            <h1 className="mt-6 max-w-sm text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Your next feel-good moment starts here.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#e5d4c8]">Sign in to keep your appointments and self-care plans together.</p>
          </div>
          <p className="relative text-xs tracking-wide text-[#d5b9a5]">A thoughtful visit, from booking to beautiful.</p>
        </aside>
        <section className="flex items-center px-6 py-9 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6e4434]"><Scissors size={18} /> SalonBook</Link></div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a0755e]">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#38251e]">Sign in to SalonBook</h2>
            <p className="mt-2 text-sm leading-6 text-[#77665c]">Pick up where you left off and manage your salon visits.</p>
            {message && <p className="mt-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4236]" role="alert" aria-live="polite">{message}</p>}
            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#493a32]" htmlFor="email">Email address</label>
                <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a58e7e]" size={18} /><input className="h-12 w-full rounded-xl border border-[#e6d9cd] bg-[#fffdfa] pl-11 pr-4 text-sm text-[#38251e] outline-none transition placeholder:text-[#ad9c90] focus:border-[#9b6a4e] focus:ring-4 focus:ring-[#9b6a4e]/10" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#493a32]" htmlFor="password">Password</label>
                <div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a58e7e]" size={18} /><input className="h-12 w-full rounded-xl border border-[#e6d9cd] bg-[#fffdfa] pl-11 pr-12 text-sm text-[#38251e] outline-none transition placeholder:text-[#ad9c90] focus:border-[#9b6a4e] focus:ring-4 focus:ring-[#9b6a4e]/10" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} /><button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#8f7b6d] hover:text-[#493126]" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((show) => !show)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              </div>
              <button className="flex h-12 w-full items-center justify-center rounded-full bg-[#6e4434] px-5 text-sm font-semibold text-white transition hover:bg-[#543326] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isLoading || isGitHubLoading}>{isLoading ? "Signing in…" : "Sign in"}</button>
            </form>
            <div className="my-6 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.14em] text-[#a49387]"><span className="h-px flex-1 bg-[#eadfd3]" /> or continue with <span className="h-px flex-1 bg-[#eadfd3]" /></div>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#dfd1c5] bg-white text-sm font-semibold text-[#493a32] transition hover:bg-[#fbf7f2] disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={handleGitHubSignIn} disabled={isLoading || isGitHubLoading}><GitBranch size={18} /> {isGitHubLoading ? "Connecting to GitHub…" : "Continue with GitHub"}</button>
            <p className="mt-7 text-center text-sm text-[#77665c]">New to SalonBook? <Link className="font-semibold text-[#8a573e] underline-offset-4 hover:underline" href="/sign-up">Create an account</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}


