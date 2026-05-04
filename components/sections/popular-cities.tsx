'use client'
import Link from 'next/link'
import { ALGERIAN_CITIES } from '@/lib/constants'
import { MapPin, Car } from 'lucide-react'

export function PopularCitiesSection() {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <span className="section-tag">
            <MapPin className="w-3 h-3" /> Destinations
          </span>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">
                Populaire en Algérie
              </h2>
              <p className="text-muted-foreground text-lg">
                Explorez les meilleures destinations pour louer une voiture
              </p>
            </div>
            <Link
              href="/cars"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Tout voir →
            </Link>
          </div>
        </div>

        {/* Scroll row */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {ALGERIAN_CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/cars?city=${encodeURIComponent(city.wilaya)}`}
              className="flex-shrink-0 w-52 group"
            >
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-sm img-zoom border border-border/50">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* City name */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3 h-3 text-white/70" />
                    <span className="text-white/70 text-xs">{city.ar}</span>
                  </div>
                  <p className="font-bold text-white text-base leading-tight">{city.name}</p>
                </div>

                {/* Car count badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded-full">
                  <Car className="w-3 h-3 text-primary" />
                  {city.carCount.toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
