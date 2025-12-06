import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  ArrowRight,
  Home,
  ChevronRight,
  Layers
} from 'lucide-react';
import { getCategories } from '../services/api';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
  productCount?: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Kategoriler yükleniyor...');
        const response = await getCategories();
        console.log('API Response:', response);
        setCategories(response.data || []);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <CommonBackground />
        <LoadingSpinner 
          size="xl" 
          text="Kategoriler Yükleniyor..." 
          variant="gaming" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
      <SEOHead />
      
      {/* Common Background */}
      <CommonBackground />

      <div className="w-full relative z-10">
        {/* Header Section - Anasayfa Stili */}
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
                <span className="text-gray-300 font-medium">Kategoriler</span>
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
                    <Layers className="h-4 w-4 text-orange-300" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                      Oyun Kategorileri
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
                    {categories.length} KATEGORİ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {categories.length === 0 ? (
                <div 
                  className="text-center py-16 rounded-2xl border"
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Gamepad2 className="h-12 w-12 text-orange-300/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Kategori bulunamadı
                  </h3>
                  <p className="text-gray-400 text-sm">Yakında yeni kategoriler eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {categories.map((category, index) => (
                    <CategoryCard key={category.id} category={category} index={index} />
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

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link 
        to={`/oyunlar/${category.slug}`}
        className="block group"
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
          {/* Compact Category Image */}
          <div className="relative h-32 overflow-hidden">
            {category.url && !imageError ? (
              <img
                src={category.url}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center">
                <Gamepad2 className="h-12 w-12 text-orange-300/50" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            {/* Compact Product Count Badge */}
            {category.productCount && category.productCount > 0 && (
              <div
                className="absolute top-2 right-2 rounded-lg px-2 py-1 z-10"
                style={{
                  background: 'rgba(249, 115, 22, 0.2)',
                  border: '1px solid rgba(249, 115, 22, 0.35)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="text-white text-[10px] font-bold">{category.productCount}+ ürün</span>
              </div>
            )}
          </div>

          {/* Compact Content */}
          <div className="p-3 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-white font-bold text-sm mb-1.5 line-clamp-2 leading-tight group-hover:text-orange-300 transition-colors">
              {category.name}
            </h3>
            
            {/* Description */}
            {category.description && (
              <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            )}

            {/* Compact Action Button */}
            <div className="mt-auto pt-2 border-t" style={{ borderColor: 'rgba(75,85,99,0.2)' }}>
              <motion.div
                className="flex items-center justify-between"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] font-medium text-gray-400">Kategoriyi Gör</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-orange-300">Keşfet</span>
                  <ArrowRight className="h-3.5 w-3.5 text-orange-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoriesPage;





