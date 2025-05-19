"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface VerificationBannerProps {
  className?: string
}

export function VerificationBanner({ className }: VerificationBannerProps) {
  const { user } = useAuth()
  const [isUnverified, setIsUnverified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if the banner was previously dismissed in this session
    const dismissed = sessionStorage.getItem("verification_banner_dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
    }

    // Only fetch if we have a user and the banner hasn't been dismissed
    if (user && !isDismissed) {
      fetchCuratorStatus()
    } else {
      setIsLoading(false)
    }
  }, [user, isDismissed])

  const fetchCuratorStatus = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user.id}`)

      if (response.ok) {
        const curatorData = await response.json()
        setIsUnverified(curatorData.status === "unverified")
      } else {
        console.error("Failed to fetch curator status:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching curator status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Store dismissal in session storage
    sessionStorage.setItem("verification_banner_dismissed", "true")
  }

  // Don't render anything if loading, dismissed, or curator is verified
  if (isLoading || isDismissed || !isUnverified) {
    return null
  }

  return (
    <div className={`bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-amber-800">Verification in Progress</h3>
              <div className="mt-1 text-sm text-amber-700">
                <p>
                  Your curator account is currently undergoing verification. To speed up this process, please add your
                  Spotify playlists to your profile.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-3 -mt-1 -mr-1 flex-shrink-0 rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3">
            <Button asChild variant="outline" className="bg-white hover:bg-amber-50 border-amber-300 text-amber-700">
              <Link href="/dashboard/playlists" className="flex items-center gap-1.5">
                Add your playlists
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
