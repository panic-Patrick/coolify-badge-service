import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect the site UI; allow API, Next internals, and static assets without auth.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/assets") ||
    pathname === "/sw.js"
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get("auth")?.value;
  if (authCookie === "1") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", pathname || "/");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
