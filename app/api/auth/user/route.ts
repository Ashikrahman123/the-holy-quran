import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthCookie, verifyToken } from "@/lib/auth-utils"

export async function PATCH(request: Request) {
  try {
    const token = getAuthCookie()

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Prevent updating email or password through this route
    const { email, password, ...updateData } = data

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ message: "An error occurred while updating user" }, { status: 500 })
  }
}
