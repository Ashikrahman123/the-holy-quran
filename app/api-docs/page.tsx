"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ApiDocsPage() {
  const { toast } = useToast()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-website.com"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
  }

  const endpoints = {
    auth: [
      {
        method: "POST",
        path: "/api/auth/register",
        title: "User Registration",
        description: "Register a new user account",
        requiresAuth: false,
        body: {
          email: "user@example.com",
          password: "password123",
          name: "John Doe",
        },
        response: {
          success: true,
          data: {
            user: {
              id: "user_123",
              email: "user@example.com",
              name: "John Doe",
              createdAt: "2024-01-01T00:00:00Z",
            },
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      {
        method: "POST",
        path: "/api/auth/login",
        title: "User Login",
        description: "Authenticate user and get access token",
        requiresAuth: false,
        body: {
          email: "user@example.com",
          password: "password123",
        },
        response: {
          success: true,
          data: {
            user: {
              id: "user_123",
              email: "user@example.com",
              name: "John Doe",
            },
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      {
        method: "POST",
        path: "/api/auth/refresh",
        title: "Refresh Token",
        description: "Refresh access token",
        requiresAuth: true,
        response: {
          success: true,
          data: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        title: "User Logout",
        description: "Logout user and invalidate token",
        requiresAuth: true,
        response: {
          success: true,
          message: "Logged out successfully",
        },
      },
    ],
    quran: [
      {
        method: "GET",
        path: "/api/quran/chapters",
        title: "Get All Chapters",
        description: "Retrieve list of all Quran chapters",
        requiresAuth: false,
        params: {
          language: "en (optional)",
        },
        response: {
          success: true,
          data: [
            {
              id: 1,
              number: 1,
              name: "الفاتحة",
              englishName: "Al-Fatihah",
              englishNameTranslation: "The Opening",
              numberOfAyahs: 7,
              revelationType: "Meccan",
            },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/quran/chapters/{id}/verses",
        title: "Get Chapter Verses",
        description: "Get verses for a specific chapter",
        requiresAuth: false,
        params: {
          page: "1 (optional)",
          perPage: "10 (optional)",
          language: "en (optional)",
        },
        response: {
          success: true,
          data: {
            verses: [
              {
                id: 1,
                number: 1,
                text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                translations: [
                  {
                    text: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
                  },
                ],
              },
            ],
            meta: {
              current_page: 1,
              total_pages: 1,
              total_count: 7,
            },
          },
        },
      },
      {
        method: "GET",
        path: "/api/quran/search",
        title: "Search Quran",
        description: "Search verses in the Quran",
        requiresAuth: false,
        params: {
          q: "mercy (required)",
          size: "20 (optional)",
          language: "en (optional)",
        },
        response: {
          success: true,
          data: {
            search: {
              query: "mercy",
              total_results: 100,
              results: [
                {
                  surah: 1,
                  verse: 1,
                  text: "In the name of Allah, the Entirely Merciful...",
                  verse_key: "1:1",
                },
              ],
            },
          },
        },
      },
    ],
    audio: [
      {
        method: "GET",
        path: "/api/audio/reciters",
        title: "Get Reciters",
        description: "Get list of available reciters",
        requiresAuth: false,
        response: {
          success: true,
          data: [
            {
              id: 1,
              name: "Mishary Rashid Alafasy",
              style: "murattal",
            },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/audio/chapter/{chapterId}/reciter/{reciterId}",
        title: "Get Chapter Audio",
        description: "Get audio URL for chapter recitation",
        requiresAuth: false,
        response: {
          success: true,
          data: {
            audioUrl: "https://audio-server.com/001.mp3",
            reciter: "Mishary Rashid Alafasy",
            chapter: 1,
          },
        },
      },
    ],
    user: [
      {
        method: "GET",
        path: "/api/user/profile",
        title: "Get User Profile",
        description: "Get current user profile",
        requiresAuth: true,
        response: {
          success: true,
          data: {
            id: "user_123",
            email: "user@example.com",
            name: "John Doe",
            preferences: {
              language: "en",
              fontSize: "medium",
              theme: "system",
            },
          },
        },
      },
      {
        method: "PUT",
        path: "/api/user/profile",
        title: "Update User Profile",
        description: "Update user profile information",
        requiresAuth: true,
        body: {
          name: "John Smith",
          preferences: {
            language: "ar",
            fontSize: "large",
          },
        },
        response: {
          success: true,
          data: {
            id: "user_123",
            email: "user@example.com",
            name: "John Smith",
          },
        },
      },
      {
        method: "GET",
        path: "/api/user/bookmarks",
        title: "Get User Bookmarks",
        description: "Get user's bookmarked verses",
        requiresAuth: true,
        response: {
          success: true,
          data: [
            {
              id: "bookmark_123",
              verse_key: "2:255",
              note: "Ayat al-Kursi",
              createdAt: "2024-01-01T00:00:00Z",
            },
          ],
        },
      },
      {
        method: "POST",
        path: "/api/user/bookmarks",
        title: "Add Bookmark",
        description: "Add a verse to bookmarks",
        requiresAuth: true,
        body: {
          verse_key: "2:255",
          note: "Beautiful verse about Allah's throne",
        },
        response: {
          success: true,
          data: {
            id: "bookmark_123",
            verse_key: "2:255",
            note: "Beautiful verse about Allah's throne",
          },
        },
      },
    ],
    chat: [
      {
        method: "POST",
        path: "/api/chat",
        title: "Chat with Islamic Assistant",
        description: "Send message to Islamic AI assistant",
        requiresAuth: true,
        body: {
          message: "What is the meaning of Surah Al-Fatiha?",
        },
        response: {
          success: true,
          data: {
            response: "Surah Al-Fatiha, also known as 'The Opening'...",
            creditsUsed: 1,
            remainingCredits: 99,
          },
        },
      },
      {
        method: "GET",
        path: "/api/chat/credits",
        title: "Get Chat Credits",
        description: "Get user's remaining chat credits",
        requiresAuth: true,
        response: {
          success: true,
          data: {
            totalCredits: 100,
            usedCredits: 25,
            remainingCredits: 75,
            resetDate: "2024-01-02T00:00:00Z",
          },
        },
      },
    ],
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Quran Mobile App API Documentation</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Complete API reference for the Quran mobile application with authentication support.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Base URL:</p>
          <code className="bg-background px-2 py-1 rounded text-sm">{baseUrl}</code>
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(baseUrl)} className="ml-2">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="auth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="quran">Quran</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {categoryEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>{endpoint.method}</Badge>
                      <code className="text-sm">{endpoint.path}</code>
                      {endpoint.requiresAuth && <Badge variant="outline">🔒 Auth Required</Badge>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${baseUrl}${endpoint.path}`)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle>{endpoint.title}</CardTitle>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {endpoint.requiresAuth && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium">Authorization Header Required:</p>
                      <code className="text-xs bg-background px-2 py-1 rounded mt-1 block">
                        Authorization: Bearer YOUR_JWT_TOKEN
                      </code>
                    </div>
                  )}

                  {endpoint.params && (
                    <div>
                      <h4 className="font-semibold mb-2">Query Parameters:</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <pre className="text-sm overflow-x-auto">{JSON.stringify(endpoint.params, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {endpoint.body && (
                    <div>
                      <h4 className="font-semibold mb-2">Request Body:</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <pre className="text-sm overflow-x-auto">{JSON.stringify(endpoint.body, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Response:</h4>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm overflow-x-auto">{JSON.stringify(endpoint.response, null, 2)}</pre>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">cURL Example:</p>
                    <code className="text-xs bg-background px-2 py-1 rounded block">
                      curl -X {endpoint.method} "{baseUrl}
                      {endpoint.path}" \<br />
                      {endpoint.requiresAuth && (
                        <>
                          -H "Authorization: Bearer YOUR_JWT_TOKEN" \<br />
                        </>
                      )}
                      {endpoint.body && (
                        <>
                          -H "Content-Type: application/json" \<br />
                          -d '{JSON.stringify(endpoint.body)}'
                        </>
                      )}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
          <CardDescription>Standard error response format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <pre className="text-sm">
              {`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}`}
            </pre>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Common Error Codes:</h4>
            <ul className="text-sm space-y-1">
              <li>
                <code>UNAUTHORIZED</code> - Invalid or missing authentication token
              </li>
              <li>
                <code>FORBIDDEN</code> - Insufficient permissions
              </li>
              <li>
                <code>VALIDATION_ERROR</code> - Invalid request data
              </li>
              <li>
                <code>NOT_FOUND</code> - Resource not found
              </li>
              <li>
                <code>RATE_LIMIT_EXCEEDED</code> - Too many requests
              </li>
              <li>
                <code>INTERNAL_ERROR</code> - Server error
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
