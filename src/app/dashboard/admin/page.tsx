import { requireRole } from "@/app/lib/require-user";

export default async function AdminDashboardPage() {
  const session = await requireRole("admin");
  return (
    <section className="mx-auto max-w-5xl rounded-3xl border border-[#eadfd3] bg-white p-8 shadow-sm sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a0755e]">Admin</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#38251e]">Welcome, {session.user.name}</h1>
      <p className="mt-3 text-sm leading-6 text-[#77665c]">The admin dashboard content will be added in its project step.</p>
    </section>
  );
}
