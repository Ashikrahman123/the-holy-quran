export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatResponse {
  response: string
  error?: string
}
