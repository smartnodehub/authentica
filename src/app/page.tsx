import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import DemoExample from '@/components/DemoExample';
import UseCases from '@/components/UseCases';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      {/* spacer, et fixed navbar ei kataks sisu */}
      <div className="h-16" />

      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <DemoExample />
        <UseCases />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
