import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth-utils"

export async function POST() {
  try {
    removeAuthCookie()
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
