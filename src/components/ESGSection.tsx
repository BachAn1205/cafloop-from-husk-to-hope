import { motion } from 'motion/react';
import { Recycle, Leaf, TrendingUp, Sparkles, RefreshCw, Sun, Sprout } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { useLanguage } from '../utils/LanguageContext';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

export function ESGSection() {
  const { t, language } = useLanguage();

  return (
    <section id="esg-section" className="py-12 px-5 bg-[#F6F6EE] relative">
      <div className="max-w-[480px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
          className="text-center mb-7"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3EDD3] text-[#335C33] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <RefreshCw className="w-3.5 h-3.5 text-[#335C33]" />
            {t('esgBadge')}
          </div>
          <h2 id="esg-section-title" className="text-2xl sm:text-3xl font-extrabold text-[#335C33] font-serif tracking-tight">
            {t('esgTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#8C5A35] mt-1.5 font-medium">
            {t('esgSubtitle')}
          </p>
        </motion.div>

        {/* 2 Main ESG Metric Cards */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          
          {/* Card 1: Vỏ cà phê tái chế */}
          <motion.div
            id="card-esg-recycled-husk"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.06, ease: EASE_NATURAL }}
            whileHover={{ y: -2 }}
            className="bg-[#E3EDD3] rounded-2xl p-4 shadow-sm border border-[#335C33]/10 flex flex-col justify-between transition-[box-shadow,transform] duration-200 hover:shadow-md relative overflow-hidden group cursor-default"
          >
            {/* Background subtle leaf motif */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#335C33] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                <Recycle className="w-5 h-5 text-[#E3EDD3]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#335C33]/70 bg-[#F6F6EE]/80 px-2 py-0.5 rounded-full">
                ESG 2026
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#335C33] leading-tight mb-1.5">
                {t('esgCardHuskTitle')}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={500} duration={2.0} />
                </span>
                <span className="text-base font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] text-[#2C2E2B]/70 mt-1 leading-snug">
                {t('esgCardHuskDesc')}
              </p>
            </div>
          </motion.div>

          {/* Card 2: CO2 giảm tải */}
          <motion.div
            id="card-esg-co2-reduction"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE_NATURAL }}
            whileHover={{ y: -2 }}
            className="bg-[#E3EDD3] rounded-2xl p-4 shadow-sm border border-[#335C33]/10 flex flex-col justify-between transition-[box-shadow,transform] duration-200 hover:shadow-md relative overflow-hidden group cursor-default"
          >
            {/* Background subtle leaf motif */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#8C5A35]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                <Leaf className="w-5 h-5 text-[#E3EDD3]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5A35] bg-[#F6F6EE]/80 px-2 py-0.5 rounded-full">
                {language === 'vi' ? 'Khí Thải' : 'Carbon'}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#335C33] leading-tight mb-1.5">
                {t('esgCardCO2Title')}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={1200} duration={2.2} />
                </span>
                <span className="text-base font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] text-[#2C2E2B]/70 mt-1 leading-snug">
                {t('esgCardCO2Desc')}
              </p>
            </div>
          </motion.div>

        </div>

        {/* Circular Economy Flow Mini Infographic */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.18, ease: EASE_NATURAL }}
          className="bg-[#F6F6EE] border border-[#335C33]/15 rounded-2xl p-4 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#335C33] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C5A35]" />
              {t('esgCycleTitle')}
            </h3>
            <span className="text-[10px] font-medium text-[#8C5A35]">{t('esgCycleZeroWaste')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { icon: <Sprout className="w-5 h-5 text-[#335C33] mb-1" />, step: t('esgCycleStep1Title'), sub: t('esgCycleStep1Desc'), delay: 0.22 },
              { icon: <Sun className="w-5 h-5 text-[#8C5A35] mb-1" />, step: t('esgCycleStep2Title'), sub: t('esgCycleStep2Desc'), delay: 0.27 },
              { icon: <TrendingUp className="w-5 h-5 text-[#335C33] mb-1" />, step: t('esgCycleStep3Title'), sub: t('esgCycleStep3Desc'), delay: 0.32 },
            ].map(({ icon, step, sub, delay }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay, ease: EASE_NATURAL }}
                className="bg-[#E3EDD3]/60 rounded-xl p-2.5 flex flex-col items-center"
              >
                {icon}
                <span className="text-[11px] font-bold text-[#335C33] leading-tight">{step}</span>
                <span className="text-[10px] text-[#2C2E2B]/70 mt-0.5">{sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
