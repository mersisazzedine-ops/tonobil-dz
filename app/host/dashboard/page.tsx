'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { MOCK_CARS, MOCK_BOOKINGS } from '@/lib/mock-data'
import { Car, Clock, DollarSign, Star, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatPriceShort, formatDate } from '@/lib/utils'

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - new Date().getTime()
      if (diff <= 0) { setTimeLeft('00:00:00'); return }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / 1000 / 60) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft(`${d}j ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md">{timeLeft}</span>
}

export default function HostDashboard() {
  const { user } = useAuth()
  
  // Pour la démo, on prend quelques voitures et réservations aléatoires comme étant celles de l'hôte
  const myCars = MOCK_CARS.slice(0, 3)
  const myBookings = MOCK_BOOKINGS.filter(b => b.status === 'active' || b.status === 'upcoming')

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <div className="bg-white border-b border-border mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black text-foreground">Tableau de bord Hôte</h1>
          <p className="text-muted-foreground mt-2">Bienvenue, {user?.name}. Voici un résumé de votre activité.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Gains du mois</p>
            <p className="text-2xl font-black">{formatPriceShort(145000)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><Car className="w-5 h-5 text-blue-600" /></div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Véhicules actifs</p>
            <p className="text-2xl font-black">{myCars.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4"><Clock className="w-5 h-5 text-purple-600" /></div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Réservations à venir</p>
            <p className="text-2xl font-black">{myBookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4"><Star className="w-5 h-5 text-amber-600" /></div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Note moyenne</p>
            <p className="text-2xl font-black">4.9/5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black flex items-center gap-2"><Clock className="w-5 h-5" /> Réservations actives & à venir</h2>
            <div className="space-y-4">
              {myBookings.map(booking => {
                const car = MOCK_CARS.find(c => c.id === booking.car_id)
                if (!car) return null
                return (
                  <div key={booking.id} className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-5">
                    <img src={car.images[0]} alt={car.make} className="w-full sm:w-32 h-24 object-cover rounded-xl" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
                          <p className="text-sm text-muted-foreground">Réf: {booking.reference_number}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${booking.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {booking.status === 'active' ? 'En cours' : 'À venir'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">Départ</p>
                          <p className="text-sm font-semibold">{formatDate(booking.check_in)} {booking.check_in_time}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">Retour</p>
                          <p className="text-sm font-semibold">{formatDate(booking.check_out)} {booking.check_out_time}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <div className="text-sm text-muted-foreground">Temps restant : <CountdownTimer targetDate={booking.check_out} /></div>
                        <Link href="/messages" className="text-sm font-bold text-blue-600 hover:underline">Contacter le client</Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Car Offers */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2"><Car className="w-5 h-5" /> Mes véhicules</h2>
              <Link href="/host" className="text-sm font-bold text-blue-600 hover:underline">Ajouter</Link>
            </div>
            <div className="space-y-4">
              {myCars.map(car => (
                <Link href={`/cars/${car.id}`} key={car.id} className="block bg-white p-4 rounded-2xl border border-border shadow-sm hover:border-blue-500 transition-colors group">
                  <div className="flex gap-4">
                    <img src={car.images[0]} alt={car.make} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">{car.make} {car.model}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{formatPriceShort(car.price_per_day)}/jour</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En ligne
                      </div>
                    </div>
                    <div className="flex items-center"><ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
