'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar } from 'lucide-react'
import { ALGERIAN_WILAYAS } from '@/lib/constants'

export function HeroSection() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [city, setCity] = useState('Alger')
  const [fromDate, setFromDate] = useState('')
  const [fromTime, setFromTime] = useState('09:00')
  const [toDate, setToDate] = useState('')
  const [toTime, setToTime] = useState('09:00')
  const [error, setError] = useState('')

  const handleSearch = () => {
    if (!fromDate || !toDate) { setError('Veuillez sélectionner les dates de début et de fin.'); return }
    
    const start = new Date(`${fromDate}T${fromTime}`)
    const end = new Date(`${toDate}T${toTime}`)
    const diffHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    
    if (diffHrs < 2) { 
      setError('La durée minimale de location est de 2 heures.'); 
      return 
    }

    setError('')
    router.push(`/cars?city=${encodeURIComponent(city)}&from=${fromDate}&fromTime=${fromTime}&to=${toDate}&toTime=${toTime}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop"
          alt="Car background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="mb-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full font-medium">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Plus de 3 000 voitures disponibles en Algérie
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
          La voiture qu'il vous faut,<br />
          <span className="text-blue-400">où que vous soyez</span>
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Réservez instantanément auprès d'hôtes vérifiés à Alger, Oran, Constantine et partout en Algérie.
        </p>

        {/* Search Widget */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto text-left">
          {error && <p className="text-destructive text-sm mb-4 font-medium">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* City */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                <MapPin className="w-3 h-3 text-primary" />Wilaya
              </label>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                {ALGERIAN_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            {/* From */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                <Calendar className="w-3 h-3 text-primary" />Départ
              </label>
              <input type="date" value={fromDate} min={today} onChange={e => setFromDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide block">Heure départ</label>
              <input type="time" value={fromTime} onChange={e => setFromTime(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            {/* To */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                <Calendar className="w-3 h-3 text-primary" />Retour
              </label>
              <input type="date" value={toDate} min={fromDate || today} onChange={e => setToDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide block">Heure retour</label>
              <input type="time" value={toTime} onChange={e => setToTime(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>
          <button onClick={handleSearch}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-base shadow-lg shadow-blue-600/25">
            <Search className="w-5 h-5" />Rechercher une voiture
          </button>
        </div>
      </div>
    </section>
  )
}
