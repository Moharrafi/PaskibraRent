import React, { useState } from 'react';
import { Flag, ArrowRight, Lock, Mail } from 'lucide-react';
import * as storage from '../services/storageService';

import { apiService } from '../services/apiService';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onShowToast }) => {
  const [email, setEmail] = useState('admin@paskibrarent.id');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await apiService.login(email, password);
      if (data.token && data.user && data.user.role === 'admin') {
        localStorage.setItem('token', data.token);
        // keep old flag for UI consistency if needed
        storage.login(email, password);
        onShowToast('Login Berhasil! Selamat datang.', 'success');
        onLoginSuccess();
      } else {
        setError('Akses ditolak. Bukan akun admin.');
        onShowToast('Akses ditolak. Bukan akun admin.', 'error');
        setIsLoading(false);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Email atau password salah.';
      setError(errMsg);
      onShowToast('Login Gagal. Periksa kredensial Anda.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[auto] md:min-h-[600px]">

        {/* Left Side: Brand & Visual */}
        <div className="w-full md:w-1/2 bg-slate-900 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden min-h-[300px] md:min-h-auto">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-red-600 rounded-full blur-[80px] md:blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-blue-600 rounded-full blur-[80px] md:blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="shrink-0">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-xl" />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight">KostumFadilyss</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm font-medium tracking-widest uppercase">Admin Control Panel</p>
          </div>

          <div className="relative z-10 space-y-4 md:space-y-6 mt-8 md:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Kelola Inventaris Paskibra dengan <span className="text-red-500">Mudah.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Sistem manajemen terpadu untuk katalog produk, stok, dan laporan penyewaan perlengkapan Paskibra.
            </p>
          </div>

          <div className="relative z-10 text-[10px] md:text-xs text-slate-500 font-medium mt-8 md:mt-0 hidden md:block">
            &copy; {new Date().getFullYear()} KostumFadilyss System.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full py-6 md:py-0">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Selamat Datang Kembali</h2>
            <p className="text-slate-500 mb-6 md:mb-8 text-sm">Masuk untuk mengakses dashboard admin.</p>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 outline-none transition-all font-medium text-slate-900 text-sm"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 outline-none transition-all font-medium text-slate-900 text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-center gap-2 animate-fade-in">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 mt-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Masuk Dashboard <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-8 md:hidden text-[10px] text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} KostumFadilyss System.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginView;