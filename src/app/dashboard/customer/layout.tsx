import type { ReactNode } from "react";
import { requireRole } from "@/app/lib/require-user";

export default async function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  await requireRole("customer");
  return children;
}
