import { Search, Key, Star } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Recherchez',
    desc: 'Entrez votre ville et vos dates pour trouver la voiture idéale parmi des centaines de véhicules vérifiés.',
    gradient: 'from-blue-500 to-blue-600',
    soft: 'bg-blue-50',
    ring: 'ring-blue-100',
  },
  {
    icon: Key,
    title: 'Réservez',
    desc: 'Choisissez votre voiture, confirmez votre réservation en quelques clics et payez en toute sécurité.',
    gradient: 'from-emerald-500 to-teal-500',
    soft: 'bg-emerald-50',
    ring: 'ring-emerald-100',
  },
  {
    icon: Star,
    title: 'Profitez',
    desc: "Récupérez votre voiture et partez à l'aventure. Laissez un avis à la fin de votre voyage.",
    gradient: 'from-amber-400 to-orange-500',
    soft: 'bg-amber-50',
    ring: 'ring-amber-100',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">Guide rapide</span>
          <h2 className="text-4xl font-black text-foreground tracking-tight mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Louer une voiture n'a jamais été aussi simple. En 3 étapes, vous êtes sur la route.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200 z-0" />

          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`relative z-10 rounded-2xl border border-border p-8 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${step.soft} ring-2 ${step.ring}`}
            >
              {/* Step number badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${step.gradient} text-white text-xs font-black flex items-center justify-center shadow-md`}>
                  {i + 1}
                </div>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
