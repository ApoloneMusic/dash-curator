"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, Music, Search, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types for Spotify playlists
interface SpotifyPlaylist {
  id: string
  name: string
  images: { url: string }[]
  tracks: {
    total: number
  }
  owner: {
    display_name: string
  }
}

// Sample genres and subgenres
const genres = ["Electronic", "Hip Hop", "Pop", "Rock", "R&B", "Jazz", "Classical", "Country", "Folk", "Metal", "Indie"]

const subgenreMap: Record<string, string[]> = {
  Electronic: [
    "House",
    "Techno",
    "Trance",
    "Drum & Bass",
    "Dubstep",
    "Ambient",
    "Downtempo",
    "Chillwave",
    "EDM",
    "Synthwave",
  ],
  "Hip Hop": ["Trap", "Boom Bap", "Conscious", "Drill", "Lo-Fi Hip Hop", "Rap", "Grime"],
  Pop: ["Dance Pop", "Electropop", "Synth Pop", "Indie Pop", "K-Pop", "Contemporary", "Vocal"],
  Rock: ["Alternative", "Indie Rock", "Classic Rock", "Hard Rock", "Punk", "Grunge", "Progressive"],
  "R&B": ["Soul", "Neo-Soul", "Contemporary R&B", "Funk", "Motown"],
  Jazz: ["Smooth Jazz", "Bebop", "Fusion", "Swing", "Modal"],
  Classical: ["Baroque", "Romantic", "Contemporary", "Opera", "Chamber Music"],
  Country: ["Traditional", "Modern", "Bluegrass", "Americana", "Country Pop"],
  Folk: ["Traditional", "Contemporary", "Indie Folk", "Celtic", "Americana"],
  Metal: ["Heavy Metal", "Death Metal", "Black Metal", "Thrash Metal", "Doom Metal", "Metalcore"],
  Indie: ["Indie Rock", "Indie Pop", "Indie Folk", "Dream Pop", "Shoegaze", "Post-Rock"],
}

interface CreatePlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlaylistCreated?: (playlist: any) => void
}

export function CreatePlaylistModal({ open, onOpenChange, onPlaylistCreated }: CreatePlaylistModalProps) {
  // State for the multi-step process
  const [step, setStep] = useState(1)

  // State for search
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SpotifyPlaylist[]>([])

  // State for selected playlists
  const [selectedPlaylists, setSelectedPlaylists] = useState<SpotifyPlaylist[]>([])

  // State for genre and subgenre selection
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [selectedSubgenres, setSelectedSubgenres] = useState<string[]>([])
  const [availableSubgenres, setAvailableSubgenres] = useState<string[]>([])

  // State for validation
  const [errors, setErrors] = useState<{
    playlists?: string
    genre?: string
    subgenres?: string
    status?: string
  }>({})

  // Add this to the state declarations
  const [selectedStatus, setSelectedStatus] = useState<string>("pending")

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setSearchQuery("")
      setSearchResults([])
      setSelectedPlaylists([])
      setSelectedGenre("")
      setSelectedSubgenres([])
      setErrors({})
      setSelectedStatus("pending")
    }
  }, [open])

  // Update available subgenres when genre changes
  useEffect(() => {
    if (selectedGenre) {
      setAvailableSubgenres(subgenreMap[selectedGenre] || [])
      setSelectedSubgenres([])
    } else {
      setAvailableSubgenres([])
    }
  }, [selectedGenre])

  // Mock function to simulate Spotify API search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock search results
    const mockResults: SpotifyPlaylist[] = [
      {
        id: "1",
        name: "Chill Electronic Vibes",
        images: [{ url: "/electronic-playlist.png" }],
        tracks: { total: 45 },
        owner: { display_name: "DJ Curator" },
      },
      {
        id: "2",
        name: "Indie Discoveries",
        images: [{ url: "/indie-playlist-cover.png" }],
        tracks: { total: 32 },
        owner: { display_name: "DJ Curator" },
      },
      {
        id: "3",
        name: "Hip Hop Essentials",
        images: [{ url: "/hip-hop-playlist.png" }],
        tracks: { total: 50 },
        owner: { display_name: "DJ Curator" },
      },
      {
        id: "4",
        name: "Pop Hits 2025",
        images: [{ url: "/pop-music-artwork.png" }],
        tracks: { total: 28 },
        owner: { display_name: "DJ Curator" },
      },
    ]

    setSearchResults(mockResults)
    setIsSearching(false)
  }

  // Handle playlist selection
  const togglePlaylistSelection = (playlist: SpotifyPlaylist) => {
    setSelectedPlaylists((prev) => {
      const isSelected = prev.some((p) => p.id === playlist.id)

      if (isSelected) {
        return prev.filter((p) => p.id !== playlist.id)
      } else {
        return [...prev, playlist]
      }
    })
  }

  // Handle subgenre selection
  const toggleSubgenre = (subgenre: string) => {
    setSelectedSubgenres((prev) => {
      if (prev.includes(subgenre)) {
        return prev.filter((s) => s !== subgenre)
      } else {
        return [...prev, subgenre]
      }
    })
  }

  // Validate current step
  const validateStep = () => {
    const newErrors: {
      playlists?: string
      genre?: string
      subgenres?: string
      status?: string
    } = {}

    if (step === 1 && selectedPlaylists.length === 0) {
      newErrors.playlists = "Please select at least one playlist"
    }

    if (step === 2) {
      if (!selectedGenre) {
        newErrors.genre = "Please select a genre"
      }

      if (selectedSubgenres.length === 0) {
        newErrors.subgenres = "Please select at least one subgenre"
      }
      // Add this to the validateStep function for step 2
      if (!selectedStatus) {
        newErrors.status = "Please select a status"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setStep(2)
    }
  }

  // Handle previous step
  const handlePreviousStep = () => {
    setStep(1)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep()) {
      // Create the playlist object
      // Add this to the handleSubmit function
      const newPlaylist = {
        playlists: selectedPlaylists,
        genre: selectedGenre,
        subgenres: selectedSubgenres,
        status: selectedStatus,
      }

      // Call the onPlaylistCreated callback
      if (onPlaylistCreated) {
        onPlaylistCreated(newPlaylist)
      }

      // Close the modal
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Create Playlist</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Search and select the Spotify playlists you want to add to your curator dashboard."
              : "Select genres and subgenres for your playlist."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Search and select playlists */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="playlist-search">Search Spotify Playlists</Label>
                <div className="relative">
                  <Input
                    id="playlist-search"
                    placeholder="Search by playlist name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pr-10"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Search results */}
            <div className="space-y-4">
              <Label>Search Results</Label>
              {isSearching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {searchResults.map((playlist) => (
                    <div
                      key={playlist.id}
                      className={cn(
                        "flex items-center space-x-3 rounded-md border p-3 transition-colors",
                        selectedPlaylists.some((p) => p.id === playlist.id)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <Checkbox
                        checked={selectedPlaylists.some((p) => p.id === playlist.id)}
                        onCheckedChange={() => togglePlaylistSelection(playlist)}
                        id={`playlist-${playlist.id}`}
                      />
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img
                          src={playlist.images[0]?.url || "/placeholder.svg"}
                          alt={playlist.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`playlist-${playlist.id}`} className="text-sm font-medium cursor-pointer">
                          {playlist.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {playlist.tracks.total} tracks • {playlist.owner.display_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-muted-foreground">
                  No playlists found. Try a different search term.
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Search for playlists to get started.</div>
              )}
            </div>

            {/* Selected playlists */}
            {selectedPlaylists.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Playlists ({selectedPlaylists.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedPlaylists.map((playlist) => (
                    <Badge
                      key={playlist.id}
                      variant="outline"
                      className="flex items-center gap-1 py-1 pl-2 pr-1 bg-secondary/20"
                    >
                      <Music className="h-3 w-3 text-primary" />
                      <span>{playlist.name}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => togglePlaylistSelection(playlist)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {errors.playlists && <p className="text-sm text-destructive">{errors.playlists}</p>}
          </div>
        )}

        {/* Step 2: Select genres and subgenres */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            {/* Genre selection */}
            <div className="space-y-2">
              <Label htmlFor="genre">
                Genre <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger id="genre" className={errors.genre ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genres</SelectLabel>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.genre && <p className="text-sm text-destructive">{errors.genre}</p>}
            </div>

            {/* Subgenre selection */}
            <div className="space-y-2">
              <Label>
                Subgenres <span className="text-destructive">*</span>
              </Label>
              {selectedGenre ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSubgenres.map((subgenre) => (
                      <div
                        key={subgenre}
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-2 transition-colors cursor-pointer",
                          selectedSubgenres.includes(subgenre) ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                        )}
                        onClick={() => toggleSubgenre(subgenre)}
                      >
                        <Checkbox
                          checked={selectedSubgenres.includes(subgenre)}
                          onCheckedChange={() => toggleSubgenre(subgenre)}
                          id={`subgenre-${subgenre}`}
                        />
                        <Label htmlFor={`subgenre-${subgenre}`} className="text-sm cursor-pointer">
                          {subgenre}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSubgenres.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Selected: {selectedSubgenres.join(", ")}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Please select a genre first to see available subgenres.</p>
              )}
              {errors.subgenres && <p className="text-sm text-destructive">{errors.subgenres}</p>}
            </div>

            {/* Status selection */}
            <div className="space-y-2">
              <Label htmlFor="status" className={cn(errors.status && "text-destructive")}>
                Playlist Status <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status" className={cn(errors.status && "border-destructive ring-destructive")}>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending (Default)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
            </div>

            {/* Selected playlists summary */}
            <div className="space-y-2 mt-4">
              <Label>Selected Playlists</Label>
              <div className="flex flex-wrap gap-2">
                {selectedPlaylists.map((playlist) => (
                  <Badge
                    key={playlist.id}
                    variant="outline"
                    className="flex items-center gap-1 py-1 px-2 bg-secondary/20"
                  >
                    <Music className="h-3 w-3 text-primary" />
                    <span>{playlist.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {step === 1 ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          )}

          {step === 1 ? (
            <Button
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 glow-button"
              disabled={selectedPlaylists.length === 0}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-accent hover:bg-accent/90 glow-button"
              disabled={!selectedGenre || selectedSubgenres.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Add Playlist
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
