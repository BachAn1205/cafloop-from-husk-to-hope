import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Volume2, VolumeX } from 'lucide-react';
import { trungAudio } from '../utils/audio';

export function Navbar() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = trungAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    trungAudio.toggle();
  };

  // Waveform bar heights — varied to feel organic, not mechanical
  const waveHeights = [0.5, 1, 0.65, 0.85, 0.45, 0.9, 0.6];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F6EE]/90 backdrop-blur-md border-b border-[#335C33]/10 transition-all">
      <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#335C33] flex items-center justify-center text-[#F6F6EE] shadow-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-[#335C33] text-base leading-none" style={{ fontFamily: 'var(--font-heading)' }}>CAFLOOP</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#E3EDD3] text-[#335C33]">
                Tuần Hoàn
              </span>
            </div>
            <p className="text-[10px] text-[#8C5A35] font-medium tracking-wide leading-tight mt-0.5">
              From Husk to Hope
            </p>
          </div>
        </div>

        {/* Audio Quick Toggle */}
        <motion.button
          onClick={toggleSound}
          id="btn-nav-audio-toggle"
          aria-label="Bật/Tắt âm thanh Đàn T'rưng"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-[background-color,box-shadow] duration-200 cursor-pointer ${
            isPlaying
              ? 'bg-[#335C33] text-[#F6F6EE] shadow-sm ring-2 ring-[#335C33]/20'
              : 'bg-[#E3EDD3] text-[#335C33] hover:bg-[#d5e3c1]'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#E3EDD3]" />
              <span className="text-[11px] font-semibold">T'rưng đang vang</span>
              {/* Organic waveform — motion-animated, not CSS bounce */}
              <span className="flex gap-px items-end h-3 ml-0.5" aria-hidden="true">
                {waveHeights.map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 bg-[#E3EDD3] rounded-full"
                    animate={{ scaleY: [h, 1, h * 0.6, 1, h] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9 + i * 0.08,
                      ease: 'easeInOut',
                      delay: i * 0.06,
                    }}
                    style={{ height: '12px', transformOrigin: 'bottom' }}
                  />
                ))}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#8C5A35]" />
              <span className="text-[11px] text-[#8C5A35]">
                Âm thanh Tây Nguyên
              </span>
            </>
          )}
        </motion.button>
      </div>
    </header>
  );
}
