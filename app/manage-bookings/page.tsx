'use client'
import { useState, useEffect } from 'react'
import { Car, Clock, DollarSign, Star, Calendar, ChevronRight, MapPin, Map, Loader2 } from 'lucide-react'
import { formatPriceShort, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Booking, Car as CarType } from '@/lib/mock-data'

type Tab = 'trips' | 'hosting'

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

  return <span className="font-bold text-blue-600 text-sm">{timeLeft}</span>
}

export default function ManageBookingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('trips')
  
  const [myTrips, setMyTrips] = useState<Booking[]>([])
  const [myCars, setMyCars] = useState<CarType[]>([])
  const [myHostingBookings, setMyHostingBookings] = useState<Booking[]>([])
  const [allCarsMap, setAllCarsMap] = useState<Record<string, CarType>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user) { setIsLoading(false); return }
      
      setIsLoading(true)
      
      // Fetch my trips
      const { data: trips } = await supabase.from('bookings').select('*').eq('user_id', user.id)
      if (trips) setMyTrips(trips as unknown as Booking[])
      
      // Fetch my cars
      const { data: cars } = await supabase.from('cars').select('*').eq('host_id', user.id)
      if (cars) setMyCars(cars as unknown as CarType[])
      
      // Fetch bookings for my cars
      const { data: hostBookings } = await supabase.from('bookings').select('*').eq('host_id', user.id)
      if (hostBookings) {
        setMyHostingBookings(
          (hostBookings as unknown as Booking[]).filter(b => b.status === 'active' || b.status === 'upcoming')
        )
      }
      
      // Fetch cars for all bookings (trips + hosting) to display
      const allCarIds = new Set([
        ...(trips || []).map(b => b.car_id), 
        ...(hostBookings || []).map(b => b.car_id),
        ...(cars || []).map(c => c.id)
      ])
      
      if (allCarIds.size > 0) {
        const { data: allCars } = await supabase.from('cars').select('*').in('id', Array.from(allCarIds))
        if (allCars) {
          const cMap: Record<string, any> = {}
          allCars.forEach(c => { 
            cMap[c.id] = { ...c, location: { wilaya: c.wilaya, city: c.city, address: c.address } }
          })
          setAllCarsMap(cMap)
        }
      }
      
      setIsLoading(false)
    }
    fetchData()
  }, [user])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Veuillez vous connecter pour voir vos réservations.</div>

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <div className="bg-white border-b border-border mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black text-foreground">Gérer mes réservations</h1>
          <p className="text-muted-foreground mt-2">Retrouvez ici vos voyages ainsi que vos annonces de location.</p>
          
          <div className="flex gap-4 mt-8 border-b border-border">
            <button onClick={() => setActiveTab('trips')}
              className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'trips' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              Mes voyages
            </button>
            <button onClick={() => setActiveTab('hosting')}
              className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'hosting' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              Mes annonces (Hôte)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: TRIPS (Voyageur) */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Map className="w-5 h-5 text-blue-600" /> Historique et voyages en cours</h2>
            
            {myTrips.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold">Aucun voyage pour le moment</h3>
                <p className="text-muted-foreground mt-1 mb-6">Commencez à explorer pour trouver votre première voiture.</p>
                <Link href="/cars" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors inline-block">
                  Parcourir les voitures
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myTrips.map(booking => {
                  const car = allCarsMap[booking.car_id]
                  if (!car) return null
                  return (
                    <div key={booking.id} className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                      <div className="md:w-64 h-48 md:h-auto">
                        <img src={car.images[0]} alt={car.make} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
                              <p className="text-muted-foreground flex items-center gap-1 text-sm mt-1"><MapPin className="w-4 h-4"/> {car.location.wilaya}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                booking.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                booking.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                booking.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {booking.status === 'completed' ? 'Terminé' : booking.status === 'active' ? 'En cours' : booking.status === 'upcoming' ? 'À venir' : 'Annulé'}
                              </span>
                              <p className="font-bold text-lg mt-2">{formatPriceShort(booking.total_price)}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-secondary/50 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">Départ</p>
                              <p className="font-medium text-sm mt-1">{formatDate(booking.check_in)}</p>
                              <p className="text-sm font-bold">{booking.check_in_time}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">Retour</p>
                              <p className="font-medium text-sm mt-1">{formatDate(booking.check_out)}</p>
                              <p className="text-sm font-bold">{booking.check_out_time}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-3">
                          {booking.status === 'completed' ? (
                            <button className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">Laisser un avis</button>
                          ) : (
                            <>
                              <button className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">Contacter l'hôte</button>
                              <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">Voir les détails</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HOSTING (Annonces & Réservations) */}
        {activeTab === 'hosting' && (
          <div className="space-y-8">
            {/* Stats Hôte */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Gains générés</p>
                <p className="text-2xl font-black">{formatPriceShort(145000)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><Car className="w-5 h-5 text-blue-600" /></div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Véhicules en ligne</p>
                <p className="text-2xl font-black">{myCars.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4"><Clock className="w-5 h-5 text-purple-600" /></div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Réservations à venir</p>
                <p className="text-2xl font-black">{myHostingBookings.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Réservations reçues */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /> Réservations reçues</h2>
                <div className="space-y-4">
                  {myHostingBookings.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-border text-center">
                      <p className="text-muted-foreground">Aucune réservation en attente pour le moment.</p>
                    </div>
                  ) : (
                    myHostingBookings.map(booking => {
                      const car = allCarsMap[booking.car_id]
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
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${booking.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {booking.status === 'active' ? 'En cours' : 'À venir'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Départ</p>
                                <p className="text-sm font-semibold text-foreground">{formatDate(booking.check_in)}</p>
                                <p className="text-sm text-muted-foreground">{booking.check_in_time}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Retour</p>
                                <p className="text-sm font-semibold text-foreground">{formatDate(booking.check_out)}</p>
                                <p className="text-sm text-muted-foreground">{booking.check_out_time}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-border pt-4">
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-0.5">Temps restant</span>
                                <CountdownTimer targetDate={booking.check_out} />
                              </div>
                              <button className="text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">Détails</button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Liste des annonces */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Car className="w-5 h-5 text-blue-600" /> Mes véhicules</h2>
                  <Link href="/host" className="text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Ajouter</Link>
                </div>
                <div className="space-y-3">
                  {myCars.map(car => (
                    <Link href={`/cars/${car.id}`} key={car.id} className="block bg-white p-3 rounded-2xl border border-border shadow-sm hover:border-blue-400 transition-colors group">
                      <div className="flex gap-4">
                        <img src={car.images[0]} alt={car.make} className="w-20 h-20 object-cover rounded-xl" />
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors text-sm">{car.make} {car.model}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{formatPriceShort(car.price_per_day)}/jour</p>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Publié
                          </div>
                        </div>
                        <div className="flex items-center"><ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" /></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
