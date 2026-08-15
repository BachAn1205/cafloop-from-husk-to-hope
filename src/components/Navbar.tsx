import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Volume2, VolumeX, Globe } from 'lucide-react';
import { trungAudio } from '../utils/audio';
import { useLanguage } from '../utils/LanguageContext';

export function Navbar() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const unsubscribe = trungAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    trungAudio.toggle();
  };

  const waveHeights = [0.5, 1, 0.65, 0.85, 0.45, 0.9, 0.6];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F6EE]/90 backdrop-blur-md border-b border-[#335C33]/10 transition-all">
      <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#335C33] flex items-center justify-center text-[#F6F6EE] shadow-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-[#335C33] text-base leading-none" style={{ fontFamily: 'var(--font-heading)' }}>CAFLOOP</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#E3EDD3] text-[#335C33]">
                {t('navCircular')}
              </span>
            </div>
            <p className="text-[10px] text-[#8C5A35] font-medium tracking-wide leading-tight mt-0.5">
              {t('navSub')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <motion.button
            onClick={toggleLanguage}
            id="btn-language-toggle"
            aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d5e3c1] text-[11px] font-bold border border-[#335C33]/15 cursor-pointer transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'EN' : 'VI'}</span>
          </motion.button>

          {/* Audio Quick Toggle */}
          <motion.button
            onClick={toggleSound}
            id="btn-nav-audio-toggle"
            aria-label={t('navAudioToggle')}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.12 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-[background-color,box-shadow] duration-200 cursor-pointer ${
              isPlaying
                ? 'bg-[#335C33] text-[#F6F6EE] shadow-sm ring-2 ring-[#335C33]/20'
                : 'bg-[#E3EDD3] text-[#335C33] hover:bg-[#d5e3c1]'
            }`}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E3EDD3]" />
                <span className="text-[11px] font-semibold">{t('navAudioOn')}</span>
                <span className="flex gap-px items-end h-3 ml-0.5" aria-hidden="true">
                  {waveHeights.map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-0.5 bg-[#E3EDD3] rounded-full"
                      animate={{ scaleY: [h, 1, h * 0.6, 1, h] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.9 + i * 0.08,
                        ease: 'easeInOut',
                        delay: i * 0.06,
                      }}
                      style={{ height: '12px', transformOrigin: 'bottom' }}
                    />
                  ))}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8C5A35]" />
                <span className="text-[11px] text-[#8C5A35]">
                  {t('navAudioOff')}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
