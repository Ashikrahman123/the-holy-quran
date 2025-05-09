import type { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { type User, Role } from "@prisma/client"
import { ensureServerOnly } from "./server-only"

// Ensure these functions only run on the server
ensureServerOnly()

// Types
export interface UserJwtPayload {
  id: string
  email: string
  username?: string
  role: Role
  iat?: number
  exp?: number
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export function generateToken(payload: UserJwtPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" })
}

export function verifyToken(token: string): UserJwtPayload {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }

  return jwt.verify(token, secret) as UserJwtPayload
}

// Cookie utilities
export function setAuthCookie(token: string, response: NextResponse): void {
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function removeAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
}

// User utilities
export function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...sanitizedUser } = user
  return sanitizedUser
}

export async function getSession(request: NextRequest): Promise<{ user: UserJwtPayload } | null> {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    const user = verifyToken(token)
    return { user }
  } catch (error) {
    console.error("Invalid token:", error)
    return null
  }
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  if (requiredRole === Role.USER) return true // All logged-in users have USER role
  if (requiredRole === Role.MODERATOR) return userRole === Role.MODERATOR || userRole === Role.ADMIN
  return userRole === Role.ADMIN
}

export function generateResetToken(): string {
  // Generate a random token (you can use a library like uuid)
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return token
}
