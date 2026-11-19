import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

type UserRole = "admin" | "customer";

export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.isBlocked) {
    redirect("/account-blocked");
  }

  return session;
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireUser();
  const userRole: UserRole = session.user.role === "admin" ? "admin" : "customer";

  if (userRole !== requiredRole) {
    redirect(`/dashboard/${userRole}`);
  }

  return session;
}
