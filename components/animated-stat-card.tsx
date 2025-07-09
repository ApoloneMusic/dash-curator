"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface AnimatedStatCardProps {
  value: string
  label: string
  icon: string
  delay: number
}

export function AnimatedStatCard({ value, label, icon, delay }: AnimatedStatCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay }}
      className="h-full"
    >
      <Card className="h-full flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="flex flex-col items-center text-center p-0">
          <div className="text-5xl mb-2" role="img" aria-label={label}>
            {icon}
          </div>
          <p className="text-2xl lg:text-2xl font-extrabold text-brand-green">{value}</p>
          <p className="mt-2 text-base font-bold text-brand-green">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
