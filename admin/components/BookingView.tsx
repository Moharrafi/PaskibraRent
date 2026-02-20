import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Booking } from '../types';
import { Search, Calendar, CheckCircle, Clock, XCircle, Phone, Mail, ChevronDown, Package } from 'lucide-react';

interface BookingViewProps {
    onShowToast: (message: string, type: 'success' | 'error') => void;
}

const BookingView: React.FC<BookingViewProps> = ({ onShowToast }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to load bookings", error);
            onShowToast('Gagal memuat data booking', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'selesai': return 'bg-green-100 text-green-700 border-green-200';
            case 'sedang disewa': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'konfirmasi': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'menunggu': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const name = booking.name || '';
        const institution = booking.institution || '';
        const id = booking.id ? booking.id.toString() : '';
        const status = booking.status || '';

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.includes(searchTerm) ||
            institution.toLowerCase().includes(searchTerm);

        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && status.toLowerCase() === statusFilter.toLowerCase();
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="animate-fade-in">
            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-6 sticky top-0 z-10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama, instansi, atau ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Menunggu', 'Konfirmasi', 'Sedang Disewa', 'Selesai'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status.toLowerCase())}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${statusFilter === status.toLowerCase()
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Memuat data booking...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Package size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Belum Ada Booking</h3>
                    <p className="text-slate-500">Tidak ada data booking yang sesuai dengan filter saat ini.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="p-4 pl-6">ID & Status</th>
                                    <th className="p-4">Penyewa</th>
                                    <th className="p-4">Tanggal Sewa</th>
                                    <th className="p-4">Item</th>
                                    <th className="p-4 text-right">Total</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 pl-6 align-top">
                                            <div className="font-mono font-bold text-slate-900 text-sm">#{booking.id}</div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border mt-2 ${getStatusColor(booking.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                                                {booking.status}
                                            </span>
                                            <div className="text-[10px] text-slate-400 mt-2">
                                                {new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>

                                        <td className="p-4 align-top">
                                            <div className="font-bold text-slate-900">{booking.name}</div>
                                            <div className="text-sm text-slate-500">{booking.institution}</div>
                                            <div className="flex gap-2 mt-2">
                                                <a href={`https://wa.me/${booking.phone}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                                                    <Phone size={14} />
                                                </a>
                                                <a href={`mailto:${booking.email}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                    <Mail size={14} />
                                                </a>
                                            </div>
                                        </td>

                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-1 text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="w-16 text-xs text-slate-400 font-medium uppercase">Ambil</span>
                                                    <span className="font-semibold">{formatDate(booking.pickup_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="w-16 text-xs text-slate-400 font-medium uppercase">Kembali</span>
                                                    <span className="font-semibold">{formatDate(booking.return_date)}</span>
                                                </div>
                                                <div className="mt-1 inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold self-start">
                                                    {(new Date(booking.return_date).getTime() - new Date(booking.pickup_date).getTime()) / (1000 * 3600 * 24)} Hari
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 align-top">
                                            <div className="space-y-1">
                                                {booking.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                                        <span className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded text-xs font-bold text-slate-500">{item.item_qty}x</span>
                                                        <span className="truncate max-w-[150px]" title={item.name}>{item.name || `Item #${item.item_id}`}</span>
                                                    </div>
                                                ))}
                                                {booking.items.length > 3 && (
                                                    <div className="text-xs text-slate-400 italic pl-7">+{booking.items.length - 3} item lainnya...</div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-right align-top">
                                            <div className="font-bold text-slate-900">
                                                Rp {Math.floor(Number(booking.total_price)).toLocaleString('id-ID')}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 uppercase font-medium">
                                                {booking.payment_method === 'bca' ? 'Bank BCA' : booking.payment_method}
                                            </div>
                                        </td>

                                        <td className="p-4 align-top text-center">
                                            <button
                                                onClick={() => window.open(`https://wa.me/${booking.phone}?text=Halo ${booking.name}, Admin disini. Terkait booking #${booking.id}...`, '_blank')}
                                                className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                                            >
                                                Hubungi
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingView;
