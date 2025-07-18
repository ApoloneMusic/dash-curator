"use client";

import { CreatePlaylistModal } from "@/components/create-playlist-modal";
import type { DeclineFeedback } from "@/components/decline-pitch-modal";
import {
  EditPlaylistModal,
  type PlaylistData,
} from "@/components/edit-playlist-modal";
import { PitchCard } from "@/components/pitch-card";
import { PlacementPitchCard } from "@/components/placement-pitch-card";
import { StatusFilter } from "@/components/status-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { spotifyService } from "@/lib/spotify-service";
import { ListMusic, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type PitchStatusOption =
  | "all"
  | "placed"
  | "accepted"
  | "declined"
  | "pitched";
type PlacementStatusOption = "all" | "accepted" | "placed";

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

interface Campaign {
  id: number;
  artists_id: number;
  trackName: string;
  artistName: string;
  trackUrl: string;
  genre_id: number[];
  subgenre_id: number[];
  created_at: string;
  artwork?: string;
}

interface Pitch {
  id: number;
  campaigns_id: number;
  curators_id: number;
  playlists_id: number[]; // Changed to array to support multiple playlists
  status: string;
  score: number;
  created_at: string;
  feedback?: string;
  acceptedAt?: number;
  placedAt?: string;
  removedAt?: string;
  campaigns?: Campaign;
}

interface Playlist {
  id: number;
  curators_id: number;
  playlistName: string;
  playlistUrl: string;
  description: string;
  genres: number[];
  subgenres: number[];
  status: string;
}

// Enhanced pitch data for display
interface EnhancedPitch extends Pitch {
  campaigns: Campaign;
  associatedPlaylists: {
    id: number;
    name: string;
    genres: { name: string; isMatch?: boolean }[];
  }[];
}

export interface EnhancedPlacement extends EnhancedPitch {
  hoursRemaining?: number;
}

export default function PitchesPage() {
  const [activeTab, setActiveTab] = useState("pitches");
  const [statusFilter, setStatusFilter] = useState<PitchStatusOption>("all");
  const [placementStatusFilter, setPlacementStatusFilter] =
    useState<PlacementStatusOption>("all");
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [editPlaylistOpen, setEditPlaylistOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(
    null
  );
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  // State for data
  const [pitches, setPitches] = useState<EnhancedPitch[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [subgenres, setSubgenres] = useState<Subgenre[]>([]);
  // const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [debugInfo, setDebugInfo] = useState<any>({});

  // Sample artwork images for demonstration
  const artworkImages = [
    "/electronic-music-artwork.png",
    "/indie-rock-artwork.png",
    "/hip-hop-artwork.png",
    "/pop-music-artwork.png",
  ];

  // Fetch data on component mount
  useEffect(() => {
    if (!user) return;

    fetchData();
  }, [user]);

  // Fetch all necessary data
  const fetchData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch all data in parallel for efficiency
      const [
        pitchesResponse,
        playlistsResponse,
        genresResponse,
        subgenresResponse,
      ] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches?curators_id=${user.id}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists?curators_id=${user.id}`
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/genre`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subgenre`),
      ]);

      // Parse JSON responses and ensure they're arrays
      const pitchesData = await pitchesResponse.json();
      const playlistsData = await playlistsResponse.json();
      const genresData = await genresResponse.json();
      const subgenresData = await subgenresResponse.json();

      // Ensure all data is in array format
      const pitchesArray: any[] = Array.isArray(pitchesData)
        ? pitchesData
        : pitchesData.data || [];
      const playlistsArray: any[] = Array.isArray(playlistsData)
        ? playlistsData
        : playlistsData.data || [];
      const genresArray: any[] = Array.isArray(genresData)
        ? genresData
        : genresData.data || [];
      const subgenresArray: any[] = Array.isArray(subgenresData)
        ? subgenresData
        : subgenresData.data || [];

      // Enhance pitches with campaign and playlist data
      const enhancedPitches: EnhancedPitch[] = pitchesArray.map(
        (pitch: Pitch) => {
          // Get associated campaign
          if (!pitch.campaigns) {
            pitch.campaigns = {
              id: 0,
              artists_id: 0,
              created_at: new Date().toISOString(),
              trackName: "Unknown Track",
              artistName: "Unknown Artist",
              trackUrl: "",
              genre_id: [],
              subgenre_id: [],
            };
          }

          // Get associated playlists
          const associatedPlaylists = pitch.playlists_id
            .map((playlistId) => {
              const playlist = playlistsArray.find(
                (p: Playlist) => p.id === playlistId
              );

              if (!playlist) return null;

              // Map playlist genres to objects with names
              const playlistGenres = (playlist.genres || []).map(
                (genreId: any) => {
                  const genre = genresArray.find((g: any) => g.id === genreId);
                  return {
                    name: genre ? genre.name : `Genre ${genreId}`,
                    isMatch: pitch.campaigns!.genre_id === genreId,
                  };
                }
              );

              return {
                id: playlist.id,
                name: playlist.playlistName,
                genres:
                  playlistGenres.length > 0
                    ? playlistGenres
                    : [{ name: "No genres", isMatch: false }],
              };
            })
            .filter(
              (
                playlist
              ): playlist is {
                id: number;
                name: string;
                genres: { name: string; isMatch?: boolean }[];
              } => playlist !== null
            );

          return {
            ...pitch,
            campaigns: pitch.campaigns!,
            associatedPlaylists: associatedPlaylists,
          };
        }
      );

      setPitches(enhancedPitches);
      setGenres(genresArray);
      setSubgenres(subgenresArray);

      // Sync artwork for campaigns that don't have it
      await syncCampaignArtwork(enhancedPitches);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Sync artwork for campaigns that don't have it
  const syncCampaignArtwork = async (pitchesToSync: EnhancedPitch[]) => {
    try {
      // Filter campaigns that need artwork syncing
      const campaignsNeedingSync = pitchesToSync.filter(
        (pitch) => pitch.campaigns.trackUrl && !pitch.campaigns.artwork
      );

      if (campaignsNeedingSync.length === 0) return;

      // Create an array of promises for fetching artwork
      const artworkPromises = campaignsNeedingSync.map(async (pitch) => {
        try {
          // Extract track ID from Spotify URL
          const trackUrl = pitch.campaigns.trackUrl;
          const trackId = trackUrl.split("/").pop()?.split("?")[0];

          if (!trackId) {
            console.error(`Invalid track URL for pitch ${pitch.id}:`, trackUrl);
            return null;
          }

          // Fetch track details from Spotify
          const trackDetails = await spotifyService.getTrackById(trackId);

          if (!trackDetails?.album?.images?.[0]?.url) {
            console.error(`No artwork found for track ${trackId}`);
            return null;
          }

          const artworkUrl = trackDetails.album.images[0].url;

          // Update the campaign in the background
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${pitch.campaigns_id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                artwork: artworkUrl,
              }),
            }
          );

          return {
            campaignId: pitch.campaigns_id,
            artwork: artworkUrl,
          };
        } catch (error) {
          console.error(`Error syncing artwork for pitch ${pitch.id}:`, error);
          return null;
        }
      });

      // Wait for all artwork fetches to complete
      const artworkResults = await Promise.all(artworkPromises);

      // Update local state with fetched artwork
      setPitches((prevPitches) => {
        return prevPitches.map((pitch) => {
          const artworkResult = artworkResults.find(
            (result) => result && result.campaignId === pitch.campaigns_id
          );

          return {
            ...pitch,
            campaigns: {
              ...pitch.campaigns,
              artwork:
                artworkResult?.artwork ||
                pitch.campaigns.artwork ||
                artworkImages[pitch.id % artworkImages.length],
            },
          };
        });
      });
    } catch (error) {
      console.error("Error syncing campaign artwork:", error);
      toast({
        title: "Error",
        description: "Failed to sync some artwork. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Map genre IDs to genre objects with names and match status
  const mapGenresToObjects = (
    genreIds: number[],
    playlistGenreIds: number[] = []
  ) => {
    if (genreIds.length === 0) {
      return [];
    }
    return genreIds.map((genreId) => {
      const genre = genres.find((g) => g.id === genreId);
      if (!genre) {
        console.log(
          `Genre with ID ${genreId} not found in genres array. Available IDs:`,
          genres.map((g) => g.id)
        );

        return {
          name: `Unknown Genre (${genreId})`,
          isMatch: false,
          id: genreId,
        };
      }
      return {
        name: genre.name,
        isMatch: playlistGenreIds.includes(genreId),
        id: genreId,
      };
    });
  };

  // Map subgenre IDs to subgenre objects with names and match status
  const mapSubgenresToObjects = (
    subgenreIds: number[] = [],
    playlistSubgenreIds: number[] = []
  ) => {
    if (
      !subgenreIds ||
      !Array.isArray(subgenreIds) ||
      subgenreIds.length === 0
    ) {
      return [];
    }

    return subgenreIds.map((id) => {
      // First try direct ID match
      let subgenre = subgenres.find((s) => s.id === id);

      // If not found, try string comparison
      if (!subgenre) {
        subgenre = subgenres.find((s) => String(s.id) === String(id));
      }

      if (!subgenre) {
        console.log(
          `Subgenre with ID ${id} not found in subgenres array. Available IDs:`,
          subgenres.map((s) => s.id)
        );
        return {
          name: `Unknown Subgenre (${id})`,
          isMatch: false,
          id: id,
        };
      }

      return {
        name: subgenre.name,
        isMatch: playlistSubgenreIds.includes(id),
        id: id,
        genre_id: subgenre.genre_id,
      };
    });
  };

  // Transform pitch data for PitchCard component
  const transformedPitches = useMemo(() => {
    return pitches.map((pitch) => {
      // Get all playlist genre and subgenre IDs for matching
      const allPlaylistGenreIds = pitch.associatedPlaylists.flatMap(
        (playlist) =>
          playlist.genres
            .map((genre) => {
              const foundGenre = genres.find((g) => g.name === genre.name);
              return foundGenre?.id;
            })
            .filter((id) => id != null)
      );

      // Map genre and subgenre IDs to objects with names and match status
      const genreObjects = mapGenresToObjects(
        pitch.campaigns.genre_id,
        allPlaylistGenreIds
      );
      const subgenreObjects = mapSubgenresToObjects(
        pitch.campaigns.subgenre_id,
        []
      );

      // For clarity, if no genres/subgenres, use clear placeholder data
      const finalGenres =
        genreObjects.length > 0
          ? genreObjects
          : [{ name: "No Genre Information", isMatch: false }];

      const finalSubgenres =
        subgenreObjects.length > 0
          ? subgenreObjects
          : [{ name: "No Subgenre Information", isMatch: false }];

      return {
        ...pitch,
        status: pitch.status as "placed" | "accepted" | "declined" | "pitched",
        genres: finalGenres,
        subgenres: finalSubgenres,
      };
    });
  }, [pitches, genres, subgenres]);

  const validPitches = useMemo(() => {
    return transformedPitches.filter((pitch) =>
      ["placed", "accepted", "declined", "pitched"].includes(pitch.status)
    );
  }, [transformedPitches]);

  // Filter and sort pitches based on status
  const filteredPitches = useMemo(() => {
    // First filter by status if not "all"
    const filtered =
      statusFilter === "all"
        ? validPitches
        : validPitches.filter((pitch) => pitch.status === statusFilter);
    // Then sort to prioritize pitched pitches
    return [...filtered].sort((a, b) => {
      if (!a || !b) return 0;
      // If we're not filtering, put pitched first
      if (statusFilter === "all") {
        if (a.status === "pitched" && b.status !== "pitched") return -1;
        if (a.status !== "pitched" && b.status === "pitched") return 1;
      }

      // Otherwise sort by submission date (newest first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [validPitches, statusFilter]);

  // Get pitches with status "accepted" or "placed" for the Placements tab

  const pitchPlacements: EnhancedPlacement[] = useMemo(() => {
    return pitches
      .filter(
        (pitch) => pitch.status === "accepted" || pitch.status === "placed"
      )
      .map((pitch) => {
        // Calculate hours remaining for placed pitches
        let hoursRemaining: number | undefined;
        if (pitch.status === "placed" && pitch.placedAt) {
          const endDateTime = new Date(pitch.placedAt);
          endDateTime.setDate(endDateTime.getDate() + 30); // 30 days placement period

          const now = new Date();
          const diffTime = endDateTime.getTime() - now.getTime();
          hoursRemaining = Math.floor(diffTime / (1000 * 60 * 60)); // Convert to hours
        }

        return {
          ...pitch,
          hoursRemaining,
        };
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        // Sort by status priority: accepted first, then placed
        if (a.status === "accepted" && b.status !== "accepted") return -1;
        if (a.status !== "accepted" && b.status === "accepted") return 1;

        // Then sort by submission date (newest first)
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [pitches]);

  // Calculate counts for badges
  const pitchCount = useMemo(() => {
    return filteredPitches.filter((pitch) => pitch.status === "pitched").length;
  }, [filteredPitches]);

  const placementCount = useMemo(() => {
    return pitchPlacements.filter((placement) => {
      // Include accepted pitches
      if (placement.status === "accepted") return true;
      // For placed pitches, only include those that have reached their end time
      if (placement.status === "placed") {
        // If hoursRemaining is undefined or <= 0, the placement has ended
        return !placement.hoursRemaining || placement.hoursRemaining <= 0;
      }
      return false;
    }).length;
  }, [pitchPlacements]);

  // Handle confirm placement
  const handleConfirmPlacement = async (id: number) => {
    try {
      // Find the pitch
      const pitch = pitches.find((p) => p.id === id);
      if (!pitch) {
        throw new Error("Pitch not found");
      }

      // Update the pitch status in the database
      const pitchResponse = await fetch(`/api/pitches/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "placed",
          placedAt: new Date().toISOString(),
        }),
      });

      if (!pitchResponse.ok) {
        throw new Error(
          `Failed to update pitch status: ${pitchResponse.statusText}`
        );
      }

      // Update local state - update the pitch
      setPitches((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "placed",
              }
            : p
        )
      );

      const campaignRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${pitch.campaigns_id}`
      );

      if (!campaignRes.ok) {
        const campaignResError = await campaignRes.text();
        console.error("Failed to get campaign:", campaignResError);
        // Don't throw an error here, as we've already updated the pitch status
      } else {
        const campaignData = await campaignRes.json();
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${pitch.campaigns_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...campaignData,
              status: "accepted",
              accepted_count: campaignData.accepted_count + 1,
            }),
          }
        );
      }

      // Refresh user data to update credits
      await refreshUser();

      // Show success toast
      toast({
        title: "Placement Confirmed",
        description: "The track has been confirmed as placed in the playlist.",
      });
    } catch (error) {
      console.error("Error confirming placement:", error);
      toast({
        title: "Error",
        description: "Failed to confirm placement. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle remove from playlist
  const handleRemoveFromPlaylist = async (id: number) => {
    try {
      // Find the pitch
      const pitch = pitches.find((p) => p.id === id);
      if (!pitch) {
        throw new Error("Pitch not found");
      }

      // Update the pitch status in the database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "closed",
            removedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error("Failed to update pitch status");
      }

      // Update local state - update the pitch
      setPitches((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "closed",
              }
            : p
        )
      );

      // Show success toast
      toast({
        title: "Removal Confirmed",
        description:
          "The track has been confirmed as removed from the playlist.",
      });
    } catch (error) {
      console.error("Error removing from playlist:", error);
      toast({
        title: "Error",
        description: "Failed to confirm removal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle pitch actions
  const handleDeclinePitch = async (
    pitchId: number,
    feedback: DeclineFeedback
  ) => {
    try {
      // Find the pitch to get its details
      const declinedPitch = pitches.find((pitch) => pitch.id === pitchId);

      if (!declinedPitch) {
        throw new Error("Pitch not found");
      }

      // Update the pitch status in the database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${pitchId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "declined",
            feedback: feedback, // Store feedback if your API supports it
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error("Failed to update pitch status");
      }

      // Store the feedback in the feedback database
      const feedbackData = {
        pitches_id: pitchId,
        // campaignId: declinedPitch.campaigns_id,
        // curatorId: user?.id,
        reason: feedback.mainReason,
        recordingQuality: feedback.recordingQuality,
        productionQuality: feedback.productionQuality,
        originality: feedback.originality,
        note: feedback.comments,
        createdAt: new Date().toISOString(),
        // trackName: declinedPitch.trackName,
        // artistName: declinedPitch.artistName,
      };

      const feedbackResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (!feedbackResponse.ok) {
        const feedbackErrorText = await feedbackResponse.text();
        console.error("Failed to store feedback:", feedbackErrorText);
        // Don't throw an error here, as we've already updated the pitch status
      }

      const curatorProfileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user?.id}`
      );

      if (!curatorProfileRes.ok) {
        const curatorProfileErrorRes = await curatorProfileRes.text();
        console.error("Failed to get curator profile:", curatorProfileErrorRes);
        // Don't throw an error here, as we've already updated the pitch status
      } else {
        const curatorProfileData = await curatorProfileRes.json();
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user?.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...curatorProfileData,
              credits: curatorProfileData.credits + 1,
              declined: curatorProfileData.declined + 1,
            }),
          }
        );
      }

      // declinedPitch.campaigns_id

      const campaignRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${declinedPitch.campaigns_id}`
      );

      if (!campaignRes.ok) {
        const curatorProfileErrorRes = await campaignRes.text();
        console.error("Failed to get campaign:", curatorProfileErrorRes);
        // Don't throw an error here, as we've already updated the pitch status
      } else {
        const campaignData = await campaignRes.json();
        console.log("Campaign data:", campaignData);
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${declinedPitch.campaigns_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...campaignData,
              declined_count: campaignData.declined_count + 1,
            }),
          }
        );
      }

      // Update local state
      setPitches((prev) =>
        prev.map((pitch) =>
          pitch.id === pitchId
            ? {
                ...pitch,
                status: "declined",
              }
            : pitch
        )
      );

      // Refresh user data to update credits
      await refreshUser();

      // Show success toast
      toast({
        title: "Pitch Declined",
        description: `Feedback has been sent to the artist.`,
      });
    } catch (error) {
      console.error("Error declining pitch:", error);
      toast({
        title: "Error",
        description: "Failed to decline pitch. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptPitch = async (
    pitchId: number,
    campaignId: number,
    playlists_id: number[]
  ) => {
    try {
      // Find the pitch to get its details
      const acceptedPitch = pitches.find((pitch) => pitch.id === pitchId);

      if (!acceptedPitch) {
        throw new Error("Pitch not found");
      }

      console.log("Updating pitch with selected playlists:", playlists_id);
      const date = new Date();

      // Update the pitch status and playlists_id in the database
      // This will REPLACE any existing playlists_id with only the selected ones
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${pitchId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "accepted",
            playlists_id: playlists_id, // This will replace any existing playlist IDs
            campaigns_id: campaignId,
            acceptedAt: date.getTime(),
          }),
        }
      );

      // Get the response text for better error logging
      const responseText = await response.text();

      if (!response.ok) {
        console.error("API Error Response:", responseText);
        throw new Error(
          `Failed to update pitch status: ${response.status} ${response.statusText}`
        );
      }

      console.log(
        "Pitch updated successfully, now creating placements for each selected playlist"
      );

      // Update local state
      refreshData();

      const curatorProfileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user?.id}`
      );

      if (!curatorProfileRes.ok) {
        const curatorProfileErrorRes = await curatorProfileRes.text();
        console.error("Failed to get curator profile:", curatorProfileErrorRes);
        // Don't throw an error here, as we've already updated the pitch status
      } else {
        const curatorProfileData = await curatorProfileRes.json();
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user?.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...curatorProfileData,
              credits: curatorProfileData.credits + 1,
              accepted: curatorProfileData.accepted + 1,
            }),
          }
        );
      }

      // Refresh user data to update credits
      await refreshUser();

      // Show success toast
      toast({
        title: "Pitch Accepted",
        description: `The track has been added to your placements. Please place it in your playlist and confirm placement.`,
      });
    } catch (error) {
      console.error("Error accepting pitch:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to accept pitch. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle playlist creation
  const handlePlaylistCreated = (playlistData: any) => {
    // Refresh data to get the newly created playlist
    refreshData();
  };

  // Handle edit playlist
  const handleEditPlaylist = (playlist: PlaylistData) => {
    setSelectedPlaylist(playlist);
    setEditPlaylistOpen(true);
  };

  // Handle update playlist
  const handleUpdatePlaylist = (updatedPlaylist: PlaylistData) => {
    // Refresh data to get the updated playlist
    refreshData();

    toast({
      title: "Playlist Updated",
      description: `"${updatedPlaylist.name}" has been updated successfully.`,
    });
  };

  // Handle delete playlist
  const handleDeletePlaylist = (playlistId: number) => {
    // Refresh data to remove the deleted playlist
    refreshData();

    toast({
      title: "Playlist Deleted",
      description: "The playlist has been deleted successfully.",
      variant: "destructive",
    });
  };

  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please log in to view your pitches
        </h2>
        <Link href="/auth/login" className="text-primary hover:underline">
          Go to login page
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Tabs
        defaultValue="pitches"
        className="w-full"
        onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <TabsList className="grid w-full md:w-[600px] grid-cols-2 h-14">
            <TabsTrigger value="pitches" className="tab-animation relative text-base font-semibold px-6 py-3 data-[state=active]:bg-[#104700] data-[state=active]:text-white hover:bg-[#0d3a00] hover:text-white">
              Review submissions
              {pitchCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-2.5 py-0.5 text-sm font-medium">
                  {pitchCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="placements" className="tab-animation relative text-base font-semibold px-6 py-3 data-[state=active]:bg-[#104700] data-[state=active]:text-white hover:bg-[#0d3a00] hover:text-white">
              Confirm Placements
              {placementCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-2.5 py-0.5 text-sm font-medium">
                  {placementCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="mt-4 md:mt-0 flex items-center gap-1">
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href="/dashboard/playlists"
            className="inline-flex items-center px-6 py-3 bg-[#ea4e2f] hover:bg-[#d44526] text-white font-medium text-base rounded-md shadow-sm transition-colors">
            <ListMusic className="mr-2 h-5 w-5" />
            YOUR PLAYLISTS
          </Link>
        </div>

        {/* Pitches Tab */}
        <TabsContent value="pitches" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Your Pitches</CardTitle>
                <CardDescription>
                  Review and manage pitches for your playlists
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusFilter
                  selectedStatus={statusFilter}
                  onStatusChange={(status) =>
                    setStatusFilter(status as PitchStatusOption)
                  }
                  statusOptions={[
                    { value: "all", label: "All Pitches" },
                    { value: "placed", label: "Placed" },
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
                    <div
                      key={index}
                      className="h-64 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredPitches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No pitches found with the selected filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPitches.map((pitch) => (
                    <PitchCard
                      key={pitch.id}
                      id={pitch.id}
                      artwork={pitch.campaigns.artwork}
                      trackName={pitch.campaigns.trackName}
                      artistName={pitch.campaigns.artistName}
                      status={pitch.status}
                      created_at={pitch.created_at}
                      genres={pitch.genres}
                      subgenres={pitch.subgenres}
                      spotifyUrl={pitch.campaigns.trackUrl}
                      associatedPlaylists={pitch.associatedPlaylists}
                      onDecline={(feedback) =>
                        handleDeclinePitch(pitch.id, feedback)
                      }
                      onAccept={(
                        campaignsId: number,
                        selectedPlaylists: number[]
                      ) =>
                        handleAcceptPitch(
                          pitch.id,
                          campaignsId,
                          selectedPlaylists
                        )
                      }
                      campaignsId={pitch.campaigns_id}
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
                <CardTitle>Placements</CardTitle>
                <CardDescription>
                  Track and manage your playlist placements
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusFilter
                  selectedStatus={placementStatusFilter}
                  onStatusChange={(status) =>
                    setPlacementStatusFilter(status as PlacementStatusOption)
                  }
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
                    <div
                      key={index}
                      className="h-24 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : pitchPlacements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No placements found with the selected filter.
                  </p>

                  {/* Debug information */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-md text-left text-xs">
                    <h4 className="font-bold mb-2">Debug Information:</h4>
                    <p>Total Pitches: {pitches.length}</p>
                    <p>Accepted/Placed Pitches: {pitchPlacements.length}</p>
                    <p>Total Placements: {pitchPlacements.length}</p>
                    <p>Status Filter: {placementStatusFilter}</p>
                    <p>
                      Pitch Status Counts:{" "}
                      {Object.entries(
                        pitches.reduce((acc, p) => {
                          acc[p.status] = (acc[p.status] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .map(([status, count]) => `${status}: ${count}`)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {pitchPlacements.map((placement) => (
                    <PlacementPitchCard
                      key={placement.id}
                      placement={placement}
                      onConfirmPlacement={handleConfirmPlacement}
                      onRemoveFromPlaylist={handleRemoveFromPlaylist}
                    />
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
  );
}
