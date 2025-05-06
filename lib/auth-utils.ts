import crypto from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { type JWTPayload, jwtVerify, SignJWT } from "jose"

// JWT utilities
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development-only"

// This is just for TypeScript type checking
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET environment variable is not set. Using fallback secret for development only.")
}

// Ensure JWT_SECRET is properly formatted for jose
const secretKey = new TextEncoder().encode(JWT_SECRET)

export interface TokenPayload {
  id: string
  email?: string
  username?: string
}

// Generate JWT token
export async function generateToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // Token expires in 1 day
    .sign(secretKey)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Get auth cookie
export function getAuthCookie(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get("auth_token")?.value
}

// Set auth cookie
export function setAuthCookie(token: string): NextResponse {
  const cookieStore = cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
    sameSite: "lax",
  })

  return NextResponse.json({ success: true })
}

// Clear auth cookie on logout
export function removeAuthCookie(): NextResponse {
  const cookieStore = cookies()
  cookieStore.delete("auth_token")
  return NextResponse.json({ success: true })
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  // Generate a salt
  const salt = crypto.randomBytes(16).toString("hex")

  // Hash password with salt
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      resolve(`${salt}:${derivedKey.toString("hex")}`)
    })
  })
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Extract salt from stored hash
  const [salt, storedHash] = hashedPassword.split(":")

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      resolve(derivedKey.toString("hex") === storedHash)
    })
  })
}
