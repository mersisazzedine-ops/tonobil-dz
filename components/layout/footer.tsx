'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  
  // Hide footer on auth pages
  if (pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <footer className="bg-slate-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight">TONOBIL<span className="text-blue-500">DZ</span></span>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-xs">
              La première plateforme de location de voitures entre particuliers en Algérie. Simple, rapide et sécurisée.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-1 transition-all">
                  <Icon className="w-4 h-4 text-slate-300 hover:text-white" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-slate-300">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              {[['/', 'Accueil'],['/cars','Parcourir les voitures'],['/host','Devenir Hôte'],['/auth/login','Créer un compte']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-slate-300">Villes Populaires</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Alger','Oran','Constantine','Annaba','Tlemcen','Sétif'].map(city => (
                <li key={city}><Link href={`/cars?city=${city}`} className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all">{city}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-slate-300">Contact</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><Mail className="w-3.5 h-3.5 text-blue-400" /></div>
                contact@tonobil.dz
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><Phone className="w-3.5 h-3.5 text-blue-400" /></div>
                +213 23 00 00 00
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><MapPin className="w-3.5 h-3.5 text-blue-400" /></div>
                Alger, Algérie
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© 2026 TONOBIL DZ. Tous droits réservés.</p>
          <div className="flex gap-6">
            {['Confidentialité','Conditions','Cookies'].map(t => <a key={t} href="#" className="hover:text-white transition-colors">{t}</a>)}
          </div>
        </div>
      </div>
    </footer>
  )
}
