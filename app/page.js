import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Admission from '@/components/Admission'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Admission />
        <Gallery />
        <Footer />
      </main>
    </>
  )
}
