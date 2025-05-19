// Utility to help debug redirection issues
export function logRedirectAttempt(from: string, to: string, reason: string) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] Redirect attempt: ${from} → ${to} (Reason: ${reason})`)

  // In development, also log to localStorage for persistence
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    try {
      const logs = JSON.parse(localStorage.getItem("redirect_logs") || "[]")
      logs.push({ timestamp, from, to, reason })
      localStorage.setItem("redirect_logs", JSON.stringify(logs.slice(-20))) // Keep last 20 logs
    } catch (e) {
      console.warn("Could not log to localStorage:", e)
    }
  }
}

// Function to check if we're in a potential redirection loop
export function detectRedirectLoop(pathname: string): boolean {
  if (typeof window === "undefined") return false

  try {
    // Get navigation history from sessionStorage
    const history = JSON.parse(sessionStorage.getItem("navigation_history") || "[]")

    // Add current path to history
    history.push({ path: pathname, timestamp: Date.now() })

    // Keep only last 10 navigations
    const recentHistory = history.slice(-10)
    sessionStorage.setItem("navigation_history", JSON.stringify(recentHistory))

    // Check for patterns indicating a loop
    if (recentHistory.length >= 4) {
      // Count occurrences of each path
      const pathCounts: Record<string, number> = {}
      recentHistory.forEach((entry: { path: string }) => {
        pathCounts[entry.path] = (pathCounts[entry.path] || 0) + 1
      })

      // If any path appears 3+ times in recent history, we might be in a loop
      return Object.values(pathCounts).some((count) => count >= 3)
    }
  } catch (e) {
    console.warn("Error checking for redirect loops:", e)
  }

  return false
}
