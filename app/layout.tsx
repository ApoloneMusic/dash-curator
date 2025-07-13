import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { debugEnvironment } from "@/lib/env-debug"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import 'react-international-phone/style.css'
import "./globals.css"

// Debug environment variables in development
if (typeof window !== "undefined") {
  console.log("Root layout client-side initialization")
  debugEnvironment()
}

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Apolone.Curator - Music Curation Platform",
  description: "A platform for music curators to manage playlists and submissions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
