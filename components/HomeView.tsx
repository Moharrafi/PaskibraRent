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
                        width="1920"
                        height="1080"
                        fetchPriority="high"
                        loading="eager"
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
                                <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Est. 2024 • Bogor</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight mb-8">
                                TEGAS.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600">WIBAWA.</span><br />
                                <span className="text-red-600">SEMPURNA.</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10 border-l border-slate-800 pl-6 hidden md:block">
                                Penyewaan seragam Paskibra berkualitas dengan jahitan rapi dan detail presisi, nyaman dipakai dan siap tampil percaya diri.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                <button
                                    onClick={() => { setView('CATALOG'); window.scrollTo(0, 0); }}
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
                                    <Clock size={20} className="text-slate-300" />
                                    <span className="text-sm text-slate-400">Tersedia 24/7</span>
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
                                onClick={() => { setFilterCategory(item.cat); setView('CATALOG'); window.scrollTo(0, 0); }}
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

            {/* Process Section - Premium Timeline */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <ScrollReveal className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm mb-6">
                            {/* <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> */}
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Alur Peminjaman</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4">
                            Simpel. <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Efisien.</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Profesional.</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mt-6 leading-relaxed">
                            Sistem kami dirancang untuk memangkas birokrasi, sehingga Anda bisa fokus pada performa pasukan.
                        </p>
                    </ScrollReveal>

                    {/* Steps - Horizontal Timeline */}
                    <div className="relative">
                        {/* Connector Line (desktop only) */}
                        <div className="hidden lg:block absolute top-[3.5rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                        <div className="hidden lg:block absolute top-[3.5rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                            {[
                                { number: '01', icon: Search, title: 'Pilih Model', desc: 'Eksplorasi katalog premium kami dengan detail ukuran dan ketersediaan real-time.', color: 'from-blue-500/20 to-blue-600/5', ring: 'group-hover:ring-blue-500/40', glow: 'group-hover:shadow-blue-500/20', iconColor: 'group-hover:text-blue-400 group-hover:bg-blue-500/10' },
                                { number: '02', icon: Calendar, title: 'Atur Jadwal', desc: 'Tentukan tanggal pengambilan dan durasi sewa yang fleksibel sesuai kebutuhan.', color: 'from-violet-500/20 to-violet-600/5', ring: 'group-hover:ring-violet-500/40', glow: 'group-hover:shadow-violet-500/20', iconColor: 'group-hover:text-violet-400 group-hover:bg-violet-500/10' },
                                { number: '03', icon: Truck, title: 'Fitting & Ambil', desc: 'Kunjungi store untuk fitting presisi atau gunakan layanan antar ke lokasi Anda.', color: 'from-red-500/20 to-red-600/5', ring: 'group-hover:ring-red-500/40', glow: 'group-hover:shadow-red-500/20', iconColor: 'group-hover:text-red-400 group-hover:bg-red-500/10' },
                                { number: '04', icon: RotateCcw, title: 'Kembali & Rapi', desc: 'Kembalikan dalam keadaan bersih dan rapi. Selesai — siap untuk pasukan berikutnya.', color: 'from-emerald-500/20 to-emerald-600/5', ring: 'group-hover:ring-emerald-500/40', glow: 'group-hover:shadow-emerald-500/20', iconColor: 'group-hover:text-emerald-400 group-hover:bg-emerald-500/10' },
                            ].map((step, i) => (
                                <ScrollReveal key={i} delay={i * 0.12}>
                                    <div className={`relative group flex flex-col items-center lg:items-start text-center lg:text-left p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-500 cursor-default h-full ${step.ring} ring-1 ring-transparent`}>
                                        {/* Glow overlay */}
                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        {/* Step number + Icon row */}
                                        <div className="relative z-10 flex flex-col items-center lg:items-start gap-4 mb-6 w-full">
                                            {/* Floating number badge */}
                                            <div className="self-center lg:self-end">
                                                <span className="text-7xl font-black text-slate-700/20 group-hover:text-slate-600/30 transition-colors leading-none font-serif italic select-none">
                                                    {step.number}
                                                </span>
                                            </div>
                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 transition-all duration-300 ${step.iconColor} shadow-lg group-hover:shadow-xl group-hover:scale-105 group-hover:-translate-y-1`}>
                                                <step.icon size={28} strokeWidth={1.5} />
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">{step.title}</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{step.desc}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <ScrollReveal className="text-center mt-16">
                        <button onClick={() => { setView('CATALOG'); window.scrollTo(0, 0); }} className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:shadow-2xl hover:-translate-y-0.5">
                            <span>Mulai Sewa Sekarang</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </ScrollReveal>
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
                                    { title: 'Laundry Hygienic Steam', desc: 'Dicuci dengan proses laundry agar bersih, segar, dan nyaman dipakai.', icon: Sparkles },
                                    { title: 'Fitting Presisi & Rapi', desc: 'Potongan rapi dengan ukuran lengkap untuk menunjang postur tetap tegap.', icon: Ruler },
                                    { title: 'Material Premium Drill', desc: 'Bahan sejuk, cukup tebal, tidak mudah kusut, dan nyaman digunakan.', icon: Shield }
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
                                    width="800"
                                    height="600"
                                    src="/images/WhatsApp Image 2026-02-06 at 13.14.12.jpeg"
                                    alt="Detail Seragam"
                                    className="w-full h-[600px] object-cover aspect-[4/3]"
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
                            onClick={() => { setView('CATALOG'); window.scrollTo(0, 0); }}
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
                                    Jl. Kp. Cirumput samping mesjid al istiqomah No.60,<br />
                                    RT.01/RW.02, Limus Nunggal, Kec. Cileungsi,<br />
                                    Kabupaten Bogor, Jawa Barat 16820
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
                                src="https://maps.google.com/maps?q=Kostum+Fadilys+Cileungsi&hl=id&z=16&output=embed"
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
