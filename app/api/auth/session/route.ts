import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const payload = verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ user: null })
    }

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
