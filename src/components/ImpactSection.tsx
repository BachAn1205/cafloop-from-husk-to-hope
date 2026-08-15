import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Bike, Tv, Heart, MapPin, CheckCircle2, School, Sparkles, Award } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export function ImpactSection() {
  const progressRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(progressRef, { once: true, margin: '-40px' });

  return (
    <section id="impact-section" className="py-12 px-5 bg-[#F6F6EE] relative border-t border-[#335C33]/10">
      <div className="max-w-[480px] mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3EDD3] text-[#335C33] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Heart className="w-3.5 h-3.5 text-[#8C5A35] fill-[#8C5A35]/20" />
            Tác Động Xã Hội
          </div>
          <h2 id="impact-section-title" className="text-2xl sm:text-3xl font-extrabold text-[#335C33] font-serif tracking-tight">
            Hành Trình Gieo Mầm
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#8C5A35] mt-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#8C5A35]" />
            <span>Trường Tiểu học Nguyễn Thị Minh Khai • Tây Nguyên</span>
          </div>
        </motion.div>

        {/* Heartwarming Unsplash Image with subtle aesthetic frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden shadow-md border-2 border-[#E3EDD3] mb-6 aspect-[4/3]"
        >
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
            alt="Các em học sinh vùng cao trên con đường đến trường với nụ cười rạng rỡ"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2E2B]/80 via-transparent to-transparent" />
          
          {/* Floating badge inside image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#F6F6EE]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#335C33]/90 flex items-center justify-center backdrop-blur-xs">
                <School className="w-4 h-4 text-[#E3EDD3]" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Điểm Trường Vùng Cao</p>
                <p className="text-[10px] text-[#E3EDD3] leading-tight">Vượt 8-12km đồi dốc mỗi ngày</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-[#8C5A35]/90 px-2.5 py-1 rounded-full backdrop-blur-xs">
              Mùa Tựu Trường
            </span>
          </div>
        </motion.div>

        {/* Core Social Impact Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#E3EDD3]/90 rounded-2xl p-5 border border-[#335C33]/15 shadow-xs mb-6"
        >
          <p id="impact-copy-text" className="text-sm sm:text-base text-[#335C33] font-medium leading-relaxed text-center">
            &ldquo;Toàn bộ lợi nhuận từ phiên bản giới hạn sẽ được chuyển hóa thành phương tiện đến trường và tri thức.&rdquo;
          </p>
        </motion.div>

        {/* PROGRESS BAR CARD */}
        <motion.div
          id="progress-container"
          ref={progressRef}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#F6F6EE] border-2 border-[#335C33]/20 rounded-2xl p-5 shadow-sm"
        >
          {/* Target Title & Sub-Targets */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5A35] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#8C5A35]" />
                Tiến Độ Gây Quỹ Hiện Tại
              </span>
              <span className="text-xs font-bold text-[#335C33] bg-[#E3EDD3] px-2 py-0.5 rounded-full">
                Giai đoạn 1
              </span>
            </div>
            <h3 id="target-label" className="text-sm sm:text-base font-bold text-[#335C33] leading-snug">
              Mục tiêu: 77 xe đạp & 02 Smart TV (Trường TH Nguyễn Thị Minh Khai)
            </h3>
          </div>

          {/* Smoothly Animated Progress Bar */}
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2 shadow-inner">
            <motion.div
              id="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: isInView ? '35%' : '0%' }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-full bg-[#335C33] rounded-full relative"
            >
              {/* Subtle stripe highlight */}
              <div className="absolute inset-0 bg-white/20 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[move-stripe_2s_linear_infinite]" />
            </motion.div>
          </div>

          {/* Text Below Progress Bar */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#335C33] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#335C33]" />
              <span id="progress-percentage-label" className="font-bold text-sm">
                Đã hoàn thành {isInView ? <AnimatedCounter to={35} duration={1.6} /> : 0}%
              </span>
            </span>
            <span className="text-[#8C5A35] text-[11px]">
              Còn 65% để hoàn tất mục tiêu
            </span>
          </div>

          {/* Breakdown items (77 xe đạp & 2 Smart TV) */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-[#335C33]/15">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#E3EDD3]/60">
              <div className="w-8 h-8 rounded-lg bg-[#335C33] text-[#F6F6EE] flex items-center justify-center flex-shrink-0">
                <Bike className="w-4 h-4 text-[#E3EDD3]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#335C33] truncate">27 / 77 Xe Đạp</p>
                <p className="text-[9px] text-[#8C5A35]">Đã sẵn sàng bàn giao</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#E3EDD3]/60">
              <div className="w-8 h-8 rounded-lg bg-[#8C5A35] text-[#F6F6EE] flex items-center justify-center flex-shrink-0">
                <Tv className="w-4 h-4 text-[#E3EDD3]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#335C33] truncate">01 / 02 Smart TV</p>
                <p className="text-[9px] text-[#8C5A35]">Cho phòng học số</p>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Real Quote / Mission note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8C5A35] text-center"
        >
          <Award className="w-3.5 h-3.5 text-[#335C33]" />
          <span>Minh bạch 100% tài chính và tiến độ trao quà trực tiếp tại điểm trường</span>
        </motion.div>

      </div>
    </section>
  );
}
