"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  spotifyService,
  type SpotifyPlaylist,
  type SpotifyProfile,
} from "@/lib/spotify-service";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, Loader2, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";

// Define interfaces for our data
interface Genre {
  id: number;
  name: string;
}

interface Subgenre {
  id: number;
  name: string;
  genre_id: number;
}

interface AddPlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlaylistAdded?: () => void;
  genres: Genre[];
  subgenres: Subgenre[];
}

export function AddPlaylistModal({
  open,
  onOpenChange,
  onPlaylistAdded,
  genres,
  subgenres,
}: AddPlaylistModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // State for the multi-step process
  const [step, setStep] = useState(1);

  // State for profile search
  const [profileIdQuery, setProfileIdQuery] = useState("");
  const [isSearchingProfile, setIsSearchingProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SpotifyProfile | null>(
    null
  );

  // State for playlists
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [profilePlaylists, setProfilePlaylists] = useState<SpotifyPlaylist[]>(
    []
  );
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyPlaylist | null>(null);

  // State for genre and subgenre selection
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSubgenres, setSelectedSubgenres] = useState<string[]>([]);
  const [availableSubgenres, setAvailableSubgenres] = useState<Subgenre[]>([]);

  // State for playlist description
  const [description, setDescription] = useState("");
  const [savesCount, setSavesCount] = useState<string>("");

  // State for validation
  const [errors, setErrors] = useState<{
    profile?: string;
    playlist?: string;
    genres?: string;
    subgenres?: string;
    description?: string;
    savesCount?: string;
  }>({});

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for API errors
  // const [apiError, setApiError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setProfileIdQuery("");
      setSelectedProfile(null);
      setProfilePlaylists([]);
      setSelectedPlaylist(null);
      setSelectedGenres([]);
      setSelectedSubgenres([]);
      setDescription("");
      setSavesCount("");
      setErrors({});
      // setApiError(null);
    }
  }, [open]);

  // Update available subgenres when genres change
  useEffect(() => {
    if (selectedGenres.length > 0) {
      // Get all genre IDs for selected genres
      const genreIds = selectedGenres
        .map((name) => genres.find((g) => g.name === name)?.id)
        .filter((id) => id !== undefined) as number[];

      // Get all subgenres for selected genres
      const filteredSubgenres = subgenres.filter((sg) =>
        genreIds.includes(sg.genre_id)
      );
      setAvailableSubgenres(filteredSubgenres);

      // Clear subgenres that don't belong to any selected genre
      setSelectedSubgenres((prev) => {
        const validSubgenreNames = filteredSubgenres.map((sg) => sg.name);
        return prev.filter((name) => validSubgenreNames.includes(name));
      });
    } else {
      setAvailableSubgenres([]);
      setSelectedSubgenres([]);
    }
  }, [selectedGenres, genres, subgenres]);

  const calculateTier = (saves: number) => {
    if (saves <= 1000) return 1;
    else if (saves <= 5000) return 2;
    else if (saves <= 15000) return 3;
    else if (saves <= 30000) return 4;
    else if (saves <= 50000) return 5;
    else if (saves <= 100000) return 6;
    else if (saves <= 250000) return 7;
    else if (saves <= 500000) return 8;
    else if (saves <= 1000000) return 9;
    return 10;
  };

  // Search for Spotify profile by ID
  const handleProfileSearch = async () => {
    if (!profileIdQuery.trim()) return;

    setIsSearchingProfile(true);
    setSelectedProfile(null);
    setProfilePlaylists([]);
    setSelectedPlaylist(null);
    setDescription("");

    try {
      // Extract profile ID from URL if a full Spotify URL is provided
      let profileId = profileIdQuery.trim();
      let isUrl = false;
      // Handle different Spotify URL formats
      if (profileId.includes("spotify.com")) {
        isUrl = true;
        const urlParts = profileId.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        // Remove any query parameters
        profileId = lastPart.split("?")[0];
      }

      const profile = await spotifyService.getProfileById(profileId);

      if (!profile) {
        toast({
          title: "Profile not found",
          description: `No Spotify profile found with that ${
            isUrl ? "URL" : "ID"
          }. Please check and try again.`,
          variant: "destructive",
        });
        return;
      }

      setSelectedProfile(profile);

      // Automatically load playlists for the found profile
      await loadProfilePlaylists(profile.id);
    } catch (error) {
      console.error("Error searching profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to search Spotify profile. Please try again.";

      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearchingProfile(false);
    }
  };

  // Load playlists for a profile
  const loadProfilePlaylists = async (profileId: string) => {
    setIsLoadingPlaylists(true);
    setProfilePlaylists([]);

    try {
      const playlists = await spotifyService.getUserPlaylists(profileId);
      setProfilePlaylists(playlists);

      if (playlists.length === 0) {
        toast({
          title: "No playlists",
          description: "This profile has no public playlists available.",
        });
      }
    } catch (error) {
      console.error("Error loading playlists:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load playlists for this profile. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  // Select a playlist
  const handlePlaylistSelect = (playlist: SpotifyPlaylist) => {
    setSelectedPlaylist(playlist);
  };

  // Handle genre selection
  const toggleGenre = (genreName: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreName)) {
        return prev.filter((g) => g !== genreName);
      } else {
        return [...prev, genreName];
      }
    });
  };

  // Handle subgenre selection
  const toggleSubgenre = (subgenreName: string) => {
    setSelectedSubgenres((prev) => {
      if (prev.includes(subgenreName)) {
        return prev.filter((s) => s !== subgenreName);
      } else {
        return [...prev, subgenreName];
      }
    });
  };

  // Validate current step
  const validateStep = () => {
    const newErrors: {
      profile?: string;
      playlist?: string;
      genres?: string;
      subgenres?: string;
      description?: string;
    } = {};

    if (step === 1) {
      if (!selectedPlaylist) {
        newErrors.playlist = "Please select a playlist";
      }
    }

    if (step === 2) {
      if (selectedGenres.length === 0) {
        newErrors.genres = "Please select at least one genre";
      }
      if (selectedSubgenres.length === 0) {
        newErrors.subgenres = "Please select at least one subgenre";
      }
      if (!description.trim()) {
        newErrors.description =
          "Please provide a description for your playlist";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetPlaylistData = async () => {
    try {
      if (!selectedPlaylist?.href) {
        toast({
          title: "Something went wrong",
          description: "Please try again later",
        });
        return null;
      }
      const spotifyPlaylist = await spotifyService.getPlaylistByUrl(
        selectedPlaylist.href
      );
      setSelectedPlaylist(spotifyPlaylist);
      // Set the description from the playlist data
      setDescription(spotifyPlaylist.description || "");
      handleNextStep();
    } catch (error) {
      console.error("Error loading playlists:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load playlists for this profile. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setStep(2);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setStep(1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep() || !user || !selectedPlaylist) return;

    setIsSubmitting(true);
    // setApiError(null);

    try {
      // Find genre IDs from names
      const genreIds = selectedGenres
        .map((name) => {
          const genre = genres.find((g) => g.name === name);
          return genre ? genre.id : null;
        })
        .filter((id) => id !== null) as number[];

      // Find subgenre IDs from names
      const subgenreIds = selectedSubgenres
        .map((name) => {
          const subgenre = subgenres.find((s) => s.name === name);
          return subgenre ? subgenre.id : null;
        })
        .filter((id) => id !== null) as number[];

      let saves = Number(selectedPlaylist.followers.total);
      saves = Math.abs(Math.round(saves));
      const tier = calculateTier(saves);

      // Prepare data for POST request
      const newPlaylist = {
        curators_id: Number(user.id),
        playlistName: selectedPlaylist.name,
        playlistUrl: selectedPlaylist.external_urls.spotify,
        artwork: selectedPlaylist.images[0]?.url,
        description: description.trim(),
        saves: saves, // Use the manually entered value
        tier: tier, // Default tier
        status: "unverified", // Default status
        score: 0, // Default score
        genres: genreIds,
        subgenres: subgenreIds,
        track_count: selectedPlaylist.tracks.total,
      };

      // Send POST request to API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlaylist),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(
          errorData.message || `Failed to create playlist: ${response.status}`
        );
      }

      toast({
        title: "Success",
        description: "Playlist added successfully",
      });

      // Close the modal and refresh the playlist list
      onOpenChange(false);
      if (onPlaylistAdded) {
        onPlaylistAdded();
      }
    } catch (error) {
      console.error("Error adding playlist:", error);
      // setApiError(
      //   error instanceof Error
      //     ? error.message
      //     : "Failed to add playlist. Please try again."
      // );
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Add Spotify Playlist
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Search for a Spotify profile to add playlists to your curator dashboard."
              : "Configure your playlist details and categorization."}
          </DialogDescription>
        </DialogHeader>

        {/* {apiError && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm mb-4 border border-destructive/20">
            <p className="font-medium mb-1">Error</p>
            <p>{apiError}</p>
          </div>
        )} */}

        {/* Step 1: Search for profiles */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-id-search">
                Enter Spotify Profile ID or URL
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="profile-id-search"
                    placeholder="Enter Spotify profile ID or URL..."
                    value={profileIdQuery}
                    onChange={(e) => setProfileIdQuery(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleProfileSearch()
                    }
                  />
                  {profileIdQuery && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setProfileIdQuery("")}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleProfileSearch}
                  disabled={isSearchingProfile || !profileIdQuery.trim()}>
                  {isSearchingProfile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a Spotify profile ID (e.g., "spotify") or full profile URL
                (e.g., "https://open.spotify.com/user/spotify").
              </p>
            </div>

            {/* Selected Profile */}
            {selectedProfile && (
              <div className="space-y-2">
                <Label>Selected Profile</Label>
                <div className="flex items-center space-x-3 rounded-md border p-3 bg-muted/20">
                  <div className="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center bg-muted">
                    {selectedProfile.images &&
                    selectedProfile.images.length > 0 ? (
                      <img
                        src={
                          selectedProfile.images[0].url || "/placeholder.svg"
                        }
                        alt={selectedProfile.display_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {selectedProfile.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Spotify ID: {selectedProfile.id}
                    </p>
                  </div>
                  <a
                    href={selectedProfile.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Profile's Playlists */}
            {selectedProfile && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Playlists by {selectedProfile.display_name}</Label>
                  {profilePlaylists.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {profilePlaylists.length} playlists
                    </Badge>
                  )}
                </div>

                {isLoadingPlaylists ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : profilePlaylists.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {profilePlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className={cn(
                          "flex items-center space-x-3 rounded-md border p-3 transition-colors cursor-pointer",
                          selectedPlaylist?.id === playlist.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => handlePlaylistSelect(playlist)}>
                        <div className="h-12 w-12 overflow-hidden rounded-md">
                          <img
                            src={
                              playlist.images && playlist.images.length > 0
                                ? playlist.images[0].url
                                : "/placeholder.svg?height=48&width=48&query=playlist"
                            }
                            alt={playlist.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{playlist.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {playlist.tracks.total} tracks
                          </p>
                        </div>
                        {selectedPlaylist?.id === playlist.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No public playlists found for this profile.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Configure playlist details */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            {/* Selected Playlist Summary */}
            {selectedPlaylist && (
              <div className="flex items-center space-x-3 rounded-md border p-3 bg-muted/20">
                <div className="h-12 w-12 overflow-hidden rounded-md">
                  <img
                    src={
                      selectedPlaylist.images &&
                      selectedPlaylist.images.length > 0
                        ? selectedPlaylist.images[0].url
                        : "/placeholder.svg?height=48&width=48&query=playlist"
                    }
                    alt={selectedPlaylist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedPlaylist.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPlaylist.tracks.total} tracks •{" "}
                    {selectedPlaylist.followers?.total || 0} saves
                  </p>
                </div>
              </div>
            )}

            {/* Playlist Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className={errors.description ? "text-destructive" : ""}>
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
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Number of Saves */}
            <div className="space-y-2">
              <Label className={errors.savesCount ? "text-destructive" : ""}>
                Number of Saves{" "}
                <span className="text-destructive">
                  {selectedPlaylist?.followers.total}
                </span>
              </Label>
            </div>

            {/* Genre selection */}
            <div className="space-y-2">
              <Label className={errors.genres ? "text-destructive" : ""}>
                Genres <span className="text-destructive">*</span>
              </Label>
              <div className="border rounded-md">
                <ScrollArea className="h-[200px] p-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {genres.map((genre) => (
                      <div
                        key={genre.id}
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-2 transition-colors cursor-pointer",
                          selectedGenres.includes(genre.name)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => toggleGenre(genre.name)}>
                        <Checkbox
                          checked={selectedGenres.includes(genre.name)}
                          onCheckedChange={() => toggleGenre(genre.name)}
                          id={`genre-${genre.id}`}
                        />
                        <Label
                          htmlFor={`genre-${genre.id}`}
                          className="text-sm cursor-pointer">
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
                          e.preventDefault();
                          toggleGenre(genre);
                        }}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {errors.genres && (
                <p className="text-sm text-destructive">{errors.genres}</p>
              )}
            </div>

            {/* Subgenre selection */}
            <div className="space-y-2">
              <Label className={errors.subgenres ? "text-destructive" : ""}>
                Subgenres <span className="text-destructive">*</span>
              </Label>
              {selectedGenres.length > 0 ? (
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
                                  : "hover:bg-muted/50"
                              )}
                              onClick={() => toggleSubgenre(subgenre.name)}>
                              <Checkbox
                                checked={selectedSubgenres.includes(
                                  subgenre.name
                                )}
                                onCheckedChange={() =>
                                  toggleSubgenre(subgenre.name)
                                }
                                id={`subgenre-${subgenre.id}`}
                              />
                              <Label
                                htmlFor={`subgenre-${subgenre.id}`}
                                className="text-sm cursor-pointer">
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
                        <Badge
                          key={subgenre}
                          variant="outline"
                          className="text-xs">
                          {subgenre}
                          <button
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSubgenre(subgenre);
                            }}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select at least one genre first to see available
                  subgenres.
                </p>
              )}
              {errors.subgenres && (
                <p className="text-sm text-destructive">{errors.subgenres}</p>
              )}
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
              onClick={handleGetPlaylistData}
              className="bg-primary hover:bg-primary/90"
              disabled={!selectedPlaylist}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-accent hover:bg-accent/90"
              disabled={
                selectedGenres.length === 0 ||
                selectedSubgenres.length === 0 ||
                !description.trim() ||
                isSubmitting
              }>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add Playlist
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
