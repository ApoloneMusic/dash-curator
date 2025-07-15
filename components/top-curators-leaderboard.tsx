"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Star, Trophy, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CuratorData {
  rank: number
  username: string
  bonus: number
  weeklyEarnings: number
  badge: "gold" | "silver" | "bronze" | "honorable"
  description: string
  pfpColor: string
  pfpImage?: string
}

const curators: CuratorData[] = [
  {
    rank: 1,
    username: "@LoFiKing",
    bonus: 1000,
    weeklyEarnings: 5341,
    badge: "gold",
    description: "Highest payout, top priority on future campaigns",
    pfpColor: "from-purple-400 to-pink-400",
    pfpImage: "/pfps/lofi-king.jpeg/",
  },
  {
    rank: 2,
    username: "@IndieMuse",
    bonus: 500,
    weeklyEarnings: 4892,
    badge: "silver",
    description: "Premium campaign invites + increased payout rates",
    pfpColor: "from-blue-400 to-cyan-400",
    pfpImage: "/pfps/indie-muse.jpeg/",
  },
  {
    rank: 3,
    username: "@TrapWavez",
    bonus: 250,
    weeklyEarnings: 4156,
    badge: "bronze",
    description: "Early access to high-paying review drops",
    pfpColor: "from-orange-400 to-red-400",
    pfpImage: "/pfps/trap-wavez.jpeg/",
  },
  {
    rank: 4,
    username: "@ChillBeats",
    bonus: 100,
    weeklyEarnings: 3724,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-green-400 to-emerald-400",
  },
  {
    rank: 5,
    username: "@HouseVault",
    bonus: 100,
    weeklyEarnings: 3298,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-indigo-400 to-purple-400",
  },
  {
    rank: 6,
    username: "@JazzTemple",
    bonus: 100,
    weeklyEarnings: 2967,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-yellow-400 to-orange-400",
    pfpImage: "/pfps/jazz-temple.jpeg/",
  },
  {
    rank: 7,
    username: "@RnBSelects",
    bonus: 100,
    weeklyEarnings: 2543,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-pink-400 to-rose-400",
    pfpImage: "/pfps/rnb-selects.jpeg/",
  },
  {
    rank: 8,
    username: "@SynthLord",
    bonus: 100,
    weeklyEarnings: 2187,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-teal-400 to-blue-400",
    pfpImage: "/pfps/synth-lord.png/",
  },
  {
    rank: 9,
    username: "@LofiHits",
    bonus: 100,
    weeklyEarnings: 1834,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-red-400 to-pink-400",
    pfpImage: "/pfps/rap-radar.jpeg/",
  },
  {
    rank: 10,
    username: "@GlobalGrooves",
    bonus: 100,
    weeklyEarnings: 1456,
    badge: "honorable",
    description: "VIP curator perks",
    pfpColor: "from-cyan-400 to-teal-400",
    pfpImage: "/pfps/global-grooves.jpeg/",
  },
]

const AnimatedCounter = ({ value, delay = 0, prefix = "$" }: { value: number; delay?: number; prefix?: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {isInView && (
        <motion.span
          initial={{ textContent: "0" }}
          animate={{ textContent: value.toString() }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          onUpdate={(latest) => {
            if (ref.current) {
              const currentValue = Math.floor(Number.parseFloat(latest.textContent as string) || 0)
              ref.current.textContent = `${prefix}${currentValue.toLocaleString()}`
            }
          }}
        />
      )}
    </motion.span>
  )
}

const BadgeIcon = ({ badge }: { badge: string }) => {
  const baseClasses =
    "w-6 h-6 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden flex-shrink-0"

  switch (badge) {
    case "gold":
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600`}>
          <Crown className="h-3 w-3 text-white drop-shadow-sm" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
      )
    case "silver":
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500`}>
          <Trophy className="h-3 w-3 text-white drop-shadow-sm" />
        </div>
      )
    case "bronze":
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600`}>
          <Zap className="h-3 w-3 text-white drop-shadow-sm" />
        </div>
      )
    default:
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-brand-lime via-lime-400 to-lime-500`}>
          <Star className="h-3 w-3 text-brand-green drop-shadow-sm" />
        </div>
      )
  }
}

const ProfilePicture = ({
  pfpColor,
  username,
  rank,
  pfpImage,
}: { pfpColor: string; username: string; rank: number; pfpImage?: string }) => {
  const initial = username.charAt(1).toUpperCase() // Get first letter after @

  return (
    <div className="relative flex-shrink-0">
      {pfpImage ? (
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
          <Image
            src={pfpImage ?? "/placeholder.svg"}
            alt={`${username} profile`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${pfpColor} flex items-center justify-center shadow-sm`}
        >
          <span className="text-white font-bold text-sm">{initial}</span>
        </div>
      )}
      {/* Rank badge overlay */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-green text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
        {rank}
      </div>
    </div>
  )
}

const CuratorCard = ({ curator, index }: { curator: CuratorData; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const isTopTier = curator.rank <= 3

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="w-full"
    >
      <Card
        className={`
        ${isTopTier ? "p-3 bg-gradient-to-r from-white via-brand-light-lime/15 to-white border-2" : "p-2.5 bg-white/95 border"}
        ${curator.badge === "gold" ? "border-yellow-400/60 shadow-yellow-100/30" : ""}
        ${curator.badge === "silver" ? "border-gray-400/60 shadow-gray-100/30" : ""}
        ${curator.badge === "bronze" ? "border-orange-400/60 shadow-orange-100/30" : ""}
        ${curator.badge === "honorable" ? "border-brand-lime/30 shadow-brand-lime/10" : ""}
        shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden
      `}
      >
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            {/* Profile Picture with Rank */}
            <ProfilePicture
              pfpColor={curator.pfpColor}
              username={curator.username}
              rank={curator.rank}
              pfpImage={curator.pfpImage}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`${isTopTier ? "text-sm" : "text-xs"} font-bold text-brand-green truncate`}>
                  {curator.username}
                </h3>
                <BadgeIcon badge={curator.badge} />
              </div>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`${isTopTier ? "text-sm" : "text-xs"} font-extrabold text-brand-orange`}>
                    <AnimatedCounter value={curator.bonus} delay={index * 0.05} /> Bonus
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className={`${isTopTier ? "text-xs" : "text-xs"} font-semibold text-brand-green`}>
                    <AnimatedCounter value={curator.weeklyEarnings} delay={index * 0.05 + 0.1} /> This Week
                  </span>
                </div>
              </div>

              <p className={`${isTopTier ? "text-xs" : "text-xs"} text-brand-green/60 line-clamp-1`}>
                {curator.description}
              </p>
            </div>
          </div>

          {isTopTier && (
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
              className="h-0.5 bg-gradient-to-r from-brand-orange to-brand-lime rounded-full mt-2"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TopCuratorsLeaderboard() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const topThree = curators.slice(0, 3)
  const honorableMentions = curators.slice(3)

  return (
    <section
      ref={sectionRef}
      className="py-8 bg-gradient-to-br from-brand-light-lime via-white to-brand-light-lime relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-orange rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-lime rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-xl md:text-2xl font-extrabold text-brand-green mb-2">🏆 Top 10 Curators of the Week</h2>
          <p className="text-sm md:text-base text-brand-green/80 max-w-lg mx-auto">
            Biggest payouts. Biggest impact. Only the elite make it here.
          </p>
        </motion.div>

        {/* Leaderboard - Single Column Layout */}
        <div className="max-w-xl mx-auto">
          {/* Top 3 Curators */}
          <div className="mb-6">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base font-bold text-brand-green mb-3 text-center"
            >
              🥇 Elite Champions
            </motion.h3>
            <div className="space-y-2">
              {topThree.map((curator, index) => (
                <CuratorCard key={curator.rank} curator={curator} index={index} />
              ))}
            </div>
          </div>

          {/* Honorable Mentions */}
          <div className="mb-6">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base font-bold text-brand-green mb-3 text-center"
            >
              ⭐ Honorable Mentions
            </motion.h3>
            <div className="space-y-1.5">
              {honorableMentions.map((curator, index) => (
                <CuratorCard key={curator.rank} curator={curator} index={index + 3} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-brand-green via-brand-green to-emerald-800 text-white rounded-xl p-4 relative overflow-hidden max-w-4xl mx-auto"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 w-8 h-8 border border-white rounded-full" />
            <div className="absolute top-3 right-3 w-6 h-6 border border-white rounded-full" />
            <div className="absolute bottom-2 left-1/3 w-10 h-10 border border-white rounded-full" />
            <div className="absolute bottom-3 right-1/4 w-4 h-4 border border-white rounded-full" />
          </div>

          <div className="relative z-10">
            <h3 className="text-lg md:text-xl font-bold mb-2">The Game Resets Weekly</h3>
            <p className="text-sm md:text-base mb-4 opacity-90">
              Start reviewing now to claim your spot. New leaderboard every Monday.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-sm px-6 py-2 rounded-full shadow-lg transition-transform"
              >
                <Link href="/auth/signup">Join the Battle for #1</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
