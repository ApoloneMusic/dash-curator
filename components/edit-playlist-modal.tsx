"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, Trash2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

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

// Update the PlaylistData interface
export interface PlaylistData {
  id: number
  artwork: string
  name: string
  followers: number
  tracks: number
  status: string
  description?: string
  genres?: string[]
  subgenres?: string[]
}

interface EditPlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlist: PlaylistData
  onUpdate: (updatedPlaylist: PlaylistData) => void
  onDelete: (playlistId: number) => void
}

export function EditPlaylistModal({ open, onOpenChange, playlist, onUpdate, onDelete }: EditPlaylistModalProps) {
  // State for genre and subgenre selection
  const [selectedGenres, setSelectedGenres] = useState<string[]>(playlist.genres || [])
  const [selectedSubgenres, setSelectedSubgenres] = useState<string[]>(playlist.subgenres || [])
  const [availableSubgenres, setAvailableSubgenres] = useState<Subgenre[]>([])
  const [description, setDescription] = useState(playlist.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // State for API data
  const [genres, setGenres] = useState<Genre[]>([])
  const [allSubgenres, setAllSubgenres] = useState<Subgenre[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // State for validation
  const [errors, setErrors] = useState<{
    genres?: string
    subgenres?: string
    description?: string
  }>({})

  // Fetch genres and subgenres from API
  useEffect(() => {
    const fetchGenresAndSubgenres = async () => {
      setIsLoading(true)
      try {
        // Fetch genres and subgenres in parallel
        const [genresResponse, subgenresResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/genre`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subgenre`),
        ])

        const genresData = await genresResponse.json()
        const subgenresData = await subgenresResponse.json()

        setGenres(genresData)
        setAllSubgenres(subgenresData)

        // Update available subgenres based on selected genres
        if (playlist.genres && playlist.genres.length > 0) {
          const genreIds = playlist.genres
            .map((name) => {
              const genre = genresData.find((g: Genre) => g.name === name)
              return genre ? genre.id : null
            })
            .filter((id) => id !== null) as number[]

          const filteredSubgenres = subgenresData.filter((sg: Subgenre) => genreIds.includes(sg.genre_id))

          setAvailableSubgenres(filteredSubgenres)
        }
      } catch (error) {
        console.error("Error fetching genres and subgenres:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchGenresAndSubgenres()
    }
  }, [open, playlist.genres])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedGenres(playlist.genres || [])
      setSelectedSubgenres(playlist.subgenres || [])
      setDescription(playlist.description || "")
      setErrors({})
      setIsSubmitting(false)
    }
  }, [open, playlist])

  // Update available subgenres when genres change
  useEffect(() => {
    if (selectedGenres.length > 0 && genres.length > 0) {
      // Get all genre IDs for selected genres
      const genreIds = selectedGenres
        .map((name) => genres.find((g) => g.name === name)?.id)
        .filter((id) => id !== undefined) as number[]

      // Get all subgenres for selected genres
      const filteredSubgenres = allSubgenres.filter((sg) => genreIds.includes(sg.genre_id))
      setAvailableSubgenres(filteredSubgenres)

      // Clear subgenres that don't belong to any selected genre
      setSelectedSubgenres((prev) => {
        const validSubgenreNames = filteredSubgenres.map((sg) => sg.name)
        return prev.filter((name) => validSubgenreNames.includes(name))
      })
    } else {
      setAvailableSubgenres([])
      setSelectedSubgenres([])
    }
  }, [selectedGenres, genres, allSubgenres])

  // Handle genre selection
  const toggleGenre = (genreName: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreName)) {
        return prev.filter((g) => g !== genreName)
      } else {
        return [...prev, genreName]
      }
    })
  }

  // Handle subgenre selection
  const toggleSubgenre = (subgenreName: string) => {
    setSelectedSubgenres((prev) => {
      if (prev.includes(subgenreName)) {
        return prev.filter((s) => s !== subgenreName)
      } else {
        return [...prev, subgenreName]
      }
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors: {
      genres?: string
      subgenres?: string
      description?: string
    } = {}

    if (selectedGenres.length === 0) {
      newErrors.genres = "Please select at least one genre"
    }

    if (selectedSubgenres.length === 0) {
      newErrors.subgenres = "Please select at least one subgenre"
    }

    if (!description.trim()) {
      newErrors.description = "Please provide a description for your playlist"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Find genre IDs from names
      const genreIds = selectedGenres
        .map((name) => {
          const genre = genres.find((g) => g.name === name)
          return genre ? genre.id : null
        })
        .filter((id) => id !== null) as number[]

      // Find subgenre IDs from names
      const subgenreIds = selectedSubgenres
        .map((name) => {
          const subgenre = allSubgenres.find((s) => s.name === name)
          return subgenre ? subgenre.id : null
        })
        .filter((id) => id !== null) as number[]

      // Update the playlist - keep the existing followers/saves count
      onUpdate({
        ...playlist,
        genres: selectedGenres,
        subgenres: selectedSubgenres,
        description: description,
      })

      setIsSubmitting(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating playlist:", error)
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)

    try {
      await onDelete(playlist.id)
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting playlist:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Playlist</DialogTitle>
            <DialogDescription>Update the information for &quot;{playlist.name}&quot;.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Playlist info display */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-md">
                <img
                  src={playlist.artwork || "/placeholder.svg"}
                  alt={playlist.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-medium">{playlist.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-muted-foreground">{playlist.followers.toLocaleString()} saves</p>
                  <p className="text-sm text-muted-foreground">{playlist.tracks} tracks</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      playlist.status === "active"
                        ? "secondary"
                        : playlist.status === "pending"
                          ? "outline"
                          : playlist.status === "inactive"
                            ? "default"
                            : "destructive"
                    }
                    className={`
                      text-xs
                      ${playlist.status === "active" ? "bg-secondary/70 text-primary" : ""}
                      ${playlist.status === "pending" ? "bg-muted text-muted-foreground" : ""}
                      ${playlist.status === "inactive" ? "bg-muted/50 text-muted-foreground" : ""}
                      ${playlist.status === "archived" ? "bg-destructive/10 text-destructive" : ""}
                    `}
                  >
                    {playlist.status.charAt(0).toUpperCase() + playlist.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Playlist Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                Playlist Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your playlist..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{description.length} characters</span>
                <span>Max 500 characters</span>
              </div>
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Genre selection */}
            <div className="space-y-2">
              <Label className={errors.genres ? "text-destructive" : ""}>
                Genres <span className="text-destructive">*</span>
              </Label>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading genres...</span>
                </div>
              ) : (
                <>
                  <div className="border rounded-md">
                    <ScrollArea className="h-[200px] p-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {genres.map((genre) => (
                          <div
                            key={genre.id}
                            className={cn(
                              "flex items-center space-x-2 rounded-md border p-2 transition-colors cursor-pointer",
                              selectedGenres.includes(genre.name) ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                            )}
                            onClick={() => toggleGenre(genre.name)}
                          >
                            <Checkbox
                              checked={selectedGenres.includes(genre.name)}
                              onCheckedChange={() => toggleGenre(genre.name)}
                              id={`genre-${genre.id}`}
                            />
                            <Label htmlFor={`genre-${genre.id}`} className="text-sm cursor-pointer">
                              {genre.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  {selectedGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedGenres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                          <button
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleGenre(genre)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
              {errors.genres && <p className="text-sm text-destructive">{errors.genres}</p>}
            </div>

            {/* Subgenre selection */}
            <div className="space-y-2">
              <Label className={errors.subgenres ? "text-destructive" : ""}>
                Subgenres <span className="text-destructive">*</span>
              </Label>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading subgenres...</span>
                </div>
              ) : selectedGenres.length > 0 ? (
                <>
                  <div className="border rounded-md">
                    <ScrollArea className="h-[200px] p-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableSubgenres.length > 0 ? (
                          availableSubgenres.map((subgenre) => (
                            <div
                              key={subgenre.id}
                              className={cn(
                                "flex items-center space-x-2 rounded-md border p-2 transition-colors cursor-pointer",
                                selectedSubgenres.includes(subgenre.name)
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-muted/50",
                              )}
                              onClick={() => toggleSubgenre(subgenre.name)}
                            >
                              <Checkbox
                                checked={selectedSubgenres.includes(subgenre.name)}
                                onCheckedChange={() => toggleSubgenre(subgenre.name)}
                                id={`subgenre-${subgenre.id}`}
                              />
                              <Label htmlFor={`subgenre-${subgenre.id}`} className="text-sm cursor-pointer">
                                {subgenre.name}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground col-span-full p-2">
                            No subgenres found for the selected genres.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  {selectedSubgenres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSubgenres.map((subgenre) => (
                        <Badge key={subgenre} variant="outline" className="text-xs">
                          {subgenre}
                          <button
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleSubgenre(subgenre)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select at least one genre first to see available subgenres.
                </p>
              )}
              {errors.subgenres && <p className="text-sm text-destructive">{errors.subgenres}</p>}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Playlist
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 glow-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Playlist
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the playlist &quot;{playlist.name}&quot; from
              your curator dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Playlist
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
