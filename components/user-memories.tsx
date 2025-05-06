"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Memory {
  id: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

export function UserMemories() {
  const { user } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [newMemoryKey, setNewMemoryKey] = useState("")
  const [newMemoryValue, setNewMemoryValue] = useState("")
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchMemories()
    } else {
      setMemories([])
      setLoading(false)
    }
  }, [user])

  const fetchMemories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/memories")

      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || [])
      }
    } catch (error) {
      console.error("Error fetching memories:", error)
      toast({
        title: "Error",
        description: "Failed to load your memories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save memories",
        variant: "destructive",
      })
      return
    }

    if (!newMemoryKey || !newMemoryValue) {
      toast({
        title: "Error",
        description: "Both key and value are required",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch("/api/user/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: newMemoryKey,
          value: newMemoryValue,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Memory saved successfully",
        })
        setNewMemoryKey("")
        setNewMemoryValue("")
        fetchMemories()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to save memory")
      }
    } catch (error) {
      console.error("Error saving memory:", error)
      toast({
        title: "Error",
        description: "Failed to save memory",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMemory = async (key: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/user/memories/${encodeURIComponent(key)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Memory deleted successfully",
        })
        fetchMemories()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete memory")
      }
    } catch (error) {
      console.error("Error deleting memory:", error)
      toast({
        title: "Error",
        description: "Failed to delete memory",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Memories</CardTitle>
          <CardDescription>Log in to save and view your personal Quran memories and notes</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="mb-4">Your memories will be securely stored and accessible from any device</p>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => (window.location.href = "/login")}>
            Log In to Access Memories
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-100">
      <CardHeader className="border-b pb-3">
        <CardTitle>Your Personal Memories</CardTitle>
        <CardDescription>Save and manage your personal notes and memories</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSaveMemory} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <Input
                placeholder="Memory title"
                value={newMemoryKey}
                onChange={(e) => setNewMemoryKey(e.target.value)}
                className="border-emerald-200"
                disabled={saving}
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Memory content"
                  value={newMemoryValue}
                  onChange={(e) => setNewMemoryValue(e.target.value)}
                  className="border-emerald-200 flex-1"
                  disabled={saving}
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={saving || !newMemoryKey || !newMemoryValue}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No memories saved yet. Create your first memory above.
          </div>
        ) : (
          <div className="space-y-3">
            {memories.map((memory) => (
              <div key={memory.id} className="flex items-start justify-between p-3 border rounded-md bg-slate-50">
                <div className="space-y-1">
                  <h3 className="font-medium">{memory.key}</h3>
                  <p className="text-sm text-muted-foreground break-words">{memory.value}</p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(memory.updatedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteMemory(memory.key)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        Your memories are private and secure
      </CardFooter>
    </Card>
  )
}
