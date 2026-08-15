import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, TreePine, Wind, ArrowDown, Sparkles, HeartHandshake, Coffee } from 'lucide-react';
import { trungAudio } from '../utils/audio';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenOrder: () => void;
}

export function HeroSection({ onExploreClick, onOpenOrder }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = trungAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handleToggleMusic = () => {
    trungAudio.toggle();
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#F6F6EE]">
      {/* Background Image with Organic Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80"
          alt="Đồi cà phê và nông trường Tây Nguyên Việt Nam"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter saturate-[0.85] contrast-[0.95]"
        />
        {/* Multilayered organic gradients for high readability & warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F6EE]/95 via-[#F6F6EE]/85 to-[#F6F6EE]" />
        <div className="absolute inset-0 bg-[#335C33]/15 mix-blend-multiply" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E3EDD3]/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-60 h-60 rounded-full bg-[#8C5A35]/15 blur-2xl pointer-events-none" />
      </div>

      {/* Hero Content Container (Centered Mobile-First) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 pt-8 pb-4">
        
        {/* Tag / Badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-2 self-start mb-4 px-3.5 py-1.5 rounded-full bg-[#E3EDD3]/90 border border-[#335C33]/20 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#335C33] animate-ping" />
          <span className="text-xs font-semibold text-[#335C33] tracking-wide">
            Kinh Tế Tuần Hoàn • Từ Tây Nguyên
          </span>
        </motion.div>

        {/* Main Headline H1 */}
        <motion.h1
          id="hero-main-heading"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl font-extrabold text-[#335C33] leading-[1.2] tracking-tight font-serif mb-4"
        >
          Từ Vỏ Cà Phê <br />
          <span className="text-[#8C5A35] font-sans font-bold">Đến Tương Lai Ngời Sáng</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          id="hero-subtext"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-base text-[#2C2E2B]/85 font-normal leading-relaxed mb-7 max-w-md"
        >
          Thưởng thức Trà Cascara CAFLOOP - Cùng chung tay góp quỹ giáo dục cho học sinh vùng cao.
        </motion.p>

        {/* T'RƯNG MUSIC PLAYER - Stylized Tribal Inspired Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-[#E3EDD3]/90 backdrop-blur-md rounded-2xl p-3.5 border border-[#335C33]/15 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3.5">
              {/* Stylized Tribal Circular Button with continuous pulse */}
              <button
                id="btn-trung-music-player"
                onClick={handleToggleMusic}
                aria-label="Lắng nghe thanh âm Đại Ngàn (Đàn T'rưng Tây Nguyên)"
                className="relative group flex-shrink-0 focus:outline-none"
              >
                {/* Continuous gentle pulse rings */}
                <span className="absolute -inset-1.5 rounded-full bg-[#8C5A35]/25 animate-ping opacity-75" />
                <span className="absolute -inset-2.5 rounded-full bg-[#335C33]/15 animate-pulse" />
                
                {/* Tribal Circular Badge */}
                <div className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed transition-transform duration-300 shadow-md active:scale-95 ${
                  isPlaying 
                    ? 'bg-[#335C33] border-[#E3EDD3] text-[#F6F6EE] rotate-12' 
                    : 'bg-[#F6F6EE] border-[#8C5A35] text-[#8C5A35] hover:scale-105'
                }`}>
                  {/* Outer subtle tribal decorative notches */}
                  <div className="absolute inset-1 rounded-full border border-[#8C5A35]/30 pointer-events-none" />
                  
                  {/* Icons combination (Music + TreePine + Wind) */}
                  <div className="relative flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex flex-col items-center">
                        <Music className="w-5 h-5 text-[#E3EDD3] animate-bounce" />
                        <span className="text-[9px] font-bold tracking-tighter text-[#E3EDD3] -mt-0.5">T'RƯNG</span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <TreePine className="w-5 h-5 text-[#8C5A35]" />
                        <Music className="w-3.5 h-3.5 text-[#335C33] absolute -top-1.5 -right-1.5" />
                        <Wind className="w-3 h-3 text-[#8C5A35]/70 absolute -bottom-1 -left-1" />
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Text info next to the button */}
              <div className="flex-1 min-w-0" onClick={handleToggleMusic} role="button" tabIndex={0}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#335C33] leading-tight">
                    Lắng nghe thanh âm Đại Ngàn
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#8C5A35] flex-shrink-0 animate-pulse" />
                </div>
                <p className="text-xs text-[#8C5A35] font-medium leading-normal mt-0.5">
                  {isPlaying 
                    ? 'Đang phát giai điệu Đàn T\'rưng Tây Nguyên...' 
                    : 'Chạm để hòa mình vào tiếng đàn tre & gió ngàn'}
                </p>
                {/* Audio visualizer bar when active */}
                {isPlaying && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {[40, 75, 50, 90, 60, 100, 70, 45, 80].map((h, i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-[#335C33] rounded-full"
                        animate={{ height: ['4px', `${h * 0.16}px`, '4px'] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6 + (i % 4) * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                    <span className="text-[10px] text-[#335C33] font-semibold ml-2">Đang ngân vang</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            id="btn-hero-order"
            onClick={onOpenOrder}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#335C33] text-[#F6F6EE] font-semibold text-sm shadow-md hover:bg-[#284828] active:scale-[0.98] transition-all"
          >
            <Coffee className="w-4 h-4 text-[#E3EDD3]" />
            <span>Trải nghiệm Trà Cascara</span>
          </button>
          
          <button
            id="btn-hero-learn-more"
            onClick={onExploreClick}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#F6F6EE] text-[#335C33] border border-[#335C33]/25 font-semibold text-xs hover:bg-[#E3EDD3]/50 active:scale-[0.98] transition-all"
          >
            <HeartHandshake className="w-4 h-4 text-[#8C5A35]" />
            <span>Xem hành trình gieo mầm</span>
          </button>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 pb-4 flex justify-center">
        <button
          onClick={onExploreClick}
          aria-label="Cuộn xuống để xem dữ liệu"
          className="flex flex-col items-center gap-1 text-[#8C5A35] hover:text-[#335C33] transition-colors"
        >
          <span className="text-[11px] font-medium tracking-wider uppercase">Tác động xanh</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
