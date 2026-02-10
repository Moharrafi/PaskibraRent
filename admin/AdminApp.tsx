import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ProductForm from './components/ProductForm';
import DashboardStats from './components/DashboardStats';
import RevenueChart from './components/RevenueChart';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import GalleryView from './components/GalleryView';
import Toast from './components/Toast';
import { Product, Category, ChartData, AppSettings } from './types';
import * as storage from './services/storageService'; // Keep for auth and settings for now
import { apiService } from './services/apiService';
import { Plus, Search, Edit3, Trash2, Filter, Menu, AlertCircle, Image as ImageIcon, Check, LogOut, LayoutGrid, List, Flag } from 'lucide-react';

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // UI States
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'settings' | 'gallery'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Stats Data
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Check auth
    const isAuth = storage.checkAuth();
    setIsAuthenticated(isAuth);
    setIsAuthChecking(false);

    if (isAuth) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const fetchedProducts = await apiService.getProducts();
      setProducts(fetchedProducts);
      // Mock revenue data for now or fetch if API exists
      setRevenueData(storage.getRevenueHistory());
    } catch (error) {
      console.error("Failed to load data", error);
      showToast('Gagal memuat data produk', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadData();
  };

  const handleLogout = () => {
    storage.logout();
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      if (editingProduct) {
        await apiService.updateProduct(product);
        showToast('Produk berhasil diperbarui', 'success');
      } else {
        // Remove ID for creation as backend generates it
        const { id, ...newProduct } = product;
        await apiService.createProduct(newProduct);
        showToast('Produk berhasil ditambahkan', 'success');
      }
      loadData(); // Reload to get fresh data
      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error("Failed to save product", error);
      showToast('Gagal menyimpan produk', 'error');
    }
  };

  // Trigger modal confirmation
  const handleDeleteProduct = (id: string) => {
    setDeleteConfirmProductId(id);
  };

  // Execute actual delete
  const executeDeleteProduct = async () => {
    if (deleteConfirmProductId) {
      try {
        await apiService.deleteProduct(deleteConfirmProductId);
        showToast('Produk berhasil dihapus', 'success');
        loadData(); // Reload data
      } catch (error) {
        console.error("Failed to delete product", error);
        showToast('Gagal menghapus produk', 'error');
      } finally {
        setDeleteConfirmProductId(null);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const stats = useMemo(() => storage.getStats(products), [products]);

  if (isAuthChecking) return null;

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} onShowToast={showToast} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative transition-all duration-300">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Flag size={16} className="text-white fill-current" />
            </div>
            <span className="font-bold text-slate-900">PaskibraRent</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'inventory' && 'Katalog Produk'}
                  {activeTab === 'settings' && 'Pengaturan Sistem'}
                  {activeTab === 'gallery' && 'Galeri Foto'}
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  {activeTab === 'dashboard' && 'Ringkasan aktivitas dan performa toko.'}
                  {activeTab === 'inventory' && 'Kelola inventaris, stok, dan harga sewa.'}
                  {activeTab === 'settings' && 'Konfigurasi aplikasi dan profil admin.'}
                  {activeTab === 'gallery' && 'Kelola dokumentasi kegiatan Paskibra.'}
                </p>
              </div>

              {activeTab === 'inventory' && (
                <button
                  onClick={() => {
                    setEditingProduct(undefined);
                    setIsFormOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-200 flex items-center gap-2 justify-center"
                >
                  <Plus size={18} />
                  TAMBAH PRODUK
                </button>
              )}
            </div>

            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in">
                <DashboardStats stats={stats} />
                <RevenueChart data={revenueData} />

                {/* Recent Items Preview */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 text-lg">Produk Terbaru</h3>
                    <button onClick={() => setActiveTab('inventory')} className="text-red-600 text-sm font-bold hover:underline">Lihat Semua</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.slice(0, 3).map(product => (
                      <div key={product.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 items-center">
                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          {product.imageUrls?.[0] ? (
                            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                          <p className="text-xs font-bold text-red-600 mt-1">Stok: {product.stock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Content */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 animate-fade-in">
                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10">
                  <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Cari katalog..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:flex-none">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <option value="All">Semua Kategori</option>
                        {Object.values(Category).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {/* View Toggle Buttons */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Tampilan List"
                      >
                        <List size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Tampilan Grid"
                      >
                        <LayoutGrid size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table View */}
                {viewMode === 'table' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Produk</th>
                            <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                            <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Harga</th>
                            <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Stok</th>
                            <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="p-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                    {product.imageUrls?.[0] ? (
                                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ImageIcon size={16} />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{product.packageContents?.length || 0} item paket</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  {product.category}
                                </span>
                              </td>
                              <td className="p-5">
                                <div className="text-sm font-bold text-slate-900">
                                  Rp {Number(product.price).toLocaleString('id-ID')}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  / {product.rentalDuration} Hari
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                  <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                    {product.stock} Unit
                                  </span>
                                </div>
                              </td>
                              <td className="p-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit3 size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredProducts.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-10 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                  <AlertCircle size={32} className="opacity-50" />
                                  <p className="font-medium text-sm">Tidak ada produk ditemukan.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                          {product.imageUrls?.[0] ? (
                            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={32} />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm border border-white/20">
                              {product.category}
                            </span>
                          </div>

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:text-blue-600 transition-colors shadow-lg transform scale-0 group-hover:scale-100 duration-200"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:text-red-600 transition-colors shadow-lg transform scale-0 group-hover:scale-100 duration-200 delay-75"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-4 flex-1">
                            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1" title={product.name}>{product.name}</h3>
                            <p className="text-xs text-slate-500">{product.packageContents?.length || 0} item paket</p>
                          </div>

                          <div className="flex items-end justify-between border-t border-slate-50 pt-4 mt-auto">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Harga Sewa</p>
                              <div className="flex items-baseline gap-1">
                                <span className="font-bold text-slate-900">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                                <span className="text-[10px] text-slate-400">/ {product.rentalDuration}hr</span>
                              </div>
                            </div>
                            <div className={`flex flex-col items-end`}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Stok</p>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                <span className={`text-xs font-bold ${product.stock === 0 ? 'text-red-600' : 'text-slate-700'}`}>
                                  {product.stock}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-full py-20 text-center text-slate-400 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                          <AlertCircle size={32} />
                        </div>
                        <p className="font-medium">Tidak ada produk ditemukan.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Gallery View */}
            {activeTab === 'gallery' && (
              <div className="animate-fade-in">
                <GalleryView onShowToast={showToast} />
              </div>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <SettingsView onSettingsUpdate={loadData} />
              </div>
            )}

          </div>
        </div>

        {/* Product Form Modal */}
        {isFormOpen && (
          <ProductForm
            initialData={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(undefined);
            }}
          />
        )}

        {/* Delete Product Confirmation Modal */}
        {deleteConfirmProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Produk?</h3>
                <p className="text-sm text-slate-500 mb-6">Tindakan ini tidak dapat dibatalkan. Produk akan dihapus permanen dari katalog.</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirmProductId(null)}
                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={executeDeleteProduct}
                    className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                  <LogOut size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Keluar</h3>
                <p className="text-sm text-slate-500 mb-6">Apakah Anda yakin ingin keluar dari panel admin?</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminApp;