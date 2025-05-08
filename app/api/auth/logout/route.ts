import { type NextRequest, NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" })
    removeAuthCookie(response)
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
