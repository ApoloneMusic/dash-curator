"use client"

import { useToast } from "@/hooks/use-toast"
import { authService, type LoginCredentials, type SignupCredentials, type User } from "@/lib/auth-service"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Import the redirect debug utilities
import { detectRedirectLoop, logRedirectAttempt } from "@/lib/redirect-debug"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Debug environment info
  useEffect(() => {
    console.log("Auth Provider Environment:", {
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "local",
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "not set",
      authApiUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || "not set",
      currentPath: pathname,
    })
  }, [pathname])

  // Check if user is authenticated on mount with improved error handling
  useEffect(() => {
    console.log("AuthProvider mounted, checking authentication status")

    const checkAuth = async () => {
      try {
        console.log("Fetching current user...")
        const currentUser = await authService.getCurrentUser()
        console.log("Current user fetch result:", currentUser ? "User found" : "No user found")

        setUser(currentUser)
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Clear any existing token if there's an error
        try {
          localStorage.removeItem("auth_token")
          // Also clear the cookie
          document.cookie = "auth_token=; path=/; max-age=0"
        } catch (e) {
          console.warn("Error removing from localStorage:", e)
        }
        // Explicitly set user to null when authentication fails
        setUser(null)
      } finally {
        setIsLoading(false)
        console.log("Authentication check completed")
      }
    }

    checkAuth()
  }, [])

  // Update the safeRedirect function to use our debug utilities
  const safeRedirect = (path: string) => {
    logRedirectAttempt(pathname || "unknown", path, "Auth context redirect")

    // Check for potential loops
    if (detectRedirectLoop(path)) {
      console.warn(`Potential redirect loop detected! Cancelling redirect to ${path}`)
      return
    }

    console.log(`Attempting to redirect to: ${path}`)

    try {
      // First attempt: Use Next.js router
      router.push(path)

      // Second attempt: Set a timeout for fallback redirection
      setTimeout(() => {
        console.log(`Checking if redirection to ${path} was successful...`)

        if (pathname !== path) {
          console.log(`Fallback: Using window.location for redirection to ${path}`)
          // Use window.location as a fallback
          window.location.href = path
        }
      }, 1000)
    } catch (error) {
      console.error(`Router redirection error: ${error}`)

      // Final fallback: Direct location change
      console.log(`Final fallback: Direct location change to ${path}`)
      window.location.href = path
    }
  }

  // Login function with improved error handling and logging
  const login = async (credentials: LoginCredentials) => {
    console.log("Login attempt initiated for:", credentials.email)
    setIsLoading(true)

    try {
      console.log("Calling auth service login...")
      const response = await authService.login(credentials)
      console.log("Login response received:", response)

      // Validate response structure
      if (!response || !response.user || !response.token) {
        throw new Error("Invalid response from server")
      }

      const { user, token } = response
      console.log("Login successful, user:", user.email)

      // Store token in localStorage with error handling
      try {
        localStorage.setItem("auth_token", token)
        console.log("Auth token stored in localStorage")

        // Also set as a cookie for middleware
        document.cookie = `auth_token=${token}; path=/; max-age=2592000`
        console.log("Auth token stored in cookie")
      } catch (e) {
        console.warn("Error setting localStorage:", e)
      }

      // Set user in state
      setUser(user)

      // Show success toast
      toast({
        title: "Success",
        description: "You have successfully logged in",
      })

      // Refresh user data (fetch current user) before redirecting
      await refreshUser()

      // Enhanced redirection
      console.log("Redirecting to dashboard...")
      safeRedirect("/dashboard/pitches")
    } catch (error) {
      console.error("Login error:", error)

      // Show error toast with more detailed message
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? `Error: ${error.message}` : "An error occurred during login. Please try again.",
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
      console.log("Login process completed")
    }
  }

  // Register function with improved error handling and logging
  const register = async (credentials: SignupCredentials) => {
    console.log("Registration attempt initiated for:", credentials.email)
    setIsLoading(true)

    try {
      // Validate credentials before sending
      if (!credentials.name || !credentials.email || !credentials.password) {
        throw new Error("Missing required registration fields")
      }

      console.log("Calling auth service register...")
      const response = await authService.register(credentials)
      console.log("Registration response received:", response)

      // Validate response structure
      if (!response || !response.user || !response.token) {
        throw new Error("Invalid response from server")
      }

      const { user, token } = response
      console.log("Registration successful, user:", user.email)

      // Store token in localStorage with error handling
      try {
        localStorage.setItem("auth_token", token)
        console.log("Auth token stored in localStorage")

        // Also set as a cookie for middleware
        document.cookie = `auth_token=${token}; path=/; max-age=2592000`
        console.log("Auth token stored in cookie")
      } catch (e) {
        console.warn("Error setting localStorage:", e)
      }

      // Set user in state
      setUser(user)

      // Show success toast
      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      })

      // Refresh user data (fetch current user) before redirecting
      await refreshUser()

      // Enhanced redirection
      console.log("Redirecting to dashboard...")
      safeRedirect("/dashboard/pitches")
    } catch (error) {
      console.error("Registration error:", error)

      // Show error toast with more detailed message
      toast({
        title: "Registration failed",
        description:
          error instanceof Error
            ? `Error: ${error.message}`
            : "An error occurred during registration. Please try again.",
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
      console.log("Registration process completed")
    }
  }

  // Logout function with improved error handling
  const logout = async () => {
    console.log("Logout initiated")
    setIsLoading(true)

    try {
      console.log("Calling auth service logout...")
      await authService.logout()
      console.log("Logout API call completed")

      // Clear user from state
      setUser(null)

      // Clear cookie
      document.cookie = "auth_token=; path=/; max-age=0"
      console.log("Auth token cookie cleared")

      // Show success toast
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })

      // Enhanced redirection
      console.log("Redirecting to login page...")
      safeRedirect("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)

      // Show error toast
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      })

      // Still clear user state and redirect even if API call fails
      setUser(null)
      safeRedirect("/auth/login")
    } finally {
      setIsLoading(false)
      console.log("Logout process completed")
    }
  }

  // Refresh user function with improved error handling
  const refreshUser = async () => {
    console.log("Refreshing user data")

    try {
      console.log("Calling auth service getCurrentUser...")
      const currentUser = await authService.getCurrentUser()
      console.log("User refresh result:", currentUser ? "User found" : "No user found")

      setUser(currentUser)
    } catch (error) {
      console.error("Error refreshing user:", error)
      // Don't set user to null here, as it might be a temporary error
    }
  }

  // Compute isAuthenticated
  const isAuthenticated = !!user

  // Log authentication state changes
  useEffect(() => {
    console.log("Authentication state changed:", isAuthenticated ? "Authenticated" : "Not authenticated")
  }, [isAuthenticated])

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
