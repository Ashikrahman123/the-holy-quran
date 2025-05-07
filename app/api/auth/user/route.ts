import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Dynamically import Prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("User error:", error)
    return NextResponse.json({ message: "An error occurred while getting user" }, { status: 500 })
  }
}
