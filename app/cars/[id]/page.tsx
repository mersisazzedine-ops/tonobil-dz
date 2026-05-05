'use client'
import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Star, Shield, MessageSquare, Users, Fuel, Settings, MapPin, ChevronLeft, Zap, Calendar, X, CheckCircle2, FileText, Phone, Loader2 } from 'lucide-react'
import { formatPriceShort, calculateDaysRented, getInitials } from '@/lib/utils'
import { CAR_FEATURES } from '@/lib/constants'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Car, Host, Review } from '@/lib/mock-data'

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [car, setCar] = useState<Car | null>(null)
  const [host, setHost] = useState<Host | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedImage, setSelectedImage] = useState(0)
  const searchParams = useSearchParams()
  const today = new Date().toISOString().split('T')[0]
  const [checkIn,  setCheckIn]  = useState(searchParams.get('from') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('to') || '')
  const [fromTime, setFromTime] = useState(searchParams.get('fromTime') || '09:00')
  const [toTime,   setToTime]   = useState(searchParams.get('toTime') || '09:00')
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)
  const [payment, setPayment]   = useState<'online'|'cash'>('online')
  const licenseRef = useRef<HTMLInputElement>(null)
  const [licenseFile,    setLicenseFile]    = useState<File|null>(null)
  const [licensePreview, setLicensePreview] = useState<string|null>(null)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const carId = Array.isArray(params.id) ? params.id[0] : params.id
      
      const { data: carData } = await supabase.from('cars').select('*').eq('id', carId).single()
      if (carData) {
        setCar({
          ...carData,
          location: { city: carData.city, wilaya: carData.wilaya, address: carData.address },
          rating: 0, review_count: 0
        } as Car)
        
        const { data: hostData } = await supabase.from('users').select('*').eq('id', carData.host_id).single()
        if (hostData) {
          setHost({ ...hostData, rating: 5, reviews_count: 0, name: hostData.name || 'Hôte' } as Host)
        }
        
        const { data: reviewsData } = await supabase.from('reviews').select('*, users(name, avatar_url)').eq('car_id', carId)
        if (reviewsData) {
          setReviews(reviewsData.map(r => ({
            id: r.id, car_id: r.car_id, user_name: r.users?.name || 'User', avatar: 'U', rating: r.rating, comment: r.comment, date: new Date(r.created_at).toLocaleDateString()
          })) as Review[])
        }
      }
      setIsLoading(false)
    }
    if (params.id) fetchData()
  }, [params.id])

  const handleLicense = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setLicenseFile(f); setLicensePreview(URL.createObjectURL(f))
  }
  const removeLicense = () => { setLicenseFile(null); setLicensePreview(null); if (licenseRef.current) licenseRef.current.value = '' }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>

  if (!car || !host) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-6xl mb-4">🚗</div>
        <h1 className="text-2xl font-bold mb-2">Voiture introuvable</h1>
        <Link href="/cars" className="text-blue-600 hover:underline">Retour aux voitures</Link>
      </div>
    </div>
  )

  let hours = 0;
  if (checkIn && checkOut && fromTime && toTime) {
    const start = new Date(`${checkIn}T${fromTime}`)
    const end = new Date(`${checkOut}T${toTime}`)
    hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }
  
  const days       = hours > 0 ? Math.max(1, Math.ceil(hours / 24)) : 0
  const subtotal   = car.price_per_day * days
  const serviceFee = Math.round(subtotal * 0.1)
  const total      = subtotal + serviceFee
  const avgRating  = reviews.length > 0 ? reviews.reduce((s,r) => s+r.rating,0)/reviews.length : car.rating
  const ratingCounts = [5,4,3,2,1].map(n => ({ n, count: reviews.filter(r => r.rating===n).length }))

  const handleBook = async () => {
    if (!user)                 { toast.error('Veuillez vous connecter pour réserver'); return }
    if (!checkIn || !checkOut) { toast.error('Veuillez sélectionner vos dates'); return }
    if (hours < 2)             { toast.error('La durée minimale de location est de 2 heures.'); return }
    if (!licenseFile)          { toast.error('Veuillez télécharger votre permis de conduire'); return }
    if (!agreedToPolicy)       { toast.error('Veuillez accepter les conditions générales'); return }
    
    setIsBooking(true)
    try {
      // 1. Upload Document
      const ext = licenseFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, licenseFile)

      if (uploadError) throw new Error('Erreur lors du téléchargement du permis')

      // 2. Create Booking
      const referenceNumber = `TNB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
      const { error: bookingError } = await supabase.from('bookings').insert({
        car_id: car.id,
        user_id: user.id,
        host_id: car.host_id,
        reference_number: referenceNumber,
        check_in: checkIn,
        check_out: checkOut,
        check_in_time: fromTime,
        check_out_time: toTime,
        total_price: total,
        payment_method: payment === 'online' ? 'edahabia' : 'cash',
        agreed_to_policy: agreedToPolicy
      })

      if (bookingError) throw new Error('Erreur lors de la réservation')

      toast.success('Réservation confirmée!')
      setTimeout(() => router.push('/manage-bookings'), 1500)
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/cars" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />Retour aux voitures
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative w-full h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <img src={car.images[selectedImage]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                {car.instant_book && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
                    <Zap className="w-4 h-4" />Réservation instantanée
                  </div>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {car.images.map((img,i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage===i?'border-blue-600 scale-105 shadow-md':'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground">· {reviews.length} avis ·</span>
                <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-4 h-4" />{car.location.city}</div>
              </div>
              <h1 className="text-3xl font-black text-foreground">{car.make} {car.model} ({car.year})</h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">{car.description}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label:'Places', value:`${car.seats}`, icon:Users },
                { label:'Transmission', value:car.transmission==='auto'?'Automatique':'Manuelle', icon:Settings },
                { label:'Carburant', value:car.fuel_type, icon:Fuel },
                { label:'Portes', value:`${car.doors}`, icon:Calendar },
              ].map(s => (
                <div key={s.label} className="bg-white border border-border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                  <s.icon className="w-5 h-5 text-blue-600" />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-bold capitalize">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-4">Équipements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {car.features.map(f => {
                  const feat = CAR_FEATURES[f as keyof typeof CAR_FEATURES]
                  return feat ? (
                    <div key={f} className="flex items-center gap-2 p-3 bg-white border border-border rounded-xl shadow-sm">
                      <span className="text-xl">{feat.icon}</span>
                      <span className="text-sm font-medium">{feat.label}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>

            {/* Insurance */}
            {car.insurance_included && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Assurance Tous Risques Incluse</h4>
                  <p className="text-sm text-muted-foreground">Votre location est couverte contre tous dommages et vols.</p>
                </div>
              </div>
            )}

            {/* Host */}
            <div className="bg-white border border-border rounded-2xl p-6 flex items-start justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
                  {getInitials(host.name)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{host.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {host.rating.toFixed(1)} · {host.reviews_count} avis
                  </div>
                  {host.verified && <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold"><Shield className="w-3 h-3" />Hôte vérifié</div>}
                  <p className="text-sm text-muted-foreground mt-1">Membre depuis {new Date(host.member_since).getFullYear()} · Répond en {host.response_time}</p>
                </div>
              </div>
              <a href={`tel:${host.phone}`} className="flex items-center gap-2 bg-foreground text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-foreground/80 transition-colors whitespace-nowrap">
                <Phone className="w-4 h-4" />{host.phone}
              </a>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-5">Avis des locataires</h3>
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-5xl font-black">{avgRating.toFixed(1)}</p>
                    <div className="flex gap-0.5 mt-1 justify-center">{[1,2,3,4,5].map(i=><Star key={i} className={`w-4 h-4 ${i<=Math.round(avgRating)?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>)}</div>
                    <p className="text-sm text-muted-foreground mt-1">{reviews.length} avis</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingCounts.map(({n,count}) => (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-3">{n}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{width:reviews.length?`${(count/reviews.length)*100}%`:'0%'}} />
                        </div>
                        <span className="text-xs text-muted-foreground w-3">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  {reviews.map(r => (
                    <div key={r.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">{r.avatar}</div>
                        <div>
                          <p className="font-bold text-sm">{r.user_name}</p>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(i=><Star key={i} className={`w-3 h-3 ${i<=r.rating?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>)}
                            <span className="text-xs text-muted-foreground ml-1">{r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Widget */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-border rounded-2xl shadow-lg p-6 space-y-5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-600">{formatPriceShort(car.price_per_day)}</span>
                <span className="text-muted-foreground text-sm">/jour</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Départ</label>
                  <input type="date" value={checkIn} min={today} onChange={e=>setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 mb-2" />
                  <input type="time" value={fromTime} onChange={e=>setFromTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Retour</label>
                  <input type="date" value={checkOut} min={checkIn||today} onChange={e=>setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 mb-2" />
                  <input type="time" value={toTime} onChange={e=>setToTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
              </div>

              {/* Price breakdown */}
              {days > 0 && (
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">{formatPriceShort(car.price_per_day)} × {days} jour{days>1?'s':''}</span><span className="font-medium">{formatPriceShort(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Frais de service (10%)</span><span className="font-medium">{formatPriceShort(serviceFee)}</span></div>
                  <div className="flex justify-between font-black text-base border-t border-border pt-3"><span>Total</span><span className="text-blue-600">{formatPriceShort(total)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Caution (remboursable)</span><span className="font-semibold text-foreground">{formatPriceShort(car.deposit_amount)}</span></div>
                </div>
              )}

              {/* Payment */}
              {days > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Paiement</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([{id:'online',label:'💳 En ligne (CIB)'},{id:'cash',label:'💵 À la livraison'}] as const).map(opt => (
                      <button key={opt.id} onClick={()=>setPayment(opt.id)}
                        className={`px-2 py-3 rounded-xl border text-xs font-bold transition-all ${payment===opt.id?'bg-blue-600 text-white border-blue-600':'bg-white text-foreground border-border hover:border-blue-300'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Licence upload */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Permis de conduire <span className="text-red-500">*</span>
                </label>
                {licensePreview ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-blue-200">
                    <img src={licensePreview} alt="Permis" className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-white text-xs font-semibold truncate">{licenseFile?.name}</span>
                    </div>
                    <button onClick={removeLicense} type="button"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group">
                      <FileText className="w-8 h-8 text-blue-300 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-blue-700">Télécharger le permis</p>
                      <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG ou PDF</p>
                    </div>
                    <input ref={licenseRef} type="file" accept="image/*,.pdf" onChange={handleLicense} className="hidden" />
                  </label>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Requis pour confirmer la réservation.</p>
              </div>

              {hours !== 0 && hours < 2 && (
                <p className="text-xs text-red-500 font-semibold text-center">La durée minimale de location est de 2 heures.</p>
              )}

              {/* Policy */}
              <label className="flex items-start gap-2 cursor-pointer mt-4">
                <input type="checkbox" checked={agreedToPolicy} onChange={e=>setAgreedToPolicy(e.target.checked)} className="mt-1" />
                <span className="text-xs text-muted-foreground leading-snug">J'accepte les <Link href="#" className="text-blue-600 hover:underline">conditions générales</Link> et le règlement de la plateforme TONOBIL DZ.</span>
              </label>

              <button disabled={hours !== 0 && hours < 2} onClick={handleBook}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20">
                {days > 0 ? `Réserver pour ${formatPriceShort(total)}` : 'Réserver maintenant'}
              </button>

              <a href={`tel:${host.phone}`} className="w-full flex items-center justify-center gap-2 border border-border font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-foreground">
                <Phone className="w-4 h-4" />Appeler le {host.phone}
              </a>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700">
                <p className="font-bold mb-0.5">✓ Annulation gratuite</p>
                <p className="text-emerald-600">Annulez gratuitement jusqu'à 24h avant le début.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
