import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Find user (in a real app, query database)
    // For demo purposes, we'll simulate a user
    const user = {
      id: "user_123",
      email: "demo@example.com",
      name: "Demo User",
      hashedPassword: await bcrypt.hash("password123", 12), // Demo password
    }

    // Check if user exists and password is correct
    if (email !== user.email || !(await bcrypt.compare(password, user.hashedPassword))) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 },
      )
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    // Return user data without password
    const { hashedPassword, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: error.errors,
          },
        },
        { status: 400 },
      )
    }

    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      },
      { status: 500 },
    )
  }
}
