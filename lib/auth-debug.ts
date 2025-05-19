// Utility for debugging authentication issues

export function debugAuth() {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("auth_token")
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1]

  const debugInfo = {
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "local",
    hasLocalStorageToken: !!token,
    hasCookieToken: !!cookieToken,
    tokensMatch: token === cookieToken,
    currentPath: window.location.pathname,
    currentUrl: window.location.href,
    userAgent: window.navigator.userAgent,
    timestamp: new Date().toISOString(),
  }

  console.log("Auth Debug Info:", debugInfo)

  return debugInfo
}

// Function to manually trigger redirection
export function forceRedirect(path: string) {
  console.log(`Force redirecting to: ${path}`)

  try {
    // Try changing location directly
    window.location.href = path

    // If that doesn't work after a delay, try other methods
    setTimeout(() => {
      if (window.location.pathname !== path) {
        console.log("Direct location change failed, trying alternative methods")

        // Try assigning to location
        window.location.assign(path)

        // As a last resort, try replacing location
        setTimeout(() => {
          if (window.location.pathname !== path) {
            console.log("Location assign failed, trying location replace")
            window.location.replace(path)
          }
        }, 500)
      }
    }, 1000)
  } catch (error) {
    console.error(`Force redirect error: ${error}`)

    // Final fallback - create and click a link
    try {
      const link = document.createElement("a")
      link.href = path
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error(`Link creation fallback failed: ${e}`)
    }
  }
}
