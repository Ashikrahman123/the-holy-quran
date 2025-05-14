"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Flag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ReportReason } from "@/types/community"

interface ReportDialogProps {
  contentId: string
  contentType: "post" | "comment"
  onReport: (reason: ReportReason, description: string) => Promise<void>
}

export function ReportDialog({ contentId, contentType, onReport }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!reason) return

    setIsSubmitting(true)

    try {
      await onReport(reason, description)

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe. A moderator will review this content.",
      })

      setOpen(false)
      setReason(null)
      setDescription("")
    } catch (error) {
      toast({
        title: "Error submitting report",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {contentType}</DialogTitle>
          <DialogDescription>
            Please let us know why you're reporting this {contentType}. Our moderators will review it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <RadioGroup value={reason || ""} onValueChange={(value) => setReason(value as ReportReason)}>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="inappropriate_content" id="inappropriate" />
              <Label htmlFor="inappropriate" className="font-normal">
                Inappropriate content
                <p className="text-sm text-muted-foreground">
                  Content that violates Islamic principles or community guidelines
                </p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="hate_speech" id="hate" />
              <Label htmlFor="hate" className="font-normal">
                Hate speech
                <p className="text-sm text-muted-foreground">Content that promotes hatred or discrimination</p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="misinformation" id="misinformation" />
              <Label htmlFor="misinformation" className="font-normal">
                Misinformation
                <p className="text-sm text-muted-foreground">
                  Incorrect information about Islamic teachings or practices
                </p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="spam" id="spam" />
              <Label htmlFor="spam" className="font-normal">
                Spam
                <p className="text-sm text-muted-foreground">Irrelevant or promotional content</p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="font-normal">
                Other
                <p className="text-sm text-muted-foreground">Please provide details below</p>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="description">Additional details (optional)</Label>
            <Textarea
              id="description"
              placeholder="Please provide any additional information that might help our moderators"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
