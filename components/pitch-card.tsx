"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Music, X } from "lucide-react";
import { useState } from "react";
import { AcceptPitchModal } from "./accept-pitch-modal";
import { DeclinePitchModal, type DeclineFeedback } from "./decline-pitch-modal";
import { SpotifyEmbed } from "./spotify-embed";

interface Genre {
  name: string;
  isMatch?: boolean;
}

interface AssociatedPlaylist {
  id: number;
  name: string;
  genres: Genre[];
}

interface PitchCardProps {
  id: number;
  artwork?: string;
  trackName: string;
  artistName: string;
  status: "pitched" | "accepted" | "declined" | "placed";
  created_at: string;
  genres: { name: string; isMatch?: boolean }[];
  subgenres: { name: string; isMatch?: boolean }[];
  spotifyUrl: string;
  associatedPlaylists: {
    id: number;
    name: string;
    genres: { name: string; isMatch?: boolean }[];
  }[];
  onDecline: (feedback: DeclineFeedback) => void;
  onAccept: (campaignsId: number, selectedPlaylists: number[]) => Promise<void>;
  campaignsId: number;
}

export function PitchCard({
  id,
  artwork,
  trackName,
  artistName,
  status,
  created_at,
  genres,
  subgenres,
  spotifyUrl,
  associatedPlaylists,
  onDecline,
  onAccept,
  campaignsId,
}: PitchCardProps) {
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);

  const handleDecline = (feedback: DeclineFeedback) => {
    if (onDecline) {
      onDecline(feedback);
    }
  };

  // Get status badge styling
  const getStatusBadgeStyle = () => {
    switch (status) {
      case "pitched":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "placed":
        return "bg-green-50 text-green-700 border-green-200";
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "declined":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Get status display text
  const getStatusText = () => {
    switch (status) {
      case "pitched":
        return "Pending";
      case "placed":
        return "Placed";
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="relative border rounded-lg bg-white shadow-sm p-6">
      {/* Status badge in the top right corner */}
      <div className="absolute top-4 right-4">
        <Badge
          variant="outline"
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeStyle()}`}>
          {getStatusText()}
        </Badge>
      </div>

      {/* Track header section with artwork and basic info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
          <img
            src={artwork || "/placeholder.svg?height=64&width=64&query=music"}
            alt={`${trackName} by ${artistName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 pr-24">
          <h3 className="text-xl font-semibold truncate">{trackName}</h3>
          <p className="text-gray-600 text-base mb-1">{artistName}</p>
          <p className="text-sm text-gray-500">
            Submitted:{" "}
            {new Date(created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Genre and Subgenre section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Genres</p>
          <div className="flex flex-wrap gap-2">
            {genres.length > 0 && !genres[0].name.startsWith("No Genre") ? (
              genres.map((genre, index) => (
                <Badge
                  key={`genre-${index}`}
                  variant="outline"
                  className={`text-sm px-3 py-1 rounded-full ${
                    genre.isMatch
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-600"
                  }`}>
                  {genre.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">
                No genre information available
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Subgenres</p>
          <div className="flex flex-wrap gap-2">
            {subgenres.length > 0 &&
            !subgenres[0].name.startsWith("No Subgenre") ? (
              subgenres.map((subgenre, index) => (
                <Badge
                  key={`subgenre-${index}`}
                  variant="outline"
                  className={`text-sm px-3 py-1 rounded-full ${
                    subgenre.isMatch
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-600"
                  }`}>
                  {subgenre.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">
                No subgenre information available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Spotify Embed */}
      {spotifyUrl && (
        <div className="mb-6">
          <SpotifyEmbed spotifyUrl={spotifyUrl} />
        </div>
      )}

      {/* Associated Playlists section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <Music className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Associated Playlists</h4>
        </div>

        {associatedPlaylists.length === 0 ? (
          <p className="text-sm text-gray-500">
            No playlists associated with this pitch.
          </p>
        ) : (
          <div className="space-y-3">
            {associatedPlaylists.map((playlist) => (
              <div key={playlist.id} className="flex flex-col">
                <p className="text-sm font-medium">{playlist.name}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {playlist.genres.map((genre, index) => (
                    <Badge
                      key={`playlist-genre-${playlist.id}-${index}`}
                      variant="outline"
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Spotify Link */}
        {spotifyUrl && (
          <div className="mt-3 flex justify-end">
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline">
              <ExternalLink className="h-4 w-4" />
              Open in Spotify
            </a>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {status === "pitched" && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm flex items-center gap-1 border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => setDeclineModalOpen(true)}>
            <X className="h-4 w-4" />
            Decline
          </Button>
          <Button
            className="px-4 py-2 text-sm bg-green-700 hover:bg-green-800 text-white flex items-center gap-1"
            onClick={() => setAcceptModalOpen(true)}>
            <Check className="h-4 w-4" />
            Accept
          </Button>
        </div>
      )}

      {/* Decline Pitch Modal */}
      <DeclinePitchModal
        open={declineModalOpen}
        onOpenChange={setDeclineModalOpen}
        trackName={trackName}
        artistName={artistName}
        onDecline={handleDecline}
      />

      {/* Accept Pitch Modal */}
      <AcceptPitchModal
        open={acceptModalOpen}
        onOpenChange={setAcceptModalOpen}
        trackName={trackName}
        artistName={artistName}
        playlistName={associatedPlaylists[0]?.name || ""}
        onAccept={onAccept}
        pitchId={id}
        campaignsId={campaignsId}
      />
    </div>
  );
}
