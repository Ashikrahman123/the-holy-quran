import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ message: "An error occurred while getting session" }, { status: 500 })
  }
}
