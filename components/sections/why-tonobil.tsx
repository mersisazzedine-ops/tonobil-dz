import { Shield, Zap, Headphones, BadgeCheck } from 'lucide-react'

const reasons = [
  {
    icon: Shield,
    title: 'Hôtes vérifiés',
    desc: "Tous nos hôtes sont vérifiés avec documents d'identité et avis authentiques.",
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-300',
  },
  {
    icon: Zap,
    title: 'Réservation instantanée',
    desc: 'Des centaines de voitures disponibles en réservation instantanée sans attente.',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-300',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    desc: 'Notre équipe est disponible à toute heure pour vous accompagner.',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
  },
  {
    icon: BadgeCheck,
    title: 'Paiement sécurisé',
    desc: 'Transactions 100% sécurisées en dinars algériens. Aucun frais caché.',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-300',
  },
]

export function WhyTonobilSection() {
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)' }}
    >
      {/* Subtle decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#93c5fd' }}
          >
            Notre promesse
          </span>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">
            Pourquoi{' '}
            <span className="text-blue-400">TONOBIL DZ</span> ?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            La solution de confiance pour louer une voiture en Algérie
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${r.iconBg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <r.icon className={`w-7 h-7 ${r.iconColor}`} />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{r.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom stat strip */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-3 gap-6 text-center">
          {[
            { val: '3 000+', label: 'Voitures disponibles' },
            { val: '58', label: 'Wilayas couvertes' },
            { val: '4.9 ★', label: 'Note moyenne' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-blue-400 mb-1">{s.val}</p>
              <p className="text-white/40 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
