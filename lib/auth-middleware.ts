import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthenticatedUser {
  userId: string
  email: string
}

export function verifyToken(request: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    return {
      userId: decoded.userId,
      email: decoded.email,
    }
  } catch (error) {
    return null
  }
}

export function requireAuth(request: NextRequest): AuthenticatedUser {
  const user = verifyToken(request)

  if (!user) {
    throw new Error("UNAUTHORIZED")
  }

  return user
}
