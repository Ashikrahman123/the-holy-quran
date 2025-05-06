import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
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

    // Get the user's memories
    const memories = await prisma.memory.findMany({
      where: { userId: payload.id },
      orderBy: { updatedAt: "desc" },
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
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const payload = await verifyToken(token)

    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the request body
    const { key, value } = await request.json()

    if (!key || !value) {
      return NextResponse.json({ message: "Key and value are required" }, { status: 400 })
    }

    // Check if the memory already exists
    const existingMemory = await prisma.memory.findFirst({
      where: { userId: payload.id, key },
    })

    let memory

    if (existingMemory) {
      // Update the memory
      memory = await prisma.memory.update({
        where: { id: existingMemory.id },
        data: { value },
      })
    } else {
      // Create a new memory
      memory = await prisma.memory.create({
        data: {
          userId: payload.id,
          key,
          value,
        },
      })
    }

    return NextResponse.json({ memory })
  } catch (error) {
    console.error("Error saving memory:", error)
    return NextResponse.json({ message: "An error occurred while saving memory" }, { status: 500 })
  }
}
