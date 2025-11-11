"use client"

import "./globals.css";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { JwtProvider } from "../contexts/JwtContext";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

NProgress.configure({ showSpinner: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <JwtProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1">
                <Header></Header>
                {children}
              </main>
            </div>
          </SidebarProvider>

          {/* <SidebarProvider>
            <Header></Header>
            <AppSidebar></AppSidebar>
            <SidebarTrigger />
            {children}
          </SidebarProvider> */}
          <Toaster
            richColors
            closeButton
          />
        </JwtProvider>
      </body>
    </html>
  );
}
