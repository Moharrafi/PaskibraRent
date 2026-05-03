import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Shield, Sparkles, Clock } from 'lucide-react';

interface FirstVisitPopupProps {
  openWhatsApp: (message: string) => void;
}

const FirstVisitPopup: React.FC<FirstVisitPopupProps> = ({ openWhatsApp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('kf_visited');
    if (!hasVisited) {
      // Show after 8 seconds on first visit
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem('kf_visited', '1');
  };

  const handleCTA = () => {
    localStorage.setItem('kf_visited', '1');
    setIsVisible(false);
    openWhatsApp('Halo, saya baru pertama kali berkunjung dan ingin tanya ketersediaan kostum Paskibra.');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={18} className="text-slate-400" />
            </button>

            <div className="p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <Gift size={32} className="text-red-600" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <Sparkles size={10} className="text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Selamat Datang! 👋
              </h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Pertama kali di <span className="font-bold text-red-600">KostumFadilyss</span>? Konsultasi GRATIS dengan tim kami untuk kebutuhan seragam pasukan Anda.
              </p>

              {/* Trust indicators */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Shield size={14} className="text-green-600" />
                  <span>100+ Instansi</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={14} className="text-blue-600" />
                  <span>Respons Cepat</span>
                </div>
              </div>

              <button
                onClick={handleCTA}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/25 active:scale-[0.98] group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Chat WhatsApp Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-slate-400 mt-3">
                Tidak ada spam. Langsung terhubung ke admin kami.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FirstVisitPopup;
