export type UserRole = "user" | "moderator" | "admin"

export interface User {
  id: string
  name: string
  username: string
  email: string
  image?: string
  role: UserRole
  createdAt: Date
}

export type PostType = "discussion" | "teaching" | "question" | "quote"

export type PostStatus = "published" | "pending" | "rejected" | "removed"

export type ReportReason = "inappropriate_content" | "hate_speech" | "misinformation" | "spam" | "other"

export interface Post {
  id: string
  content: string
  type: PostType
  authorId: string
  author: User
  status: PostStatus
  likes: number
  comments: number
  createdAt: Date
  updatedAt: Date
  reports?: Report[]
}

export interface Report {
  id: string
  postId: string
  commentId?: string
  reporterId: string
  reason: ReportReason
  description?: string
  status: "pending" | "reviewed" | "dismissed"
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface Comment {
  id: string
  postId: string
  content: string
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
  reports?: Report[]
}
