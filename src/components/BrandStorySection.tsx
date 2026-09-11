import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Target,
  RotateCcw,
  ShieldCheck,
  HeartHandshake,
  Users,
  Sprout,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { FounderStoryModal } from './FounderStoryModal';
import founderImg from '../../assets/image/founder.png';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

export function BrandStorySection() {
  const { t, language } = useLanguage();
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);

  const coreValues = [
    {
      id: 'upcycling',
      icon: RotateCcw,
      title: t('valUpcyclingTitle'),
      desc: t('valUpcyclingDesc'),
      accentColor: 'text-[#335C33]',
      bgColor: 'bg-[#335C33]/10',
      badge: '01'
    },
    {
      id: 'genuine',
      icon: ShieldCheck,
      title: t('valGenuineTitle'),
      desc: t('valGenuineDesc'),
      accentColor: 'text-[#8C5A35]',
      bgColor: 'bg-[#8C5A35]/10',
      badge: '02'
    },
    {
      id: 'culture',
      icon: HeartHandshake,
      title: t('valCultureTitle'),
      desc: t('valCultureDesc'),
      accentColor: 'text-[#335C33]',
      bgColor: 'bg-[#335C33]/10',
      badge: '03'
    },
    {
      id: 'ecosystem',
      icon: Users,
      title: t('valEcosystemTitle'),
      desc: t('valEcosystemDesc'),
      accentColor: 'text-[#8C5A35]',
      bgColor: 'bg-[#8C5A35]/10',
      badge: '04'
    },
    {
      id: 'startSmall',
      icon: Sprout,
      title: t('valStartSmallTitle'),
      desc: t('valStartSmallDesc'),
      accentColor: 'text-[#335C33]',
      bgColor: 'bg-[#335C33]/10',
      badge: '05'
    }
  ];

  return (
    <section
      id="brand-story-section"
      className="w-full py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-[#F6F6EE] relative overflow-hidden border-t border-[#335C33]/10"
    >
      {/* Decorative ambient background spots */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#E3EDD3]/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8C5A35]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16 md:space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-badge mb-3 md:mb-4"
          >
            <Sparkles className="text-[#335C33]" />
            <span>{t('brandStoryBadge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#335C33] tracking-tight"
          >
            {t('brandStoryTitle')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-subtitle mt-2.5"
          >
            {t('brandStorySubtitle')}
          </motion.p>
        </div>

        {/* 1. Bento Grid: Tầm Nhìn & Sứ Mệnh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Tầm Nhìn (Vision Card) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_NATURAL }}
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#FAF9F2] border border-[#335C33]/15 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#335C33]/10 flex items-center justify-center text-[#335C33] group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C5A35]">
                  {language === 'vi' ? 'Định hướng tương lai' : 'Future Direction'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#335C33] mt-1">
                  {t('visionTitle')}
                </h3>
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {t('visionDesc')}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#335C33]/10 flex items-center gap-2 text-xs font-semibold text-[#335C33]">
              <span className="w-2 h-2 rounded-full bg-[#335C33] animate-pulse" />
              <span>{language === 'vi' ? 'Tác động tuần hoàn dài hạn' : 'Long-term Circular Impact'}</span>
            </div>
          </motion.div>

          {/* Sứ Mệnh (Mission Card) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_NATURAL }}
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#335C33] text-[#F6F6EE] shadow-lg flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle background ring */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E3EDD3] group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E3EDD3]/80">
                  {language === 'vi' ? 'Hành động mỗi ngày' : 'Daily Commitment'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {t('missionTitle')}
                </h3>
              </div>
              <p className="text-[#E3EDD3]/90 text-sm sm:text-base leading-relaxed">
                {t('missionDesc')}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-[#E3EDD3] relative z-10">
              <span className="w-2 h-2 rounded-full bg-[#E3EDD3] animate-pulse" />
              <span>{language === 'vi' ? 'Từ nông dân đến thế hệ trẻ' : 'Connecting Farmers to the Youth'}</span>
            </div>
          </motion.div>
        </div>

        {/* 2. Giá Trị Cốt Lõi (Core Values) */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#335C33]">
              {t('coreValuesTitle')}
            </h3>
            <p className="section-subtitle mt-1">
              {t('coreValuesSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group relative p-5 rounded-2xl bg-[#FAF9F2] border border-[#335C33]/15 hover:border-[#335C33]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center ${item.accentColor}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-stone-400">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#335C33] group-hover:text-[#8C5A35] transition-colors mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. Chân Dung Người Sáng Lập (Founder Profile) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_NATURAL }}
          className="rounded-3xl bg-gradient-to-br from-[#FAF9F2] to-[#EAEFE4]/70 border border-[#335C33]/20 shadow-md p-6 sm:p-8 md:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Founder Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#335C33] to-[#8C5A35] rounded-3xl blur-sm opacity-25 group-hover:opacity-40 transition duration-500" />
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-[#FDFCF7] aspect-[4/5] bg-stone-200">
                  <img
                    src={founderImg}
                    alt="Phan Hoàng Quỳnh Chi - Founder Cafloop"
                    className="w-full h-full object-cover object-top hover:scale-102 transition duration-500"
                  />
                  {/* Overlay badge */}
                  <div className="absolute bottom-3 inset-x-3 bg-[#335C33]/90 backdrop-blur-md text-white py-2 px-3 rounded-xl border border-white/20 text-center">
                    <p className="text-xs font-bold tracking-wide">
                      Phan Hoàng Quỳnh Chi
                    </p>
                    <p className="text-[10px] text-[#E3EDD3]">
                      Founder & Project Lead • CAFLOOP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Story & Milestones */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge & Title */}
              <div>
                <span className="section-badge mb-2.5">
                  <Sparkles className="text-[#8C5A35]" />
                  <span>{t('founderBadge')}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#335C33]">
                  {t('founderName')}
                </h3>
                <p className="section-subtitle mt-1 font-semibold">
                  {t('founderRole')}
                </p>
              </div>

              {/* Founder Quote */}
              <div className="pl-5 sm:pl-6 border-l-4 border-[#335C33] py-1 text-[#335C33]">
                <p className="font-serif italic text-sm sm:text-base md:text-lg leading-relaxed text-stone-800">
                  {t('founderQuote')}
                </p>
              </div>

              {/* 3 Step Timeline (Scannable, not overwhelming) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#335C33]/15 text-[#335C33] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#335C33]">
                      {t('founderStep1Title')}
                    </h5>
                    <p className="text-xs sm:text-[13px] text-stone-600 leading-snug">
                      {t('founderStep1Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#335C33]/15 text-[#335C33] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#335C33]">
                      {t('founderStep2Title')}
                    </h5>
                    <p className="text-xs sm:text-[13px] text-stone-600 leading-snug">
                      {t('founderStep2Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#335C33]/15 text-[#335C33] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#335C33]">
                      {t('founderStep3Title')}
                    </h5>
                    <p className="text-xs sm:text-[13px] text-stone-600 leading-snug">
                      {t('founderStep3Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progressive Disclosure CTA Button */}
              <div className="pt-2">
                <button
                  onClick={() => setIsFounderModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#335C33] hover:bg-[#274827] text-[#F6F6EE] text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group"
                >
                  <BookOpen className="w-4 h-4 text-[#E3EDD3]" />
                  <span>{t('founderReadMoreBtn')}</span>
                  <ArrowRight className="w-4 h-4 text-[#E3EDD3] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </motion.div>

      </div>

      {/* Deep-dive Story Modal */}
      <FounderStoryModal
        isOpen={isFounderModalOpen}
        onClose={() => setIsFounderModalOpen(false)}
      />
    </section>
  );
}
