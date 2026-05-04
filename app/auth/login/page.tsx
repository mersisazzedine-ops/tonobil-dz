'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Car } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function LoginPage() {
  const [tab, setTab] = useState<'login'|'signup'>('login')
  const [showPwd, setShowPwd] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const [loginForm, setLoginForm] = useState({ email:'', password:'' })
  const [loginErrors, setLoginErrors] = useState<Record<string,string>>({})

  const [signupForm, setSignupForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'', dob:'', terms:false })
  const [signupErrors, setSignupErrors] = useState<Record<string,string>>({})

  const validateLogin = () => {
    const errs: Record<string,string> = {}
    if (!loginForm.email) errs.email = 'L\'adresse email est requise'
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) errs.email = 'Adresse email invalide'
    if (!loginForm.password) errs.password = 'Le mot de passe est requis'
    else if (loginForm.password.length < 6) errs.password = 'Minimum 6 caractères'
    return errs
  }

  const validateSignup = () => {
    const errs: Record<string,string> = {}
    if (!signupForm.firstName) errs.firstName = 'Le prénom est requis'
    if (!signupForm.lastName) errs.lastName = 'Le nom est requis'
    if (!signupForm.email) errs.email = 'L\'adresse email est requise'
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = 'Adresse email invalide'
    if (!signupForm.phone) errs.phone = 'Le numéro de téléphone est requis'
    else if (!/^(\+213|0)[5-7]\d{8}$/.test(signupForm.phone.replace(/\s/g,''))) errs.phone = 'Format: +213 5XX XXX XXX'
    if (!signupForm.password) errs.password = 'Le mot de passe est requis'
    else if (signupForm.password.length < 8) errs.password = 'Minimum 8 caractères'
    if (signupForm.confirm !== signupForm.password) errs.confirm = 'Les mots de passe ne correspondent pas'
    if (!signupForm.dob) errs.dob = 'La date de naissance est requise'
    if (!signupForm.terms) errs.terms = 'Vous devez accepter les conditions'
    return errs
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateLogin()
    setLoginErrors(errs)
    if (Object.keys(errs).length === 0) {
      login({ id:'user-123', name:'Sarah Belkacemi', email:loginForm.email, phone:'+213 661 234 567', avatar:'SB' })
      toast.success('Bienvenue sur TONOBIL DZ!')
      router.push('/')
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateSignup()
    setSignupErrors(errs)
    if (Object.keys(errs).length === 0) {
      login({ id:'user-new', name:`${signupForm.firstName} ${signupForm.lastName}`, email:signupForm.email, phone:signupForm.phone, avatar:signupForm.firstName[0]+signupForm.lastName[0] })
      toast.success(`Bienvenue ${signupForm.firstName}! Votre compte a été créé.`)
      router.push('/')
    }
  }

  const Field = ({ label, error, children }: { label:string; error?:string; children:React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  )

  const inputCls = (err?: string) => `w-full px-4 py-3 rounded-xl border ${err ? 'border-red-500 ring-red-500/20' : 'border-gray-200'} bg-gray-50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 focus:bg-white transition-all`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl text-foreground tracking-tight">
              TONOBIL<span className="text-blue-600">DZ</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-foreground mt-4 mb-2">
            {tab === 'login' ? 'Bon retour parmi nous' : 'Créer un compte'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tab === 'login' ? 'Entrez vos identifiants pour accéder à votre compte' : 'Rejoignez la plus grande communauté d\'autopartage'}
          </p>
        </div>

          {/* Tabs */}
          <div className="flex bg-gray-100/80 rounded-xl p-1 mb-8 shadow-inner">
            {(['login','signup'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${tab===t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-foreground'}`}>
                {t === 'login' ? 'Se connecter' : "S'inscrire"}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Adresse email" error={loginErrors.email}>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email:e.target.value})}
                  placeholder="vous@exemple.com" className={inputCls(loginErrors.email)} />
              </Field>
              <Field label="Mot de passe" error={loginErrors.password}>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password:e.target.value})}
                    placeholder="••••••••" className={inputCls(loginErrors.password) + ' pr-12'} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </Field>
              <div className="flex justify-end">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Mot de passe oublié ?</a>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all">
                Se connecter
              </button>
              
              <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative text-center"><span className="bg-white px-4 text-xs font-semibold uppercase text-gray-400 tracking-wider">ou continuer avec</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl py-3.5 text-sm font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl py-3.5 text-sm font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prénom" error={signupErrors.firstName}>
                  <input type="text" value={signupForm.firstName} onChange={e => setSignupForm({...signupForm, firstName:e.target.value})}
                    placeholder="Mohammed" className={inputCls(signupErrors.firstName)} />
                </Field>
                <Field label="Nom" error={signupErrors.lastName}>
                  <input type="text" value={signupForm.lastName} onChange={e => setSignupForm({...signupForm, lastName:e.target.value})}
                    placeholder="Benali" className={inputCls(signupErrors.lastName)} />
                </Field>
              </div>
              <Field label="Adresse email" error={signupErrors.email}>
                <input type="email" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email:e.target.value})}
                  placeholder="vous@exemple.com" className={inputCls(signupErrors.email)} />
              </Field>
              <Field label="Téléphone" error={signupErrors.phone}>
                <input type="tel" value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone:e.target.value})}
                  placeholder="+213 5XX XXX XXX" className={inputCls(signupErrors.phone)} />
              </Field>
              <Field label="Mot de passe" error={signupErrors.password}>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={signupForm.password} onChange={e => setSignupForm({...signupForm, password:e.target.value})}
                    placeholder="Minimum 8 caractères" className={inputCls(signupErrors.password) + ' pr-12'} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirmer" error={signupErrors.confirm}>
                <input type="password" value={signupForm.confirm} onChange={e => setSignupForm({...signupForm, confirm:e.target.value})}
                  placeholder="Répétez le mot de passe" className={inputCls(signupErrors.confirm)} />
              </Field>
              <Field label="Date de naissance" error={signupErrors.dob}>
                <input type="date" value={signupForm.dob} max={new Date(Date.now()-18*365*86400000).toISOString().split('T')[0]}
                  onChange={e => setSignupForm({...signupForm, dob:e.target.value})} className={inputCls(signupErrors.dob)} />
              </Field>
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={signupForm.terms} onChange={e => setSignupForm({...signupForm, terms:e.target.checked})}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    J'accepte les <a href="#" className="text-blue-600 font-bold hover:underline">Conditions d'utilisation</a> et la <a href="#" className="text-blue-600 font-bold hover:underline">Politique de confidentialité</a>
                  </span>
                </label>
                {signupErrors.terms && <p className="text-destructive text-xs mt-1">{signupErrors.terms}</p>}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all mt-4">
                Créer mon compte
              </button>
            </form>
          )}
      </div>
    </div>
  )
}
