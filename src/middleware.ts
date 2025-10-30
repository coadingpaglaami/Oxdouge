// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;
  

  const protectedRoutes = ["/cart", "/profile", "/orders", "/checkout", "/admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !accessToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if(role !== "admin" && pathname.startsWith("/admin")){
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart",
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
