"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, CheckCircle, XCircle, Eye, Flag, ShieldAlert, UserX, Filter } from "lucide-react"
import type { Report, ReportReason } from "@/types/community"

// Mock data for reported content
const mockReports: Report[] = [
  {
    id: "1",
    postId: "post1",
    reporterId: "user1",
    reason: "inappropriate_content",
    description: "This post contains inappropriate language",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    postId: "post2",
    reporterId: "user2",
    reason: "misinformation",
    description: "This post contains incorrect information about prayer times",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    commentId: "comment1",
    postId: "post3",
    reporterId: "user3",
    reason: "hate_speech",
    description: "This comment contains disrespectful language",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "4",
    postId: "post4",
    reporterId: "user4",
    reason: "spam",
    description: "This post is promoting a commercial product",
    status: "reviewed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    reviewedBy: "moderator1",
  },
  {
    id: "5",
    postId: "post5",
    reporterId: "user5",
    reason: "other",
    description: "This post is not related to Islam",
    status: "dismissed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    reviewedBy: "moderator2",
  },
]

// Mock data for reported content details
const mockReportedContent = {
  post1: {
    id: "post1",
    type: "post",
    content: "This is a post with inappropriate content that was reported",
    author: {
      id: "author1",
      name: "John Doe",
      username: "john_doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  post2: {
    id: "post2",
    type: "post",
    content: "Prayer times are completely flexible and can be performed whenever convenient",
    author: {
      id: "author2",
      name: "Jane Smith",
      username: "jane_smith",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  comment1: {
    id: "comment1",
    type: "comment",
    content: "This is a comment with disrespectful language",
    author: {
      id: "author3",
      name: "Bob Johnson",
      username: "bob_j",
      image: "/placeholder.svg?height=40&width=40",
    },
    postId: "post3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  post4: {
    id: "post4",
    type: "post",
    content: "Check out my new Islamic app! Download now at example.com/app - 50% discount!",
    author: {
      id: "author4",
      name: "Marketing User",
      username: "marketing_user",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
  },
  post5: {
    id: "post5",
    type: "post",
    content: "I just watched the latest movie and it was amazing! What do you all think?",
    author: {
      id: "author5",
      name: "Movie Fan",
      username: "movie_fan",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 37), // 37 hours ago
  },
}

const getReasonLabel = (reason: ReportReason) => {
  switch (reason) {
    case "inappropriate_content":
      return "Inappropriate Content"
    case "hate_speech":
      return "Hate Speech"
    case "misinformation":
      return "Misinformation"
    case "spam":
      return "Spam"
    case "other":
      return "Other"
  }
}

const getReasonBadge = (reason: ReportReason) => {
  switch (reason) {
    case "inappropriate_content":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300">
          Inappropriate
        </Badge>
      )
    case "hate_speech":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
          Hate Speech
        </Badge>
      )
    case "misinformation":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          Misinformation
        </Badge>
      )
    case "spam":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          Spam
        </Badge>
      )
    case "other":
      return <Badge variant="outline">Other</Badge>
  }
}

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const { toast } = useToast()

  const pendingReports = mockReports.filter((report) => report.status === "pending")
  const reviewedReports = mockReports.filter((report) => report.status === "reviewed")
  const dismissedReports = mockReports.filter((report) => report.status === "dismissed")

  const handleAction = (action: "approve" | "reject" | "dismiss") => {
    if (!selectedReport) return

    // In a real app, this would send the action to an API
    toast({
      title: action === "approve" ? "Content removed" : action === "reject" ? "User warned" : "Report dismissed",
      description:
        action === "approve"
          ? "The reported content has been removed"
          : action === "reject"
            ? "A warning has been sent to the user"
            : "The report has been dismissed as not violating guidelines",
    })

    // Reset selected report
    setSelectedReport(null)
  }

  const handleBanUser = () => {
    if (!selectedReport) return

    // In a real app, this would send the ban action to an API
    toast({
      title: "User banned",
      description: "The user has been banned from the platform",
      variant: "destructive",
    })

    // Reset selected report
    setSelectedReport(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <section className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
              <p className="text-muted-foreground">Review and manage reported content</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter Reports
            </Button>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Reports List */}
            <div className="md:col-span-5">
              <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="pending" className="relative">
                    Pending
                    {pendingReports.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500">{pendingReports.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                  <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-0 space-y-4">
                  {pendingReports.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No pending reports to review</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pendingReports.map((report) => (
                      <Card
                        key={report.id}
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedReport?.id === report.id ? "border-primary" : ""
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <p className="font-medium">{report.commentId ? "Comment Reported" : "Post Reported"}</p>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Reported{" "}
                                {new Date(report.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            </div>
                            {getReasonBadge(report.reason)}
                          </div>
                          <p className="text-sm line-clamp-2 mt-2">
                            {report.description || `Reported for ${getReasonLabel(report.reason).toLowerCase()}`}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="reviewed" className="mt-0 space-y-4">
                  {reviewedReports.map((report) => (
                    <Card
                      key={report.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedReport?.id === report.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <p className="font-medium">{report.commentId ? "Comment Removed" : "Post Removed"}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Reviewed by {report.reviewedBy} on {new Date(report.reviewedAt!).toLocaleDateString()}
                            </p>
                          </div>
                          {getReasonBadge(report.reason)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="dismissed" className="mt-0 space-y-4">
                  {dismissedReports.map((report) => (
                    <Card
                      key={report.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedReport?.id === report.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">Report Dismissed</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Dismissed by {report.reviewedBy} on {new Date(report.reviewedAt!).toLocaleDateString()}
                            </p>
                          </div>
                          {getReasonBadge(report.reason)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Report Details */}
            <div className="md:col-span-7">
              {selectedReport ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                    <CardDescription>Review the reported content and take appropriate action</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Report Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Report Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Report ID</p>
                          <p>{selectedReport.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reported On</p>
                          <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reason</p>
                          <p>{getReasonLabel(selectedReport.reason)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="capitalize">{selectedReport.status}</p>
                        </div>
                      </div>
                      {selectedReport.description && (
                        <div>
                          <p className="text-muted-foreground">Description</p>
                          <p className="text-sm">{selectedReport.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Reported Content */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Reported Content</h3>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          {selectedReport.commentId ? (
                            // Comment content
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      mockReportedContent[selectedReport.commentId]?.author.image || "/placeholder.svg"
                                    }
                                    alt={mockReportedContent[selectedReport.commentId]?.author.name}
                                  />
                                  <AvatarFallback>
                                    {mockReportedContent[selectedReport.commentId]?.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {mockReportedContent[selectedReport.commentId]?.author.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    @{mockReportedContent[selectedReport.commentId]?.author.username}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm">{mockReportedContent[selectedReport.commentId]?.content}</p>
                              <p className="text-xs text-muted-foreground">
                                Comment on Post #{mockReportedContent[selectedReport.commentId]?.postId}
                              </p>
                            </div>
                          ) : (
                            // Post content
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={mockReportedContent[selectedReport.postId]?.author.image || "/placeholder.svg"}
                                    alt={mockReportedContent[selectedReport.postId]?.author.name}
                                  />
                                  <AvatarFallback>
                                    {mockReportedContent[selectedReport.postId]?.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {mockReportedContent[selectedReport.postId]?.author.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    @{mockReportedContent[selectedReport.postId]?.author.username}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm">{mockReportedContent[selectedReport.postId]?.content}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    {selectedReport.status === "pending" && (
                      <div className="flex flex-wrap gap-3 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleAction("dismiss")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss Report
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAction("reject")}>
                          <ShieldAlert className="h-4 w-4 mr-2" />
                          Warn User
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleAction("approve")}>
                          <Flag className="h-4 w-4 mr-2" />
                          Remove Content
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleBanUser}>
                          <UserX className="h-4 w-4 mr-2" />
                          Ban User
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-10 pb-10 text-center text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg mb-2">Select a report to review</p>
                    <p className="text-sm">Click on a report from the list to view details and take action</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
