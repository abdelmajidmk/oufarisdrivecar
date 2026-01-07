import { useState } from 'react';
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
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      
      <div className={`min-h-screen bg-background transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
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
