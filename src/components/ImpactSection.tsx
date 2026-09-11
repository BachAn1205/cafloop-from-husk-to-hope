import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Bike, Tv, Heart, MapPin, CheckCircle2, School, Sparkles, Award } from 'lucide-react';
import YouTube from 'react-youtube';
import { AnimatedCounter } from './AnimatedCounter';
import { useLanguage } from '../utils/LanguageContext';
import { trungAudio } from '../utils/audio';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

export function ImpactSection() {
  const progressRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(progressRef, { once: true, margin: '-40px' });
  const { t } = useLanguage();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    if (trungAudio.getIsPlaying()) {
      trungAudio.stop();
    }
    setIsVideoPlaying(true);
  };

  const handlePauseOrEndVideo = () => {
    setIsVideoPlaying(false);
    trungAudio.play();
  };

  return (
    <section id="impact-section" className="py-12 md:py-20 px-5 md:px-8 bg-[#F6F6EE] relative border-t border-[#335C33]/10">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_NATURAL }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="section-badge mb-3 md:mb-4">
            <Heart className="text-[#8C5A35] fill-[#8C5A35]/20" />
            <span>{t('impactBadge')}</span>
          </div>
          <h2 id="impact-section-title" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] font-serif tracking-tight">
            {t('impactTitle')}
          </h2>
          <div className="section-subtitle mt-2.5 flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8C5A35]" />
            <span>{t('impactSchool')}</span>
          </div>
        </motion.div>

        {/* Desktop Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heartwarming Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE_NATURAL }}
            className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border-2 border-[#E3EDD3] aspect-[4/3] lg:aspect-square w-full group bg-black"
          >
            <YouTube
              videoId="ZK2En3NWqTY"
              className="absolute inset-0 w-full h-full"
              iframeClassName="w-full h-full"
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                  rel: 0,
                  showinfo: 0,
                  modestbranding: 1,
                },
              }}
              onPlay={handlePlayVideo}
              onPause={handlePauseOrEndVideo}
              onEnd={handlePauseOrEndVideo}
            />
            {/* Gradient vignette - fade out when playing */}
            <div className={`absolute inset-0 bg-gradient-to-t from-[#2C2E2B]/90 via-[#2C2E2B]/20 to-transparent transition-opacity duration-300 pointer-events-none ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`} />

            {/* Floating badge inside image - hide when playing */}
            <div className={`absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex items-center justify-between text-[#F6F6EE] transition-opacity duration-300 pointer-events-none ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#335C33]/90 flex items-center justify-center backdrop-blur-md shadow-lg border border-white/10">
                  <School className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold leading-tight">{t('impactImgBadgeTitle')}</p>
                  <p className="text-[11px] md:text-xs text-[#E3EDD3] leading-tight mt-0.5">{t('impactImgBadgeDesc')}</p>
                </div>
              </div>
              <span className="text-[11px] md:text-xs font-semibold bg-[#8C5A35]/90 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md shadow-lg border border-white/10">
                {t('impactImgBadgeSeason')}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Copy & Progress */}
          <div className="flex flex-col gap-6 md:gap-8">
            
            {/* Core Social Impact Copy */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE_NATURAL }}
              className="bg-[#E3EDD3]/90 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#335C33]/15 shadow-sm relative overflow-hidden"
            >
              {/* Decorative quote mark */}
              <div className="absolute -top-4 -left-2 text-[80px] leading-none text-[#335C33]/10 font-serif pointer-events-none">
                "
              </div>
              <p id="impact-copy-text" className="text-base md:text-lg lg:text-xl text-[#335C33] font-medium leading-relaxed md:leading-relaxed text-center relative z-10 italic">
                {t('impactQuote')}
              </p>
            </motion.div>

            {/* PROGRESS BAR CARD */}
            <motion.div
              id="progress-container"
              ref={progressRef}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: 0.18, ease: EASE_NATURAL }}
              className="bg-[#F6F6EE] border-2 border-[#335C33]/20 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-md"
            >
              {/* Target Title */}
              <div className="mb-5 md:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#8C5A35] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8C5A35]" />
                    {t('impactFundProgress')}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-[#335C33] bg-[#E3EDD3] px-3 py-1 rounded-full">
                    {t('impactPhase')}
                  </span>
                </div>
                <h3 id="target-label" className="text-base md:text-lg lg:text-xl font-bold text-[#335C33] leading-snug">
                  {t('impactTargetTitle')}
                </h3>
              </div>

              {/* Progress Bar — uses palette color */}
              <div className="relative w-full h-5 md:h-6 bg-[#E3EDD3] rounded-full overflow-hidden mb-3 md:mb-4 shadow-inner">
                <motion.div
                  id="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: isInView ? '35%' : '0%' }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-[#335C33] to-[#4A7F4A] rounded-full relative overflow-hidden"
                >
                  {/* Shimmer effect inside progress bar */}
                  <div className="absolute inset-0 w-[200%] bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>

              {/* Text Below Progress Bar */}
              <div className="flex items-center justify-between text-xs md:text-sm font-semibold mb-6">
                <span className="text-[#335C33] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#335C33]" />
                  <span id="progress-percentage-label" className="font-bold text-sm md:text-base">
                    {t('impactCompleted')} {isInView ? <AnimatedCounter to={35} duration={1.5} /> : 0}%
                  </span>
                </span>
                <span className="text-[#8C5A35]">
                  {t('impactRemaining')}
                </span>
              </div>

              {/* Breakdown items */}
              <div className="grid grid-cols-2 gap-3 md:gap-5 pt-5 md:pt-6 border-t border-[#335C33]/15">
                <div className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#E3EDD3]/60 hover:bg-[#E3EDD3] transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#335C33] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Bike className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-[#335C33] truncate">{t('impactBikesTitle')}</p>
                    <p className="text-[10px] md:text-xs text-[#8C5A35] mt-0.5">{t('impactBikesDesc')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#E3EDD3]/60 hover:bg-[#E3EDD3] transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#8C5A35] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Tv className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-[#335C33] truncate">{t('impactTVsTitle')}</p>
                    <p className="text-[10px] md:text-xs text-[#8C5A35] mt-0.5">{t('impactTVsDesc')}</p>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Mission note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.25, ease: EASE_NATURAL }}
              className="flex items-center justify-center lg:justify-start gap-2 text-xs md:text-sm text-[#8C5A35]"
            >
              <Award className="w-4 h-4 md:w-5 md:h-5 text-[#335C33]" />
              <span>{t('impactTransparency')}</span>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
