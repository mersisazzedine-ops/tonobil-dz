'use client'
import { useState } from 'react'
import { Camera, Check, Shield, Upload } from 'lucide-react'
import { MOCK_CURRENT_USER } from '@/lib/mock-data'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export default function AccountPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({ 
    name: user?.name || MOCK_CURRENT_USER.name, 
    email: user?.email || MOCK_CURRENT_USER.email, 
    phone: user?.phone || MOCK_CURRENT_USER.phone 
  })
  const [kycStatus, setKycStatus] = useState(MOCK_CURRENT_USER.kyc_status)
  const [idDoc, setIdDoc] = useState(MOCK_CURRENT_USER.id_document)
  const [licenseDoc, setLicenseDoc] = useState(MOCK_CURRENT_USER.license_document)

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
            
            <button onClick={() => toast.success('Profil mis à jour!')} className="w-full sm:w-auto mt-4 bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
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
                    <input type="file" accept="image/*" className="hidden" onChange={() => { setIdDoc('uploaded'); toast.success('Document ajouté') }} />
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
                    <input type="file" accept="image/*" className="hidden" onChange={() => { setLicenseDoc('uploaded'); toast.success('Document ajouté') }} />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {kycStatus === 'none' && (
            <button onClick={() => { setKycStatus('pending'); toast.success('Documents soumis pour vérification') }} disabled={!idDoc || !licenseDoc}
              className="w-full sm:w-auto bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Soumettre pour vérification
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
