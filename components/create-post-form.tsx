"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function CreatePostForm() {
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState("discussion")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setContent("")
      setPostType("discussion")

      toast({
        title: "Post created",
        description: "Your post has been published to the community",
      })
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Share Islamic knowledge, ask a question, or post a reminder..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px]"
      />

      <div className="flex flex-col gap-4">
        <Select value={postType} onValueChange={setPostType}>
          <SelectTrigger>
            <SelectValue placeholder="Post type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discussion">Discussion</SelectItem>
            <SelectItem value="teaching">Islamic Teaching</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="quote">Quote/Hadith</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? "Posting..." : "Post to Community"}
        </Button>
      </div>
    </div>
  )
}
