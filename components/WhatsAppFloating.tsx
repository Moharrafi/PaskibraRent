import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { CONTACT_WA } from '../constants';

interface WhatsAppFloatingProps {
  isCartOpen: boolean;
}

const QUICK_MESSAGES = [
  { label: '📋 Cek Ketersediaan Kostum', msg: 'Halo, saya ingin cek ketersediaan kostum Paskibra untuk tanggal...' },
  { label: '💰 Tanya Harga Paket Pasukan', msg: 'Halo, saya ingin tanya harga paket sewa untuk pasukan sebanyak ... orang.' },
  { label: '📏 Konsultasi Ukuran & Fitting', msg: 'Halo, saya ingin konsultasi ukuran seragam Paskibra dan jadwal fitting.' },
  { label: '🚚 Tanya Ongkir & Pengiriman', msg: 'Halo, saya ingin tanya biaya pengiriman kostum ke daerah...' },
];

const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ isCartOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Auto-show attention pulse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const openWA = (msg: string) => {
    window.open(`https://wa.me/${CONTACT_WA}?text=${encodeURIComponent(msg)}`, '_blank');
    setIsOpen(false);
  };

  if (isCartOpen) return null;

  return (
    <>
      {/* Backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[39] bg-black/20 md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Quick Messages Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[300px] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#075E54] p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">KostumFadilyss</p>
                  <p className="text-green-200 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Online • Balas dalam menit
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* Chat bubble */}
              <div className="p-4 bg-[#ECE5DD]">
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Halo! 👋 Ada yang bisa kami bantu soal kostum Paskibra? Pilih topik di bawah ya:
                  </p>
                  <p className="text-[10px] text-slate-400 text-right mt-1">Baru saja</p>
                </div>
              </div>

              {/* Quick message buttons */}
              <div className="p-3 space-y-2 max-h-[220px] overflow-y-auto">
                {QUICK_MESSAGES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => openWA(item.msg)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-100 text-sm text-slate-700 hover:bg-green-50 hover:border-green-200 hover:text-green-800 transition-all flex items-center gap-2 group"
                  >
                    <span className="flex-1">{item.label}</span>
                    <MessageCircle size={14} className="text-slate-300 group-hover:text-green-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <button
          onClick={() => { setIsOpen(!isOpen); setShowPulse(false); }}
          className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Pesan via WhatsApp"
        >
          {/* Pulse ring */}
          {showPulse && !isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20 animation-delay-500" />
            </>
          )}

          {isOpen ? (
            <X size={24} className="relative z-10" />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative z-10" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
          )}

          {/* Notification badge */}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              1
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default WhatsAppFloating;
