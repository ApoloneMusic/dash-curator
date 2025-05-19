"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Track {
  id: string
  spotifyUrl: string
  trackName: string
  artistName: string
  artwork: string
}

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  setCurrentTrack: (track: Track | null) => void
  playTrack: (track: Track) => void
  togglePlayPause: () => void
  stopPlayback: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Play a specific track
  const playTrack = (track: Track) => {
    // If it's the same track, just toggle play/pause
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      // Otherwise, set the new track and start playing
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  // Toggle play/pause for current track
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  // Stop playback
  const stopPlayback = () => {
    setIsPlaying(false)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        setCurrentTrack,
        playTrack,
        togglePlayPause,
        stopPlayback,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
