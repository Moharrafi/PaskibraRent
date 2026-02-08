import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, RotateCcw } from 'lucide-react';
import { BookingDetails, ViewState } from '../types';

interface SuccessViewProps {
    lastBooking: BookingDetails | null;
    openWhatsApp: (message: string) => void;
    handleRentAgain: () => void;
    setView: (view: ViewState) => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ lastBooking, openWhatsApp, handleRentAgain, setView }) => {
    if (!lastBooking) return null;

    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4"
        >
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl text-center max-w-md w-full border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    type="spring"
                    className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                    <CheckCircle className="w-10 h-10" />
                </motion.div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Berhasil!</h2>
                <p className="text-slate-500 mb-8">Terima kasih <span className="font-semibold text-slate-900">{lastBooking.name}</span>.<br />Pesanan Anda sedang kami siapkan.</p>

                <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-3 border border-slate-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Kode Booking</span>
                        <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">#PASK-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tgl Ambil</span>
                        <span className="font-medium text-slate-900">{lastBooking.pickupDate}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => openWhatsApp(`Halo, saya sudah booking dengan nama ${lastBooking.name}. Mohon konfirmasinya.`)}
                        className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
                    >
                        <Phone size={18} /> Konfirmasi via WhatsApp
                    </button>
                    <button
                        onClick={handleRentAgain}
                        className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <RotateCcw size={18} /> Pinjam Ulang
                    </button>
                    <button
                        onClick={() => setView('HOME')}
                        className="w-full py-3.5 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SuccessView;
