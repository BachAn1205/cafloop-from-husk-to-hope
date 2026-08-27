import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ESGSection } from './components/ESGSection';
import { ImpactSection } from './components/ImpactSection';
import { CascaraStory } from './components/CascaraStory';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { PreorderModal } from './components/PreorderModal';
import { DonateModal } from './components/DonateModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Share2, Coffee, Volume2, VolumeX } from 'lucide-react';
import { trungAudio } from './utils/audio';
import { useLanguage } from './utils/LanguageContext';

export default function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Secret URL route check (#admin or ?admin=true)
    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      setIsAdminOpen(true);
    }

    // Secret Key combination: Ctrl + Shift + H (or Cmd + Shift + H)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

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
      window.removeEventListener('keydown', handleKeyDown);
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
    <div className="min-h-screen bg-[#E5E9DF] flex justify-center items-start selection:bg-[#335C33] selection:text-[#F6F6EE]">
      {/* 
        Container Constrained to max-w-[1920px] to prevent ultra-wide distortion, 
        but allows responsive full-width behavior up to 1920px.
      */}
      <main
        id="app-main-container"
        className="w-full max-w-[1920px] mx-auto min-h-screen bg-[#F6F6EE] shadow-2xl relative flex flex-col overflow-x-hidden border-x border-[#335C33]/10"
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
        <CTASection 
          onOpenOrder={() => setIsOrderOpen(true)} 
          onOpenDonate={() => setIsDonateOpen(true)}
        />

        {/* Footer */}
        <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* Floating Quick Action Sticky Bar on Scroll */}
        {showFloatingBar && (
          <aside
            aria-label={language === 'vi' ? 'Thanh tác vụ nhanh' : 'Quick Actions'}
            className="fixed bottom-3 inset-x-0 md:inset-x-auto md:right-6 md:bottom-6 z-40 flex justify-center md:justify-end px-4 md:px-0 pointer-events-none transition-all duration-300"
          >
            <div className="w-full max-w-[440px] md:w-auto bg-[#335C33]/95 backdrop-blur-md rounded-2xl p-2 px-3 md:px-4 md:py-2.5 shadow-xl border border-[#E3EDD3]/20 flex items-center justify-between gap-4 pointer-events-auto text-[#F6F6EE]">
              
              {/* Sound toggle quick */}
              <button
                onClick={() => trungAudio.toggle()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer"
                title={t('navAudioToggle')}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#E3EDD3] animate-pulse" />
                    <span className="text-[11px] md:text-xs text-[#E3EDD3] whitespace-nowrap">{t('floatingAudioOn')}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#E3EDD3]/70" />
                    <span className="text-[11px] md:text-xs text-[#E3EDD3]/90 whitespace-nowrap">{t('floatingAudioOff')}</span>
                  </>
                )}
              </button>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareClick}
                  className="p-2 md:px-3 md:py-2 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors cursor-pointer flex items-center justify-center"
                  title={language === 'vi' ? 'Chia sẻ lên Facebook' : 'Share on Facebook'}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOrderOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-[#E3EDD3] text-[#335C33] font-bold text-xs md:text-sm hover:bg-[#d5e3c1] transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Coffee className="w-3.5 h-3.5 md:w-4 md:h-4" />
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

        {/* Direct Donate Modal */}
        <DonateModal
          isOpen={isDonateOpen}
          onClose={() => setIsDonateOpen(false)}
        />

        {/* Secret Admin Dashboard Modal */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </main>
    </div>
  );
}
