import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { X, Upload, Plus, Trash, Check, Image as ImageIcon, Star } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const COMMON_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Custom'];

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: Category.FULLSET,
    price: 0,
    rentalDuration: 3,
    stock: 0,
    description: '',
    material: '',
    sizes: [],
    packageContents: [],
    imageUrls: []
  });

  const [newContentItem, setNewContentItem] = useState('');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedImageIndex(0);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'stock' || name === 'rentalDuration') ? Number(value) : value
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  };

  const handleAddContent = () => {
    if (newContentItem.trim()) {
      setFormData(prev => ({
        ...prev,
        packageContents: [...(prev.packageContents || []), newContentItem.trim()]
      }));
      setNewContentItem('');
    }
  };

  const handleRemoveContent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packageContents: (prev.packageContents || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    const url = prompt("Masukkan URL Gambar:");
    if (url) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), url]
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = (prev.imageUrls || []).filter((_, i) => i !== index);
      if (selectedImageIndex >= newImages.length) {
        setSelectedImageIndex(Math.max(0, newImages.length - 1));
      }
      return { ...prev, imageUrls: newImages };
    });
  };

  const handleSetCover = (index: number) => {
    setFormData(prev => {
      const images = [...(prev.imageUrls || [])];
      const selected = images[index];
      images.splice(index, 1);
      images.unshift(selected);
      return { ...prev, imageUrls: images };
    });
    setSelectedImageIndex(0);
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct: Product = {
      id: initialData?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category as Category,
      price: formData.price || 0,
      rentalDuration: formData.rentalDuration || 3,
      stock: formData.stock || 0,
      description: formData.description || '',
      imageUrls: formData.imageUrls || [],
      material: formData.material || '',
      sizes: formData.sizes || [],
      packageContents: formData.packageContents || []
    };
    onSave(finalProduct);
  };

  const currentImages = formData.imageUrls || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      {/* Container utama menggunakan Flexbox dan overflow-hidden */}
      <div className="bg-white w-full max-w-5xl max-h-[90vh] flex flex-col border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden">

        {/* Header - Fixed */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-white shrink-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {initialData ? 'Edit Katalog' : 'Tambah Produk Baru'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">Lengkapi data produk dengan detail</p>
          </div>
          <button onClick={onCancel} className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors p-3 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Form sebagai flex container untuk body dan footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-4 space-y-4 w-full max-w-sm mx-auto lg:max-w-none">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Galeri Produk</label>

                <div className="aspect-[3/4] w-full bg-slate-50 border border-slate-200 relative group rounded-3xl overflow-hidden">
                  {currentImages.length > 0 ? (
                    <>
                      <img src={currentImages[selectedImageIndex]} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur border-t border-slate-100 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        {selectedImageIndex !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(selectedImageIndex)}
                            className="flex-1 bg-slate-900 text-white py-2.5 px-4 text-xs font-bold hover:bg-slate-800 rounded-xl"
                          >
                            Jadikan Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(selectedImageIndex)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                      {selectedImageIndex === 0 && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full shadow-sm border border-white">
                          Cover Utama
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                      <div className="bg-white p-4 rounded-full shadow-sm">
                        <ImageIcon size={32} />
                      </div>
                      <span className="text-xs font-medium">Belum ada foto</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {currentImages.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square border-2 transition-all rounded-2xl overflow-hidden ${idx === selectedImageIndex ? 'border-red-500 opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                    >
                      <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}

                  <label className="aspect-square border-2 border-dashed border-slate-200 hover:border-red-400 hover:bg-red-50 cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-red-500 transition-all rounded-2xl group">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <Upload size={20} className="group-hover:scale-110 transition-transform" />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="aspect-square border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-500 transition-all rounded-2xl group"
                  >
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Form Fields */}
              <div className="lg:col-span-8 space-y-8">

                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Informasi Dasar</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Nama Produk</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-slate-900 text-sm transition-all rounded-2xl font-medium"
                      placeholder="Masukkan nama produk..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Kategori</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-sm text-slate-900 rounded-2xl cursor-pointer appearance-none font-medium"
                        >
                          {Object.values(Category).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Stok Unit</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-sm text-slate-900 rounded-2xl font-medium"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Harga Sewa (Rp)</label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price ? Number(formData.price).toLocaleString('id-ID') : ''}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\./g, '');
                          if (!isNaN(Number(rawValue))) {
                            setFormData(prev => ({ ...prev, price: Number(rawValue) }));
                          }
                        }}
                        className="w-full px-5 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 outline-none font-bold text-slate-900 rounded-2xl"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Durasi (Hari)</label>
                      <input
                        type="number"
                        name="rentalDuration"
                        value={formData.rentalDuration}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 outline-none font-bold text-slate-900 rounded-2xl"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Deskripsi</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none resize-none text-sm text-slate-600 rounded-2xl leading-relaxed"
                      placeholder="Deskripsi produk..."
                    ></textarea>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Material</label>
                        <input
                          type="text"
                          name="material"
                          value={formData.material}
                          onChange={handleChange}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none text-sm rounded-2xl font-medium"
                          placeholder="Contoh: Drill Castillo"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-3 ml-1">Ukuran Tersedia</label>
                        <div className="flex flex-wrap gap-2">
                          {COMMON_SIZES.map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`w-10 h-10 flex items-center justify-center text-xs font-bold border transition-all rounded-full ${formData.sizes?.includes(size)
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Isi Paket</label>
                      <div className="border border-slate-200 bg-white rounded-3xl overflow-hidden p-2">
                        <div className="space-y-1 max-h-[160px] overflow-y-auto px-1 py-1 custom-scrollbar">
                          {formData.packageContents?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl group">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                  <Check size={10} strokeWidth={4} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{item}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveContent(idx)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          ))}
                          {(!formData.packageContents || formData.packageContents.length === 0) && (
                            <div className="py-6 text-center text-slate-400 text-sm">
                              Belum ada item ditambahkan
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={newContentItem}
                            onChange={(e) => setNewContentItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContent())}
                            className="flex-1 px-5 py-3 text-sm bg-slate-50 border border-slate-200 focus:border-slate-400 outline-none rounded-full"
                            placeholder="Tambah item..."
                          />
                          <button
                            type="button"
                            onClick={handleAddContent}
                            className="bg-slate-900 text-white w-11 h-11 flex items-center justify-center hover:bg-slate-800 rounded-full shadow-lg"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white shrink-0 z-20">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-full"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors rounded-full shadow-lg shadow-red-200"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;