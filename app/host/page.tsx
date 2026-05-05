'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Star, Upload, X, Check, ChevronRight, ChevronLeft, Car, Clock, TrendingUp, BadgeCheck } from 'lucide-react'
import { CAR_BRANDS, ALGERIAN_WILAYAS, CAR_FEATURES } from '@/lib/constants'
import { formatPriceShort } from '@/lib/utils'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

const TESTIMONIALS = [
  { name: 'Karim B.',  city: 'Alger',       text: "En moins d'une semaine ma voiture était déjà réservée. Processus simple, paiement rapide.", earned: '74 000 DA',  avatar: 'K' },
  { name: 'Amira L.', city: 'Oran',         text: "Je gagne plus avec ma voiture qu'avec mon travail à mi-temps. Plateforme top !",          earned: '112 000 DA', avatar: 'A' },
  { name: 'Yacine M.',city: 'Constantine',  text: 'Support réactif, locataires sérieux. Je recommande à tous les propriétaires.',            earned: '58 000 DA',  avatar: 'Y' },
]

const PERKS = [
  { icon: Shield,     title: 'Couverture assurance',  desc: "Chaque location inclut une couverture assurance complète pour votre véhicule." },
  { icon: BadgeCheck, title: 'Locataires vérifiés',   desc: "Tous les locataires sont vérifiés avec pièce d'identité et permis de conduire." },
  { icon: TrendingUp, title: 'Revenus en dinars',     desc: 'Recevez vos gains directement en DA, sans frais cachés ni conversion.'          },
  { icon: Clock,      title: 'Disponible 24/7',       desc: 'Notre support est disponible à toute heure pour vous et vos locataires.'         },
]

export default function HostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [view,     setView]     = useState<'hero'|'form'>('hero')
  const [formStep, setFormStep] = useState(1)
  const [photos,   setPhotos]   = useState<{file: File, preview: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['ac'])
  const [form, setForm] = useState({
    make:'', model:'', year:'', wilaya:'Alger', mileage:'',
    transmission:'manual', fuel:'petrol', price:8000, deposit:50000, description:''
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return
    Array.from(files).forEach(f => setPhotos(prev => [...prev, { file: f, preview: URL.createObjectURL(f) }]))
  }
  const toggleFeature = (f: string) =>
    setSelectedFeatures(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev,f])

  const handleNext = () => {
    if (formStep===1) {
      if (!form.make||!form.model||!form.year) { toast.error('Remplissez tous les champs obligatoires'); return }
      setFormStep(2)
    } else if (formStep===2) {
      if (photos.length<1) { toast.error('Ajoutez au moins une photo'); return }
      setFormStep(3)
    }
  }
  const handleSubmit = async () => {
    if (!user) { toast.error('Veuillez vous connecter pour continuer'); return }
    setIsSubmitting(true)
    try {
      const uploadedImageUrls: string[] = []
      
      for (const photo of photos) {
        const ext = photo.file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const { data, error } = await supabase.storage.from('car-images').upload(fileName, photo.file)
        if (error) throw new Error('Erreur lors du téléchargement des images')
        
        const { data: publicData } = supabase.storage.from('car-images').getPublicUrl(fileName)
        uploadedImageUrls.push(publicData.publicUrl)
      }
      
      const { error } = await supabase.from('cars').insert({
        host_id: user.id,
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        price_per_day: form.price,
        deposit_amount: form.deposit,
        transmission: form.transmission,
        fuel_type: form.fuel,
        seats: 5, doors: 5, mileage: parseInt(form.mileage) || 0,
        images: uploadedImageUrls,
        features: selectedFeatures,
        city: form.wilaya, wilaya: form.wilaya, address: form.wilaya,
        description: form.description,
        car_type: 'sedan',
        status: 'pending'
      })
      
      if (error) throw new Error('Erreur lors de la création de l\'annonce')
      
      toast.success('Votre voiture a été soumise pour révision! Nous vous contacterons sous 24h.')
      setTimeout(() => router.push('/manage-bookings'), 2000)
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── HERO VIEW ── */
  if (view === 'hero') return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8 border border-blue-100">
            <Car className="w-4 h-4" /> Devenez hôte TONOBIL DZ
          </span>
          <h1 className="text-5xl sm:text-7xl font-black text-foreground mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
            Votre voiture rapporte<br />
            <span className="text-blue-600">quand vous ne l'utilisez pas</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Rejoignez la plus grande communauté d'autopartage en Algérie. Listez votre véhicule, choisissez vos locataires et encaissez en dinars.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={()=>setView('form')}
              className="bg-blue-600 text-white font-black px-10 py-4 rounded-full text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-1 transition-all w-full sm:w-auto">
              Commencer maintenant
            </button>
          </div>
        </div>
        
        {/* Large Hero Image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" 
            alt="Hôte Tonobil" 
            className="w-full h-[500px] object-cover rounded-3xl shadow-2xl" 
          />
          {/* Floating badge */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-5 rounded-2xl shadow-xl z-20 border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Gains moyens potentiels</p>
              <p className="text-2xl font-black text-foreground">85 000 DA<span className="text-base font-medium text-muted-foreground"> /mois</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4 tracking-tight">Pourquoi louer sur TONOBIL DZ ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Tout ce dont vous avez besoin pour louer votre véhicule en toute sérénité et sécurité.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PERKS.map(p => (
              <div key={p.title} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <p.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-foreground mb-3 text-lg">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-16 tracking-tight">3 étapes pour commencer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { n:'1', title:'Listez', desc:'Ajoutez votre voiture avec photos, description et tarif en quelques minutes.', color:'bg-blue-600' },
              { n:'2', title:'Recevez', desc:'Les locataires réservent votre voiture, vous validez et recevez une notification.', color:'bg-blue-600' },
              { n:'3', title:'Gagnez en DA', desc:'Récupérez vos gains directement sur votre compte, en dinars algériens.', color:'bg-blue-600' },
            ].map(s => (
              <div key={s.n} className="text-center group">
                <div className={`w-16 h-16 rounded-3xl ${s.color} text-white text-2xl font-black flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300`}>{s.n}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">Ce que disent nos hôtes</h2>
            <p className="text-muted-foreground text-lg">Des Algériens qui génèrent déjà des revenus avec leur véhicule</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i=><Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400"/>)}
                </div>
                <p className="text-foreground leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">{t.avatar}</div>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Gains ce mois</p>
                    <p className="font-black text-blue-600">{t.earned}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">Prêt à commencer ?</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Listez votre voiture aujourd'hui et recevez votre première réservation sous 48h. C'est simple et gratuit.</p>
          <button onClick={()=>setView('form')}
            className="bg-blue-600 text-white font-black px-12 py-5 rounded-full text-lg hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all">
            Lister ma voiture maintenant
          </button>
        </div>
      </section>
    </div>
  )

  /* ── FORM VIEW ── */
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={()=>{ if(formStep>1) setFormStep(p=>p-1); else setView('hero') }}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold">
          <ChevronLeft className="w-5 h-5" />Retour
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-foreground">Lister ma voiture</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {formStep===1 && 'Informations du véhicule et équipements'}
                {formStep===2 && 'Ajoutez des photos attractives'}
                {formStep===3 && 'Définissez votre tarif et caution'}
              </p>
            </div>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Étape {formStep}/3</span>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1,2,3].map(i => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i<=formStep?'bg-blue-600':'bg-gray-100'}`} />
            ))}
          </div>

          {/* Step 1 – Vehicle info */}
          {formStep===1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label:'Marque *', type:'select', key:'make', options:CAR_BRANDS },
                  { label:'Modèle *', type:'text', key:'model', placeholder:'ex: Corolla' },
                  { label:'Année *', type:'number', key:'year', placeholder:'2022' },
                  { label:'Wilaya', type:'wilaya', key:'wilaya' },
                  { label:'Kilométrage', type:'number', key:'mileage', placeholder:'45000' },
                  { label:'Transmission', type:'trans', key:'transmission' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold mb-2 text-foreground">{f.label}</label>
                    {f.type==='select' && (
                      <select value={(form as any)[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors">
                        <option value="">Sélectionner</option>
                        {f.options?.map(b=><option key={b} value={b}>{b}</option>)}
                      </select>
                    )}
                    {f.type==='wilaya' && (
                      <select value={form.wilaya} onChange={e=>setForm({...form,wilaya:e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors">
                        {ALGERIAN_WILAYAS.map(w=><option key={w} value={w}>{w}</option>)}
                      </select>
                    )}
                    {f.type==='trans' && (
                      <select value={form.transmission} onChange={e=>setForm({...form,transmission:e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors">
                        <option value="manual">Manuelle</option>
                        <option value="auto">Automatique</option>
                      </select>
                    )}
                    {(f.type==='text'||f.type==='number') && (
                      <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                        onChange={e=>setForm({...form,[f.key]:e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors" />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">Équipements</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(CAR_FEATURES).map(([key,feat]) => (
                    <button key={key} type="button" onClick={()=>toggleFeature(key)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${selectedFeatures.includes(key)?'border-blue-600 bg-blue-50 text-blue-700':'border-border hover:border-blue-200 hover:bg-gray-50'}`}>
                      <span className="text-base">{feat.icon}</span>
                      <span className="text-xs">{feat.label}</span>
                      {selectedFeatures.includes(key) && <Check className="w-3 h-3 ml-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 – Photos */}
          {formStep===2 && (
            <div>
              <label className="block cursor-pointer mb-4">
                <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <Upload className="w-12 h-12 text-blue-300 group-hover:text-blue-500 mx-auto mb-3 transition-colors" />
                  <p className="font-bold text-foreground mb-1">Cliquez pour ajouter des photos</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG (minimum 3 photos recommandées)</p>
                  <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </div>
              </label>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((p,i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-sm">
                      <img src={p.preview} alt="" className="w-full h-full object-cover" />
                      <button onClick={()=>setPhotos(prev=>prev.filter((_,j)=>j!==i))} type="button"
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                        <X className="w-4 h-4 text-white" />
                      </button>
                      {i===0 && <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Principale</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3 – Price */}
          {formStep===3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-blue-700 text-sm font-medium mb-1">💡 Conseil de tarification</p>
                <p className="text-blue-600 text-sm">En Algérie, les voitures similaires se louent entre <strong>6 000 et 15 000 DA/jour</strong>. Commencez compétitif pour vos premières réservations.</p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Tarif journalier (DA)</label>
                <input type="number" value={form.price} onChange={e=>setForm({...form,price:+e.target.value})} min="1000" step="500"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors" />
                <p className="text-sm text-muted-foreground mt-2">Revenus estimés (20 jours/mois) : <span className="font-bold text-foreground">{formatPriceShort(form.price*20)}</span></p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Caution de sécurité (DA)</label>
                <input type="number" value={form.deposit} onChange={e=>setForm({...form,deposit:+e.target.value})} min="10000" step="5000"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors" />
                <p className="text-sm text-muted-foreground mt-2">Montant retenu temporairement sur la carte du locataire, remboursé à la restitution.</p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description du véhicule</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4}
                  placeholder="Décrivez votre voiture, son état, ses atouts..."
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-colors resize-none" />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="pt-8 mt-8 border-t border-border">
            {formStep < 3 ? (
              <button onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Suivant <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
                {isSubmitting ? 'Soumission en cours...' : 'Soumettre ma voiture ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
