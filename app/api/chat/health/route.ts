export async function GET() {
  try {
    // Check if XAI_API_KEY is available
    if (!process.env.XAI_API_KEY) {
      return Response.json({ status: "error", message: "XAI_API_KEY not configured" }, { status: 503 })
    }

    // Simple health check - just verify the environment is ready
    return Response.json(
      {
        status: "healthy",
        message: "Islamic Assistant is ready",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Health check failed:", error)
    return Response.json({ status: "error", message: "Service unavailable" }, { status: 503 })
  }
}
