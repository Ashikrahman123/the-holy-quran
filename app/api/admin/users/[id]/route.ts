import { type NextRequest, NextResponse } from "next/server"
import { getSession, hasPermission, sanitizeUser } from "@/lib/auth-utils"
import { Role } from "@prisma/client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role
    if (!hasPermission(session.user.role, Role.ADMIN)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const userId = params.id

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role
    if (!hasPermission(session.user.role, Role.ADMIN)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const userId = params.id
    const body = await request.json()
    const { name, email, username, role, image } = body

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        username,
        role,
        image,
      },
    })

    return NextResponse.json({
      user: sanitizeUser(updatedUser),
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ message: "An error occurred while updating user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role
    if (!hasPermission(session.user.role, Role.ADMIN)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const userId = params.id

    // Prevent deleting self
    if (userId === session.user.id) {
      return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 })
    }

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ message: "An error occurred while deleting user" }, { status: 500 })
  }
}
