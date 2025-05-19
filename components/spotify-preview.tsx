"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface SpotifyPreviewProps {
  spotifyUrl: string
  className?: string
}

export function SpotifyPreview({ spotifyUrl, className }: SpotifyPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [trackInfo, setTrackInfo] = useState<{
    name: string
    artist: string
    albumArt: string
  } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Extract track ID from Spotify URL
  const extractTrackId = (url: string): string | null => {
    try {
      const regex = /track\/([a-zA-Z0-9]+)/
      const match = url.match(regex)
      return match ? match[1] : null
    } catch (error) {
      return null
    }
  }

  // Fetch track info and preview URL
  useEffect(() => {
    const fetchTrackInfo = async () => {
      setIsLoading(true)
      setError(null)

      const trackId = extractTrackId(spotifyUrl)

      if (!trackId) {
        setError("Invalid Spotify URL")
        setIsLoading(false)
        return
      }

      try {
        // In a real implementation, you would call your backend API that uses Spotify API
        // For this demo, we'll simulate a successful response with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        // Mock data based on track ID
        const mockTrackInfo = {
          name: "Sample Track",
          artist: "Sample Artist",
          albumArt: "/electronic-music-artwork.png", // Use existing image
          previewUrl: "https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1", // Sample preview URL
        }

        setTrackInfo({
          name: mockTrackInfo.name,
          artist: mockTrackInfo.artist,
          albumArt: mockTrackInfo.albumArt,
        })

        setPreviewUrl(mockTrackInfo.previewUrl)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load track information")
        setIsLoading(false)
      }
    }

    fetchTrackInfo()

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [spotifyUrl])

  // Initialize audio element when preview URL is available
  useEffect(() => {
    if (!previewUrl) return

    const audio = new Audio(previewUrl)
    audioRef.current = audio

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    audio.addEventListener("error", () => {
      setError("Error playing audio preview")
      setIsPlaying(false)
    })

    return () => {
      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [previewUrl])

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !previewUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    } else {
      audioRef.current.play().catch((err) => {
        setError("Failed to play audio")
      })

      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }, 100)
    }

    setIsPlaying(!isPlaying)
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return

    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {isLoading ? (
        <div className="flex items-center justify-center h-12 bg-muted/30 rounded-md animate-pulse">
          <span className="text-xs text-muted-foreground">Loading preview...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-12 bg-destructive/10 text-destructive rounded-md">
          <span className="text-xs">{error}</span>
        </div>
      ) : !previewUrl ? (
        <div className="flex items-center justify-center h-12 bg-muted/30 rounded-md">
          <span className="text-xs text-muted-foreground">No preview available</span>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 p-2 bg-secondary/10 rounded-md">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Slider value={[currentTime]} max={duration} step={0.1} onValueChange={handleSeek} className="flex-1" />
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
