"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { Role } from "@prisma/client"

// Types
interface User {
  id: string
  name?: string | null
  email: string
  username?: string
  role?: Role
  image?: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (emailOrUsername: string, password: string) => Promise<boolean>
  signup: (data: SignupData) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string) => Promise<boolean>
  isAdmin: () => boolean
  isModerator: () => boolean
}

interface SignupData {
  name?: string
  email: string
  username?: string
  password: string
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()

        if (data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  // Login function
  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailOrUsername, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }

      setUser(data.user)

      toast({
        title: "Login successful",
        description: data.message || "Welcome back!",
      })

      router.refresh()
      return true
    } catch (error) {
      console.error("Login error:", error)

      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        toast({
          title: "Signup failed",
          description: responseData.message || "Failed to create account",
          variant: "destructive",
        })
        return false
      }

      setUser(responseData.user)

      toast({
        title: "Account created",
        description: responseData.message || "Your account has been created successfully",
      })

      router.refresh()
      return true
    } catch (error) {
      console.error("Signup error:", error)

      toast({
        title: "Signup failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true)

      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)

      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })

      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)

      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        toast({
          title: "Update failed",
          description: responseData.message || "Failed to update profile",
          variant: "destructive",
        })
        return false
      }

      setUser((prev) => (prev ? { ...prev, ...responseData.user } : null))

      toast({
        title: "Profile updated",
        description: responseData.message || "Your profile has been updated successfully",
      })

      return true
    } catch (error) {
      console.error("Update profile error:", error)

      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      toast({
        title: "Password reset",
        description: data.message || "If your email is registered, you will receive a password reset link",
      })

      return res.ok
    } catch (error) {
      console.error("Forgot password error:", error)

      toast({
        title: "Request failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Reset failed",
          description: data.message || "Failed to reset password",
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Password reset",
        description: data.message || "Your password has been reset successfully",
      })

      return true
    } catch (error) {
      console.error("Reset password error:", error)

      toast({
        title: "Reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Role check functions
  const isAdmin = (): boolean => {
    return user?.role === "ADMIN"
  }

  const isModerator = (): boolean => {
    return user?.role === "ADMIN" || user?.role === "MODERATOR"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        isAdmin,
        isModerator,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
