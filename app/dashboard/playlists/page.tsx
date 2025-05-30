"use client";

import { AddPlaylistModal } from "@/components/add-playlist-modal";
import {
  EditPlaylistModal,
  type PlaylistData,
} from "@/components/edit-playlist-modal";
import { PlaylistCard } from "@/components/playlist-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { spotifyService } from "@/lib/spotify-service";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
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

interface Playlist {
  id: number;
  curators_id: number;
  playlistName: string;
  playlistUrl: string;
  description: string;
  saves?: number | undefined;
  tier: number;
  status: string;
  score: number;
  genres: number[];
  subgenres: number[];
  updatedAt: number;
  created_at: number;
  artwork?: string;
  track_count?: number;
}

export default function PlaylistsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [subgenres, setSubgenres] = useState<Subgenre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistData | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(false);

  // Fallback artwork images for when Spotify API fails
  const fallbackArtworkImages = [
    "/electronic-playlist.png",
    "/indie-playlist-cover.png",
    "/hip-hop-playlist.png",
  ];

  // Fetch playlists, genres, and subgenres
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel for efficiency
        const [playlistsResponse, genresResponse, subgenresResponse] =
          await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists?curators_id=${user.id}`
            ),
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/genre`),
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subgenre`),
          ]);

        const playlistsData = await playlistsResponse.json();
        const genresData = await genresResponse.json();
        const subgenresData = await subgenresResponse.json();

        setPlaylists(playlistsData);
        setGenres(genresData);
        setSubgenres(subgenresData);

        // Fetch artwork for each playlist
        syncPlaylists(playlistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load playlists. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data once on initial load
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  // Fetch artwork for playlists
  const syncPlaylists = async (playlistsToSync: Playlist[]) => {
    setIsLoadingArtwork(true);

    try {
      // Filter playlists that need syncing (have undefined values)
      const playlistsNeedingSync = playlistsToSync.filter(
        (playlist) =>
          playlist.playlistUrl &&
          (!playlist.artwork ||
            playlist.track_count == null ||
            playlist.saves == null)
      );

      if (playlistsNeedingSync.length === 0) {
        setIsLoadingArtwork(false);
        return;
      }

      // Create an array of promises for fetching artwork
      const artworkPromises = playlistsNeedingSync.map(async (playlist) => {
        try {
          const spotifyPlaylist = await spotifyService.getPlaylistByUrl(
            playlist.playlistUrl
          );

          const updatedData = {
            artwork: spotifyPlaylist.images?.[0]?.url,
            track_count: spotifyPlaylist.tracks.total,
            saves: spotifyPlaylist.followers.total,
          };

          // Update the database with the new data in background
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlist.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedData),
            }
          );

          return {
            id: playlist.id,
            ...updatedData,
          };
        } catch (error) {
          console.error(`Error syncing playlist ${playlist.id}:`, error);
          return null;
        }
      });

      // Wait for all artwork fetches to complete
      const artworkResults = await Promise.all(artworkPromises);

      // Update playlists with fetched artwork
      setPlaylists((prevPlaylists) => {
        return prevPlaylists.map((playlist) => {
          const artworkResult = artworkResults.find(
            (result) => result && result.id === playlist.id
          );
          if (!artworkResult) {
            return playlist;
          }
          return {
            ...playlist,
            artwork:
              artworkResult.artwork ||
              playlist.artwork ||
              fallbackArtworkImages[playlist.id % fallbackArtworkImages.length],
            track_count: artworkResult.track_count ?? playlist.track_count,
            saves: artworkResult.saves ?? playlist.saves,
          };
        });
      });
    } catch (error) {
      console.error("Error syncing playlists:", error);
      toast({
        title: "Error",
        description: "Failed to sync some playlists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingArtwork(false);
    }
  };

  // Map genre IDs to names
  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean);
  };

  // Map subgenre IDs to names
  const getSubgenreNames = (subgenreIds: number[]) => {
    return subgenreIds
      .map((id) => subgenres.find((subgenre) => subgenre.id === id)?.name)
      .filter(Boolean);
  };

  // Handle playlist update
  const handleUpdatePlaylist = async (updatedPlaylist: PlaylistData) => {
    // Verify user is authenticated
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update playlists.",
        variant: "destructive",
      });
      return;
    }

    // Ensure we have a valid user ID
    const curatorId = Number(user.id);
    if (isNaN(curatorId) || curatorId <= 0) {
      toast({
        title: "User ID Error",
        description: "Invalid user ID. Please log out and log back in.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Find the original playlist
      const originalPlaylist = playlists.find(
        (p) => p.id === updatedPlaylist.id
      );
      if (!originalPlaylist) {
        throw new Error("Playlist not found");
      }

      // Find genre IDs from names
      const genreIds = updatedPlaylist.genres
        ? (updatedPlaylist.genres
            .map((name) => {
              const genre = genres.find((g) => g.name === name);
              return genre ? genre.id : null;
            })
            .filter((id) => id !== null) as number[])
        : [];

      // Find subgenre IDs from names
      const subgenreIds = updatedPlaylist.subgenres
        ? (updatedPlaylist.subgenres
            .map((name) => {
              const subgenre = subgenres.find((s) => s.name === name);
              return subgenre ? subgenre.id : null;
            })
            .filter((id) => id !== null) as number[])
        : [];

      // Prepare data for PATCH request
      const updateData = {
        // Always include curator ID in the update request
        curators_id: curatorId,
        genres: genreIds.length > 0 ? genreIds : originalPlaylist.genres,
        subgenres:
          subgenreIds.length > 0 ? subgenreIds : originalPlaylist.subgenres,
        description:
          updatedPlaylist.description || originalPlaylist.description,
        saves: updatedPlaylist.followers,
        // Keep other fields unchanged
        playlistName: originalPlaylist.playlistName,
        playlistUrl: originalPlaylist.playlistUrl,
        status: originalPlaylist.status,
      };

      console.log("Sending update with data:", updateData);

      // Send PATCH request to API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${updatedPlaylist.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(
          errorData.message || `Failed to update playlist: ${response.status}`
        );
      }

      // Get updated playlist from response
      const updatedData = await response.json();

      // Update local state with the response from the server
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === updatedPlaylist.id
            ? {
                ...updatedData,
                artwork: originalPlaylist.artwork, // Preserve the artwork
              }
            : playlist
        )
      );

      toast({
        title: "Success",
        description: "Playlist updated successfully",
      });
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle playlist deletion
  const handleDeletePlaylist = async (playlistId: number) => {
    // Verify user is authenticated
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to delete playlists.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Send DELETE request to API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(
          errorData.message || `Failed to delete playlist: ${response.status}`
        );
      }

      // Update local state
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.id !== playlistId)
      );

      toast({
        title: "Success",
        description: "Playlist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal for a playlist
  const openEditModal = (playlist: Playlist) => {
    // Find genre names
    const genreNames = getGenreNames(playlist.genres) as string[];

    // Find subgenre names
    const subgenreNames = getSubgenreNames(playlist.subgenres) as string[];

    // Convert playlist to PlaylistData format
    const playlistData: PlaylistData = {
      id: playlist.id,
      name: playlist.playlistName,
      artwork:
        playlist.artwork ||
        fallbackArtworkImages[playlist.id % fallbackArtworkImages.length],
      followers: playlist.saves ?? 0,
      tracks: playlist.track_count ?? 0,
      status: playlist.status,
      description: playlist.description,
      genres: genreNames,
      subgenres: subgenreNames,
    };

    setEditingPlaylist(playlistData);
    setIsEditModalOpen(true);
  };

  // Refresh playlists - separate from the initial load
  const refreshPlaylists = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to refresh playlists.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return; // Prevent multiple simultaneous refreshes

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`
      );
      const data = await response.json();

      // Filter playlists by curator ID
      const curatorPlaylists = data.filter(
        (playlist: Playlist) => playlist.curators_id === Number(user.id)
      );

      setPlaylists(curatorPlaylists);

      // Only sync playlists that have undefined values
      const playlistsNeedingSync = curatorPlaylists.filter(
        (p: Playlist) => !p.artwork || !p.track_count || !p.saves
      );
      if (playlistsNeedingSync.length > 0) {
        syncPlaylists(playlistsNeedingSync);
      }

      toast({
        title: "Success",
        description: "Playlists refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing playlists:", error);
      toast({
        title: "Error",
        description: "Failed to refresh playlists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle playlist added
  const handlePlaylistAdded = async () => {
    await refreshPlaylists();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-1 w-fit">
            <Link href="/dashboard/pitches">
              <ArrowLeft className="h-4 w-4" />
              Back to Pitches
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Your Playlists</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your Spotify playlists
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPlaylists}
            disabled={isLoading || isLoadingArtwork}
            className="flex items-center gap-1">
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading || isLoadingArtwork ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-1 glow-button"
            onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Playlist
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-lg bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No playlists found</h3>
          <p className="text-muted-foreground mt-1">
            You don't have any playlists yet. Add a playlist to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              artwork={playlist.artwork}
              name={playlist.playlistName}
              followers={playlist.saves ?? 0}
              tracks={playlist.track_count ?? 0}
              status={
                playlist.status as
                  | "active"
                  | "inactive"
                  | "pending"
                  | "archived"
                  | "unverified"
                  | "verified"
              }
              onEdit={() => openEditModal(playlist)}
              playlistUrl={playlist.playlistUrl}
            />
          ))}
        </div>
      )}

      {/* Edit Playlist Modal */}
      {editingPlaylist && (
        <EditPlaylistModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          playlist={editingPlaylist}
          onUpdate={handleUpdatePlaylist}
          onDelete={handleDeletePlaylist}
        />
      )}

      {/* Add Playlist Modal */}
      <AddPlaylistModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onPlaylistAdded={handlePlaylistAdded}
        genres={genres}
        subgenres={subgenres}
      />
    </div>
  );
}
