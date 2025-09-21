"use client";

import { SessionProvider } from "next-auth/react";
import DefaultHeader from "./header";
import Footer from "./footer";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <DefaultHeader />
      <main className="pt-16 min-h-screen flex flex-col font-sans">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  );
};

export default DefaultLayout;
