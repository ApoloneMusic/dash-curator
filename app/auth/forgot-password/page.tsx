"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { Music, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

// Form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type FormState = {
  errors?: {
    email?: string[]
  }
  message?: string
  success?: boolean
}

export default function ForgotPasswordPage() {
  const [formState, setFormState] = useState<FormState>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    // Validate form fields
    const result = forgotPasswordSchema.safeParse({ email })

    if (!result.success) {
      setFormState({
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    // Clear previous errors
    setFormState({})
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set success message
      setFormState({
        success: true,
        message: "Password reset instructions have been sent to your email.",
      })
    } catch (error) {
      console.error("Password reset error:", error)

      // Set error message
      setFormState({
        message: "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
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
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Reset your password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </motion.div>

          <motion.div className="mt-8" variants={itemVariants}>
            {formState.message && (
              <motion.div
                className={`mb-6 rounded-md p-4 text-sm ${
                  formState.success ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {formState.success && (
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    {formState.message}
                  </div>
                )}
                {!formState.success && formState.message}
              </motion.div>
            )}

            {!formState.success ? (
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
                  <Button
                    type="submit"
                    className="relative h-12 w-full overflow-hidden rounded-xl bg-[#ea4e2f] text-white transition-all hover:bg-[#ea4e2f]/90 focus:outline-none focus:ring-2 focus:ring-[#d7ff6e] focus:ring-offset-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending instructions...
                      </span>
                    ) : (
                      "Send reset instructions"
                    )}
                  </Button>
                </motion.div>
              </form>
            ) : (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all hover:bg-gray-50"
                >
                  <Link href="/auth/login" className="flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {!formState.success && (
            <motion.div className="mt-8 text-center" variants={itemVariants}>
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#104702] transition-colors hover:text-[#104702]/80"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
