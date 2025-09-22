"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const useTokenSync = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      // Sync token from session to localStorage
      localStorage.setItem('admin_token', session.accessToken as string);
      console.log('Token synced to localStorage:', (session.accessToken as string).substring(0, 10) + '...');
    } else if (status === "unauthenticated") {
      // Clear token when logged out
      localStorage.removeItem('admin_token');
      console.log('Token cleared from localStorage');
    }
  }, [session, status]);

  return {
    isAuthenticated: status === "authenticated",
    hasToken: !!localStorage.getItem('admin_token'),
  };
};
