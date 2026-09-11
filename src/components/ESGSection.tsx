import { motion } from 'motion/react';
import { Recycle, Leaf, TrendingUp, Sparkles, RefreshCw, Sun, Sprout } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { useLanguage } from '../utils/LanguageContext';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

export function ESGSection() {
  const { t, language } = useLanguage();

  return (
    <section id="esg-section" className="py-12 md:py-20 px-5 md:px-8 bg-[#F6F6EE] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="section-badge mb-3 md:mb-4">
            <RefreshCw className="text-[#8C5A35]" />
            <span>{t('esgBadge')}</span>
          </div>
          <h2 id="esg-section-title" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] font-serif tracking-tight">
            {t('esgTitle')}
          </h2>
          <p className="section-subtitle mt-2.5 max-w-2xl mx-auto">
            {t('esgSubtitle')}
          </p>
        </motion.div>

        {/* ESG Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: 2 Main ESG Metric Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 md:gap-5">
            
            {/* Card 1: Vỏ cà phê tái chế */}
            <motion.div
              id="card-esg-recycled-husk"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: 0.06, ease: EASE_NATURAL }}
              whileHover={{ y: -4 }}
              className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-[#335C33]/10 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
            >
              {/* Background subtle leaf motif */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-16 h-16 md:w-32 md:h-32 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#335C33] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Recycle className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#335C33]/70 bg-[#F6F6EE]/80 px-2.5 md:px-3 py-1 rounded-full">
                  ESG 2026
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-xs md:text-sm lg:text-base font-semibold text-[#335C33] leading-tight mb-2">
                  {t('esgCardHuskTitle')}
                </p>
                <div className="flex items-baseline gap-1.5 md:gap-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] tracking-tight font-serif">
                    <AnimatedCounter to={500} duration={2.0} />
                  </span>
                  <span className="text-base md:text-lg font-bold text-[#8C5A35]">kg</span>
                </div>
                <p className="text-[11px] md:text-xs lg:text-sm text-[#2C2E2B]/75 mt-1.5 md:mt-2 leading-snug">
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
              whileHover={{ y: -4 }}
              className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-[#335C33]/10 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
            >
              {/* Background subtle leaf motif */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-16 h-16 md:w-32 md:h-32 bg-[#8C5A35]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#8C5A35] bg-[#F6F6EE]/80 px-2.5 md:px-3 py-1 rounded-full">
                  {language === 'vi' ? 'Khí Thải' : 'Carbon'}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-xs md:text-sm lg:text-base font-semibold text-[#335C33] leading-tight mb-2">
                  {t('esgCardCO2Title')}
                </p>
                <div className="flex items-baseline gap-1.5 md:gap-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] tracking-tight font-serif">
                    <AnimatedCounter to={1200} duration={2.2} />
                  </span>
                  <span className="text-base md:text-lg font-bold text-[#8C5A35]">kg</span>
                </div>
                <p className="text-[11px] md:text-xs lg:text-sm text-[#2C2E2B]/75 mt-1.5 md:mt-2 leading-snug">
                  {t('esgCardCO2Desc')}
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Circular Economy Flow Mini Infographic */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASE_NATURAL }}
            className="lg:col-span-7 bg-[#F6F6EE] border border-[#335C33]/15 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-5 md:mb-8">
              <h3 className="text-sm md:text-lg font-bold text-[#335C33] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35]" />
                {t('esgCycleTitle')}
              </h3>
              <span className="text-xs md:text-sm font-medium text-[#8C5A35] px-3 py-1 bg-[#8C5A35]/10 rounded-full">{t('esgCycleZeroWaste')}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-6 text-center h-full">
              {[
                { icon: <Sprout className="w-6 h-6 md:w-8 md:h-8 text-[#335C33] mb-2 md:mb-4" />, step: t('esgCycleStep1Title'), sub: t('esgCycleStep1Desc'), delay: 0.22 },
                { icon: <Sun className="w-6 h-6 md:w-8 md:h-8 text-[#8C5A35] mb-2 md:mb-4" />, step: t('esgCycleStep2Title'), sub: t('esgCycleStep2Desc'), delay: 0.27 },
                { icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#335C33] mb-2 md:mb-4" />, step: t('esgCycleStep3Title'), sub: t('esgCycleStep3Desc'), delay: 0.32 },
              ].map(({ icon, step, sub, delay }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay, ease: EASE_NATURAL }}
                  className="bg-[#E3EDD3]/60 rounded-xl md:rounded-2xl p-3 md:p-6 flex flex-col items-center justify-center hover:bg-[#E3EDD3] transition-colors duration-300"
                >
                  {icon}
                  <span className="text-xs md:text-sm lg:text-base font-bold text-[#335C33] leading-tight mb-1">{step}</span>
                  <span className="text-[10px] md:text-xs lg:text-sm text-[#2C2E2B]/75 mt-0.5">{sub}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
