"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { usePlayer } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

export function PersistentSpotifyPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, stopPlayback, setCurrentTrack } = usePlayer()
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false)

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

  // Fetch track info and preview URL when currentTrack changes
  useEffect(() => {
    if (!currentTrack) {
      setPreviewUrl(null)
      setError(null)
      return
    }

    const fetchTrackInfo = async () => {
      setIsLoading(true)
      setError(null)

      const trackId = extractTrackId(currentTrack.spotifyUrl)

      if (!trackId) {
        setError("Invalid Spotify URL")
        setIsLoading(false)
        return
      }

      try {
        // In a real implementation, you would call your backend API that uses Spotify API
        // For this demo, we'll simulate a successful response with mock data
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call

        // Mock preview URL - in a real app, this would come from the Spotify API
        const mockPreviewUrl = "https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1"
        setPreviewUrl(mockPreviewUrl)
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
  }, [currentTrack])

  // Initialize audio element when preview URL is available
  useEffect(() => {
    if (!previewUrl) return

    const audio = new Audio(previewUrl)
    audioRef.current = audio
    audio.volume = volume

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("ended", () => {
      stopPlayback()
      setCurrentTime(0)
    })

    audio.addEventListener("error", () => {
      setError("Error playing audio preview")
      stopPlayback()
    })

    return () => {
      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [previewUrl, stopPlayback])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !previewUrl) return

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        setError("Failed to play audio")
        stopPlayback()
      })

      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }, 100)
    } else {
      audioRef.current.pause()
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, previewUrl, stopPlayback])

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return

    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
      audioRef.current.muted = false
    } else {
      audioRef.current.muted = true
    }

    setIsMuted(!isMuted)
  }

  // Close player
  const handleClose = () => {
    stopPlayback()
    setCurrentTrack(null)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // If no track is selected, don't render the player
  if (!currentTrack) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 z-50",
        isExpanded ? "h-20" : "h-12",
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        {/* Toggle expand/collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full border border-gray-200 w-6 h-6 flex items-center justify-center"
          aria-label={isExpanded ? "Collapse player" : "Expand player"}
        >
          <div className="w-3 h-0.5 bg-gray-400 rounded-full" />
        </button>

        {/* Track info */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 mr-3">
            <img
              src={currentTrack.artwork || "/placeholder.svg"}
              alt={`${currentTrack.trackName} by ${currentTrack.artistName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium truncate">{currentTrack.trackName}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artistName}</p>
          </div>
        </div>

        {/* Player controls */}
        <div className={cn("flex items-center gap-4 transition-opacity", isExpanded ? "opacity-100" : "opacity-0")}>
          {/* Play/Pause button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full",
              isPlaying ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-gray-100",
            )}
            onClick={togglePlayPause}
            disabled={isLoading || !!error}
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-primary animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2 w-64">
            <span className="text-xs text-muted-foreground w-8 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
              disabled={isLoading || !!error}
            />
            <span className="text-xs text-muted-foreground w-8">{formatTime(duration)}</span>
          </div>

          {/* Volume control */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={toggleMute}
              onMouseEnter={() => setIsVolumeControlVisible(true)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>

            {/* Volume slider (appears on hover) */}
            <div
              className={cn(
                "absolute bottom-full mb-2 bg-white border border-gray-200 rounded-md p-2 shadow-md transition-all",
                isVolumeControlVisible ? "opacity-100 visible" : "opacity-0 invisible",
              )}
              onMouseEnter={() => setIsVolumeControlVisible(true)}
              onMouseLeave={() => setIsVolumeControlVisible(false)}
            >
              <Slider
                orientation="vertical"
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="h-24"
              />
            </div>
          </div>

          {/* External link to Spotify */}
          <a
            href={currentTrack.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
            title="Open in Spotify"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Open in Spotify</span>
          </a>

          {/* Close button */}
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close player</span>
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-0 left-0 right-0 transform -translate-y-full bg-destructive text-destructive-foreground p-2 text-xs text-center">
          {error}
        </div>
      )}
    </div>
  )
}
