import React from 'react';
import { Package, AlertTriangle, DollarSign, Layers } from 'lucide-react';
import { DashboardStats as IStats } from '../types';

interface DashboardStatsProps {
  stats: IStats;
}

const StatCard = ({ title, value, icon: Icon, colorClass, subValue }: { title: string, value: string | number, icon: any, colorClass: string, subValue?: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    {subValue && <p className="text-xs text-slate-400 font-medium bg-slate-50 inline-block px-3 py-1 rounded-full">{subValue}</p>}
  </div>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Produk"
        value={stats.totalProducts}
        icon={Package}
        colorClass="bg-blue-600"
        subValue="Item aktif"
      />
      <StatCard
        title="Total Nilai Aset"
        value={`Rp ${(stats.totalValue / 1000000).toFixed(1)} Jt`}
        icon={DollarSign}
        colorClass="bg-emerald-600"
        subValue="Estimasi"
      />
      <StatCard
        title="Stok Menipis"
        value={stats.lowStockCount}
        icon={AlertTriangle}
        colorClass="bg-amber-500"
        subValue="Perlu restock"
      />
      <StatCard
        title="Kategori"
        value={stats.categoriesCount}
        icon={Layers}
        colorClass="bg-violet-600"
        subValue="Variasi"
      />
    </div>
  );
};

export default DashboardStats;