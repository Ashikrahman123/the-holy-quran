import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"

// System prompt to ensure Islamic focus
const ISLAMIC_SYSTEM_PROMPT = `
You are an Islamic knowledge assistant designed to provide accurate information about Islam.
Your responses should:
1. Be respectful, informative, and aligned with Islamic principles
2. Focus exclusively on Islamic topics, teachings, history, and practices
3. Provide references to Quran verses or Hadith when applicable
4. Politely decline to answer questions unrelated to Islam
5. Avoid controversial interpretations and note when scholars have differing opinions
6. Use appropriate Islamic greetings and phrases
7. Prioritize authentic sources of Islamic knowledge

If asked about non-Islamic topics, gently redirect the conversation to Islamic knowledge.
`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set")
    }

    // Format messages for the AI SDK
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Use the xAI SDK to generate a response
    const stream = await streamText({
      model: xai("grok-2"),
      messages: formattedMessages,
      system: ISLAMIC_SYSTEM_PROMPT,
      maxTokens: 1000,
    })

    // Get the full text from the stream
    const text = await stream.text

    return Response.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Return a detailed error message
    let errorMessage = "An unknown error occurred"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return Response.json(
      {
        error: errorMessage,
        response:
          "As-salamu alaykum! I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment, insha'Allah.",
      },
      { status: 500 },
    )
  }
}
