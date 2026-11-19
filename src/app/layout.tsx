import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/app/components/shared/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalonBook | Salon Appointments",
  description: "Discover salon services and manage your appointments with SalonBook.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={[geistSans.variable, geistMono.variable, "h-full antialiased"].join(" ")}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <Navbar />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}