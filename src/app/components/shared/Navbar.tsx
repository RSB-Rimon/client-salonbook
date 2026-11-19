"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, LayoutDashboard, LogOut, Menu, Scissors, X } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = session?.user;
  const userName = user?.name?.trim() || "My account";
  const userInitials = userName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  const dashboardPath = user?.isBlocked ? "/account-blocked" : user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  async function handleSignOut() {
    await authClient.signOut();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd3] bg-[#fffdf9]/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b6a4e]" aria-label="SalonBook home" onClick={() => setMobileMenuOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6e4434] text-[#fff8ed]"><Scissors size={19} strokeWidth={1.8} /></span>
          <span className="text-xl font-semibold tracking-tight text-[#38251e]">Salon<span className="text-[#9b6a4e]">Book</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link className="text-sm font-medium text-[#66534a] transition hover:text-[#9b6a4e]" href="/">Home</Link>
          <Link className="text-sm font-medium text-[#66534a] transition hover:text-[#9b6a4e]" href="/services">Services</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? <span className="h-10 w-28 animate-pulse rounded-full bg-[#f1e8df]" aria-label="Loading account" /> : user ? (
            <div className="relative">
              <button className="flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-[#38251e] transition hover:border-[#c8a78f]" type="button" aria-expanded={accountMenuOpen} aria-haspopup="menu" onClick={() => setAccountMenuOpen((open) => !open)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ead8c8] text-xs font-semibold text-[#6e4434]">{userInitials || "S"}</span>
                <span className="max-w-28 truncate">{userName}</span><ChevronDown size={15} />
              </button>
              {accountMenuOpen && <div className="absolute right-0 top-12 w-52 rounded-2xl border border-[#eadfd3] bg-white p-2 shadow-xl shadow-[#38251e]/10" role="menu">
                <Link href={dashboardPath} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#514139] transition hover:bg-[#f8f2eb]" role="menuitem" onClick={() => setAccountMenuOpen(false)}><LayoutDashboard size={16} /> Dashboard</Link>
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#8b4d42] transition hover:bg-[#fcf0ed]" type="button" role="menuitem" onClick={handleSignOut}><LogOut size={16} /> Sign out</button>
              </div>}
            </div>
          ) : <>
            <Link className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#6e4434] transition hover:bg-[#f7eee6]" href="/sign-in">Sign in</Link>
            <Link className="inline-flex items-center gap-2 rounded-full bg-[#6e4434] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#543326]" href="/sign-up">Create account <ArrowRight size={15} /></Link>
          </>}
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd3] text-[#49352b] md:hidden" type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {mobileMenuOpen && <div className="border-t border-[#eadfd3] bg-[#fffdf9] px-5 py-4 md:hidden">
        <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobile navigation">
          <Link className="rounded-xl px-3 py-3 text-sm font-medium text-[#514139] hover:bg-[#f8f2eb]" href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link className="rounded-xl px-3 py-3 text-sm font-medium text-[#514139] hover:bg-[#f8f2eb]" href="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          {!isPending && user ? <>
            <Link className="rounded-xl px-3 py-3 text-sm font-medium text-[#514139] hover:bg-[#f8f2eb]" href={dashboardPath} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <button className="rounded-xl px-3 py-3 text-left text-sm font-medium text-[#8b4d42] hover:bg-[#fcf0ed]" type="button" onClick={handleSignOut}>Sign out</button>
          </> : !isPending ? <div className="mt-2 grid grid-cols-2 gap-2">
            <Link className="rounded-full border border-[#d9c5b4] px-4 py-3 text-center text-sm font-semibold text-[#6e4434]" href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
            <Link className="rounded-full bg-[#6e4434] px-4 py-3 text-center text-sm font-semibold text-white" href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
          </div> : null}
        </nav>
      </div>}
    </header>
  );
}

