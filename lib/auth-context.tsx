'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'

export interface AuthUser { id: string; name: string; email: string; phone: string; avatar: string; is_admin: boolean }

interface AuthContextType {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (u: AuthUser) => void
  logout: () => void
  refreshUser: () => Promise<void>
  mode: 'client' | 'host'
  toggleMode: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  mode: 'client',
  toggleMode: () => {},
  isLoading: true
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mode, setMode] = useState<'client' | 'host'>('client')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load mode preference
    try {
      const m = localStorage.getItem('tonobil_mode')
      if (m === 'host' || m === 'client') setMode(m)
    } catch {}

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth state changes (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (authUser: { id: string; email?: string; user_metadata?: any }) => {
    try {
      let { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      // If profile row doesn't exist (e.g. after a schema reset), create it automatically
      if (!data) {
        const { data: newProfile } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || ''
          })
          .select()
          .single()
        data = newProfile
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email || authUser.email || '',
          phone: data.phone || '',
          avatar: data.avatar_url || '',
          is_admin: data.is_admin || false
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (u: AuthUser) => setUser(u)

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) await fetchProfile(session.user)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMode('client')
    localStorage.removeItem('tonobil_mode')
  }

  const toggleMode = () => {
    const newMode = mode === 'client' ? 'host' : 'client'
    setMode(newMode)
    localStorage.setItem('tonobil_mode', newMode)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, refreshUser, mode, toggleMode, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
