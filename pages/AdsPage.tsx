import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { BarChart2, TrendingUp, MousePointer, DollarSign, Download, Filter, LayoutGrid, Instagram, Video, Globe, Facebook, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type AccountKey = 'all' | 'ig1' | 'ig2' | 'tiktok1';
type ChannelKey = 'all' | 'meta' | 'google' | 'tiktok';

interface MetricData {
  spent: string;
  roi: string;
  clicks: string;
  impressions: string;
  cpl: string;
  conv: string;
  chart: number[];
  campaigns: Array<{
    name: string;
    platform: string;
    spent: string;
    color: string;
  }>;
}

// Data Generation Helper
const getAdsData = (account: AccountKey, channel: ChannelKey): MetricData => {
  // Base empty state
  const empty: MetricData = {
    spent: '$0', roi: '0x', clicks: '0', impressions: '0', cpl: '$0.00', conv: '0%',
    chart: [0, 0, 0, 0, 0, 0, 0],
    campaigns: []
  };

  // specific data combinations
  const data: Record<string, MetricData> = {
    // ALL ACCOUNTS
    'all_all': {
      spent: '1.2K', roi: '3.4x', clicks: '12K', impressions: '124K', cpl: '$4.50', conv: '2.4%',
      chart: [40, 60, 45, 70, 50, 80, 65],
      campaigns: [
        { name: 'Year End Sale', platform: 'Meta Ads', spent: '$430', color: 'bg-blue-600' },
        { name: 'Search Brand', platform: 'Google Ads', spent: '$150', color: 'bg-green-500' },
        { name: 'Viral Tours', platform: 'TikTok Ads', spent: '$250', color: 'bg-black' }
      ]
    },
    'all_meta': {
      spent: '$850', roi: '3.8x', clicks: '8.2K', impressions: '85K', cpl: '$4.10', conv: '2.8%',
      chart: [35, 50, 40, 65, 45, 70, 60],
      campaigns: [
        { name: 'Year End Sale', platform: 'Meta Ads', spent: '$430', color: 'bg-blue-600' },
        { name: 'Urban Living', platform: 'Meta Ads', spent: '$320', color: 'bg-blue-600' }
      ]
    },
    'all_google': {
      spent: '$150', roi: '2.1x', clicks: '1.5K', impressions: '8K', cpl: '$8.50', conv: '1.2%',
      chart: [10, 15, 12, 18, 14, 20, 15],
      campaigns: [
        { name: 'Search Brand', platform: 'Google Ads', spent: '$150', color: 'bg-green-500' }
      ]
    },
    'all_tiktok': {
      spent: '$250', roi: '1.5x', clicks: '4.4K', impressions: '47K', cpl: '$2.10', conv: '1.2%',
      chart: [50, 30, 60, 20, 40, 30, 45],
      campaigns: [
        { name: 'Viral Tours', platform: 'TikTok Ads', spent: '$250', color: 'bg-black' }
      ]
    },

    // IG1 (@luxuryliving)
    'ig1_all': {
      spent: '$580', roi: '4.0x', clicks: '5.2K', impressions: '50K', cpl: '$4.00', conv: '3.0%',
      chart: [30, 45, 35, 60, 45, 75, 55],
      campaigns: [
        { name: 'Year End Sale', platform: 'Meta Ads', spent: '$230', color: 'bg-blue-600' },
        { name: 'Search - Luxury', platform: 'Google Ads', spent: '$150', color: 'bg-green-500' }
      ]
    },
    'ig1_meta': {
      spent: '$430', roi: '4.1x', clicks: '4.5K', impressions: '45K', cpl: '$3.80', conv: '3.1%',
      chart: [30, 45, 35, 60, 40, 75, 50],
      campaigns: [
        { name: 'Year End Sale', platform: 'Meta Ads', spent: '$230', color: 'bg-blue-600' },
        { name: 'Penthouse Promo', platform: 'Meta Ads', spent: '$200', color: 'bg-blue-600' }
      ]
    },
    'ig1_google': {
      spent: '$150', roi: '2.5x', clicks: '700', impressions: '5K', cpl: '$9.20', conv: '1.5%',
      chart: [10, 12, 10, 15, 12, 18, 14],
      campaigns: [
        { name: 'Search - Luxury', platform: 'Google Ads', spent: '$150', color: 'bg-green-500' }
      ]
    },

    // IG2 (@cityhomes)
    'ig2_all': {
      spent: '$320', roi: '2.8x', clicks: '3.1K', impressions: '32K', cpl: '$5.20', conv: '1.9%',
      chart: [20, 25, 30, 20, 35, 40, 30],
      campaigns: [
        { name: 'Urban Living', platform: 'Meta Ads', spent: '$320', color: 'bg-blue-600' }
      ]
    },
    'ig2_meta': {
      spent: '$320', roi: '2.8x', clicks: '3.1K', impressions: '32K', cpl: '$5.20', conv: '1.9%',
      chart: [20, 25, 30, 20, 35, 40, 30],
      campaigns: [
        { name: 'Urban Living', platform: 'Meta Ads', spent: '$320', color: 'bg-blue-600' }
      ]
    },

    // TIKTOK (@re_trends)
    'tiktok1_all': {
      spent: '$250', roi: '1.5x', clicks: '4.4K', impressions: '47K', cpl: '$2.10', conv: '1.2%',
      chart: [50, 30, 60, 20, 40, 30, 45],
      campaigns: [
        { name: 'Viral Tours', platform: 'TikTok Ads', spent: '$250', color: 'bg-black' }
      ]
    },
    'tiktok1_tiktok': {
      spent: '$250', roi: '1.5x', clicks: '4.4K', impressions: '47K', cpl: '$2.10', conv: '1.2%',
      chart: [50, 30, 60, 20, 40, 30, 45],
      campaigns: [
        { name: 'Viral Tours', platform: 'TikTok Ads', spent: '$250', color: 'bg-black' }
      ]
    }
  };

  const key = `${account}_${channel}`;
  return data[key] || empty;
};

const AdsPage: React.FC = () => {
  const [activeAccount, setActiveAccount] = useState<AccountKey>('all');
  const [activeChannel, setActiveChannel] = useState<ChannelKey>('all');
  
  const currentData = useMemo(() => getAdsData(activeAccount, activeChannel), [activeAccount, activeChannel]);

  const accounts = [
    { id: 'all', label: 'All Accounts', icon: LayoutGrid },
    { id: 'ig1', label: '@luxuryliving', icon: Instagram },
    { id: 'ig2', label: '@cityhomes', icon: Instagram },
    { id: 'tiktok1', label: '@re_trends', icon: Video },
  ];

  const channels = [
    { id: 'all', label: 'All Channels', icon: Globe },
    { id: 'meta', label: 'Meta Ads', icon: Facebook },
    { id: 'google', label: 'Google Ads', icon: Search },
    { id: 'tiktok', label: 'TikTok Ads', icon: Video },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />
      
      <div className="px-6 py-2 mb-2">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ads Manager</h1>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Campaign Performance</p>
      </div>

      {/* Filters Container */}
      <div className="sticky top-[88px] z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm pb-2 shadow-sm border-b border-slate-100 dark:border-slate-800">
        
        {/* Channel Selector */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
           <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 px-1">Platform Channel</p>
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {channels.map((ch) => {
               const isActive = activeChannel === ch.id;
               const Icon = ch.icon;
               return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id as ChannelKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={12} /> {ch.label}
                </button>
               );
            })}
          </div>
        </div>

        {/* Account Selector */}
        <div className="px-4 py-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 px-1">User Account</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {accounts.map((acc) => {
               const isActive = activeAccount === acc.id;
               const Icon = acc.icon;
               return (
                <button
                  key={acc.id}
                  onClick={() => setActiveAccount(acc.id as AccountKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={12} /> {acc.label}
                </button>
               );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pt-2">
        
        <AnimatePresence mode="wait">
            <motion.div
                key={`${activeAccount}-${activeChannel}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
            >
                {/* Campaign Overview Card */}
                <Card className="bg-slate-900 dark:bg-black text-white mb-6 border-slate-900 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-xs text-slate-400">Total Spent</p>
                            <h2 className="text-3xl font-bold mt-1">{currentData.spent}</h2>
                            <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                                <TrendingUp size={10} className="rotate-180" /> 1% vs last week
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">ROI</p>
                            <h2 className="text-3xl font-bold mt-1 text-emerald-400">{currentData.roi}</h2>
                        </div>
                    </div>

                    {/* Simulated Line Graph */}
                    <div className="w-full h-32 relative mt-4">
                        <div className="absolute inset-0 flex items-end justify-between px-1">
                            {currentData.chart.map((h, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="w-8 bg-white/10 rounded-t-sm hover:bg-white/20 transition-colors relative group"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                        {h}%
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                            <div className="w-full h-px bg-white"></div>
                            <div className="w-full h-px bg-white"></div>
                            <div className="w-full h-px bg-white"></div>
                            <div className="w-full h-px bg-white"></div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-2">
                            <MousePointer size={16} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Link Clicks</p>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentData.clicks}</h3>
                        <span className="text-[10px] text-emerald-500 font-medium">↑ 10%</span>
                    </Card>
                    <Card className="p-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-2">
                            <BarChart2 size={16} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Impressions</p>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentData.impressions}</h3>
                        <span className="text-[10px] text-emerald-500 font-medium">↑ 12%</span>
                    </Card>
                    <Card className="p-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mb-2">
                            <DollarSign size={16} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Cost per Lead</p>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentData.cpl}</h3>
                        <span className="text-[10px] text-red-500 font-medium">↓ 5%</span>
                    </Card>
                    <Card className="p-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-2">
                            <TrendingUp size={16} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Conv. Rate</p>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentData.conv}</h3>
                        <span className="text-[10px] text-emerald-500 font-medium">↑ 0.4%</span>
                    </Card>
                </div>

                {/* Campaign List */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Active Campaigns</h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <Filter size={14} />
                            </button>
                            <button className="p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <Download size={14} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {currentData.campaigns.length > 0 ? (
                                currentData.campaigns.map((campaign, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2, delay: i * 0.1 }}
                                    >
                                        <Card noPadding className="p-4 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${campaign.color}`}></span>
                                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{campaign.name}</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">ID: {2390 + i} • {campaign.platform}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{campaign.spent}</p>
                                                <p className="text-[10px] text-slate-400">Spent</p>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="text-center py-8 text-slate-400 text-sm"
                                >
                                    No active campaigns found for this combination.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdsPage;