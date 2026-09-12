import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Recycle, Clock, QrCode, Users, TrendingUp, Sparkles, RefreshCw, Sun, Sprout } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { useLanguage } from '../utils/LanguageContext';
import { getQRScanCount } from '../utils/visitorTracker';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

export function ESGSection() {
  const { t, language } = useLanguage();
  const [scanCount, setScanCount] = useState(1284);

  useEffect(() => {
    setScanCount(getQRScanCount());
  }, []);

  return (
    <section id="esg-section" className="py-12 md:py-20 px-5 md:px-8 bg-[#F6F6EE] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
          className="text-center mb-10 md:mb-14"
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

        {/* 6 Circular Metric Cards Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-12">
          
          {/* Card 1: Khối lượng phụ phẩm được tái sử dụng */}
          <motion.div
            id="card-esg-byproduct"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE_NATURAL }}
            whileHover={{ y: -4 }}
            className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
          >
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#335C33] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Recycle className="w-5 h-5 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#335C33] bg-[#F6F6EE]/90 px-2.5 py-1 rounded-full border border-[#335C33]/10">
                  {language === 'vi' ? 'Môi Trường' : 'Environment'}
                </span>
              </div>

              <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
                {t('esgCardByProductTitle')}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  ≈ 7,22
                </span>
                <span className="text-base md:text-lg font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
                {t('esgCardByProductDesc')}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Vỏ cà phê tái chế (500kg) */}
          <motion.div
            id="card-esg-recycled-husk"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_NATURAL }}
            whileHover={{ y: -4 }}
            className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
          >
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#335C33] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Sprout className="w-5 h-5 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#335C33] bg-[#F6F6EE]/90 px-2.5 py-1 rounded-full border border-[#335C33]/10">
                  ESG 2026
                </span>
              </div>

              <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
                {t('esgCardHuskTitle')}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={500} duration={2.0} />
                </span>
                <span className="text-base md:text-lg font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
                {t('esgCardHuskDesc')}
              </p>
            </div>
          </motion.div>

          {/* Card 3: CO2 giảm tải (1200kg) - Nền icon màu xanh */}
          <motion.div
            id="card-esg-co2-reduction"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE_NATURAL }}
            whileHover={{ y: -4 }}
            className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
          >
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#335C33] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#335C33] bg-[#F6F6EE]/90 px-2.5 py-1 rounded-full border border-[#335C33]/10">
                  {language === 'vi' ? 'Khí Thải' : 'Carbon'}
                </span>
              </div>

              <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
                {t('esgCardCO2Title')}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={1200} duration={2.2} />
                </span>
                <span className="text-base md:text-lg font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
                {t('esgCardCO2Desc')}
              </p>
            </div>
          </motion.div>

          {/* Card 4: Giờ công lao động tạo ra cho cộng đồng - Nền icon màu nâu */}
          <motion.div
            id="card-esg-labor-hours"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_NATURAL }}
            whileHover={{ y: -4 }}
            className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
          >
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8C5A35]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#8C5A35] bg-[#F6F6EE]/90 px-2.5 py-1 rounded-full border border-[#8C5A35]/15">
                  {language === 'vi' ? 'Kết Quả (Outcome)' : 'Outcome'}
                </span>
              </div>

              <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
                {t('esgCardLaborTitle')}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  ≈ 44
                </span>
                <span className="text-sm md:text-base font-bold text-[#8C5A35]">
                  {language === 'vi' ? 'giờ công' : 'hours'}
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
                {t('esgCardLaborDesc')}
              </p>
            </div>
          </motion.div>

          {/* Card 5: Lượt quét mã QR truy cập trang web - Nền icon màu nâu */}
          <motion.div
            id="card-esg-qr-scans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE_NATURAL }}
            whileHover={{ y: -4 }}
            className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
          >
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8C5A35]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <QrCode className="w-5 h-5 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#8C5A35] bg-[#F6F6EE]/90 px-2.5 py-1 rounded-full border border-[#8C5A35]/15">
                  {language === 'vi' ? 'Truy Xuất QR' : 'QR Scan'}
                </span>
              </div>

              <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
                {t('esgCardQRTitle')}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={scanCount} duration={2.0} />
                </span>
                <span className="text-sm md:text-base font-bold text-[#8C5A35]">
                  {language === 'vi' ? 'lượt' : 'scans'}
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
                {t('esgCardQRDesc')}
              </p>
            </div>
          </motion.div>

          {/* Card 6: Hộ dân được hỗ trợ trực tiếp (Mock data) */}
          <motion.div
            id="card-esg-households"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE_NATURAL }}
            whileHover={{ y: -4 }}
            className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-[box-shadow,transform] duration-300 hover:shadow-lg relative overflow-hidden group cursor-default"
          >
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8C5A35]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5 text-[#E3EDD3]" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#8C5A35] bg-[#F6F6EE]/90 px-2.5 py-1 rounded-full border border-[#8C5A35]/15">
                  {language === 'vi' ? 'Sinh Kế' : 'Community'}
                </span>
              </div>

              <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
                {t('esgCardHouseholdsTitle')}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={12} duration={1.5} />
                </span>
                <span className="text-sm md:text-base font-bold text-[#8C5A35]">
                  {language === 'vi' ? 'hộ dân' : 'households'}
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
                {t('esgCardHouseholdsDesc')}
              </p>
            </div>
          </motion.div>

        </div>

        {/* Circular Economy Flow Section (3 Steps) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.28, ease: EASE_NATURAL }}
          className="bg-[#F6F6EE] border border-[#335C33]/20 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 md:mb-8 pb-4 border-b border-[#335C33]/15">
            <h3 className="text-base md:text-xl font-bold text-[#335C33] font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35]" />
              {t('esgCycleTitle')}
            </h3>
            <span className="self-start sm:self-auto text-xs md:text-sm font-semibold text-[#8C5A35] px-3.5 py-1 bg-[#E3EDD3] rounded-full border border-[#335C33]/10">
              {t('esgCycleZeroWaste')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
            {[
              {
                icon: <Sprout className="w-7 h-7 md:w-9 md:h-9 text-[#335C33] mb-3" />,
                step: t('esgCycleStep1Title'),
                sub: t('esgCycleStep1Desc'),
                delay: 0.3,
              },
              {
                icon: <Sun className="w-7 h-7 md:w-9 md:h-9 text-[#8C5A35] mb-3" />,
                step: t('esgCycleStep2Title'),
                sub: t('esgCycleStep2Desc'),
                delay: 0.35,
              },
              {
                icon: <TrendingUp className="w-7 h-7 md:w-9 md:h-9 text-[#335C33] mb-3" />,
                step: t('esgCycleStep3Title'),
                sub: t('esgCycleStep3Desc'),
                delay: 0.4,
              },
            ].map(({ icon, step, sub, delay }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay, ease: EASE_NATURAL }}
                className="bg-[#E3EDD3]/55 rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center hover:bg-[#E3EDD3] transition-colors duration-300 border border-[#335C33]/10"
              >
                {icon}
                <span className="text-sm md:text-base font-bold text-[#335C33] leading-tight mb-1">{step}</span>
                <span className="text-xs md:text-sm text-[#2C2E2B]/75 mt-0.5 leading-relaxed">{sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
