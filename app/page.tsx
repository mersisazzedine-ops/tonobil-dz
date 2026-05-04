import { HeroSection } from '@/components/sections/hero'
import { PopularCitiesSection } from '@/components/sections/popular-cities'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { FeaturedCarsSection } from '@/components/sections/featured-cars'
import { WhyTonobilSection } from '@/components/sections/why-tonobil'


export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection />
      <PopularCitiesSection />
      <HowItWorksSection />
      <FeaturedCarsSection />
      <WhyTonobilSection />

    </div>
  )
}
