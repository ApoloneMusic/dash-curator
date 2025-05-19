Apolone.Curator
A modern music curation platform built with Next.js, enabling curators to manage playlists and review music submissions efficiently.
Table of Contents

Overview
Features
Technology Stack
Getting Started
Project Structure
Configuration
API Routes
Components
Authentication
Development
Contributing

Overview
Apolone.Curator is a comprehensive music curation platform that allows music curators to:

Manage their Spotify playlists
Review and process music pitch submissions
Track placements and their performance
Provide detailed feedback to artists

The platform is designed with a modern, responsive interface and includes features like real-time audio previews, advanced filtering, and comprehensive playlist management.
Features
🎵 Core Features

Pitch Management: Review incoming music submissions with detailed metadata
Playlist Integration: Connect and manage Spotify playlists directly
Audio Preview: Built-in Spotify player for track previews
Feedback System: Structured feedback forms with ratings and comments
Placement Tracking: Monitor track placements and their lifecycle

🎨 User Experience

Responsive Design: Mobile-first approach with Tailwind CSS
Dark/Light Mode: Theme support with next-themes
Smooth Animations: Framer Motion for enhanced user interactions
Form Validation: Zod schema validation with react-hook-form

🔐 Security & Auth

JWT Authentication: Secure token-based authentication
Protected Routes: Middleware-based route protection
Role-based Access: Curator-specific functionality

Technology Stack
Frontend

Next.js 15: React framework with App Router
TypeScript: Type-safe development
Tailwind CSS: Utility-first CSS framework
Radix UI: Accessible component primitives
Framer Motion: Animation library
Lucide React: Icon library

Backend Integration

REST API: External API integration for data management
Spotify Web API: Direct integration with Spotify services
File Upload: Support for document and media uploads

Development Tools

ESLint: Code linting
PostCSS: CSS processing
Autoprefixer: CSS vendor prefixing

Getting Started
Prerequisites

Node.js 18+
npm or yarn
Spotify Developer Account (for playlist integration)

Installation

Clone the repository
bashgit clone <repository-url>
cd apolone-curator

Install dependencies
bashnpm install
# or
yarn install

Set up environment variables
Create a .env.local file in the root directory:
env# Authentication API
NEXT_PUBLIC_AUTH_API_URL=your_auth_api_url
NEXT_PUBLIC_API_BASE_URL=your_api_base_url

# Spotify Integration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Environment
NEXT_PUBLIC_VERCEL_ENV=development

Run the development server
bashnpm run dev
# or
yarn dev

Open your browser
Navigate to http://localhost:3000

Project Structure
apolone-curator/
├── app/                    # Next.js App Router pages
│  ├── api/               # API routes
│  ├── auth/              # Authentication pages
│  ├── dashboard/         # Protected dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   └── ...               # Feature-specific components
├── contexts/             # React contexts (auth, player)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
├── public/               # Static assets
└── styles/               # Global styles
Key Directories

/app: Contains all pages and API routes using Next.js App Router
/components: Modular, reusable React components
/contexts: Global state management (Authentication, Audio Player)
/lib: Services, utilities, and configurations
/hooks: Custom React hooks for shared logic

Configuration
Environment Variables
VariableDescriptionRequiredNEXT_PUBLIC_AUTH_API_URLAuthentication API endpointYesNEXT_PUBLIC_API_BASE_URLMain API endpointYesNEXT_PUBLIC_SPOTIFY_CLIENT_IDSpotify app client IDYesSPOTIFY_CLIENT_SECRETSpotify app secret (server-side only)YesNEXT_PUBLIC_VERCEL_ENVEnvironment identifierNo
Spotify Setup

Create a Spotify app at Spotify Developer Dashboard
Add your domain to the app's redirect URIs
Copy the Client ID and Client Secret to your environment variables

API Routes
Authentication

POST /api/auth/login - User login
POST /api/auth/signup - User registration
GET /api/auth/me - Get current user
POST /api/auth/logout - User logout

Data Management

GET /api/curators/[id] - Get curator details
POST /api/feedback - Submit pitch feedback
GET /api/spotify/token - Get Spotify access token

Components
UI Components
Built on Radix UI primitives with custom styling:

Buttons: Various variants and sizes
Forms: Input fields, textareas, selects with validation
Modals: Dialog components for actions and forms
Navigation: Tabs, dropdowns, breadcrumbs

Feature Components

PitchCard: Display and manage music submissions
PlaylistCard: Spotify playlist management
AudioPlayer: Persistent Spotify player
StatusFilter: Dynamic filtering for different statuses

Authentication
The app uses JWT-based authentication with:

Automatic token refresh: Seamless session management
Protected routes: Middleware enforcement
Persistent login: Optional "remember me" functionality
Mock authentication: Fallback for development

Authentication Flow

User submits credentials
API returns JWT token
Token stored in localStorage and httpOnly cookie
Middleware validates token on protected routes
Context provides user state throughout app

Development
Code Organization

TypeScript: Strict type checking enabled
Component patterns: Functional components with hooks
Error boundaries: Graceful error handling
Performance: Code splitting and lazy loading

Available Scripts
bashnpm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
Styling Guidelines

Tailwind Classes: Use utility classes for styling
Component Variants: Leverage class-variance-authority for variants
Responsive Design: Mobile-first approach
Design System: Consistent spacing, colors, and typography

API Integration
The app follows these patterns for API calls:
typescript// Service-based approach
const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Implementation
  }
}

// Error handling
try {
  const response = await authService.login(credentials)
  // Handle success
} catch (error) {
  // Handle error
}
Contributing
Development Workflow

Create a feature branch from main
Make your changes with proper TypeScript types
Test thoroughly in development
Submit a pull request with detailed description

Guidelines

TypeScript: Maintain strict typing
Components: Keep components small and focused
Performance: Consider bundle size and loading times
Accessibility: Follow ARIA guidelines
Documentation: Update README for significant changes
