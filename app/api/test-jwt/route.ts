import { NextResponse } from "next/server"
import { generateToken, verifyToken } from "@/lib/auth-utils"

export async function GET() {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ success: false, message: "JWT_SECRET is not configured" }, { status: 500 })
    }

    // Test token generation and verification
    const testPayload = { id: "test-user", test: true }
    const token = await generateToken(testPayload)
    const verified = await verifyToken(token)

    return NextResponse.json({
      success: true,
      message: "JWT_SECRET is configured correctly",
      verified: !!verified,
      payload: verified,
    })
  } catch (error) {
    console.error("JWT test error:", error)
    return NextResponse.json(
      { success: false, message: "JWT_SECRET test failed", error: String(error) },
      { status: 500 },
    )
  }
}
