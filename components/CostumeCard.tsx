import React, { useState } from 'react';
import { Plus, Check, Loader2, Eye, AlertCircle } from 'lucide-react';
import { Costume } from '../types';

interface CostumeCardProps {
  costume: Costume;
  onAddToCart: (costume: Costume) => void;
  isInCart: boolean;
  onViewDetail?: (costume: Costume) => void;
}

const CostumeCard: React.FC<CostumeCardProps> = ({ costume, onAddToCart, isInCart, onViewDetail }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering detail view
    if (isInCart || costume.availableStock === 0) return;

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
      className="bg-white rounded-[2rem] shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          src={costume.image}
          alt={costume.name}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${costume.availableStock === 0 ? 'grayscale opacity-70' : ''}`}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wide z-10">
          {costume.category}
        </div>

        {/* Low Stock Indicator (< 5 but > 0) */}
        {costume.availableStock > 0 && costume.availableStock < 5 && (
          <div className="absolute bottom-3 left-3 bg-red-600 text-white pl-2 pr-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse border border-white/20 z-10">
            <AlertCircle size={14} className="shrink-0" />
            <span>Segera Habis: Sisa {costume.availableStock}</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {costume.availableStock === 0 && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wider border-2 border-white shadow-2xl transform -rotate-6">
              STOK HABIS
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
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-red-700 transition-colors">{costume.name}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{costume.description}</p>

        <div className="mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Harga Sewa</span>
              <span className="text-red-700 font-bold text-lg">
                Rp {costume.price.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-xs text-slate-400 mb-1">/ 3 Hari</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleViewDetail}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <Eye size={18} />
              <span>Detail</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isInCart || costume.availableStock === 0 || isAnimating}
              className={`flex-[1.5] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl font-semibold transition-all duration-300 transform ${isInCart
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : costume.availableStock === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
              ) : costume.availableStock === 0 ? (
                <span>Habis</span>
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