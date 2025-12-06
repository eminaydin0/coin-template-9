import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Gamepad2, Flame, Star, TrendingUp, Zap } from 'lucide-react';

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
  categoryName?: string;
}

interface BestSellingGamesSectionProps {
  homepageItems: HomepageItem[];
}

const BestSellingGamesSection: React.FC<BestSellingGamesSectionProps> = ({ homepageItems }) => {
  const [bestSellingGames, setBestSellingGames] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (homepageItems.length > 0) {
      setBestSellingGames(homepageItems.slice(0, 8));
      setIsLoading(false);
    }
  }, [homepageItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative h-12 w-12">
            <motion.div 
              className="absolute inset-0 rounded-full border-3 border-orange-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-3 border-t-orange-400 border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <span className="text-white text-base font-semibold tracking-wide">
            Oyunlar Yükleniyor...
          </span>
        </motion.div>
      </div>
    );
  }

  if (bestSellingGames.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-8 h-8 text-orange-400/60" />
        </div>
        <span className="text-gray-400 text-base">
          Henüz en çok satan oyun bulunmuyor
        </span>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Animated Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                  }}
                >
                  <Flame className="h-6 w-6 text-orange-400 relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    En Çok Satan Oyunlar
                  </h3>
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="h-5 w-5 text-orange-400 fill-orange-400" />
                  </motion.div>
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  Oyuncuların en çok tercih ettikleri oyunlar
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellingGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <BestSellingCard game={game} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BestSellingCard = ({ game, index }: { game: HomepageItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/epin/${game.slug}`}
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden h-full flex flex-col rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ 
          y: -8,
          boxShadow: '0 20px 60px rgba(249, 115, 22, 0.3)',
          borderColor: 'rgba(249, 115, 22, 0.5)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <AnimatePresence>
            {game.url && !imageError ? (
              <motion.img
                src={game.url}
                alt={game.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.4 }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500/30 via-orange-600/20 to-orange-700/10 flex items-center justify-center">
                <Gamepad2 className="h-16 w-16 text-orange-300/60" />
              </div>
            )}
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Best Seller Badge */}
          <motion.div
            className="absolute top-3 right-3 rounded-lg px-3 py-1.5 flex items-center gap-1.5 z-10"
            style={{
              background: 'rgba(249, 115, 22, 0.9)',
              border: '1px solid rgba(251, 146, 60, 0.5)',
            }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Flame className="h-3.5 w-3.5 text-white" />
            <span className="text-white text-xs font-bold">EN ÇOK SATAN</span>
          </motion.div>

          {/* Rating Badge */}
          {game.rating && (
            <motion.div
              className="absolute top-3 left-3 rounded-lg px-3 py-1.5 flex items-center gap-1.5 z-10"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
              <span className="text-white text-sm font-bold">{game.rating}</span>
            </motion.div>
          )}

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-orange-500/0 pointer-events-none"
            animate={{
              background: isHovered ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Users */}
          <div className="flex items-center justify-between mb-3">
            {game.categoryName && (
              <motion.span
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  color: 'rgb(251, 146, 60)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {game.categoryName}
              </motion.span>
            )}
            {game.people !== undefined && game.people > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium ml-auto">
                <Users className="h-3.5 w-3.5" />
                <span>{game.people.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-base mb-auto line-clamp-2 leading-snug transition-colors duration-300"
              style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}>
            {game.name}
          </h3>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {game.originalPrice && game.originalPrice !== game.price && (
                  <span className="text-gray-500 text-xs line-through mb-0.5">
                    {typeof game.originalPrice === 'string' 
                      ? game.originalPrice 
                      : `${game.originalPrice}₺`}
                  </span>
                )}
                <span className="text-orange-400 font-black text-lg">
                  {typeof game.price === 'string' ? game.price : `${game.price}₺`}
                </span>
              </div>
              
              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                }}
                whileHover={{ 
                  scale: 1.1,
                  background: 'rgba(249, 115, 22, 0.25)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="h-5 w-5 text-orange-400" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </Link>
  );
};

export default BestSellingGamesSection;
