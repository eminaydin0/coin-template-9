import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard,
  Shield,
  Gamepad2,
  Plus,
  Minus,
  Package,
  Home,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import CheckoutModal from '../components/CheckoutModal';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const CartPage = () => {
  const { cart, loading, removeItem, clearCart, updateItemQuantity, getTotal: getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Component mount kontrolü
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    
    // Önce ₺ işaretini ve boşlukları kaldır
    let cleanPrice = priceString.replace('₺', '').replace(/\s/g, '');
    
    // Binlik ayırıcı noktaları kaldır (örn: 1.325,00 -> 1325,00)
    cleanPrice = cleanPrice.replace(/\./g, '');
    
    // Virgülü noktaya çevir (1325,00 -> 1325.00)
    cleanPrice = cleanPrice.replace(',', '.');
    
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  };

  // API'den gelen fiyatın birim fiyat mı toplam fiyat mı olduğunu kontrol et
  // Eğer API toplam fiyat döndürüyorsa, birim fiyatı hesapla
  // Eğer API birim fiyat döndürüyorsa, doğrudan kullan
  // API'den gelen fiyatın birim fiyat mı toplam fiyat mı olduğunu tespit et
  const getUnitPrice = (price: string, quantity: number): number => {
    const parsedPrice = parsePrice(price);
    
    // Eğer quantity 1'den büyükse ve fiyat quantity ile çarpıldığında makul bir değer çıkıyorsa
    // bu muhtemelen toplam fiyattır
    if (quantity > 1) {
      // Fiyatın makul bir birim fiyat olup olmadığını kontrol et
      // Örnek: 1700 ÷ 2 = 850 (makul birim fiyat)
      const potentialUnitPrice = parsedPrice / quantity;
      if (potentialUnitPrice >= 50 && potentialUnitPrice <= 5000) {
        console.log(`getUnitPrice - Toplam fiyat tespit edildi: ${parsedPrice} ÷ ${quantity} = ${potentialUnitPrice}`);
        return potentialUnitPrice;
      }
    }
    
    console.log(`getUnitPrice - Birim fiyat olarak kabul edildi: ${parsedPrice}`);
    return parsedPrice;
  };

  // Toplam fiyatı hesapla (birim fiyat × miktar)
  const calculateItemTotal = (price: string, quantity: number): string => {
    const unitPrice = getUnitPrice(price, quantity);
    const total = unitPrice * quantity;
    console.log(`calculateItemTotal - Birim: ${unitPrice}, Quantity: ${quantity}, Total: ${total}`);
    return `₺${total.toFixed(2).replace('.', ',')}`;
  };

  const formatUnitPrice = (price: string, quantity: number): string => {
    const unitPrice = getUnitPrice(price, quantity);
    return `₺${unitPrice.toFixed(2).replace('.', ',')}`;
  };

  const getTotalQuantity = (): number => {
    return cart.reduce((total, item) => total + item.piece, 0);
  };

  // CartContext'teki getTotal fonksiyonunu kullan
  const getTotal = (): string => {
    return getCartTotal();
  };

  const handleRemoveItem = async (basketId: string) => {
    setUpdatingItem(basketId);
    await removeItem(basketId);
    setUpdatingItem(null);
  };

  const handleClearCart = async () => {
    setShowClearModal(true);
  };

  const handleConfirmClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/giris-yap');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleQuantityUpdate = async (basketId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItem(basketId);
    await updateItemQuantity(basketId, newQuantity);
    setUpdatingItem(null);
  };

  // Component mount olana kadar bekle
  if (!isMounted) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen relative overflow-hidden">
          <CommonBackground />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingSpinner 
              size="xl" 
              text="YÜKLENİYOR..." 
              variant="gaming" 
            />
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 relative overflow-hidden">
          <CommonBackground />
          
          <div className="w-full relative z-10">
            {/* Header Section - CategoriesPage Stili */}
            <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="rounded-2xl backdrop-blur-xl bg-black/20 border border-white/10 p-6 shadow-2xl">
                  {/* Breadcrumb */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs mb-4">
                    <Link 
                      to="/" 
                      className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>Ana Sayfa</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-300 font-medium">Sepetim</span>
                  </div>

                  {/* Title Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 text-orange-300" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">
                        <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                          Sepetim
                        </span>
                      </h1>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          color: 'rgba(249, 115, 22, 0.95)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {cart.length} ÜRÜN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Not Authenticated Message */}
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div 
                    className="text-center py-20 rounded-xl border"
                    style={{
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(75, 85, 99, 0.2)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <ShoppingCart className="h-16 w-16 text-orange-300/50 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Sepeti görüntülemek için giriş yapın
                    </h3>
                    <p className="text-gray-400 text-base mb-8">Hesabınıza giriş yaparak sepetinizi yönetebilirsiniz.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        to="/giris-yap" 
                        className="inline-flex items-center justify-center px-6 py-3 font-bold text-black rounded-xl transition-all bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                      >
                        <span>GİRİŞ YAP</span>
                      </Link>
                      
                      <Link 
                        to="/kayit-ol" 
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-lg transition-all"
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <span>KAYIT OL</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen relative overflow-hidden">
          <CommonBackground />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingSpinner 
              size="xl" 
              text="SEPET YÜKLENİYOR..." 
              variant="gaming" 
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        {/* Common Background */}
        <CommonBackground />
        
        <div className="w-full relative z-10">
          {/* Header Section - CategoriesPage Stili */}
          <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="rounded-2xl backdrop-blur-xl bg-black/20 border border-white/10 p-6 shadow-2xl">
                {/* Breadcrumb */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs mb-4">
                  <Link 
                    to="/" 
                    className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Ana Sayfa</span>
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-gray-300 font-medium">Sepetim</span>
                </div>

                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 text-orange-300" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                        Sepetim
                      </span>
                    </h1>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        color: 'rgba(249, 115, 22, 0.95)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {cart.length} ÜRÜN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div 
                    className="text-center py-20 rounded-xl border"
                    style={{
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(75, 85, 99, 0.2)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <ShoppingCart className="h-16 w-16 text-orange-300/50 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Sepetiniz boş
                    </h3>
                    <p className="text-gray-400 text-base mb-8">
                      Sepetinizde henüz ürün bulunmuyor. Hemen alışverişe başlayın!
                    </p>
                    
                    <Link to="/oyunlar">
                      <motion.div
                        className="inline-flex items-center gap-3 font-bold text-black py-4 px-8 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>ALIŞVERİŞE BAŞLA</span>
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
              {/* Flex Layout for Cart Items and Order Summary */}
              <div className="flex flex-col xl:flex-row gap-6 relative z-10">
                {/* Cart Items - Left Side */}
                <div className="flex-1 space-y-4">
                  {/* Cart Items Header - Compact */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className="group"
                  >
                    {/* Cart Header Card */}
                    <motion.div
                      className="relative rounded-xl border p-4 transition-all duration-300"
                      style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(75, 85, 99, 0.2)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(12px)',
                      }}
                      whileHover={{ y: -2 }}
                    >
                      {/* Cart Header */}
                      <div className="flex items-center justify-between gap-4">
                          {/* Left: Icon & Info */}
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                background: 'rgba(249, 115, 22, 0.2)',
                                border: '1px solid rgba(249, 115, 22, 0.3)',
                              }}
                            >
                              <ShoppingCart className="h-5 w-5 text-orange-300" />
                            </div>
                            
                            <div>
                              <h3 className="text-white font-bold text-base">
                                Sepet Ürünleri
                              </h3>
                              <p className="text-gray-400 text-xs">
                                {cart.length} ürün sepetinizde
                              </p>
                            </div>
                          </div>

                        {/* Clear Cart Button */}
                          <motion.button
                            onClick={handleClearCart}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all duration-300"
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                            whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                          >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          <span className="text-red-400 font-semibold text-xs">
                                TÜMÜNÜ SİL
                              </span>
                          </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="group"
                      >
                        {/* Cart Item Card - Compact */}
                        <motion.div
                          className="relative rounded-xl border p-4 transition-all duration-300"
                          style={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            border: '1px solid rgba(75, 85, 99, 0.2)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(12px)',
                          }}
                          whileHover={{ 
                            y: -2,
                            border: '1px solid rgba(249, 115, 22, 0.4)',
                            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.2), 0 4px 12px rgba(0,0,0,0.3)',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <div className="relative w-full h-full overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                                {item.url ? (
                                  <img 
                                    src={item.url} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLElement;
                                      target.style.display = 'none';
                                      const fallback = target.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center" style={{ display: item.url ? 'none' : 'flex' }}>
                                  <Gamepad2 className="h-8 w-8 text-orange-300/50" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Product Info & Price */}
                            <div className="flex-1 flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight group-hover:text-orange-300 transition-colors mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-gray-400 text-xs">
                                  {formatUnitPrice(item.price, item.piece)} × {item.piece}
                                </p>
                              </div>

                              {/* Total Price */}
                              <div className="flex-shrink-0 text-right">
                                <p className="text-lg font-black text-white">{calculateItemTotal(item.price, item.piece)}</p>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Quantity Controls */}
                              <div className="flex items-center rounded-lg border" style={{ background: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                                <motion.button
                                  onClick={() => handleQuantityUpdate(item.basketId, item.piece - 1)}
                                  disabled={updatingItem === item.basketId || item.piece <= 1}
                                  className="w-7 h-7 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                                  style={{
                                    background: 'rgba(249, 115, 22, 0.2)',
                                    border: 'none',
                                  }}
                                  whileHover={{ background: 'rgba(249, 115, 22, 0.3)' }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Minus className="h-3.5 w-3.5 text-orange-300" />
                                </motion.button>
                                <span className="w-8 text-center text-white font-bold text-xs px-1">
                                  {updatingItem === item.basketId ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-300 mx-auto"></div>
                                  ) : (
                                    item.piece
                                  )}
                                </span>
                                <motion.button
                                  onClick={() => handleQuantityUpdate(item.basketId, item.piece + 1)}
                                  disabled={updatingItem === item.basketId}
                                  className="w-7 h-7 rounded-r-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                                  style={{
                                    background: 'rgba(249, 115, 22, 0.2)',
                                    border: 'none',
                                  }}
                                  whileHover={{ background: 'rgba(249, 115, 22, 0.3)' }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Plus className="h-3.5 w-3.5 text-orange-300" />
                                </motion.button>
                              </div>
                              
                              {/* Remove Button */}
                              <motion.button
                                onClick={() => handleRemoveItem(item.basketId)}
                                disabled={updatingItem === item.basketId}
                                className="w-8 h-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                                whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {updatingItem === item.basketId ? (
                                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Summary - Right Side - Sticky */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="w-full xl:w-80 xl:sticky xl:top-24 xl:self-start"
                >
                  {/* Order Summary Card - Elegant Design */}
                  <div 
                    className="relative rounded-xl border overflow-hidden"
                    style={{
                      background: 'rgba(0, 0, 0, 0.75)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15), 0 4px 16px rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    {/* Header with Gradient */}
                    <div 
                      className="p-5 border-b"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))',
                        borderColor: 'rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(249, 115, 22, 0.25)',
                            border: '1px solid rgba(249, 115, 22, 0.4)',
                          }}
                        >
                          <Package className="h-5 w-5 text-orange-300" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Sipariş Özeti</h3>
                          <p className="text-orange-300/80 text-xs mt-0.5">{cart.length} ürün • {getTotalQuantity()} adet</p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Details */}
                    <div className="p-5 space-y-4">
                      {/* Summary Items */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Ara Toplam</span>
                          <span className="text-white font-semibold">{getTotal()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">İndirim</span>
                          <span className="text-red-400 font-semibold">₺0,00</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px" style={{ background: 'rgba(75, 85, 99, 0.3)' }}></div>

                      {/* Total */}
                      <div 
                        className="rounded-lg p-4"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                        }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-orange-300 font-bold text-sm">Genel Toplam</span>
                          <span className="text-2xl font-black text-white">{getTotal()}</span>
                        </div>
                        <p className="text-gray-400 text-xs text-right">KDV Dahil</p>
                      </div>

                      {/* Checkout Button */}
                      <motion.button
                        onClick={handleCheckout}
                        className="w-full font-bold text-black py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">ÖDEMEYE GEÇ</span>
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Features Footer */}
                    <div 
                      className="p-4 border-t space-y-2"
                      style={{
                        background: 'rgba(249, 115, 22, 0.05)',
                        borderColor: 'rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Shield className="h-4 w-4 text-orange-300 flex-shrink-0" />
                        <span>Güvenli Ödeme</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Package className="h-4 w-4 text-orange-300 flex-shrink-0" />
                        <span>Anında Teslimat</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                </div>
                </div>
              </div>
            </section>
          )}

          {/* Call to Action Section */}
          <CallToActionSection />
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClearCart}
        title="Sepeti Temizle"
        message="Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sepeti Temizle"
        cancelText="İptal"
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        totalAmount={getTotal()}
      />
    </>
  );
};

export default CartPage;




