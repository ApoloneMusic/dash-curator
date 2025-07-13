"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CuratorTestimonialCard } from "./curator-testimonial-card"
import { motion, AnimatePresence } from "framer-motion" // Re-added framer-motion imports

interface Testimonial {
  quote: string
  playlistName: string
  followers?: string
}

interface HorizontalTestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function HorizontalTestimonialCarousel({ testimonials }: HorizontalTestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = (direction: "left" | "right") => {
    if (testimonials.length === 0) return

    setCurrentIndex((prevIndex) => {
      if (direction === "right") {
        return (prevIndex + 1) % testimonials.length
      }

      return (prevIndex - 1 + testimonials.length) % testimonials.length
    })
  }

  return (
    <div className="relative">
      <div className="relative min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {testimonials.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }} // Slide in from right
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }} // Slide out to left
              transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth and fast animation
              className="absolute w-full max-w-lg mx-auto px-4" // Absolute positioning for overlapping transitions
            >
              <CuratorTestimonialCard
                quote={testimonials[currentIndex].quote}
                playlistName={testimonials[currentIndex].playlistName}
                followers={testimonials[currentIndex].followers}
                delay={0} // Delay prop is now effectively unused in the card itself
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows for Desktop */}
      {testimonials.length > 1 && (
        <div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("left")}
            className="pointer-events-auto bg-brand-orange text-white rounded-full shadow-md hover:bg-brand-orange/90 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("right")}
            className="pointer-events-auto bg-brand-orange text-white rounded-full shadow-md hover:bg-brand-orange/90 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Pagination Dots for Mobile */}
      {testimonials.length > 1 && (
        <div className="flex lg:hidden justify-center space-x-2 mt-14">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-6 rounded-full transition-colors duration-300 ${
                index === currentIndex ? "bg-brand-orange" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
