import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  ChevronDown, 
  Moon, 
  Sun, 
  Instagram, 
  Video, 
  Facebook,
  User,
  CreditCard,
  Users,
  Globe,
  Link,
  Shield,
  HelpCircle,
  LogOut,
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  Ticket,
  Clock,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Calendar,
  Home,
  TrendingUp,
  FileText,
  UserPlus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock Data for Connected Accounts consistent with SocialPage and AdsPage
const CONNECTED_ACCOUNTS = [
  { id: 'ig1', handle: '@luxuryliving', platform: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'ig2', handle: '@cityhomes', platform: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'tt1', handle: '@re_trends', platform: 'TikTok', icon: Video, color: 'text-black dark:text-white' },
];

// Comprehensive Linked Accounts Data
const LINKED_ACCOUNTS_DATA = [
  {
    id: 'ig1',
    handle: '@luxuryliving',
    platform: 'Instagram',
    icon: Instagram,
    status: 'connected',
    lastSynced: '2 hours ago',
    followers: '180',
    posts: '24',
    permissions: ['Post Content', 'View Analytics', 'Manage Comments'],
    color: 'bg-gradient-to-tr from-yellow-400 to-purple-600',
    connectedDate: 'Aug 15, 2025'
  },
  {
    id: 'ig2',
    handle: '@cityhomes',
    platform: 'Instagram',
    icon: Instagram,
    status: 'connected',
    lastSynced: '5 hours ago',
    followers: '65',
    posts: '12',
    permissions: ['Post Content', 'View Analytics'],
    color: 'bg-gradient-to-tr from-yellow-400 to-purple-600',
    connectedDate: 'Sep 1, 2025'
  },
  {
    id: 'tt1',
    handle: '@re_trends',
    platform: 'TikTok',
    icon: Video,
    status: 'connected',
    lastSynced: '1 day ago',
    followers: '180',
    posts: '8',
    permissions: ['Post Content', 'View Analytics'],
    color: 'bg-black dark:bg-white',
    connectedDate: 'Aug 20, 2025'
  },
  {
    id: 'wa',
    handle: 'WhatsApp Business',
    platform: 'WhatsApp',
    icon: MessageSquare,
    status: 'connected',
    lastSynced: 'Just now',
    messages: '1,245',
    conversations: '89',
    permissions: ['Send Messages', 'Receive Leads', 'View Contacts'],
    color: 'bg-green-500',
    connectedDate: 'Jul 10, 2025'
  },
  {
    id: 'web',
    handle: 'Website Integration',
    platform: 'Website',
    icon: Globe,
    status: 'connected',
    lastSynced: 'Active',
    leads: '156',
    visits: '2.4K',
    permissions: ['Track Leads', 'View Analytics', 'Form Submissions'],
    color: 'bg-blue-500',
    connectedDate: 'Jun 1, 2025'
  }
];

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isBillingOpen, setIsBillingOpen, shouldOpenSettings, setShouldOpenSettings } = useApp();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLinkedAccountsOpen, setIsLinkedAccountsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [billingOpenedFromSettings, setBillingOpenedFromSettings] = useState(false);
  const [shouldAnimateSettings, setShouldAnimateSettings] = useState(true);
  const [isPlanSelectionOpen, setIsPlanSelectionOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isTokenInputOpen, setIsTokenInputOpen] = useState(false);
  const [customTokenAmount, setCustomTokenAmount] = useState<number | null>(null);
  const [tempTokenInput, setTempTokenInput] = useState<string>('');
  const [isTokenPaymentOpen, setIsTokenPaymentOpen] = useState(false);
  const [selectedTokenAmount, setSelectedTokenAmount] = useState<number | null>(null);
  const [tokenVoucherCode, setTokenVoucherCode] = useState('');
  const [socialAccountLimit, setSocialAccountLimit] = useState(3); // Pro plan limit
  const [isPurchaseAccountsOpen, setIsPurchaseAccountsOpen] = useState(false);
  const [accountsToAdd, setAccountsToAdd] = useState<number>(1);
  const [userTokenBalanceForAccounts] = useState(120); // Mock token balance
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [pendingAccounts, setPendingAccounts] = useState<Array<{platform: string, icon: any, color: string}>>([]);
  const navigate = useNavigate();

  // Mock notifications data with state
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'lead',
      title: 'New Lead: Sarah Wijaya',
      message: 'Interested in Jakarta property launch, requests financing details.',
      time: '2 minutes ago',
      icon: UserPlus,
      color: 'bg-blue-500',
      unread: true,
      action: () => navigate('/leads')
    },
    {
      id: '2',
      type: 'task',
      title: 'Task Due Soon',
      message: 'Follow up with Sarah Wijaya is due in 2 hours',
      time: '15 minutes ago',
      icon: Calendar,
      color: 'bg-orange-500',
      unread: true,
      action: () => navigate('/tasks')
    },
    {
      id: '3',
      type: 'property',
      title: 'New Property Listing',
      message: 'Kitsune Grove has been added to your listings',
      time: '1 hour ago',
      icon: Home,
      color: 'bg-emerald-500',
      unread: true,
      action: () => navigate('/listings')
    },
    {
      id: '4',
      type: 'sales',
      title: 'Sale Completed',
      message: 'Congratulations! You closed a deal worth Rp 2.4B',
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'bg-purple-500',
      unread: false,
      action: () => navigate('/sales')
    },
    {
      id: '5',
      type: 'lead',
      title: 'Lead Status Updated',
      message: 'Budi Santoso moved to "Won" status',
      time: '3 hours ago',
      icon: CheckCircle2,
      color: 'bg-green-500',
      unread: false,
      action: () => navigate('/leads')
    },
    {
      id: '6',
      type: 'task',
      title: 'Task Completed',
      message: 'You completed "Listing review: Asahi Hills"',
      time: 'Yesterday',
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      unread: false,
      action: () => navigate('/tasks')
    },
    {
      id: '7',
      type: 'social',
      title: 'High Engagement',
      message: 'Your post on @luxuryliving reached 1.2K likes',
      time: 'Yesterday',
      icon: MessageSquare,
      color: 'bg-pink-500',
      unread: false,
      action: () => navigate('/social')
    },
    {
      id: '8',
      type: 'system',
      title: 'Token Balance Low',
      message: 'You have 20 tokens remaining. Consider purchasing more.',
      time: '2 days ago',
      icon: AlertCircle,
      color: 'bg-yellow-500',
      unread: false,
      action: () => setIsBillingOpen(true)
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Open settings if requested (e.g., when returning from edit profile)
  useEffect(() => {
    if (shouldOpenSettings) {
      setShouldAnimateSettings(false); // Disable animation when returning
      setIsSettingsOpen(true);
      setShouldOpenSettings(false);
      // Reset animation flag after a brief moment
      setTimeout(() => setShouldAnimateSettings(true), 100);
    }
  }, [shouldOpenSettings, setShouldOpenSettings]);

  // Close everything helper
  const closeAll = () => {
    setIsOpen(false);
    setIsSettingsOpen(false);
    setIsBillingOpen(false);
    setIsLanguageOpen(false);
    setIsLinkedAccountsOpen(false);
    setIsNotificationsOpen(false);
  };

  const getLanguageLabel = () => {
    return language === 'en' ? 'English (US)' : 'Bahasa Indonesia';
  };

  return (
    <>
      <div className="px-6 pt-12 pb-4 bg-slate-50 dark:bg-slate-950 sticky top-0 z-40 transition-colors duration-300">
        <div className="flex justify-between items-center relative">
           <div className="flex items-center gap-3">
             <div className="relative">
               <img 
                 src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                 alt="Profile" 
                 className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
               />
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
             </div>
             
             <div className="relative">
               <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-left focus:outline-none group"
               >
                 <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 group-hover:text-primary transition-colors">
                   Rachmat Widodo 
                   <ChevronDown 
                      size={14} 
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                   />
                 </h1>
               </button>

               {/* Dropdown Menu */}
               <AnimatePresence>
                  {isOpen && (
                    <>
                      <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsOpen(false)}
                      ></div>
                      <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-20"
                      >
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Connected Accounts</p>
                          <div className="space-y-1">
                              {CONNECTED_ACCOUNTS.map((acc) => (
                                  <button 
                                      key={acc.id}
                                      className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                                      onClick={() => setIsOpen(false)}
                                  >
                                      <div className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${acc.color}`}>
                                          <acc.icon size={16} />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{acc.handle}</p>
                                          <p className="text-[10px] text-slate-500">{acc.platform}</p>
                                      </div>
                                  </button>
                              ))}
                          </div>
                           <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                               <button className="w-full text-xs font-semibold text-primary py-1 hover:underline">
                                   + Connect New Account
                               </button>
                           </div>
                      </motion.div>
                    </>
                  )}
               </AnimatePresence>
             </div>
           </div>

          <div className="flex gap-2">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <Settings size={20} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 relative transition-colors"
              >
              <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-950">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
            </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[45]" 
                      onClick={() => setIsNotificationsOpen(false)}
                    ></div>
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-[50] max-h-[80vh] flex flex-col overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
                          {unreadCount > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                            </p>
                          )}
          </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-primary hover:text-orange-600 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="overflow-y-auto flex-1">
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notification) => {
                              const Icon = notification.icon;
                              return (
                                <button
                                  key={notification.id}
                                  onClick={() => {
                                    // Mark as read when clicked
                                    setNotifications(notifications.map(n => 
                                      n.id === notification.id ? { ...n, unread: false } : n
                                    ));
                                    notification.action();
                                    setIsNotificationsOpen(false);
                                  }}
                                  className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                    notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-full ${notification.color} flex items-center justify-center text-white flex-shrink-0`}>
                                      <Icon size={18} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className={`text-sm font-semibold text-slate-800 dark:text-slate-100 ${
                                          notification.unread ? 'font-bold' : ''
                                        }`}>
                                          {notification.title}
                                        </h4>
                                        {notification.unread && (
                                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                        {notification.message}
                                      </p>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                                        {notification.time}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <Bell size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <button
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            // In a real app, this would navigate to a full notifications page
                          }}
                          className="w-full text-xs font-semibold text-primary hover:text-orange-600 transition-colors text-center py-2"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={shouldAnimateSettings ? { y: '100%' } : { y: '0%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={shouldAnimateSettings ? { type: "spring", damping: 25, stiffness: 200 } : { duration: 0 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl max-w-md mx-auto h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 flex-shrink-0 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
                  <button 
                    onClick={closeAll}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-6 pb-8">
                  
                  {/* Account Section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Account</h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden">
                      <SettingsItem 
                        icon={User} 
                        label="Edit Profile" 
                        onClick={() => {
                          closeAll();
                          navigate('/edit-profile', { state: { fromSettings: true } });
                        }}
                      />
                      <SettingsItem 
                        icon={CreditCard} 
                        label="Plan & Billing" 
                        subLabel="Pro Plan • 120 Tokens" 
                        border={false} 
                        onClick={() => {
                          setBillingOpenedFromSettings(true);
                          setIsSettingsOpen(false); // Close settings first
                          // Small delay to allow settings to close, then open billing
                          setTimeout(() => {
                            setIsBillingOpen(true);
                          }, 200);
                        }}
                      />
                    </div>
                  </div>

                  {/* App Preferences */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Preferences</h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden">
                      <SettingsItem icon={Bell} label="Notifications" />
                      <SettingsItem 
                        icon={Globe} 
                        label="Language" 
                        subLabel={getLanguageLabel()}
                        onClick={() => setIsLanguageOpen(true)}
                      />
                      <SettingsItem 
                        icon={Link} 
                        label="Linked Accounts" 
                        subLabel={`${LINKED_ACCOUNTS_DATA.length} connected`}
                        border={false}
                        onClick={() => setIsLinkedAccountsOpen(true)}
                      />
                    </div>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Support</h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden">
                      <SettingsItem icon={Shield} label="Privacy & Security" />
                      <SettingsItem 
                        icon={HelpCircle} 
                        label="Contact Support" 
                        border={false}
                        onClick={() => {
                          setIsOpen(false);
                          setTimeout(() => setIsSupportChatOpen(true), 300);
                        }}
                      />
                    </div>
                  </div>

                  {/* Logout */}
                  <button className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold flex items-center justify-center gap-2 mt-4 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={18} /> Log Out
                  </button>
                  
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    Version 2.4.0 (Build 20250901)
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Plan & Billing Sub-Modal */}
      <AnimatePresence>
        {isBillingOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setIsBillingOpen(false);
                      // If opened from settings, reopen settings without animation
                      if (billingOpenedFromSettings) {
                        setBillingOpenedFromSettings(false);
                        setShouldAnimateSettings(false); // Disable animation
                        // Small delay to allow billing modal to close first
                        setTimeout(() => {
                          setIsSettingsOpen(true);
                          // Reset animation flag after a brief moment
                          setTimeout(() => setShouldAnimateSettings(true), 100);
                        }, 100);
                      }
                    }} 
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
                  </button>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Plan & Billing</h2>
               </div>
            </div>

            <div className="p-6 space-y-6 pb-24">
              
              {/* Overview Cards */}
              <div className="space-y-4">
                 <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                       <Zap size={64} />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Plan</p>
                          <h3 className="text-2xl font-bold mt-1">Pro Plan</h3>
                       </div>
                       <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">ACTIVE</div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs text-slate-300">
                          <span>Renews</span>
                          <span>31 Dec 2025</span>
                       </div>
                       <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="w-[75%] bg-gradient-to-r from-blue-500 to-purple-500 h-full"></div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsPlanSelectionOpen(true)}
                      className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
                    >
                       Manage Subscription
                    </button>
                 </div>

                 <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Token Balance</p>
                          <div className="flex items-baseline gap-1 mt-1">
                             <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">120</h3>
                             <span className="text-sm text-slate-400">tokens</span>
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                          <Zap size={20} className="fill-orange-500" />
                       </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Use tokens for AI content generation and premium leads.</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                       <button 
                         onClick={() => {
                           setSelectedTokenAmount(10);
                           setIsTokenPaymentOpen(true);
                         }}
                         className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-center group transition-colors"
                       >
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary">10</p>
                          <p className="text-[10px] text-slate-400">Rp 25.000</p>
                       </button>
                       <button 
                         onClick={() => {
                           setSelectedTokenAmount(50);
                           setIsTokenPaymentOpen(true);
                         }}
                         className="p-2 rounded-lg border-2 border-primary bg-primary/5 text-center relative overflow-hidden"
                       >
                          <div className="absolute top-0 right-0 bg-primary text-white text-[8px] px-1 rounded-bl">BEST</div>
                          <p className="text-xs font-bold text-primary">50</p>
                          <p className="text-[10px] text-slate-400">Rp 125.000</p>
                       </button>
                       <button 
                         onClick={() => {
                           setTempTokenInput(customTokenAmount?.toString() || '');
                           setIsTokenInputOpen(true);
                         }}
                         className={`p-2 rounded-lg border-2 text-center transition-colors ${
                           customTokenAmount 
                             ? 'border-primary bg-primary/5' 
                             : 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary'
                         }`}
                       >
                          {customTokenAmount ? (
                            <>
                              <p className="text-xs font-bold text-primary">{customTokenAmount}</p>
                              <p className="text-[10px] text-slate-400">Rp {(customTokenAmount * 2500).toLocaleString('id-ID')}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Custom</p>
                              <p className="text-[10px] text-slate-400">Input</p>
                            </>
                          )}
                       </button>
                    </div>
                 </div>
              </div>

              {/* Vouchers - Swapped position */}
              <div>
                 <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Vouchers</h3>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                       <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                          type="text" 
                          placeholder="Enter discount code" 
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-none focus:ring-2 focus:ring-primary/20"
                       />
                    </div>
                    <button className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-600">
                       Apply
                    </button>
                 </div>
              </div>

              {/* Payment Methods - Swapped position */}
              <div>
                 <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Payment Methods</h3>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center">
                             <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                             </div>
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Mastercard **** 4242</p>
                             <p className="text-xs text-slate-500">Expires 10/28</p>
                          </div>
                       </div>
                       <button className="text-slate-400 hover:text-slate-600">
                          <ChevronRight size={16} />
                       </button>
                    </div>
                    <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                       <Plus size={16} /> Add Payment Method
                    </button>
                 </div>
              </div>

              {/* History */}
              <div>
                 <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Transaction History</h3>
                 <div className="space-y-4">
                    {[
                       { title: 'Token Pack (100)', date: 'Today', amount: '$25.00' },
                       { title: 'Pro Plan Monthly', date: 'Aug 31, 2025', amount: '$29.00' },
                       { title: 'Token Pack (50)', date: 'Aug 15, 2025', amount: '$15.00' }
                    ].map((tx, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <Clock size={14} />
                             </div>
                             <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tx.title}</p>
                                <p className="text-xs text-slate-500">{tx.date}</p>
                             </div>
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{tx.amount}</p>
                       </div>
                    ))}
                    <button className="w-full text-xs text-primary font-medium mt-2">View All Transactions</button>
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {isLanguageOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsLanguageOpen(false)} 
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Select Language</h2>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {/* English Option */}
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsLanguageOpen(false);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  language === 'en'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      language === 'en' 
                        ? 'bg-primary text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">English</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">English (US)</p>
                    </div>
                  </div>
                  {language === 'en' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Bahasa Indonesia Option */}
              <button
                onClick={() => {
                  setLanguage('id');
                  setIsLanguageOpen(false);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  language === 'id'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      language === 'id' 
                        ? 'bg-primary text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Bahasa Indonesia</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Indonesian</p>
                    </div>
                  </div>
                  {language === 'id' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Linked Accounts Modal */}
      <AnimatePresence>
        {isLinkedAccountsOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsLinkedAccountsOpen(false)} 
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Linked Accounts</h2>
              </div>
              <button 
                onClick={() => setIsAddAccountOpen(true)}
                className="text-sm font-semibold text-primary hover:text-orange-600 transition-colors"
              >
                + Connect
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Account Usage & Purchase Section */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Account Usage</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{LINKED_ACCOUNTS_DATA.length}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">/ {socialAccountLimit} accounts</span>
                      {LINKED_ACCOUNTS_DATA.length > socialAccountLimit && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          (+{LINKED_ACCOUNTS_DATA.length - socialAccountLimit} additional)
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPurchaseAccountsOpen(true)}
                    className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-colors"
                    title="Add more accounts"
                  >
                    <Zap size={18} />
                  </button>
                </div>
                {LINKED_ACCOUNTS_DATA.length >= socialAccountLimit && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {LINKED_ACCOUNTS_DATA.length - socialAccountLimit} account{LINKED_ACCOUNTS_DATA.length - socialAccountLimit !== 1 ? 's' : ''} added beyond plan limit
                    </p>
                  </div>
                )}
              </div>

              {/* Connected Accounts List */}
              {LINKED_ACCOUNTS_DATA.map((account, index) => {
                const isAdditional = index >= socialAccountLimit;
                const Icon = account.icon;
                return (
                  <div
                    key={account.id}
                    className={`p-4 rounded-xl border ${
                      isAdditional 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    } hover:shadow-md transition-all`}
                  >
                    {isAdditional && (
                      <div className="mb-2 flex items-center gap-1.5">
                        <Zap size={12} className="text-primary" />
                        <span className="text-[10px] font-semibold text-primary">Additional Account</span>
                      </div>
                    )}
                    {/* Account Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${account.color} flex items-center justify-center text-white`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100">{account.handle}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{account.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.status === 'connected' ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
                            <AlertCircle size={12} className="text-red-500" />
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400">Disconnected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {account.followers && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Followers</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{account.followers}</p>
                        </div>
                      )}
                      {account.posts && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Posts</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{account.posts}</p>
                        </div>
                      )}
                      {account.messages && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Messages</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{account.messages}</p>
                        </div>
                      )}
                      {account.conversations && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Chats</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{account.conversations}</p>
                        </div>
                      )}
                      {account.leads && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Leads</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{account.leads}</p>
                        </div>
                      )}
                      {account.visits && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Visits</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{account.visits}</p>
                        </div>
                      )}
                    </div>

                    {/* Permissions */}
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {account.permissions.map((permission, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-medium text-primary"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Last Synced & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Last synced: {account.lastSynced}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Refresh">
                          <RefreshCw size={14} className="text-slate-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Open in app">
                          <ExternalLink size={14} className="text-slate-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Disconnect">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pending Accounts (Ready to Connect) */}
              {pendingAccounts.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Ready to Connect</h3>
                  <div className="space-y-2">
                    {pendingAccounts.map((account, idx) => {
                      const Icon = account.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border-2 border-dashed border-primary bg-primary/5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl ${account.color} flex items-center justify-center text-white`}>
                                <Icon size={20} className={account.color.includes('black') ? 'text-white dark:text-black' : ''} />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{account.platform}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Click to connect</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                              Connect
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add New Account Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Available Integrations</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 to-purple-600' },
                    { name: 'TikTok', icon: Video, color: 'bg-black dark:bg-white' },
                    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
                    { name: 'Website', icon: Globe, color: 'bg-blue-500' },
                    { name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500' },
                    { name: 'Twitter', icon: Link, color: 'bg-sky-500' },
                    { name: 'LinkedIn', icon: Users, color: 'bg-blue-700' },
                    { name: 'YouTube', icon: Video, color: 'bg-red-600' },
                  ].map((platform, idx) => (
                    <button
                      key={idx}
                      className="p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all flex flex-col items-center gap-2"
                    >
                      <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white`}>
                        <platform.icon size={20} className={platform.color.includes('black') ? 'text-white dark:text-black' : ''} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Account Modal */}
      <AnimatePresence>
        {isAddAccountOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAddAccountOpen(false)} 
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Social Media Account</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Account Limit Info */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Available Slots:</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {socialAccountLimit - LINKED_ACCOUNTS_DATA.length - pendingAccounts.length}
                  </span>
                </div>
                {socialAccountLimit - LINKED_ACCOUNTS_DATA.length - pendingAccounts.length <= 0 && (
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      No available slots. Purchase more accounts to continue.
                    </p>
                  </div>
                )}
              </div>

              {/* Platform Selection */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Select Platform</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 to-purple-600' },
                    { name: 'TikTok', icon: Video, color: 'bg-black dark:bg-white' },
                    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
                    { name: 'Website', icon: Globe, color: 'bg-blue-500' },
                    { name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500' },
                    { name: 'Twitter', icon: Link, color: 'bg-sky-500' },
                    { name: 'LinkedIn', icon: Users, color: 'bg-blue-700' },
                    { name: 'YouTube', icon: Video, color: 'bg-red-600' },
                  ].map((platform, idx) => {
                    const Icon = platform.icon;
                    const hasAvailableSlots = socialAccountLimit - LINKED_ACCOUNTS_DATA.length - pendingAccounts.length > 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (hasAvailableSlots) {
                            // Add to pending accounts
                            setPendingAccounts(prev => [...prev, platform]);
                            setIsAddAccountOpen(false);
                          } else {
                            // Show purchase modal
                            setIsAddAccountOpen(false);
                            setIsPurchaseAccountsOpen(true);
                          }
                        }}
                        disabled={!hasAvailableSlots}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          hasAvailableSlots
                            ? 'border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary'
                            : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white`}>
                          <Icon size={20} className={platform.color.includes('black') ? 'text-white dark:text-black' : ''} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purchase More Button */}
              <button
                onClick={() => {
                  setIsAddAccountOpen(false);
                  setIsPurchaseAccountsOpen(true);
                }}
                className="w-full py-3 rounded-xl border-2 border-primary bg-primary/5 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
              >
                <Zap size={16} />
                Purchase More Accounts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Chat Modal */}
      <AnimatePresence>
        {isSupportChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsSupportChatOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-950 w-full max-w-md rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Support Agent</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">We're here to help!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSupportChatOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                {/* Welcome Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                      <p className="text-sm text-slate-800 dark:text-slate-100">
                        👋 Hi! I'm your AI support agent. How can I help you today? I can assist with:
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>Account and billing questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>Feature guidance and tutorials</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>Technical support</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>General inquiries</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">Just now</p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    How to create content?
                  </button>
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Billing questions
                  </button>
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Report an issue
                  </button>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <Plus size={18} className="text-slate-500" />
                    </button>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20">
                    <MessageSquare size={20} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  AI responses are typically instant • Your conversation is private
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {isPlanSelectionOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center gap-3">
              <button 
                onClick={() => setIsPlanSelectionOpen(false)} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Choose Your Plan</h2>
            </div>

            {/* Plans List */}
            <div className="p-6 space-y-4 pb-24">
              {/* Basic Plan */}
              <div
                onClick={() => {
                  setSelectedPlan('basic');
                  setIsPlanSelectionOpen(false);
                  setIsPaymentOpen(true);
                }}
                className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-primary transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Basic</h3>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">Rp 0</p>
                    <p className="text-xs text-slate-400 mt-0.5">Free forever</p>
                  </div>
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">
                    FREE
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>3</strong> Property Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>0</strong> AI Tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Token Discount: <strong>N/A</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>1</strong> Connected Social Account</span>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div
                onClick={() => {
                  setSelectedPlan('pro');
                  setIsPlanSelectionOpen(false);
                  setIsPaymentOpen(true);
                }}
                className="p-5 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10 transition-all active:scale-[0.98] relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  POPULAR
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pro</h3>
                    <p className="text-2xl font-bold text-primary mt-1">Rp 50.000</p>
                    <p className="text-xs text-slate-400 mt-0.5">per month</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>50</strong> Property Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>10</strong> AI Tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Token Discount: <strong>Yes</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>3</strong> Connected Social Accounts</span>
                  </div>
                </div>
              </div>

              {/* Pro Max Plan */}
              <div
                onClick={() => {
                  setSelectedPlan('pro-max');
                  setIsPlanSelectionOpen(false);
                  setIsPaymentOpen(true);
                }}
                className="p-5 rounded-2xl border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 cursor-pointer hover:border-purple-600 transition-all active:scale-[0.98] relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  BEST VALUE
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pro Max</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">Rp 150.000</p>
                    <p className="text-xs text-slate-400 mt-0.5">per month</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>150</strong> Property Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>25</strong> AI Tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Token Discount: <strong>Yes</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong>5</strong> Connected Social Accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Page Modal */}
      <AnimatePresence>
        {isPaymentOpen && selectedPlan && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center gap-3">
              <button 
                onClick={() => {
                  setIsPaymentOpen(false);
                  setSelectedPlan(null);
                  setIsPlanSelectionOpen(true);
                }} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Complete Payment</h2>
            </div>

            {/* Payment Content */}
            <div className="p-6 space-y-6 pb-24">
              {/* Selected Plan Summary */}
              <div className="p-5 rounded-2xl border-2 border-primary bg-primary/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
                      {selectedPlan === 'basic' ? 'Basic' : selectedPlan === 'pro' ? 'Pro' : 'Pro Max'} Plan
                    </h3>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {selectedPlan === 'basic' ? 'Rp 0' : selectedPlan === 'pro' ? 'Rp 50.000' : 'Rp 150.000'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedPlan === 'basic' ? 'Free forever' : 'per month'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Property Listings:</span>
                    <strong>{selectedPlan === 'basic' ? '3' : selectedPlan === 'pro' ? '50' : '150'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Tokens:</span>
                    <strong>{selectedPlan === 'basic' ? '0' : selectedPlan === 'pro' ? '10' : '25'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Token Discount:</span>
                    <strong>{selectedPlan === 'basic' ? 'N/A' : 'Yes'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Accounts:</span>
                    <strong>{selectedPlan === 'basic' ? '1' : selectedPlan === 'pro' ? '3' : '5'}</strong>
                  </div>
                </div>
              </div>

              {/* Voucher Input */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Voucher</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Enter discount code" 
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-600">
                    Apply
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border-2 border-primary bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center">
                        <div className="flex -space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Mastercard **** 4242</p>
                        <p className="text-xs text-slate-500">Expires 10/28</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Plus size={16} /> Add Payment Method
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedPlan === 'basic' ? 'Rp 0' : selectedPlan === 'pro' ? 'Rp 50.000' : 'Rp 150.000'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tax</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Rp 0</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {selectedPlan === 'basic' ? 'Rp 0' : selectedPlan === 'pro' ? 'Rp 50.000' : 'Rp 150.000'}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={() => {
                  // In a real app, this would process the payment
                  alert(`Payment processed for ${selectedPlan === 'basic' ? 'Basic' : selectedPlan === 'pro' ? 'Pro' : 'Pro Max'} Plan!`);
                  setIsPaymentOpen(false);
                  setSelectedPlan(null);
                  setIsBillingOpen(false);
                }}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                {selectedPlan === 'basic' ? 'Activate Free Plan' : 'Complete Payment'}
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Token Input Modal */}
      <AnimatePresence>
        {isTokenInputOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={() => setIsTokenInputOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Custom Token Amount</h3>
                <button 
                  onClick={() => setIsTokenInputOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Number of Tokens
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tempTokenInput}
                    onChange={(e) => setTempTokenInput(e.target.value)}
                    placeholder="Enter amount"
                    autoFocus
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-lg font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                {/* Price Calculation */}
                {tempTokenInput && Number(tempTokenInput) > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Price per token:</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Rp 2.500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        Rp {(Number(tempTokenInput) * 2500).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {/* OK Button */}
                <button
                  onClick={() => {
                    const amount = Number(tempTokenInput);
                    if (amount > 0) {
                      setCustomTokenAmount(amount);
                      setSelectedTokenAmount(amount);
                      setIsTokenInputOpen(false);
                      setIsTokenPaymentOpen(true);
                    }
                  }}
                  disabled={!tempTokenInput || Number(tempTokenInput) <= 0}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                    !tempTokenInput || Number(tempTokenInput) <= 0
                      ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                      : 'bg-primary shadow-lg shadow-primary/30 active:scale-95'
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token Payment Page Modal */}
      <AnimatePresence>
        {isTokenPaymentOpen && selectedTokenAmount && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 max-w-md mx-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex items-center gap-3">
              <button 
                onClick={() => {
                  setIsTokenPaymentOpen(false);
                  setSelectedTokenAmount(null);
                }} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Complete Payment</h2>
            </div>

            {/* Payment Content */}
            <div className="p-6 space-y-6 pb-24">
              {/* Selected Token Summary */}
              <div className="p-5 rounded-2xl border-2 border-primary bg-primary/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Token Purchase
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <Zap size={24} className="text-primary" />
                      <p className="text-2xl font-bold text-primary">{selectedTokenAmount}</p>
                      <span className="text-sm text-slate-500 dark:text-slate-400">tokens</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Price per token:</span>
                    <strong>Rp 2.500</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total tokens:</span>
                    <strong>{selectedTokenAmount}</strong>
                  </div>
                </div>
              </div>

              {/* Voucher Input */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Voucher</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={tokenVoucherCode}
                      onChange={(e) => setTokenVoucherCode(e.target.value)}
                      placeholder="Enter discount code" 
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-600">
                    Apply
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border-2 border-primary bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center">
                        <div className="flex -space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Mastercard **** 4242</p>
                        <p className="text-xs text-slate-500">Expires 10/28</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Plus size={16} /> Add Payment Method
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Rp {(selectedTokenAmount * 2500).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tax</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Rp 0</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Total</span>
                  <span className="text-xl font-bold text-primary">
                    Rp {(selectedTokenAmount * 2500).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={() => {
                  // In a real app, this would process the payment
                  alert(`Payment processed for ${selectedTokenAmount} tokens!`);
                  setIsTokenPaymentOpen(false);
                  setSelectedTokenAmount(null);
                  setTokenVoucherCode('');
                  setIsBillingOpen(false);
                }}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                Complete Payment
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Additional Social Accounts Modal */}
      <AnimatePresence>
        {isPurchaseAccountsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPurchaseAccountsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Social Media Accounts</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Spend tokens to increase your account limit</p>
                </div>
                <button 
                  onClick={() => setIsPurchaseAccountsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Current Status */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Accounts:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{LINKED_ACCOUNTS_DATA.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Plan Limit:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{socialAccountLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Token Balance:</span>
                    <div className="flex items-center gap-1">
                      <Zap size={14} className="text-primary" />
                      <span className="text-sm font-bold text-primary">{userTokenBalanceForAccounts}</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Rate Info */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      3 Tokens = 1 Additional Account
                    </p>
                  </div>
                </div>

                {/* Accounts Input Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Number of Accounts to Add
                  </label>
                  <div className="relative">
                    <select
                      value={accountsToAdd}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setAccountsToAdd(value);
                      }}
                      className="w-full px-4 py-3 pr-10 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-lg font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer"
                    >
                      {(() => {
                        const maxAccounts = Math.floor(userTokenBalanceForAccounts / 3);
                        const options = [];
                        for (let i = 1; i <= Math.min(10, maxAccounts); i++) {
                          options.push(
                            <option key={i} value={i}>
                              {i} account{i !== 1 ? 's' : ''}
                            </option>
                          );
                        }
                        return options;
                      })()}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    You can add up to {Math.floor(userTokenBalanceForAccounts / 3)} account{Math.floor(userTokenBalanceForAccounts / 3) !== 1 ? 's' : ''} ({Math.floor(userTokenBalanceForAccounts / 3) * 3} {Math.floor(userTokenBalanceForAccounts / 3) * 3 === 1 ? 'token' : 'tokens'})
                  </p>
                </div>

                {/* Calculation Preview */}
                {accountsToAdd > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Accounts to add:</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">+{accountsToAdd}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tokens to spend:</span>
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-primary" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{accountsToAdd * 3}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">New Total Limit:</span>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {socialAccountLimit + accountsToAdd}
                      </span>
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <button
                  onClick={() => {
                    const tokensRequired = accountsToAdd * 3;
                    if (accountsToAdd > 0 && tokensRequired <= userTokenBalanceForAccounts) {
                      // In a real app, this would make an API call
                      const newLimit = socialAccountLimit + accountsToAdd;
                      setSocialAccountLimit(newLimit);
                      // Update token balance (mock)
                      // setUserTokenBalanceForAccounts(prev => prev - tokensRequired);
                      alert(`Successfully added ${accountsToAdd} account${accountsToAdd !== 1 ? 's' : ''}! Your new limit is ${newLimit}.`);
                      setIsPurchaseAccountsOpen(false);
                      setAccountsToAdd(1);
                      // Return to add account modal
                      setIsAddAccountOpen(true);
                    }
                  }}
                  disabled={accountsToAdd <= 0 || (accountsToAdd * 3) > userTokenBalanceForAccounts}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    accountsToAdd <= 0 || (accountsToAdd * 3) > userTokenBalanceForAccounts
                      ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                      : 'bg-primary shadow-lg shadow-primary/30 active:scale-95'
                  }`}
                >
                  Purchase {accountsToAdd * 3} {accountsToAdd * 3 === 1 ? 'Token' : 'Tokens'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

const SettingsItem: React.FC<{ 
  icon: React.ElementType, 
  label: string, 
  subLabel?: string, 
  border?: boolean,
  onClick?: () => void
}> = ({ icon: Icon, label, subLabel, border = true, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${border ? 'border-b border-slate-200 dark:border-slate-800' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</h4>
          {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
    </div>
  );
};

export default Header;