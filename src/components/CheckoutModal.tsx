import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Banknote,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { checkout } from '../services/api';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: string;
}

const CheckoutModal = ({ isOpen, onClose, totalAmount }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { setIsCheckoutModalOpen } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    iban: string;
    name: string;
    amount: string;
    description: string;
    orderId: string;
  } | null>(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  // Modal açıldığında checkout verilerini al
  useEffect(() => {
    if (isOpen && !checkoutData && !isLoadingCheckout) {
      const fetchCheckoutData = async () => {
        setIsLoadingCheckout(true);
        try {
          const response = await checkout();
          
          if (response.data) {
            // Havale ödemesi kontrolü
            if (response.data.specialText) {
              toast.error(response.data.specialText);
              return;
            }
            
            // Checkout verilerini kaydet - API response'una göre düzelt
            setCheckoutData({
              iban: response.data.iban || '',
              name: response.data.name || '',
              amount: response.data.totalPrice || response.data.amount || response.data.total || response.data.price || totalAmount,
              description: response.data.description || '',
              orderId: response.data.orderId || response.data.id || ''
            });
          } else {
            toast.error('API\'den veri gelmedi');
          }
        } catch (error: any) {
          console.error('Checkout data fetch error:', error);
          
          // Kullanıcıya hata mesajı göster
          const errorMessage = error.response?.data?.message || 
                              error.response?.data?.error || 
                              error.message || 
                              'Ödeme bilgileri yüklenemedi. Lütfen tekrar deneyin.';
          toast.error(errorMessage);
        } finally {
          setIsLoadingCheckout(false);
        }
      };
      
      fetchCheckoutData();
    }
  }, [isOpen, checkoutData, isLoadingCheckout, totalAmount]);

  // Modal kapandığında state'leri temizle
  useEffect(() => {
    if (!isOpen) {
      setCheckoutData(null);
      setIsLoadingCheckout(false);
    }
  }, [isOpen]);

  // Checkout modal state'ini güncelle
  useEffect(() => {
    setIsCheckoutModalOpen(isOpen);
  }, [isOpen, setIsCheckoutModalOpen]);

  // Body scroll'unu engelle (modal açıkken)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopyIBAN = async () => {
    const ibanToCopy = checkoutData?.iban;
    if (ibanToCopy) {
      try {
        await navigator.clipboard.writeText(ibanToCopy);
        toast.success('IBAN kopyalandı!');
      } catch (err) {
        toast.error('IBAN kopyalanamadı');
      }
    }
  };



  const handleCopyBankName = async () => {
    const bankNameToCopy = checkoutData?.name;
    if (bankNameToCopy) {
      try {
        await navigator.clipboard.writeText(bankNameToCopy);
        toast.success('Hesap adı kopyalandı!');
      } catch (err) {
        toast.error('Hesap adı kopyalanamadı');
      }
    }
  };

  const handleConfirmPayment = async () => {
    // Checkout verisi yoksa işlemi durdur
    if (!checkoutData) {
      toast.error('Ödeme bilgileri henüz yüklenmedi. Lütfen bekleyin...');
      return;
    }

    setIsProcessing(true);
    try {
      // Sepeti temizle
      await clearCart();
      
      // Başarı toast'u göster
      toast.success('Ödeme başarıyla tamamlandı!');
      
      // Modalı kapat
      onClose();
      
      // Siparişler sayfasına yönlendir
      navigate('/siparislerim');
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // API'den gelen hata mesajını kontrol et
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ödeme işlemi sırasında hata oluştu';
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        {/* Backdrop - Non-clickable */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal - Compact, no scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-xl border pointer-events-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2), 0 4px 16px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header - Compact */}
          <div 
            className="p-4 border-b"
            style={{
              background: 'rgba(249, 115, 22, 0.1)',
              borderColor: 'rgba(249, 115, 22, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(249, 115, 22, 0.2)',
                  border: '1px solid rgba(249, 115, 22, 0.4)',
                }}
              >
                <CreditCard className="h-5 w-5 text-orange-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white">
                  Ödeme Bilgileri
                </h3>
                <div 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded mt-1"
                  style={{
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }}
                >
                  <span className="text-gray-300 text-xs font-semibold">Toplam:</span>
                  <span className="text-white font-black text-sm">
                    {checkoutData?.amount || totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Compact, no scroll */}
          <div className="p-4 space-y-3">
            {/* Payment Instructions - Compact */}
            <div 
              className="rounded-lg p-3 border"
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-300 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-xs mb-1.5">Ödeme Talimatları</h4>
                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <div className="w-1 h-1 bg-orange-300 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-300 text-xs leading-tight">Banka hesabına ödeme yapın</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-1 h-1 bg-orange-300 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-300 text-xs leading-tight">Ödeme sonrası butona basın</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Account - Compact */}
            {isLoadingCheckout ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-orange-300 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400 text-xs">Yükleniyor...</span>
                </div>
              </div>
            ) : !checkoutData ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <span className="text-red-400 text-xs font-semibold">Veri yüklenemedi</span>
                </div>
              </div>
            ) : (
              <div 
                className="rounded-lg border p-3"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Banknote className="h-4 w-4 text-orange-300" />
                  <h4 className="text-white font-bold text-sm">Banka Hesabı</h4>
                  <CheckCircle className="h-3 w-3 text-orange-400 ml-auto" />
                </div>
                
                <div className="space-y-2.5">
                  {/* Bank Name - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Banka Adı</label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex-1 p-2 rounded-lg border"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                        }}
                      >
                        <p className="text-white font-bold text-xs">
                          {checkoutData.name}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyBankName}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                        title="Kopyala"
                      >
                        <Copy className="h-3.5 w-3.5 text-orange-300" />
                      </motion.button>
                    </div>
                  </div>

                  {/* IBAN - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs font-semibold mb-1.5 block">IBAN</label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex-1 p-2 rounded-lg border font-mono text-xs"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                        }}
                      >
                        <p className="text-white font-semibold break-all leading-tight">
                          {checkoutData.iban}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyIBAN}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                        title="Kopyala"
                      >
                        <Copy className="h-3.5 w-3.5 text-orange-300" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Amount - Compact */}
                  <div 
                    className="p-2.5 rounded-lg border"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-orange-300 text-xs font-semibold">Ödeme Tutarı</span>
                      <span className="text-white text-lg font-black">{checkoutData.amount}</span>
                    </div>
                  </div>

                  {/* Description - Compact, only if exists */}
                  {checkoutData.description && (
                    <div 
                      className="p-2 rounded-lg border"
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <p className="text-gray-300 text-xs leading-tight">
                        {checkoutData.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmPayment}
              disabled={isProcessing || !checkoutData || isLoadingCheckout}
              className="w-full font-bold text-black py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>İşleniyor...</span>
                </>
              ) : isLoadingCheckout ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Yükleniyor...</span>
                </>
              ) : !checkoutData ? (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Veri Yükleniyor</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Ödemeyi Yaptım</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>

            {/* Security Info - Compact */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <Shield className="h-3 w-3 text-orange-300" />
              <span className="text-gray-400 text-xs">Güvenli ödeme garantisi</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;





