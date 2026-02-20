import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ProductForm from './components/ProductForm';
import Toast from './components/Toast';
import { Product, ChartData } from './types';
import * as storage from './services/storageService';
import { apiService } from './services/apiService';
import { Plus, Trash2, Menu, LogOut, Image as ImageIcon } from 'lucide-react';

// Lazy load views
const DashboardStats = React.lazy(() => import('./components/DashboardStats'));
const RevenueChart = React.lazy(() => import('./components/RevenueChart'));
const SettingsView = React.lazy(() => import('./components/SettingsView'));
const LoginView = React.lazy(() => import('./components/LoginView'));
const GalleryView = React.lazy(() => import('./components/GalleryView'));
const BroadcastView = React.lazy(() => import('./components/BroadcastView'));
const InventoryView = React.lazy(() => import('./components/InventoryView'));
const BookingView = React.lazy(() => import('./components/BookingView'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-20 text-slate-400">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
  </div>
);

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // UI States
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'settings' | 'gallery' | 'broadcast' | 'booking'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

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

      // Fetch real revenue data from server
      const fetchedRevenue = await apiService.getRevenueStats();
      setRevenueData(fetchedRevenue);
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

  const stats = useMemo(() => storage.getStats(products), [products]);

  if (isAuthChecking) return null;

  if (!isAuthenticated) {
    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        <LoginView onLoginSuccess={handleLoginSuccess} onShowToast={showToast} />
      </React.Suspense>
    );
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
            <div className="shrink-0">
              <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-xl" />
            </div>
            <span className="font-bold text-slate-900">KostumFadilyss</span>
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
                  {activeTab === 'gallery' && 'Galeri Foto'}
                  {activeTab === 'broadcast' && 'Broadcast Newsletter'}
                  {activeTab === 'booking' && 'Daftar Booking'}
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  {activeTab === 'dashboard' && 'Ringkasan aktivitas dan performa toko.'}
                  {activeTab === 'inventory' && 'Kelola inventaris, stok, dan harga sewa.'}
                  {activeTab === 'settings' && 'Konfigurasi aplikasi dan profil admin.'}
                  {activeTab === 'gallery' && 'Kelola dokumentasi kegiatan Paskibra.'}
                  {activeTab === 'gallery' && 'Kelola dokumentasi kegiatan Paskibra.'}
                  {activeTab === 'broadcast' && 'Kirim pesan update ke semua pelanggan newsletter.'}
                  {activeTab === 'booking' && 'Kelola daftar pemesanan sewa kostum.'}
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

            <React.Suspense fallback={<LoadingSpinner />}>
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
                <InventoryView
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              )}

              {/* Gallery View */}
              {activeTab === 'gallery' && (
                <div className="animate-fade-in">
                  <GalleryView onShowToast={showToast} />
                </div>
              )}

              {/* Broadcast View */}
              {activeTab === 'broadcast' && (
                <div className="animate-fade-in">
                  <BroadcastView onShowToast={showToast} />
                </div>
              )}

              {/* Booking View */}
              {activeTab === 'booking' && (
                <div className="animate-fade-in">
                  <BookingView onShowToast={showToast} />
                </div>
              )}

              {/* Settings View */}
              {activeTab === 'settings' && (
                <div className="animate-fade-in">
                  <SettingsView onSettingsUpdate={loadData} />
                </div>
              )}
            </React.Suspense>

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