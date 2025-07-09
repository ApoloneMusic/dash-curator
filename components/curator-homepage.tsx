import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EarningsCalculator } from "@/components/earnings-calculator"
import {
  DollarSign,
  Banknote,
  UserCheck,
  Layers,
  CheckCircle,
  CircleDollarSign,
  Headphones,
  Users,
  Clock,
  Repeat,
} from "lucide-react"
import { TrustBanner } from "@/components/trust-banner"
import { ModernHeroBackground } from "@/components/modern-hero-background"
import { ScrollingLogos } from "@/components/scrolling-logos"
import { AnimatedStatCard } from "@/components/animated-stat-card"
import { HorizontalTestimonialCarousel } from "@/components/horizontal-testimonial-carousel"
import { HowItWorks } from "@/components/how-it-works" // Import the new HowItWorks component
import { TopCuratorsLeaderboard } from "@/components/top-curators-leaderboard"

export default function CuratorHomepage() {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-brand-green" />,
      title: "Premium Rates",
      description: "Earn $1.50–$5.00 per song reviewed — top rates in the industry.",
    },
    {
      icon: <Banknote className="h-8 w-8 text-brand-green" />,
      title: "Reliable Payouts",
      description: "Get paid via secure bank transfer on a regular basis.",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-brand-green" />,
      title: "Curator-First",
      description: "You choose the songs. Full control. Built for quality curators.",
    },
    {
      icon: <Layers className="h-8 w-8 text-brand-green" />,
      title: "Multiple Rewards",
      description: "Base pay + experience tiers + leaderboard bonuses.",
    },
  ]

  const faqs = [
    {
      question: "How do bank transfers work?",
      answer:
        "We process payouts weekly via secure bank transfer. There are no minimum withdrawal amounts, giving you quick and easy access to your earnings.",
    },
    {
      question: "How much can I really earn?",
      answer:
        "Earnings vary based on your playlist's followers and your activity. Our top curators earn over $1,500 per month, with many earning $300-$800 consistently.",
    },
    {
      question: "How long do songs have to stay on my playlist?",
      answer:
        "You have full control. We require songs to remain on the playlist for a minimum of 30 days to ensure fair exposure for the artists.",
    },
    {
      question: "What if I don't get any song submissions?",
      answer:
        "Our platform actively promotes your playlists to artists. During onboarding, we provide support to ensure you start receiving relevant submissions within 48-72 hours.",
    },
    {
      question: "How are you different from other platforms?",
      answer:
        "We focus on three things: the highest payout rates, reliable bank transfers (not credits), and a quality-first approach that respects your curatorial taste.",
    },
    {
      question: "Are there bonuses?",
      answer:
        "Yes! We offer milestone bonuses for consistency, a generous referral program for bringing in other curators, and leaderboard competitions with cash prizes.",
    },
  ]

  const stats = [
    { value: "1,000+", label: "Curators Getting Paid", icon: <Users className="h-12 w-12 text-brand-orange" /> },
    {
      value: "$2,350/mo",
      label: "Avg. Top Curator Earnings",
      icon: <DollarSign className="h-12 w-12 text-blue-600" />,
    },
    { value: "48h", label: "Submission Turnaround", icon: <Clock className="h-12 w-12 text-purple-600" /> },
    { value: "85%", label: "Artist Retention Rate", icon: <Repeat className="h-12 w-12 text-red-600" /> },
  ]

  const testimonials = [
    {
      quote: "Payments are consistent and the music fits. We’ve turned our curation into real income.",
      playlistName: "Lofi State",
      followers: "38,000",
    },
    {
      quote: "Professional, fast, and rewarding. Best experience we’ve had with any submission platform.",
      playlistName: "TrapHaus Selects",
      followers: "54,000",
    },
    {
      quote:
        "Finally, a platform that respects curators. The quality of submissions is high, and payouts are reliable.",
      playlistName: "Indie Discoveries",
      followers: "22,000",
    },
    {
      quote: "Our monthly earnings have significantly increased since joining. Highly recommend for serious curators.",
      playlistName: "Chill Vibes Daily",
      followers: "75,000",
    },
    {
      quote: "The support team is incredibly responsive, and the platform is intuitive. A game-changer for us.",
      playlistName: "Electronic Pulse",
      followers: "41,000",
    },
  ]

  return (
    <div className="bg-white text-brand-green antialiased">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_0px_rgba(233,78,45,0.2)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 font-normal shadow-sm">
          <Link href="#" className="flex items-center gap-2">
            {/* Removed Music icon */}
            <span className="font-bold text-xl">Apolone.</span>
          </Link>
          <Button
            asChild
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <Link href="/auth/signup">Join Free Now</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-brand-light-lime to-white lg:py-14">
          <ModernHeroBackground />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <TrustBanner />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-green">
              Add <span className="text-brand-orange">$1,500+</span> to Your
              <br /> Monthly Curator Income
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-brand-green/80">
              Monetize your taste. Get paid for every song review.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/auth/signup">Join Free Now</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3 text-brand-green">
                <CheckCircle className="h-6 w-6 text-current" />
                <span className="font-semibold text-brand-green/90">1,000+ Curators Onboard</span>
              </div>
              <div className="flex items-center gap-3 text-brand-green">
                <CircleDollarSign className="h-6 w-6 text-brand-orange" />
                <span className="font-semibold text-brand-green/90">$500K+ Paid Out</span>
              </div>
              <div className="flex items-center gap-3 text-brand-green">
                <Headphones className="h-6 w-6 text-current" />
                <span className="font-semibold text-brand-green/90">15,000+ Artist Campaigns Run</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scrolling Logos Section */}
        <ScrollingLogos />

        {/* Benefits Grid */}
        <section className="py-16 bg-white my-8 sm:py-10">
          <h2 className="text-3xl font-bold text-center text-brand-green mb-12">Why Top Curators Trust Us</h2>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="bg-white/20 backdrop-blur-lg border border-brand-lime shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="flex flex-col items-center text-center">
                    {benefit.icon}
                    <CardTitle className="mt-4 text-xl font-bold text-brand-green">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-brand-green/80">
                    <p>{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Earnings Calculator */}
        <section className="relative z-20 py-16 bg-gradient-to-br from-brand-lime via-lime-200 to-emerald-200 rounded-t-[40px] shadow-[0_-15px_30px_rgba(0,0,0,0.2)] border-t border-x border-brand-lime/30 sm:py-16 overflow-hidden">
          {/* Beautiful gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-lime/80 via-transparent to-white/30"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-100/50 to-lime-300/40"></div>

          {/* Subtle radial highlights */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-white/20 via-transparent to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-radial from-emerald-200/30 via-transparent to-transparent blur-2xl"></div>

          <div className="container px-4 sm:px-6 lg:px-8 mx-auto my-0 relative z-10">
            <EarningsCalculator />
            <div className="mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-lg px-10 rounded-full shadow-lg transition-transform hover:scale-105 border-0 leading-7 py-6 my-1"
              >
                <Link href="/auth/signup">Join Free Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* FAQ Section */}
        <section className="py-16 bg-white sm:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-brand-green mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-brand-green/20">
                  <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-brand-green/80">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Top Curators Leaderboard Section */}
        <TopCuratorsLeaderboard />

        {/* Curator Reviews Section */}
        <section className="bg-white py-12 sm:py-10">
          <div className="container sm:px-6 lg:px-8 px-4 my-0 mx-auto">
            <h2 className="text-3xl font-bold text-center text-brand-green mb-4">Trusted by Leading Curator Brands</h2>
            <p className="text-center text-lg text-brand-green/80 mb-12 max-w-2xl mx-auto">
              Real feedback from verified curators earning through our platform.
            </p>
            <HorizontalTestimonialCarousel testimonials={testimonials} />
            <div className="mt-16 text-center py-0">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-lg rounded-full shadow-lg transition-transform hover:scale-105 px-10 mx-0 my-0 py-6"
              >
                <Link href="/auth/signup">Join VIP Network Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 sm:py-24 bg-brand-light-lime">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <AnimatedStatCard
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  delay={index * 0.1} // Staggered animation
                />
              ))}
            </div>
            <p className="mt-12 text-center text-lg text-brand-green/80 font-medium">
              Join thousands of curators earning real payouts from real artists.
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-20 sm:py-28 bg-gradient-to-br from-brand-green via-brand-green to-emerald-800 text-white overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-brand-lime rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-1/3 right-20 w-24 h-24 bg-brand-orange rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute bottom-10 right-10 w-28 h-28 bg-brand-lime rounded-full blur-xl animate-pulse delay-700"></div>
          </div>

          {/* Animated sound waveform background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Multiple waveform paths with different heights and animations */}
              <path
                d="M0,200 Q50,150 100,200 T200,200 Q250,180 300,200 T400,200 Q450,160 500,200 T600,200 Q650,170 700,200 T800,200 Q850,140 900,200 T1000,200 Q1050,190 1100,200 T1200,200"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="2"
                className="animate-pulse"
              />
              <path
                d="M0,220 Q60,180 120,220 T240,220 Q300,200 360,220 T480,220 Q540,190 600,220 T720,220 Q780,170 840,220 T960,220 Q1020,210 1080,220 T1200,220"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="1.5"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M0,180 Q40,120 80,180 T160,180 Q200,140 240,180 T320,180 Q360,100 400,180 T480,180 Q520,130 560,180 T640,180 Q680,110 720,180 T800,180 Q840,160 880,180 T960,180 Q1000,170 1040,180 T1200,180"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="1"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold">Start Earning from Your Playlists</h2>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/auth/signup">Sign Up & Start Earning</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-brand-green/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-brand-green/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Apolone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
