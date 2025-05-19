"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PitchCard } from "@/components/pitch-card"
import { StatusFilter } from "@/components/status-filter"
import { CreatePlaylistModal } from "@/components/create-playlist-modal"
import { EditPlaylistModal, type PlaylistData } from "@/components/edit-playlist-modal"
import Link from "next/link"
import { Check, Clock, ListMusic, Loader2, Music, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { DeclineFeedback } from "@/components/decline-pitch-modal"

// Update the status options to include "pitched" instead of "pending"
type StatusOption = "all" | "pitched" | "accepted" | "declined"
type PlacementStatusOption = "all" | "accepted" | "placed" | "closed" | "pending" | "ended"

// Define interfaces for our data
interface Genre {
  id: number
  name: string
}

interface Subgenre {
  id: number
  name: string
  genre_id: number
}

interface Campaign {
  id: number
  artists_id: number
  trackName: string
  artistName: string
  trackUrl: string
  genre_id: number
  subgenre_id: number[]
  created_at: string
}

interface Pitch {
  id: number
  campaigns_id: number
  curators_id: number
  playlists_id: number[] // Changed to array to support multiple playlists
  status: string
  matchScore: number
  submissionDate: string
  feedback?: string
}

interface Playlist {
  id: number
  curators_id: number
  playlistName: string
  playlistUrl: string
  description: string
  genres: number[]
  subgenres: number[]
  status: string
}

interface Placement {
  id: number
  pitches_id: number
  playlists_id: number
  status: string
  placedAt?: string
  removedAt?: string
  placementDate?: string
  endDate?: string
  daysRemaining?: number
  trackName?: string
  artistName?: string
  playlistName?: string
  artwork?: string
  campaigns_id?: number
}

// Enhanced pitch data for display
interface EnhancedPitch {
  id: number
  campaigns_id: number
  curators_id: number
  playlists_id: number[]
  status: string
  submissionDate: string
  trackName: string
  artistName: string
  trackUrl: string
  genre_id: number
  subgenre_ids: number[]
  associatedPlaylists: {
    id: number
    name: string
    genres: { name: string; isMatch?: boolean }[]
  }[]
  artwork?: string
}

// Campaign group for display
interface CampaignGroup {
  id: number
  trackName: string
  artistName: string
  artwork: string
  placements: {
    id: number
    status: string
    playlistName: string
    playlistId: number
    placedAt?: string
    removedAt?: string
    daysRemaining?: number
  }[]
}

export default function PitchesPage() {
  const [activeTab, setActiveTab] = useState("pitches")
  // Change default status filter to "pitched"
  const [statusFilter, setStatusFilter] = useState<StatusOption>("pitched")
  const [placementStatusFilter, setPlacementStatusFilter] = useState<PlacementStatusOption>("all")
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false)
  const [editPlaylistOpen, setEditPlaylistOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // State for data
  const [pitches, setPitches] = useState<EnhancedPitch[]>([])
  const [placements, setPlacements] = useState<Placement[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [subgenres, setSubgenres] = useState<Subgenre[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  // Sample artwork images for demonstration
  const artworkImages = [
    "/electronic-music-artwork.png",
    "/indie-rock-artwork.png",
    "/hip-hop-artwork.png",
    "/pop-music-artwork.png",
  ]

  // Fetch data on component mount
  useEffect(() => {
    if (!user) return

    fetchData()
  }, [user])

  // Fetch all necessary data
  const fetchData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Fetch all data in parallel for efficiency
      const [
        pitchesResponse,
        campaignsResponse,
        placementsResponse,
        playlistsResponse,
        genresResponse,
        subgenresResponse,
      ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/genre`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subgenre`),
      ])

      // Parse JSON responses and ensure they're arrays
      const pitchesData = await pitchesResponse.json()
      const campaignsData = await campaignsResponse.json()
      const placementsData = await placementsResponse.json()
      const playlistsData = await playlistsResponse.json()
      const genresData = await genresResponse.json()
      const subgenresData = await subgenresResponse.json()

      console.log("Raw API responses:", {
        pitches: pitchesData,
        campaigns: campaignsData,
        placements: placementsData,
        playlists: playlistsData,
        genres: genresData,
        subgenres: subgenresData,
      })

      // Ensure all data is in array format
      const pitchesArray = Array.isArray(pitchesData) ? pitchesData : pitchesData.data || []
      const campaignsArray = Array.isArray(campaignsData) ? campaignsData : campaignsData.data || []
      const placementsArray = Array.isArray(placementsData) ? placementsData : placementsData.data || []
      const playlistsArray = Array.isArray(playlistsData) ? playlistsData : playlistsData.data || []
      const genresArray = Array.isArray(genresData) ? genresData : genresData.data || []
      const subgenresArray = Array.isArray(subgenresData) ? subgenresData : subgenresData.data || []

      // Store campaigns for later use
      setCampaigns(campaignsArray)

      // Filter pitches by curator ID
      const curatorId = Number(user.id)
      const curatorPitches = pitchesArray.filter((pitch: Pitch) => pitch.curators_id === curatorId)

      // Enhance pitches with campaign and playlist data
      const enhancedPitches = curatorPitches.map((pitch: Pitch) => {
        // Get associated campaign
        const campaign = campaignsArray.find((c: Campaign) => c.id === pitch.campaigns_id) || {
          trackName: "Unknown Track",
          artistName: "Unknown Artist",
          trackUrl: "",
          genre_id: 0,
          subgenre_id: [],
        }

        // Ensure playlists_id is an array
        const playlistIds = Array.isArray(pitch.playlists_id)
          ? pitch.playlists_id
          : pitch.playlists_id
            ? [pitch.playlists_id]
            : []

        // Get associated playlists
        const associatedPlaylists = playlistIds
          .map((playlistId) => {
            const playlist = playlistsArray.find((p: Playlist) => p.id === playlistId)

            if (!playlist) return null

            // Map playlist genres to objects with names
            const playlistGenres = (playlist.genres || []).map((genreId) => {
              const genre = genresArray.find((g) => g.id === genreId)
              return {
                name: genre ? genre.name : `Genre ${genreId}`,
                isMatch: campaign.genre_id === genreId,
              }
            })

            return {
              id: playlist.id,
              name: playlist.playlistName,
              genres: playlistGenres.length > 0 ? playlistGenres : [{ name: "No genres", isMatch: false }],
            }
          })
          .filter(Boolean) // Remove null entries

        // Ensure subgenre_id is an array and filter out any null/undefined values
        const subgenreIds = Array.isArray(campaign.subgenre_id)
          ? campaign.subgenre_id.filter(Boolean)
          : campaign.subgenre_id
            ? [campaign.subgenre_id]
            : []

        return {
          id: pitch.id,
          campaigns_id: pitch.campaigns_id,
          curators_id: pitch.curators_id,
          playlists_id: playlistIds,
          status: pitch.status === "pending" ? "pitched" : pitch.status,
          submissionDate: pitch.submissionDate || new Date().toISOString(),
          trackName: campaign.trackName,
          artistName: campaign.artistName,
          trackUrl: campaign.trackUrl,
          genre_id: campaign.genre_id,
          subgenre_ids: subgenreIds,
          associatedPlaylists: associatedPlaylists,
          // Assign a random artwork for demo purposes
          artwork: artworkImages[pitch.id % artworkImages.length],
        }
      })

      // Create placements from accepted and placed pitches if no placements exist
      let enhancedPlacements = []

      // First, check if we have any placements in the API response
      if (placementsArray.length === 0) {
        console.log("No placements found in API, creating from accepted/placed pitches")

        // Create placements from accepted and placed pitches
        enhancedPlacements = enhancedPitches
          .filter((pitch) => pitch.status === "accepted" || pitch.status === "placed")
          .flatMap((pitch) => {
            return pitch.playlists_id.map((playlistId) => {
              const playlist = playlistsArray.find((p) => p.id === playlistId)
              return {
                id: Math.floor(Math.random() * 10000) + 1, // Generate a random ID for demo
                pitches_id: pitch.id,
                playlists_id: playlistId,
                status: pitch.status,
                placedAt: pitch.status === "placed" ? new Date().toISOString() : undefined,
                trackName: pitch.trackName,
                artistName: pitch.artistName,
                playlistName: playlist ? playlist.playlistName : "Unknown Playlist",
                artwork: pitch.artwork,
                daysRemaining: pitch.status === "placed" ? 30 : undefined,
                campaigns_id: pitch.campaigns_id, // Add campaigns_id to the placement
              }
            })
          })
      } else {
        // Process existing placements from API
        enhancedPlacements = placementsArray
          .filter((placement: Placement) => {
            // Find the associated pitch
            const pitch = pitchesArray.find((p: Pitch) => p.id === placement.pitches_id)
            // Check if the pitch belongs to this curator
            return pitch && pitch.curators_id === curatorId
          })
          .map((placement: Placement) => {
            const pitch = pitchesArray.find((p: Pitch) => p.id === placement.pitches_id)
            const campaign = pitch ? campaignsArray.find((c: Campaign) => c.id === pitch.campaigns_id) : null
            const playlist = playlistsArray.find((p: Playlist) => p.id === placement.playlists_id)

            // Calculate days remaining for placed pitches
            let daysRemaining = 30
            if (placement.status === "placed" && placement.placedAt) {
              const placedDate = new Date(placement.placedAt)
              const endDate = new Date(placedDate)
              endDate.setDate(endDate.getDate() + 30)
              const now = new Date()
              const diffTime = endDate.getTime() - now.getTime()
              daysRemaining = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
            }

            return {
              ...placement,
              trackName: campaign ? campaign.trackName : "Unknown Track",
              artistName: campaign ? campaign.artistName : "Unknown Artist",
              playlistName: playlist ? playlist.playlistName : "Unknown Playlist",
              // Assign a random artwork for demo purposes
              artwork: campaign ? artworkImages[pitch.id % artworkImages.length] : "/placeholder.svg",
              daysRemaining,
              campaigns_id: pitch ? pitch.campaigns_id : undefined, // Add campaigns_id to the placement
            }
          })
      }

      // Always create demo placements for testing
      console.log("Creating demo placements for testing")

      // Create demo placements with different statuses
      const demoPlacements = []

      // Get unique campaign IDs from pitches or create some if none exist
      const uniqueCampaignIds = [...new Set(enhancedPitches.map((pitch) => pitch.campaigns_id))]
      const demoStatuses = ["accepted", "placed", "closed"]

      // If we have campaigns, create placements for them
      if (uniqueCampaignIds.length > 0) {
        // For each campaign, create multiple placements with different statuses
        for (let i = 0; i < Math.min(uniqueCampaignIds.length, 3); i++) {
          const campaignId = uniqueCampaignIds[i]
          const pitch = enhancedPitches.find((p) => p.campaigns_id === campaignId)

          if (!pitch) continue

          // Create placements with different statuses for this campaign
          for (let j = 0; j < demoStatuses.length; j++) {
            const status = demoStatuses[j]
            const playlistId =
              pitch.playlists_id[j % Math.max(1, pitch.playlists_id.length)] ||
              playlistsArray[j % Math.max(1, playlistsArray.length)]?.id ||
              j + 1

            const playlist = playlistsArray.find((p) => p.id === playlistId)

            demoPlacements.push({
              id: 3000 + i * 10 + j,
              pitches_id: pitch.id,
              playlists_id: playlistId,
              status: status,
              placedAt: status === "placed" ? new Date().toISOString() : undefined,
              removedAt: status === "closed" ? new Date().toISOString() : undefined,
              trackName: pitch.trackName,
              artistName: pitch.artistName,
              playlistName: playlist ? playlist.playlistName : `Demo Playlist ${j + 1}`,
              artwork: pitch.artwork,
              daysRemaining: status === "placed" ? 30 - j : undefined,
              campaigns_id: campaignId,
            })
          }
        }
      } else {
        // If no campaigns exist, create some demo ones
        for (let i = 0; i < 3; i++) {
          const campaignId = 1000 + i

          // Create placements with different statuses for this demo campaign
          for (let j = 0; j < demoStatuses.length; j++) {
            const status = demoStatuses[j]
            const playlistId = playlistsArray[j % Math.max(1, playlistsArray.length)]?.id || j + 1
            const playlist = playlistsArray.find((p) => p.id === playlistId)

            demoPlacements.push({
              id: 4000 + i * 10 + j,
              pitches_id: 5000 + i,
              playlists_id: playlistId,
              status: status,
              placedAt: status === "placed" ? new Date().toISOString() : undefined,
              removedAt: status === "closed" ? new Date().toISOString() : undefined,
              trackName: `Demo Track ${i + 1}`,
              artistName: `Demo Artist ${i + 1}`,
              playlistName: playlist ? playlist.playlistName : `Demo Playlist ${j + 1}`,
              artwork: artworkImages[i % artworkImages.length],
              daysRemaining: status === "placed" ? 30 - j : undefined,
              campaigns_id: campaignId,
            })
          }
        }
      }

      // Combine real and demo placements
      enhancedPlacements = [...enhancedPlacements, ...demoPlacements]

      console.log("Enhanced placements:", enhancedPlacements)

      // Store debug info for troubleshooting
      setDebugInfo({
        pitchesCount: enhancedPitches.length,
        placementsCount: enhancedPlacements.length,
        uniqueCampaignIds: [...new Set(enhancedPlacements.map((p) => p.campaigns_id))].filter(Boolean),
        placementStatuses: enhancedPlacements.map((p) => p.status),
        hasCampaignsId: enhancedPlacements.every((p) => p.campaigns_id !== undefined),
      })

      setPitches(enhancedPitches)
      setPlacements(enhancedPlacements)
      setPlaylists(playlistsArray)
      setGenres(genresArray)
      setSubgenres(subgenresArray)

      // Add this logging to debug genre and subgenre data
      console.log(
        "Genres loaded:",
        genresArray.map((g) => ({ id: g.id, name: g.name })),
      )
      console.log(
        "Subgenres loaded:",
        subgenresArray.map((s) => ({ id: s.id, name: s.name, genre_id: s.genre_id })),
      )
      console.log("Unique genre IDs in campaigns:", [...new Set(campaignsArray.map((c) => c.genre_id))])
      console.log("Unique subgenre IDs in campaigns:", [
        ...new Set(
          campaignsArray
            .flatMap((c) => (Array.isArray(c.subgenre_id) ? c.subgenre_id : [c.subgenre_id]))
            .filter(Boolean),
        ),
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Refresh data
  const refreshData = () => {
    setIsRefreshing(true)
    fetchData()
  }

  // Map genre IDs to genre objects with names and match status
  const mapGenresToObjects = (genreId: number, playlistGenreIds: number[] = []) => {
    if (!genreId) {
      console.log("No genre ID provided")
      return []
    }

    const genre = genres.find((g) => g.id === genreId)
    if (!genre) {
      console.log(
        `Genre with ID ${genreId} not found in genres array. Available IDs:`,
        genres.map((g) => g.id),
      )

      // Try to find a genre with a string ID that matches the number
      const genreWithStringId = genres.find((g) => String(g.id) === String(genreId))
      if (genreWithStringId) {
        return [
          {
            name: genreWithStringId.name,
            isMatch: playlistGenreIds.includes(Number(genreWithStringId.id)),
            id: genreId,
          },
        ]
      }

      return [{ name: `Unknown Genre (${genreId})`, isMatch: false, id: genreId }]
    }

    return [
      {
        name: genre.name,
        isMatch: playlistGenreIds.includes(genreId),
        id: genreId,
      },
    ]
  }

  // Map subgenre IDs to subgenre objects with names and match status
  const mapSubgenresToObjects = (subgenreIds: number[] = [], playlistSubgenreIds: number[] = []) => {
    if (!subgenreIds || !Array.isArray(subgenreIds) || subgenreIds.length === 0) {
      console.log("No valid subgenre IDs provided")
      return []
    }

    return subgenreIds.map((id) => {
      // First try direct ID match
      let subgenre = subgenres.find((s) => s.id === id)

      // If not found, try string comparison
      if (!subgenre) {
        subgenre = subgenres.find((s) => String(s.id) === String(id))
      }

      if (!subgenre) {
        console.log(
          `Subgenre with ID ${id} not found in subgenres array. Available IDs:`,
          subgenres.map((s) => s.id),
        )
        return {
          name: `Unknown Subgenre (${id})`,
          isMatch: false,
          id: id,
        }
      }

      return {
        name: subgenre.name,
        isMatch: playlistSubgenreIds.includes(id),
        id: id,
        genre_id: subgenre.genre_id,
      }
    })
  }

  // Transform pitch data for PitchCard component
  const transformedPitches = useMemo(() => {
    return pitches.map((pitch) => {
      console.log(`Processing pitch ${pitch.id} for campaign ${pitch.campaigns_id}`)
      console.log(`Genre ID: ${pitch.genre_id}, Subgenre IDs:`, pitch.subgenre_ids)

      // Get all playlist genre and subgenre IDs for matching
      const allPlaylistGenreIds = pitch.associatedPlaylists.flatMap((playlist) =>
        playlist.genres
          .map((genre) => {
            const foundGenre = genres.find((g) => g.name === genre.name)
            return foundGenre?.id
          })
          .filter(Boolean),
      )

      // Map genre and subgenre IDs to objects with names and match status
      const genreObjects = mapGenresToObjects(pitch.genre_id, allPlaylistGenreIds)
      const subgenreObjects = mapSubgenresToObjects(pitch.subgenre_ids, [])

      // For clarity, if no genres/subgenres, use clear placeholder data
      const finalGenres = genreObjects.length > 0 ? genreObjects : [{ name: "No Genre Information", isMatch: false }]

      const finalSubgenres =
        subgenreObjects.length > 0 ? subgenreObjects : [{ name: "No Subgenre Information", isMatch: false }]

      // Format submission date
      const formattedDate = new Date(pitch.submissionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      return {
        id: pitch.id,
        artwork: pitch.artwork || "/placeholder.svg",
        trackName: pitch.trackName,
        artistName: pitch.artistName,
        status: pitch.status as "pitched" | "accepted" | "declined",
        submissionDate: formattedDate,
        genres: finalGenres,
        subgenres: finalSubgenres,
        spotifyUrl: pitch.trackUrl || "https://open.spotify.com/track/17phhZDn6oGtzMe56NuWvj",
        associatedPlaylists: pitch.associatedPlaylists,
        campaignsId: pitch.campaigns_id,
      }
    })
  }, [pitches, genres, subgenres])

  // Filter pitches to only include those with status "pitched", "declined", or "accepted"
  const validPitches = useMemo(() => {
    return transformedPitches.filter(
      (pitch) => pitch.status === "pitched" || pitch.status === "declined" || pitch.status === "accepted",
    )
  }, [transformedPitches])

  // Filter and sort pitches based on status
  const filteredPitches = useMemo(() => {
    // First filter by status if not "all"
    const filtered =
      statusFilter === "all" ? validPitches : validPitches.filter((pitch) => pitch.status === statusFilter)

    // Then sort to prioritize pitched pitches
    return [...filtered].sort((a, b) => {
      // If we're not filtering, put pitched first
      if (statusFilter === "all") {
        if (a.status === "pitched" && b.status !== "pitched") return -1
        if (a.status !== "pitched" && b.status === "pitched") return 1
      }

      // Otherwise sort by submission date (newest first)
      return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    })
  }, [validPitches, statusFilter])

  // Group placements by campaign ID
  const campaignGroups = useMemo(() => {
    console.log("Grouping placements by campaign ID", placements)

    // Filter placements based on status filter
    const filteredPlacements =
      placementStatusFilter === "all" ? placements : placements.filter((p) => p.status === placementStatusFilter)

    console.log("Filtered placements:", filteredPlacements)

    // Group by campaign ID
    const groupedByCampaign = filteredPlacements.reduce(
      (acc, placement) => {
        // Skip placements without campaigns_id
        if (!placement.campaigns_id) {
          console.log("Skipping placement without campaigns_id:", placement)
          return acc
        }

        if (!acc[placement.campaigns_id]) {
          acc[placement.campaigns_id] = []
        }

        acc[placement.campaigns_id].push(placement)
        return acc
      },
      {} as Record<number, Placement[]>,
    )

    console.log("Grouped placements:", groupedByCampaign)

    // Transform into campaign groups
    const groups = Object.entries(groupedByCampaign)
      .map(([campaignId, campaignPlacements]) => {
        // Get campaign details
        const campaign = campaigns.find((c) => c.id === Number(campaignId))
        const firstPlacement = campaignPlacements[0]

        return {
          id: Number(campaignId),
          trackName: campaign?.trackName || firstPlacement.trackName || "Unknown Track",
          artistName: campaign?.artistName || firstPlacement.artistName || "Unknown Artist",
          artwork: firstPlacement.artwork || "/placeholder.svg",
          placements: campaignPlacements.map((p) => ({
            id: p.id,
            status: p.status,
            playlistName: p.playlistName || "Unknown Playlist",
            playlistId: p.playlists_id,
            placedAt: p.placedAt,
            removedAt: p.removedAt,
            daysRemaining: p.daysRemaining,
          })),
        }
      })
      .sort((a, b) => {
        // Sort by status priority: accepted first, then placed, then closed
        const getStatusPriority = (group: CampaignGroup) => {
          if (group.placements.some((p) => p.status === "accepted")) return 0
          if (group.placements.some((p) => p.status === "placed")) return 1
          return 2
        }

        return getStatusPriority(a) - getStatusPriority(b)
      })

    console.log("Campaign groups:", groups)
    return groups
  }, [placements, campaigns, placementStatusFilter])

  // Handle confirm placement
  const handleConfirmPlacement = async (id: number) => {
    try {
      console.log("Confirming placement for ID:", id)

      // Find the placement to get its details
      const placement = placements.find((p) => p.id === id)
      if (!placement) {
        throw new Error("Placement not found")
      }

      console.log("Found placement:", placement)

      // Update the pitch status in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${placement.pitches_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "placed",
          placedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error("Failed to update pitch status")
      }

      // Also update the placement status
      const placementResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "placed",
          placedAt: new Date().toISOString(),
        }),
      })

      if (!placementResponse.ok) {
        const errorText = await placementResponse.text()
        console.error("API error response for placement update:", errorText)
        throw new Error("Failed to update placement status")
      }

      // Update local state
      setPlacements((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "placed",
                placedAt: new Date().toISOString(),
                daysRemaining: 30,
              }
            : p,
        ),
      )

      // Update the pitch status in local state
      setPitches((prev) =>
        prev.map((pitch) =>
          pitch.id === placement.pitches_id
            ? {
                ...pitch,
                status: "placed",
              }
            : pitch,
        ),
      )

      // Show success toast
      toast({
        title: "Placement Confirmed",
        description: "The track has been confirmed as placed in the playlist.",
      })

      console.log("Placement confirmed successfully")
    } catch (error) {
      console.error("Error confirming placement:", error)
      toast({
        title: "Error",
        description: "Failed to confirm placement. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle remove from playlist
  const handleRemoveFromPlaylist = async (id: number) => {
    try {
      console.log("Removing from playlist for ID:", id)

      // Find the placement to get its details
      const placement = placements.find((p) => p.id === id)
      if (!placement) {
        throw new Error("Placement not found")
      }

      console.log("Found placement:", placement)

      // Update the pitch status in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${placement.pitches_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "closed",
          removedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error("Failed to update pitch status")
      }

      // Also update the placement status
      const placementResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "closed",
          removedAt: new Date().toISOString(),
        }),
      })

      if (!placementResponse.ok) {
        const errorText = await placementResponse.text()
        console.error("API error response for placement update:", errorText)
        throw new Error("Failed to update placement status")
      }

      // Update local state
      setPlacements((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "closed",
                removedAt: new Date().toISOString(),
              }
            : p,
        ),
      )

      // Update the pitch status in local state
      setPitches((prev) =>
        prev.map((pitch) =>
          pitch.id === placement.pitches_id
            ? {
                ...pitch,
                status: "closed",
              }
            : pitch,
        ),
      )

      // Show success toast
      toast({
        title: "Removal Confirmed",
        description: "The track has been confirmed as removed from the playlist.",
      })

      console.log("Removal confirmed successfully")
    } catch (error) {
      console.error("Error removing from playlist:", error)
      toast({
        title: "Error",
        description: "Failed to confirm removal. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle pitch actions
  const handleDeclinePitch = async (pitchId: number, feedback: DeclineFeedback) => {
    try {
      // Find the pitch to get its details
      const declinedPitch = pitches.find((pitch) => pitch.id === pitchId)

      if (!declinedPitch) {
        throw new Error("Pitch not found")
      }

      // Update the pitch status in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${pitchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "declined",
          feedback: feedback, // Store feedback if your API supports it
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error("Failed to update pitch status")
      }

      // Store the feedback in the feedback database
      const feedbackData = {
        pitchId,
        campaignId: declinedPitch.campaigns_id,
        curatorId: user?.id,
        mainReason: feedback.mainReason,
        recordingQuality: feedback.recordingQuality,
        productionQuality: feedback.productionQuality,
        originality: feedback.originality,
        comments: feedback.comments,
        createdAt: new Date().toISOString(),
        trackName: declinedPitch.trackName,
        artistName: declinedPitch.artistName,
      }

      console.log("Sending feedback data:", feedbackData)

      const feedbackResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })

      if (!feedbackResponse.ok) {
        const feedbackErrorText = await feedbackResponse.text()
        console.error("Failed to store feedback:", feedbackErrorText)
        // Don't throw an error here, as we've already updated the pitch status
      } else {
        const feedbackResult = await feedbackResponse.json()
        console.log("Feedback stored successfully:", feedbackResult)
      }

      // Update local state
      setPitches((prev) =>
        prev.map((pitch) =>
          pitch.id === pitchId
            ? {
                ...pitch,
                status: "declined",
              }
            : pitch,
        ),
      )

      // Show success toast
      toast({
        title: "Pitch Declined",
        description: `Feedback has been sent to the artist.`,
      })
    } catch (error) {
      console.error("Error declining pitch:", error)
      toast({
        title: "Error",
        description: "Failed to decline pitch. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptPitch = async (pitchId: number) => {
    try {
      // Find the pitch to get its details
      const acceptedPitch = pitches.find((pitch) => pitch.id === pitchId)

      if (!acceptedPitch) {
        throw new Error("Pitch not found")
      }

      // Update the pitch status in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${pitchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
          // Ensure playlists_id is properly formatted
          playlists_id:
            acceptedPitch.playlists_id && acceptedPitch.playlists_id.length > 0 ? acceptedPitch.playlists_id : [],
          // Include campaigns_id
          campaigns_id: acceptedPitch.campaigns_id,
        }),
      })

      // Get the response text for better error logging
      const responseText = await response.text()

      if (!response.ok) {
        console.error("API Error Response:", responseText)
        throw new Error(`Failed to update pitch status: ${response.status} ${response.statusText}`)
      }

      // Create a new placement in the database for each playlist
      if (acceptedPitch.playlists_id && acceptedPitch.playlists_id.length > 0) {
        const placementPromises = acceptedPitch.playlists_id.map(async (playlistId) => {
          try {
            const placementResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pitches_id: pitchId,
                playlists_id: playlistId,
                status: "accepted", // Changed from "pending" to "accepted"
                createdAt: new Date().toISOString(),
                campaigns_id: acceptedPitch.campaigns_id, // Include campaigns_id
              }),
            })

            if (!placementResponse.ok) {
              const placementErrorText = await placementResponse.text()
              console.error(`Placement API Error for playlist ${playlistId}:`, placementErrorText)
              throw new Error(`Failed to create placement: ${placementResponse.status} ${placementResponse.statusText}`)
            }

            return await placementResponse.json()
          } catch (placementError) {
            console.error(`Error creating placement for playlist ${playlistId}:`, placementError)
            // Continue with other placements even if one fails
            return null
          }
        })

        const placementResults = await Promise.all(placementPromises)
        const successfulPlacements = placementResults.filter(Boolean)

        // Update local state
        setPitches((prev) =>
          prev.map((pitch) =>
            pitch.id === pitchId
              ? {
                  ...pitch,
                  status: "accepted",
                }
              : pitch,
          ),
        )

        // Add to placements with enhanced data
        setPlacements((prev) => [
          ...prev,
          ...successfulPlacements.map((newPlacement) => ({
            ...newPlacement,
            trackName: acceptedPitch.trackName,
            artistName: acceptedPitch.artistName,
            playlistName:
              acceptedPitch.associatedPlaylists.find((p) => p.id === newPlacement.playlists_id)?.name ||
              "Unknown Playlist",
            artwork: acceptedPitch.artwork,
            status: "accepted", // Ensure status is set to "accepted"
            campaigns_id: acceptedPitch.campaigns_id, // Include campaigns_id
          })),
        ])
      } else {
        // If no playlists are associated, just update the pitch status
        setPitches((prev) =>
          prev.map((pitch) =>
            pitch.id === pitchId
              ? {
                  ...pitch,
                  status: "accepted",
                }
              : pitch,
          ),
        )
      }

      // Show success toast
      toast({
        title: "Pitch Accepted",
        description: `The track has been added to your placements. Please place it in your playlist and confirm placement.`,
      })
    } catch (error) {
      console.error("Error accepting pitch:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept pitch. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle placement actions
  const handleEndPlacement = async (id: number) => {
    try {
      // Update the placement status in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "ended",
          endDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update placement status")
      }

      // Update local state
      setPlacements((prev) =>
        prev.map((placement) =>
          placement.id === id
            ? {
                ...placement,
                status: "ended",
                endDate: new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }
            : placement,
        ),
      )

      // Show success toast
      toast({
        title: "Placement Ended",
        description: "The track has been removed from the playlist.",
      })
    } catch (error) {
      console.error("Error ending placement:", error)
      toast({
        title: "Error",
        description: "Failed to end placement. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle playlist creation
  const handlePlaylistCreated = (playlistData: any) => {
    // Refresh data to get the newly created playlist
    refreshData()
  }

  // Handle edit playlist
  const handleEditPlaylist = (playlist: PlaylistData) => {
    setSelectedPlaylist(playlist)
    setEditPlaylistOpen(true)
  }

  // Handle update playlist
  const handleUpdatePlaylist = (updatedPlaylist: PlaylistData) => {
    // Refresh data to get the updated playlist
    refreshData()

    toast({
      title: "Playlist Updated",
      description: `"${updatedPlaylist.name}" has been updated successfully.`,
    })
  }

  // Handle delete playlist
  const handleDeletePlaylist = (playlistId: number) => {
    // Refresh data to remove the deleted playlist
    refreshData()

    toast({
      title: "Playlist Deleted",
      description: "The playlist has been deleted successfully.",
      variant: "destructive",
    })
  }

  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your pitches</h2>
        <Link href="/auth/login" className="text-primary hover:underline">
          Go to login page
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Tabs defaultValue="pitches" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <TabsList className="grid w-full md:w-[600px] grid-cols-2">
            <TabsTrigger value="pitches" className="tab-animation">
              Your Pitches
            </TabsTrigger>
            <TabsTrigger value="placements" className="tab-animation">
              Placements
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="mt-4 md:mt-0 flex items-center gap-1"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href="/dashboard/playlists"
            className="flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ListMusic className="mr-2 h-4 w-4" />
            View Your Playlists
          </Link>
        </div>

        {/* Pitches Tab */}
        <TabsContent value="pitches" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Your Pitches</CardTitle>
                <CardDescription>Review and manage pitches for your playlists</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusFilter
                  selectedStatus={statusFilter}
                  onStatusChange={setStatusFilter}
                  statusOptions={[
                    { value: "all", label: "All Pitches" },
                    { value: "pitched", label: "Pending" },
                    { value: "accepted", label: "Accepted" },
                    { value: "declined", label: "Declined" },
                  ]}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="h-64 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredPitches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pitches found with the selected filter.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPitches.map((pitch) => (
                    <PitchCard
                      key={pitch.id}
                      id={pitch.id}
                      artwork={pitch.artwork}
                      trackName={pitch.trackName}
                      artistName={pitch.artistName}
                      status={pitch.status}
                      submissionDate={pitch.submissionDate}
                      genres={pitch.genres}
                      subgenres={pitch.subgenres}
                      spotifyUrl={pitch.spotifyUrl}
                      associatedPlaylists={pitch.associatedPlaylists}
                      onDecline={(feedback) => handleDeclinePitch(pitch.id, feedback)}
                      onAccept={() => handleAcceptPitch(pitch.id)}
                      campaignsId={pitch.campaignsId}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placements Tab */}
        <TabsContent value="placements" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Active Placements</CardTitle>
                <CardDescription>Manage your accepted and placed tracks</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusFilter
                  selectedStatus={placementStatusFilter}
                  onStatusChange={(status) => setPlacementStatusFilter(status as PlacementStatusOption)}
                  statusOptions={[
                    { value: "all", label: "All Placements" },
                    { value: "accepted", label: "Accepted" },
                    { value: "placed", label: "Placed" },
                  ]}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="h-24 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : placements.filter((p) => p.status === "accepted" || p.status === "placed").length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No active placements found. Accepted or placed pitches will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {placements
                    .filter((p) => p.status === "accepted" || p.status === "placed")
                    .map((placement) => (
                      <div key={placement.id} className="relative border rounded-lg bg-white shadow-sm p-6">
                        {/* Status badge in the top right corner */}
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              placement.status === "accepted"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {placement.status === "accepted" ? "Accepted" : "Placed"}
                          </Badge>
                        </div>

                        {/* Track header section with artwork and basic info */}
                        <div className="flex items-start gap-4 mb-6">
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                            <img
                              src={placement.artwork || "/placeholder.svg?height=64&width=64&query=music"}
                              alt={`${placement.trackName} by ${placement.artistName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-24">
                            <h3 className="text-xl font-semibold truncate">{placement.trackName}</h3>
                            <p className="text-gray-600 text-base mb-1">{placement.artistName}</p>
                            <p className="text-sm text-gray-500">
                              {placement.status === "placed" && placement.placedAt
                                ? `Placed on: ${new Date(placement.placedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}`
                                : `Accepted on: ${new Date(placement.placementDate || new Date()).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}`}
                            </p>
                          </div>
                        </div>

                        {/* Playlist section */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <div className="flex items-center mb-3">
                            <Music className="h-4 w-4 text-primary mr-2" />
                            <h4 className="text-sm font-medium">Playlist</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                            >
                              {placement.playlistName}
                            </Badge>
                          </div>

                          {/* Placement details */}
                          {placement.status === "placed" && placement.placedAt && (
                            <div className="mt-3 flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              <Badge variant="outline" className="bg-secondary/20 text-primary border-secondary">
                                {placement.daysRemaining || 30}d remaining
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3">
                          {placement.status === "accepted" && (
                            <Button
                              className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
                              onClick={() => handleConfirmPlacement(placement.id)}
                            >
                              <Check className="h-4 w-4" />
                              Confirm Placement
                            </Button>
                          )}

                          {placement.status === "placed" && (
                            <Button
                              variant="outline"
                              className="px-4 py-2 text-sm flex items-center gap-1 border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveFromPlaylist(placement.id)}
                            >
                              <X className="h-4 w-4" />
                              Remove from Playlist
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        open={createPlaylistOpen}
        onOpenChange={setCreatePlaylistOpen}
        onPlaylistCreated={handlePlaylistCreated}
      />

      {/* Edit Playlist Modal */}
      {selectedPlaylist && (
        <EditPlaylistModal
          open={editPlaylistOpen}
          onOpenChange={setEditPlaylistOpen}
          playlist={selectedPlaylist}
          onUpdate={handleUpdatePlaylist}
          onDelete={handleDeletePlaylist}
        />
      )}
    </div>
  )
}
