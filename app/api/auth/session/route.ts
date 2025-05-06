import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthCookie, verifyToken } from "@/lib/auth-utils"

export async function GET() {
  try {
    const token = getAuthCookie()

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.id) {
      return NextResponse.json({ user: null })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
