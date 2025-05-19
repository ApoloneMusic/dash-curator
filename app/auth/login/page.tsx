"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { z } from "zod"
import { Music, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type FormState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
}

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>({})
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Update the useEffect for redirection to prevent loops
  useEffect(() => {
    if (isAuthenticated) {
      // Check if already on the dashboard to prevent unnecessary redirects
      if (pathname.includes("/dashboard")) {
        console.log("Already on dashboard, not redirecting")
        return
      }

      // Don't redirect if we're on the root page and it's showing the login component
      if (pathname === "/") {
        console.log("On root page with login component, not redirecting")
        return
      }

      console.log("User authenticated, redirecting to dashboard")
      try {
        router.push("/dashboard/pitches")
      } catch (error) {
        console.error("Router redirection error:", error)
        window.location.href = "/dashboard/pitches"
      }
    }
  }, [isAuthenticated, router, pathname])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate form fields
    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      setFormState({
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    // Clear previous errors
    setFormState({})

    try {
      // Call the login function from auth context
      await login({ email, password })

      // If remember me is checked, store the preference
      if (rememberMe) {
        try {
          localStorage.setItem("remember_me", "true")
        } catch (e) {
          console.warn("Error setting localStorage:", e)
        }
      }

      // Add fallback redirection after successful login
      setTimeout(() => {
        // If we're still on the login page, try direct navigation
        if (window.location.pathname.includes("/auth/login")) {
          window.location.href = "/dashboard/pitches"
        }
      }, 2000)
    } catch (error) {
      console.error("Login form submission error:", error)

      // Set a user-friendly error message
      setFormState({
        message:
          error instanceof Error
            ? `Login error: ${error.message}`
            : "An error occurred during login. Please try again.",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[60%] h-[80%] w-[100%] rounded-full bg-[#d7ff6e]/10 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[60%] h-[80%] w-[100%] rounded-full bg-[#ea4e2f]/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="mb-12 flex flex-col items-center" variants={itemVariants}>
            <Link href="/" className="flex items-center gap-2 text-[#104702]">
              <Music className="h-8 w-8" />
              <span className="text-2xl font-bold">
                Apolone<span className="text-[#ea4e2f]">.</span>Curator
              </span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account to manage your playlists</p>
          </motion.div>

          <motion.div className="mt-8" variants={itemVariants}>
            {formState.message && (
              <motion.div
                className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {formState.message}
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#d7ff6e] focus:ring-[#d7ff6e] ${
                      formState.errors?.email ? "border-destructive" : ""
                    }`}
                  />
                  {formState.errors?.email?.map((error) => (
                    <p key={error} className="mt-1 text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="text-sm">
                    <Link
                      href="/auth/forgot-password"
                      className="font-medium text-[#104702] transition-colors hover:text-[#104702]/80"
                    >
                      Forgot?
                    </Link>
                  </div>
                </div>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#d7ff6e] focus:ring-[#d7ff6e] ${
                      formState.errors?.password ? "border-destructive" : ""
                    }`}
                  />
                  {formState.errors?.password?.map((error) => (
                    <p key={error} className="mt-1 text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 text-[#104702] focus:ring-[#d7ff6e]"
                />
                <Label htmlFor="remember-me" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="relative h-12 w-full overflow-hidden rounded-xl bg-[#ea4e2f] text-white transition-all hover:bg-[#ea4e2f]/90 focus:outline-none focus:ring-2 focus:ring-[#d7ff6e] focus:ring-offset-2"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 -z-10 translate-y-full bg-[#104702] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"></span>
                </Button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div className="mt-8 text-center" variants={itemVariants}>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-[#104702] transition-colors hover:text-[#104702]/80"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
