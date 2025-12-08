import { useState, useEffect } from 'react';
import { getHomepageItems, getCategories } from '../services/api';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import ScrollToTopButton from '../components/ScrollToTopButton';
import NewsletterSignup from '../components/NewsletterSignup';
import CallToActionSection from '../components/CallToActionSection';
import HeroSection from '../components/HeroSection';
import PopularProductsSection from '../components/PopularProductsSection';
import MoreGamesSection from '../components/MoreGamesSection';
import BestSellingGamesSection from '../components/BestSellingGamesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CategoriesSection from '../components/CategoriesSection';
import CommonBackground from '../components/CommonBackground';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  slug: string;
  url?: string;
  isPopular?: boolean;
  rating?: number;
  people?: number;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
}

// Shimmer Skeleton Component - Simplified
const ShimmerSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
  </div>
);

const HomePage = () => {
  const [homepageItems, setHomepageItems] = useState<HomepageItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { getHeroList } = useWebsite();
  const heroList = getHeroList();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          getHomepageItems(20),
          getCategories()
        ]);
        setHomepageItems(itemsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        <SEOHead />
        <CommonBackground />

        <div className="w-full relative z-10">
          {/* Hero Section Shimmer */}
          <section className="w-full mb-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div className="h-[60vh] min-h-[450px] max-h-[600px] overflow-hidden rounded-2xl">
                <ShimmerSkeleton className="h-full w-full" />
              </div>
            </div>
          </section>

          {/* Content Sections Shimmer */}
          <section className="w-full mb-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShimmerSkeleton className="h-64 w-full rounded-2xl" />
                <ShimmerSkeleton className="h-64 w-full rounded-2xl" />
              </div>
              <ShimmerSkeleton className="h-96 w-full rounded-2xl" />
              <ShimmerSkeleton className="h-64 w-full rounded-2xl" />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar"
    >
      <SEOHead />

      {/* Subtle Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/50 to-black" />

      {/* Common Background */}
      <CommonBackground />

      <div className="w-full relative z-10">
        {/* HERO SECTION */}
        <section className="w-full mb-16 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <div className="h-[60vh] min-h-[450px] max-h-[600px] overflow-hidden rounded-3xl relative">
              {/* Subtle Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-orange-500/5 blur-xl -z-10" />

              <HeroSection
                heroList={heroList}
                currentHeroIndex={currentHeroIndex}
                setCurrentHeroIndex={setCurrentHeroIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS with Scroll Reveal */}
        <section className="w-full mb-16 px-4 sm:px-6 lg:px-8">
          <div className="w-full space-y-12">

            {/* Row 1: Popular Products */}
            <ScrollRevealSection>
              <SectionCard>
                <PopularProductsSection />
              </SectionCard>
            </ScrollRevealSection>

            {/* Row 2: Categories Section */}
            {categories.length > 0 && (
              <ScrollRevealSection>
                <SectionCard fullWidth>
                  <CategoriesSection categories={categories} />
                </SectionCard>
              </ScrollRevealSection>
            )}

            {/* Row 3: Best Selling Games */}
            <ScrollRevealSection>
              <SectionCard>
                <BestSellingGamesSection homepageItems={homepageItems} />
              </SectionCard>
            </ScrollRevealSection>

            {/* Row 5: How It Works - Full Width */}
            <ScrollRevealSection>
              <SectionCard fullWidth>
                <HowItWorksSection />
              </SectionCard>
            </ScrollRevealSection>


            {/* Row 4: More Games - Full Width */}
            <ScrollRevealSection>
              <SectionCard fullWidth>
                <MoreGamesSection homepageItems={homepageItems} />
              </SectionCard>
            </ScrollRevealSection>


            {/* Row 6: Newsletter & CTA - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollRevealSection>
                <SectionCard>
                  <NewsletterSignup />
                </SectionCard>
              </ScrollRevealSection>

              <ScrollRevealSection>
                <SectionCard>
                  <CallToActionSection variant="compact" />
                </SectionCard>
              </ScrollRevealSection>
            </div>
          </div>
        </section>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </div>
  );
};

// Scroll Reveal Wrapper Component - Simplified
const ScrollRevealSection = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      {children}
    </div>
  );
};

// Enhanced Section Card Component - Modern Glassmorphism Style
const SectionCard = ({
  children,
  fullHeight = false,
  fullWidth = false
}: {
  children: React.ReactNode;
  fullHeight?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <div className={`relative ${fullHeight ? 'h-full' : ''} ${fullWidth ? 'w-full' : ''}`}>
      {/* Modern Glassmorphism Container */}
      <div
        className="relative backdrop-blur-xl p-6 sm:p-8 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.05)',
        }}
      >
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
