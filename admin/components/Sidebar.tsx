import React from 'react';
import { LayoutDashboard, Package, Settings, LogOut, Flag, Image, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'inventory' | 'settings' | 'gallery' | 'broadcast';
  onTabChange: (tab: 'dashboard' | 'inventory' | 'settings' | 'gallery' | 'broadcast') => void;
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onLogout
}) => {
  const navItemClass = (isActive: boolean) => `
    flex items-center gap-3 px-3 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm mb-1
    ${isCollapsed ? 'justify-center w-12 mx-auto' : 'w-full'}
    ${isActive
      ? 'bg-red-600 text-white shadow-sm'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }
  `;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transform transition-all duration-300 ease-in-out border-r border-slate-800 flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Header / Logo / Toggle */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-6 shrink-0 h-24`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-white p-2 rounded-xl shrink-0">
                <Flag size={20} className="text-red-600 fill-current" />
              </div>
              <div className="overflow-hidden whitespace-nowrap min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-white leading-none truncate">PaskibraRent</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-semibold truncate">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => onTabChange('dashboard')}
          className={navItemClass(activeTab === 'dashboard')}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <LayoutDashboard size={20} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        <button
          onClick={() => onTabChange('inventory')}
          className={navItemClass(activeTab === 'inventory')}
          title={isCollapsed ? "Katalog Produk" : ""}
        >
          <Package size={20} className="shrink-0" />
          {!isCollapsed && <span>Katalog Produk</span>}
        </button>

        <button
          onClick={() => onTabChange('gallery')}
          className={navItemClass(activeTab === 'gallery')}
          title={isCollapsed ? "Galeri Foto" : ""}
        >
          <Image size={20} className="shrink-0" />
          {!isCollapsed && <span>Galeri Foto</span>}
        </button>

        <button
          onClick={() => onTabChange('broadcast')}
          className={navItemClass(activeTab === 'broadcast')}
          title={isCollapsed ? "Broadcast" : ""}
        >
          <Send size={20} className="shrink-0" />
          {!isCollapsed && <span>Broadcast</span>}
        </button>

        {!isCollapsed && (
          <div className="pt-8 pb-3 px-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pengaturan</p>
          </div>
        )}
        {isCollapsed && <div className="h-4"></div>}

        <button
          onClick={() => onTabChange('settings')}
          className={navItemClass(activeTab === 'settings')}
          title={isCollapsed ? "Sistem" : ""}
        >
          <Settings size={20} className="shrink-0" />
          {!isCollapsed && <span>Sistem</span>}
        </button>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 shrink-0 border-t border-slate-800/50">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium border border-slate-800 hover:border-slate-700 group ${isCollapsed ? 'justify-center w-12 mx-auto' : 'w-full'}`}
          title={isCollapsed ? "Keluar" : ""}
        >
          <LogOut size={18} className="group-hover:text-red-400 transition-colors shrink-0" />
          {!isCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;