import { put, del, list, get } from "@vercel/blob"

export async function putBlob(key: string, data: any, userId: string) {
  try {
    const blob = await put(`users/${userId}/${key}`, JSON.stringify(data), {
      contentType: "application/json",
    })
    return blob
  } catch (error) {
    console.error("Error putting blob:", error)
    throw error
  }
}

export async function getBlob(key: string, userId: string) {
  try {
    const blob = await get(`users/${userId}/${key}`)
    if (!blob) return null

    const text = await blob.text()
    return JSON.parse(text)
  } catch (error) {
    console.error("Error getting blob:", error)
    return null
  }
}

export async function deleteBlob(key: string, userId: string) {
  try {
    await del(`users/${userId}/${key}`)
    return true
  } catch (error) {
    console.error("Error deleting blob:", error)
    throw error
  }
}

export async function listBlobs(userId: string, prefix?: string) {
  try {
    const path = prefix ? `users/${userId}/${prefix}` : `users/${userId}`
    const { blobs } = await list({ prefix: path })
    return blobs
  } catch (error) {
    console.error("Error listing blobs:", error)
    return []
  }
}
