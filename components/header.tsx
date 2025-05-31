"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Coins, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return "CU"

    const nameParts = user.name.split(" ")
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()

    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#1e4620]">
              Apolone<span className="text-[#e74c3c]">.</span>Curator
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6"></nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-secondary/20 px-3 py-1.5 rounded-full">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{user?.credits || 0} credits</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-profile-avatar.png" alt={user?.name || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <span>{user?.credits || 0} credits</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link href="/dashboard/pitches" className="block py-2 text-base font-medium text-[#1e4620]">
            Pitches
          </Link>
          <Link
            href="/dashboard/playlists"
            className="block py-2 text-base font-medium text-gray-600 hover:text-[#1e4620]"
          >
            Playlists
          </Link>
          <div className="flex items-center gap-2 py-2">
            <Coins className="h-4 w-4 text-[#1e4620]" />
            <span className="text-sm font-medium">{user?.credits || 0} credits</span>
          </div>
          <button
            className="flex w-full items-center gap-2 py-2 text-base font-medium text-gray-600 hover:text-[#1e4620]"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
