import React, { useState, useEffect } from 'react';
import { X, Zap, Clock } from 'lucide-react';

interface PromoBannerProps {
  openWhatsApp: (message: string) => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ openWhatsApp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if not dismissed in this session
    const dismissed = sessionStorage.getItem('promo_dismissed');
    if (!dismissed) {
      // Slight delay so it animates in after page loads
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('promo_dismissed', '1');
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white overflow-hidden">
      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 relative">
        <div className="flex items-center gap-2 text-sm md:text-base font-medium text-center">
          <Zap size={16} className="shrink-0 text-yellow-300 animate-pulse" />
          <span className="hidden sm:inline">🎉 Promo Pasukan!</span>
          <span className="font-bold">Sewa 5+ set dapat diskon 10%</span>
          <span className="hidden md:inline text-red-200">• Berlaku s/d akhir bulan ini</span>
        </div>
        <button
          onClick={() => openWhatsApp('Halo, saya ingin tanya soal promo diskon sewa 5+ set.')}
          className="shrink-0 bg-white text-red-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
          Klaim Promo
        </button>
        <button
          onClick={dismiss}
          className="shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors ml-1"
          aria-label="Tutup promo"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
