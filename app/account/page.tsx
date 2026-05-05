'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, Shield, Upload, Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { User } from '@/lib/mock-data'

export default function AccountPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [dbUser, setDbUser] = useState<User | null>(null)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [kycStatus, setKycStatus] = useState<'none' | 'pending' | 'verified'>('none')
  const [idDoc, setIdDoc] = useState<string | null>(null)
  const [licenseDoc, setLicenseDoc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!user) { setIsLoading(false); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) {
        setDbUser(data as User)
        setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '' })
        setKycStatus(data.kyc_status || 'none')
        setIdDoc(data.id_document_url || null)
        setLicenseDoc(data.license_document_url || null)
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user) return
    const { error } = await supabase.from('users').update({ name: profile.name, phone: profile.phone }).eq('id', user.id)
    if (error) { toast.error('Erreur lors de la mise à jour'); return }
    toast.success('Profil mis à jour!')
  }

  const handleBecomeAdmin = async () => {
    if (!user) return
    const { error } = await supabase.from('users').update({ is_admin: true }).eq('id', user.id)
    if (error) { toast.error('Erreur: ' + error.message); return }
    toast.success('Vous êtes maintenant admin !')
    await refreshUser()
    router.push('/admin')
  }

  const uploadDoc = async (file: File, type: 'id' | 'license') => {
    if (!user) return
    toast.info('Téléchargement en cours...')
    const ext = file.name.split('.').pop()
    const fileName = `${user.id}-${type}-${Date.now()}.${ext}`
    
    const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(fileName, file)
    if (uploadError) { toast.error('Erreur lors du téléchargement'); return }
    
    const { data: publicData } = supabase.storage.from('kyc-documents').getPublicUrl(fileName)
    const url = publicData.publicUrl
    
    const updateData = type === 'id' ? { id_document_url: url } : { license_document_url: url }
    await supabase.from('users').update(updateData).eq('id', user.id)
    
    if (type === 'id') setIdDoc(url)
    else setLicenseDoc(url)
    
    toast.success('Document ajouté avec succès')
  }

  const submitKyc = async () => {
    if (!user) return
    const { error } = await supabase.from('users').update({ kyc_status: 'pending' }).eq('id', user.id)
    if (error) { toast.error('Erreur lors de la soumission'); return }
    setKycStatus('pending')
    toast.success('Documents soumis pour vérification')
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Veuillez vous connecter pour voir votre profil.</div>

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <div className="bg-white border-b border-border mb-8">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">Consultez et modifiez vos informations personnelles.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
        {/* Profile Info */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black">
                {getInitials(profile.name)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nom complet</label>
              <input type="text" value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Adresse email</label>
              <input type="email" value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Téléphone</label>
              <input type="tel" value={profile.phone}
                onChange={e => setProfile({...profile, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50" />
            </div>
            
            <button onClick={handleUpdateProfile} className="w-full sm:w-auto mt-4 bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
              Enregistrer les modifications
            </button>
          </div>
        </div>

        {/* KYC Info */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold">Vérification d'identité (KYC)</h2>
              <p className="text-sm text-muted-foreground mt-1">Obligatoire pour louer ou proposer un véhicule.</p>
            </div>
            <div>
              {kycStatus === 'verified' && <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit"><Shield className="w-4 h-4"/>Vérifié</span>}
              {kycStatus === 'pending' && <span className="bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit"><Shield className="w-4 h-4"/>En attente</span>}
              {kycStatus === 'none' && <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit"><Shield className="w-4 h-4"/>Non vérifié</span>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-foreground text-sm mb-3">Carte d'identité</h3>
              <div className="aspect-[1.58] bg-secondary/50 rounded-xl border-2 border-dashed border-border hover:border-blue-400 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                {idDoc ? (
                  <>
                    <div className="w-full h-full bg-slate-200 opacity-50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>
                      <span className="text-xs font-bold text-green-700">Document chargé</span>
                    </div>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-500 px-4 text-center">Cliquez pour ajouter</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { if(e.target.files?.[0]) uploadDoc(e.target.files[0], 'id') }} />
                  </label>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm mb-3">Permis de conduire</h3>
              <div className="aspect-[1.58] bg-secondary/50 rounded-xl border-2 border-dashed border-border hover:border-blue-400 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                {licenseDoc ? (
                  <>
                    <div className="w-full h-full bg-slate-200 opacity-50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>
                      <span className="text-xs font-bold text-green-700">Document chargé</span>
                    </div>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-500 px-4 text-center">Cliquez pour ajouter</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { if(e.target.files?.[0]) uploadDoc(e.target.files[0], 'license') }} />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {kycStatus === 'none' && (
            <button onClick={submitKyc} disabled={!idDoc || !licenseDoc}
              className="w-full sm:w-auto bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Soumettre pour vérification
            </button>
          )}
        </div>

      </div>

      {/* Dev Only: Make Admin */}
      {!user?.is_admin && (
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-red-800 font-bold text-lg flex items-center gap-2"><Shield className="w-5 h-5" /> Mode Développeur</h2>
              <p className="text-red-600 text-sm">Obtenez les droits d'administration pour tester le tableau de bord Admin.</p>
            </div>
            <button onClick={handleBecomeAdmin} className="bg-red-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-red-700 transition-colors whitespace-nowrap">
              Devenir Admin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
