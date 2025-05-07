import { sign, verify } from "jsonwebtoken"
import { hash, compare } from "bcryptjs"
import { cookies } from "next/headers"

// Type for the JWT payload
type TokenPayload = {
  id: string
  [key: string]: any
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

// Verify a password against a hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Generate a JWT token
export function generateToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set")
  }

  return sign(payload, secret, { expiresIn: "1d" })
}

// Verify a JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set")
    }

    return verify(token, secret) as TokenPayload
  } catch (error) {
    return null
  }
}

// Set the auth cookie
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

// Remove the auth cookie
export function removeAuthCookie(): void {
  cookies().delete("auth_token")
}

// Get the auth cookie
export function getAuthCookie(): string | undefined {
  return cookies().get("auth_token")?.value
}

// Get the current user from the auth token
export function getCurrentUser(token: string): TokenPayload | null {
  return verifyToken(token)
}
