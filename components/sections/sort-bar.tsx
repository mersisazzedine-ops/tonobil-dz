'use client'
import { FilterState } from './filter-utils'

const SORT_OPTIONS = [
  { value:'recommended', label:'Recommandés' },
  { value:'price_asc', label:'Prix croissant' },
  { value:'price_desc', label:'Prix décroissant' },
  { value:'newest', label:'Plus récents' },
  { value:'top_rated', label:'Mieux notés' },
]

export function SortBar({ filters, resultCount, onSortChange }: {
  filters: FilterState
  resultCount: number
  onSortChange: (sortBy: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
      <p className="text-sm text-muted-foreground font-medium">
        <span className="font-bold text-foreground">{resultCount}</span> voiture{resultCount !== 1 ? 's' : ''} trouvée{resultCount !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground whitespace-nowrap">Trier par:</label>
        <select value={filters.sortBy} onChange={e => onSortChange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  )
}
