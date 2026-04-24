import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Service from '@/components/Service'
import Admission from '@/components/Admission'
import Notice from '@/components/Notice'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Service />
        <Admission />
        <Notice />
        <Gallery />
        <Footer />
      </main>
    </>
  )
}
