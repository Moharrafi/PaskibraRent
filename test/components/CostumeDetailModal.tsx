import React, { useState } from 'react';
import { X, Check, ShieldCheck, Ruler, Box, MessageCircle, ShoppingBag, ChevronRight, Star, ArrowRight, CalendarClock, Bell } from 'lucide-react';
import { Costume } from '../types';
import { CONTACT_WA } from '../constants';

interface CostumeDetailModalProps {
  costume: Costume;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (costume: Costume) => void;
  isInCart: boolean;
}

const CostumeDetailModal: React.FC<CostumeDetailModalProps> = ({ 
  costume, 
  isOpen, 
  onClose, 
  onAddToCart,
  isInCart
}) => {
  // Simulate a gallery since we currently only have 1 image in the data structure
  // In a real app, this would come from costume.galleryImages
  const galleryImages = [costume.image, costume.image, costume.image]; 
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const openWhatsApp = () => {
    const text = `Halo Admin, saya tertarik dengan: ${costume.name}. Apakah stok tersedia untuk tanggal...`;
    window.open(`https://wa.me/${CONTACT_WA}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 ease-in-out" 
        onClick={onClose}
      />

      {/* Modal Container - Use flex layout to manage height and scrolling */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 border border-white/20 overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-slate-500 hover:text-red-600 transition-all duration-200 shadow-sm backdrop-blur-md group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* LEFT: Gallery Section (Static/Scrollable on mobile if needed) */}
        <div className="w-full md:w-1/2 bg-slate-50 p-4 md:p-6 flex flex-col shrink-0 relative overflow-y-auto md:overflow-hidden">
           
           {/* Tags Overlay */}
           <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 items-start pointer-events-none">
              <span className="bg-white/90 backdrop-blur text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm border border-slate-100">
                {costume.category}
              </span>
              
              {/* Conditional Badges */}
              {costume.availableStock === 0 ? (
                  <span className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                    <CalendarClock size={12} /> SEDANG DISEWA
                  </span>
              ) : costume.availableStock <= 5 && (
                 <span className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-red-500/30 shadow-lg animate-pulse">
                   Sisa {costume.availableStock} Unit
                 </span>
              )}
           </div>

           {/* Main Image View */}
           <div 
             className="relative w-full h-64 sm:h-80 md:h-auto md:aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 mb-4 cursor-zoom-in group shrink-0"
             onMouseEnter={() => setIsZoomed(true)}
             onMouseLeave={() => setIsZoomed(false)}
           >
              <img 
                src={galleryImages[activeImageIndex]} 
                alt={costume.name} 
                className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${isZoomed ? 'scale-110' : 'scale-100'} ${costume.availableStock === 0 ? 'grayscale contrast-75' : ''}`}
              />
           </div>

           {/* Thumbnails */}
           <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar shrink-0 justify-center md:justify-start">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImageIndex === idx 
                    ? 'border-red-600 shadow-md scale-105' 
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover object-top" />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 bg-red-600/10" />
                  )}
                </button>
              ))}
           </div>
        </div>

        {/* RIGHT: Content Details (Separated into scrollable content + fixed footer) */}
        <div className="w-full md:w-1/2 flex flex-col bg-white min-h-0">
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
             
             {/* Header */}
             <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                   <div className="flex text-amber-400">
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                   </div>
                   <span className="text-xs text-slate-400 font-medium">(Premium Quality)</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                  {costume.name}
                </h2>
                <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-bold text-red-700">Rp {costume.price.toLocaleString('id-ID')}</span>
                   <span className="text-sm text-slate-400">/ 3 Hari</span>
                </div>
             </div>

             <div className="w-full h-px bg-slate-100 mb-6" />
            
             {/* Alert if Rented Out */}
             {costume.availableStock === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600 shrink-0 relative z-10">
                         <CalendarClock size={20} />
                    </div>
                    <div className="relative z-10">
                        <h4 className="font-bold text-amber-900 text-sm">Unit Sedang Disewa Penuh</h4>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            Mohon maaf, saat ini seluruh stok item ini sedang digunakan oleh instansi lain. Estimasi ketersediaan kembali adalah <b>2-3 hari kerja</b>.
                        </p>
                    </div>
                </div>
             )}

             {/* Description */}
             <div className="mb-8">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Deskripsi Produk</h3>
               <p className="text-slate-600 leading-relaxed text-sm">
                 {costume.description} Dirancang khusus untuk memberikan kenyamanan maksimal dan tampilan yang berwibawa di lapangan.
               </p>
             </div>

             {/* Specifications Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 hover:border-red-100 transition-colors">
                   <div className="p-2 bg-white rounded-lg shadow-sm text-red-600">
                     <ShieldCheck size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-sm">Material</h4>
                     <p className="text-xs text-slate-500 mt-1">{costume.material}</p>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 hover:border-red-100 transition-colors">
                   <div className="p-2 bg-white rounded-lg shadow-sm text-red-600">
                     <Ruler size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-sm">Ukuran</h4>
                     <div className="flex flex-wrap gap-1 mt-1">
                        {costume.sizes.map(s => (
                           <span key={s} className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">{s}</span>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-1 sm:col-span-2 hover:border-red-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                       <Box size={16} className="text-red-600" />
                       <h4 className="font-bold text-slate-900 text-sm">Kelengkapan Paket</h4>
                    </div>
                    <ul className="grid grid-cols-2 gap-2">
                       {costume.includedItems.map((item, i) => (
                         <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                           <Check size={12} className="text-green-600 shrink-0" /> {item}
                         </li>
                       ))}
                    </ul>
                </div>
             </div>
          </div>

          {/* Fixed Footer Actions (Always visible at bottom right) */}
          <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <div className="flex gap-3">
                <button 
                  onClick={openWhatsApp}
                  className="px-3 md:px-4 py-3 md:py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-300 flex items-center justify-center gap-2 group shrink-0"
                >
                  <MessageCircle size={20} className="group-hover:animate-bounce" />
                  <span className="hidden sm:inline">Tanya Stok</span>
                </button>
                
                <button 
                  onClick={() => {
                     if (!isInCart && costume.availableStock > 0) {
                        onAddToCart(costume);
                        onClose();
                     } else if (costume.availableStock === 0) {
                        openWhatsApp();
                     }
                  }}
                  disabled={isInCart}
                  className={`flex-1 py-3 md:py-3.5 px-4 md:px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base ${
                     isInCart 
                     ? 'bg-green-600 shadow-green-200 cursor-default' 
                     : costume.availableStock === 0
                     ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                     : 'bg-slate-900 hover:bg-red-700 shadow-slate-300 hover:shadow-red-200'
                  }`}
                >
                   {isInCart ? (
                     <>
                       <Check size={20} /> <span className="hidden xs:inline">Item di Keranjang</span><span className="xs:hidden">Terpilih</span>
                     </>
                   ) : costume.availableStock === 0 ? (
                     <>
                        <Bell size={18} /> Kabari Saat Ready
                     </>
                   ) : (
                     <>
                       <ShoppingBag size={20} /> <span className="hidden xs:inline">Sewa Sekarang</span><span className="xs:hidden">Sewa</span> <ArrowRight size={18} className="opacity-70 hidden xs:block" />
                     </>
                   )}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumeDetailModal;