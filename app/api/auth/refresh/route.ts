import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid authorization header",
          },
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7)

    try {
      // Verify the current token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

      // Generate new token
      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" },
      )

      return NextResponse.json({
        success: true,
        data: {
          token: newToken,
        },
      })
    } catch (jwtError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid or expired token",
          },
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Token refresh error:", error)
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
