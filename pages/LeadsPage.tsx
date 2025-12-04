import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { Plus, Search, MessageSquare, Instagram, Globe, X, Calendar, Filter, Phone, Check, ChevronDown, User, FileText, Home, Video, Facebook } from 'lucide-react';
import { Lead } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const LeadsPage: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [activeFilters, setActiveFilters] = useState({
    date: 'Any time',
    channel: 'All',
    stage: 'All'
  });

  // Temporary filters for the modal before applying
  const [tempFilters, setTempFilters] = useState(activeFilters);
  const [tempSearch, setTempSearch] = useState('');

  // Initial Mock Data with Correct Date Format
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Sarah Wijaya', source: 'WhatsApp', message: 'Interested in Jakarta property launch, requests financing details.', timestamp: '05-Sep-2025 • 10:42 AM', avatar: 'SW', status: 'New' },
    { id: '2', name: 'Krisno Nugroho', source: 'Instagram', message: 'Asks about corner unit availability and December promo.', timestamp: '04-Sep-2025 • 03:15 PM', avatar: 'KN', status: 'Follow Up' },
    { id: '3', name: 'Budi Santoso', source: 'Website', message: 'Scheduled viewing for Asahi Hills.', timestamp: '03-Sep-2025 • 09:30 AM', avatar: 'BS', status: 'Won' },
    { id: '4', name: 'Linda Kurnia', source: 'Referral', message: 'Looking for 3BR apartment in South Jakarta.', timestamp: '02-Sep-2025 • 02:45 PM', avatar: 'LK', status: 'New' },
    { id: '5', name: 'Rina Melati', source: 'Instagram', message: 'Price list request for Cluster 5.', timestamp: '01-Sep-2025 • 11:20 AM', avatar: 'RM', status: 'New' },
    { id: '6', name: 'Pak Handoko', source: 'WhatsApp', message: 'Can we reschedule the meeting?', timestamp: '28-Aug-2025 • 04:00 PM', avatar: 'PH', status: 'Follow Up' },
  ]);

  // Mock Data for Sources (Accounts) & Properties
  const ACCOUNTS = [
    { id: 'ig1', label: '@luxuryliving', icon: Instagram, platform: 'Instagram' },
    { id: 'ig2', label: '@cityhomes', icon: Instagram, platform: 'Instagram' },
    { id: 'tt1', label: '@re_trends', icon: Video, platform: 'TikTok' },
    { id: 'wa', label: 'WhatsApp', icon: MessageSquare, platform: 'WhatsApp' },
    { id: 'web', label: 'Website', icon: Globe, platform: 'Website' },
  ];

  const PROPERTIES = [
    { id: '1', name: 'Kitsune Grove', location: 'Kelapa Gading' },
    { id: '2', name: 'Asahi Hills', location: 'BSD City' },
    { id: '3', name: 'Sapporo Residence', location: 'Bandung' },
    { id: '4', name: 'Kyoto Village', location: 'Cibubur' },
    { id: '5', name: 'Ginza Tower', location: 'Jakarta Pusat' },
  ];

  // Add Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    source: 'WhatsApp',
    property: '',
    message: ''
  });

  const handleAddLead = () => {
    if (!newLead.name) return;

    const date = new Date();
    // Format: DD-Mon-YYYY • HH:mm AM/PM
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const sourceObj = ACCOUNTS.find(a => a.id === newLead.source);
    // Use platform name for the tag (e.g. 'Instagram'), or label if it's generic like WhatsApp
    const sourceLabel = sourceObj ? sourceObj.platform : 'WhatsApp';
    
    // Construct message including property interest if selected
    let fullMessage = newLead.message || 'New inquiry';
    if (newLead.property) {
        const propName = PROPERTIES.find(p => p.id === newLead.property)?.name;
        if (propName) fullMessage = `[Interested in ${propName}] ${fullMessage}`;
    }
    if (newLead.phone) {
        fullMessage = `${fullMessage} (Phone: ${newLead.phone})`;
    }

    // Validate source is a valid Lead source type
    const validSources: Lead['source'][] = ['WhatsApp', 'Instagram', 'Website', 'Referral', 'TikTok'];
    const finalSource: Lead['source'] = validSources.includes(sourceLabel as Lead['source']) 
      ? (sourceLabel as Lead['source']) 
      : 'WhatsApp';

    const leadToAdd: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      source: finalSource,
      message: fullMessage,
      timestamp: formattedDate,
      avatar: newLead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      status: 'New'
    };

    setLeads([leadToAdd, ...leads]);
    setNewLead({ name: '', phone: '', source: 'wa', property: '', message: '' });
    setIsAddLeadOpen(false);
  };

  // Filtering Logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Text Search
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lead.message.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter: Channel
      if (activeFilters.channel !== 'All') {
         if (activeFilters.channel === 'WhatsApp' && lead.source !== 'WhatsApp') return false;
         if (activeFilters.channel === 'Instagram' && lead.source !== 'Instagram') return false;
      }

      // Filter: Stage
      if (activeFilters.stage !== 'All') {
         if (activeFilters.stage === 'New' && lead.status !== 'New') return false;
         if (activeFilters.stage === 'Follow Up' && lead.status !== 'Follow Up') return false;
         if (activeFilters.stage === 'Won' && lead.status !== 'Won') return false;
      }

      return true;
    });
  }, [leads, searchQuery, activeFilters]);

  const openSearch = () => {
    setTempSearch(searchQuery);
    setTempFilters(activeFilters);
    setIsSearchOpen(true);
  };

  const applyFilters = () => {
    setSearchQuery(tempSearch);
    setActiveFilters(tempFilters);
    setIsSearchOpen(false);
  };

  const clearFilters = () => {
    setTempSearch('');
    setTempFilters({
      date: 'Any time',
      channel: 'All',
      stage: 'All'
    });
    setActiveFilters({
      date: 'Any time',
      channel: 'All',
      stage: 'All'
    });
    setSearchQuery('');
  };

  // Mock Filter Options
  const FILTER_OPTIONS = {
    dates: ['Any time', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days'],
    channels: ['All', 'WhatsApp', 'Instagram', 'Email', 'Phone'],
    stages: ['All', 'New', 'Follow Up', 'Negotiation', 'Won', 'Lost']
  };

  const hasActiveFilters = activeFilters.channel !== 'All' || activeFilters.stage !== 'All' || activeFilters.date !== 'Any time' || searchQuery !== '';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />

      <div className="px-6 py-2 mb-2">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads</h1>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track potential clients</p>
      </div>

      <div className="px-4 space-y-6">
          {/* Stats Row */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <Card className="min-w-[100px] flex-1 text-center py-4" noPadding>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{leads.length}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">Total</p>
              </Card>
              <Card className="min-w-[100px] flex-1 text-center py-4" noPadding>
                  <h3 className="text-2xl font-bold text-primary">11</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">Active</p>
              </Card>
              <Card className="min-w-[100px] flex-1 text-center py-4" noPadding>
                  <h3 className="text-2xl font-bold text-emerald-500">100</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">Won</p>
              </Card>
          </div>

          {/* Search Bar Trigger */}
          <div 
            onClick={openSearch}
            className="relative cursor-pointer group"
          >
              <div className="absolute left-4 top-3.5 text-slate-400 group-hover:text-primary transition-colors">
                <Search size={20} />
              </div>
              <div className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 shadow-sm flex items-center justify-between">
                 <span>{searchQuery || "Search leads..."}</span>
                 {hasActiveFilters && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                 )}
              </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
             <div className="flex gap-2 flex-wrap">
                {searchQuery && (
                    <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        "{searchQuery}"
                    </span>
                )}
                {Object.entries(activeFilters).map(([key, value]) => {
                    if (value === 'All' || value === 'Any time') return null;
                    return (
                        <span key={key} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary capitalize">
                            {value}
                        </span>
                    );
                })}
             </div>
          )}

          {/* Recent Leads */}
          <div>
              <div className="flex justify-between items-center mb-4 px-1">
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">
                    {hasActiveFilters ? 'Filtered Results' : 'Recent Leads'}
                    <span className="ml-2 text-xs font-normal text-slate-500">({filteredLeads.length})</span>
                  </h2>
                  <button 
                    onClick={hasActiveFilters ? clearFilters : undefined}
                    className="text-xs text-primary font-medium"
                  >
                    See All
                  </button>
              </div>

              <div className="space-y-3">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                        <Card key={lead.id} noPadding className="p-4 active:scale-[0.98] transition-transform duration-100">
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-sm">
                                        {lead.avatar}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm">
                                        {lead.source === 'WhatsApp' && <div className="bg-green-500 rounded-full p-0.5"><MessageSquare size={10} className="text-white" /></div>}
                                        {lead.source === 'Instagram' && <div className="bg-pink-500 rounded-full p-0.5"><Instagram size={10} className="text-white" /></div>}
                                        {lead.source === 'Website' && <div className="bg-blue-500 rounded-full p-0.5"><Globe size={10} className="text-white" /></div>}
                                        {lead.source === 'Referral' && <div className="bg-purple-500 rounded-full p-0.5"><Check size={10} className="text-white" /></div>}
                                        {lead.source === 'TikTok' && <div className="bg-black rounded-full p-0.5"><Video size={10} className="text-white" /></div>}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    {/* Top: Name and Message */}
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{lead.name}</h3>
                                            {/* Timestamp removed from here */}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{lead.message}</p>
                                    </div>
                                    
                                    {/* Bottom: Status, Source and Timestamp */}
                                    <div className="mt-3 flex items-end justify-between">
                                        <div className="flex gap-2">
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{lead.status}</span>
                                            {hasActiveFilters && <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{lead.source}</span>}
                                        </div>
                                        {/* Timestamp Placed Here */}
                                        <span className="text-[10px] text-slate-400 font-medium ml-auto">{lead.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-sm">No leads match your filters.</p>
                        <button onClick={clearFilters} className="text-primary text-xs font-bold mt-2">Clear all filters</button>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isAddLeadOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl overflow-y-auto max-h-[85vh]"
                >
                    <button 
                        onClick={() => setIsAddLeadOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Add New Lead</h2>

                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={newLead.name}
                                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                                    placeholder="Enter lead name"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="tel" 
                                    value={newLead.phone}
                                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                                    placeholder="e.g. +62 812..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Source Selection (Specific Accounts) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Source</label>
                            <div className="flex flex-wrap gap-2">
                                {ACCOUNTS.map(acc => {
                                    const Icon = acc.icon;
                                    return (
                                        <button
                                            key={acc.id}
                                            onClick={() => setNewLead({...newLead, source: acc.id})}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-medium border transition-all flex items-center gap-1.5 ${
                                                newLead.source === acc.id
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            <Icon size={12} /> {acc.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Property Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Interested Property</label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select 
                                    value={newLead.property}
                                    onChange={(e) => setNewLead({...newLead, property: e.target.value})}
                                    className="w-full pl-10 pr-8 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 appearance-none"
                                >
                                    <option value="">Select a property...</option>
                                    {PROPERTIES.map(prop => (
                                        <option key={prop.id} value={prop.id}>{prop.name} - {prop.location}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Note / Message */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Note / Message</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                                <textarea 
                                    value={newLead.message}
                                    onChange={(e) => setNewLead({...newLead, message: e.target.value})}
                                    placeholder="Enter initial inquiry or details..."
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleAddLead}
                            disabled={!newLead.name}
                            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 mt-4 transition-all ${
                                !newLead.name 
                                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                                    : 'bg-primary hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98]'
                            }`}
                        >
                            Save Lead
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Modal */}
      <AnimatePresence>
        {isSearchOpen && (
            <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex flex-col"
            >
                {/* Modal Header */}
                <div className="bg-white dark:bg-slate-900 px-6 pt-12 pb-4 shadow-sm z-10 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                            <input 
                                type="text" 
                                autoFocus
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                                placeholder="Search by name or message..." 
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                            />
                            {tempSearch && (
                                <button onClick={() => setTempSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={() => setIsSearchOpen(false)}
                            className="text-sm font-semibold text-slate-500 dark:text-slate-400"
                        >
                            Cancel
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Filters</h2>
                        <button onClick={clearFilters} className="text-xs text-slate-500 font-medium hover:text-primary">Reset</button>
                    </div>
                </div>

                {/* Filter Options Scrollable Area */}
                <div className="flex-1 overflow-y-auto pt-2">
                    
                    {/* Date Filter */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Date Added</p>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {FILTER_OPTIONS.dates.map((date) => (
                                <button
                                    key={date}
                                    onClick={() => setTempFilters({...tempFilters, date})}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                                        tempFilters.date === date
                                            ? 'bg-blue-600 text-white shadow-md border-transparent'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Channel Filter */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Channel</p>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {FILTER_OPTIONS.channels.map((channel) => (
                                <button
                                    key={channel}
                                    onClick={() => setTempFilters({...tempFilters, channel})}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                                        tempFilters.channel === channel
                                            ? 'bg-blue-600 text-white shadow-md border-transparent'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {channel}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stage Filter */}
                    <div className="px-6 py-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Stage</p>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {FILTER_OPTIONS.stages.map((stage) => (
                                <button
                                    key={stage}
                                    onClick={() => setTempFilters({...tempFilters, stage})}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                                        tempFilters.stage === stage
                                            ? 'bg-blue-600 text-white shadow-md border-transparent'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={applyFilters}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-transform"
                    >
                        Show Results
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddLeadOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-orange-300 dark:shadow-none flex items-center justify-center hover:bg-orange-600 transition-colors z-30"
      >
          <Plus size={24} />
      </button>
    </div>
  );
};

export default LeadsPage;