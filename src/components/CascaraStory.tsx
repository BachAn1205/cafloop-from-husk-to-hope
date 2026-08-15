import { motion } from 'motion/react';
import { Coffee, Heart, Check, Sparkles, ShieldCheck, Flame, Droplets } from 'lucide-react';

interface CascaraStoryProps {
  onOpenOrder: () => void;
}

export function CascaraStory({ onOpenOrder }: CascaraStoryProps) {
  return (
    <section className="py-12 px-5 bg-[#E3EDD3]/40 border-t border-[#335C33]/10 relative">
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
            <Coffee className="w-3.5 h-3.5 text-[#8C5A35]" />
            Hương Vị Đại Ngàn
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#335C33] font-serif tracking-tight">
            Trà Cascara CAFLOOP
          </h2>
          <p className="text-xs sm:text-sm text-[#8C5A35] mt-1.5 font-medium">
            Mỗi giọt trà ngọt thanh mang theo niềm hy vọng đến trường
          </p>
        </motion.div>

        {/* Product highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#F6F6EE] rounded-2xl p-5 border border-[#335C33]/15 shadow-sm mb-5"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#E3EDD3] flex-shrink-0 border border-[#335C33]/20 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80"
                alt="Trà Cascara từ vỏ cà phê hữu cơ thơm dịu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5A35] bg-[#E3EDD3] px-2 py-0.5 rounded-md">
                Phiên Bản Gây Quỹ Giới Hạn
              </span>
              <h3 className="text-base font-bold text-[#335C33] mt-1 leading-snug">
                Hộp Trà Cascara 100g Thượng Hạng
              </h3>
              <p className="text-xs text-[#2C2E2B]/75 mt-0.5">
                Vị ngọt mận chín, hoa hồng dại & mật ong rừng
              </p>
            </div>
          </div>

          {/* Flavor & Health Highlights */}
          <div className="space-y-2.5 pt-3 border-t border-[#335C33]/10">
            <div className="flex items-start gap-2 text-xs text-[#2C2E2B]/85">
              <Droplets className="w-4 h-4 text-[#8C5A35] flex-shrink-0 mt-0.5" />
              <span><strong>Giàu Polyphenol:</strong> Chống oxy hóa cao gấp 8 lần nước ép việt quất tự nhiên.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#2C2E2B]/85">
              <Flame className="w-4 h-4 text-[#335C33] flex-shrink-0 mt-0.5" />
              <span><strong>Lượng Caffein Dịu Nhẹ:</strong> Tỉnh táo tự nhiên, êm dịu dạ dày và giấc ngủ.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#2C2E2B]/85">
              <ShieldCheck className="w-4 h-4 text-[#335C33] flex-shrink-0 mt-0.5" />
              <span><strong>100% Lợi Nhuận Gây Quỹ:</strong> Mỗi hộp trà tài trợ 1 tuần học tập & bánh mì cho học sinh.</span>
            </div>
          </div>

          {/* CTA inside product card */}
          <button
            onClick={onOpenOrder}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#284828] active:scale-[0.98] transition-all shadow-xs"
          >
            <Heart className="w-4 h-4 text-[#E3EDD3] fill-[#E3EDD3]" />
            <span>Ủng Hộ & Nhận Hộp Trà Gây Quỹ (150.000đ)</span>
          </button>
        </motion.div>

        {/* Small Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-[#335C33]">
          <div className="bg-[#E3EDD3]/70 rounded-xl p-2 flex flex-col items-center">
            <Check className="w-4 h-4 text-[#335C33] mb-0.5" />
            <span>Nông Nghiệp Sạch</span>
          </div>
          <div className="bg-[#E3EDD3]/70 rounded-xl p-2 flex flex-col items-center">
            <Sparkles className="w-4 h-4 text-[#8C5A35] mb-0.5" />
            <span>Không Phụ Gia</span>
          </div>
          <div className="bg-[#E3EDD3]/70 rounded-xl p-2 flex flex-col items-center">
            <Heart className="w-4 h-4 text-[#335C33] mb-0.5" />
            <span>Minh Bạch 100%</span>
          </div>
        </div>

      </div>
    </section>
  );
}
