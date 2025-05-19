"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Check, ChevronDown, ChevronUp, Clock, Music, X, Calendar } from "lucide-react"
import { ConfirmPlacementModal } from "./confirm-placement-modal"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface PlacementInfo {
  id: number
  status: "accepted" | "placed" | "closed" | "pending" | "ended"
  playlistName: string
  playlistId: number
  placedAt?: string
  removedAt?: string
  daysRemaining?: number
}

interface CampaignCardProps {
  id: number
  campaignName: string
  artistName: string
  trackName: string
  artwork: string
  placements: PlacementInfo[]
  onConfirmPlacement: (id: number) => Promise<void>
  onRemoveFromPlaylist: (id: number) => Promise<void>
}

export function CampaignCard({
  id,
  campaignName,
  artistName,
  trackName,
  artwork,
  placements,
  onConfirmPlacement,
  onRemoveFromPlaylist,
}: CampaignCardProps) {
  const [isOpen, setIsOpen] = useState(true) // Default to open
  const [confirmPlacementOpen, setConfirmPlacementOpen] = useState(false)
  const [confirmRemovalOpen, setConfirmRemovalOpen] = useState(false)
  const [selectedPlacementId, setSelectedPlacementId] = useState<number | null>(null)

  // Count placements by status
  const statusCounts = placements.reduce(
    (acc, placement) => {
      acc[placement.status] = (acc[placement.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Determine the overall campaign status
  const getOverallStatus = () => {
    if (statusCounts.placed && statusCounts.placed > 0) return "placed"
    if (statusCounts.accepted && statusCounts.accepted > 0) return "accepted"
    if (statusCounts.closed && statusCounts.closed > 0) return "closed"
    return "pending"
  }

  const overallStatus = getOverallStatus()

  // Calculate remaining days for placed placements
  const getRemainingDays = (placedAt?: string) => {
    if (!placedAt) return { days: 0, hours: 0 }

    const placementDateTime = new Date(placedAt)
    const endDateTime = new Date(placementDateTime)
    endDateTime.setDate(endDateTime.getDate() + 30)

    const now = new Date()
    const diffTime = endDateTime.getTime() - now.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return { days: Math.max(0, diffDays), hours: Math.max(0, diffHours) }
  }

  // Check if any placement can be confirmed
  const hasConfirmablePlacements = placements.some((p) => p.status === "accepted")

  // Check if any placement can be removed
  const hasRemovablePlacements = placements.some((p) => p.status === "placed")

  // Handle confirm placement for the campaign
  const handleConfirmPlacement = () => {
    // Find the first accepted placement
    const acceptedPlacement = placements.find((p) => p.status === "accepted")
    if (acceptedPlacement) {
      setSelectedPlacementId(acceptedPlacement.id)
      setConfirmPlacementOpen(true)
    }
  }

  // Handle remove from playlist for the campaign
  const handleRemoveFromPlaylist = () => {
    // Find the first placed placement
    const placedPlacement = placements.find((p) => p.status === "placed")
    if (placedPlacement) {
      setSelectedPlacementId(placedPlacement.id)
      setConfirmRemovalOpen(true)
    }
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full animate-fade-in overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CardHeader className="pb-2 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Track artwork */}
              <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                <img
                  src={artwork || "/placeholder.svg"}
                  alt={`${trackName} by ${artistName}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <CardTitle className="text-lg">{trackName}</CardTitle>
                <CardDescription className="text-sm">{artistName}</CardDescription>
                <div className="mt-1 text-xs text-muted-foreground">
                  Campaign #{id} • {placements.length} {placements.length === 1 ? "playlist" : "playlists"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <Badge
                variant={
                  overallStatus === "accepted"
                    ? "outline"
                    : overallStatus === "placed"
                      ? "secondary"
                      : overallStatus === "closed"
                        ? "outline"
                        : "outline"
                }
                className={`
                  px-3 py-1 text-xs font-medium rounded-full
                  ${overallStatus === "placed" ? "bg-secondary/70 text-primary" : ""}
                  ${overallStatus === "closed" ? "bg-muted text-muted-foreground" : ""}
                  ${overallStatus === "accepted" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                  ${overallStatus === "pending" ? "bg-muted text-muted-foreground" : ""}
                `}
              >
                {overallStatus === "placed"
                  ? "Placed"
                  : overallStatus === "closed"
                    ? "Closed"
                    : overallStatus === "accepted"
                      ? "Accepted"
                      : "Pending"}
              </Badge>

              {/* Status summary badges */}
              <div className="flex flex-wrap gap-1 justify-end">
                {statusCounts.accepted && statusCounts.accepted > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {statusCounts.accepted} Accepted
                  </Badge>
                )}
                {statusCounts.placed && statusCounts.placed > 0 && (
                  <Badge variant="outline" className="bg-secondary/20 text-primary border-secondary text-xs">
                    {statusCounts.placed} Placed
                  </Badge>
                )}
                {statusCounts.closed && statusCounts.closed > 0 && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                    {statusCounts.closed} Closed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                {isOpen ? "Hide Details" : "Show Details"}
                {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Playlist Placements</h4>

              <div className="space-y-3">
                {placements.map((placement) => (
                  <div key={placement.id} className="border rounded-md overflow-hidden">
                    <div className="bg-muted/10 px-4 py-2 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{placement.playlistName}</span>
                      </div>
                      <Badge
                        variant={
                          placement.status === "accepted"
                            ? "outline"
                            : placement.status === "placed"
                              ? "secondary"
                              : "outline"
                        }
                        className={`
                          px-2 py-0.5 text-xs font-medium rounded-full
                          ${placement.status === "placed" ? "bg-secondary/70 text-primary" : ""}
                          ${placement.status === "closed" ? "bg-muted text-muted-foreground" : ""}
                          ${placement.status === "accepted" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        `}
                      >
                        {placement.status === "placed"
                          ? "Placed"
                          : placement.status === "closed"
                            ? "Closed"
                            : placement.status === "accepted"
                              ? "Accepted"
                              : "Pending"}
                      </Badge>
                    </div>

                    <div className="px-4 py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {placement.status === "placed" && placement.placedAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Placed on: {formatDate(placement.placedAt)}</span>
                          </div>
                        )}

                        {placement.status === "closed" && placement.removedAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Removed on: {formatDate(placement.removedAt)}</span>
                          </div>
                        )}

                        {placement.status === "placed" && placement.placedAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <Badge variant="outline" className="bg-secondary/20 text-primary border-secondary">
                              {getRemainingDays(placement.placedAt).days}d {getRemainingDays(placement.placedAt).hours}h
                              remaining
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
        <div className="text-sm text-muted-foreground">
          {hasConfirmablePlacements && "Ready to confirm placement"}
          {hasRemovablePlacements && !hasConfirmablePlacements && "Active placement"}
          {!hasConfirmablePlacements && !hasRemovablePlacements && "No active placements"}
        </div>

        <div className="flex gap-2">
          {hasConfirmablePlacements && (
            <Button onClick={handleConfirmPlacement} className="bg-primary hover:bg-primary/90 flex items-center gap-1">
              <Check className="h-4 w-4" />
              Confirm Placement
            </Button>
          )}

          {hasRemovablePlacements && (
            <Button
              onClick={handleRemoveFromPlaylist}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Remove from Playlist
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Confirmation Modals */}
      <ConfirmPlacementModal
        open={confirmPlacementOpen}
        onOpenChange={setConfirmPlacementOpen}
        title="Confirm Track Placement"
        description="Only confirm if the track is placed in the playlist. Confirmation of placement before placement is a violation of terms."
        confirmText="Confirm Placement"
        onConfirm={async () => {
          if (selectedPlacementId !== null) {
            await onConfirmPlacement(selectedPlacementId)
            setSelectedPlacementId(null)
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
          if (selectedPlacementId !== null) {
            await onRemoveFromPlaylist(selectedPlacementId)
            setSelectedPlacementId(null)
          }
        }}
      />
    </Card>
  )
}
