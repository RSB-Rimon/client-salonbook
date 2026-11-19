import Link from "next/link";

export default function AccountBlockedPage() {
  return (
    <main className="grid min-h-[calc(100dvh-76px)] place-items-center bg-[#f8f4ef] px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-[#eadfd3] bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a0755e]">Account access</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#38251e]">This account is currently blocked</h1>
        <p className="mt-3 text-sm leading-6 text-[#77665c]">Contact the salon administrator if you think this is a mistake.</p>
        <Link className="mt-7 inline-flex rounded-full bg-[#6e4434] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#543326]" href="/">Return home</Link>
      </section>
    </main>
  );
}
