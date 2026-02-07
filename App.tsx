import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowRight, Star, Quote, Shield, Sparkles, Scissors, Zap, Truck, Award, Check, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Minus, Plus, ShoppingBag, X, Search, Calendar, Ruler, Info, RotateCcw, ChevronRight, ArrowUp, Menu, CheckCircle, ShieldCheck, Clock, Users, Play, MessageCircle, ChevronDown, CreditCard, User as UserIcon, LogOut, LogIn, AlertCircle, History, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COSTUMES, APP_NAME, CONTACT_WA } from './constants';
import { CartItem, Costume, ViewState, BookingDetails, User } from './types';
import CostumeCard from './components/CostumeCard';
import CartDrawer from './components/CartDrawer';
import CostumeDetailModal from './components/CostumeDetailModal';
import api, { authService, cartService } from './services/api';
import AIChat from './components/AIChat';
import GalleryPage from './components/GalleryPage';
import SizeGuideModal from './components/SizeGuideModal';
import LoginModal from './components/LoginModal';
import { UserProfileModal, RentalHistoryModal, ChangePasswordModal } from './components/UserMenuModals';

// --- Animation Components ---
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
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

  // User Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeUserModal, setActiveUserModal] = useState<'PROFILE' | 'HISTORY' | 'PASSWORD' | null>(null);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'ERROR'>('IDLE');
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
  }, []);

  // Email Verification Logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify_token');

    if (token) {
      setVerificationStatus('VERIFYING');
      authService.verifyEmail(token)
        .then(data => {
          setUser(data.user);
          setVerificationStatus('SUCCESS');
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => setVerificationStatus('IDLE'), 3000);
        })
        .catch(err => {
          console.error(err);
          setVerificationStatus('ERROR');
          setTimeout(() => setVerificationStatus('IDLE'), 3000);
        });
    }
  }, []);

  // Cart Persistence Logic
  useEffect(() => {
    if (user) {
      cartService.getCart()
        .then(items => {
          // Transform DB items to CartItems
          // DB items: { id, user_id, item_id, quantity, rental_days }
          // We need to match item_id with COSTUMES to get details.
          const mappedItems: CartItem[] = items.map((dbItem: any) => {
            const costume = COSTUMES.find(c => c.id === dbItem.item_id);
            if (costume) {
              return { ...costume, quantity: dbItem.quantity, rentalDays: dbItem.rental_days };
            }
            return null;
          }).filter(Boolean);
          setCart(mappedItems);
        })
        .catch(console.error);
    } else {
      // Optional: Clear cart on load if not logged in? 
      // No, keep local cart for guests.
    }
  }, [user]);

  // Authentication Logic
  const handleLogin = async (userData: User) => {
    setUser(userData);
    setIsLoginModalOpen(false);

    // Sync local cart to server
    if (cart.length > 0) {
      try {
        const syncedItems = await cartService.syncCart(cart);
        // mappedItems logic same as above
        const mappedItems: CartItem[] = syncedItems.map((dbItem: any) => {
          const costume = COSTUMES.find(c => c.id === dbItem.item_id);
          if (costume) {
            return { ...costume, quantity: dbItem.quantity, rentalDays: dbItem.rental_days };
          }
          return null;
        }).filter(Boolean);
        setCart(mappedItems);
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
    // This might need sync if we want to add these to persistent cart immediately
    // For now, simpler to just add to local and let the user interaction sync it (or sync explicitly)
    cartService.syncCart(items).then(syncedItems => {
      const mappedItems: CartItem[] = syncedItems.map((dbItem: any) => {
        const costume = COSTUMES.find(c => c.id === dbItem.item_id);
        if (costume) {
          return { ...costume, quantity: dbItem.quantity, rentalDays: dbItem.rental_days };
        }
        return null;
      }).filter(Boolean);
      // Append or replace? History usually implies replacing or adding.
      // Let's just set it for now or merge.
      // Simplified: just set cart to these items
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
    // Allow guest to add to cart
    // if (!user) {
    //   setIsLoginModalOpen(true);
    //   return;
    // }

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
    return COSTUMES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory]);

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
                  <Loader2 className="animate-spin text-red-600" size={32} />
                  <p className="font-bold text-slate-700">Verifikasi Email...</p>
                </>
              )}
              {verificationStatus === 'SUCCESS' && (
                <>
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                  <p className="font-bold text-slate-700">Email Berhasil Diverifikasi!</p>
                  <p className="text-sm text-slate-500">Anda telah masuk otomatis.</p>
                </>
              )}
              {verificationStatus === 'ERROR' && (
                <>
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <AlertCircle size={24} />
                  </div>
                  <p className="font-bold text-slate-700">Verifikasi Gagal</p>
                  <p className="text-sm text-slate-500">Link kadaluwarsa atau tidak valid.</p>
                </>
              )}
            </motion.div>
          </div>
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
        <AnimatePresence mode="wait">
          {/* VIEW: HOME */}
          {view === 'HOME' && (
            <motion.div
              key="home"
              {...pageVariants}
              className="w-full"
            >
              {/* HERO SECTION: High-End Editorial Style */}
              <section className="relative min-h-[92vh] flex items-center bg-slate-900 overflow-hidden">
                {/* Background Image with Elegant Gradient Overlay */}
                <div className="absolute inset-0">
                  <img
                    src="/images/WhatsApp Image 2026-02-06 at 13.14.12.jpeg"
                    alt="Hero Background"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 pt-10 pb-10">
                  <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content (Text) */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="lg:w-1/2 text-center lg:text-left relative z-20"
                    >
                      <div className="inline-flex items-center gap-2 mb-6 border-l-4 border-red-600 pl-4">
                        <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Est. 2024 • Jakarta</span>
                      </div>

                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight mb-8">
                        TEGAS.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600">WIBAWA.</span><br />
                        <span className="text-red-600">SEMPURNA.</span>
                      </h1>

                      <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10 border-l border-slate-800 pl-6 hidden md:block">
                        Spesialis penyewaan seragam Paskibra dengan standar jahitan nasional.
                        Detail presisi, material premium, dan layanan profesional.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                        <button
                          onClick={() => setView('CATALOG')}
                          className="px-8 py-5 bg-white text-slate-950 font-bold text-lg rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                          <span className="relative z-10">Lihat Koleksi</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                        <button
                          onClick={() => openWhatsApp('Halo, saya butuh bantuan fitting.')}
                          className="px-8 py-5 border border-slate-700 text-white font-medium text-lg rounded-full hover:border-white hover:bg-white/5 transition-all"
                        >
                          Jadwalkan Fitting
                        </button>
                      </div>

                      {/* Trust Indicators */}
                      <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={20} className="text-slate-300" />
                          <span className="text-sm text-slate-400">Garansi Kualitas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck size={20} className="text-slate-300" />
                          <span className="text-sm text-slate-400">Kirim Seluruh Indonesia</span>
                        </div>
                      </div>
                    </motion.div>


                  </div>
                </div>
              </section>

              {/* REPLACED SECTION: Brand Values Marquee (Sleek Ticker) */}
              <section className="bg-slate-900 border-t border-slate-800 border-b border-slate-800 py-6 overflow-hidden relative">
                <div className="flex w-full overflow-hidden">
                  <div className="flex animate-marquee w-fit">
                    <div className="flex gap-16 shrink-0 px-8 items-center">
                      {[...BRAND_VALUES, ...BRAND_VALUES].map((val, i) => (
                        <div key={i} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                          <val.icon size={20} className="text-red-500" />
                          <span className="text-sm md:text-base font-bold text-white tracking-[0.2em] uppercase">{val.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-16 shrink-0 px-8 items-center">
                      {[...BRAND_VALUES, ...BRAND_VALUES].map((val, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                          <val.icon size={20} className="text-red-500" />
                          <span className="text-sm md:text-base font-bold text-white tracking-[0.2em] uppercase">{val.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Elegant Category Grid */}
              <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                  <ScrollReveal className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Koleksi Eksklusif</h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Temukan seragam yang sesuai dengan karakter pasukan Anda. Dari PDU formal hingga atribut detail.
                    </p>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                      { title: 'KOPASKA', img: '/images/1.jpeg', cat: 'fullset' },
                      { title: 'ARJUNA', img: '/images/qq.jpeg', cat: 'fullset' },
                      { title: 'SHERIF', img: '/images/tt.jpeg', cat: 'fullset' }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                        onClick={() => { setFilterCategory(item.cat); setView('CATALOG'); }}
                      >
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{item.title}</h3>
                          <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                            <span className="text-sm font-medium">Lihat Katalog</span>
                            <div className="bg-white/20 p-1 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
                              <ArrowRight size={14} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Process Section - Clean & Minimal */}
              <section className="py-24 bg-slate-50/50">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row gap-16 md:gap-8">
                    {/* Left: Heading */}
                    <div className="md:w-1/3">
                      <ScrollReveal>
                        <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block">Alur Peminjaman</span>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">Proses Mudah,<br />Tanpa Ribet.</h2>
                        <p className="text-slate-500 leading-relaxed mb-8">
                          Sistem kami dirancang untuk efisiensi sekolah dan instansi. Fokus pada latihan, biarkan kami mengurus seragam.
                        </p>
                        <button onClick={() => setView('CATALOG')} className="text-slate-900 font-bold border-b-2 border-slate-200 hover:border-red-600 pb-1 transition-all">
                          Mulai Sewa Sekarang
                        </button>
                      </ScrollReveal>
                    </div>

                    {/* Right: Steps Grid */}
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { icon: Search, title: '1. Pilih Model', desc: 'Jelajahi katalog lengkap dengan detail ukuran.' },
                        { icon: Calendar, title: '2. Tentukan Jadwal', desc: 'Pilih tanggal pengambilan dan pengembalian.' },
                        { icon: Truck, title: '3. Pengambilan', desc: 'Ambil di store atau gunakan layanan antar.' },
                        { icon: RotateCcw, title: '4. Pengembalian', desc: 'Kembalikan kotor tidak masalah, kami yang laundry.' }
                      ].map((step, i) => (
                        <ScrollReveal key={i} delay={i * 0.1}>
                          <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-200 hover:shadow-xl transition-all duration-300 group h-full">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                              <step.icon size={22} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Why Us - Refined Layout */}
              <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <ScrollReveal className="lg:w-1/2">
                      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        Kualitas yang Menjaga <span className="text-red-600 decoration-red-200 underline decoration-4 underline-offset-4">Kehormatan</span> Pasukan.
                      </h2>

                      <div className="space-y-6">
                        {[
                          { title: 'Laundry Hygienic Steam', desc: 'Setiap kostum dicuci dengan standar hotel bintang 5.', icon: Sparkles },
                          { title: 'Fitting Presisi & Rapi', desc: 'Ukuran S-XXL yang dikalibrasi untuk postur tegap.', icon: Ruler },
                          { title: 'Material Premium Drill', desc: 'Bahan Japan Drill yang sejuk, tebal, dan tidak kusut.', icon: Shield }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-5 group">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors shrink-0">
                              <item.icon size={20} strokeWidth={2} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollReveal>

                    <ScrollReveal className="lg:w-1/2 relative" delay={0.2}>
                      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                        <img
                          src="/images/WhatsApp Image 2026-02-06 at 13.14.12.jpeg"
                          alt="Detail Seragam"
                          className="w-full h-[600px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80" />
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </section>

              {/* RE-POSITIONED: Customer Reviews / Kata Mereka (Moved to Bottom) */}
              <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative group">
                <div className="container mx-auto px-4 text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-4 shadow-sm">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Testimonial</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Kata Mereka Tentang Kami</h2>
                </div>

                <div className="flex w-full overflow-hidden pb-4">
                  <div className="flex animate-marquee w-fit">
                    <div className="flex gap-6 shrink-0 px-3">
                      {[...TESTIMONIALS, ...TESTIMONIALS].map((review, i) => (
                        <div key={i} className="w-80 md:w-96 p-6 rounded-3xl bg-white border border-slate-100 shrink-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card cursor-default relative">
                          <Quote size={40} className="absolute top-4 right-4 text-slate-100 rotate-180" />
                          <div className="flex gap-1 mb-4 text-yellow-400 relative z-10">
                            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-slate-600 text-base leading-relaxed mb-6 relative z-10">"{review.text}"</p>
                          <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm group-hover/card:text-red-700 transition-colors">{review.author}</p>
                              <p className="text-xs text-slate-400 font-medium">{review.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-6 shrink-0 px-3">
                      {[...TESTIMONIALS, ...TESTIMONIALS].map((review, i) => (
                        <div key={`dup-${i}`} className="w-80 md:w-96 p-6 rounded-3xl bg-white border border-slate-100 shrink-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card cursor-default relative">
                          <Quote size={40} className="absolute top-4 right-4 text-slate-100 rotate-180" />
                          <div className="flex gap-1 mb-4 text-yellow-400 relative z-10">
                            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-slate-600 text-base leading-relaxed mb-6 relative z-10">"{review.text}"</p>
                          <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm group-hover/card:text-red-700 transition-colors">{review.author}</p>
                              <p className="text-xs text-slate-400 font-medium">{review.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Preview - Dark Theme */}
              <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                  <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                      <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-3 block">Katalog Pilihan</span>
                      <h2 className="text-4xl font-bold mb-4 tracking-tight">Sering Disewa Minggu Ini</h2>
                    </div>
                    <button
                      onClick={() => setView('CATALOG')}
                      className="group flex items-center gap-2 text-white font-semibold hover:text-red-400 transition-colors"
                    >
                      Lihat Semua Katalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {COSTUMES.slice(0, 4).map((costume, idx) => (
                      <ScrollReveal key={costume.id} delay={idx * 0.1} className="h-full">
                        <CostumeCard
                          costume={costume}
                          onAddToCart={addToCart}
                          isInCart={!!cart.find(i => i.id === costume.id)}
                          onViewDetail={setSelectedCostume}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* NEW SECTION: Location/Maps */}
              <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                  <ScrollReveal className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-3 block">Lokasi Store</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Kunjungi Markas Kami</h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Ingin fitting langsung? Datang ke store kami untuk merasakan kualitas bahan dan memastikan ukuran yang pas untuk pasukan Anda.
                    </p>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200">
                    {/* Contact Info Side */}
                    <div className="p-8 lg:p-12 bg-slate-900 text-white flex flex-col justify-center space-y-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="p-2 bg-red-600 rounded-lg"><MapPin size={24} /></div>
                          Alamat Lengkap
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                          Jl. Pahlawan No.41, Limus Nunggal,<br />
                          Kec. Cileungsi, Kabupaten Bogor,<br />
                          Jawa Barat 16820
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg text-red-500"><Clock size={24} /></div>
                          Jam Operasional
                        </h3>
                        <ul className="space-y-3 text-slate-300">
                          <li className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Senin - Jumat</span>
                            <span className="font-bold text-white">08.00 - 17.00</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Sabtu - Minggu</span>
                            <span className="font-bold text-white">09.00 - 15.00</span>
                          </li>
                          {/* <li className="flex justify-between text-red-400">
                            <span>Minggu & Libur</span>
                            <span className="font-bold">Tutup</span>
                          </li> */}
                        </ul>
                      </div>

                      <button
                        onClick={() => openWhatsApp('Halo, saya ingin menjadwalkan kunjungan fitting ke store.')}
                        className="w-full py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Phone size={20} /> Hubungi Kami
                      </button>
                    </div>

                    {/* Map Iframe Side */}
                    <div className="lg:col-span-2 h-[400px] lg:h-auto min-h-[400px] relative bg-slate-100">
                      <iframe
                        src="https://maps.google.com/maps?q=Jl.+Pahlawan+No.41,+Limus+Nunggal,+Kec.+Cileungsi,+Kabupaten+Bogor,+Jawa+Barat+16820&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 transition-all duration-700"
                        title="Lokasi Store KostumFadilyss"
                      ></iframe>


                      {/* Map Overlay Badge */}
                      {/* <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-slate-200 pointer-events-none">
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Live Location
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: CATALOG */}
          {view === 'CATALOG' && (
            <motion.div
              key="catalog"
              {...pageVariants}
              className="bg-slate-50 min-h-screen pb-20"
            >
              <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
                <div className="container mx-auto px-4 py-4 space-y-4 md:space-y-0 md:flex items-center justify-between gap-4">
                  {/* Search */}
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari kostum, atribut, atau aksesoris..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize ${filterCategory === cat
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                      >
                        {cat === 'all' ? 'Semua' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="container mx-auto px-4 py-8">
                {filteredCostumes.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredCostumes.map(costume => (
                      <motion.div layout key={costume.id}>
                        <CostumeCard
                          costume={costume}
                          onAddToCart={addToCart}
                          isInCart={!!cart.find(i => i.id === costume.id)}
                          onViewDetail={setSelectedCostume}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Tidak ditemukan</h3>
                    <p className="text-slate-500">Coba kata kunci lain atau ubah filter kategori.</p>
                  </div>
                )}
              </div>
            </motion.div>
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
          {view === 'SUCCESS' && lastBooking && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4"
            >
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl text-center max-w-md w-full border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  type="spring"
                  className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Berhasil!</h2>
                <p className="text-slate-500 mb-8">Terima kasih <span className="font-semibold text-slate-900">{lastBooking.name}</span>.<br />Pesanan Anda sedang kami siapkan.</p>

                <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-3 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Kode Booking</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">#PASK-{Math.floor(Math.random() * 10000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tgl Ambil</span>
                    <span className="font-medium text-slate-900">{lastBooking.pickupDate}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => openWhatsApp(`Halo, saya sudah booking dengan nama ${lastBooking.name}. Mohon konfirmasinya.`)}
                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
                  >
                    <Phone size={18} /> Konfirmasi via WhatsApp
                  </button>
                  <button
                    onClick={handleRentAgain}
                    className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCcw size={18} /> Pinjam Ulang
                  </button>
                  <button
                    onClick={() => setView('HOME')}
                    className="w-full py-3.5 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Mega Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 relative z-10">

        {/* Top CTA Bar
        <div className="border-b border-slate-800 bg-slate-900/50">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Bergabung dengan 50+ Sekolah Lainnya</h3>
                <p className="text-slate-400">Dapatkan penawaran khusus untuk penyewaan satu angkatan.</p>
              </div>
              <button
                onClick={() => openWhatsApp('Halo, saya ingin menanyakan penawaran khusus untuk sekolah.')}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all flex items-center gap-2"
              >
                Hubungi Tim Sales <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div> */}

        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-700" />
                <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm">
                Platform penyewaan kostum Paskibra premium No.1 di Indonesia. Dedikasi kami untuk kesempurnaan penampilan pasukan Anda di setiap momen upacara.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Twitter size={20} /></a>
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
                {/* <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} className="text-red-600" /> Karir</a></li> */}
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
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-3">Kami tidak akan mengirim spam.</p>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 text-sm text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} {APP_NAME}. Karya Anak Bangsa 🇮🇩</p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-2 hidden md:block">Metode Pembayaran</span>
              <div className="flex gap-2">
                {['BCA', 'BNI', 'BRI', 'QRIS', 'GoPay'].map(bank => (
                  <div key={bank} className="bg-white px-3 py-1.5 rounded-md shadow-sm">
                    <span className="text-xs font-bold text-slate-800">{bank}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
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
                  isLoading={isBookingLoading}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-40 bg-slate-900 text-white p-3 rounded-full shadow-lg border border-slate-700 transition-all duration-300 transform hover:scale-110 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <ArrowUp size={20} />
      </button>

      {/* Global Floating WhatsApp Button */}
      {!isCartOpen && (
        <button
          onClick={() => openWhatsApp('Halo, saya ingin menanyakan ketersediaan kostum Paskibra.')}
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 group"
          aria-label="Pesan Cepat via WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
        </button>
      )}

      {/* Detail Modal */}
      {selectedCostume && (
        <CostumeDetailModal
          costume={selectedCostume}
          isOpen={!!selectedCostume}
          onClose={() => setSelectedCostume(null)}
          onAddToCart={addToCart}
          isInCart={!!cart.find(i => i.id === selectedCostume.id)}
        />
      )}

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

      {/* User Menu Modals */}
      {/* User Menu Modals */}
      {user && (
        <>
          <UserProfileModal
            isOpen={activeUserModal === 'PROFILE'}
            onClose={() => setActiveUserModal(null)}
            user={user}
            onUpdate={handleUpdateProfile}
          />

          <RentalHistoryModal
            isOpen={activeUserModal === 'HISTORY'}
            onClose={() => setActiveUserModal(null)}
            user={user}
            onRentAgain={handleRentAgainFromHistory}
          />
        </>
      )}

      <ChangePasswordModal
        isOpen={activeUserModal === 'PASSWORD'}
        onClose={() => setActiveUserModal(null)}
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
  );
};

export default App;