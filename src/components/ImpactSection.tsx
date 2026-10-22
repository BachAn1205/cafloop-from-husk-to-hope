import { useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { Bike, Tv, CheckCircle2, Sparkles, Award, CalendarCheck, Shield, HeartHandshake, MapPin } from 'lucide-react';
import YouTube from 'react-youtube';
import { AnimatedCounter } from './AnimatedCounter';
import { useLanguage } from '../utils/LanguageContext';
import { trungAudio } from '../utils/audio';

const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

function CoffeeBeanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g transform="rotate(-28 12 12)">
        <ellipse cx="12" cy="12" rx="5.1" ry="8.35" fill="currentColor" />
        <path
          d="M12 4.6c1.35 2.15 1.35 4.35 0 6.5s-1.35 4.35 0 6.3"
          fill="none"
          stroke="#F6F6EE"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function FundProgressCard({
  percent,
  title,
  delay,
  className = '',
  place,
  children,
}: {
  percent: number;
  title: string;
  delay: number;
  className?: string;
  place?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const { t } = useLanguage();

  const progressLabel = (
    <span className="text-[#335C33] flex items-center gap-1.5 shrink-0">
      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#335C33]" />
      <span className="font-bold text-sm md:text-base">
        {t('impactProgressLabel')} {isInView ? <AnimatedCounter to={percent} duration={1.5} /> : 0}%
      </span>
    </span>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay, ease: EASE_NATURAL }}
      className={`bg-[#F6F6EE] border-2 border-[#335C33]/20 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-md ${className}`}
    >
      <div className="mb-4 md:mb-5">
        <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#8C5A35] flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8C5A35]" />
          {t('impactFundProgress')}
        </span>
        <h3 className="text-base md:text-lg font-bold text-[#335C33] leading-snug">{title}</h3>
      </div>

      <div className="relative w-full h-5 md:h-6 bg-[#E3EDD3] rounded-full overflow-hidden mb-3 md:mb-4 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${percent}%` : '0%' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full bg-gradient-to-r from-[#335C33] to-[#4A7F4A] rounded-full relative overflow-hidden"
        >
          <div className="absolute inset-0 w-[200%] bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>

      {place ? (
        <div className="flex items-center justify-between gap-3 text-xs md:text-sm font-semibold mb-4">
          <span className="text-[#335C33] flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#335C33] shrink-0" />
            <span className="font-bold text-sm md:text-base">{place}</span>
          </span>
          {progressLabel}
        </div>
      ) : (
        <div className="flex items-center text-xs md:text-sm font-semibold mb-4">
          {progressLabel}
        </div>
      )}

      {children}
    </motion.div>
  );
}

export function ImpactSection() {
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
          <h2 id="impact-section-title" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] font-serif tracking-tight">
            {t('impactTitle')}
          </h2>
          <div className="section-subtitle mt-2.5 max-w-3xl mx-auto">
            <span>
              <Award className="inline-block w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 align-[-0.15em] text-[#8C5A35]" />
              {t('impactSchool')}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE_NATURAL }}
          className="bg-[#E3EDD3]/90 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#335C33]/15 shadow-sm relative overflow-hidden mb-8 lg:mb-12"
        >
          <div className="absolute -top-4 -left-2 text-[80px] leading-none text-[#335C33]/10 font-serif pointer-events-none">
            "
          </div>
          <p id="impact-copy-text" className="text-base md:text-lg lg:text-xl text-[#335C33] font-medium leading-relaxed text-center relative z-10 italic">
            {t('impactQuote')}
          </p>
        </motion.div>

        {/* Video spans the first two partner cards; Highland fund sits below them */}
        <div id="progress-container" className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-4 md:gap-y-5 items-stretch">
          
          {/* Left Column: Heartwarming Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE_NATURAL }}
            className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border-2 border-[#E3EDD3] aspect-[4/3] lg:aspect-auto lg:row-span-2 lg:row-start-1 lg:h-full w-full min-h-0 group bg-black"
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
          </motion.div>

              <FundProgressCard percent={100} title={t('impactTargetTitle')} place={t('impactEaWarPlace')} delay={0.12}>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#E3EDD3]/60">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#335C33] flex items-center justify-center flex-shrink-0">
                      <Bike className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-bold text-[#335C33]">{t('impactBikesTitle')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#E3EDD3]/60">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#8C5A35] flex items-center justify-center flex-shrink-0">
                      <Tv className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-bold text-[#335C33]">{t('impactTVsTitle')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-row items-center flex-nowrap gap-2 bg-[#E3EDD3]/45 p-3 rounded-xl md:rounded-2xl border border-[#335C33]/10">
                  <div className="flex items-center gap-2 min-w-0 text-xs text-[#335C33] font-bold">
                    <div className="w-6 h-6 rounded-lg bg-[#335C33] text-[#E3EDD3] flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="whitespace-nowrap">{t('impactCompletionTitle')}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#335C33] bg-white px-2.5 py-1 rounded-lg border border-[#335C33]/15 whitespace-nowrap">
                    {t('impactCompletionValue')}
                  </span>
                </div>
              </FundProgressCard>

              <FundProgressCard percent={75} title={t('impactHoaSenFrameTitle')} place={t('impactHoaSenPlace')} delay={0.18}>
                <div className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#E3EDD3]/60">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#335C33] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-[#335C33]">{t('impactHoaSenTitle')}</p>
                    <p className="text-xs md:text-sm text-[#8C5A35] mt-0.5">{t('impactHoaSenDesc')}</p>
                  </div>
                </div>
              </FundProgressCard>

              <FundProgressCard
                percent={70}
                title={`${t('impactHighlandFrameTitle')} - ${t('impactHighlandFundSubtitle')}`}
                place={t('impactHighlandPlace')}
                delay={0.24}
                className="lg:col-span-2"
              >
                <div className="flex items-start gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#E3EDD3]/60">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#8C5A35] flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="w-5 h-5 md:w-6 md:h-6 text-[#E3EDD3]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-[#335C33]">{t('impactHighlandFundDesc')}</p>
                    <ul className="mt-0.5 space-y-1">
                      {[t('impactHighlandFundGoal1'), t('impactHighlandFundGoal2'), t('impactHighlandFundGoal3')].map((goal) => (
                        <li key={goal} className="flex items-start gap-2 text-xs md:text-sm text-[#8C5A35]">
                          <CoffeeBeanIcon className="w-4 h-4 md:w-[18px] md:h-[18px] mt-0.5 shrink-0 text-[#8C5A35]" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FundProgressCard>

        </div>

      </div>
    </section>
  );
}
