"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type DashboardRole = "admin" | "customer";

type DashboardShellProps = {
  children: ReactNode;
  role: DashboardRole;
  userName: string;
};

export default function DashboardShell({
  children,
  role,
  userName,
}: DashboardShellProps) {
  const pathname = usePathname();
  const dashboardPath =
    role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
  const sectionName =
    role === "admin" ? "Admin workspace" : "Customer dashboard";
  const accountName = userName.trim() || "SalonBook user";
  const initials = accountName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <SidebarProvider className="min-h-[calc(100dvh-76px)] bg-[#f8f4ef]">
      <Sidebar
        variant="inset"
        collapsible="offcanvas"
        className="top-[76px] h-[calc(100dvh-76px)]"
      >
        <SidebarHeader className="border-b border-[#eadfd3] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a0755e]">
            SalonBook
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[#38251e]">
            {sectionName}
          </h1>
          <p className="mt-1 text-sm text-[#77665c]">
            Welcome, {accountName}
          </p>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#a49387]">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href={dashboardPath} />}
                    isActive={pathname === dashboardPath}
                  >
                    <LayoutDashboard aria-hidden="true" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {role === "admin" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/dashboard/admin/services" />}
                      isActive={pathname.startsWith("/dashboard/admin/services")}
                    >
                      <BriefcaseBusiness aria-hidden="true" />
                      <span>Manage Services</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-[#eadfd3] p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#faf6f1] p-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ead8c8] text-sm font-semibold text-[#6e4434]"
            >
              {initials || "S"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#38251e]">
                {accountName}
              </p>
              <p className="text-xs capitalize text-[#8a776b]">{role}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-0 bg-[#f8f4ef]">
        <header className="flex h-14 items-center gap-3 border-b border-[#eadfd3] bg-[#fffdf9] px-4 md:hidden">
          <SidebarTrigger
            aria-label="Open dashboard navigation"
            className="text-[#6e4434]"
          />
          <div>
            <p className="text-sm font-semibold text-[#38251e]">{sectionName}</p>
            <p className="text-xs text-[#77665c]">{accountName}</p>
          </div>
        </header>

        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}