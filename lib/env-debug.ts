// Utility for debugging environment variables

export function logEnvironmentVariables() {
  console.log("Environment Variables Debug:")
  console.log("NEXT_PUBLIC_AUTH_API_URL:", process.env.NEXT_PUBLIC_AUTH_API_URL)
  console.log("NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL)
  console.log("NEXT_PUBLIC_VERCEL_ENV:", process.env.NEXT_PUBLIC_VERCEL_ENV)

  // Check if we're in a browser environment
  console.log("Is browser environment:", typeof window !== "undefined")

  // Log Next.js environment
  console.log("NODE_ENV:", process.env.NODE_ENV)
}

// Function to check if API URLs are properly configured
export function checkApiUrls() {
  const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL

  if (!authApiUrl) {
    console.warn("NEXT_PUBLIC_AUTH_API_URL is not defined. Authentication API calls will use mock responses.")
    return false
  }

  try {
    // Check if the URL is valid
    new URL(authApiUrl)
    console.log("NEXT_PUBLIC_AUTH_API_URL is valid:", authApiUrl)
    return true
  } catch (e) {
    console.error("NEXT_PUBLIC_AUTH_API_URL is not a valid URL:", authApiUrl)
    return false
  }
}

// Call this function in development to debug environment variables
export function debugEnvironment() {
  if (process.env.NODE_ENV === "development") {
    logEnvironmentVariables()
    checkApiUrls()
  }
}
