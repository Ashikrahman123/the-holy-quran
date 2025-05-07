import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Use dynamic imports for Prisma
export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    // Get the token from the cookies
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_build_time"
    let payload: any

    try {
      payload = jwt.verify(token, jwtSecret)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Dynamically import Prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

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
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_build_time"
    let payload: any

    try {
      payload = jwt.verify(token, jwtSecret)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Dynamically import Prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

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
