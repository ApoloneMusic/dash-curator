"use client"

import { useState, useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const formatNumberWithCommas = (value: string) => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, "")
  // Add commas for thousands
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const parseNumberFromFormatted = (value: string) => {
  // Remove commas to get the actual number
  return value.replace(/,/g, "")
}

export function EarningsCalculator() {
  const [playlists, setPlaylists] = useState(3)
  const [followers, setFollowers] = useState("50000")
  const [experience, setExperience] = useState("new")

  const calculatedData = useMemo(() => {
    const numFollowers = Number.parseInt(parseNumberFromFormatted(followers))
    if (isNaN(numFollowers) || numFollowers <= 0 || playlists <= 0) {
      return { error: "Please enter valid numbers for followers and playlists." }
    }

    const avgFollowers = numFollowers / playlists
    if (avgFollowers < 1000) {
      return { error: "Each playlist must have at least 1,000 followers to qualify for payouts." }
    }

    let basePayout = 0
    if (avgFollowers >= 1000 && avgFollowers < 10000) basePayout = 1.5
    else if (avgFollowers >= 10000 && avgFollowers < 15000) basePayout = 2.0
    else if (avgFollowers >= 15000 && avgFollowers < 75000) basePayout = 3.0
    else if (avgFollowers >= 75000) basePayout = 5.0

    let bonusMultiplier = 1.0
    let bonusPercentage = "0%"
    if (experience === "intermediate") {
      bonusMultiplier = 1.1
      bonusPercentage = "+10%"
    } else if (experience === "expert") {
      bonusMultiplier = 1.2
      bonusPercentage = "+20%"
    }

    const monthlyEarnings = basePayout * 100 * playlists * bonusMultiplier
    const effectiveRate = basePayout * bonusMultiplier

    return {
      monthlyEarnings,
      basePayout,
      totalReviews: 100 * playlists,
      bonusPercentage,
      effectiveRate,
      error: null,
    }
  }, [playlists, followers, experience])

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border-2 border-brand-orange/20 shadow-lg">
      <CardHeader className="py-2">
        <CardTitle className="text-2xl md:text-3xl font-bold text-brand-green text-center py-0 my-6">
          Estimate Your Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="py-1.5">
        <div className="grid md:grid-cols-2 gap-8 items-start py-2.5">
          <div className="space-y-6">
            <div>
              <label htmlFor="playlists" className="block text-sm font-medium text-brand-green mb-2">
                Playlists Owned: <span className="font-bold text-lg">{playlists}</span>
              </label>
              <Slider
                id="playlists"
                min={1}
                max={20}
                step={1}
                value={[playlists]}
                onValueChange={(value) => setPlaylists(value[0])}
                className="[&>span:first-child]:bg-gray-200 [&>span:first-child>span:first-child]:bg-brand-orange"
              />
            </div>
            <div>
              <label htmlFor="followers" className="block text-sm font-medium text-brand-green mb-2">
                Total Followers Across All Playlists
              </label>
              <Input
                id="followers"
                type="text"
                placeholder="e.g., 50,000"
                value={formatNumberWithCommas(followers)}
                onChange={(e) => {
                  const formattedValue = e.target.value
                  const numericValue = parseNumberFromFormatted(formattedValue)
                  setFollowers(numericValue)
                }}
                className="border-brand-green/30 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-brand-green mb-2">
                Curator Experience
              </label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger id="experience" className="border-brand-green/30 focus:ring-brand-orange">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Curator (0-199 reviews)</SelectItem>
                  <SelectItem value="intermediate">200-399 reviews</SelectItem>
                  <SelectItem value="expert">400+ reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-brand-green/5 rounded-lg p-6 h-full flex flex-col justify-center">
            {calculatedData.error ? (
              <Alert variant="destructive" className="bg-red-100 border-red-500 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>{calculatedData.error}</AlertDescription>
              </Alert>
            ) : (
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-brand-green uppercase tracking-wider">Estimated Monthly Earnings</p>
                  <p className="text-5xl font-bold text-brand-green">
                    $
                    {calculatedData.monthlyEarnings?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0.00"}
                  </p>
                </div>
                <div className="text-sm text-brand-green/80 space-y-2 pt-4 border-t border-brand-green/10">
                  <div className="flex justify-between">
                    <span>Base Payout:</span>
                    <span className="font-semibold">${calculatedData.basePayout?.toFixed(2)} / review</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Reviews:</span>
                    <span className="font-semibold">{calculatedData.totalReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience Bonus:</span>
                    <span className="font-semibold">{calculatedData.bonusPercentage}</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-green">
                    <span>Effective Rate:</span>
                    <span>${calculatedData.effectiveRate?.toFixed(2)} / review</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-brand-green/60 text-center mt-4">
              Estimate based on 100 reviews/month per playlist. Actual earnings may vary.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
