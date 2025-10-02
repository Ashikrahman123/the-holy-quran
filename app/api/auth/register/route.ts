import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)
    const { email, password, name } = validatedData

    // Check if user already exists (in a real app, check database)
    // For now, we'll simulate this
    const existingUser = null // await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_EXISTS",
            message: "User with this email already exists",
          },
        },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (in a real app, save to database)
    const user = {
      id: `user_${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
      // Don't include password in response
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      success: true,
      data: {
        user,
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

    console.error("Registration error:", error)
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
