import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/profile", "/settings"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Get the auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value

  // If it's a protected route and there's no auth token, redirect to login
  if (isProtectedRoute && !authToken) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Fix the config export format
export const config = {
  matcher: ["/profile/:path*", "/settings/:path*"],
}
