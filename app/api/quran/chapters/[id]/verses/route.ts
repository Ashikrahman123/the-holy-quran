import { type NextRequest, NextResponse } from "next/server"
import { getChapterVerses } from "@/lib/api-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("perPage") || "10")
    const language = searchParams.get("language") || "en"

    const chapterNumber = Number.parseInt(params.id)

    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CHAPTER",
            message: "Invalid chapter number. Must be between 1 and 114.",
          },
        },
        { status: 400 },
      )
    }

    const result = await getChapterVerses(chapterNumber, page, perPage, language)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Chapter verses API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch chapter verses",
        },
      },
      { status: 500 },
    )
  }
}
