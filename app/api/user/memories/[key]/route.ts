import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the memory
    const memory = await prisma.memory.findFirst({
      where: { userId: payload.id, key: params.key },
    })

    if (!memory) {
      return NextResponse.json({ message: "Memory not found" }, { status: 404 })
    }

    return NextResponse.json({ memory })
  } catch (error) {
    console.error("Error fetching memory:", error)
    return NextResponse.json({ message: "An error occurred while fetching memory" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Delete the memory
    await prisma.memory.deleteMany({
      where: { userId: payload.id, key: params.key },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting memory:", error)
    return NextResponse.json({ message: "An error occurred while deleting memory" }, { status: 500 })
  }
}
