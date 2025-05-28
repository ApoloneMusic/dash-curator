"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PitchCard } from "@/components/pitch-card";
import { StatusFilter } from "@/components/status-filter";
import { CreatePlaylistModal } from "@/components/create-playlist-modal";
import {
  EditPlaylistModal,
  type PlaylistData,
} from "@/components/edit-playlist-modal";
import Link from "next/link";
import { ListMusic, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import type { DeclineFeedback } from "@/components/decline-pitch-modal";
import { PlacementPitchCard } from "@/components/placement-pitch-card";

type StatusOption = "all" | "placed" | "accepted" | "declined" | "pitched";
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
  genre_id: number;
  subgenre_id: number[];
  created_at: string;
}

interface Pitch {
  id: number;
  campaigns_id: number;
  curators_id: number;
  playlists_id: number[]; // Changed to array to support multiple playlists
  status: string;
  matchScore: number;
  submissionDate: string;
  feedback?: string;
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

interface Placement {
  id: number;
  pitches_id: number;
  playlists_id: number;
  status: string;
  placedAt?: string;
  removedAt?: string;
  placementDate?: string;
  endDate?: string;
  daysRemaining?: number;
  trackName?: string;
  artistName?: string;
  playlistName?: string;
  artwork?: string;
  campaigns_id?: number;
}

// Enhanced pitch data for display
interface EnhancedPitch {
  id: number;
  campaigns_id: number;
  curators_id: number;
  playlists_id: number[];
  status: string;
  submissionDate: string;
  trackName: string;
  artistName: string;
  trackUrl: string;
  genre_id: number;
  subgenre_ids: number[];
  associatedPlaylists: {
    id: number;
    name: string;
    genres: { name: string; isMatch?: boolean }[];
  }[];
  artwork?: string;
}

export default function PitchesPage() {
  const [activeTab, setActiveTab] = useState("pitches");
  const [statusFilter, setStatusFilter] = useState<StatusOption>("all");
  const [placementStatusFilter, setPlacementStatusFilter] =
    useState<PlacementStatusOption>("all");
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [editPlaylistOpen, setEditPlaylistOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();

  // State for data
  const [pitches, setPitches] = useState<EnhancedPitch[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [subgenres, setSubgenres] = useState<Subgenre[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

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
      ]);

      // Parse JSON responses and ensure they're arrays
      const pitchesData = await pitchesResponse.json();
      const campaignsData = await campaignsResponse.json();
      const placementsData = await placementsResponse.json();
      const playlistsData = await playlistsResponse.json();
      const genresData = await genresResponse.json();
      const subgenresData = await subgenresResponse.json();

      console.log("Raw API responses:", {
        pitches: pitchesData,
        campaigns: campaignsData,
        placements: placementsData,
        playlists: playlistsData,
        genres: genresData,
        subgenres: subgenresData,
      });

      // Ensure all data is in array format
      const pitchesArray = Array.isArray(pitchesData)
        ? pitchesData
        : pitchesData.data || [];
      const campaignsArray = Array.isArray(campaignsData)
        ? campaignsData
        : campaignsData.data || [];
      const placementsArray = Array.isArray(placementsData)
        ? placementsData
        : placementsData.data || [];
      const playlistsArray = Array.isArray(playlistsData)
        ? playlistsData
        : playlistsData.data || [];
      const genresArray = Array.isArray(genresData)
        ? genresData
        : genresData.data || [];
      const subgenresArray = Array.isArray(subgenresData)
        ? subgenresData
        : subgenresData.data || [];

      // Store campaigns for later use
      setCampaigns(campaignsArray);

      // Filter pitches by curator ID
      const curatorId = Number(user.id);
      const curatorPitches = pitchesArray.filter(
        (pitch: Pitch) => pitch.curators_id === curatorId
      );

      // Enhance pitches with campaign and playlist data
      const enhancedPitches = curatorPitches.map((pitch: Pitch) => {
        // Get associated campaign
        const campaign = campaignsArray.find(
          (c: Campaign) => c.id === pitch.campaigns_id
        ) || {
          trackName: "Unknown Track",
          artistName: "Unknown Artist",
          trackUrl: "",
          genre_id: 0,
          subgenre_id: [],
        };

        // Ensure playlists_id is an array
        const playlistIds = Array.isArray(pitch.playlists_id)
          ? pitch.playlists_id
          : pitch.playlists_id
          ? [pitch.playlists_id]
          : [];

        // Get associated playlists
        const associatedPlaylists = playlistIds
          .map((playlistId) => {
            const playlist = playlistsArray.find(
              (p: Playlist) => p.id === playlistId
            );

            if (!playlist) return null;

            // Map playlist genres to objects with names
            const playlistGenres = (playlist.genres || []).map((genreId) => {
              const genre = genresArray.find((g) => g.id === genreId);
              return {
                name: genre ? genre.name : `Genre ${genreId}`,
                isMatch: campaign.genre_id === genreId,
              };
            });

            return {
              id: playlist.id,
              name: playlist.playlistName,
              genres:
                playlistGenres.length > 0
                  ? playlistGenres
                  : [{ name: "No genres", isMatch: false }],
            };
          })
          .filter(Boolean); // Remove null entries

        // Ensure subgenre_id is an array and filter out any null/undefined values
        const subgenreIds = Array.isArray(campaign.subgenre_id)
          ? campaign.subgenre_id.filter(Boolean)
          : campaign.subgenre_id
          ? [campaign.subgenre_id]
          : [];

        return {
          id: pitch.id,
          campaigns_id: pitch.campaigns_id,
          curators_id: pitch.curators_id,
          playlists_id: playlistIds,
          status: pitch.status,
          submissionDate: pitch.submissionDate || new Date().toISOString(),
          trackName: campaign.trackName,
          artistName: campaign.artistName,
          trackUrl: campaign.trackUrl,
          genre_id: campaign.genre_id,
          subgenre_ids: subgenreIds,
          associatedPlaylists: associatedPlaylists,
          // Assign a random artwork for demo purposes
          artwork: artworkImages[pitch.id % artworkImages.length],
        };
      });

      // Create placements from accepted and placed pitches if no placements exist
      let enhancedPlacements = [];

      // First, check if we have any placements in the API response
      if (placementsArray.length) {
        // Process existing placements from API
        enhancedPlacements = placementsArray
          .filter((placement: Placement) => {
            // Find the associated pitch
            const pitch = pitchesArray.find(
              (p: Pitch) => p.id === placement.pitches_id
            );
            // Check if the pitch belongs to this curator
            return pitch && pitch.curators_id === curatorId;
          })
          .map((placement: Placement) => {
            const pitch = pitchesArray.find(
              (p: Pitch) => p.id === placement.pitches_id
            );
            const campaign = pitch
              ? campaignsArray.find(
                  (c: Campaign) => c.id === pitch.campaigns_id
                )
              : null;
            const playlist = playlistsArray.find(
              (p: Playlist) => p.id === placement.playlists_id
            );

            // Calculate days remaining for placed pitches
            let daysRemaining = 30;
            if (placement.status === "placed" && placement.placedAt) {
              const placedDate = new Date(placement.placedAt);
              const endDate = new Date(placedDate);
              endDate.setDate(endDate.getDate() + 30);
              const now = new Date();
              const diffTime = endDate.getTime() - now.getTime();
              daysRemaining = Math.max(
                0,
                Math.floor(diffTime / (1000 * 60 * 60 * 24))
              );
            }

            return {
              ...placement,
              trackName: campaign ? campaign.trackName : "Unknown Track",
              artistName: campaign ? campaign.artistName : "Unknown Artist",
              playlistName: playlist
                ? playlist.playlistName
                : "Unknown Playlist",
              // Assign a random artwork for demo purposes
              artwork: campaign
                ? artworkImages[pitch.id % artworkImages.length]
                : "/placeholder.svg",
              daysRemaining,
              campaigns_id: pitch ? pitch.campaigns_id : undefined, // Add campaigns_id to the placement
            };
          });
      }

      // Combine real and demo placements
      enhancedPlacements = [...enhancedPlacements];

      console.log("Enhanced placements:", enhancedPlacements);

      // Store debug info for troubleshooting
      setDebugInfo({
        pitchesCount: enhancedPitches.length,
        placementsCount: enhancedPlacements.length,
        uniqueCampaignIds: [
          ...new Set(enhancedPlacements.map((p) => p.campaigns_id)),
        ].filter(Boolean),
        placementStatuses: enhancedPlacements.map((p) => p.status),
        hasCampaignsId: enhancedPlacements.every(
          (p) => p.campaigns_id !== undefined
        ),
      });

      setPitches(enhancedPitches);
      setPlacements(enhancedPlacements);
      setPlaylists(playlistsArray);
      setGenres(genresArray);
      setSubgenres(subgenresArray);

      // Add this logging to debug genre and subgenre data
      console.log(
        "Genres loaded:",
        genresArray.map((g) => ({ id: g.id, name: g.name }))
      );
      console.log(
        "Subgenres loaded:",
        subgenresArray.map((s) => ({
          id: s.id,
          name: s.name,
          genre_id: s.genre_id,
        }))
      );
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

  // Refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Map genre IDs to genre objects with names and match status
  const mapGenresToObjects = (
    genreId: number,
    playlistGenreIds: number[] = []
  ) => {
    if (!genreId) {
      console.log("No genre ID provided");
      return [];
    }

    const genre = genres.find((g) => g.id === genreId);
    if (!genre) {
      console.log(
        `Genre with ID ${genreId} not found in genres array. Available IDs:`,
        genres.map((g) => g.id)
      );

      // Try to find a genre with a string ID that matches the number
      const genreWithStringId = genres.find(
        (g) => String(g.id) === String(genreId)
      );
      if (genreWithStringId) {
        return [
          {
            name: genreWithStringId.name,
            isMatch: playlistGenreIds.includes(Number(genreWithStringId.id)),
            id: genreId,
          },
        ];
      }

      return [
        { name: `Unknown Genre (${genreId})`, isMatch: false, id: genreId },
      ];
    }

    return [
      {
        name: genre.name,
        isMatch: playlistGenreIds.includes(genreId),
        id: genreId,
      },
    ];
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
      console.log("No valid subgenre IDs provided");
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
            .filter(Boolean)
      );

      // Map genre and subgenre IDs to objects with names and match status
      const genreObjects = mapGenresToObjects(
        pitch.genre_id,
        allPlaylistGenreIds
      );
      const subgenreObjects = mapSubgenresToObjects(pitch.subgenre_ids, []);

      // For clarity, if no genres/subgenres, use clear placeholder data
      const finalGenres =
        genreObjects.length > 0
          ? genreObjects
          : [{ name: "No Genre Information", isMatch: false }];

      const finalSubgenres =
        subgenreObjects.length > 0
          ? subgenreObjects
          : [{ name: "No Subgenre Information", isMatch: false }];

      // Format submission date
      const formattedDate = new Date(pitch.submissionDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      return {
        id: pitch.id,
        artwork: pitch.artwork || "/placeholder.svg",
        trackName: pitch.trackName,
        artistName: pitch.artistName,
        status: pitch.status as "placed" | "accepted" | "declined" | "pitched",
        submissionDate: formattedDate,
        genres: finalGenres,
        subgenres: finalSubgenres,
        spotifyUrl:
          pitch.trackUrl ||
          "https://open.spotify.com/track/17phhZDn6oGtzMe56NuWvj",
        associatedPlaylists: pitch.associatedPlaylists,
        campaignsId: pitch.campaigns_id,
      };
    });
  }, [pitches, genres, subgenres]);

  const validPitches = useMemo(() => {
    return transformedPitches.filter(
      (pitch) =>
        pitch.status === "pitched" ||
        pitch.status === "placed" ||
        pitch.status === "declined" ||
        pitch.status === "accepted"
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
      // If we're not filtering, put pitched first
      if (statusFilter === "all") {
        if (a.status === "pitched" && b.status !== "pitched") return -1;
        if (a.status !== "pitched" && b.status === "pitched") return 1;
      }

      // Otherwise sort by submission date (newest first)
      return (
        new Date(b.submissionDate).getTime() -
        new Date(a.submissionDate).getTime()
      );
    });
  }, [validPitches, statusFilter]);

  // Get pitches with status "accepted" or "placed" for the Placements tab
  const placementPitches = useMemo(() => {
    // Filter pitches to only include those with status "accepted" or "placed"
    return pitches.filter(
      (pitch) => pitch.status === "accepted" || pitch.status === "placed"
    );
  }, [pitches]);

  // Group placements by pitch ID
  const pitchPlacements = useMemo(() => {
    console.log("Preparing pitch placements for display", placementPitches);

    // First, ensure we only use pitches with status "accepted" or "placed"
    const validPitchIds = placementPitches.map((pitch) => pitch.id);
    // Filter placements to only include those associated with valid pitches
    const validPlacements = placements.filter(
      (placement) =>
        validPitchIds.includes(placement.pitches_id) &&
        (placement.status === "placed" || placement.status === "accepted")
    );

    // Apply additional filter based on user selection
    const filteredPlacements =
      placementStatusFilter === "all"
        ? validPlacements
        : validPlacements.filter((p) => p.status === placementStatusFilter);

    // console.log("Filtered placements:", filteredPlacements);

    // Transform into pitch placement objects
    const pitchPlacementsList = validPitchIds
      .map((pitchId) => {
        // Find the corresponding pitch
        const pitch = placementPitches.find((p) => p.id === pitchId);

        if (!pitch) {
          return null;
        }

        // Get associated playlists directly from the pitch data
        const associatedPlaylists = pitch.associatedPlaylists.map(
          (playlist) => ({
            id: playlist.id,
            name: playlist.name,
          })
        );

        return {
          id: pitchId,
          trackName: pitch.trackName,
          artistName: pitch.artistName,
          artwork: pitch.artwork || "/placeholder.svg",
          status: pitch.status,
          submissionDate: pitch.submissionDate,
          spotifyUrl: pitch.trackUrl || "",
          playlists: associatedPlaylists,
          campaignId: pitch.campaigns_id,
        };
      })
      .filter(Boolean) // Remove null entries
      .sort((a, b) => {
        // Sort by status priority: accepted first, then placed
        if (a.status === "accepted" && b.status !== "accepted") return -1;
        if (a.status !== "accepted" && b.status === "accepted") return 1;

        // Then sort by submission date (newest first)
        return (
          new Date(b.submissionDate).getTime() -
          new Date(a.submissionDate).getTime()
        );
      });

    console.log("Final pitch placements list:", pitchPlacementsList);
    return pitchPlacementsList;
  }, [placementPitches, placements, placementStatusFilter]);

  // Handle confirm placement
  const handleConfirmPlacement = async (id: number) => {
    try {
      console.log("Confirming placement for pitch ID:", id);

      // Find the pitch
      const selectedPlacements = placements.filter((p) => p.pitches_id === id);
      if (!selectedPlacements.length) {
        throw new Error("Placement not found");
      }

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

      const placementPromises = selectedPlacements.map(async (placementObj) => {
        try {
          const updatePlacementResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/${placementObj.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...placementObj,
                status: "placed",
                placedAt: new Date().toISOString(),
              }),
            }
          );

          if (!updatePlacementResponse.ok) {
            console.error(`Failed to update placement ${placement.id}`);
          }
          return await updatePlacementResponse.json();
        } catch (placementError) {
          console.error(
            `Error creating placement for playlist ${playlistId}:`,
            placementError
          );
          // Continue with other placements even if one fails
          return null;
        }
      });

      const placementResults = await Promise.all(placementPromises);
      const successfulPlacements = placementResults.filter(Boolean);

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

      // Update local state - update all placements for this pitch
      setPlacements((prev) =>
        prev.map((p) =>
          p.pitches_id === id
            ? {
                ...p,
                status: "placed",
                placedAt: new Date().toISOString(),
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
        console.log("Campaign data:", campaignData);
        const updatedCampaignRes = await fetch(
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

      const curatorProfileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user?.id}`
      );

      if (!curatorProfileRes.ok) {
        const curatorProfileErrorRes = await curatorProfileRes.text();
        console.error("Failed to get curator profile:", curatorProfileErrorRes);
        // Don't throw an error here, as we've already updated the pitch status
      } else {
        const curatorProfileData = await curatorProfileRes.json();
        console.log("Curator profile Data:", curatorProfileData);
        const curatorUpdatedProfile = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${user?.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...curatorProfileData,
              credits: curatorProfileData.credits + 1,
              accepted: curatorProfileData.declined + 1,
            }),
          }
        );
      }

      // Show success toast
      toast({
        title: "Placement Confirmed",
        description: "The track has been confirmed as placed in the playlist.",
      });

      console.log("Placement confirmed successfully");
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
      console.log("Removing from playlist for pitch ID:", id);

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

      // Also update all placements for this pitch
      const pitchPlacements = placements.filter((p) => p.pitches_id === id);

      for (const placement of pitchPlacements) {
        const placementResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/${placement.id}`,
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

        if (!placementResponse.ok) {
          console.error(`Failed to update placement ${placement.id}`);
        }
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

      // Update local state - update all placements for this pitch
      setPlacements((prev) =>
        prev.map((p) =>
          p.pitches_id === id
            ? {
                ...p,
                status: "closed",
                removedAt: new Date().toISOString(),
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

      console.log("Removal confirmed successfully");
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

      console.log("Sending feedback data:", feedbackData);

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
      } else {
        const feedbackResult = await feedbackResponse.json();
        console.log("Feedback stored successfully:", feedbackResult);
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
        console.log("Curator profile Data:", curatorProfileData);
        const curatorUpdatedProfile = await fetch(
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
        const updatedCampaignRes = await fetch(
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

      // Create a new placement in the database for each playlist
      const placementPromises = playlists_id.map(async (playlistId) => {
        try {
          const placementResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/placements`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pitches_id: pitchId,
                playlists_id: playlistId,
                status: "accepted", // Changed from "pending" to "accepted"
                createdAt: new Date().toISOString(),
                campaigns_id: acceptedPitch.campaigns_id, // Include campaigns_id,
                curators_id: user?.id,
              }),
            }
          );

          if (!placementResponse.ok) {
            const placementErrorText = await placementResponse.text();
            console.error(
              `Placement API Error for playlist ${playlistId}:`,
              placementErrorText
            );
            throw new Error(
              `Failed to create placement: ${placementResponse.status} ${placementResponse.statusText}`
            );
          }

          return await placementResponse.json();
        } catch (placementError) {
          console.error(
            `Error creating placement for playlist ${playlistId}:`,
            placementError
          );
          // Continue with other placements even if one fails
          return null;
        }
      });

      const placementResults = await Promise.all(placementPromises);
      const successfulPlacements = placementResults.filter(Boolean);

      // Update local state
      refreshData();

      // Add to placements with enhanced data
      setPlacements((prev) => [
        ...prev,
        ...successfulPlacements.map((newPlacement) => ({
          ...newPlacement,
          trackName: acceptedPitch.trackName,
          artistName: acceptedPitch.artistName,
          playlistName:
            acceptedPitch.associatedPlaylists.find(
              (p) => p.id === newPlacement.playlists_id
            )?.name || "Unknown Playlist",
          artwork: acceptedPitch.artwork,
          status: "accepted", // Ensure status is set to "accepted"
          campaigns_id: acceptedPitch.campaigns_id, // Include campaigns_id
        })),
      ]);

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
        onValueChange={setActiveTab}
      >
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
                <CardDescription>
                  Review and manage pitches for your playlists
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusFilter
                  selectedStatus={statusFilter}
                  onStatusChange={setStatusFilter}
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
                      className="h-64 rounded-lg bg-gray-100 animate-pulse"
                    ></div>
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
                      artwork={pitch.artwork}
                      trackName={pitch.trackName}
                      artistName={pitch.artistName}
                      status={pitch.status}
                      submissionDate={pitch.submissionDate}
                      genres={pitch.genres}
                      subgenres={pitch.subgenres}
                      spotifyUrl={pitch.spotifyUrl}
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
                      className="h-24 rounded-lg bg-gray-100 animate-pulse"
                    ></div>
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
                    <p>Accepted/Placed Pitches: {placementPitches.length}</p>
                    <p>Total Placements: {placements.length}</p>
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
                    {/* <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Force create demo data
                          const demoPitches = [];
                          const demoPlacements = [];

                          for (let i = 0; i < 3; i++) {
                            const campaignId = 1000 + i;
                            const pitchId = 6000 + i;
                            const statuses = ["accepted", "placed"];

                            // Create a pitch for each status
                            const status = statuses[i % statuses.length];

                            // Create the pitch if it doesn't exist
                            if (!pitches.some((p) => p.id === pitchId)) {
                              demoPitches.push({
                                id: pitchId,
                                campaigns_id: campaignId,
                                curators_id: Number(user.id),
                                playlists_id: [i + 1, i + 2],
                                status: status,
                                submissionDate: new Date().toISOString(),
                                trackName: `Demo Track ${i + 1}`,
                                artistName: `Demo Artist ${i + 1}`,
                                trackUrl:
                                  "https://open.spotify.com/track/17phhZDn6oGtzMe56NuWvj",
                                genre_id: 1,
                                subgenre_ids: [],
                                associatedPlaylists: [
                                  {
                                    id: i + 1,
                                    name: `Demo Playlist ${i + 1}`,
                                    genres: [
                                      { name: "Demo Genre", isMatch: true },
                                    ],
                                  },
                                  {
                                    id: i + 2,
                                    name: `Demo Playlist ${i + 2}`,
                                    genres: [
                                      { name: "Demo Genre", isMatch: true },
                                    ],
                                  },
                                ],
                                artwork:
                                  artworkImages[i % artworkImages.length],
                              });
                            }

                            // Create placements for each playlist
                            for (let j = 0; j < 2; j++) {
                              const playlistId = i + j + 1;

                              demoPlacements.push({
                                id: 5000 + i * 10 + j,
                                pitches_id: pitchId,
                                playlists_id: playlistId,
                                status: status,
                                placedAt:
                                  status === "placed"
                                    ? new Date().toISOString()
                                    : undefined,
                                trackName: `Demo Track ${i + 1}`,
                                artistName: `Demo Artist ${i + 1}`,
                                playlistName: `Demo Playlist ${playlistId}`,
                                artwork:
                                  artworkImages[i % artworkImages.length],
                                daysRemaining:
                                  status === "placed" ? 30 - j : undefined,
                                campaigns_id: campaignId,
                              });
                            }
                          }

                          // Update state with new demo data
                          setPitches((prev) => [...prev, ...demoPitches]);
                          setPlacements((prev) => [...prev, ...demoPlacements]);

                          toast({
                            title: "Demo Data Created",
                            description:
                              "Created demo pitches and placements for testing",
                          });
                        }}
                      >
                        Create Demo Data
                      </Button>
                    </div> */}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {pitchPlacements.map((pitch) => (
                    <PlacementPitchCard
                      key={pitch.id}
                      id={pitch.id}
                      artwork={pitch.artwork}
                      trackName={pitch.trackName}
                      artistName={pitch.artistName}
                      status={pitch.status as "accepted" | "placed" | "closed"}
                      submissionDate={new Date(
                        pitch.submissionDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      spotifyUrl={pitch.spotifyUrl}
                      playlists={pitch.playlists}
                      campaignId={pitch.campaignId}
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
