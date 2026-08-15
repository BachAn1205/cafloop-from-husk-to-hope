import { motion } from 'motion/react';
import { Coffee, Heart, Check, ShieldCheck, Flame, Droplets } from 'lucide-react';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

interface CascaraStoryProps {
  onOpenOrder: () => void;
}

export function CascaraStory({ onOpenOrder }: CascaraStoryProps) {
  const trustBadges = [
    { icon: Check, label: 'Nông Nghiệp Sạch', color: 'text-[#335C33]' },
    { icon: ShieldCheck, label: 'Không Phụ Gia', color: 'text-[#8C5A35]' },
    { icon: Heart, label: 'Minh Bạch 100%', color: 'text-[#335C33]' },
  ];

  return (
    <section className="py-12 px-5 bg-[#E3EDD3]/40 border-t border-[#335C33]/10 relative">
      <div className="max-w-[480px] mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
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
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE_NATURAL }}
          className="bg-[#F6F6EE] rounded-2xl p-5 border border-[#335C33]/15 shadow-sm mb-5"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#E3EDD3] flex-shrink-0 border border-[#335C33]/20 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80"
                alt="Trà Cascara từ vỏ cà phê hữu cơ thơm dịu"
                referrerPolicy="no-referrer"
                loading="lazy"
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
            {[
              { icon: Droplets, text: <><strong>Giàu Polyphenol:</strong> Chống oxy hóa cao gấp 8 lần nước ép việt quất tự nhiên.</>, color: 'text-[#8C5A35]' },
              { icon: Flame, text: <><strong>Lượng Caffein Dịu Nhẹ:</strong> Tỉnh táo tự nhiên, êm dịu dạ dày và giấc ngủ.</>, color: 'text-[#335C33]' },
              { icon: ShieldCheck, text: <><strong>100% Lợi Nhuận Gây Quỹ:</strong> Mỗi hộp trà tài trợ 1 tuần học tập & bánh mì cho học sinh.</>, color: 'text-[#335C33]' },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#2C2E2B]/85">
                <Icon className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA inside product card */}
          <motion.button
            onClick={onOpenOrder}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#284828] transition-[background-color] duration-200 shadow-xs cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#E3EDD3] fill-[#E3EDD3]" />
            <span>Ủng Hộ & Nhận Hộp Trà Gây Quỹ (150.000đ)</span>
          </motion.button>
        </motion.div>

        {/* Trust Badges — staggered entrance */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-[#335C33]">
          {trustBadges.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.06, ease: EASE_NATURAL }}
              className="bg-[#E3EDD3]/70 rounded-xl p-2 flex flex-col items-center"
            >
              <Icon className={`w-4 h-4 ${color} mb-0.5`} />
              <span>{label}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
