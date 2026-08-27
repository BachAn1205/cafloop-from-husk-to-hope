import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, QrCode, CheckCircle, ChevronLeft, Loader2, Clock, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../utils/LanguageContext';
import { checkPaymentReceived, type SepayTransaction } from '../utils/sepay';
import { saveDonationToSupabase } from '../utils/supabaseDonation';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QR_TIMEOUT_SECONDS = 5 * 60; // 5 phút

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [countdown, setCountdown] = useState(QR_TIMEOUT_SECONDS);
  const [expired, setExpired] = useState(false);
  const { t, language } = useLanguage();

  // Lưu thời điểm bắt đầu phiên quét QR để chỉ nhận giao dịch MỚI
  const sessionStartedAt = useRef<Date | null>(null);
  // Tập hợp các ID giao dịch đã xử lý để tránh xử lý trùng
  const processedTxIds = useRef<Set<string>>(new Set());

  // MOCK BANK INFO
  const BANK_ID = 'mbbank';
  const ACCOUNT_NO = '2666627122005';
  const ACCOUNT_NAME = 'BACH KHANH AN';

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = amount ? parseInt(amount.replace(/\D/g, ''), 10) : 0;
    if (!numericAmount || numericAmount < 5000) {
      alert(language === 'vi' ? 'Vui lòng nhập số tiền hợp lệ (tối thiểu 5.000đ)' : 'Please enter a valid amount (min 5,000 VND)');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) {
      alert(language === 'vi' ? 'Vui lòng nhập số điện thoại hợp lệ (đủ 10 chữ số, bắt đầu bằng 0)' : 'Please enter a valid 10-digit phone number starting with 0');
      return;
    }
    setStep('qr');
    setCountdown(QR_TIMEOUT_SECONDS);
    setExpired(false);
    // Ghi nhận thời điểm bắt đầu phiên QR để lọc giao dịch
    sessionStartedAt.current = new Date();
    processedTxIds.current = new Set();
  };

  // ⏳ Đồng hồ đếm ngược 5 phút khi đang ở bước QR
  useEffect(() => {
    if (step !== 'qr') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Khi hết giờ → tự động về form sau 3 giây
  useEffect(() => {
    if (!expired) return;
    const timeout = setTimeout(() => {
      handleBackToForm();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [expired]);

  // Tự động kiểm tra giao dịch tiền vào từ SePay khi ở màn hình quét QR
  useEffect(() => {
    if (step !== 'qr' || expired) return;

    const rawAmount = amount ? parseInt(amount.replace(/\D/g, ''), 10) : 0;
    const interval = setInterval(async () => {
      try {
        const tx = await checkPaymentReceived(
          rawAmount,
          phone,
          name,
          sessionStartedAt.current ?? new Date()
        );
        if (tx && !processedTxIds.current.has(String(tx.id))) {
          processedTxIds.current.add(String(tx.id));
          clearInterval(interval);
          handleDone(tx);
        }
      } catch (err) {
        console.error('Lỗi tự động kiểm tra SePay:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, amount, phone, name, expired]);

  const handleDone = (tx: SepayTransaction) => {
    const rawAmount = amount ? parseInt(amount.replace(/\D/g, ''), 10) : 0;

    // Tự động lưu khoản quyên góp vào Database Supabase (chỉ khi có giao dịch thật)
    saveDonationToSupabase({
      name,
      phone,
      amount: rawAmount,
      sepayTransaction: tx,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#335C33', '#8C5A35', '#E3EDD3'],
      });
    } catch {
      // fallback
    }
    setStep('success');
  };

  const handleBackToForm = () => {
    setStep('form');
    setExpired(false);
    setCountdown(QR_TIMEOUT_SECONDS);
    sessionStartedAt.current = null;
    processedTxIds.current = new Set();
  };

  const handleReset = () => {
    setStep('form');
    setName('');
    setPhone('');
    setAmount('');
    setExpired(false);
    setCountdown(QR_TIMEOUT_SECONDS);
    onClose();
  };

  const formatCurrency = (val: string) => {
    const number = val.replace(/\D/g, '');
    return number ? parseInt(number, 10).toLocaleString('vi-VN') : '';
  };

  // Format mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const rawAmount = amount ? parseInt(amount.replace(/\D/g, ''), 10) : 0;
  
  // VietQR URL Generate (qr_only template removes top logo & bottom footer)
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${rawAmount}&addInfo=${encodeURIComponent(
    `CAF ${phone} ${name || 'Nha Hao Tam'}`
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Màu đếm ngược: đỏ khi < 60s, vàng khi < 120s, xanh đậm trên nền trắng còn lại
  const countdownColor =
    countdown < 60
      ? 'text-white border-red-600 bg-red-600'
      : countdown < 120
      ? 'text-white border-amber-600 bg-amber-600'
      : 'text-[#F6F6EE] border-[#335C33] bg-[#335C33]';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-[420px] md:max-w-md bg-[#F6F6EE] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#335C33]/20 max-h-[90vh] overflow-y-auto"
        >
          {step === 'form' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-5 md:right-5 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {step === 'qr' && (
            <button
              onClick={handleBackToForm}
              className="absolute top-4 left-4 md:top-5 md:left-5 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {step === 'success' ? (
            <div className="text-center py-6 md:py-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#E3EDD3] text-[#335C33] flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-sm">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#335C33] font-serif mb-2 md:mb-3">
                {language === 'vi' ? 'Cảm ơn bạn!' : 'Thank you!'}
              </h3>
              <p className="text-xs md:text-sm text-[#2C2E2B]/80 leading-relaxed mb-6 px-2">
                {language === 'vi' 
                  ? 'Số tiền quyên góp của bạn sẽ được chuyển thành học bổng và trang thiết bị cho các em học sinh vùng cao.'
                  : 'Your donation will be transformed into scholarships and equipment for students in the highlands.'}
              </p>
              
              <button
                onClick={handleReset}
                className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs md:text-sm hover:bg-[#284828] transition-colors cursor-pointer shadow-md"
              >
                {language === 'vi' ? 'Trở về trang chủ' : 'Back to Home'}
              </button>
            </div>
          ) : step === 'qr' ? (
            <div className="text-center py-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#335C33] font-serif mb-2 mt-4 md:mt-2">
                {t('donateQRTitle')}
              </h3>
              <p className="text-xs md:text-sm text-[#8C5A35] mb-4">
                {t('donateQRSub')}
              </p>

              {/* Trạng thái polling hoặc hết giờ */}
              {expired ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-xs text-red-700 font-semibold bg-red-50 py-2 px-4 rounded-full mb-4 mx-auto w-max border border-red-200"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {language === 'vi'
                      ? 'Phiên đã hết hạn! Đang quay lại...'
                      : 'Session expired! Returning...'}
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-[#335C33] font-medium bg-[#E3EDD3]/60 py-1.5 px-3 rounded-full mb-4 mx-auto w-max border border-[#335C33]/15">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#335C33]" />
                  <span>{language === 'vi' ? 'Hệ thống đang tự động kiểm tra giao dịch...' : 'Checking transaction status...'}</span>
                </div>
              )}

              {/* QR Code */}
              <div className={`bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-md border mb-5 inline-block transition-all duration-300 ${expired ? 'opacity-40 grayscale' : 'border-[#335C33]/15'}`}>
                <img src={qrUrl} alt="VietQR" className="w-60 h-60 md:w-72 md:h-72 object-contain" />
              </div>

              {/* Bank Info */}
              <div className="bg-[#E3EDD3]/50 rounded-xl p-3 md:p-4 mb-5 text-left border border-[#335C33]/10">
                <div className="flex justify-between mb-1.5 text-xs md:text-sm">
                  <span className="text-[#2C2E2B]/70">{language === 'vi' ? 'Chủ TK:' : 'Account:'}</span>
                  <span className="font-bold text-[#335C33]">{ACCOUNT_NAME}</span>
                </div>
                <div className="flex justify-between mb-1.5 text-xs md:text-sm">
                  <span className="text-[#2C2E2B]/70">{language === 'vi' ? 'Số TK:' : 'Account No:'}</span>
                  <span className="font-bold text-[#335C33]">{ACCOUNT_NO}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm border-t border-[#335C33]/10 pt-1.5 mt-1.5">
                  <span className="text-[#2C2E2B]/70">{language === 'vi' ? 'Số tiền:' : 'Amount:'}</span>
                  <span className="font-bold text-[#8C5A35]">{rawAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* ⏳ Đồng hồ đếm ngược */}
              <div className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border font-mono font-bold text-sm transition-all duration-500 ${countdownColor}`}>
                <Clock className="w-4 h-4" />
                <span>
                  {expired
                    ? (language === 'vi' ? 'Phiên đã hết hạn' : 'Session expired')
                    : (language === 'vi'
                        ? `Mã QR hết hạn sau ${formatCountdown(countdown)}`
                        : `QR expires in ${formatCountdown(countdown)}`)}
                </span>
              </div>

              {/* Nút huỷ nhỏ */}
              <button
                onClick={handleBackToForm}
                className="mt-4 text-xs text-[#335C33]/60 hover:text-[#335C33] font-medium transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Huỷ & nhập lại thông tin' : 'Cancel & re-enter info'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-[#8C5A35] text-xs md:text-sm font-semibold uppercase tracking-wider mb-1 md:mb-1.5">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {t('modalFundraiseYear')}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#335C33] font-serif mb-1.5">
                {t('donateModalTitle')}
              </h3>
              <p className="text-xs md:text-sm text-[#8C5A35] mb-6">
                {t('donateModalSub')}
              </p>

              <form onSubmit={handleNext} className="space-y-4 md:space-y-5">
                <div className="space-y-3 md:space-y-4">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-[#335C33] mb-1.5 md:mb-2 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8C5A35]" />
                      {t('donateFieldAmount')}
                    </label>
                    <div className="relative mb-2 md:mb-3">
                      <input
                        type="text"
                        required
                        value={amount}
                        onChange={(e) => setAmount(formatCurrency(e.target.value))}
                        placeholder={t('donateFieldAmountPlaceholder')}
                        className="w-full text-base md:text-lg font-bold text-[#335C33] px-3.5 py-3 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl bg-[#F6F6EE] border-2 border-[#335C33]/20 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C5A35] font-bold">VNĐ</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((qAmount) => (
                        <button
                          key={qAmount}
                          type="button"
                          onClick={() => setAmount(qAmount.toLocaleString('vi-VN'))}
                          className="flex-1 py-1.5 md:py-2 text-[11px] md:text-xs font-semibold rounded-lg border border-[#335C33]/15 bg-[#E3EDD3]/50 text-[#335C33] hover:bg-[#E3EDD3] transition-colors"
                        >
                          {qAmount.toLocaleString('vi-VN')}đ
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-[#335C33] mb-1 md:mb-1.5">
                      {t('modalFieldName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('modalFieldNamePlaceholder')}
                      className="w-full text-xs md:text-sm px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-[#335C33] mb-1 md:mb-1.5">
                      {language === 'vi' ? 'Số điện thoại người gửi' : 'Sender phone number'}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder={t('modalFieldPhonePlaceholder')}
                      className="w-full text-xs md:text-sm px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-[#284828] transition-[background-color] duration-200 shadow-md cursor-pointer border border-transparent mt-4 md:mt-6"
                >
                  <QrCode className="w-4 h-4 md:w-5 md:h-5 text-[#E3EDD3]" />
                  <span>{t('donateBtnNext')}</span>
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
