import HeroSection from '@/components/HeroSection'
import LocationSection from '@/components/LocationSection'
import AmenitiesSection from '@/components/AmenitiesSection'
import PricingSection from '@/components/PricingSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LocationSection />
      <AmenitiesSection />
      <PricingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
