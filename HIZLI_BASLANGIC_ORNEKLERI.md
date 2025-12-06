# 🚀 Hızlı Başlangıç Örnekleri

## 1. Shadcn/ui Kurulumu ve Kullanımı

### Kurulum
```bash
# 1. Projeyi başlat
npx shadcn-ui@latest init

# 2. Component'leri ekle
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
```

### Örnek: Modern Button Component
```tsx
// src/components/ui/button.tsx (Shadcn/ui otomatik oluşturur)
import { Button } from "@/components/ui/button"

// Kullanım
<Button variant="default" size="lg">
  Keşfet
</Button>

<Button variant="outline" size="sm">
  Daha Fazla
</Button>

<Button variant="ghost">
  İptal
</Button>
```

### Örnek: Modern Card Component
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card className="gaming-card">
  <CardHeader>
    <CardTitle>Oyun Başlığı</CardTitle>
    <CardDescription>Oyun açıklaması</CardDescription>
  </CardHeader>
  <CardContent>
    {/* İçerik */}
  </CardContent>
</Card>
```

## 2. React Hook Form + Zod Kullanımı

### Kurulum
```bash
npm install react-hook-form zod @hookform/resolvers
```

### Örnek: Login Form
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Validation Schema
const loginSchema = z.object({
  email: z.string().email('Geçerli bir email giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // API call
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')}
          type="email"
          className="input-field"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Şifre</label>
        <input
          {...register('password')}
          type="password"
          className="input-field"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>
  )
}
```

## 3. GSAP Animasyonları

### Kurulum
```bash
npm install gsap
```

### Örnek: Hero Section Animasyonu
```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animasyonu
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })

      // Button animasyonu
      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      })

      // Scroll animasyonu
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0,
        scale: 0.8,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="hero-section">
      <h1 ref={titleRef}>Hoş Geldiniz</h1>
      <button ref={buttonRef}>Keşfet</button>
    </div>
  )
}
```

### Örnek: Scroll Animasyonu
```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function AnimatedSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return <div ref={sectionRef}>İçerik</div>
}
```

## 4. React Spring Kullanımı

### Kurulum
```bash
npm install @react-spring/web
```

### Örnek: Smooth Animasyonlar
```tsx
import { useSpring, animated } from '@react-spring/web'

function AnimatedCard() {
  const [springs, api] = useSpring(() => ({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
  }))

  return (
    <animated.div
      style={springs}
      className="card"
    >
      İçerik
    </animated.div>
  )
}

// Hover animasyonu
function HoverCard() {
  const [springs, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }))

  return (
    <animated.div
      style={springs}
      onMouseEnter={() => api({ scale: 1.05 })}
      onMouseLeave={() => api({ scale: 1 })}
      className="card"
    >
      İçerik
    </animated.div>
  )
}
```

## 5. Image Optimization

### Kurulum
```bash
npm install react-image
```

### Örnek: Optimize Edilmiş Görsel
```tsx
import { Image } from 'react-image'

function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      loader={<div className="animate-pulse bg-gray-800 h-64" />}
      unloader={<div>Görsel yüklenemedi</div>}
      className="w-full h-auto rounded-lg"
    />
  )
}

// Lazy loading ile
function LazyImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-auto"
    />
  )
}
```

## 6. React Intersection Observer

### Kurulum
```bash
npm install react-intersection-observer
```

### Örnek: Scroll Animasyonları
```tsx
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

function AnimatedSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      İçerik
    </motion.div>
  )
}
```

## 7. Fuse.js ile Gelişmiş Arama

### Kurulum
```bash
npm install fuse.js
```

### Örnek: Fuzzy Search
```tsx
import Fuse from 'fuse.js'

interface Game {
  id: string
  name: string
  description: string
  category: string
}

function SearchGames({ games, query }: { games: Game[]; query: string }) {
  const fuse = new Fuse(games, {
    keys: ['name', 'description', 'category'],
    threshold: 0.3, // 0 = exact match, 1 = match anything
    includeScore: true,
  })

  const results = query ? fuse.search(query).map(result => result.item) : games

  return (
    <div>
      {results.map(game => (
        <div key={game.id}>{game.name}</div>
      ))}
    </div>
  )
}
```

## 8. Modern Toast Notifications

### Shadcn/ui Toast Kullanımı
```tsx
import { useToast } from "@/components/ui/use-toast"

function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      title: "Başarılı!",
      description: "İşlem tamamlandı.",
      variant: "default",
    })
  }

  const handleError = () => {
    toast({
      title: "Hata!",
      description: "Bir şeyler yanlış gitti.",
      variant: "destructive",
    })
  }

  return (
    <div>
      <button onClick={handleSuccess}>Başarı</button>
      <button onClick={handleError}>Hata</button>
    </div>
  )
}
```

## 9. Skeleton Loader

### Örnek: Loading State
```tsx
function GameCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-800 h-48 rounded-lg mb-4" />
      <div className="bg-gray-800 h-4 rounded w-3/4 mb-2" />
      <div className="bg-gray-800 h-4 rounded w-1/2" />
    </div>
  )
}

function GameList({ loading, games }: { loading: boolean; games: Game[] }) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
```

## 10. Design System Örneği

### Tailwind Config Güncellemesi
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
}
```

### Component Variants
```tsx
// src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500/10',
        ghost: 'text-primary-500 hover:bg-primary-500/10',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  className?: string
}

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
```

## 11. Performans İyileştirmeleri

### Code Splitting
```tsx
import { lazy, Suspense } from 'react'

const GameList = lazy(() => import('./GameList'))
const GameDetail = lazy(() => import('./GameDetail'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/oyunlar" element={<GameList />} />
        <Route path="/oyun/:id" element={<GameDetail />} />
      </Routes>
    </Suspense>
  )
}
```

### Memoization
```tsx
import { memo, useMemo } from 'react'

const GameCard = memo(({ game }: { game: Game }) => {
  return <div>{game.name}</div>
})

function GameList({ games }: { games: Game[] }) {
  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => a.name.localeCompare(b.name))
  }, [games])

  return (
    <div>
      {sortedGames.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
```

## 12. Accessibility İyileştirmeleri

### Keyboard Navigation
```tsx
function AccessibleButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label="Buton açıklaması"
      className="btn-primary"
    >
      {children}
    </button>
  )
}
```

### ARIA Labels
```tsx
function SearchInput() {
  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Oyun ara
      </label>
      <input
        id="search"
        type="search"
        aria-label="Oyun ara"
        aria-describedby="search-description"
        placeholder="Oyun ara..."
      />
      <span id="search-description" className="sr-only">
        Oyun adı veya kategori ile arama yapabilirsiniz
      </span>
    </div>
  )
}
```

---

## 📝 Notlar

1. **Adım Adım İlerle**: Tüm kütüphaneleri bir anda kurma, öncelik sırasına göre ilerle
2. **Test Et**: Her değişiklikten sonra test et
3. **Dokümantasyon**: Kütüphane dokümantasyonlarını oku
4. **Performans**: Bundle size'ı kontrol et (bundlephobia.com)

## 🎯 Önerilen Sıra

1. Shadcn/ui kurulumu
2. React Hook Form + Zod
3. Image optimization
4. GSAP veya React Spring
5. Diğer kütüphaneler

