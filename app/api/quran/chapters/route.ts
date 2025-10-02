import { type NextRequest, NextResponse } from "next/server"
import { getChapters } from "@/lib/api-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "en"

    const chapters = await getChapters(language)

    return NextResponse.json({
      success: true,
      data: chapters,
    })
  } catch (error) {
    console.error("Chapters API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch chapters",
        },
      },
      { status: 500 },
    )
  }
}
