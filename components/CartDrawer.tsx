import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, CreditCard, ChevronRight, AlertCircle, Clock, Minus, Plus } from 'lucide-react';
import { CartItem, BookingDetails } from '../types';

interface CartDrawerProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: (details: BookingDetails) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ items, onRemove, onUpdateQty, onCheckout, onClose, isLoading = false }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [rentalDuration, setRentalDuration] = useState<number>(3);
  const [bookingData, setBookingData] = useState<Partial<BookingDetails>>({
    name: '',
    institution: '',
    phone: '',
    email: '',
    pickupDate: '',
    returnDate: '',
  });

  // --- Pricing Logic ---
  // Base price covers up to 3 days.
  // Each additional day adds 20% of the base price.
  const calculateItemPrice = (basePrice: number, duration: number) => {
    const baseDays = 3;
    if (duration <= baseDays) return basePrice;
    const extraDays = duration - baseDays;
    const penaltyPerDay = basePrice * 0.2;
    return basePrice + (extraDays * penaltyPerDay);
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemPrice(item.price, rentalDuration) * item.quantity;
  }, 0);

  // --- Date Logic ---
  const handleDurationChange = (delta: number) => {
    const newDuration = Math.max(1, Math.min(14, rentalDuration + delta));
    setRentalDuration(newDuration);

    // Update return date if pickup date exists
    if (bookingData.pickupDate) {
      updateReturnDateFromDuration(bookingData.pickupDate, newDuration);
    }
  };

  const updateReturnDateFromDuration = (startDateStr: string, duration: number) => {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return;

    const end = new Date(start);
    end.setDate(start.getDate() + duration);

    setBookingData(prev => ({
      ...prev,
      returnDate: end.toISOString().split('T')[0]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'pickupDate') {
      setBookingData(prev => ({ ...prev, [name]: value }));
      if (value) {
        updateReturnDateFromDuration(value, rentalDuration);
      }
    } else if (name === 'returnDate') {
      // If user manually changes return date, recalculate duration
      setBookingData(prev => ({ ...prev, [name]: value }));
      if (bookingData.pickupDate && value) {
        const start = new Date(bookingData.pickupDate);
        const end = new Date(value);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Only update if logical (end > start)
        if (end > start) {
          setRentalDuration(diffDays);
        }
      }
    } else {
      setBookingData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onCheckout({
        name: bookingData.name!,
        institution: bookingData.institution!,
        phone: bookingData.phone!,
        email: bookingData.email!,
        pickupDate: bookingData.pickupDate!,
        returnDate: bookingData.returnDate!,
        rentalDuration: rentalDuration,
        totalPrice: subtotal,
        items: items // Pass current items to checkout
      });
    }
  };

  const isFormValid = bookingData.name && bookingData.phone && bookingData.pickupDate && bookingData.returnDate;

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Keranjang Kosong</h3>
        <p className="text-slate-500 mb-6">Belum ada kostum yang dipilih untuk pasukan Anda.</p>
        <button onClick={onClose} className="text-red-700 font-medium hover:underline">
          Lihat Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {step === 1 ? 'Keranjang Sewa' : 'Data Pemesan'}
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            {items.length} Item
          </span>
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 1 ? (
          <div className="space-y-6">

            {/* Duration Selector */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Clock size={18} />
                  <span>Durasi Sewa</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {rentalDuration > 3 ? `+${(rentalDuration - 3) * 20}% Biaya` : 'Harga Standar'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDurationChange(-1)}
                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600"
                  disabled={rentalDuration <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center border-b-2 border-slate-100 pb-1">
                  <span className="text-2xl font-bold text-slate-900">{rentalDuration}</span>
                  <span className="text-sm text-slate-500 ml-1">Hari</span>
                </div>
                <button
                  onClick={() => handleDurationChange(1)}
                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600"
                  disabled={rentalDuration >= 14}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Item List */}
            <div className="space-y-4">
              {items.map(item => {
                const finalPrice = calculateItemPrice(item.price, rentalDuration);
                return (
                  <div key={item.id} className="flex gap-4 p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-slate-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                        <div className="flex flex-col">
                          <p className="text-red-700 font-medium text-sm">Rp {finalPrice.toLocaleString('id-ID')}</p>
                          {rentalDuration > 3 && (
                            <p className="text-[10px] text-slate-400">
                              (Dasar: {item.price.toLocaleString('id-ID')})
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-slate-100 rounded-lg h-8">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg transition-colors"
                            disabled={item.quantity >= item.availableStock}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 leading-relaxed space-y-1">
                <p><strong>Info Harga:</strong> Harga tertera mencakup sewa standar 3 hari.</p>
                <p>Lebih dari 3 hari dikenakan biaya tambahan 20% dari harga dasar per hari.</p>
              </div>
            </div>
          </div>
        ) : (
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input required name="name" value={bookingData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="Penanggung Jawab" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Instansi / Sekolah</label>
              <input required name="institution" value={bookingData.institution} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Contoh: SMA Negeri 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. WhatsApp</label>
              <input required name="phone" type="tel" value={bookingData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="08..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input required name="email" type="email" value={bookingData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="email@contoh.com" />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock size={14} /> Periode Sewa ({rentalDuration} Hari)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tgl Pengambilan</label>
                  <input required name="pickupDate" type="date" value={bookingData.pickupDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tgl Pengembalian</label>
                  <input required name="returnDate" type="date" value={bookingData.returnDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                *Mengubah tanggal pengembalian akan otomatis memperbarui durasi dan harga sewa.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-600">Total Estimasi</span>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900 block">Rp {subtotal.toLocaleString('id-ID')}</span>
            {rentalDuration > 3 && <span className="text-xs text-red-600 font-medium">Termasuk biaya overtime</span>}
          </div>
        </div>

        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            Lanjut ke Data Diri <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Kembali
            </button>
            <button
              type="submit"
              form="checkout-form"
              disabled={!isFormValid || isLoading}
              className="flex-1 py-3 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard size={18} /> Konfirmasi Booking
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;