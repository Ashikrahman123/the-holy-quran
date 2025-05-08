import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { Role, type User } from "@prisma/client"
import crypto from "crypto"

// Types
export interface TokenPayload {
  id: string
  email?: string
  username?: string
  role?: Role
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  username: string
  role: Role
  image?: string | null
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token utilities
export function generateToken(payload: TokenPayload): string {
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_build_time"
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_build_time"
    return jwt.verify(token, jwtSecret) as TokenPayload
  } catch (error) {
    return null
  }
}

// Cookie management
export function setAuthCookie(token: string, response?: NextResponse): void {
  const cookieStore = cookies()

  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  })

  if (response) {
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    })
  }
}

export function removeAuthCookie(response?: NextResponse): void {
  const cookieStore = cookies()
  cookieStore.delete("auth_token")

  if (response) {
    response.cookies.delete("auth_token")
  }
}

// Session management
export function getAuthCookie(req?: NextRequest): string | undefined {
  if (req) {
    return req.cookies.get("auth_token")?.value
  }

  const cookieStore = cookies()
  return cookieStore.get("auth_token")?.value
}

export async function getSession(req?: NextRequest): Promise<{ user: SessionUser } | null> {
  const token = getAuthCookie(req)

  if (!token) {
    return null
  }

  const payload = verifyToken(token)

  if (!payload || !payload.id) {
    return null
  }

  // Dynamically import prisma to avoid build-time initialization
  const { prisma } = await import("@/lib/prisma")

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  })

  if (!user) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      image: user.image,
    },
  }
}

// Password reset utilities
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Role-based access control
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.ADMIN]: 3,
    [Role.MODERATOR]: 2,
    [Role.USER]: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// User data sanitization
export function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}
