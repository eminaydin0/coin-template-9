import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Eye, ArrowRight, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SlideIndicators from "./SlideIndicators";

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

  // GSAP refs for advanced animations
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const clamp = (i: number, l: number) => ((i % l) + l) % l;
  const current = heroList[currentHeroIndex];

  // GSAP Animations on mount and slide change
  useEffect(() => {
    if (!heroRef.current || !current) return;

    const ctx = gsap.context(() => {
      // Badge animation - Bounce and float
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          {
            opacity: 0,
            scale: 0.5,
            rotation: -15,
            y: -20,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );

        // Removed continuous floating animation
      }

      // Title animation - Split text reveal effect
      if (titleRef.current) {
        const titleText = titleRef.current;
        gsap.fromTo(
          titleText,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotationX: -90,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.1,
          }
        );

        // Removed text glow animation
      }

      // Subtitle animation - Word by word reveal
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 40,
            clipPath: "inset(0 100% 0 0)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.4,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }

      // Buttons stagger animation
      if (buttonsRef.current) {
        const buttons = Array.from(buttonsRef.current.children);
        gsap.fromTo(
          buttons,
          {
            opacity: 0,
            y: 30,
            scale: 0.8,
            rotationY: -90,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.3,
            ease: "power2.out",
            stagger: 0.05,
            delay: 0.3,
          }
        );
      }

      // Image parallax and zoom effect
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            scale: 1.2,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            scale: 1,
            opacity: 0.85,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          }
        );

        // Parallax on scroll
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            if (imageRef.current) {
              gsap.to(imageRef.current, {
                y: self.progress * 150,
                scale: 1 + self.progress * 0.15,
                rotation: self.progress * 2,
                duration: 0.3,
              });
            }
          },
        });
      }

      // Floating particles animation - Enhanced
      if (particlesRef.current) {
        const particles = Array.from(particlesRef.current.children);
        particles.forEach((particle, i) => {
          const xDistance = (Math.random() - 0.5) * 300;
          const yDistance = (Math.random() - 0.5) * 300;
          const rotation = Math.random() * 720;
          const duration = 4 + Math.random() * 3;

          // Initial position
          gsap.set(particle, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            rotation: Math.random() * 360,
            opacity: Math.random() * 0.4 + 0.2,
          });

          // Floating animation
          gsap.to(particle, {
            x: `+=${xDistance}`,
            y: `+=${yDistance}`,
            rotation: `+=${rotation}`,
            opacity: Math.random() * 0.5 + 0.3,
            duration,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.3,
          });
        });
      }


    }, heroRef);

    return () => ctx.revert();
  }, [currentHeroIndex, current]);

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
        // GSAP progress animation
        gsap.to(progressRef.current, {
          width: `${t * 100}%`,
          duration: 0.1,
          ease: "none",
        });
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
      className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.05)',
      }}
    >
      {/* Subtle Background Glow */}
      <div className="absolute -inset-20 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.url}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            ref={imageRef}
            src={current.url}
            alt={current.slogan}
            className="absolute inset-0 w-full h-full"
            style={{ 
              opacity: imageLoaded ? 0.85 : 0,
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: 'brightness(0.9) contrast(1.1)',
            }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Enhanced Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content - GSAP Enhanced */}
      <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Modern Badge */}
        <motion.div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-xl backdrop-blur-md"
          style={{
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Rocket className="h-4 w-4 text-orange-400" />
          <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
            Gaming Platform
          </span>
        </motion.div>

        {/* Modern Main Heading */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
        >
          <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            {current.slogan}
          </span>
        </h1>

        {/* Modern Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl font-medium text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {[current.short1, current.short2, current.short3].filter(Boolean).join(" • ")}
        </p>

        {/* Modern Action Buttons */}
        <div
          ref={buttonsRef}
          className="flex justify-center gap-4 mt-8 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/oyunlar"
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-white text-sm overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(234, 88, 12, 1))',
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.3)',
              }}
            >
              <Rocket className="h-4 w-4" />
              <span>Keşfet</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ 
              scale: 1.05, 
              y: -2,
            }} 
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/rehber"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white text-sm backdrop-blur-md transition-all"
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              <Eye className="h-4 w-4" />
              <span>Nasıl Çalışır</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Modern Navigation Controls */}
      {heroList.length > 1 && (
        <>
          {/* Previous Button */}
          <motion.button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl flex items-center justify-center group"
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
            <ChevronLeft className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl flex items-center justify-center group"
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
            <ChevronRight className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-20 w-12 h-12 rounded-xl flex items-center justify-center group"
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
              <Pause className="h-5 w-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
            ) : (
              <Play className="h-5 w-5 text-orange-400 group-hover:text-orange-300 transition-colors ml-0.5" />
            )}
          </motion.button>
        </>
      )}

      {/* Enhanced Slide Indicators with GSAP */}
      {heroList.length > 1 && (
        <SlideIndicators
          heroList={heroList}
          currentIndex={currentHeroIndex}
          onSlideChange={goToSlide}
        />
      )}

      {/* Modern Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-black/30 overflow-hidden rounded-b-3xl">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400"
          style={{
            width: "calc(var(--p,0)*100%)",
            backgroundSize: "200% 100%",
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)',
          }}
        />
      </div>
    </section>
  );
}
