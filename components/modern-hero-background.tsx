"use client"

import { motion } from "framer-motion"

const SoundWave = ({ d, delay = 0 }: { d: string; delay?: number }) => (
  <motion.path
    d={d}
    fill="none"
    stroke="url(#lime-gradient)"
    strokeWidth="2"
    strokeLinecap="round"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{
      pathLength: { delay, type: "spring", duration: 2, bounce: 0 },
      opacity: { delay, duration: 0.5 },
    }}
  />
)

export function ModernHeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Grey Radial Border Glow */}
      <div className="absolute left-1/2 top-1/2 -z-30 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(128,128,128,0.4)_0%,rgba(128,128,128,0)_90%)]" />
      {/* Radial Glow */}
      <div className="absolute left-1/2 top-1/2 -z-20 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(218,255,113,0.1)_0%,rgba(218,255,113,0)_70%)]" />

      {/* Animated Soundwaves */}
      <div className="absolute inset-0 -z-10 animate-wave-pulse">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <linearGradient id="lime-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DAFF71" stopOpacity="0" />
              <stop offset="50%" stopColor="#DAFF71" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DAFF71" stopOpacity="0" />
            </linearGradient>
          </defs>
          <SoundWave d="M 0 40 C 200 40 200 120 400 120 C 600 120 600 40 800 40" delay={0} />
          <SoundWave
            d="M 100% 80 C 80% 80 80% 160 60% 160 C 40% 160 40% 80 20% 80 C 0 80 -20% 80 -40% 80"
            delay={0.5}
          />
        </svg>
        <svg width="100%" height="100%" className="absolute inset-0 scale-y-[-1] transform">
          <defs>
            <linearGradient id="lime-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DAFF71" stopOpacity="0" />
              <stop offset="50%" stopColor="#DAFF71" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DAFF71" stopOpacity="0" />
            </linearGradient>
          </defs>
          <SoundWave d="M 0 60 C 250 60 250 140 500 140 C 750 140 750 60 1000 60" delay={0.2} />
        </svg>
      </div>
    </div>
  )
}
