import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Enhanced token extraction with logging
  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isApiRequest = request.nextUrl.pathname.startsWith("/api");
  const isRootPage = request.nextUrl.pathname === "/";
  const routeWhitelist = ["/terms-and-conditions"]

  // Debug logging for production troubleshooting
  const environment = process.env.VERCEL_ENV || "development";
  const isProduction = environment === "production";

  if (isProduction) {
    console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
    console.log(`[Middleware] Token exists: ${!!token}`);
    console.log(`[Middleware] Is auth page: ${isAuthPage}`);
    console.log(`[Middleware] Is API request: ${isApiRequest}`);
    console.log(`[Middleware] Is root page: ${isRootPage}`);
  }

  // Allow access to /auth/login and /auth/signup even if a token exists (unless verified as valid)
  if (
    isAuthPage &&
    (request.nextUrl.pathname === "/auth/login" ||
      request.nextUrl.pathname === "/auth/signup")
  ) {
    // (Optional) If you have a verifyToken function, you can call it here to decide whether to redirect.
    // For now, we allow access to these pages even if a token exists.
    if (isProduction) {
      console.log(
        "[Middleware] Allowing access to auth page (login or signup) even if token exists."
      );
    }
  } else if (isAuthPage && token && !isRootPage) {
    // For other auth pages (if any), redirect to dashboard if token exists.
    const redirectUrl = new URL("/dashboard/pitches", request.url);
    if (isProduction) {
      console.log(`[Middleware] Redirecting to: ${redirectUrl.toString()}`);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing protected pages without token, redirect to login
  if (!isAuthPage && !isApiRequest && !token && !isRootPage && !routeWhitelist.includes(request.nextUrl.pathname)) {
    // Check if we're already trying to access the login page to prevent redirection loops
    if (!request.nextUrl.pathname.includes("/auth/login")) {
      const redirectUrl = new URL("/auth/login", request.url);
      if (isProduction) {
        console.log(`[Middleware] Redirecting to: ${redirectUrl.toString()}`);
      }
      return NextResponse.redirect(redirectUrl);
    } else {
      // Already heading to login, just continue
      console.log(
        `[Middleware] Already going to login, allowing request to continue`
      );
    }
  }

  // Add auth token to response headers for client access if needed
  const response = NextResponse.next();
  if (token) {
    response.headers.set("x-auth-token", token);
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
