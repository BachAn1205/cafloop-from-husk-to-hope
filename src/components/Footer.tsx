import { motion } from 'motion/react';
import { Leaf, Heart, School, ArrowUp } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  const { t } = useLanguage();
  let clickCount = 0;
  let clickTimer: NodeJS.Timeout;

  const handleSecretClick = () => {
    clickCount++;
    if (clickCount === 3) {
      clickCount = 0;
      clearTimeout(clickTimer);
      if (onOpenAdmin) onOpenAdmin();
    } else {
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: EASE_NATURAL }}
      className="bg-[#E3EDD3]/50 border-t border-[#335C33]/15 pt-10 pb-12 px-5 md:px-8 text-center md:text-left text-[#2C2E2B]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8 md:mb-10">
          
          {/* Left Column: Brand & Description */}
          <div className="flex flex-col items-center md:items-start md:max-w-md lg:max-w-xl">
            {/* Brand identity (Triple-click secret trigger) */}
            <div 
              onClick={handleSecretClick}
              className="flex items-center gap-2 mb-3 md:mb-4 cursor-pointer select-none"
              title="CAFLOOP"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#335C33] text-[#F6F6EE] flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <span className="font-bold text-[#335C33] text-sm md:text-base tracking-tight font-serif">CAFLOOP</span>
              <span className="text-[10px] md:text-xs text-[#8C5A35] font-semibold">• From Husk to Hope</span>
            </div>

            <p className="text-xs md:text-sm text-[#2C2E2B]/75 leading-relaxed md:leading-relaxed mb-4">
              {t('footerDesc')}
            </p>

            {/* School beneficiary badge */}
            <div className="inline-flex items-center gap-2 bg-[#F6F6EE] border border-[#335C33]/15 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm text-[#335C33] font-medium shadow-xs">
              <School className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35] flex-shrink-0" />
              <span>{t('footerPartner')}</span>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex flex-col items-center md:items-end justify-center md:justify-start">
            {/* Scroll back up */}
            <motion.button
              onClick={scrollToTop}
              aria-label={t('footerToTop')}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 text-xs md:text-sm text-[#8C5A35] hover:text-[#335C33] font-medium transition-colors cursor-pointer bg-[#F6F6EE]/50 px-4 py-2 rounded-full border border-[#8C5A35]/15"
            >
              <span>{t('footerToTop')}</span>
              <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </motion.button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-5 md:pt-6 border-t border-[#335C33]/10 text-[10px] md:text-xs text-[#2C2E2B]/60 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <p>{t('footerCopyright')}</p>
          <div className="flex items-center gap-1 text-[#8C5A35]">
            <span>{t('footerSlogan')}</span>
            <Heart className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#335C33] fill-current" />
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
