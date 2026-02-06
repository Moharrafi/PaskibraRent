import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera } from 'lucide-react';
import { APP_NAME } from '../constants';

const galleryItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1551021794-0344d360e988?q=80&w=800&auto=format&fit=crop',
    title: 'Upacara HUT RI ke-78',
    school: 'SMAN 1 Jakarta',
    category: 'Upacara',
    size: 'large'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
    title: 'Lomba Baris Berbaris Tingkat Provinsi',
    school: 'SMK Pertiwi',
    category: 'Lomba',
    size: 'small'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop',
    title: 'Pengukuhan Paskibraka',
    school: 'Pemkot Bandung',
    category: 'Formal',
    size: 'medium'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=800&auto=format&fit=crop',
    title: 'Latihan Gabungan',
    school: 'PPI Kota',
    category: 'Latihan',
    size: 'small'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop',
    title: 'Kirab Bendera Pusaka',
    school: 'Nasional',
    category: 'Event',
    size: 'medium'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1526659758509-3c990c74b5c7?q=80&w=800&auto=format&fit=crop',
    title: 'Formasi Variasi',
    school: 'MAN 2 Surabaya',
    category: 'Lomba',
    size: 'large'
  }
];

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
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
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                   <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 w-fit">
                      {item.category}
                   </span>
                   <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h3>
                   <div className="flex items-center gap-2 text-slate-300 text-xs">
                      <MapPin size={12} />
                      <span>{item.school}</span>
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