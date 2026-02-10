import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { ChartData } from '../types';

interface RevenueChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 text-sm">
        <p className="font-bold text-slate-900 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-slate-500 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Penyewaan:
            </span>
            <span className="font-semibold text-slate-800">{payload[0].value}x</span>
          </p>
          <p className="text-slate-500 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
              Pendapatan:
            </span>
            <span className="font-semibold text-slate-800">
              Rp {(payload[1].value / 1000000).toFixed(1)} Jt
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-red-600" />
            Statistik Performa
          </h3>
          <p className="text-sm text-slate-500 mt-1">Grafik penyewaan dan total pendapatan</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-100 transition-colors">
              <Calendar size={14} />
              Tahun Ini
           </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dx={-10}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000000}Jt`}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dx={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
              iconType="circle"
              formatter={(value) => <span className="text-slate-600 font-medium text-xs ml-1">{value}</span>}
            />
            
            <Bar 
              yAxisId="left" 
              dataKey="rentals" 
              name="Total Penyewaan" 
              barSize={32} 
              fill="#ef4444" 
              radius={[8, 8, 8, 8]}
            />
            
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Pendapatan (Rp)"
              stroke="#0f172a"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;