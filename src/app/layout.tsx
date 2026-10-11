import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSession } from "./actions";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import SidebarMenu from "@/components/layouts/SidebarMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vtoober",
  description: "author: ATT2703",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider initialSession={session}>
            <div className="flex flex-1">
              <SidebarMenu />
              <div className="flex min-w-0 flex-1 flex-col">{children}</div>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
