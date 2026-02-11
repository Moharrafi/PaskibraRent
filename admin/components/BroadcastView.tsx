import React, { useState } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface BroadcastViewProps {
    onShowToast: (message: string, type: 'success' | 'error') => void;
}

const BroadcastView: React.FC<BroadcastViewProps> = ({ onShowToast }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSending, setIsSending] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const onConfirmSend = async () => {
        setIsSending(true);
        setShowConfirmation(false);
        try {
            await apiService.sendBroadcast(subject, message, imageUrl);
            onShowToast('Broadcast berhasil dikirim!', 'success');
            setSubject('');
            setMessage('');
            setImageUrl('');
        } catch (error) {
            console.error('Broadcast error:', error);
            onShowToast('Gagal mengirim broadcast.', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const handleSendClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        setShowConfirmation(true);
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-6 relative">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Send size={24} className="text-red-600" />
                    Kirim Broadcast Newsletter
                </h2>

                <form onSubmit={handleSendClick} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Subjek Email</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Contoh: Koleksi Terbaru Bulan Ini!"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-none transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Gambar Banner (Opsional)</label>
                        <div className="flex flex-col gap-4">
                            {/* Image Preview & Actions */}
                            {imageUrl ? (
                                <div className="relative w-full h-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 group">
                                    <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-lg"
                                        >
                                            Hapus Gambar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Upload Option */}
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group">
                                        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-red-500">
                                            <ImageIcon size={32} />
                                            <span className="text-sm font-medium">Upload Gambar</span>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setImageUrl(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>

                                    {/* URL Option */}
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="url"
                                            placeholder="Atau masukkan URL gambar..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-none transition-all font-medium text-sm h-full"
                                            onBlur={(e) => {
                                                if (e.target.value) setImageUrl(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-slate-400">Gunakan gambar landscape untuk hasil terbaik. Menerima URL atau upload langsung.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Pesan</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tulis pesan Anda di sini..."
                            required
                            rows={8}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-none transition-all font-medium resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSending}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Kirim Broadcast
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Box */}
            {subject && message && (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 dashed-border">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Preview Email</h3>
                    <div className="bg-white max-w-2xl mx-auto rounded-xl shadow-sm overflow-hidden border border-slate-100">
                        {/* Mock Email Header */}
                        <div className="p-6 border-b border-slate-50 text-center">
                            <h1 className="text-red-600 font-bold text-lg">KostumFadilyss</h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Official Newsletter</p>
                        </div>

                        {imageUrl && (
                            <div className="px-8 pt-6">
                                <img src={imageUrl} alt="Banner" className="w-full h-auto object-cover rounded-xl shadow-sm" />
                            </div>
                        )}

                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">{subject}</h2>
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{message}</p>
                        </div>

                        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                            <p className="text-xs text-slate-400">© {new Date().getFullYear()} KostumFadilyss. All rights reserved.</p>
                            <p className="text-[10px] text-slate-300 mt-2">Anda menerima email ini karena berlangganan newsletter kami.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 animate-pop-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Konfirmasi Broadcast</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Apakah Anda yakin ingin mengirim pesan ini ke semua pelanggan yang berlangganan newsletter?
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                            <div className="flex gap-3 mb-2">
                                <span className="text-xs font-bold text-slate-400 w-12 shrink-0">Subject:</span>
                                <span className="text-xs font-medium text-slate-700 truncate">{subject}</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-xs font-bold text-slate-400 w-12 shrink-0">Images:</span>
                                <span className="text-xs font-medium text-slate-700">{imageUrl ? 'Included' : 'None'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onConfirmSend}
                                className="px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Ya, Kirim Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BroadcastView;
