import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, RotateCcw, Copy, Check, Info, QrCode } from 'lucide-react';
import { BookingDetails, ViewState } from '../types';
import { PAYMENT_METHODS, APP_NAME, CONTACT_WA } from '../constants';

interface SuccessViewProps {
    lastBooking: BookingDetails | null;
    openWhatsApp: (message: string) => void;
    handleRentAgain: () => void;
    setView: (view: ViewState) => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ lastBooking, openWhatsApp, handleRentAgain, setView }) => {
    const [copied, setCopied] = useState(false);

    if (!lastBooking) return null;

    // Find selected payment method
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === lastBooking.paymentMethod) || PAYMENT_METHODS[0];
    const isQRIS = paymentMethod.id === 'qris';

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentMethod.account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[90vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-8"
        >
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full border border-slate-100 relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

                <div className="p-8 pb-4 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-green-100"
                    >
                        <CheckCircle strokeWidth={2.5} className="w-12 h-12" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Berhasil!</h2>
                    <p className="text-slate-500 text-sm">
                        Terima kasih <span className="font-semibold text-slate-900">{lastBooking.name}</span>.
                        <br />Mohon selesaikan pembayaran Anda.
                    </p>
                </div>

                {/* Receipt Card */}
                <div className="px-6 mb-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
                        {/* Receipt Zigzag Top (Visual trick with css or svg, simplified here with dash border or just simple container) */}

                        <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-4 border-dashed">
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Tagihan</p>
                                <p className="text-3xl font-extrabold text-slate-900">RP {lastBooking.totalPrice.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Menunggu</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 font-semibold mb-2">Metode Pembayaran</p>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 shrink-0">
                                        <paymentMethod.icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900">{paymentMethod.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{paymentMethod.type}</p>
                                    </div>
                                </div>
                            </div>

                            {!isQRIS ? (
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold mb-2">Nomor Rekening</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 font-mono text-lg font-bold text-slate-800 tracking-wide text-center">
                                            {paymentMethod.account}
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors active:scale-95"
                                            title="Salin No. Rekening"
                                        >
                                            {copied ? <Check size={20} /> : <Copy size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2 text-center">
                                        A.N. <span className="font-semibold">{paymentMethod.holder}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-white rounded-xl border border-slate-200 border-dashed">
                                    <div className="w-32 h-32 bg-slate-100 mx-auto rounded-lg flex items-center justify-center text-slate-400 mb-2">
                                        <QrCode size={48} />
                                    </div>
                                    <p className="text-xs font-medium text-slate-900">Scan QR Code Toko</p>
                                    <p className="text-[10px] text-slate-500">Minta Admin Saat Konfirmasi WA</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4 px-2">
                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Simpan bukti transfer Anda, lalu kirimkan ke admin kami untuk verifikasi pesanan.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col gap-3">
                    <button
                        onClick={() => openWhatsApp(`Halo ${APP_NAME}, saya ${lastBooking.name}. Saya sudah melakukan Booking dengan No. Invoice ${lastBooking.invoiceId} dan sudah melakukan pembayaran via ${paymentMethod.name}, Mohon Konfirmasinya`)}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 active:translate-y-0.5"
                    >
                        <Phone size={18} /> Konfirmasi Pembayaran
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleRentAgain}
                            className="py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                            <RotateCcw size={16} /> Sewa Lagi
                        </button>
                        <button
                            onClick={() => setView('HOME')}
                            className="py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                            Beranda
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SuccessView;
