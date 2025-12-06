import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard,
  Copy,
  CheckCircle,
  Home,
  ChevronRight,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const BankAccountsPage = () => {
  const { websiteData, refreshData } = useWebsite();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!websiteData || !websiteData.bankAccounts) {
          refreshData();
        }
      } catch (error) {
        console.error('Bank accounts fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [websiteData, refreshData]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const bankAccounts = websiteData?.bankAccounts || [];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <LoadingSpinner 
          size="xl" 
          text="Banka Hesapları Yükleniyor..." 
          variant="gaming" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
      <SEOHead />
      
      {/* Lüks Arka Plan Efektleri */}
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
                <span className="text-gray-300 font-medium">Banka Hesapları</span>
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
                    <CreditCardIcon className="h-4 w-4 text-orange-300" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                      Banka Hesapları
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
                    {bankAccounts.length} HESAP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts List */}
        <section className="relative py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {bankAccounts.length === 0 ? (
                <div 
                  className="text-center py-20 rounded-xl border"
                  style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <CreditCardIcon className="h-16 w-16 text-orange-300/60 mx-auto mb-6" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Banka hesabı bulunamadı
                  </h3>
                  <p className="text-gray-400 text-sm px-4">Yakında yeni banka hesapları eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {bankAccounts.map((account, index) => (
                  <BankAccountCard
                    key={index}
                    account={account}
                    index={index}
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                  />
                ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

// Bank Account Card Component
interface BankAccount {
  name: string;
  iban: string;
}

interface BankAccountCardProps {
  account: BankAccount;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}

const BankAccountCard = ({ account, index, copiedIndex, onCopy }: BankAccountCardProps) => {
  const isCopied = copiedIndex === index;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -4 }}
        className="relative rounded-xl border overflow-hidden transition-all duration-300 h-full flex flex-col"
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

        <div className="p-3 relative z-0 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-2 mb-2">
            {/* Icon */}
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(249, 115, 22, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <CreditCard className="h-4 w-4 text-orange-300" />
            </div>
            
            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-xs line-clamp-2">
                {account.name}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col space-y-2">
            {/* Description */}
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Güvenli banka hesabı ile hızlı ödeme yapabilirsiniz.
            </p>

            {/* IBAN Display */}
            <div 
              className="px-2.5 py-2 rounded-lg border"
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
              }}
            >
              <p className="text-orange-300/90 text-[10px] font-mono text-center break-all">
                {account.iban}
              </p>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={() => onCopy(account.iban, index)}
              className={`w-full font-bold py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 mt-auto text-xs ${
                isCopied 
                  ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400' 
                  : 'bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]'
              }`}
              whileHover={{ scale: isCopied ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCopied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BankAccountsPage;





