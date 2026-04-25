import Navbar from '@/components/Navbar'
import ImportantNotice from '@/components/ImportantNotice'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Service from '@/components/Service'
import Facilities from '@/components/Facilities'
import Admission from '@/components/Admission'
import SchoolTiming from '@/components/SchoolTiming'
import Notice from '@/components/Notice'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <ImportantNotice />
      <main>
        <Hero />
        <About />
        <Service />
        <Facilities />
        <SchoolTiming />
        <Admission />
        <Notice />
        <Gallery />
        <Footer />
      </main>
    </>
  )
}
