import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken, hashPassword, setAuthCookie } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email, username, password, name } = await request.json()

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json({ message: "Email, username, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 })
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUserByUsername) {
      return NextResponse.json({ message: "Username already in use" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        preferences: {
          create: {}, // Create default preferences
        },
      },
    })

    // Generate token
    const token = generateToken({ id: user.id })

    // Set cookie
    setAuthCookie(token)

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 })
  }
}
