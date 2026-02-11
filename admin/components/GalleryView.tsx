import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GalleryItem } from '../types';
import { apiService } from '../services/apiService';
import { Plus, Trash2, Image as ImageIcon, X, Upload, Calendar, MapPin, Edit3 } from 'lucide-react';

interface GalleryViewProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadGallery = async () => {
    try {
      const data = await apiService.getGallery();
      setItems(data);
    } catch (e) {
      console.error(e);
      onShowToast('Gagal memuat galeri', 'error');
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await apiService.deleteGalleryItem(deleteConfirmId);
        loadGallery();
        onShowToast('Foto berhasil dihapus', 'success');
      } catch (e) {
        onShowToast('Gagal menghapus foto', 'error');
      } finally {
        setDeleteConfirmId(null);
      }
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl,
      location: item.location || '',
      date: item.date ? item.date.split('T')[0] : ''
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      imageUrl: '',
      location: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      onShowToast('Mohon upload foto atau masukkan URL', 'error');
      return;
    }

    try {
      if (editingId) {
        const updatedItem: GalleryItem = {
          id: editingId,
          title: formData.title,
          imageUrl: formData.imageUrl,
          date: formData.date,
          location: formData.location
        };
        await apiService.updateGalleryItem(updatedItem);
        onShowToast('Foto berhasil diperbarui', 'success');
      } else {
        const newItem: Omit<GalleryItem, 'id'> = {
          title: formData.title,
          imageUrl: formData.imageUrl,
          date: formData.date,
          location: formData.location
        };
        await apiService.createGalleryItem(newItem);
        onShowToast('Foto berhasil ditambahkan', 'success');
      }
      loadGallery();
      setIsModalOpen(false);
    } catch (e) {
      onShowToast('Gagal menyimpan foto', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Gallery Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <ImageIcon size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Galeri Dokumentasi</h2>
            <p className="text-sm text-slate-500">Kelola foto kegiatan Paskibra untuk ditampilkan di website.</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          <Plus size={18} />
          Tambah Foto
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleEdit(item)}
            className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Delete Button - Positioned at Top Right, Independent of Overlay */}
              <button
                type="button"
                onClick={(e) => handleDeleteClick(item.id, e)}
                className="absolute top-3 right-3 z-30 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 hover:!scale-110"
                title="Hapus Foto"
              >
                <Trash2 size={18} />
              </button>

              {/* Edit Badge - Top Left */}
              <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <Edit3 size={12} /> Edit
                </span>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <div className="p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-2 truncate">{item.title}</h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar size={12} className="text-slate-400" />
                  {item.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="truncate">{item.location || 'Lokasi tidak diketahui'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={32} className="opacity-50" />
            </div>
            <p className="font-medium">Belum ada foto di galeri.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Foto?</h3>
              <p className="text-sm text-slate-500 mb-6">Tindakan ini tidak dapat dibatalkan. Foto akan dihapus permanen dari galeri.</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Upload/Edit Modal */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingId ? 'Edit Foto Galeri' : 'Upload Foto Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Image Preview / Upload Area */}
                <div className="aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden relative group hover:border-red-400 hover:bg-red-50/10 transition-colors">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-md"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <p className="text-sm font-bold text-slate-600">Klik untuk upload foto</p>
                      <p className="text-xs text-slate-400 mt-1">atau drag & drop disini</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Judul Foto</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-medium"
                      placeholder="Contoh: Lomba 17 Agustus"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Tanggal Kegiatan</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Lokasi Kegiatan</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none text-sm font-medium"
                      placeholder="Contoh: SMAN 3 Depok"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GalleryView;