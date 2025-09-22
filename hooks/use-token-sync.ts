"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const useTokenSync = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && (session as any)?.accessToken) {
      // Sync token from session to localStorage
      const token = (session as any).accessToken as string;
      localStorage.setItem('admin_token', token);
      console.log('Token synced to localStorage:', token.substring(0, 10) + '...');
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
