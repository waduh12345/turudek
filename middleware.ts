import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search
  );
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Check if accessing admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token) {
        return redirectToLogin(req);
      }
      
      // Check if user is admin
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth error:", err);
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
