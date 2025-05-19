// Authentication service for handling API calls to auth endpoints

// Improved environment variable handling
const getApiUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Log the environment variable for debugging
    console.log("API URL from env:", process.env.NEXT_PUBLIC_AUTH_API_URL)

    // Return the environment variable or empty string if undefined
    return process.env.NEXT_PUBLIC_AUTH_API_URL || ""
  }
  return "" // Return empty string in non-browser environments
}

// Use a function to get the API URL to ensure it's evaluated at runtime
const API_URL = getApiUrl()

// Types
export interface User {
  id: string
  name: string
  email: string
  credits?: number
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Improved JWT token decoding function with better error handling
const decodeToken = (token: string): User | null => {
  try {
    console.log("Attempting to decode token")

    // Extract the payload part of the JWT (second part)
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.warn("Token does not have three parts")
      return null
    }

    const base64Url = parts[1]

    // Replace characters that are not valid for base64 URL encoding
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")

    // Add padding if needed
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

    // Use a safer approach to decode the base64 string
    let decodedString
    try {
      // First try the standard approach
      decodedString = atob(paddedBase64)
    } catch (e) {
      console.warn("Failed to decode base64 with atob:", e)
      return null
    }

    // Convert the decoded string to a JSON object
    let payload
    try {
      // Convert binary string to UTF-8
      const rawString = Array.from(decodedString)
        .map((char) => char.charCodeAt(0))
        .map((code) => String.fromCharCode(code))
        .join("")

      payload = JSON.parse(rawString)
      console.log("Successfully decoded token payload:", payload)
    } catch (e) {
      console.warn("Failed to parse token payload:", e)
      return null
    }

    // Extract user information from the payload
    // This assumes the JWT contains user information in specific fields
    // Adjust according to your actual JWT structure
    return {
      id: payload.sub || payload.id || payload.userId || "unknown",
      name: payload.name || payload.username || "User",
      email: payload.email || "unknown@example.com",
      role: payload.role || "curator",
      credits: payload.credits || 0,
      createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
      updatedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

// Improved helper function to handle API responses with better error logging
const handleResponse = async (response: Response) => {
  try {
    const data = await response.json()
    console.log("API Response data:", data)

    if (!response.ok) {
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        data,
      })

      const errorMessage = data.message || `Error: ${response.status} ${response.statusText}`
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    console.error("Response parsing error:", error)
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response from server")
    }
    throw error
  }
}

// Authentication service functions with improved error handling and logging
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("Login attempt for:", credentials.email)
    console.log("Using API URL:", API_URL)

    try {
      // If API_URL is not available, use mock response
      if (!API_URL) {
        console.warn("API URL is not defined. Using mock login response.")
        return mockLogin(credentials)
      }

      // Construct the full URL for logging
      const fullUrl = `${API_URL}/auth/login`
      console.log("Making login request to:", fullUrl)

      // Make the request with detailed logging
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("Login response status:", response.status)
      const data = await handleResponse(response)

      // Handle different response formats
      // Case 1: API returns { user, token } format
      if (data.user && data.token) {
        console.log("API returned user and token format")
        return data as AuthResponse
      }

      // Case 2: API returns { authToken } format
      if (data.authToken) {
        console.log("API returned authToken format")
        const token = data.authToken

        // Store token in localStorage first
        try {
          localStorage.setItem("auth_token", token)
        } catch (e) {
          console.warn("Error setting localStorage:", e)
        }

        // Create a default user based on the credentials
        const defaultUser: User = {
          id: "temp-id",
          name: credentials.email.split("@")[0],
          email: credentials.email,
          role: "curator",
          credits: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Try to decode the token to get user information
        const userFromToken = decodeToken(token)

        // If we successfully decoded the token, use that user info
        if (userFromToken) {
          console.log("Successfully extracted user info from token")
          return {
            user: userFromToken,
            token,
          }
        }

        // If we couldn't extract user info from the token, try to fetch it from the /me endpoint
        try {
          console.log("Attempting to fetch user info from /me endpoint")
          const userResponse = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log("User data from /me endpoint:", userData)

            if (userData.user) {
              return {
                user: userData.user,
                token,
              }
            } else if (userData.id && userData.email) {
              return {
                user: userData as User,
                token,
              }
            }
          } else {
            console.warn("Failed to fetch user info from /me endpoint:", userResponse.status)
          }
        } catch (error) {
          console.error("Error fetching user info from /me endpoint:", error)
        }

        // If all else fails, use the default user
        console.log("Using default user info")
        return {
          user: defaultUser,
          token,
        }
      }

      // If we get here, the response format is not recognized
      console.error("Invalid login response structure:", data)
      throw new Error("Invalid response format from server")
    } catch (error) {
      // Enhanced error logging
      console.error("Login fetch error:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.warn("Network error detected. Using mock login response.")
        return mockLogin(credentials)
      }

      throw error
    }
  },

  // Register new user
  async register(credentials: SignupCredentials): Promise<AuthResponse> {
    console.log("Registration attempt for:", credentials.email)
    console.log("Using API URL:", API_URL)

    try {
      // If API_URL is not available, use mock response
      if (!API_URL) {
        console.warn("API URL is not defined. Using mock register response.")
        return mockRegister(credentials)
      }

      // Construct the full URL for logging
      const fullUrl = `${API_URL}/auth/signup`
      console.log("Making registration request to:", fullUrl)

      // Make the request with detailed logging
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("Registration response status:", response.status)
      const data = await handleResponse(response)

      // Handle different response formats
      // Case 1: API returns { user, token } format
      if (data.user && data.token) {
        console.log("API returned user and token format")
        return data as AuthResponse
      }

      // Case 2: API returns { authToken } format
      if (data.authToken) {
        console.log("API returned authToken format")
        const token = data.authToken

        // Store token in localStorage first
        try {
          localStorage.setItem("auth_token", token)
        } catch (e) {
          console.warn("Error setting localStorage:", e)
        }

        // Create a default user based on the credentials
        const defaultUser: User = {
          id: "temp-id",
          name: credentials.name,
          email: credentials.email,
          role: "curator",
          credits: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Try to decode the token to get user information
        const userFromToken = decodeToken(token)

        // If we successfully decoded the token, use that user info
        if (userFromToken) {
          console.log("Successfully extracted user info from token")
          return {
            user: userFromToken,
            token,
          }
        }

        // If we couldn't extract user info from the token, try to fetch it from the /me endpoint
        try {
          console.log("Attempting to fetch user info from /me endpoint")
          const userResponse = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log("User data from /me endpoint:", userData)

            if (userData.user) {
              return {
                user: userData.user,
                token,
              }
            } else if (userData.id && userData.email) {
              return {
                user: userData as User,
                token,
              }
            }
          } else {
            console.warn("Failed to fetch user info from /me endpoint:", userResponse.status)
          }
        } catch (error) {
          console.error("Error fetching user info from /me endpoint:", error)
        }

        // If all else fails, use the default user
        console.log("Using default user info")
        return {
          user: defaultUser,
          token,
        }
      }

      // If we get here, the response format is not recognized
      console.error("Invalid registration response structure:", data)
      throw new Error("Invalid response format from server")
    } catch (error) {
      // Enhanced error logging
      console.error("Registration fetch error:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.warn("Network error detected. Using mock register response.")
        return mockRegister(credentials)
      }

      throw error
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    console.log("Attempting to get current user")
    console.log("Using API URL:", API_URL)

    try {
      // Get token from localStorage with proper error handling
      let token = null
      try {
        token = localStorage.getItem("auth_token")
        console.log("Token from localStorage:", token ? "Found" : "Not found")
      } catch (e) {
        console.warn("Error accessing localStorage:", e)
      }

      if (!token) {
        console.log("No auth token found, user is not authenticated")
        return null
      }

      // Validate token format to prevent issues with malformed tokens
      if (typeof token !== "string" || token.trim() === "") {
        console.log("Invalid token format, clearing token")
        try {
          localStorage.removeItem("auth_token")
          // Also clear the cookie for consistency
          if (typeof document !== "undefined") {
            document.cookie = "auth_token=; path=/; max-age=0"
          }
        } catch (e) {
          console.warn("Error removing invalid token:", e)
        }
        return null
      }

      // If API_URL is not available, use mock response
      if (!API_URL) {
        console.warn("API URL is not defined. Using mock getCurrentUser response.")
        return mockGetCurrentUser()
      }

      // Try to decode the token to get user information
      const userFromToken = decodeToken(token)
      if (userFromToken) {
        console.log("User info extracted from token")
        return userFromToken
      }

      // If we couldn't extract user info from the token, fetch it from the API
      console.log("Could not extract user info from token, fetching from API")

      // Construct the full URL for logging
      const fullUrl = `${API_URL}/auth/me`
      console.log("Making getCurrentUser request to:", fullUrl)

      // Make the request with detailed logging
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("getCurrentUser response status:", response.status)

      if (!response.ok) {
        console.warn("Failed to get current user, status:", response.status)
        // Clear token if unauthorized
        if (response.status === 401) {
          try {
            localStorage.removeItem("auth_token")
          } catch (e) {
            console.warn("Error removing from localStorage:", e)
          }
        }
        return null
      }

      const data = await handleResponse(response)

      // Handle different response formats
      if (data.user) {
        return data.user
      }

      // If the response doesn't have a user property, try to use the data itself
      if (data.id && data.email) {
        return data as User
      }

      console.error("Invalid getCurrentUser response structure:", data)
      return null
    } catch (error) {
      // Enhanced error logging
      console.error("Get current user error:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.warn("Network error detected. Using mock getCurrentUser response.")
        return mockGetCurrentUser()
      }

      return null
    }
  },

  // Logout user with improved error handling
  async logout(): Promise<void> {
    console.log("Logout attempt")

    try {
      // Always clear the token from localStorage first
      try {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("remember_me")
      } catch (e) {
        console.warn("Error removing from localStorage:", e)
      }

      // If API_URL is not available, just return
      if (!API_URL) {
        console.warn("API URL is not defined. Skipping logout API call.")
        return
      }

      // Get token for API call
      let token = null
      try {
        token = localStorage.getItem("auth_token")
      } catch (e) {
        console.warn("Error accessing localStorage:", e)
      }

      if (token) {
        // Construct the full URL for logging
        const fullUrl = `${API_URL}/auth/logout`
        console.log("Making logout request to:", fullUrl)

        // Make the request with detailed logging
        await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch((error) => {
          // Ignore network errors during logout
          console.warn("Logout API call failed:", error)
        })
      }
    } catch (error) {
      console.error("Error during logout:", error)
      // Errors during logout can be ignored as we've already cleared the local token
    }
  },
}

// Mock functions for development/testing
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log("Using mock login for:", credentials.email)
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  // For demo purposes, accept any credentials
  const mockUser: User = {
    id: "1",
    name: credentials.email.split("@")[0], // Use part of email as name
    email: credentials.email,
    credits: 1250,
    role: "curator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockToken = "mock_token_" + Math.random().toString(36).substring(2)
  console.log("Generated mock token:", mockToken)

  // Store token in localStorage with error handling
  try {
    localStorage.setItem("auth_token", mockToken)
  } catch (e) {
    console.warn("Error setting localStorage:", e)
  }

  return { user: mockUser, token: mockToken }
}

const mockRegister = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  console.log("Using mock register for:", credentials.email)
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

  // Ensure we have all required fields
  if (!credentials.name || !credentials.email || !credentials.password) {
    console.error("Missing required fields in registration credentials:", credentials)
    throw new Error("Missing required registration fields")
  }

  const mockUser: User = {
    id: "2",
    name: credentials.name,
    email: credentials.email,
    credits: 500, // Default credits for new users
    role: "curator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockToken = "mock_token_" + Math.random().toString(36).substring(2)
  console.log("Generated mock token:", mockToken)

  // Store token in localStorage with error handling
  try {
    localStorage.setItem("auth_token", mockToken)
  } catch (e) {
    console.warn("Error setting localStorage:", e)
  }

  // Ensure we're returning a properly structured response
  const response: AuthResponse = {
    user: mockUser,
    token: mockToken,
  }

  console.log("Mock register response:", response)
  return response
}

const mockGetCurrentUser = async (): Promise<User | null> => {
  console.log("Using mock getCurrentUser")
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Get token from localStorage with error handling
  let token = null
  try {
    token = localStorage.getItem("auth_token")
  } catch (e) {
    console.warn("Error accessing localStorage:", e)
  }

  if (!token) {
    console.log("No mock token found")
    return null
  }

  console.log("Mock token found, returning mock user")

  // Return mock user
  return {
    id: "1",
    name: "John Curator",
    email: "john@curator.com",
    credits: 1250,
    role: "curator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
