import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Users, 
  ShoppingCart, 
  Truck,
  Home,
  ChevronRight,
  FileText as FileTextIcon
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import { getContractDetail } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const ContractPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { websiteData, loading } = useWebsite();
  const [contractDetail, setContractDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(true);

  // Find the contract by slug
  const contract = websiteData?.contracts?.find(c => c.slug === slug);

  // Fetch contract detail
  useEffect(() => {
    const fetchContractDetail = async () => {
      if (!slug) return;
      
      try {
        setDetailLoading(true);
        const response = await getContractDetail(slug);
        console.log('Contract Detail Response:', response.data);
        setContractDetail(response.data);
      } catch (error) {
        console.error('Error fetching contract detail:', error);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchContractDetail();
  }, [slug]);

  // Get icon based on contract type
  const getContractIcon = (contractName: string) => {
    if (contractName.includes('Gizlilik')) {
      return Shield;
    } else if (contractName.includes('Satış')) {
      return ShoppingCart;
    } else if (contractName.includes('Teslimat')) {
      return Truck;
    } else if (contractName.includes('Üyelik')) {
      return Users;
    } else {
      return FileText;
    }
  };

  if (loading || detailLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <LoadingSpinner 
          size="xl" 
          text="Sözleşme Yükleniyor..." 
          variant="gaming" 
        />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        <SEOHead />
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
                  <span className="text-gray-300 font-medium">Sözleşme</span>
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
                      <FileTextIcon className="h-4 w-4 text-orange-300" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                        Sözleşme
                      </span>
                    </h1>
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
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <FileTextIcon className="h-16 w-16 text-orange-300/60 mx-auto mb-6" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Sözleşme bulunamadı
                  </h3>
                  <p className="text-gray-400 text-sm px-4 mb-8">Aradığınız sözleşme mevcut değil.</p>
                  
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-6 py-3 font-bold text-black rounded-xl bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] transition-all"
                  >
                    <span className="text-sm">ANA SAYFAYA DÖN</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const IconComponent = getContractIcon(contract.name);

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
                <span className="text-gray-300 font-medium">{contract.name}</span>
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
                    <IconComponent className="h-4 w-4 text-orange-300" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                      {contract.name}
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
                    YASAL SÖZLEŞME
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Content Section */}
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
                  {/* Contract Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                    <div 
                      className="w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.25)',
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-orange-300" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {contractDetail?.name || contract.name}
                      </h2>
                      <p className="text-gray-400 text-sm">Yasal sözleşme detayları</p>
                    </div>
                  </div>
                
                  {/* Contract Text Content */}
                  {contractDetail?.text ? (
                    <div 
                      className="space-y-6 text-gray-300 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-a:text-orange-300 prose-a:no-underline hover:prose-a:text-orange-200 prose-strong:text-white prose-code:text-orange-300 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-orange-400/20"
                      dangerouslySetInnerHTML={{ __html: contractDetail.text }}
                      style={{
                        '--tw-prose-body': '#d1d5db',
                        '--tw-prose-headings': '#ffffff',
                        '--tw-prose-links': '#a855f7',
                        '--tw-prose-bold': '#ffffff',
                        '--tw-prose-counters': '#9ca3af',
                        '--tw-prose-bullets': '#a855f7',
                        '--tw-prose-hr': '#4b5563',
                        '--tw-prose-quotes': '#f3f4f6',
                        '--tw-prose-quote-borders': '#a855f7',
                        '--tw-prose-captions': '#9ca3af',
                        '--tw-prose-code': '#a855f7',
                        '--tw-prose-pre-code': '#d1d5db',
                        '--tw-prose-pre-bg': '#111827',
                        '--tw-prose-th-borders': '#4b5563',
                        '--tw-prose-td-borders': '#4b5563'
                      } as React.CSSProperties}
                    />
                  ) : (
                    <div className="space-y-4 text-gray-400">
                      <p>Sözleşme yüklenemedi.</p>
                    </div>
                  )}
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

export default ContractPage;





