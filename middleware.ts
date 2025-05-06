import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth-utils"

// Define protected routes that require authentication
const protectedRoutes = ["/profile", "/settings"]

// Define auth routes (login, signup) where authenticated users should be redirected
const authRoutes = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const path = request.nextUrl.pathname

  const isAuthenticated = token && (await verifyToken(token))
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => path === route)

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  // If accessing auth routes while authenticated, redirect to home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all protected routes
    ...protectedRoutes.map((route) => route + "/:path*"),
    // Match auth routes
    ...authRoutes,
    // Add API routes that need authentication
    "/api/user/:path*",
  ],
}
