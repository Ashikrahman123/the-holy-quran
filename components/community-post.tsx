"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Heart,
  Share2,
  BookmarkIcon,
  Send,
  AlertCircle,
  BookOpen,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ReportDialog } from "@/components/report-dialog"
import type { ReportReason } from "@/types/community"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Author {
  name: string
  image: string
  username: string
}

interface CommunityPostProps {
  id: string
  author: Author
  content: string
  timestamp: string
  likes: number
  comments: number
  type: "discussion" | "teaching" | "question" | "quote"
  isModerator?: boolean
}

export function CommunityPost({
  id,
  author,
  content,
  timestamp,
  likes: initialLikes,
  comments: initialComments,
  type,
  isModerator = false,
}: CommunityPostProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [likes, setLikes] = useState(initialLikes)
  const [comments, setComments] = useState(initialComments)
  const [isHidden, setIsHidden] = useState(false)
  const { toast } = useToast()

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked ? "Post removed from your bookmarks" : "Post saved to your bookmarks",
    })
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share post",
      description: "Sharing functionality would be implemented here",
    })
  }

  const handleComment = () => {
    if (!commentText.trim()) return

    // In a real app, this would send the comment to an API
    setComments(comments + 1)
    setCommentText("")
    toast({
      title: "Comment added",
      description: "Your comment has been added to the post",
    })
  }

  const handleReport = async (reason: ReportReason, description: string) => {
    // In a real app, this would send the report to an API
    console.log("Reporting post", id, "for reason", reason, "with description", description)

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }

  const handleModeratorAction = (action: "hide" | "remove" | "warn") => {
    // In a real app, this would send the moderation action to an API
    if (action === "hide") {
      setIsHidden(true)
      toast({
        title: "Post hidden",
        description: "This post has been hidden from the community feed",
      })
    } else if (action === "remove") {
      toast({
        title: "Post removed",
        description: "This post has been permanently removed",
      })
    } else if (action === "warn") {
      toast({
        title: "Warning sent",
        description: "A warning has been sent to the author",
      })
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "teaching":
        return <BookOpen className="h-4 w-4 text-emerald-500" />
      case "question":
        return <HelpCircle className="h-4 w-4 text-blue-500" />
      case "quote":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeBadge = () => {
    switch (type) {
      case "teaching":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          >
            Teaching
          </Badge>
        )
      case "question":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            Question
          </Badge>
        )
      case "quote":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            Quote
          </Badge>
        )
      default:
        return <Badge variant="outline">Discussion</Badge>
    }
  }

  if (isHidden) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 pb-4 text-center text-muted-foreground">
          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
          <p>This post has been hidden by a moderator</p>
          {isModerator && (
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsHidden(false)}>
              Unhide Post
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={author.image || "/placeholder.svg"} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{author.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{author.username} • {timestamp}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getTypeBadge()}

                {isModerator && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleModeratorAction("hide")}>Hide Post</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleModeratorAction("warn")}>Warn Author</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleModeratorAction("remove")}
                      >
                        Remove Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div className="mt-3 text-base">
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={handleLike} className={`gap-1 ${liked ? "text-red-500" : ""}`}>
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{comments}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleBookmark}>
              <BookmarkIcon className={`h-4 w-4 ${bookmarked ? "fill-current text-primary" : ""}`} />
            </Button>
            <ReportDialog contentId={id} contentType="post" onReport={handleReport} />
          </div>
        </div>

        {showComments && (
          <div className="mt-4 w-full">
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={handleComment} disabled={!commentText.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
