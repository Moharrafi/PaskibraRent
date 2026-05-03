import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { APP_NAME } from '../constants';
import { galleryService } from '../services/api';
import SEO from './SEO';

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  date: string;
  location: string;
}

const SkeletonCard = () => (
  <div className="break-inside-avoid rounded-[2rem] overflow-hidden bg-white shadow-md animate-pulse mb-6">
    <div className="w-full bg-slate-200" style={{ height: `${180 + Math.random() * 120}px` }} />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  </div>
);

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    galleryService.getGallery()
      .then(data => setItems(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox(i => (i !== null ? (i - 1 + items.length) % items.length : null));
  const nextImage = () => setLightbox(i => (i !== null ? (i + 1) % items.length : null));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Galeri Pasukan & Event - KostumFadilyss"
        description="Dokumentasi foto pasukan Paskibra yang menggunakan kostum dan seragam dari kami. Lihat penampilan terbaik pasukan dari berbagai sekolah dan instansi."
        url="/gallery"
        breadcrumbs={[
            { name: 'Beranda', url: '/' },
            { name: 'Galeri', url: '/gallery' },
        ]}
      />

      {/* Header */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-3 block">Galeri Kegiatan</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Momen Kebanggaan</h1>
          <p className="text-slate-400 text-lg">
            Dokumentasi nyata dari sekolah dan instansi yang mempercayakan penampilan pasukannya kepada {APP_NAME}.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada foto</h3>
            <p className="text-slate-500">Galeri akan segera diperbarui.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.5 }}
                className="break-inside-avoid relative group rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                      <MapPin size={12} />
                      <span>{item.location || 'Lokasi tidak tersedia'}</span>
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      {item.date && new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-slate-100 text-slate-600">
              <Camera className="text-red-600" />
              <span>Ingin foto pasukanmu tampil di sini? Tag kami di Instagram!</span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[lightbox].image_url}
                alt={items[lightbox].title}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <div className="text-center">
                <p className="text-white font-bold text-lg">{items[lightbox].title}</p>
                <p className="text-slate-400 text-sm flex items-center justify-center gap-1 mt-1">
                  <MapPin size={12} />
                  {items[lightbox].location || 'Lokasi tidak tersedia'}
                  {items[lightbox].date && ` • ${new Date(items[lightbox].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                </p>
                <p className="text-slate-600 text-xs mt-2">{lightbox + 1} / {items.length}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
