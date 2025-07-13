"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ListChecks, Inbox, Headphones, DollarSign, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StepProps {
  icon: React.ReactNode
  headline: string
  text: string
  animationVisual: React.ReactNode // Custom visual for each step
  indicator?: { icon: React.ReactNode; text: string; color: string }[]
}

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef(null)
  const stepRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const steps: StepProps[] = [
    {
      icon: <ListChecks className="h-10 w-10 text-brand-orange" />,
      headline: "Apply as a Curator",
      text: "Add your playlists (1k+ followers each) in under 2 minutes.",
      animationVisual: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-full h-24 bg-gradient-to-br from-brand-lime/50 to-white/50 rounded-lg p-3 shadow-inner flex items-center justify-center overflow-hidden"
        >
          <div className="w-full space-y-2">
            <div className="h-3 bg-brand-green/30 rounded w-3/4" />
            <div className="h-3 bg-brand-green/30 rounded w-1/2" />
            <div className="h-3 bg-brand-green/30 rounded w-2/3" />
          </div>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-green/80 text-sm font-semibold bg-brand-lime/80 px-3 py-1 rounded-full shadow-md"
          >
            Playlist Entry
          </motion.div>
        </motion.div>
      ),
      indicator: [{ icon: <CheckCircle className="h-4 w-4" />, text: "Playlist Verified", color: "text-brand-orange" }],
    },
    {
      icon: <Inbox className="h-10 w-10 text-blue-600" />,
      headline: "Receive Curated Submissions",
      text: "We match songs to your playlists automatically.",
      animationVisual: (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-full h-24 bg-gradient-to-br from-white/50 to-brand-lime/50 rounded-lg p-3 shadow-inner flex flex-col justify-center overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-brand-orange rounded-full" />
            <div className="h-3 bg-brand-green/50 rounded w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-brand-lime rounded-full" />
            <div className="h-3 bg-brand-green/50 rounded w-1/2" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-brand-orange/70"
          />
        </motion.div>
      ),
    },
    {
      icon: <Headphones className="h-10 w-10 text-purple-600" />,
      headline: "You Choose What Fits",
      text: "Approve what matches your vibe. You're in full control.",
      animationVisual: (
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-full h-24 bg-gradient-to-br from-brand-lime/50 to-white/50 rounded-lg p-3 shadow-inner flex items-center justify-center overflow-hidden"
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-2 bg-brand-green/10 px-4 py-2 rounded-full"
          >
            <Headphones className="h-6 w-6 text-brand-green" />
            <span className="text-brand-green font-semibold">Listen</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, type: "spring", stiffness: 200 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-orange text-white rounded-full p-2 shadow-lg"
          >
            <CheckCircle className="h-6 w-6" />
          </motion.div>
        </motion.div>
      ),
    },
    {
      icon: <DollarSign className="h-10 w-10 text-brand-green" />,
      headline: "Earn Payouts + Bonuses",
      text: "Get paid for every review. Stack earnings with bonuses, referrals, and streaks.",
      animationVisual: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-full h-24 bg-gradient-to-br from-white/50 to-brand-lime/50 rounded-lg p-3 shadow-inner flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-4xl font-bold text-brand-green relative"
          >
            <span className="relative z-10">$780</span>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.5 }}
              transition={{ delay: 0.8, duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              className="absolute inset-0 bg-brand-lime rounded-full blur-md z-0"
            />
          </motion.div>
          <div className="text-sm text-brand-green/80 mt-1">Paid Out</div>
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <span className="text-xs text-brand-orange font-semibold">Bonus Active</span>
          </div>
        </motion.div>
      ),
      indicator: [{ icon: <DollarSign className="h-4 w-4" />, text: "Payout Unlocked", color: "text-brand-orange" }],
    },
  ]

  const stepInViews = stepRefs.map((ref, index) => {
    return useInView(ref, {
      once: true,
      amount: 0.3,
      margin: "-100px 0px -100px 0px",
    })
  })
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section ref={sectionRef} className="relative py-16 bg-white overflow-hidden">
      {/* Subtle background elements for cinematic feel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isInView ? 0.2 : 0, scale: isInView ? 1 : 0.8 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-1/4 left-1/4 h-48 w-48 bg-brand-lime/30 rounded-full mix-blend-multiply filter blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isInView ? 0.2 : 0, scale: isInView ? 1 : 0.8 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-1/4 right-1/4 h-48 w-48 bg-brand-orange/30 rounded-full mix-blend-multiply filter blur-xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-extrabold text-brand-green mb-4"
        >
          How It Works <span className="text-brand-orange">(And Why Curators Love It)</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-brand-green/80 max-w-2xl mx-auto mb-12"
        >
          Curate hits. Cash in fast.
        </motion.p>

        {/* Alternating Left/Right Layout with Step Numbers and Text */}
        <div className="flex flex-col gap-12">
          {steps.map((step, index) => {
            return (
              <motion.div
                key={index}
                ref={stepRefs[index]}
                className="flex flex-col items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: stepInViews[index] ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Mobile number display - visible only on mobile, positioned above card */}
                <motion.div
                  className="flex md:hidden flex-col items-center mb-6 w-full"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: stepInViews[index] ? 1 : 0,
                    y: stepInViews[index] ? 0 : -20,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <span className="text-6xl font-extrabold text-brand-orange drop-shadow-lg mb-2">{index + 1}</span>
                  <h3 className="text-xl font-bold text-brand-green text-center mb-2">{step.headline}</h3>
                  <p className="text-brand-green/80 text-sm text-center max-w-xs">{step.text}</p>
                </motion.div>

                {/* Card content for both mobile and desktop */}
                <div
                  className={`flex text-center items-center w-full md:px-32 ${
                    index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  } justify-center`}
                >
                  {index % 2 === 1 && ( // Render number and text on left for odd indices (right-aligned card) - desktop only
                    <motion.div
                      className="hidden md:flex flex-col flex-shrink-0 w-48 text-right mr-24"
                      initial={{ opacity: 0, x: -80, scale: 0.8 }}
                      animate={{
                        opacity: stepInViews[index] ? 1 : 0,
                        x: stepInViews[index] ? 0 : -80,
                        scale: stepInViews[index] ? 1 : 0.8,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <motion.span className="text-7xl font-extrabold text-brand-orange drop-shadow-lg">
                        {index + 1}
                      </motion.span>
                      <motion.h3
                        className="text-xl font-bold text-brand-green mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: stepInViews[index] ? 1 : 0, y: stepInViews[index] ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {step.headline}
                      </motion.h3>
                      <motion.p
                        className="text-brand-green/80 text-sm"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: stepInViews[index] ? 1 : 0, y: stepInViews[index] ? 0 : 15 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        {step.text}
                      </motion.p>
                    </motion.div>
                  )}

                  <motion.div
                    className="w-full max-w-md md:max-w-lg"
                    initial={{
                      opacity: 0,
                      y: 60,
                      scale: 0.9,
                      rotateY: index % 2 === 0 ? -15 : 15,
                    }}
                    animate={{
                      opacity: stepInViews[index] ? 1 : 0,
                      y: stepInViews[index] ? 0 : 60,
                      scale: stepInViews[index] ? 1 : 0.9,
                      rotateY: stepInViews[index] ? 0 : index % 2 === 0 ? -15 : 15,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: index % 2 === 0 ? 5 : -5,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <Card className="h-full flex flex-col items-center p-6 bg-white/20 backdrop-blur-lg border border-brand-lime/30 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 min-h-[300px]">
                      {index === 0 && (
                        <CardContent className="flex flex-col items-center text-center p-0 w-full">
                          {/* Spotify-style playlist submission interface */}
                          <div className="w-full max-w-sm space-y-4">
                            {/* Mock URL input field */}
                            <div className="relative">
                              <div className="w-full h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 flex items-center px-4 shadow-inner">
                                <div className="flex items-center gap-3 w-full">
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div className="flex-1 h-3 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                              </div>
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </motion.div>
                            </div>

                            {/* Mock playlist preview cards */}
                            <div className="space-y-2">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-md shadow-sm flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                  </svg>
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="h-3 bg-green-300 rounded w-3/4"></div>
                                  <div className="h-2 bg-green-200 rounded w-1/2"></div>
                                </div>
                                <div className="w-8 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9, duration: 0.4 }}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md shadow-sm flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                  </svg>
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="h-3 bg-blue-300 rounded w-2/3"></div>
                                  <div className="h-2 bg-blue-200 rounded w-1/3"></div>
                                </div>
                                <div className="w-8 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              </motion.div>
                            </div>

                            {/* Submit button mockup */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.1, duration: 0.4 }}
                              className="w-full h-12 bg-gradient-to-r from-brand-orange to-red-500 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden"
                            >
                              <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                  delay: 1.3,
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatDelay: 2,
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                              />
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </CardContent>
                      )}
                      {index === 1 && (
                        <CardContent className="flex flex-col items-center text-center p-0 w-full">
                          {/* AI Network Matching Visualization */}
                          <div className="w-full max-w-sm space-y-4">
                            {/* Central AI Hub */}
                            <div className="relative flex items-center justify-center mb-4">
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg relative z-10"
                              >
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                  className="absolute inset-0 bg-purple-400 rounded-full opacity-30"
                                />
                              </motion.div>

                              {/* Pulsing rings around AI hub */}
                              <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                                className="absolute w-16 h-16 border-2 border-purple-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                                className="absolute w-16 h-16 border-2 border-indigo-400 rounded-full"
                              />
                            </div>

                            {/* Songs Network - Top */}
                            <div className="flex justify-between items-center mb-3">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={`song-${i}`}
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 + i * 0.2, duration: 0.4 }}
                                  className="flex flex-col items-center"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-md shadow-sm flex items-center justify-center mb-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                    </svg>
                                  </div>
                                  {/* Animated connection line to center */}
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 20 }}
                                    transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                                    className="w-0.5 bg-gradient-to-b from-green-400 to-purple-400"
                                  />
                                </motion.div>
                              ))}
                            </div>

                            {/* AI Matching Process Indicator */}
                            <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200 mb-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-5 h-5 border-2 border-purple-400 border-t-purple-600 rounded-full"
                              />
                              <div className="text-xs font-semibold text-purple-700">AI Matching</div>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                                className="w-2 h-2 bg-purple-500 rounded-full"
                              />
                            </div>

                            {/* Curators Network - Bottom */}
                            <div className="flex justify-between items-center">
                              {[...Array(4)].map((_, i) => (
                                <motion.div
                                  key={`curator-${i}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
                                  className="flex flex-col items-center"
                                >
                                  {/* Connection line from center */}
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 20 }}
                                    transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                                    className="w-0.5 bg-gradient-to-b from-purple-400 to-blue-400 mb-1"
                                  />
                                  <div
                                    className={`w-6 h-6 bg-gradient-to-br ${
                                      i === 0
                                        ? "from-blue-400 to-cyan-500"
                                        : i === 1
                                          ? "from-orange-400 to-red-500"
                                          : i === 2
                                            ? "from-pink-400 to-purple-500"
                                            : "from-yellow-400 to-orange-500"
                                    } rounded-full shadow-sm flex items-center justify-center`}
                                  >
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  {/* Curator indicator */}
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
                                    className="w-4 h-1 bg-gray-300 rounded mt-1"
                                  />
                                </motion.div>
                              ))}
                            </div>

                            {/* Network Stats */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 2.5, duration: 0.4 }}
                              className="flex items-center justify-center gap-4 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 mt-4"
                            >
                              <div className="text-center">
                                <div className="text-xs font-bold text-green-600">1000+</div>
                                <div className="text-xs text-green-500">Songs</div>
                              </div>
                              <div className="w-px h-6 bg-gray-300" />
                              <div className="text-center">
                                <div className="text-xs font-bold text-blue-600">500+</div>
                                <div className="text-xs text-blue-500">Curators</div>
                              </div>
                              <div className="w-px h-6 bg-gray-300" />
                              <div className="text-center">
                                <div className="text-xs font-bold text-purple-600">95%</div>
                                <div className="text-xs text-purple-500">Match Rate</div>
                              </div>
                            </motion.div>
                          </div>
                        </CardContent>
                      )}
                      {index === 2 && (
                        <CardContent className="flex flex-col items-center text-center p-0 w-full">
                          {/* Song approval interface */}
                          <div className="w-full max-w-sm space-y-4">
                            {/* Current song being reviewed */}
                            <div className="relative p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-inner">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md flex items-center justify-center">
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                  </svg>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-3 bg-purple-300 rounded w-3/4"></div>
                                  <div className="h-2 bg-purple-200 rounded w-1/2"></div>
                                </div>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full"
                                />
                              </div>

                              {/* Waveform visualization */}
                              <div className="flex items-center justify-center gap-1 mb-4">
                                {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [8, 20, 8] }}
                                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
                                    className="w-1 bg-purple-400 rounded-full"
                                    style={{ height: 8 }}
                                  />
                                ))}
                              </div>

                              {/* Approval buttons */}
                              <div className="flex gap-3 justify-center">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                                >
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 1, duration: 0.3 }}
                                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                                >
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </motion.div>
                              </div>
                            </div>

                            {/* Match quality indicator */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8, duration: 0.4 }}
                              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200"
                            >
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.2 + i * 0.1, duration: 0.2 }}
                                    className="w-3 h-3 bg-green-500 rounded-full"
                                  />
                                ))}
                              </div>
                              <div className="h-2 bg-green-400 rounded w-16"></div>
                            </motion.div>
                          </div>
                        </CardContent>
                      )}
                      {index === 3 && (
                        <CardContent className="flex flex-col items-center text-center p-0 w-full">
                          {/* Earnings and rewards interface */}
                          <div className="w-full max-w-sm space-y-4">
                            {/* Earnings counter */}
                            <div className="relative p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-inner">
                              <div className="text-center mb-3">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3, duration: 0.5 }}
                                  className="text-3xl font-bold text-green-600 mb-1"
                                >
                                  $247.50
                                </motion.div>
                                <div className="h-2 bg-green-300 rounded w-20 mx-auto"></div>
                              </div>

                              {/* Progress bar */}
                              <div className="relative h-3 bg-green-200 rounded-full overflow-hidden mb-3">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "75%" }}
                                  transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                />
                                <motion.div
                                  initial={{ x: "-100%" }}
                                  animate={{ x: "300%" }}
                                  transition={{
                                    delay: 1.5,
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 3,
                                  }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                />
                              </div>

                              {/* Review count */}
                              <div className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <div className="h-2 bg-green-400 rounded w-12"></div>
                              </div>
                            </div>

                            {/* Bonus indicators */}
                            <div className="grid grid-cols-2 gap-2">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.4 }}
                                className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 text-center"
                              >
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                  className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </motion.div>
                                <div className="h-2 bg-orange-300 rounded w-8 mx-auto"></div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.4 }}
                                className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 text-center"
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                  className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </motion.div>
                                <div className="h-2 bg-purple-300 rounded w-6 mx-auto"></div>
                              </motion.div>
                            </div>

                            {/* Payout notification */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.4, duration: 0.4 }}
                              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-200"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full"
                              />
                              <div className="h-2 bg-blue-400 rounded w-16"></div>
                            </motion.div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>

                  {index % 2 === 0 && ( // Render number and text on right for even indices (left-aligned card) - desktop only
                    <motion.div
                      className="hidden md:flex flex-col flex-shrink-0 w-48 text-left ml-24"
                      initial={{ opacity: 0, x: 80, scale: 0.8 }}
                      animate={{
                        opacity: stepInViews[index] ? 1 : 0,
                        x: stepInViews[index] ? 0 : 80,
                        scale: stepInViews[index] ? 1 : 0.8,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <motion.span className="text-7xl font-extrabold text-brand-orange drop-shadow-lg">
                        {index + 1}
                      </motion.span>
                      <motion.h3
                        className="text-xl font-bold text-brand-green mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: stepInViews[index] ? 1 : 0, y: stepInViews[index] ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {step.headline}
                      </motion.h3>
                      <motion.p
                        className="text-brand-green/80 text-sm"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: stepInViews[index] ? 1 : 0, y: stepInViews[index] ? 0 : 15 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        {step.text}
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Below Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-brand-green mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Ready to Turn Your Playlist Into Income?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <Link href="/auth/signup">Join VIP Network Now</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
