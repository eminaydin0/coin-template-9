import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Gamepad2,
  History,
  Zap,
  HelpCircle,
  MessageCircle,
  Search,
  ChevronDown,
  Keyboard,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWebsite } from '../context/WebsiteContext';
import { useCheckout } from '../context/CheckoutContext';
import { getCategories } from '../services/api';

interface HeaderProps {
  onOpenSearch: () => void;
  hideHeader?: boolean;
}

const navLinks = [
  { href: '/', label: 'Ana Sayfa', icon: Gamepad2 },
  { href: '/oyunlar', label: 'Oyunlar', icon: Zap },
  { href: '/rehber', label: 'Rehber', icon: HelpCircle },
  { href: '/iletisim', label: 'İletişim', icon: MessageCircle },
];

/**
 * CLEAN MODERN HEADER
 * - Minimal, geometric design
 * - Subtle animations
 * - Clean typography
 * - Modern spacing and layout
 */
interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
}

const Header = ({ onOpenSearch, hideHeader = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isMobileGamesOpen, setIsMobileGamesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCompact, setIsCompact] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const { isCheckoutModalOpen } = useCheckout();
  const navigate = useNavigate();
  const location = useLocation();
  const { getInfoValue } = useWebsite();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const gamesDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const toggleUserMenu = () => setIsUserMenuOpen((s) => !s);

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    };
    loadCategories();
  }, []);

  // Dış tıklama ile kullanıcı menüsü ve games dropdown kapanır
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (isGamesDropdownOpen && gamesDropdownRef.current && !gamesDropdownRef.current.contains(e.target as Node)) {
        setIsGamesDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [isUserMenuOpen, isGamesDropdownOpen]);

  // Ctrl/⌘+K ile arama
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenSearch]);

  // Scroll olduğunda kompakt moda geç
  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (hideHeader || isCheckoutModalOpen) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50"
      role="banner"
    >
      {/* Modern Background */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl border-b border-orange-500/10" />

      {/* Main Header */}
      <div className={`relative transition-all duration-300 ${isCompact ? 'py-2' : 'py-3'}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <div className="flex items-center justify-between">
            {/* Compact Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Ana sayfa">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Gamepad2 className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                {getInfoValue('TITLE')}
              </h1>
            </Link>

            {/* Compact Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => {
                // Oyunlar için dropdown
                if (href === '/oyunlar') {
                  return (
                    <div key={href} className="relative" ref={gamesDropdownRef}>
                      <button
                        onMouseEnter={() => setIsGamesDropdownOpen(true)}
                        onMouseLeave={() => setIsGamesDropdownOpen(false)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive(href)
                            ? 'text-white bg-orange-500/20'
                            : 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{label}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${isGamesDropdownOpen ? 'rotate-180' : ''}`} />
                        {isActive(href) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Categories Dropdown */}
                      <AnimatePresence>
                        {isGamesDropdownOpen && categories.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onMouseEnter={() => setIsGamesDropdownOpen(true)}
                            onMouseLeave={() => setIsGamesDropdownOpen(false)}
                            className="absolute top-full left-0 mt-2 w-64 bg-black/95 rounded-lg shadow-lg border border-orange-500/20 overflow-hidden z-50 backdrop-blur-xl"
                          >
                            <div className="p-2 max-h-[400px] overflow-y-auto">
                              <Link
                                to="/oyunlar"
                                onClick={() => setIsGamesDropdownOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-orange-300 hover:bg-orange-500/10 transition-colors mb-2 border-b border-gray-800 pb-2"
                              >
                                <Zap className="h-3.5 w-3.5" />
                                <span>Tüm Kategoriler</span>
                              </Link>
                              <div className="space-y-1">
                                {categories.map((category) => (
                                  <Link
                                    key={category.id}
                                    to={`/oyunlar/${category.slug}`}
                                    onClick={() => setIsGamesDropdownOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                                  >
                                    {category.url ? (
                                      <img
                                        src={category.url}
                                        alt={category.name}
                                        className="w-6 h-6 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
                                        <Gamepad2 className="h-3 w-3 text-orange-300" />
                                      </div>
                                    )}
                                    <span className="truncate">{category.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Diğer linkler normal
                return (
                <Link
                  key={href}
                  to={href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive(href)
                        ? 'text-white bg-orange-500/20'
                        : 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10'
                  }`}
                >
                    <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                  {isActive(href) && (
                    <motion.div
                        layoutId={`activeIndicator-${href}`}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
                );
              })}

              {isAuthenticated && (
                <Link
                  to="/siparislerim"
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/siparislerim')
                      ? 'text-white bg-orange-500/20'
                      : 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10'
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Siparişlerim</span>
                  {isActive('/siparislerim') && (
                    <motion.div
                      layoutId="activeIndicatorOrders"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )}
            </nav>

            {/* Compact Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                aria-label="Oyun ara"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Ara</span>
              </button>

              {isAuthenticated ? (
                <>
                  {/* Cart Button */}
                  <Link
                    to="/sepet"
                    className="relative flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                    aria-label="Sepet"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-semibold text-white bg-orange-500 rounded-full">
                        {getItemCount() > 99 ? '99+' : getItemCount()}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="menu"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="hidden lg:inline max-w-[100px] truncate text-xs">
                        {user?.firstName || 'Kullanıcı'}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-black/95 rounded-lg shadow-lg border border-orange-500/20 overflow-hidden z-50 backdrop-blur-xl"
                          role="menu"
                        >
                          {/* Compact User Header */}
                          <div className="px-3 py-3 border-b border-gray-800">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-xs font-semibold text-white truncate">
                                  {user?.firstName} {user?.lastName}
                                </h3>
                                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Compact Menu Items */}
                          <div className="p-1.5">
                            <Link
                              to="/profil"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                            >
                              <Settings className="h-3.5 w-3.5 text-gray-400" />
                              <span>Profil Ayarları</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              <span>Çıkış Yap</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/giris-yap"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit-ol"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

            {/* Compact Mobile Actions */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={onOpenSearch}
                className="p-1.5 rounded-lg text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                aria-label="Ara"
              >
                <Search className="h-4 w-4" />
              </button>

              {isAuthenticated && (
                <Link
                  to="/sepet"
                  className="relative p-1.5 rounded-lg text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                  aria-label="Sepet"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {getItemCount() > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-semibold text-white bg-orange-500 rounded-full">
                      {getItemCount() > 99 ? '99+' : getItemCount()}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={toggleMenu}
                className="p-1.5 rounded-lg text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                aria-label="Menü"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-black/95 shadow-xl border-l border-orange-500/20 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile"
            >
              <div className="flex flex-col h-full">
                {/* Compact Mobile Header */}
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">Menü</h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-orange-300 hover:bg-orange-500/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Compact Mobile Content */}
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  {/* Search */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors mb-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
                      <Search className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-white">Oyun Ara</div>
                      <div className="text-[10px] text-gray-400">Ctrl+K</div>
                    </div>
                    <Keyboard className="h-3.5 w-3.5 text-gray-500" />
                  </button>

                  {/* Navigation Links */}
                  <div className="space-y-1 mb-3">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                      // Oyunlar için dropdown
                      if (href === '/oyunlar') {
                        return (
                          <div key={href}>
                            <button
                              onClick={() => setIsMobileGamesOpen(!isMobileGamesOpen)}
                              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                                isActive(href)
                                  ? 'text-orange-300 bg-orange-500/20'
                                  : 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                              </div>
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMobileGamesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {isMobileGamesOpen && categories.length > 0 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-6 pr-3 py-2 space-y-1">
                                    <Link
                                      to="/oyunlar"
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsMobileGamesOpen(false);
                                      }}
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-orange-300 hover:bg-orange-500/10 transition-colors"
                                    >
                                      <Zap className="h-3.5 w-3.5" />
                                      <span>Tüm Kategoriler</span>
                                    </Link>
                                    {categories.map((category) => (
                                      <Link
                                        key={category.id}
                                        to={`/oyunlar/${category.slug}`}
                                        onClick={() => {
                                          setIsMenuOpen(false);
                                          setIsMobileGamesOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                                      >
                                        {category.url ? (
                                          <img
                                            src={category.url}
                                            alt={category.name}
                                            className="w-5 h-5 rounded object-cover"
                                          />
                                        ) : (
                                          <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center">
                                            <Gamepad2 className="h-2.5 w-2.5 text-orange-300" />
                                          </div>
                                        )}
                                        <span className="truncate">{category.name}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      // Diğer linkler normal
                      return (
                      <Link
                        key={href}
                        to={href}
                        onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive(href)
                              ? 'text-orange-300 bg-orange-500/20'
                              : 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10'
                        }`}
                      >
                          <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                      );
                    })}

                    {isAuthenticated && (
                      <Link
                        to="/siparislerim"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive('/siparislerim')
                            ? 'text-orange-300 bg-orange-500/20'
                            : 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10'
                        }`}
                      >
                        <History className="h-4 w-4" />
                        <span>Siparişlerim</span>
                      </Link>
                    )}

                    {isAuthenticated && (
                      <Link
                        to="/sepet"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Sepet</span>
                        {getItemCount() > 0 && (
                          <span className="ml-auto flex items-center justify-center min-w-[18px] h-4 px-1.5 text-[10px] font-semibold text-white bg-orange-500 rounded-full">
                            {getItemCount() > 99 ? '99+' : getItemCount()}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>

                  {/* User Section */}
                  {isAuthenticated ? (
                    <div className="pt-3 border-t border-gray-800 space-y-1">
                      <div className="px-3 py-2.5 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/profil"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Profil Ayarları</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-gray-800 space-y-1.5">
                      <Link
                        to="/giris-yap"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-3 py-2.5 rounded-lg text-xs font-medium text-center text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        to="/kayit-ol"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-center text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all"
                      >
                        Kayıt Ol
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;





