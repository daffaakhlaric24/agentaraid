import React from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { TrendingUp, ArrowUpRight, ArrowDownRight, FileText, ChevronRight, Filter } from 'lucide-react';

const SalesPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />

      <div className="px-6 py-2 mb-2">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Dashboard</h1>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview & Performance</p>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Sales Overview */}
        <Card className="bg-slate-900 dark:bg-black text-white border-none shadow-xl shadow-slate-200 dark:shadow-none">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-slate-400 mb-1">Total Sales Value</p>
                    <h2 className="text-4xl font-bold tracking-tight">Rp 2.4<span className="text-slate-500 text-2xl">B</span></h2>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                    <TrendingUp size={24} className="text-emerald-400" />
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1 bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-xs text-slate-300">Primary</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                        <p className="font-bold text-lg">Rp 1.54B</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">64% of total</p>
                    <div className="w-full bg-slate-700 h-1 rounded-full">
                        <div className="w-[64%] bg-primary h-full rounded-full"></div>
                    </div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl p-3">
                     <div className="flex items-center gap-1 mb-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <span className="text-xs text-slate-300">Secondary</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                        <p className="font-bold text-lg">Rp 860M</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">36% of total</p>
                     <div className="w-full bg-slate-700 h-1 rounded-full">
                        <div className="w-[36%] bg-slate-400 h-full rounded-full"></div>
                    </div>
                </div>
            </div>
        </Card>

        {/* Invoice & Commission Summary */}
        <div className="grid grid-cols-2 gap-4">
             <Card>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Est. Commission</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rp 184.5M</h3>
                <div className="flex items-center text-emerald-500 text-xs mt-1 font-medium">
                    <ArrowUpRight size={14} /> 5.1%
                </div>
             </Card>
             <Card>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Properties Sold</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">12</h3>
                <div className="flex items-center text-emerald-500 text-xs mt-1 font-medium">
                    <ArrowUpRight size={14} /> 12.5%
                </div>
             </Card>
        </div>

        {/* Sales Funnel */}
        <Card>
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Sales Funnel</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pipeline Performance</p>
                 </div>
                 <button className="text-xs border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1">
                    <Filter size={10} /> Filter
                 </button>
            </div>

            {/* Pipeline Summary */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Potential Value</p>
                    <p className="text-lg font-bold text-primary mt-1">Rp 42.5B</p>
                </div>
                <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Active Leads</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">315</p>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="flex flex-col items-center gap-2">
                {[
                    { label: 'New Leads', count: 315, color: 'bg-slate-300 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-200', width: 'w-full' },
                    { label: 'Qualified', count: 180, color: 'bg-blue-300 dark:bg-blue-900/60', text: 'text-blue-900 dark:text-blue-100', width: 'w-[85%]' },
                    { label: 'Viewing', count: 85, color: 'bg-blue-500', text: 'text-white', width: 'w-[70%]' },
                    { label: 'Negotiation', count: 24, color: 'bg-indigo-600', text: 'text-white', width: 'w-[55%]' },
                    { label: 'Closed', count: 12, color: 'bg-primary', text: 'text-white', width: 'w-[40%]' },
                ].map((stage, i) => (
                    <div key={i} className={`${stage.width} transition-all duration-500 group relative`}>
                        {i > 0 && (
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[80%] h-4 border-l border-r border-slate-200 dark:border-slate-800/50 -z-10 opacity-50"></div>
                        )}
                        
                        <div className={`h-9 rounded-lg ${stage.color} flex items-center justify-between px-4 shadow-sm relative z-10`}>
                            <span className={`text-xs font-bold ${stage.text}`}>{stage.label}</span>
                            <span className={`text-xs font-bold ${stage.text} bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md`}>
                                {stage.count}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-[10px] text-slate-400 text-center mt-6">
                Conversion Rate: <span className="text-emerald-500 font-bold">3.8%</span> from Lead to Deal
            </p>
        </Card>

        {/* Daily Activity Tracker */}
        <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 px-1">Daily Transactions</h3>
            <Card noPadding className="divide-y divide-slate-50 dark:divide-slate-800">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-primary flex items-center justify-center">
                                 <FileText size={20} />
                             </div>
                             <div>
                                 <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Invoice #INV-2025-00{i}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">PropertyKlik • 2 mins ago</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="text-sm font-bold text-slate-800 dark:text-slate-100">+Rp 25M</p>
                             <span className="text-[10px] text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">Paid</span>
                         </div>
                    </div>
                ))}
                 <div className="p-3 text-center border-t border-slate-50 dark:border-slate-800">
                    <button className="text-xs font-semibold text-primary flex items-center justify-center gap-1 w-full">
                        View All History <ChevronRight size={12} />
                    </button>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default SalesPage;