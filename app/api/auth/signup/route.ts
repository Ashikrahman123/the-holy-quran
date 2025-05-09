import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, generateToken, setAuthCookie, sanitizeUser } from "@/lib/auth-utils"
import { Role } from "@prisma/client"
import { db } from "@/lib/db"
import "server-only"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, username, password } = body

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json({ message: "Email, username, and password are required" }, { status: 400 })
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 })
    }

    // Username validation
    if (username.length < 3) {
      return NextResponse.json({ message: "Username must be at least 3 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    })

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 })
      }

      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        return NextResponse.json({ message: "Username already taken" }, { status: 400 })
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        name: name || username,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        role: Role.USER,
        preferences: {
          create: {}, // Create default preferences
        },
      },
    })

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    })

    // Create response
    const response = NextResponse.json({
      user: sanitizeUser(user),
      message: "Account created successfully",
    })

    // Set cookie
    setAuthCookie(token, response)

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 })
  }
}
