import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, BookOpen, Compass, Award, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import founderImg from '../../assets/image/founder.png';

interface FounderStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FounderStoryModal({ isOpen, onClose }: FounderStoryModalProps) {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#FDFCF7] border border-[#335C33]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-[#335C33]/10 bg-[#E5E9DF]/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#335C33]/10 text-[#335C33]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#335C33]">
                  {isVi ? 'Hành trình người sáng lập' : 'Founder Journey'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 text-[#335C33]/70 hover:text-[#335C33] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-6 text-[#2D312E] leading-relaxed">
              {/* Founder Header Bar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-[#335C33]/5 border border-[#335C33]/10">
                <img
                  src={founderImg}
                  alt="Phan Hoàng Quỳnh Chi"
                  className="w-24 h-28 sm:w-28 sm:h-32 object-cover object-top rounded-xl shadow-md border-2 border-white shrink-0"
                />
                <div className="text-center sm:text-left space-y-1.5">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#8C5A35]/15 text-[#8C5A35]">
                    CAFLOOP FOUNDER
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#335C33]">
                    Phan Hoàng Quỳnh Chi
                  </h3>
                  <p className="text-xs md:text-sm text-[#8C5A35] font-medium">
                    {isVi
                      ? 'Nghiên cứu Kinh tế Phát triển & Mô hình Tuần hoàn'
                      : 'Development Economics & Circular Economy Researcher'}
                  </p>
                  <p className="text-xs text-stone-600 italic pt-1">
                    {isVi
                      ? '“Học thuật, rèn luyện tư duy và hành động thực tiễn là một chuỗi phát triển năng lực dài hạn.”'
                      : '“Academic research, critical thinking, and practical action form a lifelong capacity-building journey.”'}
                  </p>
                </div>
              </div>

              {/* Story Section 1: Motivation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#335C33] font-bold text-base md:text-lg">
                  <div className="w-7 h-7 rounded-lg bg-[#335C33]/10 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-[#335C33]" />
                  </div>
                  <h4>{isVi ? '1. Khởi nguồn từ trăn trở nơi đại ngàn' : '1. Highland Roots & Inspiration'}</h4>
                </div>
                <p className="text-sm md:text-base text-stone-700 pl-9.5">
                  {isVi
                    ? 'Lớn lên tại mảnh đất Tây Nguyên, gắn bó sâu sắc với nhịp sống của những gia đình canh tác cà phê, Quỳnh Chi luôn trăn trở trước một nghịch lý: phần lớn giá trị kinh tế của chuỗi sản xuất không nằm lại ở nơi tạo ra nguyên liệu thô. Mỗi mùa thu hoạch, hàng nghìn tấn vỏ quả cà phê bị bỏ lại - chất đống, đốt bỏ, gây ô nhiễm và dần trôi vào quên lãng.'
                    : 'Growing up in the heart of Vietnam’s coffee highlands and closely observing local farming families, Quynh Chi was constantly moved by a striking paradox: the majority of supply chain value never remains in the region producing raw materials. Each harvest season, thousands of tons of nutrient-rich coffee husks are discarded, burned, or left to rot.'}
                </p>
              </div>

              {/* Story Section 2: Research background */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#335C33] font-bold text-base md:text-lg">
                  <div className="w-7 h-7 rounded-lg bg-[#335C33]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-[#335C33]" />
                  </div>
                  <h4>{isVi ? '2. Nền tảng học thuật & Các nghiên cứu chuyên sâu' : '2. Academic Grounding & Core Research'}</h4>
                </div>
                <div className="pl-9.5 space-y-2 text-sm md:text-base text-stone-700">
                  <p>
                    {isVi
                      ? 'Để tìm câu trả lời mang tính hệ thống, Quỳnh Chi lựa chọn con đường nghiên cứu kinh tế và phát triển bền vững:'
                      : 'To seek systemic answers, Quynh Chi delved into development economics and sustainable value chains:'}
                  </p>
                  <ul className="space-y-2.5 list-none pt-1">
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
                      <span className="text-[#335C33] font-bold shrink-0">•</span>
                      <span>
                        <strong className="text-[#335C33]">
                          {isVi ? 'Dự án nghiên cứu C4F (Circular Credits for Farmers):' : 'Circular Credits for Farmers (C4F):'}
                        </strong>{' '}
                        {isVi
                          ? 'Tập trung phân tích sự bất cân xứng thể chế trong thị trường carbon, chứng minh nông dân nhỏ lẻ thường chịu thiệt thòi và đứng ngoài lợi ích của tín chỉ xanh.'
                          : 'Analyzed institutional asymmetries in carbon credit markets, revealing how smallholder farmers are often excluded from green dividends.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
                      <span className="text-[#335C33] font-bold shrink-0">•</span>
                      <span>
                        <strong className="text-[#335C33]">
                          {isVi ? 'Nghiên cứu truy xuất nguồn gốc QR-code:' : 'QR-Code Supply Traceability:'}
                        </strong>{' '}
                        {isVi
                          ? 'Khảo sát thực địa tại Đắk Lắk về tính minh bạch, xây dựng niềm tin giữa người tiêu dùng hiện đại và nông hộ bản địa.'
                          : 'Conducted field research in Dak Lak on transparency and rebuilding trust between conscious consumers and indigenous growers.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
                      <span className="text-[#335C33] font-bold shrink-0">•</span>
                      <span>
                        <strong className="text-[#335C33]">
                          {isVi ? 'Nghiên cứu Nhận thức PTBV & Hướng nghiệp ngành Cà phê (2024–2025):' : 'ESD & Sustainable Coffee Career Orientation (2024–2025):'}
                        </strong>{' '}
                        {isVi
                          ? 'Khảo sát 200 học sinh THPT tại Đắk Lắk, chỉ ra 80% học sinh ở mức nhận thức PTBV trung bình hoặc thấp (nông thôn chiếm 47%). Bằng mô hình hồi quy Binary Logistic (p < 0,001), nghiên cứu chứng minh nhận thức PTBV có tác động trực tiếp thúc đẩy xu hướng chọn nghề nghiệp xanh; từ đó kiến nghị chuyển giao giáo dục PTBV sang phát triển năng lực hành động gắn với chuỗi cà phê bản địa (chế biến sâu, thích ứng khí hậu và liên kết bền vững).'
                          : 'Surveyed 200 high school seniors in Dak Lak, revealing 80% held moderate-to-low sustainability awareness (47% in rural areas). Using Binary Logistic regression (p < 0.001), the study proved that ESD awareness strongly drives green career choices, advocating for action-oriented education tailored to Dak Lak’s deep-processing and climate-resilient coffee value chain.'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Story Section 3: Action */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#335C33] font-bold text-base md:text-lg">
                  <div className="w-7 h-7 rounded-lg bg-[#335C33]/10 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#335C33]" />
                  </div>
                  <h4>{isVi ? '3. Hiện thực hóa: Từ lý thuyết đến CAFLOOP' : '3. Real Action: From Theory to CAFLOOP'}</h4>
                </div>
                <p className="text-sm md:text-base text-stone-700 pl-9.5">
                  {isVi
                    ? 'Sự giao thoa giữa các đề tài nghiên cứu đã mở ra hướng đi rõ ràng: Thay vì dừng lại ở các bài báo học thuật, Quỳnh Chi chọn bắt đầu bằng hành động cụ thể từ điểm nhỏ nhất - tái chế phụ phẩm vỏ cà phê tại chính quê hương. CAFLOOP ra đời để hiện thực hóa triết lý: “From Husk To Hope” - biến thứ tưởng như phế bỏ thành trà Cascara thượng hạng, túi thơm thảo mộc và quà tặng thổ cẩm dệt tay của phụ nữ Ê Đê, qua đó gây quỹ giáo dục thiết thực cho học sinh vùng cao.'
                    : 'The intersection of these research streams led to a decisive conclusion: rather than confining solutions to academic papers, Quynh Chi chose tangible grassroots action. CAFLOOP was born to manifest the philosophy “From Husk To Hope” — turning coffee waste into gourmet Cascara tea, herbal sachets, and handcrafted Ê Đê textiles, directly funding educational resources for highland children.'}
                </p>
              </div>

              {/* Quote highlight */}
              <div className="p-5 rounded-2xl bg-[#8C5A35]/10 border-l-4 border-[#8C5A35] text-[#8C5A35]">
                <p className="font-serif italic text-base md:text-lg">
                  {isVi
                    ? '“CAFLOOP không chỉ là một dự án khởi nghiệp, mà là lời giải thực tế cho câu hỏi gắn bó từ thuở rời Tây Nguyên đi học.”'
                    : '“CAFLOOP is not just a startup, but a living answer to the question that accompanied me ever since I left the highlands.”'}
                </p>
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-600 mt-2">
                  - Phan Hoàng Quỳnh Chi
                </span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="px-6 py-4 md:px-8 border-t border-[#335C33]/10 bg-[#E5E9DF]/30 flex items-center justify-between">
              <span className="text-xs text-stone-500 hidden sm:inline">
                {isVi ? 'Cafloop • From Husk To Hope' : 'Cafloop • From Husk To Hope'}
              </span>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#335C33] text-[#F6F6EE] font-bold text-sm hover:bg-[#274827] transition-colors cursor-pointer ml-auto flex items-center justify-center gap-2"
              >
                <span>{isVi ? 'Đóng' : 'Close'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
