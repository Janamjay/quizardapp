import { NextResponse, userAgent } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  const cookieStore = cookies();
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isUserLoggedIn = cookieStore.get("isUserLoggedIn")?.value;
  const token = cookieStore.get("token")?.value;

  if (!isUserLoggedIn && !token) {
    if (
      !request.nextUrl.pathname.startsWith("/login") &&
      !request.nextUrl.pathname.startsWith("/register")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (isUserLoggedIn && token) {
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/join/:path*", "/profile", "/login", "/register"],
};
