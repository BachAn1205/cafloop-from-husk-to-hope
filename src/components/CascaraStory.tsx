import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Heart, Check, ShieldCheck, Flame, Droplets, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import traImg from '../../assets/image/tra.jpg';
import tuithomImg from '../../assets/image/tuithom1.jpg';
import bagImg from '../../assets/image/bag1.jpg';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

interface CascaraStoryProps {
  onOpenOrder: () => void;
}

export function CascaraStory({ onOpenOrder }: CascaraStoryProps) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const trustBadges = [
    { icon: Check, label: t('storyBadgeClean'), color: 'text-[#335C33]' },
    { icon: ShieldCheck, label: t('storyBadgeAdditive'), color: 'text-[#8C5A35]' },
    { icon: Heart, label: t('storyBadgeTransparent'), color: 'text-[#335C33]' },
  ];

  const products = [
    {
      id: 1,
      image: traImg,
      badge: t('storyCardBadge'),
      title: t('storyCardTitle'),
      desc: t('storyCardDesc'),
      highlights: [
        { icon: Droplets, title: t('storyHighlight1Title'), desc: t('storyHighlight1Desc'), color: 'text-[#8C5A35]' },
        { icon: Flame, title: t('storyHighlight2Title'), desc: t('storyHighlight2Desc'), color: 'text-[#335C33]' },
        { icon: ShieldCheck, title: t('storyHighlight3Title'), desc: t('storyHighlight3Desc'), color: 'text-[#335C33]' },
      ],
      priceText: t('storyBtnDonate')
    },
    {
      id: 2,
      image: tuithomImg,
      badge: 'SẢN PHẨM MỚI',
      title: 'Túi Thơm Thảo Mộc',
      desc: 'Mang hương thơm đại ngàn vào không gian của bạn',
      highlights: [
        { icon: Leaf, title: 'Thư giãn: ', desc: 'Hương thơm dịu nhẹ giúp giảm căng thẳng và mệt mỏi.', color: 'text-[#8C5A35]' },
        { icon: Flame, title: 'Khử mùi: ', desc: 'Hiệu quả không gian nhỏ như xe hơi, tủ quần áo.', color: 'text-[#335C33]' },
        { icon: ShieldCheck, title: '100% tự nhiên: ', desc: 'An toàn cho sức khỏe, không chứa hóa chất.', color: 'text-[#335C33]' },
      ],
      priceText: 'Ủng Hộ & Nhận Túi Thơm'
    },
    {
      id: 3,
      image: bagImg,
      badge: 'BẢN SẮC VÙNG CAO',
      title: 'Túi Thổ Cẩm Bản Địa',
      desc: 'Tôn vinh nét đẹp văn hóa truyền thống Tây Nguyên',
      highlights: [
        { icon: Heart, title: 'Thủ công: ', desc: 'Dệt tay tỉ mỉ bởi các nghệ nhân địa phương.', color: 'text-[#8C5A35]' },
        { icon: ShieldCheck, title: 'Độc bản: ', desc: 'Mỗi chiếc túi mang một hoa văn duy nhất không đụng hàng.', color: 'text-[#335C33]' },
        { icon: Check, title: 'Bền vững: ', desc: 'Góp phần tạo sinh kế ổn định cho phụ nữ vùng cao.', color: 'text-[#335C33]' },
      ],
      priceText: 'Ủng Hộ & Nhận Túi Thổ Cẩm'
    }
  ];

  const activeProduct = products[activeIndex];

  const nextProduct = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % products.length);
  };
  
  const prevProduct = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToProduct = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Auto-play effect
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, products.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              // resume autoplay shortly after touch ends
              setTimeout(() => setIsHovered(false), 2000);
            }}
            className="order-2 lg:order-1 bg-[#F6F6EE] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#335C33]/15 shadow-md relative overflow-hidden flex flex-col"
          >
            {/* Subtle background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E3EDD3]/50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />

            {/* Fixed Min Height Wrapper to prevent layout jumps during transitions */}
            <div className="relative min-h-[460px] sm:min-h-[420px] md:min-h-[440px] lg:min-h-[440px] w-full">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={activeProduct.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 w-full flex flex-col justify-start"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 mb-6 md:mb-8 relative z-10">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden bg-[#E3EDD3] flex-shrink-0 border border-[#335C33]/20 shadow-xs">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.title}
                        loading="lazy"
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#8C5A35] bg-[#E3EDD3] px-2.5 md:px-3 py-1 rounded-md mb-1.5 md:mb-2">
                        {activeProduct.badge}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-[#335C33] leading-snug">
                        {activeProduct.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#2C2E2B]/75 mt-1 md:mt-1.5 min-h-[40px]">
                        {activeProduct.desc}
                      </p>
                    </div>
                  </div>

                  {/* Flavor & Health Highlights */}
                  <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-[#335C33]/10 relative z-10 flex-1">
                    {activeProduct.highlights.map(({ icon: Icon, title, desc, color }, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-[#2C2E2B]/85 bg-white/40 p-3 md:p-4 rounded-xl border border-white/60">
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} flex-shrink-0 mt-0.5`} />
                        <span className="leading-relaxed"><strong>{title}</strong>{desc}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls & CTA inside product card */}
            <div className="mt-6 md:mt-8 flex items-center gap-2 md:gap-3 relative z-10">
              <button 
                onClick={prevProduct}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#E3EDD3] text-[#335C33] flex items-center justify-center hover:bg-[#D5E3C0] transition-colors shrink-0"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <motion.button
                onClick={onOpenOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex-1 py-3.5 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs md:text-base flex items-center justify-center gap-1.5 md:gap-2 hover:bg-[#284828] transition-[background-color] duration-200 shadow-md cursor-pointer border border-transparent whitespace-nowrap overflow-hidden"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#E3EDD3] fill-[#E3EDD3] shrink-0" />
                <span className="truncate">{activeProduct.priceText}</span>
              </motion.button>
              
              <button 
                onClick={nextProduct}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#E3EDD3] text-[#335C33] flex items-center justify-center hover:bg-[#D5E3C0] transition-colors shrink-0"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-4 md:mt-5 relative z-10">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToProduct(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-[#335C33]' : 'w-1.5 bg-[#335C33]/30'}`}
                />
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
