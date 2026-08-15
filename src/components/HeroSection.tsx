import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, TreePine, ArrowDown, HeartHandshake, Coffee, Leaf } from 'lucide-react';
import { trungAudio } from '../utils/audio';
import { useLanguage } from '../utils/LanguageContext';
import heroBg from '../../assets/image/h.jpg';

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
        <img
          src={heroBg}
          alt="Đồi cà phê và nông trường Tây Nguyên Việt Nam"
          className="w-full h-full object-cover object-center scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F6EE]/20 via-[#F6F6EE]/40 via-[#F6F6EE]/75 to-[#F6F6EE]" />
        <div className="absolute inset-0 bg-[#335C33]/5 mix-blend-multiply" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E3EDD3]/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-60 h-60 rounded-full bg-[#8C5A35]/10 blur-2xl pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 pt-8 pb-4">

        {/* Tag / Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
          className="flex items-center gap-2 self-start mb-4 px-3.5 py-1.5 rounded-full bg-[#E3EDD3]/90 border border-[#335C33]/20 shadow-xs"
        >
          <Leaf className="w-3.5 h-3.5 text-[#335C33]" />
          <span className="text-xs font-bold text-[#335C33] tracking-wide uppercase">
            {t('heroBadge')}
          </span>
        </motion.div>

        {/* Main Headline H1 — Lora via font-serif class */}
        <motion.h1
          id="hero-main-heading"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE_NATURAL }}
          className="text-3xl sm:text-4xl font-extrabold text-[#335C33] leading-[1.2] tracking-tight font-serif mb-4"
        >
          {t('heroTitleLine1')} <br />
          {t('heroTitleLine2')}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          id="hero-subtext"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE_NATURAL }}
          className="text-base text-[#2C2E2B]/85 font-normal leading-relaxed mb-7 max-w-md"
        >
          {t('heroSubtext')}
        </motion.p>

        {/* T'RƯNG MUSIC PLAYER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: EASE_NATURAL }}
          className="mb-8"
        >
          <div className="flex items-center gap-3.5">
            {/* Concentric circle ring wrapper */}
            <div className="relative p-1.5 rounded-full border border-[#335C33]/15 flex items-center justify-center flex-shrink-0">
              <motion.button
                id="btn-trung-music-player"
                onClick={handleToggleMusic}
                aria-label={t('heroMusicTitle')}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.1 }}
                className="w-14 h-14 rounded-full bg-[#E3EDD3] border border-[#335C33]/20 flex items-center justify-center shadow-md cursor-pointer transition-[background-color] duration-200 text-[#335C33] hover:bg-[#d9e7c5]"
              >
                <div className="flex flex-col items-center justify-center">
                  <TreePine className="w-5 h-5 text-[#335C33]" />
                  <div className="flex gap-0.5 mt-0.5">
                    <Music className="w-3.5 h-3.5 text-[#335C33]" />
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
              <h2 className="text-[15px] font-bold text-[#335C33] leading-tight">
                {t('heroMusicTitle')}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-[#8C5A35]">
                <svg className="w-4 h-4 text-[#8C5A35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h8" />
                </svg>
                <span className="text-xs font-semibold">
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
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            id="btn-hero-order"
            onClick={onOpenOrder}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-sm shadow-md hover:bg-[#284828] transition-[background-color] duration-200 cursor-pointer"
          >
            <Coffee className="w-4 h-4 text-[#E3EDD3]" />
            <span>{t('heroBtnOrder')}</span>
          </motion.button>

          <motion.button
            id="btn-hero-learn-more"
            onClick={onExploreClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-[#335C33] border border-[#335C33]/25 font-semibold text-xs hover:bg-[#E3EDD3]/50 transition-[background-color] duration-200 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-[#8C5A35]" />
            <span>{t('heroBtnLearn')}</span>
          </motion.button>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 pb-4 flex justify-center">
        <motion.button
          onClick={onExploreClick}
          aria-label={t('heroScrollDown')}
          whileHover={{ y: 3 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col items-center gap-1 text-[#8C5A35] hover:text-[#335C33] transition-colors cursor-pointer"
        >
          <span className="text-[11px] font-medium tracking-wider uppercase">{t('heroScrollDown')}</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
