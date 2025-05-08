import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    const preferences = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    })

    if (!preferences) {
      return NextResponse.json({ message: "Preferences not found" }, { status: 404 })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Get preferences error:", error)
    return NextResponse.json({ message: "An error occurred while getting preferences" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { theme, language, fontSize, translationSource } = body

    // Dynamically import prisma to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma")

    // Update preferences
    const updatedPreferences = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: {
        theme,
        language,
        fontSize,
        translationSource,
      },
      create: {
        userId: session.user.id,
        theme,
        language,
        fontSize,
        translationSource,
      },
    })

    return NextResponse.json({
      preferences: updatedPreferences,
      message: "Preferences updated successfully",
    })
  } catch (error) {
    console.error("Update preferences error:", error)
    return NextResponse.json({ message: "An error occurred while updating preferences" }, { status: 500 })
  }
}
