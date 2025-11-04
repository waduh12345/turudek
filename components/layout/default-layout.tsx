"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import DefaultHeader from "./header";
import Footer from "./footer";

const AUTH_PATH_REGEX =
  /^(?:\/auth\/(?:login|register)|\/(?:login|register))(?:\/|$)/i;

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATH_REGEX.test(pathname || "");

  if (isAuthPage) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <DefaultHeader />
      <main className="min-h-screen flex flex-col font-sans">{children}</main>
      <Footer />
    </SessionProvider>
  );
};

export default DefaultLayout;