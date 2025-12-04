import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { MapPin, Home, Bed, Bath, Car, Filter, Plus, X, ChevronLeft, ChevronRight, ChevronDown, Share2, MessageCircle, Play, Upload, Image as ImageIcon, Video, Trash2, Save, Search, Zap, AlertCircle } from 'lucide-react';
import { Property } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
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
  
  // Plan and listings management
  const [planListingsLimit, setPlanListingsLimit] = useState(50); // Based on Pro plan
  const [isPurchaseListingsOpen, setIsPurchaseListingsOpen] = useState(false);
  const [listingsToAdd, setListingsToAdd] = useState<number>(10);
  const [userTokenBalance, setUserTokenBalance] = useState(120); // Mock token balance

  const [newProperty, setNewProperty] = useState({
    name: '',
    price: '',
    address: '',
    description: '',
    specs: {
      lt: '',
      lb: '',
      rooms: '',
      toilets: ''
    }
  });

  const properties: Property[] = [
    { 
        id: '1', 
        name: 'Kitsune Grove', 
        image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        images: [
            'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        price: 'Rp 2,4 bio', 
        address: 'Jl. Sakura No. 88, Kelapa Gading',
        description: 'A serene sanctuary in the heart of Kelapa Gading. Featuring Japanese-inspired minimalist architecture, this home offers a perfect blend of tranquility and modern living. Close to international schools and malls.',
        specs: { lt: 232, lb: 145, rooms: 4, toilets: 3 }
    },
    { 
        id: '2', 
        name: 'Asahi Hills', 
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        price: 'Rp 3,1 bio', 
        address: 'Cluster Asahi, BSD City',
        description: 'Modern hill-top living with breathtaking city views. Asahi Hills provides spacious layouts designed for growing families, complete with smart home features and a private clubhouse.',
        specs: { lt: 180, lb: 200, rooms: 5, toilets: 4 }
    },
    { 
        id: '3', 
        name: 'Sapporo Residence', 
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfe1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        price: 'Rp 1,8 bio', 
        address: 'Jl. Merdeka, Bandung',
        description: 'Heritage meets modernity. Located in a prime Bandung area, Sapporo Residence retains colonial charm with fully upgraded interiors. High ceilings and large windows ensure natural light all day.',
        specs: { lt: 120, lb: 90, rooms: 3, toilets: 2 }
    },
    { 
        id: '4', 
        name: 'Kyoto Village', 
        image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        images: [
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        price: 'Rp 1,2 bio', 
        address: 'Kota Wisata, Cibubur',
        description: 'Compact and cozy, perfect for first-time homebuyers. Kyoto Village offers a secure, gated community environment with lush parks and jogging tracks.',
        specs: { lt: 90, lb: 72, rooms: 2, toilets: 1 }
    },
    { 
        id: '5', 
        name: 'Ginza Tower', 
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512918760532-4937a7d2ea53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        price: 'Rp 5,5 bio', 
        address: 'Menteng, Jakarta Pusat',
        description: 'Exclusive high-rise living in the city center. Private lift access, premium finishes, and world-class amenities including a sky gym and infinity pool.',
        specs: { lt: 150, lb: 150, rooms: 3, toilets: 3 }
    }
  ];

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProperty?.images) {
        setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedProperty?.images) {
        setCurrentImageIndex((prev) => (prev - 1 + selectedProperty.images!.length) % selectedProperty.images!.length);
    }
  };

  // Helpers for search & filters
  const parsePriceValue = (price: string) => {
    const match = price.match(/([\d.,]+)/);
    if (!match) return 0;
    const normalized = match[1].replace(/[^\d]/g, '');
    return Number(normalized || '0'); // e.g. '24' for 2,4 bio
  };

  const getPriceBand = (price: string) => {
    const value = parsePriceValue(price);
    if (value === 0) return 'Any price';
    if (value < 20) return 'Below 2B';
    if (value <= 30) return '2B - 3B';
    return 'Above 3B';
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
    return properties.filter((property) => {
      // Text search
      const matchesSearch =
        !query ||
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        (property.description || '').toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Custom price range filter
      if (activeFilters.priceMin || activeFilters.priceMax) {
        const propertyPrice = parsePriceValue(property.price);
        const minPrice = activeFilters.priceMin ? parsePriceValue(activeFilters.priceMin) : 0;
        const maxPrice = activeFilters.priceMax ? parsePriceValue(activeFilters.priceMax) : Infinity;
        if (propertyPrice < minPrice || propertyPrice > maxPrice) return false;
      }

      // Land size filter
      if (activeFilters.size !== 'Any size') {
        const band = getSizeBand(property.specs.lt);
        if (band !== activeFilters.size) return false;
      }

      // Build size filter
      if (activeFilters.buildSize !== 'Any size') {
        const band = getBuildSizeBand(property.specs.lb);
        if (band !== activeFilters.buildSize) return false;
      }

      // Location filter
      if (activeFilters.location !== 'All areas') {
        const band = getLocationBand(property.address);
        if (band !== activeFilters.location) return false;
      }

      // Bedrooms filter
      if (activeFilters.bedrooms !== 'Any') {
        const rooms = property.specs.rooms;
        if (activeFilters.bedrooms === '5+') {
          if (rooms < 5) return false;
        } else {
          if (rooms !== Number(activeFilters.bedrooms)) return false;
        }
      }

      // Bathrooms filter
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
  }, [properties, searchQuery, activeFilters]);

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
    !!activeFilters.priceMin ||
    !!activeFilters.priceMax ||
    activeFilters.size !== 'Any size' ||
    activeFilters.buildSize !== 'Any size' ||
    activeFilters.location !== 'All areas' ||
    activeFilters.bedrooms !== 'Any' ||
    activeFilters.bathrooms !== 'Any';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedImages(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedVideos(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProperty = () => {
    // Validate required fields
    if (!newProperty.name || !newProperty.price || !newProperty.address || uploadedImages.length === 0) {
      alert('Please fill in all required fields and upload at least one image');
      return;
    }

    // Create new property object
    const propertyToAdd: Property = {
      id: Date.now().toString(),
      name: newProperty.name,
      image: uploadedImages[0],
      images: uploadedImages,
      price: newProperty.price,
      address: newProperty.address,
      description: newProperty.description,
      specs: {
        lt: Number(newProperty.specs.lt),
        lb: Number(newProperty.specs.lb),
        rooms: Number(newProperty.specs.rooms),
        toilets: Number(newProperty.specs.toilets)
      }
    };

    // Add to properties list (in a real app, this would be an API call)
    // For now, we'll just close the modal and reset the form
    console.log('New property:', propertyToAdd);
    
    // Reset form
    setNewProperty({
      name: '',
      price: '',
      address: '',
      description: '',
      specs: {
        lt: '',
        lb: '',
        rooms: '',
        toilets: ''
      }
    });
    setUploadedImages([]);
    setUploadedVideos([]);
    setIsAddPropertyOpen(false);
  };

  const resetForm = () => {
    setNewProperty({
      name: '',
      price: '',
      address: '',
      description: '',
      specs: {
        lt: '',
        lb: '',
        rooms: '',
        toilets: ''
      }
    });
    setUploadedImages([]);
    setUploadedVideos([]);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />
      
      <div className="px-6 py-2 mb-2 flex items-center justify-between">
         <div>
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Properties</h1>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your active listings</p>
         </div>
         {/* Listings Count & Add Button - Right Side */}
         <div className="flex items-center gap-3">
            <div className="text-right">
               <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{properties.length}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ {planListingsLimit}</span>
                  {properties.length >= planListingsLimit && (
                     <AlertCircle size={14} className="text-red-500" />
                  )}
               </div>
               <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">listings</p>
            </div>
            <button
               onClick={() => {
                 const maxListings = Math.min(100, userTokenBalance * 10);
                 setListingsToAdd(Math.min(10, maxListings));
                 setIsPurchaseListingsOpen(true);
               }}
               className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-colors"
               title="Add more listings"
            >
               <Zap size={18} />
            </button>
         </div>
      </div>

      {/* Filters */}
      <div className="px-4 pt-2 pb-3 sticky top-[88px] z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm space-y-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-medium whitespace-nowrap shadow-md">
                  <Filter size={14} /> All Listings
              </button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium whitespace-nowrap">
                  Primary
              </button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium whitespace-nowrap">
                  Secondary
              </button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium whitespace-nowrap">
                  Rent
              </button>
          </div>

          {/* Search trigger similar to Leads page */}
          <div>
            <div 
              onClick={openSearch}
              className="relative cursor-pointer group"
            >
              <div className="absolute left-4 top-3.5 text-slate-400 group-hover:text-primary transition-colors">
                <Search size={20} />
              </div>
              <div className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 shadow-sm flex items-center justify-between">
                <span>{searchQuery || 'Search properties by title, location, price...'}</span>
                {hasActiveFilters && (
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                )}
              </div>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex gap-2 flex-wrap mt-2">
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
          </div>
      </div>

      <div className="p-4 space-y-5">
          {filteredProperties.map((property) => (
              <Card 
                key={property.id} 
                noPadding 
                className="overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-300"
                onClick={() => handlePropertyClick(property)}
              >
                  <div className="h-48 overflow-hidden relative">
                      <img 
                        src={property.image} 
                        alt={property.name} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                          {property.price}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                          <h3 className="text-white font-bold text-lg">{property.name}</h3>
                          <p className="text-slate-200 text-xs flex items-center gap-1">
                              <MapPin size={12} /> {property.address}
                          </p>
                      </div>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <div className="flex flex-col items-center">
                          <Home size={18} className="mb-1 text-slate-400 dark:text-slate-500" />
                          <span className="text-xs font-medium">{property.specs.lt}m²</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Land</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex flex-col items-center">
                          <div className="border border-slate-300 dark:border-slate-600 rounded-sm w-4 h-4 mb-1.5 opacity-60"></div>
                          <span className="text-xs font-medium">{property.specs.lb}m²</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Build</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex flex-col items-center">
                          <Bed size={18} className="mb-1 text-slate-400 dark:text-slate-500" />
                          <span className="text-xs font-medium">{property.specs.rooms}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Beds</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex flex-col items-center">
                          <Bath size={18} className="mb-1 text-slate-400 dark:text-slate-500" />
                          <span className="text-xs font-medium">{property.specs.toilets}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Baths</span>
                      </div>
                  </div>
              </Card>
          ))}
      </div>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
            <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
            >
                {/* Image Gallery Hero */}
                <div className="relative h-72 bg-black">
                    <img 
                        src={selectedProperty.images?.[currentImageIndex] || selectedProperty.image} 
                        className="w-full h-full object-cover"
                        alt="Detail"
                    />
                    
                    {/* Top Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                        <button 
                            onClick={() => setSelectedProperty(null)}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Image Navigation */}
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50">
                        <ChevronRight size={20} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                        {currentImageIndex + 1} / {selectedProperty.images?.length || 1}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 -mt-6 rounded-t-3xl relative z-10 p-6 pb-32">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{selectedProperty.name}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <MapPin size={14} /> {selectedProperty.address}
                            </p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xl font-bold text-primary">{selectedProperty.price}</h3>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-4 gap-2 my-6">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Home size={20} className="text-slate-400 mb-1" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedProperty.specs.lt}</span>
                            <span className="text-[10px] text-slate-400">Land</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="w-5 h-5 border border-slate-400 rounded-sm mb-1 opacity-70"></div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedProperty.specs.lb}</span>
                            <span className="text-[10px] text-slate-400">Build</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Bed size={20} className="text-slate-400 mb-1" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedProperty.specs.rooms}</span>
                            <span className="text-[10px] text-slate-400">Beds</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Bath size={20} className="text-slate-400 mb-1" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedProperty.specs.toilets}</span>
                            <span className="text-[10px] text-slate-400">Baths</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Description</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {selectedProperty.description || 'No description available for this property.'}
                        </p>
                    </div>

                    {/* Gallery Thumbnails */}
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-3">Gallery</h3>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {selectedProperty.images?.map((img, i) => (
                                <img 
                                    key={i}
                                    src={img}
                                    className={`w-24 h-24 rounded-xl object-cover cursor-pointer border-2 ${currentImageIndex === i ? 'border-primary' : 'border-transparent'}`}
                                    onClick={() => setCurrentImageIndex(i)}
                                    alt="Thumb"
                                />
                            ))}
                            <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                                <Play size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-2">
                        <MessageCircle size={18} /> Contact Owner
                    </button>
                    <button 
                        onClick={() => navigate('/create-content')}
                        className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
                    >
                        Create Content
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

       <button 
        onClick={() => setIsAddPropertyOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-orange-300 dark:shadow-none flex items-center justify-center hover:bg-orange-600 transition-colors z-30"
      >
          <Plus size={24} />
      </button>

      {/* Add Property Modal */}
      <AnimatePresence>
        {isAddPropertyOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsAddPropertyOpen(false);
                    resetForm();
                  }}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add New Property</h2>
              </div>
              <button
                onClick={() => {
                  setIsAddPropertyOpen(false);
                  resetForm();
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Property Name *</label>
                    <input
                      type="text"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                      placeholder="e.g., Kitsune Grove"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Price *</label>
                    <input
                      type="text"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                      placeholder="e.g., Rp 2,4 bio"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                        placeholder="e.g., Jl. Sakura No. 88, Kelapa Gading"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Description</label>
                    <textarea
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                      placeholder="Describe the property features, location advantages, etc."
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Specifications */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Land Area (m²)</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        value={newProperty.specs.lt}
                        onChange={(e) => setNewProperty({
                          ...newProperty,
                          specs: {...newProperty.specs, lt: e.target.value}
                        })}
                        placeholder="232"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Build Area (m²)</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        value={newProperty.specs.lb}
                        onChange={(e) => setNewProperty({
                          ...newProperty,
                          specs: {...newProperty.specs, lb: e.target.value}
                        })}
                        placeholder="145"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Bedrooms</label>
                    <div className="relative">
                      <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        value={newProperty.specs.rooms}
                        onChange={(e) => setNewProperty({
                          ...newProperty,
                          specs: {...newProperty.specs, rooms: e.target.value}
                        })}
                        placeholder="4"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Bathrooms</label>
                    <div className="relative">
                      <Bath className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        value={newProperty.specs.toilets}
                        onChange={(e) => setNewProperty({
                          ...newProperty,
                          specs: {...newProperty.specs, toilets: e.target.value}
                        })}
                        placeholder="3"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Photos *</h3>
                <div className="space-y-3">
                  {/* Upload Button */}
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Upload size={24} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tap to upload photos</span>
                      <span className="text-xs text-slate-400">PNG, JPG up to 10MB</span>
                    </div>
                  </label>

                  {/* Uploaded Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Video Upload Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Videos</h3>
                <div className="space-y-3">
                  {/* Upload Button */}
                  <label className="block">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <div className="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Video size={24} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tap to upload videos</span>
                      <span className="text-xs text-slate-400">MP4, MOV up to 100MB</span>
                    </div>
                  </label>

                  {/* Uploaded Videos Grid */}
                  {uploadedVideos.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedVideos.map((video, index) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 group">
                          <video src={video} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeVideo(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play size={32} className="text-white opacity-80" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-3 sticky bottom-0">
              <button
                onClick={() => {
                  setIsAddPropertyOpen(false);
                  resetForm();
                }}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProperty}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Property
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Modal for Properties */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[65] bg-slate-50 dark:bg-slate-950 flex flex-col"
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
                    placeholder="Search by title, location, or description..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                  />
                  {tempSearch && (
                    <button
                      onClick={() => setTempSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
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
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-500 font-medium hover:text-primary"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Filter Options Scrollable Area */}
            <div className="flex-1 overflow-y-auto pt-2">
              {/* Custom Price Range Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
                  Price Range (in billions)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Min Price</label>
                    <input
                      type="text"
                      value={tempFilters.priceMin}
                      onChange={(e) => setTempFilters({ ...tempFilters, priceMin: e.target.value })}
                      placeholder="e.g., Rp 2 bio"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Max Price</label>
                    <input
                      type="text"
                      value={tempFilters.priceMax}
                      onChange={(e) => setTempFilters({ ...tempFilters, priceMax: e.target.value })}
                      placeholder="e.g., Rp 5 bio"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Land Size Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
                  Land Size
                </p>
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
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
                  Build Size
                </p>
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
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
                  Bedrooms
                </p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.bedrooms.map((bedroom) => (
                    <button
                      key={bedroom}
                      onClick={() => setTempFilters({ ...tempFilters, bedrooms: bedroom })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.bedrooms === bedroom
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {bedroom === 'Any' ? 'Any' : bedroom === '5+' ? '5+ Bedrooms' : `${bedroom} ${bedroom === '1' ? 'Bedroom' : 'Bedrooms'}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
                  Bathrooms
                </p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTER_OPTIONS.bathrooms.map((bathroom) => (
                    <button
                      key={bathroom}
                      onClick={() => setTempFilters({ ...tempFilters, bathrooms: bathroom })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        tempFilters.bathrooms === bathroom
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {bathroom === 'Any' ? 'Any' : bathroom === '4+' ? '4+ Bathrooms' : `${bathroom} ${bathroom === '1' ? 'Bathroom' : 'Bathrooms'}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="px-6 py-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
                  Location
                </p>
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

      {/* Purchase More Listings Modal */}
      <AnimatePresence>
        {isPurchaseListingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPurchaseListingsOpen(false)}
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
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add More Listings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Spend tokens to increase your listings limit</p>
                </div>
                <button 
                  onClick={() => setIsPurchaseListingsOpen(false)}
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
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Listings:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{properties.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Plan Limit:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{planListingsLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Token Balance:</span>
                    <div className="flex items-center gap-1">
                      <Zap size={14} className="text-primary" />
                      <span className="text-sm font-bold text-primary">{userTokenBalance}</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Rate Info */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      1 Token = 10 Additional Listings
                    </p>
                  </div>
                </div>

                {/* Listings Input Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Number of Listings to Add
                  </label>
                  <div className="relative">
                    <select
                      value={listingsToAdd}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setListingsToAdd(value);
                      }}
                      className="w-full px-4 py-3 pr-10 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-lg font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer"
                    >
                      {(() => {
                        const maxListings = Math.min(100, userTokenBalance * 10);
                        const options = [];
                        for (let i = 10; i <= maxListings; i += 10) {
                          options.push(
                            <option key={i} value={i}>
                              {i} listings
                            </option>
                          );
                        }
                        return options;
                      })()}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    You can add up to {Math.min(100, userTokenBalance * 10)} listings ({Math.min(10, userTokenBalance)} {Math.min(10, userTokenBalance) === 1 ? 'token' : 'tokens'})
                  </p>
                </div>

                {/* Calculation Preview */}
                {listingsToAdd > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Listings to add:</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">+{listingsToAdd}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tokens to spend:</span>
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-primary" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{listingsToAdd / 10}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">New Total Limit:</span>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {planListingsLimit + listingsToAdd}
                      </span>
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <button
                  onClick={() => {
                    const tokensRequired = listingsToAdd / 10;
                    if (listingsToAdd > 0 && tokensRequired <= userTokenBalance && listingsToAdd <= 100) {
                      // In a real app, this would make an API call
                      const newLimit = planListingsLimit + listingsToAdd;
                      setPlanListingsLimit(newLimit);
                      setUserTokenBalance(prev => prev - tokensRequired);
                      alert(`Successfully added ${listingsToAdd} listings! Your new limit is ${newLimit}.`);
                      setIsPurchaseListingsOpen(false);
                      setListingsToAdd(10);
                    }
                  }}
                  disabled={listingsToAdd <= 0 || (listingsToAdd / 10) > userTokenBalance || listingsToAdd > 100}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    listingsToAdd <= 0 || (listingsToAdd / 10) > userTokenBalance || listingsToAdd > 100
                      ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                      : 'bg-primary shadow-lg shadow-primary/30 active:scale-95'
                  }`}
                >
                  Purchase {listingsToAdd / 10} {listingsToAdd / 10 === 1 ? 'Token' : 'Tokens'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListingsPage;