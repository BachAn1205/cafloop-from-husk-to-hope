import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Plus, Minus, CheckCircle, Sparkles, Bike, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreorderModal({ isOpen, onClose }: PreorderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const pricePerUnit = 150000;
  const totalPrice = quantity * pricePerUnit;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#335C33', '#8C5A35', '#E3EDD3'],
      });
    } catch {
      // safe fallback
    }
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setQuantity(1);
    setName('');
    setPhone('');
    setAddress('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-[420px] bg-[#F6F6EE] rounded-3xl p-6 shadow-2xl border border-[#335C33]/20 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#E3EDD3] text-[#335C33] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#335C33] font-serif mb-2">
                Cảm Ơn Tấm Lòng Của Bạn!
              </h3>
              <p className="text-xs text-[#2C2E2B]/80 leading-relaxed mb-5">
                Thông tin ủng hộ {quantity} Hộp Trà Cascara CAFLOOP đã được ghi nhận. Đội ngũ điều phối dự án sẽ liên hệ bạn sớm để gửi trao hộp trà gây quỹ.
              </p>
              
              <div className="bg-[#E3EDD3] rounded-2xl p-4 mb-5 text-left text-xs">
                <div className="flex items-center gap-2 font-bold text-[#335C33] mb-1">
                  <Bike className="w-4 h-4" />
                  <span>Tác Động Trực Tiếp Của Bạn</span>
                </div>
                <p className="text-[#8C5A35]">
                  Đóng góp của bạn tương đương hỗ trợ {quantity * 25}% chi phí một chiếc xe đạp mới cho học sinh vùng cao.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs hover:bg-[#284828] transition-colors"
              >
                Hoàn tất & Quay lại trang
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-[#8C5A35] text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gây Quỹ Giáo Dục 2026
              </div>
              <h3 className="text-xl font-bold text-[#335C33] font-serif mb-1">
                Nhận Trà Cascara Gây Quỹ
              </h3>
              <p className="text-xs text-[#8C5A35] mb-4">
                100% lợi nhuận chuyển đổi thành xe đạp và trang thiết bị học tập.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quantity Selector */}
                <div className="bg-[#E3EDD3]/70 rounded-2xl p-3.5 border border-[#335C33]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#335C33] text-[#E3EDD3] flex items-center justify-center">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#335C33]">Hộp Trà Cascara (100g)</p>
                      <p className="text-[11px] text-[#8C5A35]">150.000đ / hộp</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#F6F6EE] rounded-xl px-2 py-1 border border-[#335C33]/20">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-[#335C33] hover:bg-[#E3EDD3] rounded"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#335C33] w-4 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 text-[#335C33] hover:bg-[#E3EDD3] rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#335C33] mb-1">
                      Họ và tên của bạn
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#335C33] mb-1">
                      Số điện thoại nhận hàng
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0912 345 678"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#335C33] mb-1">
                      Địa chỉ nhận trà
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Địa chỉ giao hàng nhận trà gây quỹ"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33]"
                    />
                  </div>
                </div>

                {/* Total impact & price summary */}
                <div className="pt-2 flex items-center justify-between border-t border-[#335C33]/15">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#8C5A35]">Tổng tiền ủng hộ</p>
                    <p className="text-base font-extrabold text-[#335C33]">
                      {totalPrice.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <span className="text-[10px] text-[#335C33] bg-[#E3EDD3] px-2 py-1 rounded-md font-semibold">
                    Freeship toàn quốc
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#335C33] text-[#F6F6EE] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#284828] active:scale-[0.98] transition-all shadow-md"
                >
                  <Heart className="w-4 h-4 fill-current text-[#E3EDD3]" />
                  <span>Xác Nhận Ủng Hộ & Nhận Trà</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
