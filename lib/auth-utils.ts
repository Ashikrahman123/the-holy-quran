import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

// JWT token verification
export function verifyToken(token: string): any {
  try {
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_build_time"
    return jwt.verify(token, jwtSecret)
  } catch (error) {
    return null
  }
}

// Get auth cookie from request
export function getAuthCookie(req?: NextRequest): string | undefined {
  if (req) {
    return req.cookies.get("auth_token")?.value
  }

  const cookieStore = cookies()
  return cookieStore.get("auth_token")?.value
}

// Get session from request
export async function getSession(req?: NextRequest) {
  const token = getAuthCookie(req)

  if (!token) {
    return null
  }

  const payload = verifyToken(token)

  if (!payload) {
    return null
  }

  return {
    user: {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    },
  }
}

// Generate JWT token
export function generateToken(payload: any): string {
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_build_time"
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" })
}

// Remove auth cookie
export function removeAuthCookie(): void {
  cookies().delete("auth_token")
}
