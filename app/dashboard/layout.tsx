import type React from "react"
import { Header } from "@/components/header"
import { PersistentSpotifyPlayer } from "@/components/persistent-spotify-player"
import { PlayerProvider } from "@/contexts/player-context"
import ProtectedRoute from "@/components/protected-route"
import { VerificationBanner } from "@/components/verification-banner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <PlayerProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-gray-50 pb-20">
            <div className="flex-1 overflow-auto p-6">
              <VerificationBanner />
              {children}
            </div>
          </main>
          <PersistentSpotifyPlayer />
        </div>
      </PlayerProvider>
    </ProtectedRoute>
  )
}
