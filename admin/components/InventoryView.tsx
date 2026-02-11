import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { Search, Filter, Check, List, LayoutGrid, ImageIcon, Edit3, Trash2, AlertCircle } from 'lucide-react';

interface InventoryViewProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Cari katalog..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-none transition-all text-sm font-medium"
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:flex-none">
                        <button
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                            className="w-full md:w-48 appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:border-red-500 outline-none text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-between shadow-sm relative group"
                        >
                            <span className="truncate">{selectedCategory === 'All' ? 'Semua Kategori' : selectedCategory}</span>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-red-500 transition-colors" size={16} />
                        </button>

                        {isCategoryDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-20 cursor-default"
                                    onClick={() => setIsCategoryDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-full md:w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('All');
                                                setIsCategoryDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${selectedCategory === 'All' ? 'bg-red-50 text-red-600' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                                        >
                                            Semua Kategori
                                            {selectedCategory === 'All' && <Check size={14} className="text-red-600" />}
                                        </button>
                                        {Object.values(Category).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsCategoryDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-red-50 text-red-600' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                                            >
                                                {cat}
                                                {selectedCategory === cat && <Check size={14} className="text-red-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* View Toggle Buttons */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Tampilan List"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Tampilan Grid"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Produk</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Harga</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Stok</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                                    {product.imageUrls?.[0] ? (
                                                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{product.packageContents?.length || 0} item paket</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-slate-900">
                                                Rp {Number(product.price).toLocaleString('id-ID')}
                                            </div>
                                            <div className="text-xs text-slate-400 font-medium">
                                                / {product.rentalDuration} Hari
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                                    {product.stock} Unit
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(product.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle size={32} className="opacity-50" />
                                                <p className="font-medium text-sm">Tidak ada produk ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                {product.imageUrls?.[0] ? (
                                    <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm border border-white/20">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Overlay Actions */}
                                <div className="hidden xl:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:text-blue-600 transition-colors shadow-lg transform scale-0 group-hover:scale-100 duration-200"
                                        title="Edit"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:text-red-600 transition-colors shadow-lg transform scale-0 group-hover:scale-100 duration-200 delay-75"
                                        title="Hapus"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-4 flex-1">
                                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1" title={product.name}>{product.name}</h3>
                                    <p className="text-xs text-slate-500">{product.packageContents?.length || 0} item paket</p>
                                </div>

                                {/* Mobile Actions */}
                                <div className="flex gap-2 mb-4 xl:hidden">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 active:bg-blue-100 transition-colors"
                                    >
                                        <Edit3 size={12} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 active:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        Hapus
                                    </button>
                                </div>

                                <div className="flex items-end justify-between border-t border-slate-50 pt-4 mt-auto">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Harga Sewa</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-bold text-slate-900">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                                            <span className="text-[10px] text-slate-400">/ {product.rentalDuration}hr</span>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col items-end`}>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Stok</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                            <span className={`text-xs font-bold ${product.stock === 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                                {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <AlertCircle size={32} />
                            </div>
                            <p className="font-medium">Tidak ada produk ditemukan.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InventoryView;
