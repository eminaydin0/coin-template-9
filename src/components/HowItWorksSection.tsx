import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Gamepad2, 
  ShoppingCart, 
  CreditCard, 
  Download,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  Trophy,
  Shield,
  Clock,
  Star,
  Target,
  Swords,
  Crown,
  Award,
  Medal,
  Flame,
  Rocket,
  Heart,
  Gem,
  Dice1,
  Joystick,
  Sword,
  Skull,
  Coins,
  Gift
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    { 
      id: 1, 
      title: "Hesap Oluştur", 
      description: "Hızlı ve kolay kayıt",
      icon: CheckCircle,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      title: "Oyun Seç", 
      description: "Binlerce oyun arasından seç",
      icon: Gamepad2,
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: 3, 
      title: "Sepete Ekle", 
      description: "Favorilerini sepete ekle",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: 4, 
      title: "Ödeme Yap", 
      description: "Güvenli ödeme sistemi",
      icon: CreditCard,
      color: "from-yellow-500 to-orange-500"
    },
    { 
      id: 5, 
      title: "Kodunu Al", 
      description: "Anında kod teslimatı",
      icon: Download,
      color: "from-orange-500 to-red-500"
    }
  ];

  // Game icons for decoration - Expanded list
  const gameIcons = [
    { Icon: Gamepad2, position: { top: '5%', right: '2%' }, delay: 0 },
    { Icon: Trophy, position: { top: '8%', right: '8%' }, delay: 0.2 },
    { Icon: Star, position: { top: '12%', right: '14%' }, delay: 0.4 },
    { Icon: Play, position: { top: '15%', right: '20%' }, delay: 0.6 },
    { Icon: Shield, position: { top: '18%', right: '26%' }, delay: 0.8 },
    { Icon: Clock, position: { top: '5%', left: '2%' }, delay: 0.1 },
    { Icon: Target, position: { top: '8%', left: '8%' }, delay: 0.3 },
    { Icon: Swords, position: { top: '12%', left: '14%' }, delay: 0.5 },
    { Icon: Crown, position: { top: '15%', left: '20%' }, delay: 0.7 },
    { Icon: Award, position: { top: '18%', left: '26%' }, delay: 0.9 },
    { Icon: Medal, position: { top: '2%', right: '35%' }, delay: 0.15 },
    { Icon: Flame, position: { top: '2%', left: '35%' }, delay: 0.25 },
    { Icon: Rocket, position: { top: '20%', right: '32%' }, delay: 0.35 },
    { Icon: Heart, position: { top: '20%', left: '32%' }, delay: 0.45 },
    { Icon: Gem, position: { top: '22%', right: '38%' }, delay: 0.55 },
    { Icon: Dice1, position: { top: '22%', left: '38%' }, delay: 0.65 },
    { Icon: Joystick, position: { top: '25%', right: '44%' }, delay: 0.75 },
    { Icon: Sword, position: { top: '25%', left: '44%' }, delay: 0.85 },
    { Icon: Skull, position: { top: '28%', right: '50%' }, delay: 0.95 },
    { Icon: Coins, position: { top: '28%', left: '50%' }, delay: 1.05 },
    { Icon: Gift, position: { top: '30%', right: '56%' }, delay: 1.15 },
    { Icon: Zap, position: { top: '30%', left: '56%' }, delay: 1.25 },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-10 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                  }}
                >
                  <Sparkles className="h-7 w-7 text-orange-400 relative z-10" />
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
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    Nasıl Çalışır?
                  </h3>
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="h-6 w-6 text-orange-400 fill-orange-400" />
                  </motion.div>
                </div>
                <p className="text-gray-400 text-base font-medium">
                  5 kolay adımda oyunlarınızı alın ve oynamaya başlayın
                </p>
              </div>
            </div>
          </div>

          {/* Floating Game Icons - Multiple layers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {gameIcons.map((item, index) => {
              const { Icon, position, delay } = item;
              return (
                <motion.div
                  key={index}
                  className="absolute text-orange-400/30"
                  style={{
                    ...position,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4 + index * 0.3,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut",
                  }}
                >
                  <Icon className="h-10 w-10 sm:h-12 sm:w-12" />
                </motion.div>
              );
            })}
          </div>

          {/* Additional floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-orange-400/20"
              style={{
                top: `${10 + i * 12}%`,
                left: `${5 + (i % 4) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Enhanced Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <StepCard step={step} index={index} totalSteps={steps.length} />
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Link
            to="/rehber"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 115, 22, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(249, 115, 22, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Detaylı Rehberi İncele</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const StepCard = ({ step, index, totalSteps }: { 
  step: { 
    id: number; 
    title: string; 
    description?: string;
    icon: any; 
    color?: string;
  }; 
  index: number; 
  totalSteps: number 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Connection Arrow for Desktop */}
      {step.id < totalSteps && (
        <div className="hidden lg:block absolute top-1/2 -right-2 z-20">
          <motion.div
            animate={{ 
              x: [0, 5, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: index * 0.3
            }}
          >
            <ArrowRight className="h-6 w-6 text-orange-400/50" />
          </motion.div>
        </div>
      )}

      <motion.div 
        className="relative rounded-2xl border p-6 h-full flex flex-col transition-all duration-300"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
          border: isHovered
            ? '1px solid rgba(249, 115, 22, 0.5)'
            : '1px solid rgba(75, 85, 99, 0.3)',
          boxShadow: isHovered
            ? '0 12px 40px rgba(249, 115, 22, 0.25)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Animated Background Glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${step.color || 'from-orange-500 to-red-500'} opacity-0 rounded-2xl blur-xl`}
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Step Number Badge */}
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 transition-all duration-300 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))`,
              boxShadow: isHovered
                ? '0 4px 16px rgba(249, 115, 22, 0.5)'
                : '0 2px 8px rgba(249, 115, 22, 0.3)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10">{step.id}</span>
          </motion.div>

          {/* Icon Container */}
          <motion.div 
            className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 relative overflow-hidden bg-gradient-to-br ${step.color || 'from-orange-500/20 to-red-500/20'}`}
            style={{
              border: isHovered
                ? '1px solid rgba(249, 115, 22, 0.5)'
                : '1px solid rgba(249, 115, 22, 0.3)',
              boxShadow: isHovered
                ? '0 4px 16px rgba(249, 115, 22, 0.3)'
                : '0 2px 8px rgba(249, 115, 22, 0.15)',
            }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${step.color || 'from-orange-500/30 to-red-500/30'}`}
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <step.icon className="h-7 w-7 text-orange-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-orange-300 transition-colors duration-300 relative z-10">
            {step.title}
          </h3>
          {step.description && (
            <p className="text-gray-400 text-sm font-medium relative z-10">
              {step.description}
            </p>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t relative z-10" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${step.color || 'from-orange-500 to-red-500'} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '100%' : `${(step.id / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-gray-500 font-bold">
              {step.id}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-2xl"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HowItWorksSection;





