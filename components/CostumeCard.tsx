import React, { useState } from 'react';
import { Plus, Check, Loader2, Eye, AlertCircle, CalendarClock, Lock } from 'lucide-react';
import { Costume } from '../types';

interface CostumeCardProps {
  costume: Costume;
  onAddToCart: (costume: Costume) => void;
  isInCart: boolean;
  onViewDetail?: (costume: Costume) => void;
  bookedQty?: number;
}

const CostumeCard: React.FC<CostumeCardProps> = ({ costume, onAddToCart, isInCart, onViewDetail, bookedQty = 0 }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const effectiveStock = Math.max(0, costume.availableStock - bookedQty);
  const isFullyBooked = effectiveStock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering detail view
    if (isInCart || isFullyBooked) return;

    setIsAnimating(true);
    // Mimic processing delay slightly for better UX feel
    setTimeout(() => {
      onAddToCart(costume);
      setIsAnimating(false);
    }, 400);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetail) onViewDetail(costume);
  };

  return (
    <div
      onClick={() => onViewDetail && onViewDetail(costume)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full cursor-pointer relative"
    >
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          src={costume.image}
          alt={costume.name}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${isFullyBooked ? 'grayscale contrast-75' : ''}`}
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wide z-10">
          {costume.category}
        </div>

        {/* Low Stock Indicator (< 5 but > 0) - Hidden for Fullset */}
        {!isFullyBooked && effectiveStock < 5 && costume.category !== 'fullset' && (
          <div className="absolute bottom-3 left-3 bg-red-600 text-white pl-2 pr-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse border border-white/20 z-10">
            <AlertCircle size={14} className="shrink-0" />
            <span>Segera Habis: Sisa {effectiveStock}</span>
          </div>
        )}

        {/* Currently Rented / Out of Stock Overlay */}
        {isFullyBooked && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] flex items-center justify-center z-20">
            <div className="bg-amber-600/90 text-white px-6 py-4 rounded-xl border border-white/20 shadow-2xl transform -rotate-2 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <CalendarClock size={20} />
                <span className="font-bold text-base tracking-widest uppercase">SEDANG DISEWA</span>
              </div>
              <span className="text-[10px] font-medium bg-black/20 px-2 py-0.5 rounded-full">Full Booked</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          {costume.tags.map(tag => (
            <span key={tag} className="inline-block bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full mr-1 mb-1">
              #{tag}
            </span>
          ))}
        </div>
        <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${isFullyBooked ? 'text-slate-500' : 'text-slate-900 group-hover:text-red-700'}`}>
          {costume.name}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{costume.description}</p>

        <div className="mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Harga Sewa</span>
              <span className={`font-bold text-lg ${isFullyBooked ? 'text-slate-400 decoration-slate-300' : 'text-red-700'}`}>
                Rp {costume.price.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-xs text-slate-400 mb-1">/ 3 Hari</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleViewDetail}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <Eye size={18} />
              <span>Detail</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isInCart || isFullyBooked || isAnimating}
              className={`flex-[1.5] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold transition-all duration-300 transform ${isInCart
                ? 'bg-green-100 text-green-700 cursor-default'
                : isFullyBooked
                  ? 'bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed'
                  : isAnimating
                    ? 'bg-red-800 text-white scale-95'
                    : 'bg-slate-900 text-white hover:bg-red-700 active:scale-95 shadow-lg shadow-red-900/20'
                }`}
            >
              {isInCart ? (
                <>
                  <Check size={18} />
                  <span>Dipilih</span>
                </>
              ) : isFullyBooked ? (
                <>
                  <Lock size={16} />
                  <span className="text-xs">Disewa Penuh</span>
                </>
              ) : isAnimating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Plus size={18} />
                  <span>Sewa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumeCard;