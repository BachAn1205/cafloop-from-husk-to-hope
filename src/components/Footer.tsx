import { motion } from 'motion/react';
import { Leaf, Heart, School, ArrowUp } from 'lucide-react';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: EASE_NATURAL }}
      className="bg-[#E3EDD3]/50 border-t border-[#335C33]/15 pt-8 pb-12 px-5 text-center text-[#2C2E2B]"
    >
      <div className="max-w-[480px] mx-auto">

        {/* Brand identity */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#335C33] text-[#F6F6EE] flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[#335C33] text-sm tracking-tight font-serif">CAFLOOP</span>
          <span className="text-[10px] text-[#8C5A35] font-semibold">• From Husk to Hope</span>
        </div>

        <p className="text-xs text-[#2C2E2B]/75 leading-relaxed max-w-sm mx-auto mb-4">
          Dự án kinh tế tuần hoàn tái chế vỏ quả cà phê chín mọng thành trà Cascara thượng hạng, gây quỹ học bổng và trang thiết bị cho các điểm trường vùng cao Tây Nguyên.
        </p>

        {/* School beneficiary badge */}
        <div className="inline-flex items-center gap-2 bg-[#F6F6EE] border border-[#335C33]/15 px-3.5 py-2 rounded-xl text-xs text-[#335C33] font-medium mb-6 shadow-xs">
          <School className="w-4 h-4 text-[#8C5A35] flex-shrink-0" />
          <span>Đối tác thụ hưởng: Trường TH Nguyễn Thị Minh Khai</span>
        </div>

        {/* Scroll back up */}
        <div className="mb-6">
          <motion.button
            onClick={scrollToTop}
            aria-label="Cuộn lên đầu trang"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="inline-flex items-center gap-1.5 text-xs text-[#8C5A35] hover:text-[#335C33] font-medium transition-colors cursor-pointer"
          >
            <span>Lên đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-[#335C33]/10 text-[10px] text-[#2C2E2B]/60 flex flex-col gap-1">
          <p>© 2026 CAFLOOP - Dự Án Kinh Tế Tuần Hoàn & Quỹ Giáo Dục Vùng Cao</p>
          <div className="flex items-center justify-center gap-1 text-[#8C5A35]">
            <span>Vì một tương lai xanh và ngời sáng tri thức</span>
            <Heart className="w-3 h-3 text-[#335C33] fill-current" />
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
