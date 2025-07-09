import Image from "next/image"

const logos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/XO_Records_logo-KqgXIhOuC9yhK8EJkC6ILyu2j8BNuq.png",
    alt: "XO Records",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17-176899_universal-studios-dvd-logo-3-by-gina-universal-PULIkQe53zbXTfc5uOn8dWyN9UAEaZ.png",
    alt: "Universal Music Group",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/274-2748620_sony-music-entertainment-print-logo-sony-music-entertainment-t8pRcUSL0tDLDfQhBVvCQO2n3dts1v.png",
    alt: "Sony Music",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Interscope_Records-Z8sEQkQnaR1hfiJ3PkZxx8Af5HyWL5.png",
    alt: "Interscope Records",
  },
  {
    src: "/logos/rca.png",
    alt: "RCA Records",
  },
  {
    src: "/logos/warner-records.png",
    alt: "Warner Records",
  },
  {
    src: "/logos/epic.png",
    alt: "Epic Records",
  },
]

export function ScrollingLogos() {
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div className="relative w-full py-12 overflow-hidden bg-white">
      <div className="absolute inset-0 z-10 py-0 my-0">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
      <div className="w-max flex animate-scroll-left">
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 w-48 flex items-center justify-center mx-[0.1rem] sm:mx-2">
            <Image
              src={logo.src || "/placeholder.svg"}
              alt={logo.alt}
              width={140}
              height={40}
              className="object-contain h-10 w-auto filter grayscale contrast-0 brightness-[175%] opacity-70"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
