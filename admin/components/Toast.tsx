import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
      isSuccess 
        ? 'bg-white border-emerald-100' 
        : 'bg-white border-red-100'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
      }`}>
        {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
      </div>
      
      <div className="min-w-[200px]">
        <h4 className={`text-xs font-bold ${isSuccess ? 'text-emerald-900' : 'text-red-900'}`}>
          {isSuccess ? 'Berhasil' : 'Gagal'}
        </h4>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{message}</p>
      </div>

      <button 
        onClick={onClose}
        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;