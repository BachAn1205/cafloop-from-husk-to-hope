import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, CheckCircle, Sparkles, Bike, PackageCheck, QrCode, ChevronLeft, Loader2, Clock, AlertTriangle, MapPin, Maximize2, Check, PlusCircle, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../utils/LanguageContext';
import { saveOrderToSupabase, PRODUCTS_LIST, fetchProductsFromSupabase, type ProductItem } from '../utils/supabaseDonation';
import { checkPaymentReceived, generatePaymentCode, QR_TIMEOUT_SECONDS, type SepayTransaction } from '../utils/sepay';
import { AddAddressModal, type SavedAddress } from './AddAddressModal';

interface PreorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Tạo/lấy Session ID ẩn danh (per-browser-session) để tách địa chỉ của từng người dùng.
 * Dùng sessionStorage để ID tự hết hạn khi đóng tab, tránh dữ liệu stale lâu dài.
 */
function getSessionId(): string {
  const key = 'cafloop_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function PreorderModal({ isOpen, onClose }: PreorderModalProps) {
  // Key localStorage riêng biệt cho từng phiên trình duyệt (tránh chia sẻ địa chỉ giữa người dùng khác nhau)
  const addressKey = `cafloop_saved_addresses_${getSessionId()}`;
  // Products list from database
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS_LIST);

  // Cart state: { [sku]: quantity }
  const [cart, setCart] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr'>('qr');
  const [orderCode, setOrderCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch products from database when modal opens
  useEffect(() => {
    if (!isOpen) return;
    fetchProductsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setProductsList(data);
      }
    });
  }, [isOpen]);

  // Address management state — scoped to current session ID
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem(addressKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(addressKey);
      if (stored) {
        const arr = JSON.parse(stored);
        if (arr.length > 0) return arr[0].id;
      }
    } catch {
      // safe fallback
    }
    return null;
  });

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(null);

  // Workflow steps: 'form' | 'qr' | 'success'
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [countdown, setCountdown] = useState(QR_TIMEOUT_SECONDS);
  const [expired, setExpired] = useState(false);
  const { t, language } = useLanguage();

  const PRODUCT_TRANSLATIONS_EN: Record<string, { name: string; description: string; unit: string }> = {
    'CASCARA-ZIP-50G': {
      name: 'Cascara Coffee Husk Tea - Zip Bag (50g)',
      description: 'Light fruity notes, low caffeine.',
      unit: 'bag',
    },
    'CASCARA-ZIP-100G': {
      name: 'Cascara Coffee Husk Tea - Zip Bag (100g)',
      description: 'Light fruity notes, low caffeine.',
      unit: 'bag',
    },
    'CASCARA-JAR-50G': {
      name: 'Cascara Coffee Husk Tea - Plastic Jar (50g)',
      description: 'Light fruity notes, low caffeine.',
      unit: 'jar',
    },
    'CASCARA-JAR-100G': {
      name: 'Cascara Coffee Husk Tea - Plastic Jar (100g)',
      description: 'Light fruity notes, low caffeine.',
      unit: 'jar',
    },
    'GIFT-BROCADE': {
      name: 'Central Highlands Brocade Bag',
      description: 'Handmade - Durable, convenient - Rich ethnic cultural identity.',
      unit: 'bag',
    },
    'GIFT-SCENT': {
      name: 'Aroma Coffee Scent Sachet',
      description: 'Natural aroma - Odor eliminating - Ideal for car, closet & decor.',
      unit: 'bag',
    },
    'COMBO-130K': {
      name: '130k Gift Combo',
      description: 'Includes: Cascara tea jar + Coffee scent sachet.',
      unit: 'combo',
    },
    'COMBO-250K': {
      name: '250k Gift Combo',
      description: 'Includes: Cascara tea jar + Coffee scent sachet + Brocade bag.',
      unit: 'combo',
    },
  };

  const getProductDisplay = (prod: ProductItem) => {
    if (language === 'en' && PRODUCT_TRANSLATIONS_EN[prod.sku]) {
      return PRODUCT_TRANSLATIONS_EN[prod.sku];
    }
    return {
      name: prod.name,
      description: prod.description,
      unit: prod.unit,
    };
  };

  const sessionStartedAt = useRef<Date | null>(null);
  const processedTxIds = useRef<Set<string>>(new Set());

  // MOCK BANK INFO
  const BANK_ID = 'mbbank';
  const ACCOUNT_NO = '0972582580';
  const ACCOUNT_NAME = 'PHAN HOANG QUYNH CHI';

  // Save addresses to localStorage (scoped to session)
  useEffect(() => {
    try {
      localStorage.setItem(addressKey, JSON.stringify(savedAddresses));
    } catch (e) {
      console.error('Failed to save addresses to localStorage', e);
    }
  }, [savedAddresses, addressKey]);

  // Derived totals
  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const totalPrice = Object.entries(cart).reduce((sum, [sku, qty]) => {
    const prod = productsList.find((p) => p.sku === sku);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId) || null;

  const updateCartQuantity = (sku: string, delta: number) => {
    setCart((prev) => {
      const current = prev[sku] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[sku];
        return copy;
      }
      return { ...prev, [sku]: next };
    });
  };

  const handleSaveAddress = (newAddr: SavedAddress) => {
    setSavedAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id);
    setIsAddAddressOpen(false);
  };

  const handleDeleteAddress = (idStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAddresses((prev) => prev.filter((a) => a.id !== idStr));
    if (selectedAddressId === idStr) {
      const remaining = savedAddresses.filter((a) => a.id !== idStr);
      setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();

    if (totalItemsCount === 0 || totalPrice === 0) {
      alert(language === 'vi' ? 'Vui lòng chọn số lượng cho ít nhất 1 sản phẩm' : 'Please select quantity for at least 1 product');
      return;
    }

    if (!selectedAddress) {
      alert(language === 'vi' ? 'Vui lòng thêm hoặc chọn 1 địa chỉ nhận hàng' : 'Please add or select a shipping address');
      return;
    }

    const generatedCode = generatePaymentCode('ORDER');
    setOrderCode(generatedCode);

    if (paymentMethod === 'cod') {
      handleDone(selectedAddress, undefined, generatedCode);
      return;
    }

    setStep('qr');
    setCountdown(QR_TIMEOUT_SECONDS);
    setExpired(false);
    sessionStartedAt.current = new Date();
    processedTxIds.current = new Set();
  };

  // Timer logic for QR
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

  // Auto return to form when expired
  useEffect(() => {
    if (!expired) return;
    const timeout = setTimeout(() => {
      handleBackToForm();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [expired]);

  // Auto check SePay polling (Bảo mật: Khớp chính xác mã đơn orderCode & số tiền)
  useEffect(() => {
    if (step !== 'qr' || expired || !selectedAddress || !orderCode) return;

    const interval = setInterval(async () => {
      try {
        const tx = await checkPaymentReceived(
          totalPrice,
          orderCode,
          sessionStartedAt.current ?? new Date()
        );
        if (tx && !processedTxIds.current.has(String(tx.id))) {
          processedTxIds.current.add(String(tx.id));
          clearInterval(interval);
          handleDone(selectedAddress, tx, orderCode);
        }
      } catch (err) {
        console.error('Lỗi tự động kiểm tra SePay:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, totalPrice, selectedAddress, expired, orderCode]);

  const handleDone = (addr = selectedAddress, _tx?: SepayTransaction, codeToUse?: string) => {
    if (!addr || isSubmitting) return;
    setIsSubmitting(true);

    const finalOrderCode = codeToUse || orderCode || generatePaymentCode('ORDER');

    const items = Object.entries(cart).map(([sku, qty]) => {
      const p = productsList.find((item) => item.sku === sku);
      return {
        sku,
        name: p ? p.name : sku,
        quantity: qty,
        unitPrice: p ? p.price : 0,
      };
    });

    saveOrderToSupabase({
      name: addr.name,
      phone: addr.phone,
      address: addr.fullAddress,
      totalAmount: totalPrice,
      orderCode: finalOrderCode,
      sepayTransaction: _tx,
      items,
    }).finally(() => {
      setIsSubmitting(false);
    });

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#335C33', '#8C5A35', '#E3EDD3'],
      });
    } catch {
      // safe fallback
    }
    setStep('success');
  };

  const handleBackToForm = () => {
    setStep('form');
    setExpired(false);
    setCountdown(QR_TIMEOUT_SECONDS);
    setOrderCode('');
    sessionStartedAt.current = null;
    processedTxIds.current = new Set();
  };

  const handleReset = () => {
    setStep('form');
    setCart({});
    setOrderCode('');
    setPaymentMethod('qr');
    setExpired(false);
    setCountdown(QR_TIMEOUT_SECONDS);
    onClose();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${totalPrice}&addInfo=${encodeURIComponent(
    orderCode
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const countdownColor =
    countdown < 60
      ? 'text-white border-red-600 bg-red-600'
      : countdown < 120
      ? 'text-white border-amber-600 bg-amber-600'
      : 'text-[#F6F6EE] border-[#335C33] bg-[#335C33]';

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 md:p-6">
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
            className={`relative z-10 w-full ${
              step === 'form' ? 'max-w-[480px] md:max-w-3xl lg:max-w-4xl' : 'max-w-[460px] md:max-w-xl'
            } bg-[#F6F6EE] rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border border-[#335C33]/20 max-h-[92vh] overflow-y-auto`}
          >
            {step === 'form' && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-5 md:right-5 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors cursor-pointer shadow-xs z-10"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}

            {step === 'qr' && (
              <button
                onClick={handleBackToForm}
                className="absolute top-4 left-4 md:top-5 md:left-5 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors cursor-pointer shadow-xs z-10"
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
                  {t('modalSuccessTitle')}
                </h3>
                <p className="text-xs md:text-sm text-[#2C2E2B]/80 leading-relaxed mb-4 px-2">
                  {language === 'vi' ? (
                    <>
                      Đã nhận đơn hàng gồm <strong className="text-[#335C33]">{totalItemsCount} sản phẩm</strong> của khách hàng <strong className="text-[#335C33]">{selectedAddress?.name}</strong>.
                    </>
                  ) : (
                    <>
                      Order received with <strong className="text-[#335C33]">{totalItemsCount} item(s)</strong> for customer <strong className="text-[#335C33]">{selectedAddress?.name}</strong>.
                    </>
                  )}
                </p>

                <div className="bg-[#E3EDD3] rounded-2xl p-4 md:p-5 mb-5 md:mb-6 text-left text-xs md:text-sm border border-[#335C33]/10">
                  <div className="flex items-center gap-2 font-bold text-[#335C33] mb-1.5">
                    <Bike className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{t('modalSuccessDirectImpact')}</span>
                  </div>
                  <p className="text-[#8C5A35]">
                    {language === 'vi'
                      ? '100% lợi nhuận từ đơn hàng sẽ chuyển thành xe đạp và thiết bị học tập cho các em nhỏ vùng cao.'
                      : '100% of profits from this order will be converted into bicycles and learning equipment for highland children.'}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs md:text-sm hover:bg-[#284828] transition-colors cursor-pointer shadow-md"
                >
                  {t('modalSuccessBtnDone')}
                </button>
              </div>
            ) : step === 'qr' ? (
              <div className="text-center py-2">
                <h3 className="text-xl md:text-2xl font-bold text-[#335C33] font-serif mb-2 mt-4 md:mt-2">
                  {language === 'vi' ? 'Thanh Toán Đơn Hàng' : 'Order Payment'}
                </h3>
                <p className="text-xs md:text-sm text-[#8C5A35] mb-4">
                  {language === 'vi'
                    ? 'Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới'
                    : 'Use your mobile banking app to scan the QR code below'}
                </p>

                {expired ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-xs text-red-700 font-semibold bg-red-50 py-2 px-4 rounded-full mb-4 mx-auto w-max border border-red-200"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Phiên đã hết hạn! Đang quay lại...' : 'Session expired! Returning...'}</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#335C33] font-medium bg-[#E3EDD3]/60 py-1.5 px-3 rounded-full mb-4 mx-auto w-max border border-[#335C33]/15">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#335C33]" />
                    <span>{language === 'vi' ? 'Hệ thống đang tự động kiểm tra thanh toán...' : 'Automatically verifying payment...'}</span>
                  </div>
                )}

                <div className={`bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-md border mb-5 inline-block transition-all duration-300 ${expired ? 'opacity-40 grayscale' : 'border-[#335C33]/15'}`}>
                  <img src={qrUrl} alt="VietQR" className="w-60 h-60 md:w-72 md:h-72 object-contain" />
                </div>

                <div className="bg-[#E3EDD3]/50 rounded-xl p-3 md:p-4 mb-5 text-left border border-[#335C33]/10">
                  <div className="flex justify-between mb-1.5 text-xs md:text-sm">
                    <span className="text-[#2C2E2B]/70">{language === 'vi' ? 'Chủ TK:' : 'Account Name:'}</span>
                    <span className="font-bold text-[#335C33]">{ACCOUNT_NAME}</span>
                  </div>
                  <div className="flex justify-between mb-1.5 text-xs md:text-sm">
                    <span className="text-[#2C2E2B]/70">{language === 'vi' ? 'Số TK:' : 'Account No:'}</span>
                    <span className="font-bold text-[#335C33]">{ACCOUNT_NO}</span>
                  </div>
                  <div className="flex justify-between mb-1.5 text-xs md:text-sm items-center">
                    <span className="text-[#2C2E2B]/70">{language === 'vi' ? 'Nội dung CK:' : 'Transfer Memo:'}</span>
                    <span className="font-mono font-bold text-[#8C5A35] bg-white px-2 py-0.5 rounded border border-[#8C5A35]/30">
                      {orderCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm border-t border-[#335C33]/10 pt-1.5 mt-1.5">
                    <span className="text-[#2C2E2B]/70">
                      {language === 'vi' ? `Tổng tiền (${totalItemsCount} món):` : `Total amount (${totalItemsCount} items):`}
                    </span>
                    <span className="font-bold text-[#8C5A35]">{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <div className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border font-bold text-sm transition-all duration-500 ${countdownColor}`}>
                  <Clock className="w-4 h-4" />
                  <span>
                    {expired
                      ? (language === 'vi' ? 'Phiên đã hết hạn' : 'Session expired')
                      : (language === 'vi' ? `Mã QR hết hạn sau ${formatCountdown(countdown)}` : `QR expires in ${formatCountdown(countdown)}`)}
                  </span>
                </div>

                <button
                  onClick={handleBackToForm}
                  className="mt-4 text-xs text-[#335C33]/60 hover:text-[#335C33] font-medium transition-colors cursor-pointer block mx-auto"
                >
                  {language === 'vi' ? 'Huỷ & chỉnh sửa giỏ hàng' : 'Cancel & edit cart'}
                </button>
              </div>
            ) : (
              <div>
                <div className="section-badge mb-2">
                  <Sparkles className="text-[#8C5A35]" />
                  <span>{t('modalFundraiseYear')}</span>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#335C33] font-serif mb-1">
                  {language === 'vi' ? 'Đặt Hàng Sản Phẩm Tuần Hoàn' : 'Order Circular Products'}
                </h3>
                <p className="text-xs md:text-sm text-[#8C5A35] mb-5">
                  {language === 'vi'
                    ? 'Chọn sản phẩm, số lượng và địa chỉ để ủng hộ dự án CAFLOOP'
                    : 'Select products, quantity and shipping address to support CAFLOOP project'}
                </p>

                <form onSubmit={handleNext}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
                    
                    {/* LEFT COLUMN: Multi-Product List (7 cols on desktop) */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="flex justify-between items-center pb-1.5 border-b border-[#335C33]/15">
                        <label className="text-xs md:text-sm font-bold text-[#335C33] flex items-center gap-1.5">
                          <PackageCheck className="w-4 h-4 text-[#8C5A35]" />
                          {language === 'vi' ? 'Danh Sách Sản Phẩm' : 'Product List'}
                        </label>
                        <span className="text-[11px] md:text-xs font-semibold text-[#8C5A35] bg-[#E3EDD3] px-2.5 py-0.5 rounded-full">
                          {language === 'vi' ? (
                            <>Đã chọn <strong className="text-[#335C33]">{totalItemsCount}</strong> món</>
                          ) : (
                            <>Selected <strong className="text-[#335C33]">{totalItemsCount}</strong> item(s)</>
                          )}
                        </span>
                      </div>

                      <div className="space-y-2.5 md:h-[540px] md:max-h-[540px] md:overflow-y-auto md:pr-2 overscroll-contain transform-gpu [will-change:scroll-position]">
                        {productsList.map((prod) => {
                          const display = getProductDisplay(prod);
                          const qty = cart[prod.sku] || 0;
                          const isSelected = qty > 0;
                          return (
                            <div
                              key={prod.sku}
                              className={`p-2.5 md:p-3 rounded-2xl border-2 transition-[border-color,background-color,box-shadow] duration-150 flex items-center justify-between gap-3 transform-gpu ${
                                isSelected
                                  ? 'bg-white border-[#527E52] shadow-xs ring-1 ring-[#527E52]/20'
                                  : 'bg-[#F4F6EE] border-[#335C33]/15 hover:border-[#527E52]/40'
                              }`}
                            >
                              {/* Product Thumbnail & Lightbox trigger */}
                              <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => setPreviewProduct(prod)}>
                                <img
                                  src={prod.image}
                                  alt={display.name}
                                  className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border border-black/10 bg-white"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <Maximize2 className="w-4 h-4" />
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs md:text-sm font-bold text-[#335C33] line-clamp-1">
                                  {display.name}
                                </h4>
                                <p className="text-[10px] md:text-xs text-[#8C5A35] line-clamp-1 mt-0.5">
                                  {display.description}
                                </p>
                                <div className="text-xs md:text-sm font-bold text-[#335C33] mt-1 flex items-baseline gap-1.5">
                                  <span className="text-sm md:text-base font-extrabold text-[#335C33]">{prod.price.toLocaleString('vi-VN')}đ</span>
                                  <span className="text-xs md:text-sm font-bold text-[#8C5A35]">/ {display.unit}</span>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1.5 bg-[#F6F6EE] p-1 rounded-xl border border-[#527E52]/25 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(prod.sku, -1)}
                                  disabled={qty === 0}
                                  className={`p-1 rounded-lg transition-colors ${
                                    qty > 0
                                      ? 'bg-[#527E52] text-white hover:bg-[#436943] cursor-pointer'
                                      : 'text-gray-400 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs md:text-sm font-bold text-[#527E52] w-6 text-center">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(prod.sku, 1)}
                                  className="p-1 rounded-lg bg-[#527E52] text-white hover:bg-[#436943] transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Address, Summary & Payment (5 cols on desktop) */}
                    <div className="md:col-span-5 md:h-[540px] flex flex-col justify-between bg-[#E3EDD3]/35 p-4 md:p-5 rounded-2xl border border-[#335C33]/15 space-y-4">
                      
                      {/* Saved Address Selector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs md:text-sm font-bold text-[#335C33] flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#8C5A35]" />
                            {language === 'vi' ? 'Địa Chỉ Nhận Hàng' : 'Shipping Address'}
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddAddressOpen(true)}
                            className="text-[11px] md:text-xs font-bold text-[#335C33] hover:text-[#284828] flex items-center gap-1 bg-[#E3EDD3] px-2.5 py-1 rounded-lg hover:bg-[#d6e3c2] transition-colors cursor-pointer shadow-2xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{language === 'vi' ? 'Thêm mới' : 'Add new'}</span>
                          </button>
                        </div>

                        {savedAddresses.length === 0 ? (
                          <div
                            onClick={() => setIsAddAddressOpen(true)}
                            className="p-3.5 rounded-xl border-2 border-dashed border-[#335C33]/30 bg-white/70 text-center cursor-pointer hover:bg-white transition-colors"
                          >
                            <p className="text-xs font-semibold text-[#8C5A35]">
                              {language === 'vi' ? 'Chưa có địa chỉ nào được lưu.' : 'No saved addresses yet.'}
                            </p>
                            <p className="text-[11px] text-[#335C33] font-bold mt-0.5">
                              {language === 'vi' ? '+ Bấm vào đây để thêm địa chỉ giao hàng' : '+ Click here to add shipping address'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 md:max-h-44 overflow-y-auto pr-1 overscroll-contain transform-gpu [will-change:scroll-position]">
                            {savedAddresses.map((addr) => {
                              const isSelected = addr.id === selectedAddressId;
                              return (
                                <div
                                  key={addr.id}
                                  onClick={() => setSelectedAddressId(addr.id)}
                                  className={`p-2.5 rounded-xl border-2 transition-[border-color,background-color,box-shadow] duration-150 cursor-pointer flex items-start justify-between gap-2 transform-gpu ${
                                    isSelected
                                      ? 'bg-white border-[#527E52] shadow-xs ring-1 ring-[#527E52]/20'
                                      : 'bg-white/60 border-[#335C33]/15 hover:border-[#527E52]/40'
                                  }`}
                                >
                                  <div className="flex items-start gap-2 min-w-0">
                                    <div
                                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                        isSelected
                                          ? 'border-[#527E52] bg-[#527E52] text-white'
                                          : 'border-gray-400'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <div className="text-xs min-w-0">
                                      <p className="font-bold text-[#335C33] truncate">
                                        {addr.name} <span className="text-gray-600 font-medium">({addr.phone})</span>
                                      </p>
                                      <p className="text-[#8C5A35] text-[11px] mt-0.5 line-clamp-2">
                                        {addr.fullAddress}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteAddress(addr.id, e)}
                                    className="text-gray-400 hover:text-red-600 p-1 transition-colors shrink-0"
                                    title={language === 'vi' ? 'Xóa địa chỉ' : 'Delete address'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Total Price Summary */}
                      <div className="pt-3 border-t border-[#335C33]/15 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] md:text-xs uppercase font-bold text-[#8C5A35]">
                            {language === 'vi' ? `Tổng tiền (${totalItemsCount} món)` : `Total (${totalItemsCount} items)`}
                          </p>
                          <p className="text-lg md:text-2xl font-extrabold text-[#335C33]">
                            {totalPrice.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                        <span className="text-[10px] md:text-xs text-[#335C33] bg-white px-2.5 py-1 rounded-md font-semibold border border-[#335C33]/10 shadow-2xs">
                          {t('modalFreeship')}
                        </span>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="pt-2 border-t border-[#335C33]/15">
                        <label className="block text-xs font-semibold text-[#335C33] mb-1.5">
                          {language === 'vi' ? 'Phương thức thanh toán' : 'Payment Method'}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('qr')}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              paymentMethod === 'qr'
                                ? 'bg-[#335C33] text-white border-[#335C33] shadow-xs'
                                : 'bg-white text-[#8C5A35] border-[#335C33]/20 hover:bg-[#E3EDD3]'
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{language === 'vi' ? 'Chuyển khoản QR' : 'QR Bank Transfer'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              paymentMethod === 'cod'
                                ? 'bg-[#335C33] text-white border-[#335C33] shadow-xs'
                                : 'bg-white text-[#8C5A35] border-[#335C33]/20 hover:bg-[#E3EDD3]'
                            }`}
                          >
                            <PackageCheck className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{language === 'vi' ? 'Thanh toán COD' : 'COD Payment'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        disabled={totalItemsCount === 0 || !selectedAddressId}
                        whileHover={{ scale: totalItemsCount > 0 && selectedAddressId ? 1.02 : 1 }}
                        whileTap={{ scale: totalItemsCount > 0 && selectedAddressId ? 0.98 : 1 }}
                        className={`w-full py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md border border-transparent mt-2 ${
                          totalItemsCount > 0 && selectedAddressId
                            ? 'bg-[#335C33] text-[#F6F6EE] hover:bg-[#284828] cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                        }`}
                      >
                        {paymentMethod === 'qr' ? (
                          <>
                            <QrCode className="w-4 h-4 fill-current text-[#E3EDD3]" />
                            <span>{language === 'vi' ? 'Xác Nhận & Thanh Toán QR' : 'Confirm & Pay via QR'}</span>
                          </>
                        ) : (
                          <>
                            <PackageCheck className="w-4 h-4 fill-current text-[#E3EDD3]" />
                            <span>
                              {language === 'vi'
                                ? `Xác Nhận Đặt Hàng (${totalItemsCount} món)`
                                : `Confirm Order (${totalItemsCount} items)`}
                            </span>
                          </>
                        )}
                      </motion.button>
                    </div>

                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* MODAL 2: Add Address Modal */}
      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onSaveAddress={handleSaveAddress}
      />

      {/* Image Preview Lightbox Modal */}
      <AnimatePresence>
        {previewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-50 bg-white rounded-3xl p-4 max-w-md w-full overflow-hidden shadow-2xl border border-white/20"
            >
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={previewProduct.image}
                  alt={getProductDisplay(previewProduct).name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 p-2 text-center">
                <h4 className="text-base font-bold text-[#335C33]">{getProductDisplay(previewProduct).name}</h4>
                <p className="text-xs text-[#8C5A35] mt-1">{getProductDisplay(previewProduct).description}</p>
                <p className="text-sm md:text-base font-bold text-[#335C33] mt-2 flex items-center justify-center gap-1.5">
                  <span className="font-extrabold">{previewProduct.price.toLocaleString('vi-VN')} đ</span>
                  <span className="text-[#8C5A35]">/ {getProductDisplay(previewProduct).unit}</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
