import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Quote, Shield, Sparkles, Scissors, Zap, Truck, Award, Check, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Search, Calendar, Ruler, RotateCcw, ChevronRight, Clock } from 'lucide-react';
import { APP_NAME, CONTACT_WA } from '../constants';
import { Costume, ViewState, CartItem } from '../types';
import CostumeCard from './CostumeCard';
import ScrollReveal from './ScrollReveal';
import SEO from './SEO';

interface HomeViewProps {
    setView: (view: ViewState) => void;
    pageVariants: any;
    setFilterCategory: (category: string) => void;
    openWhatsApp: (message: string) => void;
    addToCart: (costume: Costume) => void;
    cart: CartItem[];
    setSelectedCostume: (costume: Costume | null) => void;
    setIsSizeGuideOpen: (isOpen: boolean) => void;
    BRAND_VALUES: { text: string; icon: any }[];
    TESTIMONIALS: { text: string; author: string; role: string }[];
    COSTUMES: Costume[];
    availabilityMap: Record<string, number>;
}

const HomeView: React.FC<HomeViewProps> = ({
    setView,
    pageVariants,
    setFilterCategory,
    openWhatsApp,
    addToCart,
    cart,
    setSelectedCostume,
    setIsSizeGuideOpen,
    BRAND_VALUES,
    TESTIMONIALS,
    COSTUMES,
    availabilityMap
}) => {
    return (
        <motion.div
            key="home"
            {...pageVariants}
            className="w-full"
        >
            <SEO
                title="Sewa Kostum & Seragam Paskibra Terlengkap"
                description="Jasa sewa kostum Paskibra (Pasukan Pengibar Bendera) dengan koleksi terlengkap, bahan premium, dan ukuran presisi. Melayani sewa harian untuk lomba dan upacara di Jakarta & Bogor."
                keywords="sewa kostum paskibra, seragam paskibra, baju paskibra, sewa baju paskibra jakarta, perlengkapan paskibra"
            />
            {/* HERO SECTION: High-End Editorial Style */}
            <section className="relative min-h-[92vh] flex items-center bg-slate-900 overflow-hidden">
                {/* Background Image with Elegant Gradient Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="/images/WhatsApp Image 2026-02-06 at 13.14.12.jpeg"
                        alt="Hero Background"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 pt-10 pb-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Left Content (Text) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 text-center lg:text-left relative z-20"
                        >
                            <div className="inline-flex items-center gap-2 mb-6 border-l-4 border-red-600 pl-4">
                                <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Est. 2024 • Jakarta</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight mb-8">
                                TEGAS.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600">WIBAWA.</span><br />
                                <span className="text-red-600">SEMPURNA.</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10 border-l border-slate-800 pl-6 hidden md:block">
                                Spesialis penyewaan seragam Paskibra dengan standar jahitan nasional.
                                Detail presisi, material premium, dan layanan profesional.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                <button
                                    onClick={() => setView('CATALOG')}
                                    className="px-8 py-5 bg-white text-slate-950 font-bold text-lg rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    <span className="relative z-10">Lihat Koleksi</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                                <button
                                    onClick={() => openWhatsApp('Halo, saya butuh bantuan fitting.')}
                                    className="px-8 py-5 border border-slate-700 text-white font-medium text-lg rounded-full hover:border-white hover:bg-white/5 transition-all"
                                >
                                    Jadwalkan Fitting
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2">
                                    <Shield size={20} className="text-slate-300" />
                                    <span className="text-sm text-slate-400">Garansi Kualitas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck size={20} className="text-slate-300" />
                                    <span className="text-sm text-slate-400">Kirim Seluruh Indonesia</span>
                                </div>
                            </div>
                        </motion.div>


                    </div>
                </div>
            </section>

            {/* REPLACED SECTION: Brand Values Marquee (Sleek Ticker) */}
            <section className="bg-slate-900 border-t border-slate-800 border-b border-slate-800 py-6 overflow-hidden relative">
                <div className="flex w-full overflow-hidden">
                    <div className="flex animate-marquee w-fit">
                        <div className="flex gap-16 shrink-0 px-8 items-center">
                            {[...BRAND_VALUES, ...BRAND_VALUES].map((val, i) => (
                                <div key={i} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                                    <val.icon size={20} className="text-red-500" />
                                    <span className="text-sm md:text-base font-bold text-white tracking-[0.2em] uppercase">{val.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-16 shrink-0 px-8 items-center">
                            {[...BRAND_VALUES, ...BRAND_VALUES].map((val, i) => (
                                <div key={`dup-${i}`} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                                    <val.icon size={20} className="text-red-500" />
                                    <span className="text-sm md:text-base font-bold text-white tracking-[0.2em] uppercase">{val.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Elegant Category Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <ScrollReveal className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Koleksi Eksklusif</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Temukan seragam yang sesuai dengan karakter pasukan Anda. Dari PDU formal hingga atribut detail.
                        </p>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { title: 'KOPASKA', img: '/images/1.jpeg', cat: 'fullset' },
                            { title: 'ARJUNA', img: '/images/qq.jpeg', cat: 'fullset' },
                            { title: 'SHERIF', img: '/images/tt.jpeg', cat: 'fullset' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                                onClick={() => { setFilterCategory(item.cat); setView('CATALOG'); }}
                            >
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                        <span className="text-sm font-medium">Lihat Katalog</span>
                                        <div className="bg-white/20 p-1 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section - Clean & Minimal */}
            <section className="py-24 bg-slate-50/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-16 md:gap-8">
                        {/* Left: Heading */}
                        <div className="md:w-1/3">
                            <ScrollReveal>
                                <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block">Alur Peminjaman</span>
                                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">Proses Mudah,<br />Tanpa Ribet.</h2>
                                <p className="text-slate-500 leading-relaxed mb-8">
                                    Sistem kami dirancang untuk efisiensi sekolah dan instansi. Fokus pada latihan, biarkan kami mengurus seragam.
                                </p>
                                <button onClick={() => setView('CATALOG')} className="text-slate-900 font-bold border-b-2 border-slate-200 hover:border-red-600 pb-1 transition-all">
                                    Mulai Sewa Sekarang
                                </button>
                            </ScrollReveal>
                        </div>

                        {/* Right: Steps Grid */}
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Search, title: '1. Pilih Model', desc: 'Jelajahi katalog lengkap dengan detail ukuran.' },
                                { icon: Calendar, title: '2. Tentukan Jadwal', desc: 'Pilih tanggal pengambilan dan pengembalian.' },
                                { icon: Truck, title: '3. Pengambilan', desc: 'Ambil di store atau gunakan layanan antar.' },
                                { icon: RotateCcw, title: '4. Pengembalian', desc: 'Kembalikan kotor tidak masalah, kami yang laundry.' }
                            ].map((step, i) => (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-200 hover:shadow-xl transition-all duration-300 group h-full">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                            <step.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Us - Refined Layout */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <ScrollReveal className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                                Kualitas yang Menjaga <span className="text-red-600 decoration-red-200 underline decoration-4 underline-offset-4">Kehormatan</span> Pasukan.
                            </h2>

                            <div className="space-y-6">
                                {[
                                    { title: 'Laundry Hygienic Steam', desc: 'Setiap kostum dicuci dengan standar hotel bintang 5.', icon: Sparkles },
                                    { title: 'Fitting Presisi & Rapi', desc: 'Ukuran S-XXL yang dikalibrasi untuk postur tegap.', icon: Ruler },
                                    { title: 'Material Premium Drill', desc: 'Bahan Japan Drill yang sejuk, tebal, dan tidak kusut.', icon: Shield }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-5 group">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors shrink-0">
                                            <item.icon size={20} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal className="lg:w-1/2 relative" delay={0.2}>
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                                <img
                                    src="/images/WhatsApp Image 2026-02-06 at 13.14.12.jpeg"
                                    alt="Detail Seragam"
                                    className="w-full h-[600px] object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80" />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* RE-POSITIONED: Customer Reviews / Kata Mereka (Moved to Bottom) */}
            <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative group">
                <div className="container mx-auto px-4 text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-4 shadow-sm">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Testimonial</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Kata Mereka Tentang Kami</h2>
                </div>

                <div className="flex w-full overflow-hidden pb-4">
                    <div className="flex animate-marquee w-fit">
                        <div className="flex gap-6 shrink-0 px-3">
                            {[...TESTIMONIALS, ...TESTIMONIALS].map((review, i) => (
                                <div key={i} className="w-80 md:w-96 p-6 rounded-3xl bg-white border border-slate-100 shrink-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card cursor-default relative">
                                    <Quote size={40} className="absolute top-4 right-4 text-slate-100 rotate-180" />
                                    <div className="flex gap-1 mb-4 text-yellow-400 relative z-10">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-600 text-base leading-relaxed mb-6 relative z-10">"{review.text}"</p>
                                    <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm group-hover/card:text-red-700 transition-colors">{review.author}</p>
                                            <p className="text-xs text-slate-400 font-medium">{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-6 shrink-0 px-3">
                            {[...TESTIMONIALS, ...TESTIMONIALS].map((review, i) => (
                                <div key={`dup-${i}`} className="w-80 md:w-96 p-6 rounded-3xl bg-white border border-slate-100 shrink-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card cursor-default relative">
                                    <Quote size={40} className="absolute top-4 right-4 text-slate-100 rotate-180" />
                                    <div className="flex gap-1 mb-4 text-yellow-400 relative z-10">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-600 text-base leading-relaxed mb-6 relative z-10">"{review.text}"</p>
                                    <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm group-hover/card:text-red-700 transition-colors">{review.author}</p>
                                            <p className="text-xs text-slate-400 font-medium">{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Preview - Dark Theme */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-3 block">Katalog Pilihan</span>
                            <h2 className="text-4xl font-bold mb-4 tracking-tight">Sering Disewa Minggu Ini</h2>
                        </div>
                        <button
                            onClick={() => setView('CATALOG')}
                            className="group flex items-center gap-2 text-white font-semibold hover:text-red-400 transition-colors"
                        >
                            Lihat Semua Katalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COSTUMES.slice(0, 4).map((costume, idx) => (
                            <ScrollReveal key={costume.id} delay={idx * 0.1} className="h-full">
                                <CostumeCard
                                    costume={costume}
                                    onAddToCart={addToCart}
                                    isInCart={!!cart.find(i => i.id === costume.id)}
                                    onViewDetail={setSelectedCostume}
                                    bookedQty={availabilityMap[costume.id] || 0}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Location/Maps */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <ScrollReveal className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-3 block">Lokasi Store</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Kunjungi Markas Kami</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Ingin fitting langsung? Datang ke store kami untuk merasakan kualitas bahan dan memastikan ukuran yang pas untuk pasukan Anda.
                        </p>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200">
                        {/* Contact Info Side */}
                        <div className="p-8 lg:p-12 bg-slate-900 text-white flex flex-col justify-center space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-red-600 rounded-lg"><MapPin size={24} /></div>
                                    Alamat Lengkap
                                </h3>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    Jl. Pahlawan No.41, Limus Nunggal,<br />
                                    Kec. Cileungsi, Kabupaten Bogor,<br />
                                    Jawa Barat 16820
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg text-red-500"><Clock size={24} /></div>
                                    Jam Operasional
                                </h3>
                                <ul className="space-y-3 text-slate-300">
                                    <li className="flex justify-between border-b border-slate-800 pb-2">
                                        <span>Senin - Jumat</span>
                                        <span className="font-bold text-white">08.00 - 17.00</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-800 pb-2">
                                        <span>Sabtu - Minggu</span>
                                        <span className="font-bold text-white">09.00 - 15.00</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => openWhatsApp('Halo, saya ingin menjadwalkan kunjungan fitting ke store.')}
                                className="w-full py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Phone size={20} /> Hubungi Kami
                            </button>
                        </div>

                        {/* Map Iframe Side */}
                        <div className="lg:col-span-2 h-[400px] lg:h-auto min-h-[400px] relative bg-slate-100">
                            <iframe
                                src="https://maps.google.com/maps?q=-6.365256,106.97482&hl=es;z=14&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 transition-all duration-700 gray-0 hover:gray-0"
                                title="Lokasi Store KostumFadilyss"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default HomeView;
