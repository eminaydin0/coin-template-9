# GSAP Animasyonları Kullanım Kılavuzu

Bu dokümantasyon, projeye eklenen GSAP animasyonlarını ve nasıl kullanılacağını açıklar.

## 🎨 Eklenen Özellikler

### 1. Hero Section GSAP Animasyonları

**Dosya:** `src/components/HeroSection.tsx`

Hero section'a eklenen gelişmiş GSAP animasyonları:

- **Badge Animasyonu:** Bounce ve float efekti
- **Başlık Animasyonu:** 3D rotation ve text glow efekti
- **Alt Başlık Animasyonu:** Clip-path ile word-by-word reveal
- **Buton Animasyonları:** Staggered entrance ve hover efektleri
- **Görsel Parallax:** Scroll sırasında parallax ve zoom efekti
- **Floating Particles:** 20 adet animasyonlu parçacık
- **Köşe Elementleri:** Scale ve rotation animasyonları
- **Border Glow:** Sürekli pulse animasyonu
- **Slide Indicators:** Dinamik genişleme ve glow efektleri
- **Progress Bar:** Smooth progress animasyonu

### 2. Yeni Komponentler

#### TextReveal Component
**Dosya:** `src/components/TextReveal.tsx`

Scroll-triggered text reveal animasyonu:

```tsx
import TextReveal from '../components/TextReveal';

<TextReveal direction="up" delay={0.2} duration={1}>
  <h2>Başlık</h2>
</TextReveal>
```

**Props:**
- `direction`: 'up' | 'down' | 'left' | 'right' (varsayılan: 'up')
- `delay`: Animasyon gecikmesi (saniye)
- `duration`: Animasyon süresi (saniye)
- `className`: Ek CSS sınıfları

#### MagneticButton Component
**Dosya:** `src/components/MagneticButton.tsx`

Mouse cursor'ı takip eden manyetik buton:

```tsx
import MagneticButton from '../components/MagneticButton';

<MagneticButton 
  strength={0.3} 
  className="px-6 py-3 bg-orange-500"
  onClick={() => console.log('Tıklandı')}
>
  Tıkla
</MagneticButton>
```

**Props:**
- `strength`: Manyetik güç (0-1 arası, varsayılan: 0.3)
- `className`: CSS sınıfları
- `onClick`: Tıklama handler'ı

#### FloatingElements Component
**Dosya:** `src/components/FloatingElements.tsx`

Animasyonlu floating parçacıklar:

```tsx
import FloatingElements from '../components/FloatingElements';

<FloatingElements 
  count={20}
  color="rgba(249, 115, 22, 0.4)"
  size={{ min: 2, max: 6 }}
  speed={{ min: 3, max: 6 }}
/>
```

**Props:**
- `count`: Parçacık sayısı (varsayılan: 20)
- `color`: Parçacık rengi
- `size`: Min-max boyut aralığı
- `speed`: Min-max hız aralığı

#### PageTransition Component
**Dosya:** `src/components/PageTransition.tsx`

Sayfa geçiş animasyonları:

```tsx
import PageTransition from '../components/PageTransition';

<PageTransition>
  <YourPageContent />
</PageTransition>
```

#### SlideIndicators Component
**Dosya:** `src/components/SlideIndicators.tsx`

GSAP ile animasyonlu slide göstergeleri (Hero section içinde kullanılıyor).

### 3. useScrollReveal Hook

**Dosya:** `src/hooks/useScrollReveal.ts`

Scroll-triggered reveal animasyonları için hook:

```tsx
import { useScrollReveal } from '../hooks/useScrollReveal';

const MyComponent = () => {
  const ref = useScrollReveal({
    direction: 'up',
    duration: 1,
    stagger: 0.1,
    once: true,
  });

  return <div ref={ref}>İçerik</div>;
};
```

**Options:**
- `trigger`: Trigger elementi (varsayılan: elementRef)
- `start`: Scroll başlangıç pozisyonu (varsayılan: 'top 85%')
- `end`: Scroll bitiş pozisyonu
- `toggleActions`: Animasyon tetikleme davranışı
- `once`: Sadece bir kez animasyon (varsayılan: true)
- `stagger`: Çocuk elementler arası gecikme
- `direction`: Animasyon yönü
- `duration`: Animasyon süresi
- `delay`: Başlangıç gecikmesi

## 🚀 Kullanım Örnekleri

### Product Card'lara Scroll Animasyonu Ekleme

```tsx
import { useScrollReveal } from '../hooks/useScrollReveal';

const ProductCard = ({ product, index }) => {
  const cardRef = useScrollReveal({
    direction: 'up',
    duration: 0.6,
    delay: index * 0.1,
    once: true,
  });

  return (
    <div ref={cardRef}>
      {/* Card içeriği */}
    </div>
  );
};
```

### Section'lara Text Reveal Ekleme

```tsx
import TextReveal from '../components/TextReveal';

<section>
  <TextReveal direction="up" delay={0.2}>
    <h2 className="text-3xl font-bold">Başlık</h2>
  </TextReveal>
  
  <TextReveal direction="up" delay={0.4}>
    <p>Alt başlık metni</p>
  </TextReveal>
</section>
```

### Manyetik Buton Kullanımı

```tsx
import MagneticButton from '../components/MagneticButton';

<MagneticButton 
  strength={0.4}
  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white font-semibold"
  onClick={handleClick}
>
  Keşfet
</MagneticButton>
```

## 🎯 Performans İpuçları

1. **ScrollTrigger Cleanup:** Component unmount olduğunda ScrollTrigger'ları temizleyin
2. **Once Option:** Tek seferlik animasyonlar için `once: true` kullanın
3. **Stagger:** Çok sayıda element için stagger kullanarak performansı artırın
4. **will-change:** CSS'te `will-change` property'sini kullanın (GSAP otomatik ekler)

## 📚 GSAP Dokümantasyonu

Daha fazla bilgi için:
- [GSAP Dokümantasyonu](https://greensock.com/docs/)
- [ScrollTrigger Plugin](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Easing](https://greensock.com/docs/v3/Eases)

## ✨ Gelecek Geliştirmeler

- [ ] Product card hover animasyonlarına GSAP eklenmesi
- [ ] Page transition'ların App.tsx'e entegrasyonu
- [ ] Daha fazla scroll-triggered animasyon
- [ ] Timeline-based complex animations
- [ ] SVG path animations

