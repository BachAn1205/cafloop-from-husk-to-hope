import { motion } from 'motion/react';
import { Recycle, Leaf, TrendingUp, Sparkles, RefreshCw, Sun, Sprout } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export function ESGSection() {
  return (
    <section id="esg-section" className="py-12 px-5 bg-[#F6F6EE] relative">
      <div className="max-w-[480px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-7"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3EDD3] text-[#335C33] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <RefreshCw className="w-3.5 h-3.5 text-[#335C33]" />
            Dữ Liệu Tuần Hoàn
          </div>
          <h2 id="esg-section-title" className="text-2xl sm:text-3xl font-extrabold text-[#335C33] font-serif tracking-tight">
            Tác Động Xanh
          </h2>
          <p className="text-xs sm:text-sm text-[#8C5A35] mt-1.5 font-medium">
            Chuyển hóa phế phẩm nông nghiệp thành tài nguyên bền vững
          </p>
        </motion.div>

        {/* 2 Main ESG Metric Cards */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          
          {/* Card 1: Vỏ cà phê tái chế */}
          <motion.div
            id="card-esg-recycled-husk"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="bg-[#E3EDD3] rounded-2xl p-4 shadow-sm border border-[#335C33]/10 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group"
          >
            {/* Background subtle leaf motif */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />

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
                Vỏ cà phê tái chế
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={500} duration={2.0} />
                </span>
                <span className="text-base font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] text-[#2C2E2B]/70 mt-1 leading-snug">
                Thu gom từ 12 nông hộ Tây Nguyên
              </p>
            </div>
          </motion.div>

          {/* Card 2: CO2 giảm tải */}
          <motion.div
            id="card-esg-co2-reduction"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="bg-[#E3EDD3] rounded-2xl p-4 shadow-sm border border-[#335C33]/10 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group"
          >
            {/* Background subtle leaf motif */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#8C5A35]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center shadow-xs">
                <Leaf className="w-5 h-5 text-[#E3EDD3]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5A35] bg-[#F6F6EE]/80 px-2 py-0.5 rounded-full">
                Khí Thải
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#335C33] leading-tight mb-1.5">
                CO2 giảm tải
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#335C33] tracking-tight font-serif">
                  <AnimatedCounter to={1200} duration={2.2} />
                </span>
                <span className="text-base font-bold text-[#8C5A35]">kg</span>
              </div>
              <p className="text-[11px] text-[#2C2E2B]/70 mt-1 leading-snug">
                Ngăn chặn khí mê-tan phân hủy hở
              </p>
            </div>
          </motion.div>

        </div>

        {/* Circular Economy Flow Mini Infographic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#F6F6EE] border border-[#335C33]/15 rounded-2xl p-4 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#335C33] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C5A35]" />
              Vòng Lặp Tuần Hoàn CAFLOOP
            </h3>
            <span className="text-[10px] font-medium text-[#8C5A35]">100% Zero-Waste</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#E3EDD3]/60 rounded-xl p-2.5 flex flex-col items-center">
              <Sprout className="w-5 h-5 text-[#335C33] mb-1" />
              <span className="text-[11px] font-bold text-[#335C33] leading-tight">1. Thu hoạch</span>
              <span className="text-[10px] text-[#2C2E2B]/70 mt-0.5">Vỏ quả mọng đỏ</span>
            </div>
            <div className="bg-[#E3EDD3]/60 rounded-xl p-2.5 flex flex-col items-center">
              <Sun className="w-5 h-5 text-[#8C5A35] mb-1" />
              <span className="text-[11px] font-bold text-[#335C33] leading-tight">2. Phơi nắng</span>
              <span className="text-[10px] text-[#2C2E2B]/70 mt-0.5">Trà Cascara thơm</span>
            </div>
            <div className="bg-[#E3EDD3]/60 rounded-xl p-2.5 flex flex-col items-center">
              <TrendingUp className="w-5 h-5 text-[#335C33] mb-1" />
              <span className="text-[11px] font-bold text-[#335C33] leading-tight">3. Học bổng</span>
              <span className="text-[10px] text-[#2C2E2B]/70 mt-0.5">Xe đạp & Smart TV</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
