'use client'
import { CAR_BRANDS, CAR_TYPES, CAR_FEATURES } from '@/lib/constants'
import { FilterState, DEFAULT_FILTERS } from '@/lib/filter-utils'
import { formatPriceShort } from '@/lib/utils'
import { RotateCcw } from 'lucide-react'

interface Props {
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  priceRange: [number, number]
  yearRange: [number, number]
}

export function FilterSidebar({ filters, onFiltersChange, priceRange, yearRange }: Props) {
  const toggle = (key: keyof FilterState, val: string) => {
    const arr = filters[key] as string[]
    onFiltersChange({ ...filters, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-foreground">Filtres</h3>
        <button onClick={() => onFiltersChange(DEFAULT_FILTERS)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
          <RotateCcw className="w-3 h-3" />Réinitialiser
        </button>
      </div>

      {/* Price */}
      <div className="border-t border-border pt-5">
        <h4 className="font-bold text-sm text-foreground mb-3">Prix par jour</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPriceShort(filters.priceRange[0])}</span>
            <span>{formatPriceShort(filters.priceRange[1])}</span>
          </div>
          <input type="range" min={priceRange[0]} max={priceRange[1]} value={filters.priceRange[1]}
            onChange={e => onFiltersChange({ ...filters, priceRange: [filters.priceRange[0], +e.target.value] })}
            className="w-full accent-primary" />
        </div>
      </div>

      {/* Car Type */}
      <div className="border-t border-border pt-5">
        <h4 className="font-bold text-sm text-foreground mb-3">Type de véhicule</h4>
        <div className="flex flex-wrap gap-2">
          {CAR_TYPES.map(t => (
            <button key={t.id} onClick={() => onFiltersChange({ ...filters, carType: t.id })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filters.carType === t.id ? 'bg-primary text-white border-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="border-t border-border pt-5">
        <h4 className="font-bold text-sm text-foreground mb-3">Marque</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {CAR_BRANDS.map(b => (
            <label key={b} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggle('brands', b)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="border-t border-border pt-5">
        <h4 className="font-bold text-sm text-foreground mb-3">Transmission</h4>
        <div className="flex gap-2">
          {[{v:'any',l:'Tous'},{v:'auto',l:'Auto'},{v:'manual',l:'Manuel'}].map(o => (
            <button key={o.v} onClick={() => onFiltersChange({ ...filters, transmission: o.v })}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${filters.transmission === o.v ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary/50'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel */}
      <div className="border-t border-border pt-5">
        <h4 className="font-bold text-sm text-foreground mb-3">Carburant</h4>
        <div className="grid grid-cols-2 gap-2">
          {[{v:'any',l:'Tous'},{v:'petrol',l:'Essence'},{v:'diesel',l:'Diesel'},{v:'hybrid',l:'Hybride'},{v:'electric',l:'Électrique'}].map(o => (
            <button key={o.v} onClick={() => onFiltersChange({ ...filters, fuelType: o.v })}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${filters.fuelType === o.v ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary/50'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Seats */}
      <div className="border-t border-border pt-5">
        <h4 className="font-bold text-sm text-foreground mb-3">Places minimum</h4>
        <div className="flex gap-2">
          {[{v:0,l:'Tous'},{v:2,l:'2+'},{v:4,l:'4+'},{v:5,l:'5+'},{v:7,l:'7+'}].map(o => (
            <button key={o.v} onClick={() => onFiltersChange({ ...filters, minSeats: o.v })}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${filters.minSeats === o.v ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary/50'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Instant Book */}
      <div className="border-t border-border pt-5">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-bold text-sm text-foreground">Réservation instantanée</p>
            <p className="text-xs text-muted-foreground">Confirmer sans attendre</p>
          </div>
          <button onClick={() => onFiltersChange({ ...filters, instantBook: !filters.instantBook })}
            className={`w-12 h-6 rounded-full transition-colors relative ${filters.instantBook ? 'bg-primary' : 'bg-border'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.instantBook ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </label>
      </div>
    </div>
  )
}
