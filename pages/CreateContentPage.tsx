import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { 
  LayoutTemplate, 
  Instagram, 
  Facebook, 
  Video, 
  Image as ImageIcon, 
  ChevronRight, 
  Check, 
  Wand2, 
  Download, 
  ExternalLink, 
  ChevronLeft, 
  Smartphone, 
  Layers, 
  Send, 
  X, 
  Grid, 
  Film, 
  Armchair, 
  Move3d, 
  Sunset, 
  Eraser, 
  Sparkles, 
  Zap,
  Search,
  MapPin,
  Home,
  Bed,
  Bath,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '../types';

// Extended type for local mock data
interface ExtendedProperty extends Property {
  images: string[];
}

// Mock Data
const FORMATS = [
  { id: 'ig-post', label: 'Instagram Post', icon: Instagram, aspect: 'aspect-square', size: '1080 x 1080 px' },
  { id: 'ig-story', label: 'Instagram Story', icon: Smartphone, aspect: 'aspect-[9/16]', size: '1080 x 1920 px' },
  { id: 'fb-post', label: 'Facebook Post', icon: Facebook, aspect: 'aspect-[4/3]', size: '1200 x 630 px' },
  { id: 'reel', label: 'Reel / TikTok', icon: Video, aspect: 'aspect-[9/16]', size: '1080 x 1920 px' },
];

const AI_TOOLS = [
  { id: 'ai-video', name: 'Image to Video', desc: 'Animate static photos', cost: 5, icon: Film, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
  { id: 'ai-staging', name: 'AI Staging', desc: 'Furnish empty rooms', cost: 3, icon: Armchair, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { id: 'ai-tour', name: 'Virtual Tour', desc: 'Create 3D walkthroughs', cost: 4, icon: Move3d, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  { id: 'ai-dusk', name: 'Day to Dusk', desc: 'Enhance exterior lighting', cost: 2, icon: Sunset, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  { id: 'ai-eraser', name: 'Magic Declutter', desc: 'Remove unwanted items', cost: 1, icon: Eraser, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800' },
];

const TEMPLATES = [
  { id: 't1', name: 'Just Listed Modern', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', style: 'Modern' },
  { id: 't2', name: 'Open House Gold', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', style: 'Luxury' },
  { id: 't3', name: 'Price Drop Alert', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', style: 'Urgent' },
  { id: 't4', name: 'Minimal Feature', image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', style: 'Minimal' },
];

// Synced with ListingsPage - All properties
const PROPERTIES: ExtendedProperty[] = [
    { 
        id: '1', 
        name: 'Kitsune Grove', 
        image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        price: 'Rp 2,4 bio', 
        address: 'Jl. Sakura No. 88, Kelapa Gading',
        description: 'A serene sanctuary in the heart of Kelapa Gading.',
        specs: { lt: 232, lb: 145, rooms: 4, toilets: 3 },
        images: [
            'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: '2', 
        name: 'Asahi Hills', 
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        price: 'Rp 3,1 bio', 
        address: 'Cluster Asahi, BSD City',
        description: 'Modern hill-top living with breathtaking city views.',
        specs: { lt: 180, lb: 200, rooms: 5, toilets: 4 },
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: '3', 
        name: 'Sapporo Residence', 
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        price: 'Rp 1,8 bio', 
        address: 'Jl. Merdeka, Bandung',
        description: 'Heritage meets modernity in a prime Bandung area.',
        specs: { lt: 120, lb: 90, rooms: 3, toilets: 2 },
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfe1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: '4', 
        name: 'Kyoto Village', 
        image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        price: 'Rp 1,2 bio', 
        address: 'Kota Wisata, Cibubur',
        description: 'Compact and cozy, perfect for first-time homebuyers.',
        specs: { lt: 90, lb: 72, rooms: 2, toilets: 1 },
        images: [
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: '5', 
        name: 'Ginza Tower', 
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        price: 'Rp 5,5 bio', 
        address: 'Menteng, Jakarta Pusat',
        description: 'Exclusive high-rise living in the city center.',
        specs: { lt: 150, lb: 150, rooms: 3, toilets: 3 },
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512918760532-4937a7d2ea53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
    }
];

const ACCOUNTS = [
  { id: 'ig1', label: '@luxuryliving', icon: Instagram, platform: 'Instagram' },
  { id: 'ig2', label: '@cityhomes', icon: Instagram, platform: 'Instagram' },
  { id: 'tiktok1', label: '@re_trends', icon: Video, platform: 'TikTok' },
  { id: 'fb1', label: 'Global Connect', icon: Facebook, platform: 'Facebook' },
];

const CreateContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<Record<string, string>>({}); // Format per platform
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<ExtendedProperty | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Search & Filter States (Step 1)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priceMin: '',
    priceMax: '',
    size: 'Any size',
    buildSize: 'Any size',
    location: 'All areas',
    bedrooms: 'Any',
    bathrooms: 'Any',
  });
  const [tempSearch, setTempSearch] = useState('');
  const [tempFilters, setTempFilters] = useState(activeFilters);
  
  // Modal States
  const [tempSelectedProperty, setTempSelectedProperty] = useState<ExtendedProperty | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Loading & Post States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // Caption & Description States (per platform)
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  // Search & Filter Helpers (similar to ListingsPage)
  const parsePriceValue = (price: string) => {
    const match = price.match(/([\d.,]+)/);
    if (!match) return 0;
    const normalized = match[1].replace(/[^\d]/g, '');
    return Number(normalized || '0');
  };

  const getSizeBand = (lt: number) => {
    if (lt === 0) return 'Any size';
    if (lt < 120) return 'Small (<120 m²)';
    if (lt <= 200) return 'Medium (120-200 m²)';
    return 'Large (>200 m²)';
  };

  const getBuildSizeBand = (lb: number) => {
    if (lb === 0) return 'Any size';
    if (lb < 100) return 'Small (<100 m²)';
    if (lb <= 150) return 'Medium (100-150 m²)';
    return 'Large (>150 m²)';
  };

  const getLocationBand = (address: string) => {
    const lower = address.toLowerCase();
    if (lower.includes('jakarta')) return 'Jakarta';
    if (lower.includes('bsd')) return 'BSD City';
    if (lower.includes('bandung')) return 'Bandung';
    if (lower.includes('cibubur')) return 'Cibubur';
    return 'Other areas';
  };

  const FILTER_OPTIONS = {
    sizes: ['Any size', 'Small (<120 m²)', 'Medium (120-200 m²)', 'Large (>200 m²)'],
    buildSizes: ['Any size', 'Small (<100 m²)', 'Medium (100-150 m²)', 'Large (>150 m²)'],
    locations: ['All areas', 'Jakarta', 'BSD City', 'Bandung', 'Cibubur', 'Other areas'],
    bedrooms: ['Any', '1', '2', '3', '4', '5+'],
    bathrooms: ['Any', '1', '2', '3', '4+'],
  };

  const filteredProperties = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return PROPERTIES.filter((property) => {
      const matchesSearch =
        !query ||
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        (property.description || '').toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (activeFilters.priceMin || activeFilters.priceMax) {
        const propertyPrice = parsePriceValue(property.price);
        const minPrice = activeFilters.priceMin ? parsePriceValue(activeFilters.priceMin) : 0;
        const maxPrice = activeFilters.priceMax ? parsePriceValue(activeFilters.priceMax) : Infinity;
        if (propertyPrice < minPrice || propertyPrice > maxPrice) return false;
      }

      if (activeFilters.size !== 'Any size') {
        const band = getSizeBand(property.specs.lt);
        if (band !== activeFilters.size) return false;
      }

      if (activeFilters.buildSize !== 'Any size') {
        const band = getBuildSizeBand(property.specs.lb);
        if (band !== activeFilters.buildSize) return false;
      }

      if (activeFilters.location !== 'All areas') {
        const band = getLocationBand(property.address);
        if (band !== activeFilters.location) return false;
      }

      if (activeFilters.bedrooms !== 'Any') {
        const rooms = property.specs.rooms;
        if (activeFilters.bedrooms === '5+') {
          if (rooms < 5) return false;
        } else {
          if (rooms !== Number(activeFilters.bedrooms)) return false;
        }
      }

      if (activeFilters.bathrooms !== 'Any') {
        const toilets = property.specs.toilets;
        if (activeFilters.bathrooms === '4+') {
          if (toilets < 4) return false;
        } else {
          if (toilets !== Number(activeFilters.bathrooms)) return false;
        }
      }

      return true;
    });
  }, [searchQuery, activeFilters]);

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
    const resetFilters = {
      priceMin: '',
      priceMax: '',
      size: 'Any size',
      buildSize: 'Any size',
      location: 'All areas',
      bedrooms: 'Any',
      bathrooms: 'Any',
    };
    setTempSearch('');
    setTempFilters(resetFilters);
    setSearchQuery('');
    setActiveFilters(resetFilters);
  };

  const hasActiveFilters =
    !!searchQuery ||
    activeFilters.priceMin ||
    activeFilters.priceMax ||
    activeFilters.size !== 'Any size' ||
    activeFilters.buildSize !== 'Any size' ||
    activeFilters.location !== 'All areas' ||
    activeFilters.bedrooms !== 'Any' ||
    activeFilters.bathrooms !== 'Any';

  const handleNext = () => {
    if (step === 2) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(3);
      }, 1500);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleAccount = (id: string) => {
    if (selectedAccounts.includes(id)) {
      setSelectedAccounts(selectedAccounts.filter(a => a !== id));
    } else {
      setSelectedAccounts([...selectedAccounts, id]);
    }
  };

  // Group accounts by platform
  const accountsByPlatform = useMemo(() => {
    const grouped: Record<string, Array<typeof ACCOUNTS[0]>> = {};
    ACCOUNTS.forEach(acc => {
      if (!grouped[acc.platform]) {
        grouped[acc.platform] = [];
      }
      grouped[acc.platform].push(acc);
    });
    return grouped;
  }, []);

  // Get formats available for each platform
  const getFormatsForPlatform = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return FORMATS.filter(f => ['ig-post', 'ig-story', 'reel'].includes(f.id));
      case 'TikTok':
        return FORMATS.filter(f => f.id === 'reel');
      case 'Facebook':
        return FORMATS.filter(f => f.id === 'fb-post');
      default:
        return [];
    }
  };

  // Get selected accounts for a platform
  const getSelectedAccountsForPlatform = (platform: string) => {
    return ACCOUNTS.filter(acc => acc.platform === platform && selectedAccounts.includes(acc.id));
  };

  // Check if platform has any selected accounts
  const hasSelectedAccountsForPlatform = (platform: string) => {
    return getSelectedAccountsForPlatform(platform).length > 0;
  };

  // Get total selected accounts count
  const totalSelectedAccounts = selectedAccounts.length;

  const handlePost = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      navigate('/social');
    }, 2000);
  };

  const handlePropertyClick = (property: ExtendedProperty) => {
    setTempSelectedProperty(property);
    setShowImageModal(true);
  };

  const confirmImageSelection = (image: string) => {
    if (tempSelectedProperty) {
      setSelectedProperty(tempSelectedProperty);
      setSelectedImage(image);
      setShowImageModal(false);
    }
  };

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  // Helper to determine if selected item is an AI tool
  const isAiSelected = AI_TOOLS.some(t => t.id === selectedTemplate);
  const selectedAiTool = AI_TOOLS.find(t => t.id === selectedTemplate);

  // Generate suggested caption and description
  const generateSuggestedCaption = (platform: string, format: string) => {
    if (selectedProperty) {
      const formatType = format.includes('story') || format.includes('reel') ? 'story' : 'post';
      const emoji = platform === 'Instagram' ? '🏡' : platform === 'TikTok' ? '✨' : '🏠';
      
      if (formatType === 'story') {
        return `${emoji} ${selectedProperty.name}\n📍 ${selectedProperty.address}\n💰 ${selectedProperty.price}\n\n✨ Swipe up for details!`;
      } else {
        return `${emoji} ${selectedProperty.name}\n\n📍 ${selectedProperty.address}\n💰 ${selectedProperty.price}\n🏠 ${selectedProperty.specs.lt}m² land • ${selectedProperty.specs.lb}m² build\n🛏️ ${selectedProperty.specs.rooms} bed • 🚿 ${selectedProperty.specs.toilets} bath\n\n${selectedProperty.description || 'Beautiful property available now!'}\n\n#RealEstate #Property #${platform === 'Instagram' ? 'LuxuryLiving' : 'HomeForSale'}`;
      }
    } else if (isAiSelected) {
      return `✨ AI-generated content\n\nCheck out this amazing property transformation!\n\n#AI #RealEstate #Property`;
    } else {
      return `🏡 Beautiful property available now!\n\nContact us for more information.\n\n#RealEstate #Property`;
    }
  };

  const generateSuggestedDescription = (platform: string) => {
    if (selectedProperty) {
      return `${selectedProperty.name} is a stunning property located in ${selectedProperty.address}. This ${selectedProperty.specs.rooms}-bedroom, ${selectedProperty.specs.toilets}-bathroom home features ${selectedProperty.specs.lt}m² of land and ${selectedProperty.specs.lb}m² of building area. Priced at ${selectedProperty.price}, this property offers exceptional value in a prime location. ${selectedProperty.description || 'Don\'t miss this opportunity!'}`;
    } else if (isAiSelected) {
      return `This AI-enhanced content showcases the property in a unique and engaging way. Perfect for social media marketing!`;
    } else {
      return `Discover this amazing property opportunity. Contact us today for more details and to schedule a viewing.`;
    }
  };

  // Initialize caption and description when format is selected
  React.useEffect(() => {
    Object.entries(selectedFormat).forEach(([platform, formatId]: [string, string]) => {
      if (formatId) {
        setCaptions(prev => {
          // Only set if not already exists
          if (prev[platform]) return prev;
          return {
            ...prev,
            [platform]: generateSuggestedCaption(platform, formatId)
          };
        });
        setDescriptions(prev => {
          // Only set if not already exists
          if (prev[platform]) return prev;
          return {
            ...prev,
            [platform]: generateSuggestedDescription(platform)
          };
        });
      }
    });
  }, [selectedFormat, selectedProperty, isAiSelected]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />
      
      <div className="px-6 py-2 mb-2">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content Studio</h1>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
           Create property content for multiple social platforms.
         </p>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                step >= s 
                  ? 'bg-white dark:bg-slate-900 border-teal-400 text-teal-600 dark:text-teal-400' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              {step > s ? <Check size={14} /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          <span>Property</span>
          <span>Content</span>
          <span>Share</span>
        </div>
      </div>

      <div className="px-4 pb-52">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Property with Search */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 mb-32"
            >
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Choose Property Listing
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select a property and choose images/videos for your content.
              </p>

              {/* Search Box Trigger */}
              <div onClick={openSearch} className="relative cursor-pointer group">
                <div className="absolute left-4 top-3.5 text-slate-400 group-hover:text-primary transition-colors">
                  <Search size={20} />
                      </div>
                <div className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 shadow-sm flex items-center justify-between">
                  <span>{searchQuery || 'Search properties by title, location, price...'}</span>
                  {hasActiveFilters && <div className="w-2 h-2 rounded-full bg-primary"></div>}
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
                  {activeFilters.priceMin && (
                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary">
                      Price: {activeFilters.priceMin}
                    </span>
                  )}
                  {activeFilters.priceMax && (
                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary">
                      - {activeFilters.priceMax}
                    </span>
                  )}
                  {Object.entries(activeFilters).map(([key, value]) => {
                    if (
                      (key === 'priceMin' || key === 'priceMax') ||
                      (key === 'size' && value === 'Any size') ||
                      (key === 'buildSize' && value === 'Any size') ||
                      (key === 'location' && value === 'All areas') ||
                      (key === 'bedrooms' && value === 'Any') ||
                      (key === 'bathrooms' && value === 'Any')
                    ) {
                      return null;
                    }
                    return (
                      <span
                        key={key}
                        className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary capitalize"
                      >
                        {key === 'buildSize' ? `Build: ${value}` : value}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Properties List */}
              <div className="space-y-3">
                {filteredProperties.map((property) => (
                  <Card 
                    key={property.id} 
                    noPadding 
                    className={`flex gap-3 p-3 cursor-pointer border-2 transition-all ${
                      selectedProperty?.id === property.id 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' 
                        : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                     <div onClick={() => handlePropertyClick(property)} className="flex gap-3 w-full items-center">
                        <img src={property.image} alt={property.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 dark:text-slate-100">{property.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin size={12} /> {property.address}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs font-semibold text-primary">{property.price}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <div className="flex items-center gap-0.5">
                                <Home size={10} /> <span>{property.specs.lt}m²</span>
                              </div>
                              <div className="flex items-center gap-0.5">
                                <Bed size={10} /> <span>{property.specs.rooms}</span>
                              </div>
                              <div className="flex items-center gap-0.5">
                                <Bath size={10} /> <span>{property.specs.toilets}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {selectedProperty?.id === property.id && (
                            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                <Check size={14} />
                            </div>
                        )}
                     </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Template / AI Tool (CONTENT) */}
          {step === 2 && (

            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 mb-32"
            >
              <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">AI Magic Tools</h2>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      {AI_TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          const isSelected = selectedTemplate === tool.id;
                          return (
                              <button
                                key={tool.id}
                                onClick={() => setSelectedTemplate(tool.id)}
                                className={`flex-shrink-0 w-32 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center relative overflow-hidden ${
                                    isSelected ? `border-current ${tool.color} bg-white dark:bg-slate-800` : `border-transparent bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700`
                                }`}
                              >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tool.bg} ${tool.color}`}>
                                      <Icon size={20} />
                                  </div>
                                  <span className={`text-[10px] font-bold ${tool.color}`}>{tool.name}</span>
                                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                      <Zap size={8} className="fill-yellow-400 text-yellow-400" /> {tool.cost}
                                  </div>
                              </button>
                          );
                      })}
                  </div>
              </div>

              <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Standard Templates</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <div 
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer group border-2 transition-all ${
                          selectedTemplate === template.id ? 'border-purple-500' : 'border-transparent'
                        }`}
                      >
                        <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-white">{template.name}</span>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-md">
                            <Check size={14} />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                            {template.style}
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Choose Format + Accounts + Preview + Post */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 mb-32"
            >
              {Object.entries(accountsByPlatform).map(([platform, accounts]: [string, Array<typeof ACCOUNTS[0]>]) => {
                const platformFormats = getFormatsForPlatform(platform);
                const platformSelectedFormat = selectedFormat[platform];
                const selectedFormatObj = FORMATS.find(f => f.id === platformSelectedFormat);
                
                return (
                  <div key={platform} className="space-y-4">
                    {/* Platform Header */}
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 
                        platform === 'TikTok' ? 'bg-black' : 
                        'bg-blue-600'
                      }`}>
                        {platform === 'Instagram' ? <Instagram size={20} /> :
                         platform === 'TikTok' ? <Video size={20} /> :
                         <Facebook size={20} />}
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{platform}</h2>
                    </div>

                    {/* Account Selection */}
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        Select accounts to post to:
                      </p>
                      <div className="space-y-2">
                        {accounts.map(acc => (
                          <div 
                            key={acc.id}
                            onClick={() => toggleAccount(acc.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedAccounts.includes(acc.id) 
                                ? 'border-primary bg-primary/5' 
                                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 
                                platform === 'TikTok' ? 'bg-black' : 
                                'bg-blue-600'
                              }`}>
                                <acc.icon size={16} />
                              </div>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{acc.label}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAccounts.includes(acc.id) ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {selectedAccounts.includes(acc.id) && <Check size={12} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Format Selection - Only show if accounts are selected */}
                    {hasSelectedAccountsForPlatform(platform) && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                          Choose format for {platform}:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {platformFormats.map((format) => (
                            <Card 
                              key={format.id} 
                              noPadding 
                              className={`cursor-pointer transition-all duration-200 border-2 ${
                                platformSelectedFormat === format.id 
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' 
                                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                              }`}
                            >
                              <div 
                                onClick={() => setSelectedFormat({ ...selectedFormat, [platform]: format.id })}
                                className="p-3 flex flex-col items-center text-center h-full"
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                  platformSelectedFormat === format.id ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}>
                                  <format.icon size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{format.label}</h3>
                                <p className="text-[9px] text-slate-400 mt-0.5">{format.size}</p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview - Only show if format is selected */}
                    {platformSelectedFormat && selectedFormatObj && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                          Preview for {platform}:
                        </p>
                        <div className={`relative ${selectedFormatObj.aspect || 'aspect-square'} bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm group`}>
                 {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white z-10">
                        <Wand2 className="animate-spin mb-2" size={32} />
                        <span className="text-sm font-bold">Generating Magic...</span>
                    </div>
                 ) : (
                    <>
                        <img 
                            src={selectedImage || currentTemplate?.image || 'https://via.placeholder.com/400'} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <div className="bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg pointer-events-none">
                                Preview
                            </div>
                        </div>
                        
                        {/* Overlay Data Mockup */}
                              {!isAiSelected && selectedProperty && (
                                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg">
                                  <h3 className="font-bold text-slate-900 text-base">{selectedProperty.name}</h3>
                                  <p className="text-slate-600 text-[10px]">{selectedProperty.address}</p>
                                  <div className="mt-1.5 flex justify-between items-center">
                                    <span className="text-purple-600 font-bold text-sm">{selectedProperty.price}</span>
                                    <div className="flex gap-1.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {isAiSelected && (
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
                                  <Sparkles size={10} className="text-yellow-400" /> AI Generated
                            </div>
                        )}
                    </>
                 )}
              </div>

                        {/* Caption and Description Fields */}
                        <div className="mt-4 space-y-4">
                          {/* Caption */}
                          <div>
                            <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                              Caption
                            </label>
                            <textarea
                              value={captions[platform] || ''}
                              onChange={(e) => setCaptions(prev => ({ ...prev, [platform]: e.target.value }))}
                              placeholder="Enter your caption..."
                              rows={4}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />
                            <p className="text-xs text-slate-400 mt-1.5">
                              {(captions[platform] || '').length} characters
                            </p>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                              Description
                            </label>
                            <textarea
                              value={descriptions[platform] || ''}
                              onChange={(e) => setDescriptions(prev => ({ ...prev, [platform]: e.target.value }))}
                              placeholder="Enter your description..."
                              rows={3}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />
                            <p className="text-xs text-slate-400 mt-1.5">
                              {(descriptions[platform] || '').length} characters
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                 <button 
                  onClick={handlePost}
                  disabled={totalSelectedAccounts === 0 || Object.keys(selectedFormat).length === 0 || isPosting}
                  className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    totalSelectedAccounts === 0 || Object.keys(selectedFormat).length === 0 || isPosting
                      ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
                      : 'bg-primary text-white shadow-lg shadow-primary/30 active:scale-95'
                  }`}
                 >
                  <Send size={16} /> {isPosting ? 'Publishing...' : `Post to ${totalSelectedAccounts} Account${totalSelectedAccounts !== 1 ? 's' : ''}`}
                 </button>
                <button 
                  onClick={() => setShowDownloadModal(true)}
                  className="py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Download size={16} /> Download
                 </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center z-20 max-w-md mx-auto">
        <button 
          onClick={handleBack}
          disabled={step === 1}
          className={`p-3 rounded-full ${step === 1 ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <ChevronLeft size={24} />
        </button>

        {step < 3 ? (
            <button 
                onClick={handleNext}
                disabled={
                    (step === 1 && !selectedProperty) ||
                    (step === 2 && !selectedTemplate)
                }
                className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${
                    (step === 1 && !selectedProperty) || (step === 2 && !selectedTemplate)
                    ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                    : 'bg-primary shadow-lg shadow-primary/30 active:scale-95'
                }`}
            >
                {step === 2 ? 'Generate' : 'Next'} <ChevronRight size={18} />
            </button>
        ) : null}
      </div>

      {/* Image/Video Selection Modal */}
      <AnimatePresence>
        {showImageModal && tempSelectedProperty && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Select Image or Video</h3>
                        <button onClick={() => setShowImageModal(false)}><X size={20} className="text-slate-400" /></button>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                        {tempSelectedProperty.images?.map((img, i) => (
                            <div key={i} className="relative group">
                            <img 
                                src={img} 
                                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                                onClick={() => confirmImageSelection(img)}
                                alt={`choice-${i}`}
                            />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium flex items-center gap-1">
                                    <ImageIcon size={10} /> Image
                                </div>
                            </div>
                        ))}
                        {/* Mock video placeholders - in real app, these would come from property.videos */}
                        {[1, 2].map((i) => (
                            <div key={`video-${i}`} className="relative group">
                                <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                                    <Video size={32} className="text-slate-400" />
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium flex items-center gap-1">
                                    <Video size={10} /> Video
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                    placeholder="Search by title, location, price..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                  />
                  {tempSearch && (
                    <button onClick={() => setTempSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button onClick={() => setIsSearchOpen(false)} className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Cancel
                </button>
                </div>

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-slate-500 font-medium hover:text-primary">
                  Reset
                </button>
              </div>
            </div>

            {/* Filter Options Scrollable Area */}
            <div className="flex-1 overflow-y-auto pt-2">
              {/* Price Range */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Price Range</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tempFilters.priceMin}
                    onChange={(e) => setTempFilters({ ...tempFilters, priceMin: e.target.value })}
                    placeholder="Min (e.g., Rp 1,5 bio)"
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="text"
                    value={tempFilters.priceMax}
                    onChange={(e) => setTempFilters({ ...tempFilters, priceMax: e.target.value })}
                    placeholder="Max (e.g., Rp 3 bio)"
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Land Size Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Land Size</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setTempFilters({ ...tempFilters, size })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.size === size
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                                </div>
                            </div>

              {/* Build Size Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Build Size</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.buildSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setTempFilters({ ...tempFilters, buildSize: size })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.buildSize === size
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                            </div>
                        </div>

              {/* Bedrooms Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Bedrooms</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.bedrooms.map((bed) => (
                    <button
                      key={bed}
                      onClick={() => setTempFilters({ ...tempFilters, bedrooms: bed })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.bedrooms === bed
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
                </div>

              {/* Bathrooms Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Bathrooms</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.bathrooms.map((bath) => (
                <button 
                      key={bath}
                      onClick={() => setTempFilters({ ...tempFilters, bathrooms: bath })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.bathrooms === bath
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                      {bath}
                </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="px-6 py-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Location</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setTempFilters({ ...tempFilters, location: loc })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.location === loc
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {loc}
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

      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Download Content</h3>
                <button 
                  onClick={() => setShowDownloadModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Preview */}
              <div className="p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Preview:</p>
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm mb-6">
                  <img 
                    src={selectedImage || currentTemplate?.image || 'https://via.placeholder.com/400'} 
                    alt="Download Preview" 
                    className="w-full h-full object-cover" 
                  />
                  {!isAiSelected && selectedProperty && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg">
                      <h3 className="font-bold text-slate-900 text-base">{selectedProperty.name}</h3>
                      <p className="text-slate-600 text-[10px]">{selectedProperty.address}</p>
                      <div className="mt-1.5 flex justify-between items-center">
                        <span className="text-purple-600 font-bold text-sm">{selectedProperty.price}</span>
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {isAiSelected && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
                      <Sparkles size={10} className="text-yellow-400" /> AI Generated
                    </div>
                  )}
                </div>

                {/* Download Options */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Mock download as picture
                      const link = document.createElement('a');
                      link.href = selectedImage || currentTemplate?.image || 'https://via.placeholder.com/400';
                      link.download = `content-${Date.now()}.png`;
                      link.click();
                      setShowDownloadModal(false);
                    }}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                  >
                    <ImageIcon size={18} /> Download as Picture
                  </button>
                  <button
                    onClick={() => {
                      // Mock download as PDF
                      // In a real app, this would generate a PDF
                      alert('PDF download functionality would be implemented here. This would generate a PDF version of the content.');
                      setShowDownloadModal(false);
                    }}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                  >
                    <FileText size={18} /> Download as PDF
                  </button>
                </div>
              </div>
            </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateContentPage;