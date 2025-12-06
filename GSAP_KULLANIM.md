# 🎬 GSAP Kullanım Kılavuzu

## ✅ Kurulum

GSAP başarıyla kuruldu:
```bash
npm install gsap
```

## 📚 Kullanım Örnekleri

### 1. Hero Section Animasyonları

#### GSAPHeroSection Component
```tsx
import GSAPHeroSection from '../components/GSAPHeroSection';

// Kullanım
<GSAPHeroSection
  heroList={heroList}
  currentHeroIndex={currentHeroIndex}
  setCurrentHeroIndex={setCurrentHeroIndex}
  isPlaying={isPlaying}
  setIsPlaying={setIsPlaying}
/>
```

**Özellikler:**
- ✅ Title fade-in ve scale animasyonu
- ✅ Subtitle slide-up animasyonu
- ✅ Badge bounce animasyonu
- ✅ Buttons stagger animasyonu
- ✅ Image parallax effect
- ✅ Floating badge animasyonu
- ✅ Smooth hover effects

### 2. Scroll Animasyonları

#### ScrollAnimation Component
```tsx
import ScrollAnimation from '../components/ScrollAnimation';

// Fade in
<ScrollAnimation animation="fadeIn">
  <div>İçerik</div>
</ScrollAnimation>

// Slide up
<ScrollAnimation animation="slideUp" delay={0.2}>
  <div>İçerik</div>
</ScrollAnimation>

// Slide left
<ScrollAnimation animation="slideLeft" duration={1.2}>
  <div>İçerik</div>
</ScrollAnimation>

// Scale
<ScrollAnimation animation="scale">
  <div>İçerik</div>
</ScrollAnimation>

// Rotate
<ScrollAnimation animation="rotate">
  <div>İçerik</div>
</ScrollAnimation>
```

### 3. Custom GSAP Animations

#### useGSAP Hook
```tsx
import { useGSAP } from '../hooks/useGSAP';

const MyComponent = () => {
  const { scopeRef, gsap } = useGSAP();

  return (
    <div ref={scopeRef}>
      {/* GSAP animations bu scope içinde çalışır */}
    </div>
  );
};
```

#### Scroll-triggered Animation
```tsx
import { useScrollAnimation } from '../hooks/useGSAP';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const MyComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const animation = gsap.fromTo(
      elementRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );

    useScrollAnimation(elementRef.current, animation, {
      start: 'top 80%',
      end: 'bottom 20%',
    });
  }, []);

  return <div ref={elementRef}>İçerik</div>;
};
```

## 🎨 Animasyon Tipleri

### ScrollAnimation Animations

| Animation | Efekt | Kullanım |
|-----------|-------|----------|
| `fadeIn` | Fade in | Genel içerik |
| `slideUp` | Yukarıdan kayarak | Kartlar, bölümler |
| `slideLeft` | Soldan kayarak | Sidebar, menüler |
| `slideRight` | Sağdan kayarak | Alternatif içerik |
| `scale` | Büyüyerek | Önemli elementler |
| `rotate` | Dönerek | İkonlar, badge'ler |

## 🎯 Gerçek Kullanım Örnekleri

### HomePage'de Scroll Animations

```tsx
import ScrollAnimation from '../components/ScrollAnimation';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section - GSAP ile */}
      <GSAPHeroSection {...props} />

      {/* Popular Products - Scroll Animation */}
      <ScrollAnimation animation="slideUp" delay={0.1}>
        <PopularProductsSection />
      </ScrollAnimation>

      {/* Best Selling - Scroll Animation */}
      <ScrollAnimation animation="slideUp" delay={0.2}>
        <BestSellingGamesSection />
      </ScrollAnimation>

      {/* More Games - Scale Animation */}
      <ScrollAnimation animation="scale" delay={0.3}>
        <MoreGamesSection />
      </ScrollAnimation>
    </div>
  );
};
```

### Product Cards Animations

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ProductCard = ({ product, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index]);

  return (
    <div ref={cardRef} className="product-card">
      {/* Card content */}
    </div>
  );
};
```

### Timeline Animations

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AnimatedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });

    tl.from(titleRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.out',
    })
    .from(contentRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <h2 ref={titleRef}>Başlık</h2>
      <div ref={contentRef}>İçerik</div>
    </div>
  );
};
```

### Parallax Effects

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ParallaxSection = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current || !textRef.current) return;

    // Image parallax
    gsap.to(imageRef.current, {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Text parallax (opposite direction)
    gsap.to(textRef.current, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <img ref={imageRef} src="/image.jpg" alt="Parallax" />
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center">
        <h1>Parallax Text</h1>
      </div>
    </div>
  );
};
```

## 🎨 Advanced Animations

### Split Text Animation

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplitTextAnimation = ({ text }) => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = text.split('').map((char, i) => (
      <span key={i} style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

    // Animate each character
    gsap.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        y: 50,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        },
      }
    );
  }, [text]);

  return <h1 ref={textRef}>{text}</h1>;
};
```

### Morphing Shapes

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MorphingShape = () => {
  const shapeRef = useRef<SVGElement>(null);

  useEffect(() => {
    if (!shapeRef.current) return;

    gsap.to(shapeRef.current, {
      morphSVG: 'M100,100 Q200,50 300,100 T500,100',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <svg>
      <path ref={shapeRef} d="M100,100 Q200,50 300,100" />
    </svg>
  );
};
```

## ⚡ Performance Tips

1. **Use GSAP Context**
   ```tsx
   const ctx = gsap.context(() => {
     // Animations
   }, ref);
   return () => ctx.revert();
   ```

2. **Kill ScrollTriggers**
   ```tsx
   useEffect(() => {
     const st = ScrollTrigger.create({...});
     return () => st.kill();
   }, []);
   ```

3. **Use will-change CSS**
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

4. **Batch DOM Updates**
   ```tsx
   gsap.set([element1, element2, element3], { opacity: 0 });
   gsap.to([element1, element2, element3], { opacity: 1 });
   ```

## 🎯 Best Practices

1. ✅ **Cleanup** - Her zaman animasyonları temizle
2. ✅ **Performance** - GPU accelerated properties kullan (transform, opacity)
3. ✅ **Accessibility** - `prefers-reduced-motion` kontrolü ekle
4. ✅ **Timing** - Smooth easing functions kullan
5. ✅ **Testing** - Farklı cihazlarda test et

## 📊 GSAP vs Framer Motion

| Özellik | GSAP | Framer Motion |
|---------|------|---------------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| ScrollTrigger | ✅ Built-in | ❌ External |
| Timeline Control | ✅ Excellent | ⭐⭐⭐ |
| Learning Curve | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Bundle Size | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🚀 Sonraki Adımlar

1. ✅ GSAP kurulumu - **TAMAMLANDI**
2. ✅ Hero section animations - **TAMAMLANDI**
3. ✅ Scroll animations component - **TAMAMLANDI**
4. ⏳ Mevcut sayfalarda kullan
5. ⏳ Page transitions ekle
6. ⏳ Advanced animations

---

**Not:** GSAP ScrollTrigger plugin'i otomatik olarak register edilir. Tüm animasyonlar performanslı ve smooth çalışır.

