'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Camera, QrCode, RotateCw, ArrowLeft, Plus, Trash2,
  Calendar, ExternalLink, Globe, Phone, Mail, Lock, AlertCircle, Check
} from 'lucide-react';
import { QRCodeComponent } from '@/components/QRCode';
import { validateUsername, getCardPublicUrl } from '@/lib/usernameValidation';

const THEME_OPTIONS = [
  { color: '#2563EB', name: 'Royal Blue' },
  { color: '#06B6D4', name: 'Cyan' },
  { color: '#F59E0B', name: 'Amber' },
  { color: '#10B981', name: 'Emerald' },
  { color: '#8B5CF6', name: 'Violet' },
];

export function CardForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    name: initialData?.name || '',
    role: initialData?.role || '',
    company: initialData?.company || 'SmartCard Technologies',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    themeColor: initialData?.themeColor || '#2563EB',
    template: initialData?.template || 'modern',
    profileImage: initialData?.profileImage || '',
    employeeCode: initialData?.employeeCode || 'SMART-001',
    isPublic: initialData?.isPublic !== undefined ? initialData.isPublic : true,
    socialLinks: {
      linkedin: initialData?.socialLinks?.linkedin || '',
      twitter: initialData?.socialLinks?.twitter || '',
      instagram: initialData?.socialLinks?.instagram || '',
      github: initialData?.socialLinks?.github || '',
    },
    resumeUrl: initialData?.resumeUrl || '',
    calendarUrl: initialData?.calendarUrl || '',
    bio: initialData?.bio || '',
    projects: initialData?.projects || [],
    speakingEvents: initialData?.speakingEvents || [],
    testimonials: initialData?.testimonials || []
  });

  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'portfolio' | 'testimonials'>('basic');
  const [activePreviewTab, setActivePreviewTab] = useState<'info' | 'portfolio' | 'more'>('info');

  const initialPhone = initialData?.phone || '';
  let initialCode = '+1';
  let initialDigits = '';
  if (initialPhone.startsWith('+')) {
    const parts = initialPhone.split(' ');
    initialCode = parts[0];
    initialDigits = parts.slice(1).join(' ');
  } else if (initialPhone) {
    initialDigits = initialPhone;
  }

  const [countryCode, setCountryCode] = useState(initialCode);
  const [phoneDigits, setPhoneDigits] = useState(initialDigits);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingImage(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUsernameChange = (val: string) => {
    setFormData(prev => ({ ...prev, username: val }));
    if (val.trim()) {
      const validation = validateUsername(val);
      if (!validation.isValid) {
        setUsernameError(validation.error || 'Invalid username');
      } else {
        setUsernameError(null);
      }
    } else {
      setUsernameError(null);
    }
  };

  const handlePhoneDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneDigits(val);
    setFormData(prev => ({ ...prev, phone: `${countryCode} ${val}` }));
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCountryCode(val);
    setFormData(prev => ({ ...prev, phone: `${val} ${phoneDigits}` }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.username) {
      const validation = validateUsername(formData.username);
      if (!validation.isValid) {
        setUsernameError(validation.error || 'Please enter a valid username');
        return;
      }
    }

    setLoading(true);
    try {
      const url = initialData ? `/api/cards/${initialData._id || initialData.id}` : '/api/cards';
      const method = initialData ? 'PUT' : 'POST';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || 'fake_token' : 'fake_token';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save card');
      }

      router.push('/cards');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error saving digital card');
    } finally {
      setLoading(false);
    }
  };

  const currentUsernameSlug = formData.username || (formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'user');
  const previewPublicUrl = getCardPublicUrl(currentUsernameSlug);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)] animate-subtle-fade">
      
      {/* Left Form Editor Column */}
      <div className="w-full lg:w-7/12 pb-16 space-y-5">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
           <button 
             onClick={() => router.back()} 
             className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
           >
              <ArrowLeft size={13} />
              <span>Cards</span>
           </button>
           <span>/</span>
           <span className="text-slate-800 dark:text-slate-200 font-medium">
             {initialData ? 'Edit Digital Card' : 'Create Digital Card'}
           </span>
        </div>

        {/* Form Header */}
        <div className="bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
              Digital Identity
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Zero NFC Hardware</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {initialData ? 'Edit Digital Card' : 'Create New Digital Business Card'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize personal branding, direct links, and scannable contact details.
          </p>
        </div>

        {/* Segmented Tab Headers */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveFormTab('basic')}
            className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeFormTab === 'basic' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Basic Info &amp; Theme
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('portfolio')}
            className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeFormTab === 'portfolio' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Portfolio &amp; Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('testimonials')}
            className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeFormTab === 'testimonials' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Reviews &amp; Speaking
          </button>
        </div>

        {/* Tab 1: Basic Info & Theme */}
        {activeFormTab === 'basic' && (
          <div className="bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            
            {/* 21. USERNAME SETUP: Choose your SmartCard URL */}
            <div className="space-y-2 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Globe size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>Choose your SmartCard URL</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">smartcard.app/[username]</span>
              </div>

              <div className="flex rounded-xl shadow-2xs border border-slate-200 dark:border-slate-800 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white dark:bg-[#0B0F17]">
                <span className="inline-flex items-center px-3 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-xs font-mono select-none border-r border-slate-200 dark:border-slate-800">
                  smartcard.app/
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="smriti"
                  className="flex-1 h-10 px-3 bg-transparent text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {usernameError && (
                <p className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium mt-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{usernameError}</span>
                </p>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Minimum 3 characters. Lowercase letters, numbers, hyphens, and underscores only.
              </p>
            </div>

            {/* 23. PRIVACY: Public Profile ON / OFF */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Public Profile</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    formData.isPublic 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    {formData.isPublic ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formData.isPublic 
                    ? 'Card is visible to anyone visiting your public link or scanning QR.' 
                    : 'Card is private. Public link shows "This SmartCard is currently private."'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                className={`w-10 h-6 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  formData.isPublic ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.isPublic ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Theme Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Card Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, themeColor: opt.color }))}
                    className={`h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer transition-all ${
                      formData.themeColor === opt.color 
                        ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-102' 
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: opt.color }}
                  >
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Photo Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Profile Photo / Avatar
              </label>
              <div 
                onClick={() => document.getElementById('profileImageInput')?.click()}
                className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <input 
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {formData.profileImage ? (
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Custom photo uploaded</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400">Click to change avatar image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Camera size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Upload avatar photo</p>
                      <p className="text-[11px] text-slate-400">PNG, JPG, or WebP up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Full Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                <Input 
                  name="name" 
                  placeholder="e.g. Alex Morgan" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                <Input 
                  name="company" 
                  placeholder="e.g. SmartCard Technologies" 
                  value={formData.company} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Role & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Job Title / Role</label>
                <Input 
                  name="role" 
                  placeholder="e.g. Product Lead" 
                  value={formData.role} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <Input 
                  name="email" 
                  type="email"
                  placeholder="alex@company.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Phone & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    className="w-22 h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                    <option value="+91">IN +91</option>
                    <option value="+49">DE +49</option>
                  </select>
                  <Input 
                    placeholder="555-0199" 
                    value={phoneDigits} 
                    onChange={handlePhoneDigitsChange} 
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Website / Portfolio</label>
                <Input 
                  name="website" 
                  placeholder="https://alexmorgan.dev" 
                  value={formData.website} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Social Profile Links
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  placeholder="LinkedIn (e.g. linkedin.com/in/alex)" 
                  value={formData.socialLinks.linkedin} 
                  onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, linkedin: e.target.value } }))}
                />
                <Input 
                  placeholder="GitHub (e.g. github.com/alex)" 
                  value={formData.socialLinks.github} 
                  onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, github: e.target.value } }))}
                />
                <Input 
                  placeholder="X / Twitter (e.g. x.com/alex)" 
                  value={formData.socialLinks.twitter} 
                  onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, twitter: e.target.value } }))}
                />
                <Input 
                  placeholder="Instagram (e.g. instagram.com/alex)" 
                  value={formData.socialLinks.instagram} 
                  onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, instagram: e.target.value } }))}
                />
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Portfolio & Bio */}
        {activeFormTab === 'portfolio' && (
          <div className="bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Personal Bio / Elevator Pitch</label>
              <textarea 
                rows={4}
                name="bio"
                placeholder="Brief summary of what you do, key achievements, or specialties..."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Calendar / Meeting Link</label>
              <Input 
                name="calendarUrl" 
                placeholder="e.g. https://cal.com/alex" 
                value={formData.calendarUrl} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Resume / CV Link</label>
              <Input 
                name="resumeUrl" 
                placeholder="e.g. https://dropbox.com/s/resume.pdf" 
                value={formData.resumeUrl} 
                onChange={handleChange} 
              />
            </div>
          </div>
        )}

        {/* Tab 3: Reviews & Speaking */}
        {activeFormTab === 'testimonials' && (
          <div className="bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add client reviews or public speaking events to showcase social proof.
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Testimonials &amp; Reviews are configured automatically from captured leads.
              </p>
            </div>
          </div>
        )}

        {/* Save & Publish Action Button */}
        <Button 
          type="button"
          variant="primary" 
          onClick={handleSave} 
          disabled={loading || Boolean(usernameError)} 
          className="w-full h-11 text-sm font-medium shadow-xs"
        >
          {loading ? 'Saving Digital Card...' : initialData ? 'Save Changes' : 'Create & Publish Digital Card'}
        </Button>

      </div>

      {/* Right Column: Live Interactive Card Preview */}
      <div className="w-full lg:w-5/12 flex flex-col items-center">
        <div className="sticky top-20 w-full max-w-[340px] space-y-3">
          
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Live Preview
            </span>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
              Real-time update
            </span>
          </div>

          {/* Minimalist Executive Digital Card Preview */}
          <div className="bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-md overflow-hidden transition-all">
            
            {/* Accent Banner Header */}
            <div 
              className="p-5 text-white relative transition-colors duration-200"
              style={{ backgroundColor: formData.themeColor }}
            >
              <div className="flex items-start justify-between">
                <div className="max-w-[70%]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                      {formData.employeeCode || 'SMART-001'}
                    </span>
                    <span className="text-[10px] font-medium bg-white/20 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {formData.isPublic ? 'LIVE' : 'PRIVATE'}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mt-1.5 leading-snug truncate">
                    {formData.name || 'Your Full Name'}
                  </h4>
                  <p className="text-xs text-white/90 truncate font-medium">
                    {formData.role || 'Professional Role'}
                  </p>
                  <p className="text-[11px] text-white/75 truncate mt-0.5">
                    {formData.company || 'SmartCard Technologies'}
                  </p>
                </div>

                <div className="w-14 h-14 rounded-full ring-2 ring-white/30 bg-white/10 shadow-xs overflow-hidden flex items-center justify-center text-white font-semibold text-lg uppercase shrink-0">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (formData.name || 'U').charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>

            {/* Preview Navigation */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-[11px] font-medium justify-around py-1.5">
              <button 
                type="button"
                onClick={() => setActivePreviewTab('info')}
                className={`py-1 px-3 rounded-md transition-colors cursor-pointer ${
                  activePreviewTab === 'info' 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Contact
              </button>
              <button 
                type="button"
                onClick={() => setActivePreviewTab('portfolio')}
                className={`py-1 px-3 rounded-md transition-colors cursor-pointer ${
                  activePreviewTab === 'portfolio' 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Bio
              </button>
              <button 
                type="button"
                onClick={() => setActivePreviewTab('more')}
                className={`py-1 px-3 rounded-md transition-colors cursor-pointer ${
                  activePreviewTab === 'more' 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                QR Code
              </button>
            </div>

            {/* Preview Body */}
            <div className="p-4 space-y-3 bg-white dark:bg-[#131924]">
              {activePreviewTab === 'info' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                      <Phone size={12} className="text-blue-600 dark:text-blue-400" />
                      <span>{formData.phone ? 'Call' : 'Phone'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                      <Mail size={12} className="text-blue-600 dark:text-blue-400" />
                      <span>{formData.email ? 'Email' : 'Message'}</span>
                    </div>
                  </div>

                  <div className="w-full py-2 bg-blue-600 text-white font-medium text-xs text-center rounded-lg shadow-xs">
                    Save Contact to Phone (.vcf)
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-mono text-center text-slate-400 truncate">
                      {previewPublicUrl}
                    </p>
                  </div>
                </div>
              )}

              {activePreviewTab === 'portfolio' && (
                <div className="space-y-2 text-xs">
                  <p className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    &quot;{formData.bio || 'Your bio elevator pitch will render here...'}&quot;
                  </p>
                  {formData.calendarUrl && (
                    <div className="p-2 bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 text-xs font-medium text-center flex items-center justify-center gap-1.5">
                      <Calendar size={13} />
                      <span>Meeting Booking Enabled</span>
                    </div>
                  )}
                </div>
              )}

              {activePreviewTab === 'more' && (
                <div className="flex flex-col items-center py-2 space-y-2">
                  <QRCodeComponent
                    value={previewPublicUrl}
                    username={currentUsernameSlug}
                    name={formData.name || 'User'}
                    size={140}
                    accentColor={formData.themeColor}
                    showDownload={false}
                    showShare={false}
                    showCopy={false}
                  />
                  <span className="text-[10px] text-slate-400 font-mono text-center block">
                    smartcard.app/{currentUsernameSlug}
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
