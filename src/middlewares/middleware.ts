// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Allow /admin/login without token
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Block all other /admin/* routes without token
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Apply only on /admin routes
};
