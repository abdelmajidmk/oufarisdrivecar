import { useState } from 'react';
import Head from 'next/head';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Fleet from '@/components/Fleet';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {/* SEO */}
      <Head>
        <title>Oufaris Drive Car | Location de voiture</title>
        <meta
          name="description"
          content="Oufaris Drive Car propose un service de location de voiture fiable, rapide et au meilleur prix."
        />
      </Head>

      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      <div
        className={`min-h-screen bg-background transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'
          }`}
      >
        <Header />
        <main>
          <Hero />
          <Fleet />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
