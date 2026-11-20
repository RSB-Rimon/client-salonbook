
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userName = user?.name || "My Account";
  const userRole = (
    user as unknown as { role?: string } | undefined
  )?.role;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await authClient.signOut();

      setIsMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eee9e2] bg-[#fffdf9]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29251f] text-xl text-white">
            S
          </span>

          <span className="text-2xl font-bold tracking-tight text-[#29251f]">
            Salon<span className="text-[#b58b57]">Book</span>
            <span className="ml-1 text-[10px] font-medium tracking-[0.2em] text-[#9b9185]">
              .
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#686159] transition-colors duration-200 hover:text-[#b58b57]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#f3eee7]" />
          ) : user ? (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-[#eee9e2] px-3 py-2 transition hover:bg-[#f3eee7]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#29251f] text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>

                <span className="max-w-32 truncate text-sm font-semibold text-[#29251f]">
                  {userName}
                </span>

                <svg
                  className="h-4 w-4 text-[#686159] transition group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>

              <div className="absolute right-0 mt-3 w-60 rounded-xl border border-[#eee9e2] bg-white p-2 shadow-xl">
                <div className="border-b border-[#eee9e2] px-3 py-3">
                  <p className="truncate text-sm font-semibold text-[#29251f]">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-[#9b9185]">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="mt-2 block rounded-lg px-3 py-2.5 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7] hover:text-[#b58b57]"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {isSigningOut ? "Signing out..." : "Logout"}
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#29251f] transition hover:bg-[#f3eee7]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#29251f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#b58b57]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#eee9e2] text-[#29251f] md:hidden"
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#eee9e2] bg-[#fffdf9] px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7] hover:text-[#b58b57]"
              >
                {link.label}
              </Link>
            ))}

            {!isPending && user && (
              <>
                <div className="mt-3 border-t border-[#eee9e2] px-4 py-4">
                  <p className="text-sm font-semibold text-[#29251f]">
                    {userName}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#9b9185]">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7]"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {isSigningOut ? "Signing out..." : "Logout"}
                </button>
              </>
            )}

            {!isPending && !user && (
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#eee9e2] pt-4">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full border border-[#29251f] px-4 py-3 text-center text-sm font-semibold text-[#29251f]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full bg-[#29251f] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
