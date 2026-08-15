import { useState, useEffect } from 'react';
import { Leaf, Volume2, VolumeX, Sparkles } from 'lucide-react';
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
              <span className="font-bold tracking-tight text-[#335C33] text-base leading-none">CAFLOOP</span>
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
        <button
          onClick={toggleSound}
          id="btn-nav-audio-toggle"
          aria-label="Bật/Tắt âm thanh Đàn T'rưng"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
            isPlaying
              ? 'bg-[#335C33] text-[#F6F6EE] shadow-sm ring-2 ring-[#335C33]/20'
              : 'bg-[#E3EDD3] text-[#335C33] hover:bg-[#d5e3c1]'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#E3EDD3]" />
              <span className="text-[11px] font-semibold">T'rưng đang vang</span>
              <span className="flex gap-0.5 items-end h-2.5 ml-0.5">
                <span className="w-0.5 h-full bg-[#E3EDD3] rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-0.5 h-2/3 bg-[#E3EDD3] rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-0.5 h-5/6 bg-[#E3EDD3] rounded-full animate-bounce [animation-delay:300ms]"></span>
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#8C5A35]" />
              <span className="text-[11px] text-[#8C5A35] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#8C5A35]" />
                Âm thanh Tây Nguyên
              </span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
