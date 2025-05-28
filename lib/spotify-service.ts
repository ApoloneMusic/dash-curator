// Spotify API service for handling authentication and API calls

// Get Spotify API credentials from environment variables
// Note: We no longer need the client secret here
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

// Spotify API endpoints
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

// Types
export interface SpotifyProfile {
  id: string;
  display_name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
  type: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string; height: number | null; width: number | null }[];
  tracks: { total: number };
  external_urls: { spotify: string };
  owner: {
    id: string;
    display_name: string;
  };
  followers: {
    total: number;
  };
}

// Token storage
let clientCredentialsToken: string | null = null;
let tokenExpiryTime: number | null = null;

// Spotify service functions
export const spotifyService = {
  // Get client credentials token (app-only, no user login required)
  getClientCredentialsToken: async (): Promise<string> => {
    // Check if we already have a valid token
    if (
      clientCredentialsToken &&
      tokenExpiryTime &&
      Date.now() < tokenExpiryTime
    ) {
      return clientCredentialsToken;
    }

    try {
      // Call our server-side API route instead of directly using the client secret
      const response = await fetch("/api/spotify/token");

      if (!response.ok) {
        // Get the response text first
        const errorText = await response.text();

        // Try to parse as JSON, but handle the case where it's not valid JSON
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(`Failed to get token: ${errorMessage}`);
      }

      const data = await response.json();

      // Store the token and set expiry time (subtract 60 seconds as buffer)
      clientCredentialsToken = data.access_token;
      tokenExpiryTime = Date.now() + (data.expires_in - 60) * 1000;

      return data.access_token;
    } catch (error) {
      console.error("Error getting Spotify token:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to authenticate with Spotify"
      );
    }
  },

  // Get user profile by ID
  getProfileById: async (userId: string): Promise<SpotifyProfile | null> => {
    try {
      const token = await spotifyService.getClientCredentialsToken();

      const response = await fetch(`${SPOTIFY_API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If the profile doesn't exist, return null instead of throwing an error
        if (response.status === 404) {
          return null;
        }

        // For other errors, get the response text first
        const errorText = await response.text();

        // Try to parse as JSON, but handle the case where it's not valid JSON
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          // Spotify API typically returns errors in this format
          if (
            errorData.error &&
            typeof errorData.error === "object" &&
            errorData.error.message
          ) {
            errorMessage = errorData.error.message;
          } else if (errorData.error && typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const profile = await response.json();
      return {
        id: profile.id,
        display_name: profile.display_name || profile.id,
        images: profile.images || [],
        external_urls: profile.external_urls || { spotify: "" },
        type: "user",
      };
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  // Get playlists for a user (only public playlists will be accessible)
  getUserPlaylists: async (userId: string): Promise<SpotifyPlaylist[]> => {
    try {
      const token = await spotifyService.getClientCredentialsToken();

      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/users/${userId}/playlists?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Get the response text first
        const errorText = await response.text();

        // Try to parse as JSON, but handle the case where it's not valid JSON
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          // Spotify API typically returns errors in this format
          if (
            errorData.error &&
            typeof errorData.error === "object" &&
            errorData.error.message
          ) {
            errorMessage = errorData.error.message;
          } else if (errorData.error && typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Check if the response has the expected structure
      if (!data.items) {
        console.warn("Unexpected API response structure:", data);
        return [];
      }

      return data.items;
    } catch (error) {
      console.error("Error getting playlists:", error);
      throw error;
    }
  },

  getPlaylistByUrl: async (playlistUrl: string) => {
    // Extract playlist ID from URL
    const playlistId = playlistUrl.split("/").pop()?.split("?")[0];

    if (!playlistId) {
      console.error("Invalid playlist URL:", playlistUrl);
      throw `Invalid playlist URL: ${playlistUrl}`;
    }

    return spotifyService.getPlaylist(playlistId);
  },

  // Get playlist details
  getPlaylist: async (playlistId: string): Promise<SpotifyPlaylist> => {
    try {
      const token = await spotifyService.getClientCredentialsToken();

      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Get the response text first
        const errorText = await response.text();

        // Try to parse as JSON, but handle the case where it's not valid JSON
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          // Spotify API typically returns errors in this format
          if (
            errorData.error &&
            typeof errorData.error === "object" &&
            errorData.error.message
          ) {
            errorMessage = errorData.error.message;
          } else if (errorData.error && typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting playlist:", error);
      throw error;
    }
  },

  // Get playlist artwork by URL
  getPlaylistArtworkByUrl: async (
    playlistUrl: string
  ): Promise<string | null> => {
    try {
      // Get playlist details
      const playlist = await spotifyService.getPlaylistByUrl(playlistUrl);

      // Return the first image URL if available
      if (playlist.images && playlist.images.length > 0) {
        return playlist.images[0].url;
      }

      return null;
    } catch (error) {
      console.error("Error getting playlist artwork:", error);
      return null;
    }
  },

  // Search for playlists directly
  searchPlaylists: async (query: string): Promise<SpotifyPlaylist[]> => {
    if (!query.trim()) {
      return [];
    }

    try {
      const token = await spotifyService.getClientCredentialsToken();

      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/search?q=${encodeURIComponent(
          query
        )}&type=playlist&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Get the response text first
        const errorText = await response.text();

        // Try to parse as JSON, but handle the case where it's not valid JSON
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          // Spotify API typically returns errors in this format
          if (
            errorData.error &&
            typeof errorData.error === "object" &&
            errorData.error.message
          ) {
            errorMessage = errorData.error.message;
          } else if (errorData.error && typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Check if the response has the expected structure
      if (!data.playlists || !data.playlists.items) {
        console.warn("Unexpected API response structure:", data);
        return [];
      }

      return data.playlists.items;
    } catch (error) {
      console.error("Error searching playlists:", error);
      throw error;
    }
  },
};
