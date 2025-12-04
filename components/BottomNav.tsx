import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, TrendingUp, Users, Home, Share2, BarChart2, Palette } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Home' },
    { path: '/sales', icon: TrendingUp, label: 'Sales' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/listings', icon: Home, label: 'Property' },
    { path: '/create-content', icon: Palette, label: 'Studio' },
    { path: '/social', icon: Share2, label: 'Social' },
    { path: '/ads', icon: BarChart2, label: 'Ads' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full">
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-lg w-full max-w-md px-2 py-3 flex justify-between items-center pb-6 rounded-t-2xl transition-colors duration-300">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 px-2 ${
                isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;