'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, X, Car, MessageSquare, Settings, LogOut, ChevronDown, Zap, Info, HelpCircle, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const LOGGED_OUT_LINKS = [
  { href: '/cars',         label: 'Parcourir' },
  { href: '/#how-it-works', label: 'Comment ça marche', scroll: true },
  { href: '/#about',       label: 'À propos',            scroll: true },
  { href: '/host',         label: 'Devenir Hôte' },
]

const LOGGED_IN_LINKS = [
  { href: '/cars',         label: 'Parcourir' },
  { href: '/manage-bookings', label: 'Gérer mes réservations' },
  { href: '/host',         label: 'Devenir Hôte' },
]

export function Navbar() {
  const [isOpen, setIsOpen]           = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const pathname  = usePathname()
  const router    = useRouter()
  const { user, isLoggedIn, logout }  = useAuth()
  const activeLinks = isLoggedIn ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); router.push('/') }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof LOGGED_OUT_LINKS[0]) => {
    if (!link.scroll) return
    e.preventDefault()
    const id = link.href.split('#')[1]
    if (pathname !== '/') {
      router.push(`/#${id}`)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <>
      <nav className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-border/60 shadow-sm'
          : 'bg-white border-b border-border'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-foreground tracking-tight">
                TONOBIL<span className="text-blue-600">DZ</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {activeLinks.map(l => {
                const className = cn(
                  'text-sm font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  (pathname === l.href && !l.scroll)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                )

                if (l.scroll) {
                  return (
                    <a key={l.href} href={l.href} onClick={e => handleNavClick(e as any, l)} className={className}>
                      {l.label}
                    </a>
                  )
                }

                return (
                  <Link key={l.href} href={l.href} className={className}>
                    {l.label}
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-2 ml-4">
                  <Link href="/account" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    Mon Profil
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors px-3 py-2 flex items-center gap-1">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login"
                    className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                    Connexion
                  </Link>
                  <Link href="/auth/login"
                    className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button onClick={() => setIsOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="ml-auto w-80 bg-white h-full flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-lg">TONOBIL<span className="text-blue-600">DZ</span></span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-1">
              {activeLinks.map(l => {
                const className = "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                
                if (l.scroll) {
                  return (
                    <a key={l.href} href={l.href} onClick={e => { handleNavClick(e as any, l); setIsOpen(false) }} className={className}>
                      {l.label}
                    </a>
                  )
                }

                return (
                  <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)} className={className}>
                    {l.label}
                  </Link>
                )
              })}

              {isLoggedIn ? (
                <div className="border-t border-border pt-4 mt-4 space-y-1">
                  <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"><Settings className="w-4 h-4" />Mon Profil</Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"><LogOut className="w-4 h-4" />Déconnexion</button>
                </div>
              ) : (
                <div className="border-t border-border pt-4 mt-4 space-y-3">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">S'inscrire / Se connecter</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
