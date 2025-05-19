"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpotifyEmbedProps {
  spotifyUrl: string
  className?: string
  height?: number
}

export function SpotifyEmbed({ spotifyUrl, className, height = 80 }: SpotifyEmbedProps) {
  const [trackId, setTrackId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract track ID from Spotify URL
  useEffect(() => {
    try {
      const regex = /track\/([a-zA-Z0-9]+)/
      const match = spotifyUrl.match(regex)

      if (match && match[1]) {
        setTrackId(match[1])
        setError(null)
      } else {
        setTrackId(null)
        setError("Invalid Spotify URL format")
      }
    } catch (err) {
      setTrackId(null)
      setError("Error processing Spotify URL")
    }

    setIsLoading(false)
  }, [spotifyUrl])

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false)
    setError("Failed to load Spotify embed")
  }

  if (error) {
    return (
      <div
        className={cn("flex items-center justify-center h-16 bg-destructive/10 text-destructive rounded-md", className)}
      >
        <p className="text-xs">{error}</p>
      </div>
    )
  }

  if (!trackId) {
    return (
      <div className={cn("flex items-center justify-center h-16 bg-muted/30 rounded-md", className)}>
        <p className="text-xs text-muted-foreground">No valid Spotify track ID found</p>
      </div>
    )
  }

  return (
    <div className={cn("relative rounded-md overflow-hidden spotify-embed-container", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        className="border-0"
      />
    </div>
  )
}
