import React from 'react';
import { Package, AlertTriangle, DollarSign, Layers } from 'lucide-react';
import { DashboardStats as IStats } from '../types';

interface DashboardStatsProps {
  stats: IStats;
}

const StatCard = ({ title, value, icon: Icon, variant, subValue }: { title: string, value: string | number, icon: any, variant: 'blue' | 'emerald' | 'amber' | 'violet', subValue?: string }) => {
  const styles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100', border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100', border: 'border-amber-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', iconBg: 'bg-violet-100', border: 'border-violet-100' },
  };

  const style = styles[variant];

  return (
    <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${style.iconBg} ${style.text} transition-transform group-hover:rotate-6 group-hover:scale-110`}>
          <Icon size={28} strokeWidth={2} />
        </div>
      </div>
      {subValue && (
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${style.bg.replace('50', '500')}`}></span>
          <p className="text-xs text-slate-500 font-medium">{subValue}</p>
        </div>
      )}
    </div>
  );
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard
        title="Total Produk"
        value={stats.totalProducts}
        icon={Package}
        variant="blue"
        subValue="Item aktif dalam katalog"
      />
      <StatCard
        title="Total Nilai Aset"
        value={`Rp ${(stats.totalValue / 1000000).toFixed(1)} Jt`}
        icon={DollarSign}
        variant="emerald"
        subValue="Estimasi nilai inventaris"
      />
      <StatCard
        title="Stok Menipis"
        value={stats.lowStockCount}
        icon={AlertTriangle}
        variant="amber"
        subValue="Perlu restock segera"
      />
      <StatCard
        title="Kategori"
        value={stats.categoriesCount}
        icon={Layers}
        variant="violet"
        subValue="Variasi jenis kostum"
      />
    </div>
  );
};

export default DashboardStats;