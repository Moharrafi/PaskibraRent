import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CONTACT_WA } from '../constants';

interface FirstVisitPopupProps {
  openWhatsApp: (message: string) => void;
}

const FirstVisitPopup: React.FC<FirstVisitPopupProps> = ({ openWhatsApp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('kf_visited');
    if (!hasVisited) {
      const timer = setTimeout(() => setIsVisible(true), 10000);
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
    openWhatsApp('Halo, saya ingin tanya ketersediaan kostum Paskibra.');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-24 md:w-[340px] z-[55] pointer-events-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            {/* Content */}
            <div className="p-4 flex gap-3 items-start">
              {/* Admin avatar */}
              <img
                src="/images/logo.png"
                alt="Admin"
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-900">Admin Fadilyss</span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                  </div>
                  <button
                    onClick={dismiss}
                    className="p-0.5 hover:bg-slate-100 rounded-full transition-colors shrink-0 -mr-1"
                  >
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  Butuh bantuan pilih kostum atau cek ukuran? Chat kami aja, fast response kok 😊
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="px-4 pb-3">
              <button
                onClick={handleCTA}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Balas via WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FirstVisitPopup;
