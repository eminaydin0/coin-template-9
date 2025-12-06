# 🎴 Card Şekilleri - Kullanım Örnekleri

Gaming platformunuz için hazır card şekilleri ve nasıl kullanılacağı.

## 🚀 Hızlı Başlangıç

### 1. Cut Corner Card (En Önerilen)

```tsx
<motion.div
  className="card-cut-corner relative overflow-hidden transition-all duration-300 flex flex-col h-full"
  whileHover={{ y: -4 }}
  style={{
    backdropFilter: 'blur(12px)',
  }}
>
  {/* Card içeriği */}
</motion.div>
```

### 2. Gradient Border Card

```tsx
<motion.div
  className="card-gradient-border relative overflow-hidden transition-all duration-300 flex flex-col h-full"
  whileHover={{ y: -4 }}
  style={{
    backdropFilter: 'blur(12px)',
  }}
>
  {/* Card içeriği */}
</motion.div>
```

### 3. Gaming Premium (Cut Corner + Gradient Border)

```tsx
<motion.div
  className="card-gaming-premium relative overflow-hidden transition-all duration-300 flex flex-col h-full"
  whileHover={{ y: -4 }}
>
  {/* Card içeriği */}
</motion.div>
```

---

## 📝 Mevcut Card'larınızı Güncelleme

### BestSellingCard için:

**Önceki:**
```tsx
<motion.div
  className="relative rounded-xl border overflow-hidden transition-all duration-300 flex flex-col h-full"
  // ...
>
```

**Yeni (Cut Corner):**
```tsx
<motion.div
  className="card-cut-corner relative overflow-hidden transition-all duration-300 flex flex-col h-full"
  whileHover={{ y: -4 }}
  style={{
    backdropFilter: 'blur(12px)',
  }}
  // ... diğer stiller
>
```

**Yeni (Gaming Premium - EN İYİ):**
```tsx
<motion.div
  className="card-gaming-premium relative overflow-hidden transition-all duration-300 flex flex-col h-full"
  whileHover={{ y: -4 }}
  // ... diğer stiller
>
```

---

## 🎨 Tam Örnek: Product Card

```tsx
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/epin/${product.slug}`}
        className="block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="card-gaming-premium relative overflow-hidden transition-all duration-300 flex flex-col h-full"
          whileHover={{ y: -4 }}
        >
          {/* Shine Effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              }}
            />
          )}

          {/* Image */}
          <div className="relative h-32 overflow-hidden">
            {product.url && !imageError ? (
              <motion.img
                src={product.url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center">
                <Gamepad2 className="h-10 w-10 text-orange-300" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            {/* Badge */}
            {product.isPopular && (
              <div className="absolute top-2 right-2 z-20 px-2 py-1 rounded-lg bg-orange-500/30 border border-orange-500/50 backdrop-blur-sm">
                <Flame className="h-3 w-3 text-orange-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="text-orange-400 font-bold mt-auto">
              {product.price}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
```

---

## 🎯 Hangi Card'ı Nerede Kullanmalı?

### ✅ Ana Product Cards
**Önerilen:** `card-gaming-premium` veya `card-cut-corner`
- Gaming temasına mükemmel uyum
- Dikkat çekici
- Modern görünüm

### ✅ Featured Products
**Önerilen:** `card-gradient-border`
- Daha belirgin border
- Premium görünüm
- Özel ürünler için ideal

### ✅ Category Cards
**Önerilen:** `card-glassmorphism`
- Temiz ve modern
- Mevcut yapıya uyumlu
- Profesyonel görünüm

### ✅ Info Cards
**Önerilen:** `card-accent-corner`
- Klasik ama özel detay
- Universal kullanım
- Temiz görünüm

---

## 💡 İpuçları

1. **Hover Efektleri:** Mevcut hover efektleriniz zaten güzel, sadece class'ı değiştirin
2. **Badge'ler:** Cut corner card'larda badge'leri kesik köşeye yakın yerleştirin
3. **Responsive:** Mobile'da kesik köşeler daha küçük olacak (CSS'te ayarlandı)
4. **Performance:** CSS class'ları kullanarak performansı koruyun

---

## 🔧 Custom Styling

Eğer class'ları kullanmak istemiyorsanız, inline style ile de kullanabilirsiniz:

```tsx
<motion.div
  style={{
    clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
    border: '2px solid transparent',
    background: `
      linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)) padding-box,
      linear-gradient(135deg, rgba(249, 115, 22, 0.4), rgba(251, 146, 60, 0.4)) border-box
    `,
    backdropFilter: 'blur(12px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = `
      linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)) padding-box,
      linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(251, 146, 60, 0.8)) border-box
    `;
    e.currentTarget.style.boxShadow = '0 0 40px rgba(249, 115, 22, 0.5), 0 8px 24px rgba(0, 0, 0, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = `
      linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)) padding-box,
      linear-gradient(135deg, rgba(249, 115, 22, 0.4), rgba(251, 146, 60, 0.4)) border-box
    `;
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  {/* Content */}
</motion.div>
```

---

## ✨ Sonuç

**En basit ve etkili yöntem:** Mevcut card'larınızda sadece `className`'i değiştirin:

```tsx
// Önceki
className="relative rounded-xl border ..."

// Yeni (En önerilen)
className="card-gaming-premium relative overflow-hidden ..."
```

Bu kadar! Card'larınız artık gaming temasına uygun, modern ve dikkat çekici görünecek! 🎮

