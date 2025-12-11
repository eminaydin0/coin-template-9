import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Eye, ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Sparkles, Star, Gamepad2 } from "lucide-react";
import SlideIndicators from "./SlideIndicators";

interface HeroItem {
  slogan: string;
  short1: string;
  short2: string;
  short3: string;
  url: string;
}

interface Props {
  heroList: HeroItem[];
  currentHeroIndex: number;
  setCurrentHeroIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

export default function HeroSection({
  heroList,
  currentHeroIndex,
  setCurrentHeroIndex,
  isPlaying,
  setIsPlaying,
}: Props) {
  const DURATION = 8000;
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(performance.now());
  const [imageLoaded, setImageLoaded] = useState(false);

  const heroRef = useRef<HTMLElement>(null);

  const clamp = (i: number, l: number) => ((i % l) + l) % l;
  const current = heroList[currentHeroIndex];

  /** autoplay */
  useEffect(() => {
    if (!isPlaying || !heroList.length || heroList.length <= 1) return;

    startTimeRef.current = performance.now();
    if (progressRef.current) {
      progressRef.current.style.setProperty("--p", "0");
    }

    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / DURATION);

      if (progressRef.current) {
        progressRef.current.style.setProperty("--p", t.toString());
      }

      if (t >= 1) {
        setCurrentHeroIndex((p) => clamp(p + 1, heroList.length));
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [isPlaying, currentHeroIndex, heroList.length, setCurrentHeroIndex]);

  if (!current || !heroList.length) {
    return null;
  }

  const goToSlide = (index: number) => {
    setCurrentHeroIndex(clamp(index, heroList.length));
  };

  const goToPrev = () => {
    setCurrentHeroIndex((p) => clamp(p - 1, heroList.length));
  };

  const goToNext = () => {
    setCurrentHeroIndex((p) => clamp(p + 1, heroList.length));
  };

  return (
    <section 
      ref={heroRef}
      className="relative h-full w-full flex flex-col lg:flex-row overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Subtle Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Photo Section - Top on mobile, Left on desktop */}
      <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.url}
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={current.url}
              alt={current.slogan}
              className="max-w-full max-h-full object-contain"
              style={{ 
                opacity: imageLoaded ? 1 : 0,
                objectPosition: 'center center',
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Floating Elements - Asymmetric */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute text-orange-400/15 hidden lg:block"
          style={{ left: '8%', top: '15%' }}
          animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0 }}
        >
          <Star className="h-8 w-8" />
        </motion.div>
        <motion.div
          className="absolute text-orange-400/12 hidden lg:block"
          style={{ right: '12%', top: '30%' }}
          animate={{ y: [0, -12, 0], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
        <motion.div
          className="absolute text-orange-400/10 hidden lg:block"
          style={{ left: '15%', bottom: '20%' }}
          animate={{ y: [0, -10, 0], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 3 }}
        >
          <Gamepad2 className="h-7 w-7" />
        </motion.div>
      </div>

      {/* Text Section - Bottom on mobile, Right on desktop */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 lg:py-0">
        <div className="text-center max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slogan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Main Heading - Balanced */}
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                {current.slogan}
              </span>
            </motion.h1>

            {/* Subtitle - Refined */}
            <motion.p 
              className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {[current.short1, current.short2, current.short3].filter(Boolean).join(" • ")}
            </motion.p>

            {/* Action Buttons - Refined */}
            <motion.div 
              className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link
                to="/oyunlar"
                className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white text-xs sm:text-sm overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(234, 88, 12, 1))',
                  boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(249, 115, 22, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10" />
                <span className="relative z-10">Keşfet</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 transition-transform relative z-10" />
              </Link>

              <Link
                to="/rehber"
                className="group inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-white text-xs sm:text-sm backdrop-blur-md transition-all duration-300"
                style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Nasıl Çalışır</span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls - Refined */}
      {heroList.length > 1 && (
        <>
          {/* Previous Button */}
          <motion.button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(234, 88, 12, 0.2) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
            }}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Önceki slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(234, 88, 12, 0.2) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
            }}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Sonraki slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(234, 88, 12, 0.2) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? "Duraklat" : "Oynat"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
            ) : (
              <Play className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 group-hover:text-orange-300 transition-colors ml-0.5" />
            )}
          </motion.button>
        </>
      )}

      {/* Slide Indicators */}
      {heroList.length > 1 && (
        <SlideIndicators
          heroList={heroList}
          currentIndex={currentHeroIndex}
          onSlideChange={goToSlide}
        />
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-black/30 overflow-hidden rounded-b-3xl">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400"
          style={{
            width: "calc(var(--p,0)*100%)",
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)',
          }}
        />
      </div>
    </section>
  );
}
