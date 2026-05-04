'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car, MapPin, Calendar, Star, X, ChevronDown, Camera } from 'lucide-react'
import { MOCK_BOOKINGS, MOCK_CURRENT_USER, getCarById, getHostById } from '@/lib/mock-data'
import { formatDate, formatPriceShort, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

type BookingStatus = 'active'|'upcoming'|'past'|'cancelled'

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [time, setTime] = useState({ days:0, hours:0, minutes:0, seconds:0 })
  useEffect(() => {
    const calc = () => {
      const diff = endDate.getTime() - Date.now()
      if (diff <= 0) { setTime({days:0,hours:0,minutes:0,seconds:0}); return }
      const d = Math.floor(diff/86400000)
      const h = Math.floor((diff%86400000)/3600000)
      const m = Math.floor((diff%3600000)/60000)
      const s = Math.floor((diff%60000)/1000)
      setTime({days:d,hours:h,minutes:m,seconds:s})
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [endDate])
  return (
    <div className="flex items-center gap-2 text-primary font-bold text-sm">
      <span>⏱</span>
      {[{v:time.days,l:'j'},{v:time.hours,l:'h'},{v:time.minutes,l:'m'},{v:time.seconds,l:'s'}].map(({v,l}) => (
        <span key={l} className="bg-primary/10 px-2 py-1 rounded-lg tabular-nums">{String(v).padStart(2,'0')}{l}</span>
      ))}
      <span className="text-muted-foreground font-normal">restants</span>
    </div>
  )
}

function ReviewModal({ bookingId, carName, onClose }: { bookingId:string; carName:string; onClose:()=>void }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const submit = () => {
    if (!rating || !comment) { toast.error('Veuillez noter et commenter'); return }
    toast.success('Avis publié, merci!')
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Laisser un avis</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <p className="text-muted-foreground mb-4">{carName}</p>
        <div className="flex gap-2 mb-6">
          {[1,2,3,4,5].map(s => (
            <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
              <Star className={`w-8 h-8 transition-colors ${s<=(hover||rating)?'fill-amber-400 text-amber-400':'text-border'}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Décrivez votre expérience..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4" />
        <div className="flex gap-3">
          <button onClick={submit} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">Publier l'avis</button>
          <button onClick={onClose} className="flex-1 border border-border font-bold py-3 rounded-xl hover:bg-secondary transition-colors">Annuler</button>
        </div>
      </div>
    </div>
  )
}

function CancelModal({ onConfirm, onClose }: { onConfirm:()=>void; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-black mb-3">Annuler la réservation</h2>
        <p className="text-muted-foreground mb-6">Êtes-vous sûr de vouloir annuler? Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-destructive text-white font-bold py-3 rounded-xl hover:bg-destructive/90 transition-colors">Confirmer l'annulation</button>
          <button onClick={onClose} className="flex-1 border border-border font-bold py-3 rounded-xl hover:bg-secondary transition-colors">Retour</button>
        </div>
      </div>
    </div>
  )
}

function InspectionModal({ onClose }: { onClose:()=>void }) {
  const [photos, setPhotos] = useState<string[]>([])
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && photos.length < 4) {
      const url = URL.createObjectURL(e.target.files[0])
      setPhotos(prev => [...prev, url])
    }
  }
  const submit = () => {
    if (photos.length < 4) { toast.error('Veuillez télécharger 4 photos'); return }
    toast.success('État des lieux enregistré avec succès.')
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">État des lieux</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">Veuillez télécharger 4 photos du véhicule (Avant, Arrière, Gauche, Droite).</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[0,1,2,3].map(i => (
            <div key={i} className="aspect-video bg-secondary rounded-xl border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden">
              {photos[i] ? (
                <img src={photos[i]} className="w-full h-full object-cover" alt="" />
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs font-bold text-muted-foreground">Photo {i+1}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              )}
            </div>
          ))}
        </div>
        <button onClick={submit} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">Valider l'état des lieux</button>
      </div>
    </div>
  )
}

const STATUS_COLORS: Record<BookingStatus,string> = {
  active:'bg-green-100 text-green-700',
  upcoming:'bg-primary/10 text-primary',
  past:'bg-secondary text-muted-foreground',
  cancelled:'bg-red-100 text-red-700'
}
const STATUS_LABELS: Record<BookingStatus,string> = {
  active:'En cours', upcoming:'À venir', past:'Terminé', cancelled:'Annulé'
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('active')
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [reviewModal, setReviewModal] = useState<{id:string;carName:string}|null>(null)
  const [cancelModal, setCancelModal] = useState<string|null>(null)
  const [inspectionModal, setInspectionModal] = useState<string|null>(null)

  const grouped = {
    active: bookings.filter(b => b.status==='active'),
    upcoming: bookings.filter(b => b.status==='upcoming'),
    past: bookings.filter(b => b.status==='past'),
    cancelled: bookings.filter(b => b.status==='cancelled'),
  }
  const current = grouped[activeTab]

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id===id ? {...b, status:'cancelled' as const} : b))
    setCancelModal(null)
    toast.success('Réservation annulée.')
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-foreground mb-8">Mes Réservations</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg">{getInitials(MOCK_CURRENT_USER.name)}</div>
                <div>
                  <p className="font-bold text-foreground">{MOCK_CURRENT_USER.name}</p>
                  <p className="text-xs text-muted-foreground">{MOCK_CURRENT_USER.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                {(['active','upcoming','past','cancelled'] as BookingStatus[]).map(s => (
                  <button key={s} onClick={() => setActiveTab(s)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab===s ? 'bg-primary text-white' : 'text-foreground hover:bg-secondary'}`}>
                    <span>{STATUS_LABELS[s]}</span>
                    {grouped[s].length > 0 && <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab===s ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>{grouped[s].length}</span>}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border space-y-2">
                {[{href:'/messages',label:'Messages'},{href:'/account',label:'Mon compte'},{href:'/auth/login',label:'Se déconnecter'}].map(i => (
                  <Link key={i.href} href={i.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1">{i.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3">
            {current.length > 0 ? (
              <div className="space-y-4">
                {current.map(booking => {
                  const car = getCarById(booking.car_id)
                  const host = car ? getHostById(car.host_id) : null
                  if (!car || !host) return null
                  return (
                    <div key={booking.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                      <div className="flex flex-col sm:flex-row gap-0">
                        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                          <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-bold text-foreground">{car.make} {car.model} {car.year}</h3>
                                <p className="text-sm text-muted-foreground">{host.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{booking.reference_number}</p>
                              </div>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[activeTab]}`}>{STATUS_LABELS[activeTab]}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                              <div><p className="text-xs text-muted-foreground mb-0.5">Début</p><p className="text-sm font-semibold">{formatDate(booking.check_in)} {booking.check_in_time}</p></div>
                              <div><p className="text-xs text-muted-foreground mb-0.5">Fin</p><p className="text-sm font-semibold">{formatDate(booking.check_out)} {booking.check_out_time}</p></div>
                              <div><p className="text-xs text-muted-foreground mb-0.5">Total</p><p className="text-sm font-bold text-primary">{formatPriceShort(booking.total_price)}</p></div>
                            </div>
                            {booking.agreed_to_policy && <p className="text-xs text-emerald-600 font-medium mb-2">✓ Conditions et règlement acceptés</p>}
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.pickup_location}</p>
                          </div>
                          {activeTab === 'active' && (
                            <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                              <CountdownTimer endDate={booking.check_out} />
                            </div>
                          )}
                          <div className="flex gap-2 flex-wrap mt-3">
                            {activeTab === 'active' && (
                              <>
                                <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">Prolonger</button>
                                <button onClick={() => setInspectionModal(booking.id)} className="flex items-center gap-1 bg-secondary text-foreground text-sm font-bold px-4 py-2 rounded-xl hover:bg-secondary/80 transition-colors border border-border">
                                  <Camera className="w-4 h-4" />État des lieux
                                </button>
                              </>
                            )}
                            {(activeTab === 'active' || activeTab === 'upcoming') && (
                              <Link href="/messages" className="border border-border text-sm font-medium px-4 py-2 rounded-xl hover:bg-secondary transition-colors">Message</Link>
                            )}
                            {activeTab === 'upcoming' && (
                              <button onClick={() => setCancelModal(booking.id)} className="border border-destructive text-destructive text-sm font-medium px-4 py-2 rounded-xl hover:bg-destructive/5 transition-colors">Annuler</button>
                            )}
                            {activeTab === 'past' && (
                              <button onClick={() => setReviewModal({id:booking.id, carName:`${car.make} ${car.model}`})}
                                className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-100 transition-colors">
                                <Star className="w-3 h-3" />Laisser un avis
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">{activeTab==='active'?'🚗':activeTab==='upcoming'?'📋':activeTab==='past'?'✓':'✕'}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Aucune réservation {STATUS_LABELS[activeTab].toLowerCase()}</h3>
                <p className="text-muted-foreground mb-6">Vos réservations apparaîtront ici.</p>
                <Link href="/cars" className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">Parcourir les voitures</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewModal && <ReviewModal bookingId={reviewModal.id} carName={reviewModal.carName} onClose={() => setReviewModal(null)} />}
      {cancelModal && <CancelModal onConfirm={() => cancelBooking(cancelModal)} onClose={() => setCancelModal(null)} />}
      {inspectionModal && <InspectionModal onClose={() => setInspectionModal(null)} />}
    </div>
  )
}
