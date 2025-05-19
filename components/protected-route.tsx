"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { debugAuth } from "@/lib/auth-debug"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)

    // Debug auth on protected routes
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
      debugAuth()
    }
  }, [])

  // Enhanced redirection logic
  useEffect(() => {
    // Only run this effect on the client and after loading is complete
    if (!isClient || isLoading) return

    console.log("Protected route check:", {
      isAuthenticated,
      isLoading,
      pathname,
      hasUser: !!user,
    })

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login")

      // Check if already on the login page to prevent redirection loop
      if (pathname.includes("/auth/login")) {
        console.log("Already on login page, not redirecting")
        return
      }

      // Simplified redirection approach
      try {
        // First try the router for a cleaner navigation experience
        router.push("/auth/login")

        // Add a fallback with direct navigation after a short delay
        // This ensures we redirect even if the router method fails silently
        setTimeout(() => {
          if (pathname !== "/auth/login") {
            window.location.href = "/auth/login"
          }
        }, 500)
      } catch (error) {
        console.error("Router redirection error:", error)
        // Immediate fallback to direct navigation
        window.location.href = "/auth/login"
      }
    }
  }, [isAuthenticated, isLoading, router, isClient, pathname, user])

  // Show loading state
  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // This should not be visible due to the redirection in the useEffect
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    </div>
  )
}
