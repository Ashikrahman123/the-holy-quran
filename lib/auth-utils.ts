import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token generation and verification
interface TokenPayload {
  id: string
  email?: string
  username?: string
}

export function generateToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set")
  }

  return jwt.sign(payload, secret, { expiresIn: "1d" })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set")
    }

    return jwt.verify(token, secret) as TokenPayload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Cookie management
export function setAuthCookie(token: string): void {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
    sameSite: "lax",
  })
}

export function removeAuthCookie(): void {
  cookies().delete("auth_token")
}

// User authentication check
export function getCurrentUser(): Promise<any> {
  return fetch("/api/auth/user").then((res) => {
    if (!res.ok) throw new Error("Failed to fetch user")
    return res.json()
  })
}
