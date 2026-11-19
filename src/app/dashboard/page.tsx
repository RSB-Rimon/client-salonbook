import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/require-user";

export default async function DashboardPage() {
  const session = await requireUser();
  redirect(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
}
