// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access")?.value;
  console.log("Access Token in Middleware:", accessToken);
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/cart", "/profile", "/orders", "/admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (
    pathname.startsWith("/cart") &&
    req.nextUrl.searchParams.has("session_id") || req.nextUrl.searchParams.has("order_id")
  ) {
    return NextResponse.next();
  }

  if (isProtected && !accessToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (role !== "admin" && pathname.startsWith("/admin")) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
