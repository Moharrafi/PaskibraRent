import React, { useState } from 'react';
import { X, User, Mail, Save, Clock, CheckCircle, AlertCircle, Lock, Calendar, ChevronRight, Package, Loader2, ArrowLeft, FileText, MapPin, Phone, Printer, ShieldCheck, Repeat, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType } from '../types';
import { APP_NAME, COSTUMES } from '../constants';

// --- Shared Modal Wrapper ---
const ModalWrapper: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    maxWidth?: string;
    noScroll?: boolean;
}> = ({ isOpen, onClose, title, icon: Icon, children, maxWidth = "max-w-2xl", noScroll = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
                >
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-red-600 shadow-sm border border-slate-100">
                                <Icon size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <X size={20} />
                        </button>
                    </div>
                    <div className={`p-0 bg-slate-50 flex-1 ${noScroll ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}>
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// --- 1. User Profile Modal ---
interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
    onUpdate: (name: string, email: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            onUpdate(name, email);
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => { setIsSuccess(false); onClose(); }, 1500);
        }, 1000);
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Profil Pengguna" icon={User}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-3 border-4 border-white shadow-lg relative group overflow-hidden">
                        <User size={48} />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold">Ubah</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">Member sejak 2024</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isSuccess
                            ? 'bg-green-600 shadow-green-200'
                            : 'bg-slate-900 hover:bg-red-700 hover:shadow-red-200'
                            }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : isSuccess ? <><CheckCircle /> Tersimpan</> : <><Save size={18} /> Simpan Perubahan</>}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

// --- 2. Rental History Modal (Enhanced) ---

// Enhanced Mock Data
const MOCK_HISTORY = [
    {
        id: 'TRX-8821-2024',
        date: '15 Feb 2024',
        pickupDate: '20 Feb 2024',
        returnDate: '23 Feb 2024',
        duration: 3,
        status: 'Selesai',
        total: 6375000,
        itemsSummary: 'Seragam PDU Putra (x15), Sepatu PDH (x15)',
        details: [
            { name: 'Seragam PDU Paskibraka Putra (Lengkap)', qty: 15, price: 350000, image: 'https://picsum.photos/id/1005/100/100' },
            { name: 'Sepatu PDH Pantofel Hitam Mengkilap', qty: 15, price: 75000, image: 'https://picsum.photos/id/1071/100/100' }
        ]
    },
    {
        id: 'TRX-9921-2024',
        date: '01 Mar 2024',
        pickupDate: '05 Mar 2024',
        returnDate: '08 Mar 2024',
        duration: 3,
        status: 'Sedang Disewa',
        total: 240000,
        itemsSummary: 'Sarung Tangan Putih (2 Lusin)',
        details: [
            { name: 'Sarung Tangan Putih (1 Lusin)', qty: 2, price: 120000, image: 'https://picsum.photos/id/201/100/100' }
        ]
    },
    {
        id: 'TRX-7734-2023',
        date: '10 Nov 2023',
        pickupDate: '12 Nov 2023',
        returnDate: '15 Nov 2023',
        duration: 3,
        status: 'Selesai',
        total: 1350000,
        itemsSummary: 'Atribut Evolet (x30)',
        details: [
            { name: 'Set Atribut Evolet & Pangkat', qty: 30, price: 45000, image: 'https://picsum.photos/id/104/100/100' }
        ]
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        'Selesai': 'bg-green-100 text-green-700 border-green-200',
        'Sedang Disewa': 'bg-amber-100 text-amber-700 border-amber-200',
        'Dibatalkan': 'bg-red-100 text-red-700 border-red-200',
        'Menunggu': 'bg-blue-100 text-blue-700 border-blue-200',
    };

    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${styles[status as keyof typeof styles] || styles['Menunggu']}`}>
            {status}
        </span>
    );
};

interface RentalHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
    onRentAgain: (items: any[]) => void;
}

export const RentalHistoryModal: React.FC<RentalHistoryModalProps> = ({ isOpen, onClose, user, onRentAgain }) => {
    const [selectedTrx, setSelectedTrx] = useState<typeof MOCK_HISTORY[0] | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    // Reset selection when modal closes
    if (!isOpen && selectedTrx) setSelectedTrx(null);

    const handleBack = () => setSelectedTrx(null);

    // Helper to parse "15 Feb 2024" to Date object
    const parseMockDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split(' ');
        const months: { [key: string]: number } = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        return new Date(parseInt(year), months[month] || 0, parseInt(day));
    };

    // Filter Logic
    const filteredHistory = MOCK_HISTORY.filter(item => {
        const itemDate = parseMockDate(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        let matchesDate = true;
        if (start) matchesDate = matchesDate && itemDate >= start;
        if (end) matchesDate = matchesDate && itemDate <= end;

        let matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;

        return matchesDate && matchesStatus;
    });

    const handlePrintInvoice = () => {
        if (!selectedTrx) return;

        const invoiceWindow = window.open('', '_blank');
        if (invoiceWindow) {
            const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${selectedTrx.id}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body class="bg-white p-8 md:p-12 max-w-4xl mx-auto">
            
            <!-- Header -->
            <div class="flex justify-between items-start mb-12 pb-8 border-b border-slate-200">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <div class="w-8 h-8 bg-red-700 rounded flex items-center justify-center text-white font-bold text-lg">P</div>
                        <h1 class="text-2xl font-bold text-slate-900">${APP_NAME}</h1>
                    </div>
                    <p class="text-slate-500 text-sm">
                        Jl. Medan Merdeka Barat No. 12<br>
                        Gambir, Jakarta Pusat, 10110<br>
                        DKI Jakarta, Indonesia
                    </p>
                </div>
                <div class="text-right">
                    <h2 class="text-4xl font-bold text-slate-200 uppercase tracking-widest mb-2">Invoice</h2>
                    <p class="text-slate-900 font-bold mb-1">${selectedTrx.id}</p>
                    <div class="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase mt-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        Lunas
                    </div>
                </div>
            </div>

            <!-- Customer & Date Info -->
            <div class="grid grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ditagihkan Kepada</h3>
                    <p class="font-bold text-slate-900 text-lg">${user?.name || 'Pelanggan'}</p>
                    <p class="text-slate-500 text-sm">${user?.email || ''}</p>
                    <p class="text-slate-500 text-sm mt-1">+62 812-3456-7890</p>
                </div>
                <div class="grid grid-cols-2 gap-4 text-right sm:text-left">
                    <div>
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Transaksi</h3>
                        <p class="font-semibold text-slate-900">${selectedTrx.date}</p>
                    </div>
                    <div>
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jatuh Tempo</h3>
                        <p class="font-semibold text-slate-900">${selectedTrx.pickupDate}</p>
                    </div>
                    <div>
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Ambil</h3>
                        <p class="font-semibold text-slate-900">${selectedTrx.pickupDate}</p>
                    </div>
                    <div>
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Kembali</h3>
                        <p class="font-semibold text-slate-900">${selectedTrx.returnDate}</p>
                    </div>
                </div>
            </div>

            <!-- Items Table -->
            <div class="mb-10">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-slate-900 text-left">
                            <th class="pb-3 pt-2 font-bold text-slate-900">Deskripsi Item</th>
                            <th class="pb-3 pt-2 font-bold text-slate-900 text-center">Durasi</th>
                            <th class="pb-3 pt-2 font-bold text-slate-900 text-center">Qty</th>
                            <th class="pb-3 pt-2 font-bold text-slate-900 text-right">Harga Satuan</th>
                            <th class="pb-3 pt-2 font-bold text-slate-900 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${selectedTrx.details.map(item => `
                            <tr>
                                <td class="py-4 text-slate-800 font-medium">${item.name}</td>
                                <td class="py-4 text-slate-500 text-center">${selectedTrx.duration} Hari</td>
                                <td class="py-4 text-slate-500 text-center">${item.qty}</td>
                                <td class="py-4 text-slate-500 text-right">Rp ${item.price.toLocaleString('id-ID')}</td>
                                <td class="py-4 text-slate-900 font-bold text-right">Rp ${(item.qty * item.price).toLocaleString('id-ID')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Footer & Totals -->
            <div class="flex flex-col sm:flex-row justify-between items-end gap-8 border-t border-slate-200 pt-8">
                <div class="max-w-xs text-sm text-slate-500">
                    <p class="font-bold text-slate-900 mb-1">Metode Pembayaran</p>
                    <p>Bank Transfer - BCA</p>
                    <p class="mt-4 text-xs">Terima kasih telah mempercayakan kebutuhan kostum pasukan Anda kepada ${APP_NAME}.</p>
                </div>
                
                <div class="w-full sm:w-auto min-w-[250px]">
                    <div class="flex justify-between py-2 text-slate-600">
                        <span>Subtotal</span>
                        <span>Rp ${selectedTrx.total.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between py-2 text-slate-600">
                        <span>Pajak & Layanan (0%)</span>
                        <span>Rp 0</span>
                    </div>
                    <div class="flex justify-between py-3 border-t border-slate-200 text-lg font-bold text-slate-900 mt-2">
                        <span>Total Bayar</span>
                        <span>Rp ${selectedTrx.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>

            <!-- Print Actions (Hidden on Print) -->
            <div class="no-print fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 text-center backdrop-blur">
                <button onclick="window.print()" class="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-slate-200 transition">Cetak Sekarang</button>
            </div>
        </body>
        </html>
        `;

            invoiceWindow.document.open();
            invoiceWindow.document.write(invoiceContent);
            invoiceWindow.document.close();
        }
    };

    const handleRentAgainClick = () => {
        if (!selectedTrx) return;

        // Convert details to array for the handler
        const itemsToRent = selectedTrx.details.map(detail => {
            // Try to find matching costume from constants to get full data (category, id, etc)
            const matchedCostume = COSTUMES.find(c => c.name === detail.name);
            if (matchedCostume) {
                return {
                    ...matchedCostume,
                    quantity: detail.qty,
                    rentalDays: 3 // Default reset to 3 days for new order
                };
            }
            // Fallback if not found exact match (should ideally allow this in a real app or handle error)
            return null;
        }).filter(Boolean); // Remove nulls

        if (itemsToRent.length > 0) {
            onRentAgain(itemsToRent);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={selectedTrx ? `Detail Transaksi` : "Riwayat Penyewaan"}
            icon={selectedTrx ? FileText : Clock}
            maxWidth="max-w-4xl" // Wider modal for dashboard feel
        >
            <AnimatePresence mode="wait">
                {selectedTrx ? (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-6 bg-slate-50 min-h-full"
                    >
                        {/* Detail View Header - SAME AS BEFORE BUT WIDER */}
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={handleBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg leading-none">{selectedTrx.id}</h4>
                                <p className="text-xs text-slate-500 mt-1">Dipesan pada {selectedTrx.date}</p>
                            </div>
                            <div className="ml-auto">
                                <StatusBadge status={selectedTrx.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Timeline Info */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Informasi Peminjaman</h5>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 text-slate-400"><Calendar size={18} /></div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Tanggal Ambil</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedTrx.pickupDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 text-slate-400"><Clock size={18} /></div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Tanggal Kembali</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedTrx.returnDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm">Total Tagihan</span>
                                        <span className="text-green-400 text-xs bg-green-900/30 px-2 py-0.5 rounded border border-green-800">Lunas</span>
                                    </div>
                                    <div className="text-3xl font-bold">Rp {selectedTrx.total.toLocaleString('id-ID')}</div>
                                </div>
                                <div className="relative z-10 flex gap-2 mt-4">
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Printer size={14} /> Invoice
                                    </button>
                                    <button
                                        onClick={handleRentAgainClick}
                                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                                    >
                                        <Repeat size={14} /> Sewa Lagi
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Rincian Item</h5>
                            <div className="space-y-4">
                                {selectedTrx.details.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h6 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h6>
                                            <p className="text-xs text-slate-500 mb-1">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">Rp {(item.qty * item.price).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-50 min-h-[60vh] flex flex-col"
                    >
                        {/* --- FILTER BAR --- */}
                        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dari Tanggal</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sampai Tanggal</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => { setStartDate(''); setEndDate(''); setStatusFilter('Semua'); }}
                                            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors h-[38px]"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto md:pb-0 no-scrollbar">
                                    {['Semua', 'Selesai', 'Sedang Disewa', 'Menunggu', 'Dibatalkan'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${statusFilter === status
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- LIST CONTENT --- */}
                        <div className="p-6 space-y-3 flex-1 overflow-y-auto">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedTrx(item)}
                                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center"
                                    >
                                        {/* Date Box */}
                                        <div className="flex flex-row md:flex-col items-center justify-center bg-slate-50 rounded-lg p-3 w-full md:w-24 shrink-0 gap-3 md:gap-0 border border-slate-100">
                                            <span className="text-2xl font-bold text-slate-800">{item.date.split(' ')[0]}</span>
                                            <span className="text-xs font-medium text-slate-500 uppercase">{item.date.split(' ')[1]}</span>
                                            <span className="text-[10px] text-slate-400 md:hidden">{item.date.split(' ')[2]}</span>
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.id}</span>
                                                <StatusBadge status={item.status} />
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-red-700 transition-colors">
                                                {item.itemsSummary}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    <span>Ambil: {item.pickupDate}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    <span>Durasi: {item.duration} Hari</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-2 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 mt-2 md:mt-0">
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Bayar</p>
                                                <p className="font-bold text-slate-900 text-lg">Rp {item.total.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all hidden md:flex">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">Tidak ada transaksi ditemukan</h3>
                                    <p className="text-slate-500 text-sm mt-1">Coba atur ulang filter tanggal atau status.</p>
                                    <button
                                        onClick={() => { setStartDate(''); setEndDate(''); setStatusFilter('Semua'); }}
                                        className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalWrapper>
    );
};

// --- 3. Change Password Modal ---
export const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => { setIsSuccess(false); onClose(); }, 1500);
        }, 1500);
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Ganti Password" icon={Lock}>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                    <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-amber-800 leading-relaxed">
                        <p className="font-bold mb-1">Keamanan Akun</p>
                        Gunakan minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka.
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Lama</label>
                        <input type="password" required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Baru</label>
                        <input type="password" required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konfirmasi Password Baru</label>
                        <input type="password" required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm" />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isSuccess
                            ? 'bg-green-600 shadow-green-200'
                            : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                            }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : isSuccess ? <><CheckCircle /> Password Berhasil Diubah</> : 'Update Password'}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};