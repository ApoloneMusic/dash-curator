"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink, Music } from "lucide-react"
import { useState } from "react"

interface PlaylistCardProps {
  artwork?: string
  name: string
  followers: number
  tracks: number
  status: "active" | "inactive" | "pending" | "archived" | "unverified" | "verified"
  onEdit?: () => void
  playlistUrl?: string
}

export function PlaylistCard({ artwork, name, followers, tracks, status, onEdit, playlistUrl }: PlaylistCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-white glow-card animate-fade-in">
      <div className="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted/30">
        {artwork && !imageError ? (
          <img
            src={artwork}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover bg-muted/30"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50">
            <Music className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <h3 className="text-sm font-medium truncate">{name}</h3>

          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <Badge
              variant={
                status === "active" || status === "verified"
                  ? "secondary"
                  : status === "pending" || status === "unverified"
                    ? "outline"
                    : status === "inactive"
                      ? "default"
                      : "destructive"
              }
              className={`
                text-xs
                ${status === "active" || status === "verified" ? "bg-secondary/70 text-primary" : ""}
                ${status === "pending" || status === "unverified" ? "bg-muted text-muted-foreground" : ""}
                ${status === "inactive" ? "bg-muted/50 text-muted-foreground" : ""}
                ${status === "archived" ? "bg-destructive/10 text-destructive" : ""}
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">{followers.toLocaleString()} saves</p>
            <p className="text-xs text-muted-foreground">{tracks} tracks</p>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button size="sm" variant="outline" className="h-8 px-3 text-xs flex items-center gap-1" onClick={onEdit}>
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            {playlistUrl && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 flex items-center gap-1 glow-button"
                onClick={() => window.open(playlistUrl, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
                View on Spotify
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
