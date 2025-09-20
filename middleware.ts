import { withAuth } from "next-auth/middleware";

// Middleware NextAuth
export default withAuth({
  // Kalau belum login → redirect ke login page bawaan NextAuth
  pages: {
    signIn: "/",
  },
});

// Tentukan path mana saja yang butuh proteksi
export const config = {
  matcher: ["/profile", "/admin/:path*"],
};
