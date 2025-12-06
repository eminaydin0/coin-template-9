import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Home,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const ContactPage = () => {
  const [loading, setLoading] = useState(true);
  const { getInfoValue } = useWebsite();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const contactPhone = getInfoValue('CONTACT_PHONE');
  const contactEmail = getInfoValue('CONTACT_EMAIL');
  const contactAddress = getInfoValue('CONTACT_ADDRESS');

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CommonBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner 
            size="xl" 
            text="İletişim Yükleniyor..." 
            variant="gaming" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
      <SEOHead />
      
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
                <span className="text-gray-300 font-medium">İletişim</span>
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
                    <Headphones className="h-4 w-4 text-orange-300" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                      İletişim & Destek
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
                  7/24 DESTEK
                </span>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <section className="relative py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {(!contactPhone && !contactEmail && !contactAddress) ? (
                <div 
                  className="text-center py-20 rounded-xl border"
                  style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(75, 85, 99, 0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Headphones className="h-16 w-16 text-orange-300/50 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    İletişim bilgileri bulunamadı
                  </h3>
                  <p className="text-gray-400 text-base">Yakında iletişim bilgileri eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {contactPhone && (
                <ContactCard
                  icon={Phone}
                  title="Telefon Desteği"
                  description="7/24 müşteri hizmetleri ile yanınızdayız"
                  contact={contactPhone}
                  contactLabel="Arama Yapın"
                  badgeText="TELEFON"
                  features={[
                    'Anında yanıt garantisi',
                    'Profesyonel destek ekibi',
                    'Türkçe müşteri hizmetleri'
                  ]}
                  buttonText="Hemen Ara"
                  buttonIcon={Phone}
                />
              )}

              {contactEmail && (
                <ContactCard
                  icon={Mail}
                  title="E-posta Desteği"
                  description="24 saat içinde detaylı yanıt alın"
                  contact={contactEmail}
                  contactLabel="E-posta Gönderin"
                  badgeText="E-POSTA"
                  features={[
                    'Detaylı yanıt garantisi',
                    'Teknik destek ekibi',
                    'Dosya ekleme imkanı'
                  ]}
                  buttonText="E-posta Gönder"
                  buttonIcon={Mail}
                />
              )}

              {contactAddress && (
                <ContactCard
                  icon={MapPin}
                  title="Ofis Adresi"
                  description="Merkez ofisimiz ve operasyon merkezi"
                  contact={contactAddress}
                  contactLabel="Ziyaret Edin"
                  badgeText="OFİS"
                  features={[
                    'Profesyonel ekip merkezi',
                    'Güvenli ve modern ofis',
                    'Kolay ulaşım imkanı'
                  ]}
                  buttonText="Konumu Gör"
                  buttonIcon={MapPin}
                />
              )}
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

// Contact Card Component
interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  contact: string;
  contactLabel: string;
  badgeText: string;
  features: string[];
  buttonText: string;
  buttonIcon: LucideIcon;
}

const ContactCard = ({
  icon: Icon,
  title,
  description,
  contact,
  contactLabel,
  badgeText,
  features,
  buttonText,
  buttonIcon: ButtonIcon
}: ContactCardProps) => {
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
            className="absolute inset-0 z-10"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            }}
          />
        )}

        <div className="p-3 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Icon */}
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(249, 115, 22, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Icon className="h-4 w-4 text-orange-300" />
            </div>
            
            {/* Badge */}
            <div 
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex-shrink-0"
              style={{
                background: 'rgba(249, 115, 22, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                color: 'rgba(249, 115, 22, 0.95)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {badgeText}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col space-y-2">
            {/* Title & Description */}
            <div>
              <h3 className="text-white font-bold text-sm mb-1.5 line-clamp-2 leading-tight group-hover:text-orange-300 transition-colors">
                {title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Contact Info */}
            <div 
              className="rounded-lg p-2.5 border"
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
              }}
            >
              <p className="text-gray-400 text-[10px] font-semibold mb-1 uppercase tracking-wide">{contactLabel}</p>
              <p className="text-white font-bold text-xs break-all leading-relaxed">{contact}</p>
            </div>

            {/* Features */}
            <div className="space-y-1.5 flex-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-gray-400 text-[10px] leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-2 border-t" style={{ borderColor: 'rgba(75,85,99,0.2)' }}>
              <motion.div
                className="flex items-center justify-between"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] font-medium text-gray-400">{buttonText}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-orange-300">İletişim</span>
                  <ButtonIcon className="h-3.5 w-3.5 text-orange-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;





