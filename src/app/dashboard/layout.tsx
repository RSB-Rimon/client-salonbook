import { requireUser } from "@/app/lib/require-user";
import DashboardShell from "@/app/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await requireUser();
  const role = session.user.role === "admin" ? "admin" : "customer";

  return (
    <DashboardShell role={role} userName={session.user.name}>
      {children}
    </DashboardShell>
  );
}