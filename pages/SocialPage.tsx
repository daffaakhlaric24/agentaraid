import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { Eye, Users, MessageCircle, Share2, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Instagram, Video, Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Scheduled Posts Data
interface ScheduledPost {
  id: string;
  accountId: string;
  handle: string;
  platform: 'ig' | 'tiktok';
  content: string;
  image: string;
  scheduledDate: string; // ISO date string
  scheduledTime: string; // HH:mm format
  format: 'post' | 'story' | 'reel';
}

const SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 's1',
    accountId: 'ig1',
    handle: 'luxuryliving',
    platform: 'ig',
    content: 'New listing alert: Modern penthouse in Menteng',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    scheduledTime: '09:00',
    format: 'post'
  },
  {
    id: 's2',
    accountId: 'ig1',
    handle: 'luxuryliving',
    platform: 'ig',
    content: 'Behind the scenes: Property photoshoot',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
    scheduledTime: '14:00',
    format: 'story'
  },
  {
    id: 's3',
    accountId: 'ig2',
    handle: 'cityhomes',
    platform: 'ig',
    content: 'Weekend open house announcement',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    scheduledTime: '11:00',
    format: 'post'
  },
  {
    id: 's4',
    accountId: 'tiktok1',
    handle: 're_trends',
    platform: 'tiktok',
    content: 'Property tour: 3BR apartment tour',
    image: 'https://images.unsplash.com/photo-1512918760532-4937a7d2ea53?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days from now
    scheduledTime: '18:00',
    format: 'reel'
  },
  {
    id: 's5',
    accountId: 'ig1',
    handle: 'luxuryliving',
    platform: 'ig',
    content: 'Market insights: Jakarta property trends',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfe1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    scheduledDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], // 4 days from now
    scheduledTime: '10:00',
    format: 'post'
  }
];

// Mock Data for different accounts
const SOCIAL_DATA = {
  all: {
    metrics: {
      views: { value: '156K', trend: 14, dir: 'up' },
      followers: { value: '425', trend: 2, dir: 'up' },
      comments: { value: '45', trend: 12, dir: 'up' },
      shares: { value: '2.1K', trend: 8, dir: 'up' },
    },
    posts: [
      { id: '1', handle: 'luxuryliving', content: 'The crown jewel of Jakarta Selatan. Open house this Saturday.', image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 1240, comments: 45 }, time: '2h ago', platform: 'ig' },
      { id: '2', handle: 'cityhomes', content: 'Minimalist living at its finest. #UrbanLife', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 85, comments: 12 }, time: '4h ago', platform: 'ig' },
      { id: '3', handle: 're_trends', content: '5 tips before buying your first apartment 🏢', image: 'https://images.unsplash.com/photo-1512918760532-4937a7d2ea53?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 5400, comments: 230 }, time: '1d ago', platform: 'tiktok' },
    ]
  },
  ig1: { // @luxuryliving
    metrics: {
      views: { value: '86K', trend: 15, dir: 'up' },
      followers: { value: '180', trend: 4, dir: 'up' },
      comments: { value: '28', trend: 10, dir: 'up' },
      shares: { value: '850', trend: 2, dir: 'up' },
    },
    posts: [
      { id: '1', handle: 'luxuryliving', content: 'The crown jewel of Jakarta Selatan. Open house this Saturday.', image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 1240, comments: 45 }, time: '2h ago', platform: 'ig' },
      { id: '4', handle: 'luxuryliving', content: 'Luxury isn\'t just price, it\'s an experience.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 950, comments: 32 }, time: '3d ago', platform: 'ig' },
    ]
  },
  ig2: { // @cityhomes
    metrics: {
      views: { value: '32K', trend: 2, dir: 'down' },
      followers: { value: '65', trend: 0, dir: 'down' },
      comments: { value: '4', trend: 1, dir: 'down' },
      shares: { value: '350', trend: 5, dir: 'up' },
    },
    posts: [
      { id: '2', handle: 'cityhomes', content: 'Minimalist living at its finest. #UrbanLife', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 85, comments: 12 }, time: '4h ago', platform: 'ig' },
    ]
  },
  tiktok1: { // @re_trends
    metrics: {
      views: { value: '38K', trend: 45, dir: 'up' },
      followers: { value: '180', trend: 12, dir: 'up' },
      comments: { value: '13', trend: 8, dir: 'up' },
      shares: { value: '900', trend: 20, dir: 'up' },
    },
    posts: [
      { id: '3', handle: 're_trends', content: '5 tips before buying your first apartment 🏢', image: 'https://images.unsplash.com/photo-1512918760532-4937a7d2ea53?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 5400, comments: 230 }, time: '1d ago', platform: 'tiktok' },
      { id: '5', handle: 're_trends', content: 'Room tour: 2BR minimalis di BSD!', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', metrics: { likes: 3200, comments: 150 }, time: '2d ago', platform: 'tiktok' },
    ]
  }
};

const SocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeAccount, setActiveAccount] = useState<keyof typeof SOCIAL_DATA>('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });
  
  const currentData = SOCIAL_DATA[activeAccount];

  // Filter scheduled posts based on active account
  const filteredScheduledPosts = useMemo(() => {
    if (activeAccount === 'all') {
      return SCHEDULED_POSTS;
    }
    return SCHEDULED_POSTS.filter(post => post.accountId === activeAccount);
  }, [activeAccount]);

  // Group scheduled posts by date
  const postsByDate = useMemo(() => {
    const grouped: Record<string, ScheduledPost[]> = {};
    filteredScheduledPosts.forEach(post => {
      if (!grouped[post.scheduledDate]) {
        grouped[post.scheduledDate] = [];
      }
      grouped[post.scheduledDate].push(post);
    });
    return grouped;
  }, [filteredScheduledPosts]);

  // Get week dates
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const accounts = [
    { id: 'all', label: 'All Accounts', icon: Users },
    { id: 'ig1', label: '@luxuryliving', icon: Instagram },
    { id: 'ig2', label: '@cityhomes', icon: Instagram },
    { id: 'tiktok1', label: '@re_trends', icon: Video },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />
      
      <div className="px-6 py-2 mb-2">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Social Analytics</h1>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your engagement</p>
      </div>

      {/* Account Selector */}
      <div className="px-4 py-2 sticky top-[88px] z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {accounts.map((acc) => {
             const isActive = activeAccount === acc.id;
             const Icon = acc.icon;
             return (
              <button
                key={acc.id}
                onClick={() => setActiveAccount(acc.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md transform scale-105' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={14} /> {acc.label}
              </button>
             );
          })}
        </div>
      </div>

      <div className="p-4 space-y-6">
          
          {/* Analytics Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeAccount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                      <Eye size={18} /> <span className="text-xs">Views</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentData.metrics.views.value}</h3>
                  <div className={`flex items-center text-[10px] font-bold mt-1 ${currentData.metrics.views.dir === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {currentData.metrics.views.dir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} 
                      {currentData.metrics.views.trend}%
                  </div>
              </Card>
              <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                      <Users size={18} /> <span className="text-xs">Followers</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentData.metrics.followers.value}</h3>
                  <div className={`flex items-center text-[10px] font-bold mt-1 ${currentData.metrics.followers.dir === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                       {currentData.metrics.followers.dir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} 
                       {currentData.metrics.followers.trend}%
                  </div>
              </Card>
              <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                      <MessageCircle size={18} /> <span className="text-xs">Comments</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentData.metrics.comments.value}</h3>
                  <div className={`flex items-center text-[10px] font-bold mt-1 ${currentData.metrics.comments.dir === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                       {currentData.metrics.comments.dir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} 
                       {currentData.metrics.comments.trend}%
                  </div>
              </Card>
              <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                      <Share2 size={18} /> <span className="text-xs">Shares</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentData.metrics.shares.value}</h3>
                  <div className={`flex items-center text-[10px] font-bold mt-1 ${currentData.metrics.shares.dir === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                       {currentData.metrics.shares.dir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} 
                       {currentData.metrics.shares.trend}%
                  </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Content Post Schedule - Compact View */}
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Content Post Schedule</h2>
            </div>

            <Card className="p-4 cursor-pointer" onClick={() => setIsScheduleModalOpen(true)}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button className="bg-orange-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  <span className="text-xs text-orange-500 font-medium">View All</span>
                </button>
              </div>
              
              <div className="flex justify-between mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400 w-8 text-center">{d}</span>
                ))}
              </div>
              
              <div className="flex justify-between">
                {weekDates.map((date, i) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const dayPosts = postsByDate[dateKey] || [];
                  const isTodayDate = isToday(date);
                  const dayNumber = date.getDate();

                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div 
                        className={`
                          h-8 w-8 rounded-full flex items-center justify-center
                          ${isTodayDate 
                            ? 'bg-primary shadow-sm' 
                            : 'bg-transparent'}
                        `}
                      >
                        <span className={`text-sm font-medium ${isTodayDate ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                          {dayNumber}
                        </span>
                      </div>
                      <div className={`w-1 h-1 rounded-full ${dayPosts.length > 0 ? 'bg-primary' : 'bg-transparent'}`}></div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Latest Posts */}
          <div>
              <div className="flex justify-between items-center mb-4 px-1">
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">Latest Posts</h2>
                  <button className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400">
                      Filter
                  </button>
              </div>

              <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {currentData.posts.length > 0 ? (
                      currentData.posts.map((post) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card noPadding className="p-4">
                                <div className="flex gap-3 mb-3">
                                    <div className="relative">
                                      <img src={post.image} alt="post" className="w-12 h-12 rounded-lg object-cover" />
                                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                                        {post.platform === 'ig' ? <Instagram size={10} className="text-pink-500" /> : <Video size={10} className="text-black dark:text-white" />}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">@{post.handle}</h4>
                                            <span className="text-[10px] text-slate-400">{post.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">"{post.content}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                            </div>
                                            {post.metrics.likes}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <MessageCircle size={14} />
                                            {post.metrics.comments}
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <MoreHorizontal size={16} />
                                    </button>
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
                        No posts found for this platform.
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
          </div>
      </div>

      <button 
        onClick={() => navigate('/create-content')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg flex items-center justify-center hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors z-30"
      >
          <Plus size={24} />
      </button>

      {/* Schedule Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsScheduleModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-950 w-full rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-950 z-10">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Content Post Schedule</h2>
                <button onClick={() => setIsScheduleModalOpen(false)}>
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <div className="p-6">
                {/* Week Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-2">
                  {weekDates.map((date, index) => {
                    const dateKey = date.toISOString().split('T')[0];
                    const dayPosts = postsByDate[dateKey] || [];
                    const isTodayDate = isToday(date);

                    return (
                      <div
                        key={index}
                        className={`border rounded-xl p-3 transition-all ${
                          isTodayDate
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${
                              isTodayDate
                                ? 'text-primary'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {formatDayName(date)}
                            </span>
                            <span className={`text-sm font-semibold ${
                              isTodayDate
                                ? 'text-primary'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {formatDate(date)}
                            </span>
                            {isTodayDate && (
                              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                          {dayPosts.length > 0 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                            </span>
                          )}
                        </div>

                        {/* Scheduled Posts for this day */}
                        {dayPosts.length > 0 ? (
                          <div className="space-y-2 mt-2">
                            {dayPosts.map((post) => (
                              <div
                                key={post.id}
                                className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              >
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={post.image}
                                    alt="Scheduled post"
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
                                    {post.platform === 'ig' ? (
                                      <Instagram size={10} className="text-pink-500" />
                                    ) : (
                                      <Video size={10} className="text-black dark:text-white" />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                      @{post.handle}
                                    </span>
                                    <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 rounded capitalize">
                                      {post.format}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                                    {post.content}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                                  <Clock size={12} />
                                  <span>{post.scheduledTime}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-xs">
                            No posts scheduled
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredScheduledPosts.length === 0 && (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                    No scheduled posts for selected account
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialPage;