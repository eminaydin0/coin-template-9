import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Shield,
  Home,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const LiveSupportPage = () => {
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
                <span className="text-gray-300 font-medium">Canlı Destek</span>
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
                      Canlı Destek
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

        {/* Live Support Features List */}
        <section className="relative py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                {
                  icon: Clock,
                  title: "7/24 Destek",
                  description: "Her zaman yanınızdayız. Anında yanıt garantisi ile hizmetinizdeyiz.",
                  features: ["Anında yanıt", "Kesintisiz hizmet"],
                  badge: "7/24"
                },
                {
                  icon: Zap,
                  title: "Hızlı Yanıt",
                  description: "En kısa sürede dönüş yapıyoruz. Sorularınızı hızla çözüyoruz.",
                  features: ["1 saat içinde", "Hızlı çözüm"],
                  badge: "HIZLI"
                },
                {
                  icon: Shield,
                  title: "Güvenli İletişim",
                  description: "Şifrelenmiş iletişim ile güvenliğinizi ön planda tutuyoruz.",
                  features: ["SSL korumalı", "Gizlilik garantisi"],
                  badge: "GÜVENLİ"
                }
              ].map((feature, index) => (
                <SupportFeatureCard key={index} feature={feature} />
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="relative py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div 
                className="relative rounded-xl overflow-hidden border"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
              <div className="p-6 sm:p-8">
                <ContactForm
                  title="Canlı Destek"
                  description="7/24 canlı destek hizmetimiz için sorularınızı gönderin. En kısa sürede size dönüş yapacağız."
                  method="Canlı Destek"
                  backLink="/"
                  backText="Ana sayfaya dön"
                />
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

// Support Feature Card Component
interface SupportFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  badge: string;
}

interface SupportFeatureCardProps {
  feature: SupportFeature;
}

const SupportFeatureCard = ({ feature }: SupportFeatureCardProps) => {
  const Icon = feature.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
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

      <div className="p-3 flex flex-col h-full relative z-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
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
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full h-fit"
            style={{
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              color: 'rgba(249, 115, 22, 0.95)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {feature.badge}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col space-y-2">
          {/* Title */}
          <h3 className="text-white font-bold text-sm leading-tight group-hover:text-orange-300 transition-colors">
            {feature.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            {feature.description}
          </p>

          {/* Features List */}
          <div className="space-y-1.5 mt-1">
            {feature.features.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <div className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-gray-400 text-[10px] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSupportPage;





