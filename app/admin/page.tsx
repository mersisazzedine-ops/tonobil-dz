'use client'
import { useState, useEffect } from 'react'
import { Users, Car, DollarSign, LayoutDashboard, Check, X, Shield, Settings, FileText, Loader2 } from 'lucide-react'
import { formatPriceShort, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { User, Car as CarType, Booking } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

type Tab = 'overview' | 'users' | 'cars' | 'finances' | 'hosts'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { user, isLoading: authLoading } = useAuth()
  
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [pendingHosts, setPendingHosts] = useState<User[]>([])
  const [pendingCars, setPendingCars] = useState<CarType[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.is_admin) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setIsLoading(true)
    
    const [
      { data: pUsers }, 
      { data: pHosts }, 
      { data: pCars }, 
      { data: bks },
      { count: uCount }
    ] = await Promise.all([
      supabase.from('users').select('*').eq('kyc_status', 'pending'),
      supabase.from('users').select('*').eq('host_status', 'pending'),
      supabase.from('cars').select('*').eq('status', 'pending'),
      supabase.from('bookings').select('*'),
      supabase.from('users').select('*', { count: 'exact', head: true })
    ])
    
    if (pUsers) setPendingUsers(pUsers.map((u: any) => ({...u, avatar: 'U'})) as User[])
    if (pHosts) setPendingHosts(pHosts.map((u: any) => ({...u, avatar: 'U'})) as User[])
    if (pCars) {
      setPendingCars(pCars.map((c: any) => ({
        ...c, 
        location: { city: c.city, wilaya: c.wilaya, address: c.address }
      })) as CarType[])
    }
    if (bks) setBookings(bks as unknown as Booking[])
    if (uCount !== null) setTotalUsers(uCount)
      
    setIsLoading(false)
  }

  const handleApproveUser = async (id: string) => {
    const { error } = await supabase.from('users').update({ kyc_status: 'verified' }).eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setPendingUsers(prev => prev.filter(u => u.id !== id))
    toast.success('Utilisateur vérifié (KYC approuvé)')
  }

  const handleRejectUser = async (id: string) => {
    const { error } = await supabase.from('users').update({ kyc_status: 'none' }).eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setPendingUsers(prev => prev.filter(u => u.id !== id))
    toast.error('KYC rejeté')
  }

  const handleApproveCar = async (id: string) => {
    const { error } = await supabase.from('cars').update({ status: 'active' }).eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setPendingCars(prev => prev.filter(c => c.id !== id))
    toast.success('Véhicule approuvé et publié')
  }

  const handleRejectCar = async (id: string) => {
    const { error } = await supabase.from('cars').delete().eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setPendingCars(prev => prev.filter(c => c.id !== id))
    toast.error('Véhicule rejeté')
  }

  const handleApproveHost = async (id: string) => {
    const { error } = await supabase.from('users').update({ host_status: 'approved' }).eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setPendingHosts(prev => prev.filter(u => u.id !== id))
    toast.success('Hôte approuvé avec succès')
  }

  const handleRejectHost = async (id: string) => {
    const { error } = await supabase.from('users').update({ host_status: 'none' }).eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setPendingHosts(prev => prev.filter(u => u.id !== id))
    toast.error('Demande d\'hôte rejetée')
  }

  // Calculate some KPIs
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'upcoming').length
  const platformRevenue = bookings.reduce((acc, b) => acc + (b.total_price * 0.1), 0) // 10% fee

  if (authLoading || (user?.is_admin && isLoading)) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 px-4 text-center">
        <Shield className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-4xl font-black text-foreground mb-4">Accès Refusé</h1>
        <p className="text-muted-foreground max-w-md mb-8">Vous n'avez pas les droits d'administration nécessaires pour accéder à cette page.</p>
        <Link href="/" className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white border-r border-border flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Admin Panel
          </h2>
        </div>
        <div className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
            { id: 'users', label: 'Vérifications KYC', icon: Users, badge: pendingUsers.length },
            { id: 'hosts', label: 'Demandes Hôtes', icon: Shield, badge: pendingHosts.length },
            { id: 'cars', label: 'Véhicules en attente', icon: Car, badge: pendingCars.length },
            { id: 'finances', label: 'Finances & Frais', icon: DollarSign },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === item.id ? 'bg-white text-primary' : 'bg-red-100 text-red-600'}`}>{item.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-black text-foreground mb-2">Vue d'ensemble</h1>
              <p className="text-muted-foreground">Bienvenue dans le tableau de bord administrateur TONOBIL DZ.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Utilisateurs Inscrits</p>
                  <p className="text-3xl font-black text-foreground">{totalUsers}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center"><Car className="w-6 h-6 text-green-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Réservations Actives</p>
                  <p className="text-3xl font-black text-foreground">{activeBookings}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center"><DollarSign className="w-6 h-6 text-amber-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Revenus Plateforme (10%)</p>
                  <p className="text-3xl font-black text-foreground">{formatPriceShort(platformRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-foreground">KYC à vérifier</h3>
                  <button onClick={() => setActiveTab('users')} className="text-sm text-primary font-semibold hover:underline">Voir tout</button>
                </div>
                {pendingUsers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune vérification en attente.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.slice(0, 3).map(u => (
                      <div key={u.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">{u.avatar}</div>
                          <div><p className="font-bold text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">En attente</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-foreground">Véhicules à approuver</h3>
                  <button onClick={() => setActiveTab('cars')} className="text-sm text-primary font-semibold hover:underline">Voir tout</button>
                </div>
                {pendingCars.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun véhicule en attente.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingCars.slice(0, 3).map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                        <img src={c.images[0]} alt="" className="w-16 h-12 object-cover rounded-lg" />
                        <div><p className="font-bold text-sm">{c.make} {c.model}</p><p className="text-xs text-muted-foreground">{c.location.wilaya}</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-black text-foreground mb-6">Vérifications KYC ({pendingUsers.length})</h1>
            {pendingUsers.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-border">
                <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Tout est à jour !</h3>
                <p className="text-muted-foreground">Aucune vérification d'identité en attente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map(user => (
                  <div key={user.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">{user.avatar}</div>
                      <div>
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-muted-foreground text-sm">{user.email} · {user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-xs font-bold bg-secondary text-foreground px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors">
                          <FileText className="w-4 h-4" /> ID Document
                        </button>
                        <button className="flex items-center gap-1 text-xs font-bold bg-secondary text-foreground px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors">
                          <FileText className="w-4 h-4" /> Permis
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveUser(user.id)} className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleRejectUser(user.id)} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-black text-foreground mb-6">Véhicules en attente ({pendingCars.length})</h1>
            {pendingCars.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-border">
                <Car className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Aucun véhicule en attente</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCars.map(car => (
                  <div key={car.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col lg:flex-row gap-6">
                    <img src={car.images[0]} alt="" className="w-48 h-32 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl">{car.make} {car.model} {car.year}</h3>
                          <span className="font-black text-primary">{formatPriceShort(car.price_per_day)}/j</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{car.location.city}, {car.location.wilaya}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="bg-secondary px-3 py-1 rounded-full font-medium">{car.transmission === 'auto' ? 'Auto' : 'Manuelle'}</span>
                          <span className="bg-secondary px-3 py-1 rounded-full font-medium capitalize">{car.fuel_type}</span>
                          <span className="bg-secondary px-3 py-1 rounded-full font-medium">Caution: {formatPriceShort(car.deposit_amount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4 lg:mt-0">
                        <button onClick={() => handleRejectCar(car.id)} className="px-6 py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors">Rejeter</button>
                        <button onClick={() => handleApproveCar(car.id)} className="px-6 py-2 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">Approuver</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hosts' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-black text-foreground mb-6">Demandes Hôtes ({pendingHosts.length})</h1>
            {pendingHosts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-border">
                <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Aucune demande en attente</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingHosts.map(user => (
                  <div key={user.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">{user.avatar}</div>
                      <div>
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-muted-foreground text-sm">{user.email} · {user.phone}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> KYC Vérifié</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveHost(user.id)} className="px-6 py-2 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">Approuver</button>
                        <button onClick={() => handleRejectHost(user.id)} className="px-6 py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors">Rejeter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-black text-foreground mb-6">Finances & Frais</h1>
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="p-4 font-bold">Référence</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Montant Total</th>
                    <th className="p-4 font-bold text-primary">Frais (10%)</th>
                    <th className="p-4 font-bold">Paiement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="p-4 font-mono text-xs">
                        {b.reference_number}
                        {b.agreed_to_policy && <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold" title="Règlement accepté">✓ Règl.</span>}
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(b.check_in)} {b.check_in_time && <span className="text-xs">à {b.check_in_time}</span>}</td>
                      <td className="p-4 font-semibold">{formatPriceShort(b.total_price)}</td>
                      <td className="p-4 font-black text-primary">+{formatPriceShort(b.total_price * 0.1)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${b.payment_method === 'edahabia' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {b.payment_method === 'edahabia' ? 'Edahabia' : 'Cash'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
