"use client"

import { useState, useEffect } from "react"
import { Loader2, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface Playlist {
  id: number
  playlistName: string
  status: string
}

interface AcceptPitchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackName: string
  artistName: string
  playlistName: string
  onAccept: () => void
  pitchId: number
  campaignsId: number
}

export function AcceptPitchModal({
  open,
  onOpenChange,
  trackName,
  artistName,
  playlistName,
  onAccept,
  pitchId,
  campaignsId,
}: AcceptPitchModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch playlists when modal opens
  useEffect(() => {
    if (open && user) {
      fetchPlaylists()
    }
  }, [open, user])

  // Filter playlists based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPlaylists(playlists)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredPlaylists(playlists.filter((playlist) => playlist.playlistName.toLowerCase().includes(query)))
    }
  }, [searchQuery, playlists])

  const fetchPlaylists = async () => {
    setIsLoading(true)
    try {
      // Fetch playlists
      const playlistsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`)
      const playlistsData = await playlistsResponse.json()

      // Filter playlists by curator ID AND verified status
      const curatorPlaylists = Array.isArray(playlistsData)
        ? playlistsData.filter(
            (playlist: any) => playlist.curators_id === Number(user?.id) && playlist.status === "verified",
          )
        : []

      setPlaylists(curatorPlaylists)
      setFilteredPlaylists(curatorPlaylists)

      if (curatorPlaylists.length === 0) {
        toast({
          title: "No Verified Playlists Found",
          description: "You don't have any verified playlists available. Please verify your playlists first.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching playlists:", error)
      toast({
        title: "Error",
        description: "Failed to load playlists. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate that at least one playlist is selected
    if (selectedPlaylists.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one playlist.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Updating pitch with selected playlists:", selectedPlaylists)

      // Update the pitch status and playlists_id in the database
      // This will REPLACE any existing playlists_id with only the selected ones
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${pitchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
          playlists_id: selectedPlaylists, // This will replace any existing playlist IDs
          campaigns_id: campaignsId,
        }),
      })

      // Get the response text for better error logging
      const responseText = await response.text()

      if (!response.ok) {
        console.error("API Error Response:", responseText)
        throw new Error(`Failed to update pitch status: ${response.status} ${response.statusText}`)
      }

      console.log("Pitch updated successfully, now creating placements for each selected playlist")

      // Create placements for each selected playlist
      const placementPromises = selectedPlaylists.map(async (playlistId) => {
        try {
          console.log(`Creating placement for playlist ID: ${playlistId}`)

          const placementResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pitches_id: pitchId,
              playlists_id: playlistId,
              status: "pending",
              createdAt: new Date().toISOString(),
              campaigns_id: campaignsId, // Include the campaign ID
            }),
          })

          if (!placementResponse.ok) {
            const placementErrorText = await placementResponse.text()
            console.error(`Placement API Error for playlist ${playlistId}:`, placementErrorText)
            throw new Error(`Failed to create placement: ${placementResponse.status} ${placementResponse.statusText}`)
          }

          const placementData = await placementResponse.json()
          console.log(`Placement created successfully for playlist ID ${playlistId}:`, placementData)
          return placementData
        } catch (placementError) {
          console.error(`Error creating placement for playlist ${playlistId}:`, placementError)
          // Continue with other placements even if one fails
          return null
        }
      })

      // Wait for all placement requests to complete
      const placementResults = await Promise.all(placementPromises)
      const successfulPlacements = placementResults.filter(Boolean).length

      console.log(
        `Successfully created ${successfulPlacements} placements out of ${selectedPlaylists.length} selected playlists`,
      )

      // Call onAccept even if some placements failed
      onAccept()

      toast({
        title: "Success",
        description: `Track accepted and added to ${successfulPlacements} playlist(s).`,
      })
    } catch (error) {
      console.error("Error accepting pitch:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept pitch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      onOpenChange(false)
    }
  }

  // Toggle playlist selection
  const togglePlaylist = (playlistId: number) => {
    setSelectedPlaylists((current) => {
      if (current.includes(playlistId)) {
        return current.filter((id) => id !== playlistId)
      } else {
        return [...current, playlistId]
      }
    })
  }

  // Get playlist names for display
  const getSelectedPlaylistNames = () => {
    return selectedPlaylists.map((id) => playlists.find((p) => p.id === id)?.playlistName || "").filter(Boolean)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Accept Pitch</DialogTitle>
          <DialogDescription>
            You are accepting &quot;{trackName}&quot; by {artistName}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="playlists" className="text-sm font-medium">
              Select where you will place the track <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">Only verified playlists are available for selection.</p>

            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading playlists...
                    </span>
                  ) : selectedPlaylists.length > 0 ? (
                    <span className="flex items-center">{selectedPlaylists.length} playlist(s) selected</span>
                  ) : (
                    "Select playlists..."
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-0" align="start">
                <div className="p-2">
                  <Input
                    placeholder="Search playlists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <ScrollArea className="h-60 border-t">
                  {filteredPlaylists.length === 0 ? (
                    <div className="py-6 text-center text-sm">
                      <p>No verified playlists found.</p>
                      <p className="text-muted-foreground mt-2">
                        Please verify your playlists before accepting pitches.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredPlaylists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                          onClick={() => togglePlaylist(playlist.id)}
                        >
                          <Checkbox
                            id={`playlist-${playlist.id}`}
                            checked={selectedPlaylists.includes(playlist.id)}
                            onCheckedChange={() => togglePlaylist(playlist.id)}
                          />
                          <label
                            htmlFor={`playlist-${playlist.id}`}
                            className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                          >
                            <span>{playlist.playlistName}</span>
                            <Badge
                              variant="outline"
                              className="ml-2 text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              verified
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedPlaylists.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {getSelectedPlaylistNames().map((name, index) => (
                <Badge key={index} variant="secondary">
                  {name}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            By accepting this pitch, you agree to add this track to the selected playlist(s). The artist will be
            notified of your decision.
          </p>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept Pitch"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
