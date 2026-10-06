'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Check, Mail, Phone, Globe, Briefcase, MessageCircle, Camera, QrCode, 
  RotateCw, ArrowLeft, Plus, Bookmark, Calendar, Sparkles, Download, ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { IPhoneMockup } from '@/components/ui/IPhoneMockup';

const THEME_OPTIONS = [
  { color: '#2563EB', name: 'Electric Blue' },
  { color: '#06B6D4', name: 'Bright Cyan' },
  { color: '#F59E0B', name: 'Sunset Amber' },
  { color: '#10B981', name: 'Emerald Green' },
  { color: '#8B5CF6', name: 'Neo Violet' },
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

  // Extract initial country code and phone number parts
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
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)] animate-in fade-in duration-200">
      
      {/* Left Form Editor Column */}
      <div className="w-full lg:w-7/12 overflow-y-auto pb-16 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
           <button 
             onClick={() => router.back()} 
             className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
           >
              &larr; Return to Cards
           </button>
           <span>/</span>
           <span className="text-cyan-400">{initialData ? 'Edit Digital Card' : 'Create Digital Card'}</span>
        </div>

        {/* Form Header */}
        <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-[10px] font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] inline-block mb-1">
            Zero NFC • Instant Web &amp; QR
          </span>
          <h2 className="text-2xl font-black text-white leading-tight">
            {initialData ? 'Edit Digital Card' : 'Create New Digital Business Card'}
          </h2>
          <p className="text-xs text-gray-300 font-medium mt-0.5">
            Customize personal branding, direct links, and scannable contact details.
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex border-2 border-black bg-black p-1.5 rounded-lg gap-2 text-xs font-mono font-bold uppercase tracking-wider shadow-[3px_3px_0px_#000]">
          <button
            type="button"
            onClick={() => setActiveFormTab('basic')}
            className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
              activeFormTab === 'basic' 
                ? 'bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000]' 
                : 'text-gray-400 hover:text-white border-2 border-transparent'
            }`}
          >
            Basic Info &amp; Theme
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('portfolio')}
            className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
              activeFormTab === 'portfolio' 
                ? 'bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000]' 
                : 'text-gray-400 hover:text-white border-2 border-transparent'
            }`}
          >
            Portfolio &amp; Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('testimonials')}
            className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
              activeFormTab === 'testimonials' 
                ? 'bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000]' 
                : 'text-gray-400 hover:text-white border-2 border-transparent'
            }`}
          >
            Reviews &amp; Speaking
          </button>
        </div>

        {/* Tab 1: Basic Info & Theme */}
        {activeFormTab === 'basic' && (
          <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] space-y-5">
            
            {/* Theme Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">
                Card Theme Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, themeColor: opt.color }))}
                    className={`h-10 px-3.5 rounded-lg border-2 border-black font-mono text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all shadow-[2px_2px_0px_#000] ${
                      formData.themeColor === opt.color ? 'ring-2 ring-white scale-105' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: opt.color }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-black"></span>
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Photo Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">
                Profile Avatar / Photo
              </label>
              <div 
                onClick={() => document.getElementById('profileImageInput')?.click()}
                className="bg-[#090D16] border-2 border-black border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#121c33] transition-all shadow-[2px_2px_0px_#000]"
              >
                <input 
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {formData.profileImage ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-black shadow-[2px_2px_0px_#000]">
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Custom photo loaded</p>
                      <p className="text-[10px] text-cyan-400 font-mono">Click to change avatar image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000]">
                      <Camera size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Upload avatar photo</p>
                      <p className="text-[10px] text-gray-400 font-mono">PNG, JPG, or GIF up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Full Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Full Name *</label>
                <Input 
                  name="name" 
                  placeholder="e.g. Alex Morgan" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Company Name</label>
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
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Job Title / Role</label>
                <Input 
                  name="role" 
                  placeholder="e.g. Founder & CEO" 
                  value={formData.role} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Contact Email</label>
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="e.g. alex@company.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Phone & Employee Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    className="w-24 h-11 bg-[#090D16] border-2 border-black rounded-lg px-2 text-xs font-mono font-bold text-white shadow-[2px_2px_0px_#000]"
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
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Card Badge Code</label>
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
                    className="px-3 h-11 bg-slate-900 border-2 border-black rounded-lg text-xs font-bold text-gray-200 flex items-center gap-1 shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    <RotateCw size={13} />
                    <span>Roll</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">Website or Portfolio URL</label>
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
          <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">Bio / Elevator Pitch</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="e.g. Scaling digital identity platforms. Replaced 5,000+ paper cards with zero-NFC instant QR profiles."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 bg-[#090D16] border-2 border-black rounded-lg text-xs font-medium text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Cal.com / Meeting Booking Link</label>
                <Input 
                  name="calendarUrl" 
                  placeholder="https://cal.com/your-username" 
                  value={formData.calendarUrl} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Resume / CV Link</label>
                <Input 
                  name="resumeUrl" 
                  placeholder="https://yourdomain.com/cv.pdf" 
                  value={formData.resumeUrl} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Social handles */}
            <div className="space-y-3 pt-2 border-t-2 border-slate-800">
              <label className="text-xs font-mono font-bold uppercase text-cyan-400">Social Profile URLs</label>
              <div className="space-y-2">
                <Input 
                  placeholder="LinkedIn URL: https://linkedin.com/in/alexmorgan"
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
          <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-yellow-400">Reviews &amp; Client Quotes</span>
            
            {formData.testimonials.map((test: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#121c33] border-2 border-black rounded-lg space-y-2 relative shadow-[2px_2px_0px_#000]">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.testimonials];
                    updated.splice(idx, 1);
                    setFormData(prev => ({ ...prev, testimonials: updated }));
                  }}
                  className="absolute top-3 right-3 text-red-400 text-xs font-bold hover:underline"
                >
                  Delete
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
                  className="w-full p-2.5 bg-[#090D16] border-2 border-black rounded-lg text-xs font-medium text-white shadow-[1px_1px_0px_#000]"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(prev => ({ ...prev, testimonials: [...prev.testimonials, { quote: '', author: '', role: 'Client' }] }))}
              className="w-full text-xs font-mono font-bold h-10 border-2 border-black bg-slate-900"
            >
              + Add Client Review
            </Button>
          </div>
        )}

        {/* Bottom Save Action */}
        <Button 
          type="button"
          variant="primary" 
          onClick={handleSave} 
          disabled={loading} 
          className="w-full h-13 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#000]"
        >
          {loading ? 'Saving Digital Card...' : initialData ? 'Save Changes' : 'Create & Publish Digital Card →'}
        </Button>

      </div>

      {/* Right Column: Live Interactive Card Preview */}
      <div className="w-full lg:w-5/12 flex flex-col items-center">
        <div className="sticky top-24 w-full max-w-[340px] space-y-3">
          
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] font-bold uppercase text-gray-400">
              Live Phone Preview
            </span>
            <span className="font-mono text-[10px] font-bold uppercase text-cyan-400">
              Real-Time Reflection
            </span>
          </div>

          {/* Card Container Preview */}
          <div className="bg-[#0e1628] rounded-xl border-3 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
            
            {/* Banner */}
            <div 
              className="p-5 border-b-2 border-black text-white relative transition-colors duration-200"
              style={{ backgroundColor: formData.themeColor }}
            >
              <div className="flex items-start justify-between">
                <div className="max-w-[70%]">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                    {formData.employeeCode || 'SMART-001'}
                  </span>
                  <h4 className="text-xl font-black text-white mt-1 leading-tight truncate">
                    {formData.name || 'Your Full Name'}
                  </h4>
                  <p className="text-xs font-bold text-white/95 truncate">
                    {formData.role || 'Professional Role'}
                  </p>
                  <p className="text-[11px] font-mono text-white/80 truncate">
                    {formData.company || 'SmartCard Inc.'}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] overflow-hidden flex items-center justify-center text-black font-black text-xl uppercase shrink-0">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (formData.name || 'U').charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>

            {/* Preview Navigation */}
            <div className="flex border-b-2 border-black bg-[#121c33] text-[10px] font-mono font-bold uppercase tracking-wider justify-around py-1.5">
              <button 
                type="button"
                onClick={() => setActivePreviewTab('info')}
                className={`transition-colors cursor-pointer ${activePreviewTab === 'info' ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                Contact
              </button>
              <button 
                type="button"
                onClick={() => setActivePreviewTab('portfolio')}
                className={`transition-colors cursor-pointer ${activePreviewTab === 'portfolio' ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                Bio
              </button>
              <button 
                type="button"
                onClick={() => setActivePreviewTab('more')}
                className={`transition-colors cursor-pointer ${activePreviewTab === 'more' ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                Reviews
              </button>
            </div>

            {/* Preview Body */}
            <div className="p-4 space-y-3 bg-[#0d1424]">
              {activePreviewTab === 'info' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                    <div className="p-2 bg-[#17223b] rounded-lg border-2 border-black text-center text-gray-200">
                      📱 Call Phone
                    </div>
                    <div className="p-2 bg-[#17223b] rounded-lg border-2 border-black text-center text-gray-200">
                      ✉️ Send Email
                    </div>
                  </div>

                  <div className="w-full py-2 bg-white text-black font-extrabold text-[11px] uppercase text-center rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
                    Save Contact to Phone (.vcf)
                  </div>

                  <div className="pt-2 border-t-2 border-black flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                        Instant Camera QR
                      </span>
                      <p className="text-[10px] font-bold text-white">Scans on any phone</p>
                    </div>
                    <div className="bg-white p-1 rounded-md border-2 border-black">
                      <QrCode size={36} className="text-black" />
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'portfolio' && (
                <div className="space-y-2 text-xs">
                  <p className="p-2.5 bg-[#141e35] rounded-lg border-2 border-black text-[11px] text-gray-300 font-medium leading-relaxed">
                    &quot;{formData.bio || 'Your bio elevator pitch will render here...'}&quot;
                  </p>
                  {formData.calendarUrl && (
                    <div className="p-2 bg-blue-950/40 border border-blue-500 rounded text-cyan-400 font-mono text-[10px] font-bold text-center">
                      📅 Meeting Booking Enabled
                    </div>
                  )}
                </div>
              )}

              {activePreviewTab === 'more' && (
                <div className="space-y-2 text-xs font-mono">
                  <p className="text-[10px] text-gray-400 italic text-center py-2">
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
