import { type NextRequest, NextResponse } from "next/server"
import { getSession, sanitizeUser } from "@/lib/auth-utils"

// Get current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { preferences: true },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: sanitizeUser(user) })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ message: "An error occurred while getting user" }, { status: 500 })
  }
}

// Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, image } = body

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image,
      },
    })

    return NextResponse.json({
      user: sanitizeUser(updatedUser),
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ message: "An error occurred while updating user" }, { status: 500 })
  }
}
