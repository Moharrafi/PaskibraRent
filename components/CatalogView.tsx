import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Costume, ViewState, CartItem } from '../types';
import CostumeCard from './CostumeCard';
import SEO from './SEO';

interface CatalogViewProps {
    pageVariants: any;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterCategory: string;
    setFilterCategory: (category: string) => void;
    categories: string[];
    filteredCostumes: Costume[];
    cart: CartItem[];
    addToCart: (costume: Costume) => void;
    setSelectedCostume: (costume: Costume | null) => void;
    setView: (view: ViewState) => void;
    availabilityMap: Record<string, number>;
}

const CatalogView: React.FC<CatalogViewProps> = ({
    pageVariants,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    categories,
    filteredCostumes,
    cart,
    addToCart,
    setSelectedCostume,
    setView,
    availabilityMap
}) => {
    return (
        <motion.div
            key="catalog"
            {...pageVariants}
            className="bg-slate-50 min-h-screen pb-20"
        >
            <SEO
                title="Katalog Kostum Paskibra - Sewa Seragam & Aksesoris"
                description="Lihat katalog lengkap kostum Paskibra, seragam PDU, atribut, dan aksesoris lainnya. Tersedia berbagai ukuran dan model terbaru untuk kebutuhan pasukan Anda."
                url="/catalog"
            />
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
                                    bookedQty={availabilityMap[costume.id] || 0}
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
    );
};

export default CatalogView;
