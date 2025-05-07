import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
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

    // Get all memories for the user
    const memories = await prisma.memory.findMany({
      where: { userId: payload.id },
    })

    return NextResponse.json({ memories })
  } catch (error) {
    console.error("Error fetching memories:", error)
    return NextResponse.json({ message: "An error occurred while fetching memories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Parse the request body
    const body = await request.json()
    const { key, data } = body

    if (!key || !data) {
      return NextResponse.json({ message: "Key and data are required" }, { status: 400 })
    }

    // Dynamically import Prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Create or update the memory
    const memory = await prisma.memory.upsert({
      where: {
        userId_key: {
          userId: payload.id,
          key,
        },
      },
      update: {
        data: JSON.stringify(data),
      },
      create: {
        userId: payload.id,
        key,
        data: JSON.stringify(data),
      },
    })

    return NextResponse.json({ memory })
  } catch (error) {
    console.error("Error creating/updating memory:", error)
    return NextResponse.json({ message: "An error occurred while creating/updating memory" }, { status: 500 })
  }
}
