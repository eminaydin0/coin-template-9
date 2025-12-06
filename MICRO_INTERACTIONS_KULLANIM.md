# 🎯 Micro-interactions Kullanım Kılavuzu

## ✅ Yapılan İyileştirmeler

### 1. **Enhanced Button Component**
- Smooth hover effects (scale, lift, shadow)
- Click feedback (ripple effect)
- Loading states
- Icon support (left/right)
- Multiple variants (primary, secondary, outline, ghost, danger)
- Size options (sm, md, lg)

### 2. **Enhanced Input Component**
- Real-time validation feedback
- Visual states (error, success, focus)
- Smooth animations
- Password toggle support
- Icon support (left/right)
- Helper text and error messages

### 3. **CSS Micro-interaction Utilities**
- Hover effects (lift, glow, scale)
- Click feedback
- Form validation animations
- Smooth transitions

## 📚 Kullanım Örnekleri

### Button Component

```tsx
import Button from '../components/ui/Button';
import { Send, ArrowRight } from 'lucide-react';

// Primary Button
<Button variant="primary" size="lg">
  Gönder
</Button>

// Button with Icons
<Button 
  variant="primary" 
  leftIcon={<Send />}
  rightIcon={<ArrowRight />}
>
  Mesaj Gönder
</Button>

// Loading State
<Button variant="primary" isLoading={loading}>
  Kaydet
</Button>

// Different Variants
<Button variant="secondary">İkincil</Button>
<Button variant="outline">Anahat</Button>
<Button variant="ghost">Hayalet</Button>
<Button variant="danger">Sil</Button>

// Full Width
<Button variant="primary" fullWidth>
  Tam Genişlik
</Button>
```

### Input Component

```tsx
import Input from '../components/ui/Input';
import { Mail, Lock, User } from 'lucide-react';

// Basic Input
<Input
  label="E-posta"
  type="email"
  placeholder="ornek@email.com"
/>

// Input with Icon
<Input
  label="E-posta"
  type="email"
  leftIcon={<Mail className="w-5 h-5" />}
  placeholder="ornek@email.com"
/>

// Input with Validation
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input
  label="E-posta"
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    if (!e.target.value.includes('@')) {
      setError('Geçerli bir e-posta giriniz');
    } else {
      setError('');
    }
  }}
  error={error}
  leftIcon={<Mail className="w-5 h-5" />}
/>

// Success State
<Input
  label="Kullanıcı Adı"
  value={username}
  success={username.length >= 3}
  helperText="Kullanıcı adı geçerli"
/>

// Password with Toggle
<Input
  label="Şifre"
  type="password"
  showPasswordToggle
  leftIcon={<Lock className="w-5 h-5" />}
/>

// Full Width
<Input
  label="Açıklama"
  fullWidth
  helperText="Maksimum 500 karakter"
/>
```

## 🎨 CSS Utility Classes

### Hover Effects

```tsx
// Lift on hover
<div className="hover-lift">
  Hover me
</div>

// Glow on hover
<div className="hover-glow">
  Hover me
</div>

// Scale on hover
<div className="hover-scale">
  Hover me
</div>
```

### Click Feedback

```tsx
<button className="click-feedback">
  Click me
</button>
```

### Smooth Transitions

```tsx
// Standard transition
<div className="smooth-transition">
  Content
</div>

// Fast transition
<div className="smooth-transition-fast">
  Content
</div>

// Slow transition
<div className="smooth-transition-slow">
  Content
</div>
```

## 🎯 Gerçek Kullanım Örnekleri

### Login Form

```tsx
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return 'E-posta gereklidir';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Geçerli bir e-posta giriniz';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Şifre gereklidir';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalıdır';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      setLoading(true);
      // API call
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="E-posta"
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          setErrors({ ...errors, email: validateEmail(e.target.value) });
        }}
        error={errors.email}
        leftIcon={<Mail className="w-5 h-5" />}
        placeholder="ornek@email.com"
      />

      <Input
        label="Şifre"
        type="password"
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
          setErrors({ ...errors, password: validatePassword(e.target.value) });
        }}
        error={errors.password}
        showPasswordToggle
        leftIcon={<Lock className="w-5 h-5" />}
        placeholder="••••••••"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={loading}
      >
        Giriş Yap
      </Button>
    </form>
  );
};
```

### Card with Hover Effects

```tsx
const ProductCard = ({ product }) => {
  return (
    <div className="hover-lift bg-black/20 rounded-lg p-4 border border-orange-500/20">
      <img src={product.image} alt={product.name} className="rounded-lg mb-4" />
      <h3 className="text-white font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{product.description}</p>
      <Button variant="primary" fullWidth>
        Sepete Ekle
      </Button>
    </div>
  );
};
```

### Form with Real-time Validation

```tsx
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateUsername = (username: string) => {
    if (username.length < 3) return 'Kullanıcı adı en az 3 karakter olmalıdır';
    if (username.length > 20) return 'Kullanıcı adı en fazla 20 karakter olabilir';
    return '';
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) return 'Şifre en az 6 karakter olmalıdır';
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return 'Şifre en az bir büyük ve bir küçük harf içermelidir';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== formData.password) {
      return 'Şifreler eşleşmiyor';
    }
    return '';
  };

  return (
    <form className="space-y-4">
      <Input
        label="Kullanıcı Adı"
        value={formData.username}
        onChange={(e) => {
          setFormData({ ...formData, username: e.target.value });
        }}
        error={validateUsername(formData.username)}
        success={formData.username.length >= 3 && !validateUsername(formData.username)}
        leftIcon={<User className="w-5 h-5" />}
      />

      <Input
        label="E-posta"
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
        }}
        error={validateEmail(formData.email)}
        success={formData.email.includes('@') && !validateEmail(formData.email)}
        leftIcon={<Mail className="w-5 h-5" />}
      />

      <Input
        label="Şifre"
        type="password"
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
        }}
        error={validatePassword(formData.password)}
        success={formData.password.length >= 6 && !validatePassword(formData.password)}
        showPasswordToggle
        leftIcon={<Lock className="w-5 h-5" />}
        helperText="En az 6 karakter, büyük ve küçük harf içermeli"
      />

      <Input
        label="Şifre Tekrar"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => {
          setFormData({ ...formData, confirmPassword: e.target.value });
        }}
        error={validateConfirmPassword(formData.confirmPassword)}
        success={formData.confirmPassword === formData.password && formData.confirmPassword.length > 0}
        showPasswordToggle
        leftIcon={<Lock className="w-5 h-5" />}
      />
    </form>
  );
};
```

## 🎨 Button Variants

| Variant | Kullanım | Görünüm |
|---------|----------|---------|
| `primary` | Ana aksiyonlar | Turuncu gradient, shadow |
| `secondary` | İkincil aksiyonlar | Gri, subtle |
| `outline` | Alternatif aksiyonlar | Border, transparent |
| `ghost` | Minimal aksiyonlar | Transparent, text only |
| `danger` | Tehlikeli aksiyonlar | Kırmızı, warning |

## 🎨 Input States

| State | Görünüm | Kullanım |
|-------|---------|----------|
| Default | Gri border | Normal durum |
| Focus | Turuncu border, ring | Aktif input |
| Error | Kırmızı border, icon | Validation hatası |
| Success | Yeşil border, icon | Başarılı validation |
| Disabled | Opacity 50% | Devre dışı |

## ⚡ Performance Tips

1. **Lazy Validation** - Sadece blur veya submit'te validate et
2. **Debounce** - Real-time validation için debounce kullan
3. **Memoization** - Validation fonksiyonlarını memoize et

## 🎯 Best Practices

1. ✅ **Immediate Feedback** - Kullanıcıya anında geri bildirim ver
2. ✅ **Visual States** - Tüm durumları görsel olarak göster
3. ✅ **Smooth Animations** - Animasyonlar smooth olmalı
4. ✅ **Accessibility** - ARIA labels ve keyboard navigation
5. ✅ **Error Messages** - Açıklayıcı hata mesajları

## 🚀 Sonraki Adımlar

1. ✅ Button component - **TAMAMLANDI**
2. ✅ Input component - **TAMAMLANDI**
3. ✅ CSS utilities - **TAMAMLANDI**
4. ⏳ Mevcut form'larda kullan
5. ⏳ Card hover effects ekle

---

**Not:** Tüm micro-interactions accessibility uyumlu ve performanslıdır. Framer Motion ile smooth animasyonlar sağlanır.

