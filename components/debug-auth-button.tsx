"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { debugAuth, forceRedirect } from "@/lib/auth-debug"

export function DebugAuthButton() {
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Only show in development or if explicitly enabled
  const isVisible = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "true"

  if (!isVisible) return null

  const handleDebug = () => {
    const info = debugAuth()
    setDebugInfo(info)
    setShowDebug(true)
  }

  const handleForceRedirect = () => {
    forceRedirect("/dashboard/pitches")
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleDebug}>
          Debug Auth
        </Button>

        <Button type="button" variant="outline" size="sm" onClick={handleForceRedirect}>
          Force Redirect
        </Button>
      </div>

      {showDebug && debugInfo && (
        <div className="mt-2 rounded border p-2 text-xs">
          <pre className="overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
