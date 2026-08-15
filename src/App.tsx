import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ESGSection } from './components/ESGSection';
import { ImpactSection } from './components/ImpactSection';
import { CascaraStory } from './components/CascaraStory';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { PreorderModal } from './components/PreorderModal';
import { Share2, Coffee, Volume2, VolumeX } from 'lucide-react';
import { trungAudio } from './utils/audio';
import { useLanguage } from './utils/LanguageContext';

export default function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const unsub = trungAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });

    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowFloatingBar(true);
      } else {
        setShowFloatingBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareClick = () => {
    scrollToSection('cta-section');
  };

  return (
    <div className="min-h-screen bg-[#E5E9DF]/80 flex justify-center items-start selection:bg-[#335C33] selection:text-[#F6F6EE]">
      {/* 
        Container Constrained to max-width: 480px (100% Mobile-first layout centered on desktop with subtle shadow)
      */}
      <main
        id="app-mobile-container"
        className="w-full max-w-[480px] min-h-screen bg-[#F6F6EE] shadow-2xl relative flex flex-col overflow-x-hidden border-x border-[#335C33]/10"
      >
        {/* Navigation Bar */}
        <Navbar />

        {/* 1. HERO SECTION */}
        <HeroSection
          onExploreClick={() => scrollToSection('esg-section')}
          onOpenOrder={() => setIsOrderOpen(true)}
        />

        {/* 2. ESG DATA DASHBOARD (Tác Động Xanh) */}
        <ESGSection />

        {/* 3. SOCIAL IMPACT (Hành Trình Gieo Mầm) */}
        <ImpactSection />

        {/* Story of Cascara & Limited Fundraiser Box */}
        <CascaraStory onOpenOrder={() => setIsOrderOpen(true)} />

        {/* 4. CALL TO ACTION (Lan Tỏa Tác Động) */}
        <CTASection onOpenOrder={() => setIsOrderOpen(true)} />

        {/* Footer */}
        <Footer />

        {/* Floating Quick Action Sticky Bar on Scroll */}
        {showFloatingBar && (
          <aside
            aria-label={language === 'vi' ? 'Thanh tác vụ nhanh' : 'Quick Actions'}
            className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300"
          >
            <div className="w-full max-w-[440px] bg-[#335C33]/95 backdrop-blur-md rounded-2xl p-2 px-3 shadow-xl border border-[#E3EDD3]/20 flex items-center justify-between pointer-events-auto text-[#F6F6EE]">
              
              {/* Sound toggle quick */}
              <button
                onClick={() => trungAudio.toggle()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer"
                title={t('navAudioToggle')}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#E3EDD3] animate-pulse" />
                    <span className="text-[11px] text-[#E3EDD3]">{t('floatingAudioOn')}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#E3EDD3]/70" />
                    <span className="text-[11px] text-[#E3EDD3]/90">{t('floatingAudioOff')}</span>
                  </>
                )}
              </button>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareClick}
                  className="p-2 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors cursor-pointer"
                  title={language === 'vi' ? 'Chia sẻ lên Facebook' : 'Share on Facebook'}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOrderOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E3EDD3] text-[#335C33] font-bold text-xs hover:bg-[#d5e3c1] transition-colors shadow-xs cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>{t('floatingSupport')}</span>
                </button>
              </div>

            </div>
          </aside>
        )}

        {/* Pre-order & Pledge Modal */}
        <PreorderModal
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
        />
      </main>
    </div>
  );
}
