"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const reviews = [
  `"Finally, payouts that make sense."`,
  `"The best platform for serious curators."`,
  `"My earnings doubled in the first month."`,
  `"Super responsive and helpful team."`,
]

export function TrustBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 4000) // Change review every 4 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="relative h-12 w-full max-w-md mx-auto flex items-center justify-center rounded-full bg-black/5 backdrop-blur-sm border border-white/10">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center text-base text-brand-green/80 font-medium"
        >
          {reviews[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
