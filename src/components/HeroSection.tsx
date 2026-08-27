import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, TreePine, ArrowDown, HeartHandshake, Coffee, Leaf } from 'lucide-react';
import { trungAudio } from '../utils/audio';
import { useLanguage } from '../utils/LanguageContext';
import heroBgMobile from '../../assets/image/h.jpg';
import heroBgDesktop from '../../assets/image/pc.png';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenOrder: () => void;
}

export function HeroSection({ onExploreClick, onOpenOrder }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = trungAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handleToggleMusic = () => {
    trungAudio.toggle();
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#F6F6EE]">
      {/* Background Image with smooth cream gradient to next section */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroBgDesktop} />
          <img
            src={heroBgMobile}
            alt="Đồi cà phê và nông trường Tây Nguyên Việt Nam"
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
          />
        </picture>
        {/* Subtle dark overlay for the top/sides to ensure text readability */}
        <div className="absolute inset-0 bg-[#2C2E2B]/38 pointer-events-none mix-blend-multiply" />

        {/* White fade ONLY at the bottom edge to blend with next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F6F6EE] pointer-events-none" />
        
        {/* Soft atmospheric blurs - Hidden on desktop to keep the top/sides dim */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#E3EDD3]/50 blur-3xl pointer-events-none md:hidden" />
        <div className="absolute bottom-10 -left-20 w-60 h-60 rounded-full bg-[#8C5A35]/10 blur-2xl pointer-events-none md:hidden" />
      </div>

      {/* Hero Content Container - Centered and Grid on Desktop */}
      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & Actions */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center">
            
            {/* Tag / Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_NATURAL }}
              className="flex items-center gap-2 self-start mb-4 md:mb-6 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full bg-[#E3EDD3]/90 backdrop-blur-xs border border-[#335C33]/20 shadow-xs"
            >
              <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#335C33]" />
              <span className="text-xs md:text-sm font-bold text-[#335C33] tracking-wide uppercase">
                {t('heroBadge')}
              </span>
            </motion.div>

            {/* Main Headline H1 — Lora via font-serif class */}
            <motion.h1
              id="hero-main-heading"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE_NATURAL }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#F6F6EE] leading-[1.1] tracking-tight font-serif mb-4 md:mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            >
              <span className="block">{t('heroTitleLine1')}</span>
              <span className="block">{t('heroTitleLine2')}</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              id="hero-subtext"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASE_NATURAL }}
              className="text-base md:text-lg lg:text-xl text-[#F6F6EE]/90 font-normal leading-relaxed md:leading-normal mb-7 md:mb-10 max-w-md md:max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
            >
              {t('heroSubtext')}
            </motion.p>

            {/* T'RƯNG MUSIC PLAYER */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: EASE_NATURAL }}
              className="mb-8 md:mb-10"
            >
              <div className="flex items-center gap-3.5 md:gap-4">
                {/* Concentric circle ring wrapper */}
                <div className="relative p-1.5 rounded-full border border-[#335C33]/15 flex items-center justify-center flex-shrink-0">
                  <motion.button
                    id="btn-trung-music-player"
                    onClick={handleToggleMusic}
                    aria-label={t('heroMusicTitle')}
                    whileTap={{ scale: 0.93 }}
                    transition={{ duration: 0.1 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#E3EDD3] border border-[#335C33]/20 flex items-center justify-center shadow-md cursor-pointer transition-[background-color] duration-200 text-[#335C33] hover:bg-[#d9e7c5]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <TreePine className="w-5 h-5 md:w-6 md:h-6 text-[#335C33]" />
                      <div className="flex gap-0.5 mt-0.5">
                        <Music className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#335C33]" />
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Text info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={handleToggleMusic}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleToggleMusic()}
                  aria-label={t('heroMusicTitle')}
                >
                  <h2 className="text-[15px] md:text-lg font-bold text-[#F6F6EE] leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                    {t('heroMusicTitle')}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1 text-[#8C5A35]">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h8" />
                    </svg>
                    <span className="text-xs md:text-sm font-semibold">
                      {isPlaying ? t('heroMusicOn') : t('heroMusicOff')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE_NATURAL }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <motion.button
                id="btn-hero-order"
                onClick={onOpenOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-semibold text-sm md:text-base shadow-md hover:bg-[#284828] transition-[background-color] duration-200 cursor-pointer"
              >
                <Coffee className="w-4 h-4 md:w-5 md:h-5 text-[#E3EDD3]" />
                <span>{t('heroBtnOrder')}</span>
              </motion.button>

              <motion.button
                id="btn-hero-learn-more"
                onClick={onExploreClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 md:py-4 px-5 md:px-8 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-sm text-[#335C33] border border-[#335C33]/25 font-semibold text-sm md:text-base hover:bg-[#E3EDD3]/70 transition-[background-color] duration-200 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35]" />
                <span>{t('heroBtnLearn')}</span>
              </motion.button>
            </motion.div>
          </div>
          
          {/* Right Column: Empty on purpose to let background shine through on desktop */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6"></div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 pb-4 md:pb-8 flex justify-center w-full max-w-7xl mx-auto">
        <motion.button
          onClick={onExploreClick}
          aria-label={t('heroScrollDown')}
          whileHover={{ y: 4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col items-center gap-1.5 md:gap-2 text-[#8C5A35] hover:text-[#335C33] transition-colors cursor-pointer"
        >
          <span className="text-[11px] md:text-xs font-semibold md:font-bold tracking-wider uppercase">{t('heroScrollDown')}</span>
          <ArrowDown className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
