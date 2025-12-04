import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Camera, User, Mail, Phone, FileText, Save, Building, Globe, Instagram, Facebook, Video, Upload } from 'lucide-react';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShouldOpenSettings } = useApp();

  const handleBack = () => {
    // Check if we came from settings (via location state or context)
    const fromSettings = location.state?.fromSettings || false;
    if (fromSettings) {
      setShouldOpenSettings(true);
      navigate('/');
    } else {
      navigate(-1);
    }
  };
  const [formData, setFormData] = useState({
    // Personal Information
    name: 'Rachmat Widodo',
    email: 'rachmat.widodo@agentara.com',
    phone: '+62 812 3456 7890',
    bio: 'Senior Real Estate Broker specializing in luxury properties in South Jakarta.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // Agency Details
    agencyName: 'Luxury Properties Indonesia',
    agencyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    agencyWebsite: 'https://luxuryproperties.id',
    agencyInstagram: '@luxuryproperties_id',
    agencyFacebook: 'Luxury Properties Indonesia',
    agencyTikTok: '@luxuryproperties_id'
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
            {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 sticky top-0 z-40">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
          <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
      </div>

      <div className="p-6">
                {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img 
              src={formData.avatar} 
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 object-cover"
                        />
            <button className="absolute bottom-0 right-0 p-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-950 hover:bg-orange-600 transition-colors">
              <Camera size={16} className="text-white" />
            </button>
          </div>
          <button className="mt-4 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
            Change Profile Picture
          </button>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Personal Information</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Your individual profile details</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Full Name</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10">
                  <User size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text"
                                value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input 
                  type="email"
                                value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Phone Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <input 
                  type="tel"
                                value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Bio</label>
              <div className="relative flex items-start">
                <div className="absolute left-4 top-4 z-10">
                  <FileText size={18} className="text-slate-400" />
                </div>
                <textarea 
                                value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>

        {/* Agency Details Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Agency Details</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Your agency or company information</p>
          
          <div className="space-y-5">
            {/* Agency Logo */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Agency Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={formData.agencyLogo} 
                    alt="Agency Logo"
                    className="w-20 h-20 rounded-xl border-2 border-slate-200 dark:border-slate-800 object-cover"
                  />
                  <button className="absolute -bottom-1 -right-1 p-1.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-950 hover:bg-orange-600 transition-colors">
                    <Camera size={12} className="text-white" />
                  </button>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Upload size={16} /> Upload Logo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Agency Name</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10">
                  <Building size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Website</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10">
                  <Globe size={18} className="text-slate-400" />
                </div>
                <input 
                  type="url"
                  value={formData.agencyWebsite}
                  onChange={(e) => setFormData({...formData, agencyWebsite: e.target.value})}
                  placeholder="https://example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Social Media Accounts</label>
              <div className="space-y-3">
                {/* Instagram */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 z-10">
                    <Instagram size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    value={formData.agencyInstagram}
                    onChange={(e) => setFormData({...formData, agencyInstagram: e.target.value})}
                    placeholder="@username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Facebook */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 z-10">
                    <Facebook size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    value={formData.agencyFacebook}
                    onChange={(e) => setFormData({...formData, agencyFacebook: e.target.value})}
                    placeholder="Page name or username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* TikTok */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 z-10">
                    <Video size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    value={formData.agencyTikTok}
                    onChange={(e) => setFormData({...formData, agencyTikTok: e.target.value})}
                    placeholder="@username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBack}
          className="w-full mt-8 py-4 bg-orange-500 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
        >
          <Save size={18} className="text-white" />
          <span className="text-white font-bold text-base">Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
