import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, AlertCircle, Loader2, ArrowRight, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import { User } from '../types';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Determine which service to call based on view
            let userData;
            if (isLoginView) {
                userData = await authService.login(formData.email, formData.password);
                onLogin(userData.user);
                onClose();
                setFormData({ name: '', email: '', password: '' });
            } else {
                await authService.register(formData.name, formData.email, formData.password);
                setIsVerificationSent(true);
                setFormData({ name: '', email: '', password: '' });
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerificationSent) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cek Email Anda</h3>
                        <p className="text-slate-600 mb-6">
                            Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek inbox (atau folder spam) dan klik link tersebut untuk mengaktifkan akun.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                        >
                            Tutup
                        </button>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header Image/Banner */}
                    <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/50"></div>
                        <h2 className="text-3xl font-bold text-white relative z-10 tracking-tight">
                            {isLoginView ? 'Selamat Datang' : 'Bergabunglah'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLoginView && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required={!isLoginView}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                            placeholder="Nama Pasukan / Pribadi"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            {isLoginView ? 'Masuk Sekarang' : 'Daftar Akun'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-500 text-sm">
                                {isLoginView ? 'Belum punya akun?' : 'Sudah punya akun?'}
                                <button
                                    onClick={() => setIsLoginView(!isLoginView)}
                                    className="ml-2 text-red-600 font-bold hover:underline"
                                >
                                    {isLoginView ? 'Daftar disini' : 'Masuk disini'}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;