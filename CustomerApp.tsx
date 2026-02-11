import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { ArrowUp, Menu, ShoppingBag, X, User as UserIcon, LogOut, LogIn, History, Lock, Loader2, ChevronDown, Instagram, Facebook, Youtube, ChevronRight, MapPin, Phone, Mail, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME, CONTACT_WA } from './constants';
import { CartItem, Costume, ViewState, BookingDetails, User } from './types';
import CartDrawer from './components/CartDrawer';
import CostumeDetailModal from './components/CostumeDetailModal';
import api, { authService, cartService, productService, galleryService } from './services/api';
import SizeGuideModal from './components/SizeGuideModal';
import LoginModal from './components/LoginModal';
import { UserProfileModal, RentalHistoryModal, ChangePasswordModal } from './components/UserMenuModals';
import { HelmetProvider } from 'react-helmet-async';
import { Shield, Sparkles, Scissors, Zap, Truck, Award } from 'lucide-react';

// Lazy loaded components
const HomeView = React.lazy(() => import('./components/HomeView'));
const CatalogView = React.lazy(() => import('./components/CatalogView'));
const GalleryPage = React.lazy(() => import('./components/GalleryPage'));
const SuccessView = React.lazy(() => import('./components/SuccessView'));


const CustomerApp: React.FC = () => {
  // Debug environment variable
  console.log('Current VITE_API_URL:', import.meta.env.VITE_API_URL || 'Defaulting to localhost');

  const [view, setView] = useState<ViewState>('HOME');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [lastBooking, setLastBooking] = useState<BookingDetails | null>(null);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, number>>({});
  const [costumes, setCostumes] = useState<Costume[]>([]);

  // User Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeUserModal, setActiveUserModal] = useState<'PROFILE' | 'HISTORY' | 'PASSWORD' | null>(null);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'ERROR'>('IDLE');
  /* New Newsletter State */
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('LOADING');
    try {
      await api.post('/newsletter', { email: newsletterEmail });
      setNewsletterStatus('SUCCESS');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('IDLE'), 3000);
    } catch (err) {
      console.error('Newsletter failed:', err);
      setNewsletterStatus('ERROR');
      setTimeout(() => setNewsletterStatus('IDLE'), 3000);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Fetch Products
  useEffect(() => {
    productService.getProducts().then(data => {
      setCostumes(data);
    }).catch(console.error);
  }, []);

  // Check for logged-in user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        // Optimistically set user from storage first
        setUser(JSON.parse(storedUser));

        // Verify with backend
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          console.error("Session expired or invalid", error);
          setUser(null);
        }
      }
    };

    checkAuth();

    // Fetch Availability
    const fetchAvailability = async () => {
      try {
        const res = await api.get('/bookings/availability');
        const map: Record<string, number> = {};
        res.data.forEach((item: { item_id: string, booked_qty: number }) => {
          map[item.item_id] = item.booked_qty;
        });
        setAvailabilityMap(map);
      } catch (err) {
        console.error("Failed to fetch availability", err);
      }
    };
    fetchAvailability();
  }, []);

  // Email Verification Logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify_token');

    // Use window property or module variable to prevent double-fire in StrictMode
    // casting to any to avoid TS errors for quick fix
    if (token && !(window as any).hasVerifyRun) {
      (window as any).hasVerifyRun = true;
      setVerificationStatus('VERIFYING');

      authService.verifyEmail(token)
        .then(data => {
          setUser(data.user);
          setVerificationStatus('SUCCESS');
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => setVerificationStatus('IDLE'), 3000);
        })
        .catch(err => {
          console.error('Verification failed:', err);
          setVerificationStatus('ERROR');
          setTimeout(() => setVerificationStatus('IDLE'), 3000);
        });
    }
  }, []);

  // Cart Persistence Logic
  useEffect(() => {
    if (user && costumes.length > 0) {
      cartService.getCart()
        .then(items => {
          const mappedItems: CartItem[] = items.map((dbItem: any) => {
            const costume = costumes.find(c => c.id === String(dbItem.item_id));
            if (costume) {
              return { ...costume, quantity: dbItem.quantity, rentalDays: dbItem.rental_days };
            }
            return null;
          }).filter(Boolean);
          setCart(mappedItems);
        })
        .catch(console.error);
    }
  }, [user, costumes]);

  // Authentication Logic
  const handleLogin = async (userData: User) => {
    setUser(userData);
    setIsLoginModalOpen(false);

    // Sync local cart to server
    if (cart.length > 0) {
      try {
        const syncedItems = await cartService.syncCart(cart);
        // Only map if costumes are loaded, otherwise useEffect will catch it later? 
        // Actually best to ensure costumes are loaded. 
        if (costumes.length > 0) {
          const mappedItems: CartItem[] = syncedItems.map((dbItem: any) => {
            const costume = costumes.find(c => c.id === String(dbItem.item_id));
            if (costume) {
              return { ...costume, quantity: dbItem.quantity, rentalDays: dbItem.rental_days };
            }
            return null;
          }).filter(Boolean);
          setCart(mappedItems);
        }
      } catch (e) {
        console.error("Failed to sync cart", e);
      }
    }
  };

  const handleUpdateProfile = (name: string, email: string) => {
    setUser(prev => prev ? ({ ...prev, name, email }) : null);
  };

  const requestLogout = () => {
    setIsUserDropdownOpen(false);
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    authService.logout();
    setUser(null);
    setCart([]); // Clear cart on logout as requested
    setView('HOME');
    setIsLogoutConfirmOpen(false);
    setIsMobileMenuOpen(false);
    setActiveUserModal(null);
  };

  const openUserModal = (modalType: 'PROFILE' | 'HISTORY' | 'PASSWORD') => {
    setActiveUserModal(modalType);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }

  const handleRentAgainFromHistory = (items: CartItem[]) => {
    cartService.syncCart(items).then(syncedItems => {
      const mappedItems: CartItem[] = syncedItems.map((dbItem: any) => {
        const costume = costumes.find(c => c.id === String(dbItem.item_id));
        if (costume) {
          return { ...costume, quantity: dbItem.quantity, rentalDays: dbItem.rental_days };
        }
        return null;
      }).filter(Boolean);
      setCart(mappedItems);
    }).catch(() => setCart(items)); // Fallback

    setActiveUserModal(null);
    setIsCartOpen(true);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Logic
  const addToCart = (costume: Costume) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === costume.id);
      if (existing) return prev;
      const newItem = { ...costume, quantity: 1, rentalDays: 3 };

      // Sync if logged in
      if (user) {
        cartService.addItem(newItem.id, newItem.quantity, newItem.rentalDays).catch(console.error);
      }

      return [...prev, newItem];
    });
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 300);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      if (user) {
        cartService.removeItem(id).catch(console.error);
      }
      return newCart;
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (user) {
          cartService.addItem(id, newQty, item.rentalDays).catch(console.error);
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // ... (keeping other states)

  const handleCheckout = async (details: BookingDetails) => {
    setIsBookingLoading(true);
    try {
      // Send to backend
      const response = await api.post('/bookings', details);
      console.log("Booking Email Sent:", response.data);

      setLastBooking(details);
      setCart([]);
      setIsCartOpen(false);
      setView('SUCCESS');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Booking Failed:", error);
      alert("Maaf, terjadi kesalahan saat memproses booking. Silakan coba lagi atau hubungi via WhatsApp.");
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleRentAgain = () => {
    if (lastBooking && lastBooking.items) {
      setCart(lastBooking.items);
      setView('CATALOG');
      setIsCartOpen(true);
    }
  };

  const openWhatsApp = (message: string) => {
    window.open(`https://wa.me/${CONTACT_WA}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredCostumes = useMemo(() => {
    return costumes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory, costumes]);

  const categories = ['all', 'fullset', 'aksesoris'];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
  };

  const TESTIMONIALS = [
    { text: "Penyelamat event kami! H-2 pesan, barang sampai tepat waktu dengan kondisi prima dan wangi.", author: "Rina, SMAN 21 Jakarta", role: "Bendahara Ekskul" },
    { text: "Bahan drill-nya tebal tapi adem, anak-anak nyaman baris 3 jam di bawah matahari.", author: "Pak Dedi", role: "Pelatih Paskibra" },
    { text: "Ukuran lengkap dari S sampai XXL, fitting jadi gampang banget buat satu pasukan.", author: "Tiara", role: "Danton Putri" },
    { text: "Adminnya ngerti banget soal atribut, jadi ga salah kostum pas lomba.", author: "Fajar", role: "PPI Regional" },
    { text: "Sangat recommended! Jahitan rapi dan terlihat sangat gagah saat dipakai.", author: "Bu Sarah", role: "Waka Kesiswaan" },
  ];

  const BRAND_VALUES = [
    { text: "JAPAN DRILL MATERIAL", icon: Shield },
    { text: "HYGIENIC STEAM LAUNDRY", icon: Sparkles },
    { text: "PRECISION TAILORING", icon: Scissors },
    { text: "READY STOCK 24/7", icon: Zap },
    { text: "NATIONWIDE SHIPPING", icon: Truck },
    { text: "OFFICIAL STANDARD", icon: Award },
  ];

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-red-200 selection:text-red-900">
        <AnimatePresence>
          {verificationStatus !== 'IDLE' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 min-w-[300px]"
              >
                {verificationStatus === 'VERIFYING' && (
                  <>
                    <Loader2 className="animate-spin text-red-600 mb-2" size={48} />
                    <p className="font-bold text-slate-700">Memverifikasi...</p>
                  </>
                )}
                {verificationStatus === 'SUCCESS' && (
                  <>
                    <CheckCircle className="text-green-500 mb-2" size={48} />
                    <p className="font-bold text-slate-700 text-lg">Email Berhasil Diverifikasi!</p>
                    <p className="text-slate-500 text-sm">Mengalihkan...</p>
                  </>
                )}
                {verificationStatus === 'ERROR' && (
                  <>
                    <XCircle className="text-red-500 mb-2" size={48} />
                    <p className="font-bold text-slate-700 text-lg">Verifikasi Gagal</p>
                    <p className="text-slate-500 text-sm">Token kadaluarsa atau tidak valid</p>
                  </>
                )}
              </motion.div>
            </div>
          )}
          {newsletterStatus !== 'IDLE' && newsletterStatus !== 'LOADING' && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
            >
              {newsletterStatus === 'SUCCESS' ? (
                <>
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="font-medium">Berhasil berlangganan!</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" size={20} />
                  <span className="font-medium">Gagal berlangganan. Coba lagi.</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-sm"
        >
          <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('HOME')}>
              <img
                src="/images/logo.png"
                alt="KostumFadilyss Logo"
                className="w-10 h-10 rounded-xl object-contain transition-all duration-300 transform group-hover:rotate-3"
              />
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">{APP_NAME}</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {['HOME', 'CATALOG', 'GALLERY'].map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item as ViewState)}
                  className={`relative px-3 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-300 ${view === item
                    ? 'text-slate-950 bg-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  {item === 'HOME' ? 'Beranda' : item === 'CATALOG' ? 'Katalog' : 'Galeri'}
                </button>
              ))}
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="ml-1 lg:ml-2 px-3 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Kontak
              </button>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* User Login/Profile Section with Dropdown */}
              {user ? (
                <div className="hidden md:flex items-center gap-2 lg:gap-4 pl-2 lg:pl-4 border-l border-slate-700 ml-2 lg:ml-4 relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 lg:gap-3 group focus:outline-none"
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-200 border border-slate-700 ring-2 ring-transparent group-hover:ring-slate-600 transition-all">
                      <UserIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-white text-sm font-bold leading-none max-w-[100px] truncate">{user.name}</p>
                      <p className="text-slate-400 text-[10px] font-medium leading-none mt-1">Member</p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 lg:w-4 lg:h-4 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                      >
                        <div className="p-2">
                          <div className="px-3 py-3 border-b border-slate-50 mb-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>

                          <button
                            onClick={() => openUserModal('PROFILE')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors group"
                          >
                            <UserIcon size={16} className="text-slate-400 group-hover:text-red-600" /> Profil Pengguna
                          </button>
                          <button
                            onClick={() => openUserModal('HISTORY')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors group"
                          >
                            <History size={16} className="text-slate-400 group-hover:text-red-600" /> Riwayat Penyewaan
                          </button>
                          <button
                            onClick={() => openUserModal('PASSWORD')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors group"
                          >
                            <Lock size={16} className="text-slate-400 group-hover:text-red-600" /> Ganti Password
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          <button
                            onClick={requestLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium group"
                          >
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Keluar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-semibold text-white hover:bg-white/10 rounded-full transition-colors border border-white/20 hover:border-white/50"
                >
                  <LogIn size={16} />
                  <span>Masuk</span>
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 lg:p-3 rounded-full transition-all duration-300 group ${isCartAnimating ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <ShoppingBag className={`w-5 h-5 ${isCartAnimating ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                {cart.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-bounce-short"></span>
                )}
              </button>

              <button className="md:hidden p-2 text-white hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-slate-900 border-t border-slate-800 overflow-hidden shadow-xl"
              >
                <div className="p-4 space-y-2">
                  {user ? (
                    <div className="flex flex-col p-4 bg-slate-800/50 rounded-xl mb-2 overflow-hidden">
                      <button
                        onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
                            <UserIcon size={20} />
                          </div>
                          <div className="text-left">
                            <p className="text-white font-bold text-sm">{user.name}</p>
                            <p className="text-slate-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform duration-300 ${isMobileProfileOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isMobileProfileOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="h-px bg-slate-700 my-3" />
                            <div className="flex flex-col gap-1">
                              <button onClick={() => openUserModal('PROFILE')} className="text-left text-slate-300 text-sm py-2 hover:text-white flex items-center gap-2 pl-1">
                                <UserIcon size={14} /> Profil Pengguna
                              </button>
                              <button onClick={() => openUserModal('HISTORY')} className="text-left text-slate-300 text-sm py-2 hover:text-white flex items-center gap-2 pl-1">
                                <History size={14} /> Riwayat Penyewaan
                              </button>
                              <button onClick={() => openUserModal('PASSWORD')} className="text-left text-slate-300 text-sm py-2 hover:text-white flex items-center gap-2 pl-1">
                                <Lock size={14} /> Ganti Password
                              </button>
                              <button onClick={requestLogout} className="text-left text-red-400 text-sm py-2 hover:text-red-300 flex items-center gap-2 font-medium pl-1">
                                <LogOut size={14} /> Keluar Akun
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full text-left font-medium text-white p-4 bg-red-600 rounded-xl mb-2 flex items-center gap-2 justify-center">
                      <LogIn size={18} /> Masuk Akun
                    </button>
                  )}

                  <button onClick={() => { setView('HOME'); setIsMobileMenuOpen(false); }} className="block w-full text-left font-medium text-slate-300 p-4 hover:bg-slate-800 rounded-xl transition-colors">Beranda</button>
                  <button onClick={() => { setView('CATALOG'); setIsMobileMenuOpen(false); }} className="block w-full text-left font-medium text-slate-300 p-4 hover:bg-slate-800 rounded-xl transition-colors">Katalog Kostum</button>
                  <button onClick={() => { setView('GALLERY'); setIsMobileMenuOpen(false); }} className="block w-full text-left font-medium text-slate-300 p-4 hover:bg-slate-800 rounded-xl transition-colors">Galeri Kegiatan</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* User Modals - Moved outside AnimatePresence to prevent page transitions/unmounting */}
          <AnimatePresence>
            {activeUserModal === 'PROFILE' && user ? (
              <UserProfileModal
                key="profile-modal"
                isOpen={true}
                onClose={() => setActiveUserModal(null)}
                user={user}
                onUpdate={handleUpdateProfile}
              />
            ) : activeUserModal === 'HISTORY' ? (
              <RentalHistoryModal
                key="history-modal"
                isOpen={true}
                onClose={() => setActiveUserModal(null)}
                user={user}
                onRentAgain={handleRentAgainFromHistory}
                costumes={costumes}
              />
            ) : activeUserModal === 'PASSWORD' ? (
              <ChangePasswordModal
                key="password-modal"
                isOpen={true}
                onClose={() => setActiveUserModal(null)}
              />
            ) : null}
          </AnimatePresence>

          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="animate-spin text-red-600 w-10 h-10" />
            </div>
          }>
            <AnimatePresence mode="wait">
              {/* VIEW: HOME */}
              {view === 'HOME' && (
                <HomeView
                  key="home"
                  setView={setView}
                  pageVariants={pageVariants}
                  setFilterCategory={setFilterCategory}
                  openWhatsApp={openWhatsApp}
                  addToCart={addToCart}
                  cart={cart}
                  setSelectedCostume={setSelectedCostume}
                  setIsSizeGuideOpen={setIsSizeGuideOpen}
                  BRAND_VALUES={BRAND_VALUES}
                  TESTIMONIALS={TESTIMONIALS}
                  COSTUMES={costumes}
                  availabilityMap={availabilityMap}
                />
              )}

              {/* VIEW: CATALOG */}
              {view === 'CATALOG' && (
                <CatalogView
                  key="catalog"
                  pageVariants={pageVariants}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  categories={categories}
                  filteredCostumes={filteredCostumes}
                  cart={cart}
                  addToCart={addToCart}
                  setSelectedCostume={setSelectedCostume}
                  setView={setView}
                  availabilityMap={availabilityMap}
                />
              )}

              {/* VIEW: GALLERY */}
              {view === 'GALLERY' && (
                <motion.div
                  key="gallery"
                  {...pageVariants}
                >
                  <GalleryPage />
                </motion.div>
              )}

              {/* VIEW: SUCCESS */}
              {view === 'SUCCESS' && (
                <SuccessView
                  key="success"
                  lastBooking={lastBooking}
                  openWhatsApp={openWhatsApp}
                  handleRentAgain={handleRentAgain}
                  setView={setView}
                />
              )}
            </AnimatePresence>
          </Suspense>
        </main>

        {/* Modern Mega Footer */}
        <footer className="bg-slate-950 text-white border-t border-slate-900 relative z-10">
          <div className="container mx-auto px-4 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
              {/* Column 1: Brand */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <img src="/images/logo.png" alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-700" loading="lazy" />
                  <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Platform penyewaan kostum Paskibra. Dedikasi kami untuk kesempurnaan penampilan pasukan Anda di setiap momen upacara.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/kostume_fadilyss/" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all"><Instagram size={20} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all"><Youtube size={20} /></a>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-red-600 pl-3">Jelajahi</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><button onClick={() => setView('CATALOG')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} className="text-red-600" /> Katalog Lengkap</button></li>
                  <li><button onClick={() => setView('CATALOG')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} className="text-red-600" /> Sewa PDU Full Set</button></li>
                  <li><button onClick={() => setView('GALLERY')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} className="text-red-600" /> Galeri Pasukan</button></li>
                  <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} className="text-red-600" /> Panduan Ukuran</button></li>
                </ul>
              </div>

              {/* Column 3: Contact Info */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-red-600 pl-3">Kantor Pusat</h4>
                <ul className="space-y-6 text-slate-400 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg shrink-0 text-red-500"><MapPin size={18} /></div>
                    <span>Jl. Pahlawan No.41, Limus Nunggal,<br />Cileungsi, Bogor, Jawa Barat 16820</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg shrink-0 text-red-500"><Phone size={18} /></div>
                    <span className="font-mono text-white text-base">+62 895-4282-82092</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg shrink-0 text-red-500"><Mail size={18} /></div>
                    <span>mohamadfadilah426@gmail.com</span>
                  </li>
                </ul>
              </div>

              {/* Column 4: Newsletter */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-red-600 pl-3">Newsletter</h4>
                <p className="text-slate-400 text-sm mb-4">Dapatkan info promo dan tips perawatan seragam terbaru.</p>
                <form onSubmit={handleNewsletterSubscribe} className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Email Anda"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                  <button
                    disabled={newsletterStatus === 'LOADING'}
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === 'LOADING' ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                  </button>
                </form>
                <p className="text-xs text-slate-600 mt-3">Kami tidak akan mengirim spam.</p>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-8 flex flex-col justify-center items-center gap-6">
              <div className="text-slate-500 text-sm text-center">
                <p>&copy; {new Date().getFullYear()} {APP_NAME}</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Cart Drawer Overlay */}
        {
          isCartOpen && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Keranjang</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={24} className="text-slate-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    <CartDrawer
                      items={cart}
                      onRemove={removeFromCart}
                      onUpdateQty={updateCartQty}
                      onCheckout={handleCheckout}
                      onClose={() => setIsCartOpen(false)}
                      onViewCatalog={() => setView('CATALOG')}
                      isLoading={isBookingLoading}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )
        }

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-24 right-6 z-40 bg-slate-900 text-white p-3 rounded-full shadow-lg border border-slate-700 transition-all duration-300 transform hover:scale-110 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        >
          <ArrowUp size={20} />
        </button>

        {/* Global Floating WhatsApp Button */}
        {
          !isCartOpen && (
            <button
              onClick={() => openWhatsApp('Halo, saya ingin menanyakan ketersediaan kostum Paskibra.')}
              className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 group"
              aria-label="Pesan Cepat via WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </button>
          )
        }

        {/* Detail Modal */}
        {
          selectedCostume && (
            <CostumeDetailModal
              costume={selectedCostume}
              isOpen={!!selectedCostume}
              onClose={() => setSelectedCostume(null)}
              onAddToCart={addToCart}
              isInCart={!!cart.find(i => i.id === selectedCostume.id)}
              bookedQty={availabilityMap[selectedCostume.id] || 0}
            />
          )
        }

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {isLogoutConfirmOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLogoutConfirmOpen(false)} />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl text-center"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Konfirmasi Keluar</h3>
                <p className="text-slate-500 mb-6">Apakah Anda yakin ingin keluar dari akun? Anda perlu masuk kembali untuk menyewa.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsLogoutConfirmOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </HelmetProvider>
  );
};

export default CustomerApp;