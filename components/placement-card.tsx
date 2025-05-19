"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Clock, Music, X } from "lucide-react"
import { ConfirmPlacementModal } from "./confirm-placement-modal"

interface PlacementCardProps {
  id: number
  artwork: string
  trackName: string
  artistName: string
  playlistName: string
  status: "accepted" | "placed" | "closed" | "pending" | "ended"
  placedAt?: string
  removedAt?: string
  daysRemaining?: number
  onConfirmPlacement?: (id: number) => void
  onRemoveFromPlaylist?: (id: number) => void
  placementDate?: string
  endDate?: string
}

export function PlacementCard({
  id,
  artwork,
  trackName,
  artistName,
  playlistName,
  status,
  placedAt,
  removedAt,
  daysRemaining = 30,
  onConfirmPlacement,
  onRemoveFromPlaylist,
  placementDate,
  endDate,
}: PlacementCardProps) {
  const [remainingDays, setRemainingDays] = useState(daysRemaining)
  const [remainingHours, setRemainingHours] = useState(0)
  const [confirmPlacementOpen, setConfirmPlacementOpen] = useState(false)
  const [confirmRemovalOpen, setConfirmRemovalOpen] = useState(false)

  // Calculate remaining time for placed placements
  useEffect(() => {
    if (status !== "placed" || !placedAt) return

    const calculateTimeRemaining = () => {
      const placementDateTime = new Date(placedAt)
      const endDateTime = new Date(placementDateTime)
      endDateTime.setDate(endDateTime.getDate() + 30)

      const now = new Date()
      const diffTime = endDateTime.getTime() - now.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      setRemainingDays(diffDays)
      setRemainingHours(diffHours)
    }

    calculateTimeRemaining()
    const timer = setInterval(calculateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [status, placedAt])

  // Handle confirm placement
  const handleConfirmPlacement = () => {
    setConfirmPlacementOpen(true)
  }

  // Handle remove from playlist
  const handleRemoveFromPlaylist = () => {
    setConfirmRemovalOpen(true)
  }

  return (
    <div className="relative flex flex-col sm:flex-row border rounded-lg bg-white glow-card animate-fade-in p-4 gap-4">
      {/* Status pill in the upper right corner */}
      <div className="absolute top-3 right-3">
        <Badge
          variant={
            status === "accepted"
              ? "outline"
              : status === "placed"
                ? "secondary"
                : status === "closed"
                  ? "outline"
                  : "outline"
          }
          className={`
            px-3 py-1 text-xs font-medium rounded-full
            ${status === "placed" ? "bg-secondary/70 text-primary" : ""}
            ${status === "closed" ? "bg-muted text-muted-foreground" : ""}
            ${status === "accepted" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
            ${status === "pending" ? "bg-muted text-muted-foreground" : ""}
            ${status === "ended" ? "bg-muted text-muted-foreground" : ""}
          `}
        >
          {status === "placed"
            ? "Placed"
            : status === "closed"
              ? "Closed"
              : status === "accepted"
                ? "Accepted"
                : status === "pending"
                  ? "Pending"
                  : "Ended"}
        </Badge>
      </div>

      {/* Track info with artwork */}
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
        <img
          src={artwork || "/placeholder.svg"}
          alt={`${trackName} by ${artistName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Track details */}
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <h3 className="text-sm font-medium truncate pr-20">{trackName}</h3>
          <p className="text-xs text-muted-foreground truncate">{artistName}</p>
          {placedAt && status === "placed" && (
            <p className="text-xs text-muted-foreground mt-1">Placed on: {new Date(placedAt).toLocaleDateString()}</p>
          )}
          {removedAt && status === "closed" && (
            <p className="text-xs text-muted-foreground mt-1">Removed on: {new Date(removedAt).toLocaleDateString()}</p>
          )}
          {placementDate && status !== "placed" && status !== "closed" && (
            <p className="text-xs text-muted-foreground mt-1">
              {status === "placed" ? "Placed on: " : "Ended on: "}
              {status === "placed" ? placementDate : endDate}
            </p>
          )}
        </div>

        {/* Playlist information */}
        <div className="flex items-center gap-2 mb-3">
          <Music className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium">{playlistName}</span>
        </div>

        {/* Countdown for placed status */}
        {status === "placed" && (
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-secondary/20 text-primary border-secondary">
                {remainingDays}d {remainingHours}h remaining
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons based on status */}
      <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 min-w-[180px]">
        {status === "accepted" && (
          <Button
            onClick={handleConfirmPlacement}
            className="h-9 bg-primary hover:bg-primary/90 flex items-center gap-1 glow-button"
          >
            <Check className="h-4 w-4" />
            Confirm Placement
          </Button>
        )}

        {status === "placed" && (
          <Button
            onClick={handleRemoveFromPlaylist}
            variant="outline"
            className="h-9 border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Remove from Playlist
          </Button>
        )}

        {status === "closed" && (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-muted-foreground">Removed from playlist on:</span>
            <span className="text-sm font-medium">{removedAt ? new Date(removedAt).toLocaleDateString() : "N/A"}</span>
          </div>
        )}

        {status === "pending" && (
          <Button
            onClick={() => onConfirmPlacement?.(id)}
            className="h-9 bg-primary hover:bg-primary/90 flex items-center gap-1 glow-button"
          >
            <Check className="h-4 w-4" />
            Confirm Placement
          </Button>
        )}

        {status === "ended" && (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-muted-foreground">Placement ended on:</span>
            <span className="text-sm font-medium">{endDate}</span>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmPlacementModal
        open={confirmPlacementOpen}
        onOpenChange={setConfirmPlacementOpen}
        title="Confirm Track Placement"
        description="Only confirm if the track is placed in the playlist. Confirmation of placement before placement is a violation of terms."
        confirmText="Confirm Placement"
        onConfirm={async () => {
          if (onConfirmPlacement) {
            await onConfirmPlacement(id)
          }
        }}
      />

      <ConfirmPlacementModal
        open={confirmRemovalOpen}
        onOpenChange={setConfirmRemovalOpen}
        title="Confirm Track Removal"
        description="Make sure that you first confirm removal, then remove from the Spotify playlist. Removal prior to confirmation violates Terms."
        confirmText="Confirm Removal"
        variant="destructive"
        onConfirm={async () => {
          if (onRemoveFromPlaylist) {
            await onRemoveFromPlaylist(id)
          }
        }}
      />
    </div>
  )
}
