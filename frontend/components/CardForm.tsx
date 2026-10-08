'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Camera, QrCode, RotateCw, ArrowLeft, Plus, Trash2,
  Calendar, ExternalLink, Globe, Phone, Mail
} from 'lucide-react';

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
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    company: initialData?.company || 'SmartCard Inc.',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    themeColor: initialData?.themeColor || '#2563EB',
    template: initialData?.template || 'modern',
    profileImage: initialData?.profileImage || '',
    employeeCode: initialData?.employeeCode || 'SMART-001',
    socialLinks: {
      linkedin: initialData?.socialLinks?.linkedin || '',
      twitter: initialData?.socialLinks?.twitter || '',
      instagram: initialData?.socialLinks?.instagram || ''
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

  const generateEmployeeCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SMART-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, employeeCode: code }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
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

      if (!res.ok) throw new Error('Failed to save profile');
      router.push('/cards');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Error saving digital card');
    } finally {
      setLoading(false);
    }
  };

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
                      <p className="text-[11px] text-slate-400">PNG, JPG, or GIF up to 5MB</p>
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

            {/* Phone & Employee Code */}
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
                    <option value="+81">JP +81</option>
                  </select>
                  <Input 
                    placeholder="415 555 0192"
                    value={phoneDigits}
                    onChange={handlePhoneDigitsChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Card Badge Code</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. SMART-001" 
                    value={formData.employeeCode} 
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeCode: e.target.value }))}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={generateEmployeeCode}
                    className="px-3 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                  >
                    <RotateCw size={13} />
                    <span>Auto</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Website or Portfolio URL</label>
              <Input 
                name="website" 
                placeholder="https://smartcard.id" 
                value={formData.website} 
                onChange={handleChange} 
              />
            </div>

          </div>
        )}

        {/* Tab 2: Portfolio & Bio */}
        {activeFormTab === 'portfolio' && (
          <div className="bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Bio / Elevator Pitch</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="e.g. Scaling digital identity platforms. Replaced 5,000+ paper cards with zero-NFC instant QR profiles."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Cal.com / Booking Link</label>
                <Input 
                  name="calendarUrl" 
                  placeholder="https://cal.com/your-username" 
                  value={formData.calendarUrl} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Resume / CV Link</label>
                <Input 
                  name="resumeUrl" 
                  placeholder="https://yourdomain.com/cv.pdf" 
                  value={formData.resumeUrl} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Social handles */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Social Profiles</label>
              <div className="space-y-2">
                <Input 
                  placeholder="LinkedIn URL: https://linkedin.com/in/username"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                />
                <Input 
                  placeholder="Twitter / X URL: https://twitter.com/username"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Testimonials */}
        {activeFormTab === 'testimonials' && (
          <div className="bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Client Reviews &amp; Recommendations</span>
            
            {formData.testimonials.map((test: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 relative">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.testimonials];
                    updated.splice(idx, 1);
                    setFormData(prev => ({ ...prev, testimonials: updated }));
                  }}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <Input 
                  placeholder="Reviewer Name (e.g. Sarah Lin)"
                  value={test.author || test.reviewer || ''}
                  onChange={(e) => {
                    const updated = [...formData.testimonials];
                    updated[idx].author = e.target.value;
                    setFormData(prev => ({ ...prev, testimonials: updated }));
                  }}
                />
                <textarea
                  placeholder="Quote text..."
                  rows={2}
                  value={test.quote || test.text || ''}
                  onChange={(e) => {
                    const updated = [...formData.testimonials];
                    updated[idx].quote = e.target.value;
                    setFormData(prev => ({ ...prev, testimonials: updated }));
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(prev => ({ ...prev, testimonials: [...prev.testimonials, { quote: '', author: '', role: 'Client' }] }))}
              className="w-full text-xs font-medium h-9"
            >
              <Plus size={13} />
              <span>Add Client Review</span>
            </Button>
          </div>
        )}

        {/* Bottom Save Action */}
        <Button 
          type="button"
          variant="primary" 
          onClick={handleSave} 
          disabled={loading} 
          className="w-full h-11 text-sm font-medium"
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
          <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md overflow-hidden transition-all">
            
            {/* Accent Banner Header */}
            <div 
              className="p-5 text-white relative transition-colors duration-200"
              style={{ backgroundColor: formData.themeColor }}
            >
              <div className="flex items-start justify-between">
                <div className="max-w-[70%]">
                  <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                    {formData.employeeCode || 'SMART-001'}
                  </span>
                  <h4 className="text-lg font-semibold text-white mt-1.5 leading-snug truncate">
                    {formData.name || 'Your Full Name'}
                  </h4>
                  <p className="text-xs text-white/90 truncate font-medium">
                    {formData.role || 'Professional Role'}
                  </p>
                  <p className="text-[11px] text-white/75 truncate mt-0.5">
                    {formData.company || 'SmartCard Inc.'}
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
                Reviews
              </button>
            </div>

            {/* Preview Body */}
            <div className="p-4 space-y-3 bg-white dark:bg-[#131924]">
              {activePreviewTab === 'info' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                      <Phone size={12} className="text-blue-600 dark:text-blue-400" />
                      <span>Call</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                      <Mail size={12} className="text-blue-600 dark:text-blue-400" />
                      <span>Email</span>
                    </div>
                  </div>

                  <div className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs text-center rounded-lg shadow-xs transition-colors">
                    Save Contact to Phone (.vcf)
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        Camera QR Code
                      </span>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Scans on any phone</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <QrCode size={32} className="text-slate-900" />
                    </div>
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
                <div className="space-y-2 text-xs">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
                    {formData.testimonials.length} reviews attached to this profile.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
