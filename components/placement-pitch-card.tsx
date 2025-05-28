"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ExternalLink, Music, X } from "lucide-react";
import { SpotifyEmbed } from "./spotify-embed";
import { ConfirmPlacementModal } from "./confirm-placement-modal";

interface PlaylistInfo {
  id: number;
  name: string;
}

interface PlacementPitchCardProps {
  id: number;
  artwork: string;
  trackName: string;
  artistName: string;
  status: "accepted" | "placed" | "closed";
  submissionDate: string;
  spotifyUrl: string;
  playlists: PlaylistInfo[];
  campaignId: number;
  onConfirmPlacement: (id: number) => Promise<void>;
  onRemoveFromPlaylist: (id: number) => Promise<void>;
}

export function PlacementPitchCard({
  id,
  artwork,
  trackName,
  artistName,
  status,
  submissionDate,
  spotifyUrl,
  playlists,
  campaignId,
  onConfirmPlacement,
  onRemoveFromPlaylist,
}: PlacementPitchCardProps) {
  const [confirmPlacementOpen, setConfirmPlacementOpen] = useState(false);
  const [confirmRemovalOpen, setConfirmRemovalOpen] = useState(false);

  // Get status badge styling
  const getStatusBadgeStyle = () => {
    switch (status) {
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "placed":
        return "bg-green-50 text-green-700 border-green-200";
      case "closed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Get status display text
  const getStatusText = () => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "placed":
        return "Placed";
      case "closed":
        return "Closed";
      case "pitched":
        return "Pitched";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="relative border rounded-lg bg-white shadow-sm p-6">
      {/* Status badge in the top right corner */}
      <div className="absolute top-4 right-4">
        <Badge
          variant="outline"
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeStyle()}`}
        >
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
          <p className="text-sm text-gray-500">Submitted: {submissionDate}</p>
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

        {playlists.length === 0 ? (
          <p className="text-sm text-gray-500">
            No playlists associated with this pitch.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {playlists.map((playlist) => (
              <Badge
                key={`playlist-${playlist.id}`}
                variant="outline"
                className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700"
              >
                {playlist.name}
              </Badge>
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
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Spotify
            </a>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {status === "accepted" && (
          <Button
            className="px-4 py-2 text-sm bg-green-700 hover:bg-green-800 text-white flex items-center gap-1"
            onClick={() => setConfirmPlacementOpen(true)}
          >
            <Check className="h-4 w-4" />
            Confirm Placement
          </Button>
        )}
        {status === "placed" && (
          <Button
            variant="outline"
            className="px-4 py-2 text-sm flex items-center gap-1 border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => setConfirmRemovalOpen(true)}
          >
            <X className="h-4 w-4" />
            Remove from Playlists
          </Button>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmPlacementModal
        open={confirmPlacementOpen}
        onOpenChange={setConfirmPlacementOpen}
        title="Confirm Track Placement"
        description="Only confirm if the track is placed in the playlist. Confirmation of placement before placement is a violation of terms."
        confirmText="Confirm Placement"
        onConfirm={async () => {
          await onConfirmPlacement(id);
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
          await onRemoveFromPlaylist(id);
        }}
      />
    </Card>
  );
}
