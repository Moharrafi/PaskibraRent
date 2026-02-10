import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, RotateCcw, User, Store, CheckCircle } from 'lucide-react';
import * as storage from '../services/storageService';
import { AppSettings } from '../types';

interface SettingsViewProps {
  onSettingsUpdate?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsUpdate }) => {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Reload settings when component mounts
    setSettings(storage.getSettings());
  }, []);

  const handleResetData = () => {
    if (confirm('PERINGATAN: Ini akan menghapus semua data produk yang telah Anda tambahkan dan mengembalikan ke data awal (dummy). Anda yakin?')) {
      storage.resetData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(settings);
    if (onSettingsUpdate) onSettingsUpdate();
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Profile Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Profil Admin</h2>
            <p className="text-sm text-slate-500">Kelola informasi akun administrator Anda</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              value={settings.adminName}
              onChange={(e) => handleChange('adminName', e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 outline-none rounded-2xl text-sm font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Email Admin</label>
            <input 
              type="email" 
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 outline-none rounded-2xl text-sm font-medium text-slate-900"
            />
          </div>
           <div className="md:col-span-2 flex items-center justify-end gap-4 mt-2">
            {isSaved && (
              <span className="text-emerald-600 text-sm font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle size={16} /> Tersimpan
              </span>
            )}
            <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
              <Save size={16} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* App Config Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Konfigurasi Aplikasi</h2>
            <p className="text-sm text-slate-500">Pengaturan umum untuk tampilan web</p>
          </div>
        </div>

        <div className="space-y-6">
           <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">Nama Toko / Cabang</label>
            <input 
              type="text" 
              value={settings.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 outline-none rounded-2xl text-sm font-medium text-slate-900"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-400" />
              <div>
                <p className="font-bold text-slate-700 text-sm">Notifikasi Pesanan</p>
                <p className="text-xs text-slate-400">Terima email saat ada penyewaan baru</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications} 
                onChange={() => handleChange('notifications', !settings.notifications)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm shrink-0">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-900">Area Berbahaya</h2>
            <p className="text-sm text-red-700/80 mt-1">Tindakan di sini tidak dapat dibatalkan.</p>
            
            <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-red-100/50 shadow-sm">
              <div>
                <p className="font-bold text-slate-900 text-sm">Reset Data Aplikasi</p>
                <p className="text-xs text-slate-400">Hapus semua produk kustom dan kembalikan ke default.</p>
              </div>
              <button 
                onClick={handleResetData}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;