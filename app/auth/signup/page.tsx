"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { Music, Check, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import { PhoneInput } from "react-international-phone"
import { Checkbox } from "@/components/ui/checkbox"

// Signup form schema with password requirements
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+\d{10,15}$/, { message: "Phone number must be in international format (e.g. +1234567890)" }),
})

type FormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    phone?: string[]
  }
  message?: string
}

export default function SignupPage() {
  const [formState, setFormState] = useState<FormState>({})
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const { register, isLoading } = useAuth()

  // Password strength checks
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string

    // Validate form fields
    const result = signupSchema.safeParse({ name, email, password, phone })

    if (!result.success) {
      setFormState({
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    // Clear previous errors
    setFormState({})

    try {
      // Call the register function from auth context with validated data
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone
      })
    } catch (error) {
      console.error("Registration form submission error:", error)

      // Set a user-friendly error message
      setFormState({
        message:
          error instanceof Error
            ? `Registration error: ${error.message}`
            : "An error occurred while creating your account. Please try again.",
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

  const strengthVariants = {
    initial: { width: 0 },
    animate: (strength: number) => ({
      width: `${strength}%`,
      transition: { duration: 0.3 },
    }),
  }

  // Calculate password strength
  const calculateStrength = () => {
    let strength = 0
    if (hasMinLength) strength += 20
    if (hasUppercase) strength += 20
    if (hasLowercase) strength += 20
    if (hasNumber) strength += 20
    if (hasSpecialChar) strength += 20
    return strength
  }

  const getStrengthColor = () => {
    const strength = calculateStrength()
    if (strength < 40) return "bg-red-500"
    if (strength < 80) return "bg-yellow-500"
    return "bg-green-500"
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
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Join thousands of artists promoting their music</p>
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
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </Label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className={`h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#d7ff6e] focus:ring-[#d7ff6e] ${
                      formState.errors?.name ? "border-destructive" : ""
                    }`}
                  />
                  {formState.errors?.name?.map((error) => (
                    <p key={error} className="mt-1 text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </motion.div>

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
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </Label>
                <div className="mt-1">
                  <PhoneInput
                    defaultCountry="us"
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    inputClassName={`!h-12 w-full rounded-xl !border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#d7ff6e] focus:ring-[#d7ff6e] !rounded-r-xl ${
                      formState.errors?.phone ? '!border-destructive' : ''
                    }`}
                    countrySelectorStyleProps={{
                      buttonContentWrapperClassName: 'h-12 !rounded-l-xl !border-gray-200',
                      buttonClassName: 'h-12 w-16 !rounded-l-xl !border-gray-200'
                    }}
                  />
                  <input type="hidden" name="phone" value={phone} />
                  {formState.errors?.phone?.map((error) => (
                    <p key={error} className="mt-1 text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all focus:border-[#d7ff6e] focus:ring-[#d7ff6e] ${
                      formState.errors?.password ? "border-destructive" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {formState.errors?.password?.map((error) => (
                    <p key={error} className="mt-1 text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <motion.div
                        className={`h-full rounded-full ${getStrengthColor()}`}
                        variants={strengthVariants}
                        initial="initial"
                        animate="animate"
                        custom={calculateStrength()}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Password strength requirements */}
                <motion.div
                  className="mt-4 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                  <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                    <li className="flex items-center gap-1">
                      {hasMinLength ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={hasMinLength ? "text-green-600" : "text-gray-500"}>At least 8 characters</span>
                    </li>
                    <li className="flex items-center gap-1">
                      {hasUppercase ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={hasUppercase ? "text-green-600" : "text-gray-500"}>One uppercase letter</span>
                    </li>
                    <li className="flex items-center gap-1">
                      {hasLowercase ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={hasLowercase ? "text-green-600" : "text-gray-500"}>One lowercase letter</span>
                    </li>
                    <li className="flex items-center gap-1">
                      {hasNumber ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={hasNumber ? "text-green-600" : "text-gray-500"}>One number</span>
                    </li>
                    <li className="flex items-center gap-1">
                      {hasSpecialChar ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={hasSpecialChar ? "text-green-600" : "text-gray-500"}>One special character</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="terms" className="text-sm font-medium text-gray-700 mt-1 flex items-center gap-2 cursor-pointer">
                  <Checkbox name="terms" checked={agreeToTerms} onCheckedChange={setAgreeToTerms} />
                  <span>
                    Agree to {' '}
                    <Link href="/terms-and-conditions" className="inline font-medium text-[#104702] transition-colors hover:text-[#104702]/80">
                      terms and conditions
                    </Link>
                  </span>
                </Label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="relative h-12 w-full overflow-hidden rounded-xl bg-[#ea4e2f] text-white transition-all hover:bg-[#ea4e2f]/90 focus:outline-none focus:ring-2 focus:ring-[#d7ff6e] focus:ring-offset-2"
                  disabled={isLoading || !agreeToTerms}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div className="mt-8 text-center" variants={itemVariants}>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-[#104702] transition-colors hover:text-[#104702]/80">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
