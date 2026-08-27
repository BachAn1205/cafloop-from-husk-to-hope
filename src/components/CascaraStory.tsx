import { motion } from 'motion/react';
import { Coffee, Heart, Check, ShieldCheck, Flame, Droplets } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

interface CascaraStoryProps {
  onOpenOrder: () => void;
}

export function CascaraStory({ onOpenOrder }: CascaraStoryProps) {
  const { t } = useLanguage();

  const trustBadges = [
    { icon: Check, label: t('storyBadgeClean'), color: 'text-[#335C33]' },
    { icon: ShieldCheck, label: t('storyBadgeAdditive'), color: 'text-[#8C5A35]' },
    { icon: Heart, label: t('storyBadgeTransparent'), color: 'text-[#335C33]' },
  ];

  return (
    <section className="py-12 md:py-20 px-5 md:px-8 bg-[#E3EDD3]/40 border-t border-[#335C33]/10 relative">
      <div className="max-w-7xl mx-auto">

        {/* Desktop Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Right Column (Mobile: Top) - Story Text & Header */}
          <div className="order-1 lg:order-2">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease: EASE_NATURAL }}
              className="text-center lg:text-left mb-8 md:mb-10"
            >
              <div className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-[#E3EDD3] text-[#335C33] text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4">
                <Coffee className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8C5A35]" />
                {t('storyBadge')}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] font-serif tracking-tight">
                {t('storyTitle')}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[#8C5A35] mt-2.5 font-medium">
                {t('storySub')}
              </p>
            </motion.div>

            {/* Trust Badges — staggered entrance */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center lg:text-left text-[11px] md:text-xs lg:text-sm font-medium text-[#335C33]">
              {trustBadges.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.12 + i * 0.06, ease: EASE_NATURAL }}
                  className="bg-[#E3EDD3]/70 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col lg:flex-row items-center lg:items-start lg:gap-3 hover:bg-[#E3EDD3] transition-colors duration-300"
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} mb-1.5 lg:mb-0`} />
                  <span className="leading-tight">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Left Column (Mobile: Bottom) - Product highlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE_NATURAL }}
            className="order-2 lg:order-1 bg-[#F6F6EE] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#335C33]/15 shadow-md relative overflow-hidden"
          >
            {/* Subtle background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E3EDD3]/50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 mb-6 md:mb-8 relative z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden bg-[#E3EDD3] flex-shrink-0 border border-[#335C33]/20 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80"
                  alt="Trà Cascara từ vỏ cà phê hữu cơ thơm dịu"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#8C5A35] bg-[#E3EDD3] px-2.5 md:px-3 py-1 rounded-md mb-1.5 md:mb-2">
                  {t('storyCardBadge')}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-[#335C33] leading-snug">
                  {t('storyCardTitle')}
                </h3>
                <p className="text-xs md:text-sm text-[#2C2E2B]/75 mt-1 md:mt-1.5">
                  {t('storyCardDesc')}
                </p>
              </div>
            </div>

            {/* Flavor & Health Highlights */}
            <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-[#335C33]/10 relative z-10">
              {[
                { icon: Droplets, text: <><strong>{t('storyHighlight1Title')}</strong>{t('storyHighlight1Desc')}</>, color: 'text-[#8C5A35]' },
                { icon: Flame, text: <><strong>{t('storyHighlight2Title')}</strong>{t('storyHighlight2Desc')}</>, color: 'text-[#335C33]' },
                { icon: ShieldCheck, text: <><strong>{t('storyHighlight3Title')}</strong>{t('storyHighlight3Desc')}</>, color: 'text-[#335C33]' },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-[#2C2E2B]/85 bg-white/40 p-3 md:p-4 rounded-xl border border-white/60">
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} flex-shrink-0 mt-0.5`} />
                  <span className="leading-relaxed">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA inside product card */}
            <motion.button
              onClick={onOpenOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full mt-6 md:mt-8 py-3.5 md:py-4 px-4 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-semibold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-[#284828] transition-[background-color] duration-200 shadow-md cursor-pointer border border-transparent"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#E3EDD3] fill-[#E3EDD3]" />
              <span>{t('storyBtnDonate')}</span>
            </motion.button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
