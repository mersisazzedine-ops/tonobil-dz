'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star, Zap, Users, Fuel, Car } from 'lucide-react'
import { MOCK_CARS, getHostById } from '@/lib/mock-data'
import { formatPriceShort, getInitials } from '@/lib/utils'

export function FeaturedCarsSection() {
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const featured = MOCK_CARS.slice(0, 8)

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-tag">
              <Car className="w-3 h-3" /> Sélection du moment
            </span>
            <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">
              Voitures en vedette
            </h2>
            <p className="text-muted-foreground text-lg">Les meilleures offres sélectionnées pour vous</p>
          </div>
          <Link
            href="/cars"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(car => {
            const host = getHostById(car.host_id)
            if (!host) return null
            return (
              <Link key={car.id} href={`/cars/${car.id}`} className="group block">
                <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">

                  {/* Image */}
                  <div className="relative h-48 img-zoom overflow-hidden bg-secondary">
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Instant badge */}
                    {car.instant_book && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        <Zap className="w-3 h-3" /> Instant
                      </div>
                    )}

                    {/* Save button */}
                    <button
                      onClick={e => toggleSave(e, car.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${saved.has(car.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                      />
                    </button>

                    {/* Host avatar */}
                    <div className="absolute bottom-3 left-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow">
                        {getInitials(host.name)}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    {/* Rating + type */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-foreground">{car.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({car.review_count})</span>
                      </div>
                      <span className="text-xs bg-secondary text-muted-foreground capitalize px-2 py-0.5 rounded-full font-medium">
                        {car.car_type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-foreground leading-tight">
                      {car.make} {car.model}
                    </h3>

                    {/* Specs */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{car.seats}</span>
                      <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel_type}</span>
                      <span>{car.transmission === 'auto' ? 'Auto' : 'Manuel'}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 pt-2 mt-auto border-t border-border">
                      <span className="text-xl font-black text-primary">{formatPriceShort(car.price_per_day)}</span>
                      <span className="text-xs text-muted-foreground font-medium">/jour</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25"
          >
            Voir toutes les voitures →
          </Link>
        </div>

      </div>
    </section>
  )
}
