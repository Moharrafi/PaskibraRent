import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera } from 'lucide-react';
import { APP_NAME } from '../constants';
import { galleryService } from '../services/api';

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  date: string;
  location: string;
}

import SEO from './SEO';

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    galleryService.getGallery().then(data => {
      setItems(data);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Galeri Pasukan & Event - KostumFadilyss"
        description="Dokumentasi foto pasukan Paskibra yang menggunakan kostum dan seragam dari kami. Lihat bagaimana mereka tampil memukau di berbagai lomba dan upacara."
        url="/gallery"
      />
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
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
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="break-inside-avoid relative group rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
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

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-slate-100 text-slate-600">
            <Camera className="text-red-600" />
            <span>Ingin foto pasukanmu tampil di sini? Tag kami di Instagram!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;