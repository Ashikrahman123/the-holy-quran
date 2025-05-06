import { put } from "@vercel/blob"
import { cache } from "react"
import { prisma } from "./prisma"

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

export interface Memory {
  id: string
  userId: string
  key: string
  value: string
  createdAt: Date
  updatedAt: Date
}

export const getUserMemories = cache(async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    return memories
  } catch (error) {
    console.error("Error fetching user memories:", error)
    return []
  }
})

export async function saveMemory(userId: string, key: string, value: any): Promise<Memory | null> {
  if (!userId || !key || value === undefined) {
    throw new Error("User ID, key, and value are required")
  }

  try {
    // Convert non-string values to JSON
    const stringValue = typeof value === "string" ? value : JSON.stringify(value)

    // Check if memory already exists
    const existingMemory = await prisma.memory.findFirst({
      where: { userId, key },
    })

    if (existingMemory) {
      // Update existing memory
      const updatedMemory = await prisma.memory.update({
        where: { id: existingMemory.id },
        data: { value: stringValue, updatedAt: new Date() },
      })
      return updatedMemory
    } else {
      // Create new memory
      const newMemory = await prisma.memory.create({
        data: {
          userId,
          key,
          value: stringValue,
        },
      })
      return newMemory
    }
  } catch (error) {
    console.error("Error saving memory:", error)
    return null
  }
}

export async function getMemory(userId: string, key: string): Promise<string | null> {
  if (!userId || !key) {
    throw new Error("User ID and key are required")
  }

  try {
    const memory = await prisma.memory.findFirst({
      where: { userId, key },
    })

    return memory?.value || null
  } catch (error) {
    console.error("Error getting memory:", error)
    return null
  }
}

export async function deleteMemory(userId: string, key: string): Promise<boolean> {
  if (!userId || !key) {
    throw new Error("User ID and key are required")
  }

  try {
    await prisma.memory.deleteMany({
      where: { userId, key },
    })
    return true
  } catch (error) {
    console.error("Error deleting memory:", error)
    return false
  }
}

// For large files, we'll use Vercel Blob storage
export async function saveMemoryBlob(userId: string, key: string, content: string | Buffer): Promise<string | null> {
  try {
    // Create a unique path for this user's blob
    const path = `memories/${userId}/${key}`

    // Upload to Vercel Blob
    const blob = await put(path, content, {
      access: "private",
    })

    // Store the blob URL in the user's memories
    await saveMemory(userId, `blob:${key}`, blob.url)

    return blob.url
  } catch (error) {
    console.error("Error saving memory blob:", error)
    return null
  }
}

export async function getMemoryBlob(userId: string, key: string): Promise<Blob | null> {
  try {
    // Get the blob URL from the user's memories
    const blobUrl = await getMemory(userId, `blob:${key}`)

    if (!blobUrl) return null

    // Fetch the blob
    const response = await fetch(blobUrl)
    if (!response.ok) return null

    return await response.blob()
  } catch (error) {
    console.error("Error getting memory blob:", error)
    return null
  }
}
