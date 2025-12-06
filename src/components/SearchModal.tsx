import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Gamepad2, ShoppingCart, Keyboard, Loader2, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategories, getCategoryProducts } from '../services/api';

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
    slug?: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  homepageItems: HomepageItem[];
}

const useDebouncedCallback = (fn: (...args: any[]) => void, delay = 300) => {
  const timeout = useRef<number | null>(null);
  return useCallback(
    (...args: any[]) => {
      if (timeout.current) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
};

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const q = query.trim();
  try {
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-orange-500/40 text-orange-200 rounded px-0.5 font-semibold">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  } catch {
    return text;
  }
};

const SearchModal = ({ isOpen, onClose, homepageItems }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HomepageItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [allItems, setAllItems] = useState<HomepageItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => searchInputRef.current?.focus(), 100);
    loadAllItems();
  }, [isOpen]);

  const loadAllItems = async () => {
    setIsLoadingItems(true);
    setError(null);
    try {
      const categoriesResponse = await getCategories();
      const categories = categoriesResponse.data || [];
      const allProductsPromises = categories.map(async (category: any) => {
        try {
          const productsResponse = await getCategoryProducts(category.slug);
          const products = productsResponse.data || [];
          return products.map((product: any) => ({
            ...product,
            category: { name: category.name, slug: category.slug },
          }));
        } catch (e) {
          console.error(`Kategori ${category.name} ürünleri yüklenirken hata:`, e);
          return [];
        }
      });
      const allProductsArrays = await Promise.all(allProductsPromises);
      const flattened = allProductsArrays.flat();
      setAllItems(flattened);
    } catch (e) {
      console.error('Ürünler yüklenirken hata:', e);
      setError('Ürünler yüklenirken bir sorun oluştu. Anasayfa verileri gösteriliyor.');
      setAllItems(homepageItems);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const itemsToSearch = useMemo(() => (allItems.length ? allItems : homepageItems), [allItems, homepageItems]);

  const runSearch = useCallback(
    (query: string) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        setSearchResults([]);
        setActiveIndex(0);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const filtered = itemsToSearch.filter((item) => {
        const name = item.name?.toLowerCase() || '';
        const cat = item.category?.name?.toLowerCase() || '';
        if (name.includes(q) || cat.includes(q)) return true;
        const qWords = q.split(' ').filter(Boolean);
        const nameWords = name.split(' ');
        const catWords = cat.split(' ');
        return qWords.some((w) => nameWords.some((nw) => nw.includes(w)) || catWords.some((cw) => cw.includes(w)));
      });

      const sorted = filtered.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName === q && bName !== q) return -1;
        if (bName === q && aName !== q) return 1;
        if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
        if (bName.startsWith(q) && !aName.startsWith(q)) return 1;
        if (aName.includes(q) && !bName.includes(q)) return -1;
        if (bName.includes(q) && !aName.includes(q)) return 1;
        return aName.localeCompare(bName);
      });

      setSearchResults(sorted);
      setActiveIndex(0);
      setIsSearching(false);
    },
    [itemsToSearch]
  );

  const debouncedSearch = useDebouncedCallback(runSearch, 250);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
    } catch {
      return `${price} ₺`;
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setAllItems([]);
    setIsLoadingItems(false);
    setActiveIndex(0);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (!searchResults.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
        const elements = listRef.current?.querySelectorAll('[data-row]');
        elements?.[Math.min(activeIndex + 1, searchResults.length - 1)]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        const elements = listRef.current?.querySelectorAll('[data-row]');
        elements?.[Math.max(activeIndex - 1, 0)]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      if (e.key === 'Enter') {
        const target = searchResults[activeIndex];
        if (target) {
          const el = document.getElementById(`search-link-${target.id}`);
          (el as HTMLAnchorElement)?.click();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, searchResults, activeIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Command Palette Style Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl z-10"
          >
            {/* Main Container */}
            <div
              className="rounded-2xl overflow-hidden border shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 15, 25, 0.95))',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.1)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Search Input Bar */}
              <div className="relative px-6 py-5 border-b" style={{ borderColor: 'rgba(249, 115, 22, 0.15)' }}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.15))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <Search className="h-5 w-5 text-orange-300" />
                    </div>
                  </div>
                  
                  <div className="flex-1 relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Oyun ara... (örn: Fortnite, Valorant)"
                      className="w-full bg-transparent text-white placeholder-gray-500 text-lg font-medium focus:outline-none"
                      style={{ caretColor: 'rgba(249, 115, 22, 1)' }}
                      aria-autocomplete="list"
                      aria-controls="search-results"
                      aria-expanded={!!searchQuery}
                    />
                    {isSearching && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Keyboard Hints */}
                  <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        color: 'rgba(249, 115, 22, 0.9)',
                      }}
                    >
                      <Keyboard className="h-3 w-3" />
                      <span>↑↓</span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        color: 'rgba(249, 115, 22, 0.9)',
                      }}
                    >
                      <span>Enter</span>
                    </div>
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(75, 85, 99, 0.2)',
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                      }}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>
                {error && (
                  <p className="mt-3 text-xs text-orange-300/80 px-2">{error}</p>
                )}
              </div>

              {/* Results Container */}
              <div
                ref={listRef}
                id="search-results"
                className="max-h-[60vh] overflow-y-auto gaming-scrollbar"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                {isLoadingItems ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 rounded-full border-2 border-orange-500/30 border-t-orange-500 mb-4"
                    />
                    <h3 className="text-base font-bold text-white mb-1">Ürünler Yükleniyor</h3>
                    <p className="text-sm text-gray-400">Kategorilerden ürünler getiriliyor...</p>
                  </div>
                ) : searchQuery ? (
                  isSearching ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
                        <span className="text-sm">Aranıyor...</span>
                      </div>
                    </div>
                  ) : searchResults.length ? (
                    <div className="p-2">
                      {/* Results Count */}
                      <div className="px-4 py-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{
                              background: 'rgba(249, 115, 22, 0.15)',
                              border: '1px solid rgba(249, 115, 22, 0.3)',
                              color: 'rgba(249, 115, 22, 0.95)',
                            }}
                          >
                            {searchResults.length} Sonuç
                          </span>
                        </div>
                      </div>

                      {/* Results List */}
                      <div className="space-y-1">
                        {searchResults.map((item, index) => (
                          <motion.div
                            key={item.id}
                            data-row
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                          >
                            <Link
                              id={`search-link-${item.id}`}
                              to={`/epin/${item.slug}`}
                              onClick={handleClose}
                              className="block"
                            >
                              <motion.div
                                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                                  activeIndex === index
                                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10'
                                    : 'hover:bg-white/5'
                                }`}
                                style={{
                                  border: activeIndex === index
                                    ? '1px solid rgba(249, 115, 22, 0.4)'
                                    : '1px solid transparent',
                                  boxShadow: activeIndex === index
                                    ? '0 4px 12px rgba(249, 115, 22, 0.15)'
                                    : 'none',
                                }}
                                whileHover={{ x: 4 }}
                              >
                                {/* Image/Icon */}
                                <div className="flex-shrink-0">
                                  <div
                                    className="w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center"
                                    style={{
                                      background: 'rgba(249, 115, 22, 0.1)',
                                      border: '1px solid rgba(249, 115, 22, 0.25)',
                                    }}
                                  >
                                    {item.url ? (
                                      <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLImageElement;
                                          target.style.display = 'none';
                                          const sib = target.nextElementSibling as HTMLElement;
                                          if (sib) sib.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className="absolute inset-0 hidden items-center justify-center"
                                      style={{ display: item.url ? ('none' as any) : 'flex' }}
                                    >
                                      <Gamepad2 className="h-6 w-6 text-orange-300/60" />
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-bold text-sm mb-1 truncate">
                                    {highlight(item.name, searchQuery)}
                                  </h3>
                                  {item.category?.name && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <Tag className="h-3 w-3 text-orange-400/60" />
                                      <span className="text-xs text-gray-400 truncate">
                                        {highlight(item.category.name, searchQuery)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="text-sm font-bold px-2.5 py-0.5 rounded-lg"
                                      style={{
                                        background: 'rgba(249, 115, 22, 0.2)',
                                        color: 'rgba(251, 146, 60, 1)',
                                      }}
                                    >
                                      {formatPrice(item.price)}
                                    </span>
                                    {item.originalPrice && (
                                      <span className="text-xs text-gray-500 line-through">
                                        {formatPrice(item.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex-shrink-0">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                      background: activeIndex === index
                                        ? 'rgba(249, 115, 22, 0.2)'
                                        : 'rgba(75, 85, 99, 0.2)',
                                    }}
                                  >
                                    <ArrowRight className="h-4 w-4 text-orange-300" />
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <Search className="h-10 w-10 text-orange-300/60" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">Sonuç Bulunamadı</h3>
                      <p className="text-sm text-gray-400 max-w-md">
                        "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyin.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <Search className="h-12 w-12 text-orange-300/70" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-white mb-3"
                    >
                      <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                        Oyun Ara
                      </span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-gray-400 max-w-md"
                    >
                      Oyun adı veya kategori yazarak arama yapabilirsiniz. Klavye kısayollarını kullanarak hızlıca gezinin.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3 mt-6"
                    >
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                          color: 'rgba(249, 115, 22, 0.9)',
                        }}
                      >
                        <Keyboard className="h-3.5 w-3.5" />
                        <span>↑↓ Gezin</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                          color: 'rgba(249, 115, 22, 0.9)',
                        }}
                      >
                        <span>Enter Seç</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                          color: 'rgba(249, 115, 22, 0.9)',
                        }}
                      >
                        <span>Esc Kapat</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
