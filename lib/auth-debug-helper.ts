/**
 * Helper function to diagnose authentication issues
 * This can be called from the browser console to help debug redirection problems
 */
export function diagnoseAuthIssues() {
  // Check for token in localStorage
  let localStorageToken = null
  try {
    localStorageToken = localStorage.getItem("auth_token")
  } catch (e) {
    console.warn("Error accessing localStorage:", e)
  }

  // Check for token in cookies
  const cookies = document.cookie.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=")
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  const cookieToken = cookies["auth_token"]

  // Check current URL
  const currentUrl = window.location.href
  const currentPath = window.location.pathname

  // Check if we're in a redirection loop
  const isInLoginRedirectLoop =
    currentPath.includes("/auth/login") && document.body.textContent?.includes("Redirecting to login")

  // Output diagnostic information
  console.log("=== AUTH DIAGNOSTIC INFORMATION ===")
  console.log("Current URL:", currentUrl)
  console.log("Current Path:", currentPath)
  console.log("LocalStorage Token:", localStorageToken ? "Present" : "Missing")
  console.log("Cookie Token:", cookieToken ? "Present" : "Missing")
  console.log("Tokens Match:", localStorageToken === cookieToken)
  console.log("Possible Redirect Loop:", isInLoginRedirectLoop)
  console.log("User Agent:", navigator.userAgent)
  console.log("=== END DIAGNOSTIC INFORMATION ===")

  // If we detect a redirection loop, offer to fix it
  if (isInLoginRedirectLoop) {
    console.log("DETECTED REDIRECTION LOOP - Attempting to fix...")

    // Clear any problematic tokens
    try {
      localStorage.removeItem("auth_token")
      document.cookie = "auth_token=; path=/; max-age=0"
      console.log("Cleared authentication tokens")

      // Force reload the page
      console.log("Reloading page in 2 seconds...")
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (e) {
      console.error("Error fixing redirection loop:", e)
    }
  }

  return {
    localStorageToken: !!localStorageToken,
    cookieToken: !!cookieToken,
    tokensMatch: localStorageToken === cookieToken,
    currentUrl,
    currentPath,
    isInLoginRedirectLoop,
    userAgent: navigator.userAgent,
  }
}

// Make the function available globally for console debugging
if (typeof window !== "undefined") {
  ;(window as any).diagnoseAuthIssues = diagnoseAuthIssues
}
