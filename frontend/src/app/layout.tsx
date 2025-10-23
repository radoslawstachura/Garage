"use client"

import "./globals.css";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { JwtProvider } from "../contexts/JwtContext";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

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
          <Header></Header>
          {children}
          <Toaster
            richColors
            closeButton
          />
        </JwtProvider>
      </body>
    </html>
  );
}
