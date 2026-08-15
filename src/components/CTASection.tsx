import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Check, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CTASectionProps {
  onOpenOrder: () => void;
}

export function CTASection({ onOpenOrder }: CTASectionProps) {
  const [copied, setCopied] = useState(false);
  const [sharedCount, setSharedCount] = useState(384);

  const campaignUrl = typeof window !== 'undefined' ? window.location.href : 'https://cafloop.org';
  const shareQuote = 'Cùng CAFLOOP biến vỏ cà phê thành trà Cascara gây quỹ 77 xe đạp & 2 Smart TV cho học sinh vùng cao!';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#335C33', '#8C5A35', '#E3EDD3', '#1877F2'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleFacebookShare = () => {
    triggerConfetti();
    setSharedCount((prev) => prev + 1);

    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      campaignUrl
    )}&quote=${encodeURIComponent(shareQuote)}`;

    // Try web share first on mobile if supported, or open FB popup
    if (navigator.share) {
      navigator
        .share({
          title: 'CAFLOOP - Từ Vỏ Cà Phê Đến Tương Lai Ngời Sáng',
          text: shareQuote,
          url: campaignUrl,
        })
        .catch(() => {
          window.open(fbShareUrl, '_blank', 'width=600,height=500');
        });
    } else {
      window.open(fbShareUrl, '_blank', 'width=600,height=500');
    }
  };

  const handleCopyLink = () => {
    triggerConfetti();
    navigator.clipboard.writeText(campaignUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section id="cta-section" className="py-14 px-5 bg-[#F6F6EE] relative border-t border-[#335C33]/10">
      <div className="max-w-[480px] mx-auto text-center">

        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E3EDD3] text-[#335C33] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Share2 className="w-3.5 h-3.5 text-[#335C33]" />
            Cùng Chung Đôi Tay
          </div>

          {/* Section Title H2 */}
          <h2 id="cta-section-title" className="text-2xl sm:text-3xl font-extrabold text-[#335C33] font-serif tracking-tight">
            Lan Tỏa Tác Động
          </h2>
        </motion.div>

        {/* Section Copy */}
        <motion.p
          id="cta-copy-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base text-[#2C2E2B]/85 font-medium leading-relaxed mb-6 px-2"
        >
          Một lượt chia sẻ của bạn là một bước rút ngắn hành trình đến trường của các em nhỏ.
        </motion.p>

        {/* Primary Large Facebook Share Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <button
            id="btn-facebook-share"
            onClick={handleFacebookShare}
            className="w-full py-4 px-6 rounded-2xl bg-[#1877F2] text-white font-bold text-base shadow-md hover:bg-[#166fe5] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {/* Facebook Custom Icon */}
            <div className="w-7 h-7 rounded-full bg-white text-[#1877F2] flex items-center justify-center flex-shrink-0 shadow-xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span>Chia sẻ chiến dịch lên Facebook</span>
          </button>
        </motion.div>

        {/* Secondary Actions: Copy link and Direct Pre-order */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 gap-2.5 mb-6"
        >
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            id="btn-copy-campaign-link"
            className="py-2.5 px-3 rounded-xl bg-[#E3EDD3] text-[#335C33] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#d6e3c2] active:scale-[0.98] transition-all border border-[#335C33]/15"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#335C33]" />
                <span>Đã sao chép link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8C5A35]" />
                <span>Sao chép liên kết</span>
              </>
            )}
          </button>

          {/* Direct Order Button */}
          <button
            onClick={onOpenOrder}
            id="btn-cta-order-pack"
            className="py-2.5 px-3 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#284828] active:scale-[0.98] transition-all"
          >
            <Heart className="w-3.5 h-3.5 text-[#E3EDD3]" />
            <span>Góp quỹ trực tiếp</span>
          </button>
        </motion.div>

        {/* Live Community Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EDD3]/70 text-[#335C33] text-[11px] font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8C5A35]" />
          <span>Đã có <strong>{sharedCount.toLocaleString('vi-VN')}</strong> lượt chia sẻ vì trẻ em vùng cao</span>
        </motion.div>

      </div>
    </section>
  );
}
