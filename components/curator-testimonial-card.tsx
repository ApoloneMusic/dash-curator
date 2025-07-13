import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface CuratorTestimonialCardProps {
  quote: string
  playlistName: string
  followers?: string
  delay: number // This prop will no longer be used for animation in this component
}

export function CuratorTestimonialCard({ quote, playlistName, followers, delay }: CuratorTestimonialCardProps) {

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col justify-between p-6 bg-white/20 backdrop-blur-lg border border-brand-lime/30 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          <p className="text-lg text-brand-green leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
          <div className="flex items-center justify-between text-sm font-semibold text-brand-green">
            <span className="font-bold">{playlistName}</span>
            <div className="flex items-center gap-1 bg-brand-lime/50 px-2 py-1 rounded-full text-xs">
              <CheckCircle className="h-3 w-3 text-brand-orange" />
              <span>Verified Curator</span>
            </div>
          </div>
          {followers && <p className="text-xs text-brand-green/70 mt-1">{followers} Followers</p>}
        </CardContent>
      </Card>
    </div>
  )
}
