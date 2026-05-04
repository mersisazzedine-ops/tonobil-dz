'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Star, Zap, Users, Fuel, SlidersHorizontal, MapPin, X } from 'lucide-react'
import { MOCK_CARS, getHostById } from '@/lib/mock-data'
import { formatPriceShort, getInitials } from '@/lib/utils'
import { FilterSidebar } from '@/components/sections/filter-sidebar'
import { SortBar } from '@/components/sections/sort-bar'
import { filterCars, DEFAULT_FILTERS, getPriceRange, getYearRange, FilterState } from '@/lib/filter-utils'

function CarsContent() {
  const searchParams = useSearchParams()
  const initCity = searchParams.get('city') || ''
  const fromParam = searchParams.get('from') || ''
  const fromTimeParam = searchParams.get('fromTime') || ''
  const toParam = searchParams.get('to') || ''
  const toTimeParam = searchParams.get('toTime') || ''
  
  const queryParams = new URLSearchParams()
  if (fromParam) queryParams.set('from', fromParam)
  if (fromTimeParam) queryParams.set('fromTime', fromTimeParam)
  if (toParam) queryParams.set('to', toParam)
  if (toTimeParam) queryParams.set('toTime', toTimeParam)
  const queryString = queryParams.toString()
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS })
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 9

  const priceRange = useMemo(() => getPriceRange(MOCK_CARS), [])
  const yearRange = useMemo(() => getYearRange(MOCK_CARS), [])
  const filteredCars = useMemo(() => {
    let cars = filterCars(MOCK_CARS, filters)
    if (initCity) cars = cars.filter(c => c.location.wilaya === initCity || c.location.city === initCity)
    return cars
  }, [filters, initCity])

  const totalPages = Math.ceil(filteredCars.length / PER_PAGE)
  const paginated = filteredCars.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-border px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-1">
              {initCity ? `Voitures à ${initCity}` : 'Parcourir les voitures'}
            </h1>
            <p className="text-muted-foreground">{filteredCars.length} voiture{filteredCars.length !== 1 ? 's' : ''} disponible{filteredCars.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />Filtres
          </button>
        </div>

        <div className="flex gap-6 px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar filters={filters} onFiltersChange={f => { setFilters(f); setPage(1) }} priceRange={priceRange} yearRange={yearRange} />
          </div>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="ml-auto w-80 bg-white h-full overflow-y-auto relative">
                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white z-10">
                  <h3 className="font-bold">Filtres</h3>
                  <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4">
                  <FilterSidebar filters={filters} onFiltersChange={f => { setFilters(f); setPage(1) }} priceRange={priceRange} yearRange={yearRange} />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <SortBar filters={filters} resultCount={filteredCars.length} onSortChange={sortBy => setFilters({...filters, sortBy})} />

            {paginated.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                  {paginated.map(car => {
                    const host = getHostById(car.host_id)
                    if (!host) return null
                    return (
                      <Link key={car.id} href={`/cars/${car.id}${queryString ? `?${queryString}` : ''}`}>
                        <div className="bg-white rounded-2xl border border-border shadow-sm card-hover overflow-hidden h-full flex flex-col">
                          <div className="relative h-52 img-zoom overflow-hidden">
                            <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            {car.instant_book && (
                              <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                <Zap className="w-3 h-3" />Instant
                              </div>
                            )}
                            <button onClick={e => toggleSave(e, car.id)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform">
                              <Heart className={`w-4 h-4 ${saved.has(car.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                            </button>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                {getInitials(host.name)}
                              </div>
                              <span className="text-white text-xs font-medium bg-black/40 px-2 py-0.5 rounded-full">{car.images.length} photos</span>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-bold">{car.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({car.review_count})</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />{car.location.city}
                              </div>
                            </div>
                            <h3 className="font-bold text-foreground">{car.make} {car.model} <span className="font-normal text-muted-foreground">{car.year}</span></h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{car.seats} places</span>
                              <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel_type}</span>
                              <span>{car.transmission === 'auto' ? 'Auto' : 'Manuel'}</span>
                            </div>
                            <div className="flex items-baseline gap-1 pt-2 mt-auto border-t border-border">
                              <span className="text-xl font-black text-primary">{formatPriceShort(car.price_per_day)}</span>
                              <span className="text-xs text-muted-foreground">/jour</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${p === page ? 'bg-primary text-white' : 'bg-secondary text-foreground hover:bg-primary/10'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-7xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Aucune voiture trouvée</h3>
                <p className="text-muted-foreground mb-8">Essayez de modifier vos filtres pour voir plus de résultats</p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarsPage() {
  return <Suspense><CarsContent /></Suspense>
}
