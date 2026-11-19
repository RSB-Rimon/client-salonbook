import type { ReactNode } from "react";
import { requireRole } from "@/app/lib/require-user";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireRole("admin");
  return children;
}
