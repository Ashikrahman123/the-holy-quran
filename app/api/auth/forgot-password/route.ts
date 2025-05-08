import { type NextRequest, NextResponse } from "next/server"
import { generateResetToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // If user not found, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If your email is registered, you will receive a password reset link",
      })
    }

    // Generate reset token
    const token = generateResetToken()
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    })

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    console.log("Password reset link:", resetLink)

    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link",
      // Only include this in development
      ...(process.env.NODE_ENV !== "production" && { resetLink }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}
