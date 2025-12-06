# 🎨 Skeleton Loader Kullanım Kılavuzu

## ✅ Yapılan İyileştirmeler

### 1. **SkeletonLoader Component'i Oluşturuldu**
- Modern, smooth animasyonlar
- 3 farklı animasyon tipi: `pulse`, `wave`, `shimmer`
- 7 farklı variant: `text`, `circular`, `rectangular`, `card`, `game-card`, `avatar`, `button`

### 2. **LoadingSpinner İyileştirildi**
- Daha smooth animasyonlar (0.8s duration, easeInOut)
- Cubic bezier easing functions
- Daha profesyonel görünüm

### 3. **Pre-built Skeleton Components**
- `GameCardSkeleton` - Oyun kartları için
- `ProductCardSkeleton` - Ürün kartları için
- `TextSkeleton` - Metin için
- `AvatarSkeleton` - Avatar için
- `ListItemSkeleton` - Liste öğeleri için
- `TableSkeleton` - Tablo için
- `GridSkeleton` - Grid layout için

## 📚 Kullanım Örnekleri

### Temel Kullanım

```tsx
import SkeletonLoader from '../components/SkeletonLoader';

// Basit skeleton
<SkeletonLoader variant="rectangular" width="100%" height="3rem" />

// Text skeleton
<SkeletonLoader variant="text" count={3} />

// Circular (avatar)
<SkeletonLoader variant="circular" width="3rem" height="3rem" />
```

### Animasyon Tipleri

```tsx
// Pulse animasyonu (varsayılan)
<SkeletonLoader variant="text" animation="pulse" />

// Wave animasyonu
<SkeletonLoader variant="text" animation="wave" />

// Shimmer animasyonu (en smooth)
<SkeletonLoader variant="text" animation="shimmer" />
```

### Pre-built Components

```tsx
import { 
  GameCardSkeleton, 
  GridSkeleton, 
  TextSkeleton,
  AvatarSkeleton 
} from '../components/SkeletonLoader';

// Oyun kartı skeleton
<GameCardSkeleton />

// Grid skeleton (8 oyun kartı)
<GridSkeleton items={8} variant="game-card" />

// Metin skeleton (3 satır)
<TextSkeleton lines={3} />

// Avatar skeleton
<AvatarSkeleton size="md" />
```

## 🎯 Gerçek Kullanım Örnekleri

### HomePage Loading State

```tsx
if (loading) {
  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <CommonBackground />
      
      {/* Hero Section Skeleton */}
      <section className="w-full mb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-[60vh] min-h-[450px]">
            <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-lg border border-orange-500/20 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="w-full mb-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <GridSkeleton items={8} variant="game-card" />
        </div>
      </section>
    </div>
  );
}
```

### Product List Loading

```tsx
const ProductList = ({ loading, products }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### User Profile Loading

```tsx
const UserProfile = ({ loading, user }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <AvatarSkeleton size="lg" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="40%" height="1.5rem" />
            <SkeletonLoader variant="text" width="60%" height="1rem" />
          </div>
        </div>
        <TextSkeleton lines={5} />
      </div>
    );
  }

  return (
    <div>
      {/* Actual content */}
    </div>
  );
};
```

### Table Loading

```tsx
const OrdersTable = ({ loading, orders }) => {
  if (loading) {
    return <TableSkeleton rows={5} cols={4} />;
  }

  return (
    <table>
      {/* Table content */}
    </table>
  );
};
```

## 🎨 Customization

### Custom Skeleton

```tsx
<SkeletonLoader
  variant="rectangular"
  width="100%"
  height="200px"
  className="rounded-lg"
  animation="shimmer"
/>
```

### Multiple Skeletons

```tsx
<SkeletonLoader
  variant="text"
  count={5}
  animation="shimmer"
/>
```

## ⚡ Performance Tips

1. **Lazy Loading ile Kullan**
   ```tsx
   const { data, loading } = useQuery(GET_PRODUCTS);
   if (loading) return <GridSkeleton items={8} />;
   ```

2. **Suspense ile Kullan**
   ```tsx
   <Suspense fallback={<GridSkeleton items={8} />}>
     <ProductList />
   </Suspense>
   ```

3. **Optimize Animasyonlar**
   - `shimmer` en smooth ama biraz daha ağır
   - `pulse` en hafif
   - `wave` orta seviye

## 🎯 Best Practices

1. ✅ **Sayfa yapısını koru** - Skeleton'lar gerçek içerikle aynı layout'ta olmalı
2. ✅ **Doğru variant kullan** - Her içerik tipi için uygun variant seç
3. ✅ **Animasyon tutarlılığı** - Tüm sayfada aynı animasyon tipini kullan
4. ✅ **Loading süresini optimize et** - Çok uzun loading'lerde progress göster
5. ✅ **Accessibility** - `role="status"` ve `aria-label` otomatik ekleniyor

## 📝 Variant'lar

| Variant | Kullanım | Örnek |
|---------|----------|-------|
| `text` | Metin satırları | Paragraflar, başlıklar |
| `circular` | Yuvarlak elementler | Avatar, icon |
| `rectangular` | Dikdörtgen | Genel placeholder |
| `card` | Kartlar | Ürün kartları |
| `game-card` | Oyun kartları | Oyun listesi |
| `avatar` | Profil resmi | Kullanıcı avatar |
| `button` | Butonlar | Action button'lar |

## 🎨 Animasyon Karşılaştırması

| Animasyon | Smoothluk | Performans | Kullanım |
|-----------|-----------|------------|----------|
| `pulse` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Basit içerikler |
| `wave` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Orta seviye |
| `shimmer` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Premium görünüm |

## 🚀 Sonraki Adımlar

1. ✅ SkeletonLoader component'i - **TAMAMLANDI**
2. ✅ LoadingSpinner iyileştirmeleri - **TAMAMLANDI**
3. ✅ HomePage'de kullanım - **TAMAMLANDI**
4. ⏳ Diğer sayfalarda skeleton loader ekle
5. ⏳ Loading state'leri optimize et

---

**Not:** Tüm skeleton loader'lar responsive ve accessibility uyumludur. Otomatik olarak `role="status"` ve `aria-label="Yükleniyor"` eklenir.

