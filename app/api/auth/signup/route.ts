import { NextResponse } from "next/server"
import { hashPassword, generateToken } from "@/lib/auth-utils"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    const { name, email, username, password } = await request.json()

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json({ message: "Email, username, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 })
      }
      if (existingUser.username === username.toLowerCase()) {
        return NextResponse.json({ message: "Username already taken" }, { status: 400 })
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
      },
    })

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    // Set cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 })
  }
}
