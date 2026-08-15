import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Plus, Minus, CheckCircle, Sparkles, Bike, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../utils/LanguageContext';

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
  const { t } = useLanguage();

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
            className="absolute top-4 right-4 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#E3EDD3] text-[#335C33] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#335C33] font-serif mb-2">
                {t('modalSuccessTitle')}
              </h3>
              <p className="text-xs text-[#2C2E2B]/80 leading-relaxed mb-5">
                {t('modalSuccessDesc', { quantity })}
              </p>
              
              <div className="bg-[#E3EDD3] rounded-2xl p-4 mb-5 text-left text-xs">
                <div className="flex items-center gap-2 font-bold text-[#335C33] mb-1">
                  <Bike className="w-4 h-4" />
                  <span>{t('modalSuccessDirectImpact')}</span>
                </div>
                <p className="text-[#8C5A35]">
                  {t('modalSuccessImpactDesc', { percent: quantity * 25 })}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs hover:bg-[#284828] transition-colors cursor-pointer"
              >
                {t('modalSuccessBtnDone')}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-[#8C5A35] text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t('modalFundraiseYear')}
              </div>
              <h3 className="text-xl font-bold text-[#335C33] font-serif mb-1">
                {t('modalPreorderTitle')}
              </h3>
              <p className="text-xs text-[#8C5A35] mb-4">
                {t('modalPreorderSub')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quantity Selector */}
                <div className="bg-[#E3EDD3]/70 rounded-2xl p-3.5 border border-[#335C33]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#335C33] text-[#E3EDD3] flex items-center justify-center">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#335C33]">{t('modalItemName')}</p>
                      <p className="text-[11px] text-[#8C5A35]">{t('modalItemPrice')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#F6F6EE] rounded-xl px-2 py-1 border border-[#335C33]/20">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-[#335C33] hover:bg-[#E3EDD3] rounded cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#335C33] w-4 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 text-[#335C33] hover:bg-[#E3EDD3] rounded cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#335C33] mb-1">
                      {t('modalFieldName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('modalFieldNamePlaceholder')}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#335C33] mb-1">
                      {t('modalFieldPhone')}
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('modalFieldPhonePlaceholder')}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#335C33] mb-1">
                      {t('modalFieldAddress')}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t('modalFieldAddressPlaceholder')}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33]"
                    />
                  </div>
                </div>

                {/* Total impact & price summary */}
                <div className="pt-2 flex items-center justify-between border-t border-[#335C33]/15">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#8C5A35]">{t('modalSummaryLabel')}</p>
                    <p className="text-base font-extrabold text-[#335C33]">
                      {totalPrice.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <span className="text-[10px] text-[#335C33] bg-[#E3EDD3] px-2 py-1 rounded-md font-semibold">
                    {t('modalFreeship')}
                  </span>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-[#335C33] text-[#F6F6EE] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#284828] transition-[background-color] duration-200 shadow-md cursor-pointer border border-transparent"
                >
                  <Heart className="w-4 h-4 fill-current text-[#E3EDD3]" />
                  <span>{t('modalBtnConfirm')}</span>
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
