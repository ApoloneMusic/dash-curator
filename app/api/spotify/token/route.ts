import { NextResponse } from "next/server"

// Spotify API endpoints
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

// Get Spotify API credentials from environment variables
// Note: SPOTIFY_CLIENT_SECRET is not prefixed with NEXT_PUBLIC_
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

export async function GET() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ error: "Spotify credentials are not configured" }, { status: 500 })
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
  })

  try {
    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: params.toString(),
    })

    if (!response.ok) {
      // Get the response text first
      const errorText = await response.text()

      // Try to parse as JSON, but handle the case where it's not valid JSON
      let errorMessage = `API Error: ${response.status} ${response.statusText}`
      try {
        const errorData = JSON.parse(errorText)
        // Spotify API typically returns errors in this format
        if (errorData.error && typeof errorData.error === "object" && errorData.error.message) {
          errorMessage = errorData.error.message
        } else if (errorData.error && typeof errorData.error === "string") {
          errorMessage = errorData.error
        } else if (errorData.error_description) {
          errorMessage = errorData.error_description
        }
      } catch (e) {
        // If parsing fails, use the raw text
        if (errorText) {
          errorMessage = errorText
        }
      }

      return NextResponse.json({ error: `Failed to get token: ${errorMessage}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    })
  } catch (error) {
    console.error("Error getting Spotify token:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to authenticate with Spotify" },
      { status: 500 },
    )
  }
}
