'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
export interface AuthUser { id:string; name:string; email:string; phone:string; avatar:string }
interface AuthContextType { user:AuthUser|null; isLoggedIn:boolean; login:(u:AuthUser)=>void; logout:()=>void; mode:'client'|'host'; toggleMode:()=>void; }
const AuthContext = createContext<AuthContextType>({ user:null, isLoggedIn:false, login:()=>{}, logout:()=>{}, mode:'client', toggleMode:()=>{} })
export function AuthProvider({ children }: { children:ReactNode }) {
  const [user, setUser] = useState<AuthUser|null>(null)
  const [mode, setMode] = useState<'client'|'host'>('client')
  useEffect(() => { 
    try { 
      const s=localStorage.getItem('tonobil_user'); if(s) setUser(JSON.parse(s));
      const m=localStorage.getItem('tonobil_mode'); if(m==='host'||m==='client') setMode(m);
    } catch {} 
  }, [])
  const login = (u:AuthUser) => { setUser(u); localStorage.setItem('tonobil_user', JSON.stringify(u)) }
  const logout = () => { setUser(null); localStorage.removeItem('tonobil_user'); setMode('client'); localStorage.removeItem('tonobil_mode') }
  const toggleMode = () => { const newMode = mode === 'client' ? 'host' : 'client'; setMode(newMode); localStorage.setItem('tonobil_mode', newMode) }
  return <AuthContext.Provider value={{ user, isLoggedIn:!!user, login, logout, mode, toggleMode }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
