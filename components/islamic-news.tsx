"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Newspaper, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsItem {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
}

export function IslamicNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real implementation, you would use a news API like NewsAPI.org
        // Since we don't have an actual API key, we'll use mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockNews: NewsItem[] = [
          {
            title: "Ramadan 2024 Expected to Begin in Early March",
            description: "Astronomers predict that Ramadan 2024 will begin around March 10, subject to moon sighting.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Ramadan+2024",
            publishedAt: "2023-12-15T08:30:00Z",
            source: { name: "Islamic News Network" },
          },
          {
            title: "New Islamic Cultural Center Opens in London",
            description:
              "A state-of-the-art Islamic cultural center has opened in London, offering educational programs and community services.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Cultural+Center",
            publishedAt: "2023-12-14T14:45:00Z",
            source: { name: "Muslim Community News" },
          },
          {
            title: "International Conference on Islamic Finance Announced",
            description:
              "Leading scholars and financial experts will gather for the annual International Conference on Islamic Finance next month.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Islamic+Finance",
            publishedAt: "2023-12-13T11:20:00Z",
            source: { name: "Islamic Economy Journal" },
          },
          {
            title: "Hajj Registration for 2024 Now Open",
            description:
              "Authorities have announced that registration for Hajj 2024 is now open, with new digital services to streamline the process.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Hajj+2024",
            publishedAt: "2023-12-12T09:15:00Z",
            source: { name: "Hajj News Portal" },
          },
          {
            title: "New Translation of Classical Islamic Text Released",
            description:
              "A new English translation of an important classical Islamic text has been published, making it accessible to a wider audience.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Islamic+Text",
            publishedAt: "2023-12-11T16:30:00Z",
            source: { name: "Islamic Literature Review" },
          },
        ]

        setNews(mockNews)
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Failed to load news. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-emerald-600" />
            Islamic News
          </CardTitle>
          <CardDescription>Latest news from the Islamic world</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || "No news available at this time."}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-emerald-600" />
          Islamic News
        </CardTitle>
        <CardDescription>Latest news from the Islamic world</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row">
              {item.urlToImage && (
                <div className="h-40 w-full overflow-hidden rounded-md sm:h-24 sm:w-24">
                  <img
                    src={item.urlToImage || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="mb-1 font-medium">{item.title}</h3>
                <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(item.publishedAt)}</span>
                    <span className="ml-1">• {item.source.name}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Read more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
