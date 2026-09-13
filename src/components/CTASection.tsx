import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../utils/LanguageContext';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

interface CTASectionProps {
  onOpenOrder: () => void;
  onOpenDonate?: () => void;
}

export function CTASection({ onOpenOrder, onOpenDonate }: CTASectionProps) {
  const [copied, setCopied] = useState(false);
  const [sharedCount, setSharedCount] = useState(384);
  const { t, language } = useLanguage();

  const campaignUrl = typeof window !== 'undefined' ? window.location.href : 'https://cafloop.org';
  const shareQuote = t('ctaDesc');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#335C33', '#8C5A35', '#E3EDD3', '#1877F2'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleFacebookShare = () => {
    triggerConfetti();
    setSharedCount((prev) => prev + 1);

    // Cấu hình nội dung chia sẻ lên Facebook
    const shareUrl = 'https://cafloop-from-husk-to-hope.vercel.app/';
    const shareQuote = 'Cùng CAFLOOP biến vỏ cà phê thành cơ hội đến trường cho trẻ em vùng cao. 100% lợi nhuận gây quỹ sẽ được chuyển thành xe đạp và học cụ. Hãy chung tay gieo mầm hy vọng nhé! 🌱🚲';
    const hashtag = '%23CAFLOOP';

    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareQuote)}&hashtag=${hashtag}`;

    window.open(fbShareUrl, '_blank', 'width=600,height=600,left=200,top=100');
  };

  const handleCopyLink = () => {
    triggerConfetti();
    navigator.clipboard.writeText(campaignUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section id="cta-section" className="py-14 md:py-24 px-5 md:px-8 bg-[#F6F6EE] relative border-t border-[#335C33]/10">
      <div className="max-w-3xl mx-auto text-center">

        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
          className="mb-5 md:mb-6"
        >
          <div className="section-badge mb-3 md:mb-4">
            <Share2 className="text-[#8C5A35]" />
            <span>{t('ctaBadge')}</span>
          </div>

          <h2 id="cta-section-title" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] font-serif tracking-tight">
            {t('ctaTitle')}
          </h2>
        </motion.div>

        {/* Section Copy */}
        <motion.p
          id="cta-copy-text"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE_NATURAL }}
          className="section-subtitle leading-relaxed mb-8 md:mb-10 px-2 max-w-3xl mx-auto md:whitespace-nowrap"
        >
          {t('ctaDesc')}
        </motion.p>

        {/* Actions Container - Stack on mobile, row on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.14, ease: EASE_NATURAL }}
          className="flex flex-col md:flex-row items-stretch justify-center gap-3 md:gap-4 mb-8 md:mb-10 w-full"
        >
          {/* Primary Facebook Share Button (Option 2: Forest Green) */}
          <motion.button
            id="btn-facebook-share"
            onClick={handleFacebookShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="flex-1 min-h-[48px] md:min-h-[52px] py-3 md:py-3.5 px-4 md:px-5 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-bold text-xs sm:text-sm md:text-base shadow-md hover:bg-[#284828] transition-[background-color,transform] duration-200 flex items-center justify-center gap-2 cursor-pointer border border-transparent"
          >
            {/* Facebook Icon */}
            <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-[#E3EDD3] text-[#335C33] flex items-center justify-center flex-shrink-0 shadow-xs">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="leading-tight">{t('ctaBtnShare')}</span>
          </motion.button>

          {/* Copy Link Button */}
          <motion.button
            onClick={handleCopyLink}
            id="btn-copy-campaign-link"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="flex-1 min-h-[48px] md:min-h-[52px] py-3 md:py-3.5 px-4 md:px-5 rounded-xl md:rounded-2xl bg-[#E3EDD3] text-[#335C33] font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 hover:bg-[#d6e3c2] transition-[background-color] duration-200 border border-[#335C33]/15 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#335C33] shrink-0" />
                <span className="leading-tight">{t('ctaBtnCopied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35] shrink-0" />
                <span className="leading-tight">{t('ctaBtnCopy')}</span>
              </>
            )}
          </motion.button>

          {/* Direct Donate Button */}
          {onOpenDonate && (
            <motion.button
              onClick={onOpenDonate}
              id="btn-cta-direct-donate"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="flex-1 min-h-[48px] md:min-h-[52px] py-3 md:py-3.5 px-4 md:px-5 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 hover:bg-[#284828] transition-[background-color] duration-200 cursor-pointer shadow-md"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#E3EDD3] fill-[#E3EDD3] shrink-0" />
              <span className="leading-tight">{language === 'vi' ? 'Quyên góp trực tiếp' : 'Donate directly'}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Live Community Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.28, ease: EASE_NATURAL }}
          className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[#E3EDD3]/70 text-[#335C33] text-[11px] md:text-xs lg:text-sm font-medium border border-[#335C33]/10 shadow-xs"
        >
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#335C33] animate-pulse flex-shrink-0" />
          <span>
            {t('ctaCounterPrefix')}
            <strong className="mx-0.5">{sharedCount.toLocaleString('vi-VN')}</strong>
            {t('ctaCounterSuffix')}
          </span>
        </motion.div>

      </div>
    </section>
  );
}
