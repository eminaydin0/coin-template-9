import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Home,
  ChevronRight,
  ShoppingCart,
  Tag
} from 'lucide-react';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

interface Order {
  id: string;
  orderId: string;
  status: {
    text: string;
    color: string;
  };
  price: string;
  date: string;
}

// Get status info helper
const getStatusInfo = (statusText: string) => {
  switch (statusText) {
    case 'Ödeme Bekleniyor':
      return {
        text: 'Ödeme Bekleniyor',
        color: '#facc15',
        bgColor: 'rgba(234, 179, 8, 0.15)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        icon: Clock
      };
    case 'Tamamlandı':
      return {
        text: 'Tamamlandı',
        color: '#4ade80',
        bgColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        icon: CheckCircle
      };
    case 'İptal Edildi':
      return {
        text: 'İptal Edildi',
        color: '#f87171',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        icon: XCircle
      };
    default:
      return {
        text: statusText,
        color: '#9ca3af',
        bgColor: 'rgba(107, 114, 128, 0.15)',
        borderColor: 'rgba(107, 114, 128, 0.3)',
        icon: Clock
      };
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Component mount olduğunda çalışacak
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Orders fetch error:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Storage event'ini dinle (login/logout için)
  useEffect(() => {
    const handleStorageChange = () => {
      // Storage değiştiğinde component'i yeniden render et
      window.location.reload();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
                    <span className="text-gray-300 font-medium">Siparişlerim</span>
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
                          Siparişlerim
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
                        SİPARİŞLERİM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
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
                      Siparişlerinizi görüntülemek için giriş yapın
                    </h3>
                    <p className="text-gray-400 text-base mb-8">
                      Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to="/giris-yap">
                        <motion.button
                          className="font-bold text-black py-3 px-6 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          GİRİŞ YAP
                        </motion.button>
                      </Link>
                      
                      <Link to="/kayit-ol">
                        <motion.button
                          className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{
                            background: 'rgba(75, 85, 99, 0.3)',
                            border: '1px solid rgba(75, 85, 99, 0.4)',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          KAYIT OL
                        </motion.button>
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
        <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
          <CommonBackground />
          <LoadingSpinner 
            size="xl" 
            text="SİPARİŞLER YÜKLENİYOR..." 
            variant="gaming" 
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
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
                  <span className="text-gray-300 font-medium">Siparişlerim</span>
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
                        Siparişlerim
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
                      {orders.length} SİPARİŞ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List or Empty State */}
          <section className="relative py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {orders.length === 0 ? (
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
                      Henüz siparişiniz yok
                    </h3>
                    <p className="text-gray-400 text-base mb-8">
                      İlk siparişinizi vermek için ürünlerimizi keşfedin ve sepetinize ekleyin.
                    </p>
                    
                    <Link to="/oyunlar">
                      <motion.button
                        className="font-bold text-black py-3 px-6 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Package className="h-5 w-5" />
                        <span>ÜRÜNLERİ KEŞFET</span>
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status.text);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          statusInfo={statusInfo} 
                          StatusIcon={StatusIcon}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <CallToActionSection />
        </div>
      </div>
    </>
  );
};

// Order Card Component
interface StatusInfo {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OrderCard = ({ 
  order, 
  statusInfo, 
  StatusIcon 
}: { 
  order: Order; 
  statusInfo: StatusInfo; 
  StatusIcon: React.ComponentType<{ className?: string }>;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -4 }}
        className="relative rounded-xl border overflow-hidden transition-all duration-300" 
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))'
            : 'rgba(0, 0, 0, 0.6)',
          border: isHovered
            ? '1.5px solid rgba(249, 115, 22, 0.5)'
            : '1px solid rgba(249, 115, 22, 0.2)',
          boxShadow: isHovered
            ? '0 8px 24px rgba(249, 115, 22, 0.25), 0 0 40px rgba(249, 115, 22, 0.1)'
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
        }}
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

        <div className="p-3 relative z-0">
          {/* Header Row - Compact */}
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Left: Order Info */}
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {/* Order Icon */}
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(249, 115, 22, 0.2)',
                  border: '1px solid rgba(249, 115, 22, 0.35)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Package className="h-4 w-4 text-orange-300" />
              </div>
              
              {/* Order Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs mb-0.5 leading-tight line-clamp-1">
                  Sipariş #{order.orderId}
                </h3>
                <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="line-clamp-1">{order.date}</span>
                </div>
              </div>
            </div>

            {/* Right: Status Badge */}
            <div 
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold flex-shrink-0"
              style={{
                background: statusInfo.bgColor,
                border: `1px solid ${statusInfo.borderColor}`,
              }}
            >
              <StatusIcon className="h-3 w-3" style={{ color: statusInfo.color }} />
              <span style={{ color: statusInfo.color }} className="line-clamp-1">{statusInfo.text}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-2" style={{ background: 'rgba(75, 85, 99, 0.2)' }}></div>

          {/* Bottom Row: Price and Payment - Compact */}
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex-1 min-w-0">
              <div 
                className="rounded-lg p-2 border"
                style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                }}
              >
                <div className="flex items-baseline justify-between gap-1.5">
                  <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Toplam</span>
                  <span className="text-white font-black text-sm truncate">{order.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg flex-shrink-0" 
              style={{
                background: 'rgba(75, 85, 99, 0.2)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
              }}
            >
              <CreditCard className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-300 text-[10px] font-medium whitespace-nowrap">Banka</span>
            </div>
          </div>

          {/* Action Bar - CategoriesPage Style */}
          <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(75,85,99,0.2)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-400">Sipariş Detayı</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-orange-300">Görüntüle</span>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Tag className="h-3 w-3 text-orange-300" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrdersPage;





