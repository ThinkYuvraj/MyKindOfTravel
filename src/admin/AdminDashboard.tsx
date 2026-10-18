import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  DestinationItem,
  TravelPackage,
  CustomSection,
  TestimonialItem,
  ExperiencePillar,
  GalleryItem,
  HowItWorksStep,
  WhyUsPillar,
  SectionCustomContent,
  EnrichedPlace,
} from '../types';
import {
  Layers,
  Settings,
  Map,
  Package,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  LogOut,
  Inbox,
  Shield,
  MessageSquareQuote,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Compass,
  Camera,
  RefreshCw,
  Search,
  UserCheck,
  ShieldCheck,
  PhoneCall,
  Award,
  Heart,
} from 'lucide-react';
import { SectionsManager } from './SectionsManager';
import { InquiriesManager } from './InquiriesManager';
import { CredentialsManager } from './CredentialsManager';
import { GalleryManager } from './GalleryManager';
import { PlacesManager } from './PlacesManager';
import { ImageUploadField } from './ImageUploadField';
import { useCms } from '../context/CmsContext';
import { CURATED_PLACES_DATA } from '../data/curatedPlacesData';
import {
  DESTINATIONS,
  POPULAR_PACKAGES,
  MARQUEE_ITEMS,
  TESTIMONIALS,
  EXPERIENCE_PILLARS,
  COMPANY_INFO,
  GALLERY_ITEMS,
} from '../data/travelData';

type Tab = 'sections' | 'hero' | 'destinations' | 'packages' | 'places' | 'gallery' | 'content' | 'leads' | 'settings';

export default function AdminDashboard() {
  const { publishCms, lastPublishedAt: serverLastPublishedAt } = useCms();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveBanner, setSaveBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('sections');

  // CMS State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [primaryButton, setPrimaryButton] = useState('');
  const [secondaryButton, setSecondaryButton] = useState('');

  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'hero',
    'marquee',
    'howItWorks',
    'destinations',
    'experiences',
    'packages',
    'gallery',
    'testimonials',
    'whyUs',
    'contact',
  ]);
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [places, setPlaces] = useState<EnrichedPlace[]>([]);
  const [marquee, setMarquee] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [experiencePillars, setExperiencePillars] = useState<ExperiencePillar[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>(COMPANY_INFO);
  const [sectionHeaders, setSectionHeaders] = useState<Record<string, SectionCustomContent>>({});
  const [howItWorksSteps, setHowItWorksSteps] = useState<HowItWorksStep[]>([]);
  const [whyUsPillars, setWhyUsPillars] = useState<WhyUsPillar[]>([]);

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/cms');
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        setHeroTitle(data.heroTitle || 'EXPLORE. DREAM. DISCOVER.');
        setHeroSubtitle(data.heroSubtitle || '');
        setHeroBadge(data.heroBadge || 'My Kind of Travel • Bespoke Journeys');
        setHeroBgImage(data.heroBgImage || '');
        setPrimaryButton(data.primaryButton || 'START EXPLORING');
        setSecondaryButton(data.secondaryButton || 'PLAN TRIP');
        if (data.sectionOrder && Array.isArray(data.sectionOrder)) {
          setSectionOrder(data.sectionOrder.filter((k: string) => k !== 'dreamToDeparture'));
        }
        if (data.sectionVisibility) {
          setSectionVisibility(data.sectionVisibility);
        }
        setDestinations(data.destinations || DESTINATIONS);
        setPackages(data.packages || POPULAR_PACKAGES);
        setPlaces(data.places && data.places.length > 0 ? data.places : CURATED_PLACES_DATA);
        setMarquee(data.marquee || MARQUEE_ITEMS);
        setTestimonials(data.testimonials || TESTIMONIALS);
        setExperiencePillars(data.experiencePillars || EXPERIENCE_PILLARS);
        setGallery(data.gallery || GALLERY_ITEMS);
        setCustomSections(data.customSections || []);
        setCompanyInfo(data.companyInfo || COMPANY_INFO);
        setSectionHeaders(data.sectionHeaders || {});
        if (data.howItWorksSteps && Array.isArray(data.howItWorksSteps)) {
          setHowItWorksSteps(data.howItWorksSteps);
        }
        if (data.whyUsPillars && Array.isArray(data.whyUsPillars)) {
          setWhyUsPillars(data.whyUsPillars);
        }
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveBanner(null);
    try {
      const result = await publishCms({
        heroTitle,
        heroSubtitle,
        heroBadge,
        heroBgImage,
        primaryButton,
        secondaryButton,
        sectionOrder,
        sectionVisibility,
        destinations,
        packages,
        places,
        marquee,
        testimonials,
        experiencePillars,
        gallery,
        customSections,
        companyInfo,
        sectionHeaders,
        howItWorksSteps,
        whyUsPillars,
      });

      if (result.success) {
        setIsDirty(false);
        setSaveBanner({
          type: 'success',
          message: result.message || 'All changes saved & synced live across all pages and open sessions!',
        });
        setTimeout(() => setSaveBanner(null), 5000);
      } else {
        setSaveBanner({ type: 'error', message: result.message || 'Server error saving changes.' });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveBanner({ type: 'error', message: 'Network error saving changes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#FFFFFF] bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="space-y-3">
          <Compass className="w-10 h-10 text-[#E37500] animate-spin mx-auto" />
          <p className="font-serif text-lg font-bold">Loading Interactive CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans text-[#FFFFFF]">
      {/* Top Header */}
      <header className="bg-[#121212] border-b border-[#262626] px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E37500] to-[#C66500] flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-[#FFFFFF]">My Kind of Travel</h1>
            <span className="text-[11px] text-[#E37500] font-bold uppercase tracking-widest block">
              Interactive CMS Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Sync Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#262626] text-xs">
            {isDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Unsaved Drafts Pending</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Live In-Sync</span>
              </span>
            )}
            {serverLastPublishedAt && (
              <span className="text-[11px] text-neutral-400 border-l border-[#262626] pl-2 hidden lg:inline">
                Synced {new Date(serverLastPublishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Discard Drafts Button if dirty */}
          {isDirty && (
            <button
              onClick={() => {
                if (confirm('Discard your unsaved draft edits and reload from live site?')) {
                  fetchData();
                }
              }}
              className="px-3 py-1.5 rounded-full text-xs text-neutral-400 hover:text-white hover:bg-[#1E1E1E] transition-colors cursor-pointer"
            >
              Discard Drafts
            </button>
          )}

          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] text-xs font-semibold transition-colors border border-[#262626]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E37500]" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md active:scale-95 cursor-pointer ${
              isDirty
                ? 'bg-[#E37500] hover:bg-[#C66500] text-white shadow-[#E37500]/30 animate-pulse'
                : 'bg-[#E37500] hover:bg-[#C66500] text-white shadow-[#E37500]/20'
            }`}
          >
            <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Syncing...' : 'Publish Changes'}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-full bg-[#181818] hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors border border-[#262626]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Persistent Save Notification Banner */}
      {saveBanner && (
        <div
          className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between transition-all ${
            saveBanner.type === 'success'
              ? 'bg-[#E37500]/15 text-[#E37500] border-b border-[#E37500]/30'
              : 'bg-[#121212] text-[#FFFFFF] border-b border-[#E37500]/30'
          }`}
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            {saveBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#E37500] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#E37500] shrink-0" />
            )}
            <span>{saveBanner.message}</span>
          </div>
          <button onClick={() => setSaveBanner(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#121212] border-r border-[#262626] hidden lg:block shrink-0">
          <nav className="p-4 space-y-1.5 sticky top-16">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#A3A3A3]/50">
              Page Architecture
            </div>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sections'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Sections & Page Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hero'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Hero & Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('destinations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'destinations'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Destinations ({destinations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'packages'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Itineraries & Packages ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('places')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'places'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Sanctuaries & Places ({places.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Visual Gallery ({gallery.length})</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#A3A3A3]/50">
              Content & Inquiries
            </div>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Stories & Pillars</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Customer Inquiries CRM</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#A3A3A3]/50">
              System & Security
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#E37500] text-white shadow-md'
                  : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Pass & Agency</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Horizontal Tabs Bar */}
        <div className="lg:hidden flex overflow-x-auto border-b border-[#262626] bg-[#121212] p-2 gap-1.5 scrollbar-none w-full">
          {[
            { id: 'sections', label: 'Sections' },
            { id: 'hero', label: 'Hero' },
            { id: 'destinations', label: 'Destinations' },
            { id: 'packages', label: 'Packages' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'content', label: 'Stories' },
            { id: 'leads', label: 'Inquiries' },
            { id: 'settings', label: 'Credentials' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#E37500] text-white'
                  : 'text-[#A3A3A3]/70 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-[#181818] rounded-2xl shadow-2xl border border-[#262626] overflow-hidden">
            {/* 1. Sections & Flow Tab */}
            {activeTab === 'sections' && (
              <SectionsManager
                sectionOrder={sectionOrder}
                setSectionOrder={setSectionOrder}
                sectionVisibility={sectionVisibility}
                setSectionVisibility={setSectionVisibility}
                customSections={customSections}
                setCustomSections={setCustomSections}
                sectionHeaders={sectionHeaders}
                setSectionHeaders={setSectionHeaders}
                howItWorksSteps={howItWorksSteps}
                setHowItWorksSteps={setHowItWorksSteps}
                whyUsPillars={whyUsPillars}
                setWhyUsPillars={setWhyUsPillars}
                heroBgImage={heroBgImage}
                setHeroBgImage={setHeroBgImage}
                experiencePillars={experiencePillars}
                setExperiencePillars={setExperiencePillars}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* 2. Hero Tab */}
            {activeTab === 'hero' && (
              <div className="p-6 space-y-6">
                <div className="pb-4 border-b border-[#262626]">
                  <div className="flex items-center gap-2 text-[#E37500] font-bold text-xs uppercase tracking-widest mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Hero Section & Brand Welcome</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">Main Visual Header</h3>
                </div>

                <div className="space-y-4 max-w-3xl">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                      Eyebrow Badge Text
                    </label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder="My Kind of Travel • Bespoke Journeys"
                      className="w-full px-4 py-2 bg-[#121212] border border-[#262626] text-[#FFFFFF] rounded-xl text-sm outline-none focus:border-[#E37500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-[#121212] border border-[#262626] text-[#FFFFFF] rounded-xl text-sm outline-none focus:border-[#E37500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                      Subtitle / Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-4 py-2 bg-[#121212] border border-[#262626] text-[#FFFFFF] rounded-xl text-sm outline-none focus:border-[#E37500]"
                    />
                  </div>

                  <div>
                    <ImageUploadField
                      label="Hero Background Panorama Image"
                      value={heroBgImage}
                      onChange={(url) => setHeroBgImage(url)}
                      aspectRatio="wide"
                      placeholder="Leave empty for default Bali green terraces, or paste an image URL"
                      helperText="Select from curated luxury travel presets (Zermatt, Paris, Maldives, Bali) or upload an image from your device."
                    />

                    {/* Quick Hero Presets Bar */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                        Quick Popular Backgrounds:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Default Bali Terraces', url: '' },
                          { name: 'Zermatt Matterhorn', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1920&q=80' },
                          { name: 'Parisian Sunset', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1920&q=80' },
                          { name: 'Maldives Overwater', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=80' },
                          { name: 'Amalfi Positano', url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1920&q=80' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setHeroBgImage(preset.url);
                              setIsDirty(true);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              heroBgImage === preset.url
                                ? 'bg-[#E37500] text-white border-[#E37500]'
                                : 'bg-[#181818] text-neutral-300 border-[#262626] hover:border-neutral-500'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                        Primary CTA Button
                      </label>
                      <input
                        type="text"
                        value={primaryButton}
                        onChange={(e) => setPrimaryButton(e.target.value)}
                        className="w-full px-4 py-2 bg-[#121212] border border-[#262626] text-[#FFFFFF] rounded-xl text-sm outline-none focus:border-[#E37500]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                        Secondary CTA Button
                      </label>
                      <input
                        type="text"
                        value={secondaryButton}
                        onChange={(e) => setSecondaryButton(e.target.value)}
                        className="w-full px-4 py-2 bg-[#121212] border border-[#262626] text-[#FFFFFF] rounded-xl text-sm outline-none focus:border-[#E37500]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Destinations Tab */}
            {activeTab === 'destinations' && (
              <DestinationsManager
                destinations={destinations}
                setDestinations={(val) => {
                  setDestinations(val);
                  setIsDirty(true);
                }}
              />
            )}

            {/* 4. Packages Tab */}
            {activeTab === 'packages' && (
              <PackagesManager
                packages={packages}
                setPackages={(val) => {
                  setPackages(val);
                  setIsDirty(true);
                }}
              />
            )}

            {/* 4b. Curated Sanctuaries & Places Tab */}
            {activeTab === 'places' && (
              <PlacesManager
                places={places}
                onUpdatePlaces={(newPlaces) => {
                  setPlaces(newPlaces);
                  setIsDirty(true);
                }}
              />
            )}

            {/* 5. Wanderlust Visual Gallery Tab */}
            {activeTab === 'gallery' && (
              <GalleryManager
                gallery={gallery}
                setGallery={(val) => {
                  setGallery(val);
                  setIsDirty(true);
                }}
              />
            )}

            {/* 6. Stories, Testimonials & Marquee Tab */}
            {activeTab === 'content' && (
              <ContentManager
                marquee={marquee}
                setMarquee={(val) => {
                  setMarquee(val);
                  setIsDirty(true);
                }}
                testimonials={testimonials}
                setTestimonials={(val) => {
                  setTestimonials(val);
                  setIsDirty(true);
                }}
                experiencePillars={experiencePillars}
                setExperiencePillars={(val) => {
                  setExperiencePillars(val);
                  setIsDirty(true);
                }}
                howItWorksSteps={howItWorksSteps}
                setHowItWorksSteps={(val) => {
                  setHowItWorksSteps(val);
                  setIsDirty(true);
                }}
                whyUsPillars={whyUsPillars}
                setWhyUsPillars={(val) => {
                  setWhyUsPillars(val);
                  setIsDirty(true);
                }}
              />
            )}

            {/* 6. Customer Inquiries Tab */}
            {activeTab === 'leads' && <InquiriesManager />}

            {/* 7. Settings & Credentials Tab */}
            {activeTab === 'settings' && (
              <CredentialsManager
                companyInfo={companyInfo}
                setCompanyInfo={(val) => {
                  setCompanyInfo(val);
                  setIsDirty(true);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Subcomponent: DestinationsManager
// --------------------------------------------------------
function DestinationsManager({
  destinations,
  setDestinations,
}: {
  destinations: DestinationItem[];
  setDestinations: React.Dispatch<React.SetStateAction<DestinationItem[]>>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickImageDestId, setQuickImageDestId] = useState<string | null>(null);

  const handleAdd = () => {
    const newDest: DestinationItem = {
      id: `dest-${Date.now()}`,
      name: 'Santorini Sunset Haven',
      country: 'Greece',
      region: 'Cyclades',
      priceNote: 'Starting at ₹2,40,000 / couple',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      description: 'Perched high on the caldera with private heated plunge pools and uninterrupted Aegean views.',
      highlights: ['Private catamaran caldera cruise', 'Cliffside wine tasting at sunset', 'VIP airport transfers'],
      bestTime: 'May to October',
      idealFor: 'Couples & Milestones',
    };
    setDestinations([newDest, ...destinations]);
    setEditingId(newDest.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setDestinations(destinations.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this destination?')) {
      setDestinations(destinations.filter((d) => d.id !== id));
    }
  };

  const filteredDestinations = destinations.filter((dest) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.region.toLowerCase().includes(q) ||
      (dest.idealFor || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h3 className="text-xl font-serif font-bold text-white">Manage Featured Destinations</h3>
          <p className="text-sm text-[#A3A3A3]/70 mt-1">
            Display luxury destination cards with tags, descriptions, flight details, and perks.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#E37500] hover:bg-[#C66500] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Fast Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${destinations.length} destinations by title, country, or region...`}
          className="w-full pl-10 pr-10 py-2.5 bg-[#121212] border border-[#262626] rounded-xl text-xs text-white placeholder-neutral-500 focus:border-[#E37500] outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filteredDestinations.length === 0 && (
          <div className="p-8 text-center border border-dashed border-[#262626] rounded-2xl text-neutral-400 text-xs">
            No destinations found matching "{searchQuery}".
          </div>
        )}
        {filteredDestinations.map((dest) => (
          <div key={dest.id} className="border border-[#262626] rounded-xl p-4 bg-[#121212]/60">
            {editingId === dest.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Destination Name</label>
                    <input
                      value={dest.name}
                      onChange={(e) => handleUpdate(dest.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Country</label>
                    <input
                      value={dest.country}
                      onChange={(e) => handleUpdate(dest.id, 'country', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Region</label>
                    <input
                      value={dest.region}
                      onChange={(e) => handleUpdate(dest.id, 'region', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Price Note / Starting Price</label>
                    <input
                      value={dest.priceNote}
                      onChange={(e) => handleUpdate(dest.id, 'priceNote', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField
                      label="Destination Card Image"
                      value={dest.image}
                      onChange={(url) => handleUpdate(dest.id, 'image', url)}
                      aspectRatio="video"
                      helperText="Select from luxury presets or upload high-res destination photography."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Description</label>
                    <textarea
                      value={dest.description}
                      onChange={(e) => handleUpdate(dest.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Best Time to Visit</label>
                    <input
                      value={dest.bestTime}
                      onChange={(e) => handleUpdate(dest.id, 'bestTime', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Ideal For</label>
                    <input
                      value={dest.idealFor}
                      onChange={(e) => handleUpdate(dest.id, 'idealFor', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">
                    Signature Inclusions (Comma separated)
                  </label>
                  <input
                    value={(dest.highlights || []).join(', ')}
                    onChange={(e) =>
                      handleUpdate(
                        dest.id,
                        'highlights',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-[#E37500] text-white rounded-lg text-xs font-bold"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative group shrink-0">
                    {dest.image ? (
                      <img src={dest.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuickImageDestId(dest.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#E37500] rounded-xl transition-opacity text-[10px] font-bold cursor-pointer"
                      title="Quick Change Cover Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{dest.name}</h4>
                    <p className="text-xs text-[#A3A3A3]/70">
                      {dest.country} • {dest.region} • {dest.priceNote}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuickImageDestId(dest.id)}
                    className="p-2 bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-[#E37500] rounded-lg transition-colors cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(dest.id)}
                    className="p-2 bg-[#181818] hover:bg-[#262626] text-[#C66500] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Image Changer Modal for Destination */}
      {quickImageDestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E37500]" />
                <h3 className="text-sm font-bold text-white truncate max-w-xs">
                  Change Image: {destinations.find((d) => d.id === quickImageDestId)?.name}
                </h3>
              </div>
              <button
                onClick={() => setQuickImageDestId(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadField
              label="Select or Upload New Cover Photo"
              value={destinations.find((d) => d.id === quickImageDestId)?.image || ''}
              onChange={(newUrl) => {
                handleUpdate(quickImageDestId, 'image', newUrl);
              }}
              aspectRatio="video"
              helperText="Updates this destination card image immediately."
            />

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button
                onClick={() => setQuickImageDestId(null)}
                className="px-5 py-2 bg-[#E37500] hover:bg-[#C66500] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done Updating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------
// Subcomponent: PackagesManager
// --------------------------------------------------------
function PackagesManager({
  packages,
  setPackages,
}: {
  packages: TravelPackage[];
  setPackages: React.Dispatch<React.SetStateAction<TravelPackage[]>>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickImagePkgId, setQuickImagePkgId] = useState<string | null>(null);

  const handleAdd = () => {
    const newPkg: TravelPackage = {
      id: `pkg-${Date.now()}`,
      tag: 'Luxury Honeymoon',
      badge: 'Best Seller',
      title: 'French Riviera & Monaco Luxe Escape',
      subtitle: 'Nice, Cannes, Eze, Monte Carlo',
      duration: '7 Days / 6 Nights',
      destination: 'France & Monaco',
      startingPrice: '₹3,20,000',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      features: ['Private Ferrari or Helicopter transfer to Monaco', '5-star cliffside suites in Eze', 'Michelin star sunset dinners'],
      inclusions: ['Luxury airport chauffeur', 'Daily champagne breakfasts', 'Private yacht excursion to Saint-Tropez'],
      dayHighlights: [
        { day: 1, title: 'Arrival in Nice', details: 'Private chauffeur to sea-view suite' },
        { day: 2, title: 'Monaco Grandeur', details: 'Casino square VIP tour and yacht dinner' },
      ],
    };
    setPackages([newPkg, ...packages]);
    setEditingId(newPkg.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setPackages(packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this package?')) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      pkg.title.toLowerCase().includes(q) ||
      pkg.destination.toLowerCase().includes(q) ||
      (pkg.subtitle || '').toLowerCase().includes(q) ||
      (pkg.tag || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h3 className="text-xl font-serif font-bold text-white">Manage Curated Packages</h3>
          <p className="text-sm text-[#A3A3A3]/70 mt-1">
            Proven, popular packages with itinerary details and investment pricing.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#E37500] hover:bg-[#C66500] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Fast Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${packages.length} packages by title, destination, or theme...`}
          className="w-full pl-10 pr-10 py-2.5 bg-[#121212] border border-[#262626] rounded-xl text-xs text-white placeholder-neutral-500 focus:border-[#E37500] outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filteredPackages.length === 0 && (
          <div className="p-8 text-center border border-dashed border-[#262626] rounded-2xl text-neutral-400 text-xs">
            No packages found matching "{searchQuery}".
          </div>
        )}
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="border border-[#262626] rounded-xl p-4 bg-[#121212]/60">
            {editingId === pkg.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Package Title</label>
                    <input
                      value={pkg.title}
                      onChange={(e) => handleUpdate(pkg.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Subtitle</label>
                    <input
                      value={pkg.subtitle}
                      onChange={(e) => handleUpdate(pkg.id, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Destination</label>
                    <input
                      value={pkg.destination}
                      onChange={(e) => handleUpdate(pkg.id, 'destination', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Duration (e.g. 7 Days)</label>
                    <input
                      value={pkg.duration}
                      onChange={(e) => handleUpdate(pkg.id, 'duration', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Price (e.g. ₹2,40,000)</label>
                    <input
                      value={pkg.startingPrice}
                      onChange={(e) => handleUpdate(pkg.id, 'startingPrice', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Tag / Category</label>
                    <input
                      value={pkg.tag}
                      onChange={(e) => handleUpdate(pkg.id, 'tag', e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField
                      label="Package Hero Cover Image"
                      value={pkg.image}
                      onChange={(url) => handleUpdate(pkg.id, 'image', url)}
                      aspectRatio="video"
                      helperText="Curated travel photo representing this itinerary package."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Features (Comma separated)</label>
                  <input
                    value={(pkg.features || []).join(', ')}
                    onChange={(e) =>
                      handleUpdate(
                        pkg.id,
                        'features',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Inclusions (Comma separated)</label>
                  <input
                    value={(pkg.inclusions || []).join(', ')}
                    onChange={(e) =>
                      handleUpdate(
                        pkg.id,
                        'inclusions',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg text-sm outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-[#E37500] text-white rounded-lg text-xs font-bold"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative group shrink-0">
                    {pkg.image ? (
                      <img src={pkg.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuickImagePkgId(pkg.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#E37500] rounded-xl transition-opacity text-[10px] font-bold cursor-pointer"
                      title="Quick Change Cover Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{pkg.title}</h4>
                    <p className="text-xs text-[#A3A3A3]/70">
                      {pkg.destination} • {pkg.duration} • <span className="text-[#E37500] font-semibold">{pkg.startingPrice}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuickImagePkgId(pkg.id)}
                    className="p-2 bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-[#E37500] rounded-lg transition-colors cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(pkg.id)}
                    className="p-2 bg-[#181818] hover:bg-[#262626] text-[#C66500] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Image Changer Modal for Package */}
      {quickImagePkgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E37500]" />
                <h3 className="text-sm font-bold text-white truncate max-w-xs">
                  Change Image: {packages.find((p) => p.id === quickImagePkgId)?.title}
                </h3>
              </div>
              <button
                onClick={() => setQuickImagePkgId(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadField
              label="Select or Upload New Cover Photo"
              value={packages.find((p) => p.id === quickImagePkgId)?.image || ''}
              onChange={(newUrl) => {
                handleUpdate(quickImagePkgId, 'image', newUrl);
              }}
              aspectRatio="video"
              helperText="Updates this package card image immediately."
            />

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button
                onClick={() => setQuickImagePkgId(null)}
                className="px-5 py-2 bg-[#E37500] hover:bg-[#C66500] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done Updating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------
// Subcomponent: ContentManager (Marquee, Testimonials, Experience Pillars)
// --------------------------------------------------------
function ContentManager({
  marquee,
  setMarquee,
  testimonials,
  setTestimonials,
  experiencePillars,
  setExperiencePillars,
  howItWorksSteps,
  setHowItWorksSteps,
  whyUsPillars,
  setWhyUsPillars,
}: {
  marquee: string[];
  setMarquee: React.Dispatch<React.SetStateAction<string[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  experiencePillars: ExperiencePillar[];
  setExperiencePillars: React.Dispatch<React.SetStateAction<ExperiencePillar[]>>;
  howItWorksSteps: HowItWorksStep[];
  setHowItWorksSteps: React.Dispatch<React.SetStateAction<HowItWorksStep[]>>;
  whyUsPillars: WhyUsPillar[];
  setWhyUsPillars: React.Dispatch<React.SetStateAction<WhyUsPillar[]>>;
}) {
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const handleAddTestimonial = () => {
    const newTest: TestimonialItem = {
      id: `review-${Date.now()}`,
      author: 'Pooja & Sameer Verma',
      rating: 5,
      quote:
        'Every little detail of our Swiss chalet and glacier helicopter flight was taken care of seamlessly. Absolute 5-star service from My Kind of Travel.',
      tripInfo: 'Honeymoon in Switzerland & Paris',
      year: '2025',
      initial: 'P',
    };
    setTestimonials([newTest, ...testimonials]);
    setEditingTestimonialId(newTest.id);
  };

  const handleUpdateTestimonial = (id: string, field: string, val: any) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Delete this client story?')) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* 1. Marquee Ticker */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-[#262626]">
          <h3 className="text-lg font-serif font-bold text-white">Marquee Ticker Items</h3>
          <p className="text-xs text-[#A3A3A3]/70 mt-0.5">
            Continuous moving ticker phrases below the hero banner. Separate items with commas.
          </p>
        </div>

        <div>
          <textarea
            rows={2}
            value={marquee.join(', ')}
            onChange={(e) =>
              setMarquee(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
            }
            className="w-full px-3.5 py-2 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500]"
          />
        </div>
      </div>

      {/* 2. Testimonials / Client Stories */}
      <div className="space-y-4 pt-4 border-t border-[#262626]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#262626]">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Client Stories & Reviews</h3>
            <p className="text-xs text-[#A3A3A3]/70 mt-0.5">
              Verified testimonials with traveller name, rating, and trip details.
            </p>
          </div>
          <button
            onClick={handleAddTestimonial}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E37500] hover:bg-[#C66500] text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>
        </div>

        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-[#121212] border border-[#262626]">
              {editingTestimonialId === t.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Traveller Name"
                      value={t.author}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'author', e.target.value)}
                      className="px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                    />
                    <input
                      placeholder="Trip Info (e.g. Honeymoon in Switzerland)"
                      value={t.tripInfo}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'tripInfo', e.target.value)}
                      className="px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Review Quote"
                    value={t.quote}
                    onChange={(e) => handleUpdateTestimonial(t.id, 'quote', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditingTestimonialId(null)}
                      className="px-3 py-1 bg-[#E37500] rounded-md text-xs font-bold text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.author}</h4>
                    <p className="text-xs text-[#A3A3A3]/60">{t.tripInfo}</p>
                    <p className="text-xs text-[#A3A3A3]/80 italic mt-1.5 line-clamp-2">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingTestimonialId(t.id)}
                      className="p-1.5 bg-[#181818] text-[#C66500] rounded-md"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 bg-red-950/40 text-red-400 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bespoke Experience Pillars */}
      <div className="space-y-4 pt-4 border-t border-[#262626]">
        <div className="pb-3 border-b border-[#262626]">
          <h3 className="text-lg font-serif font-bold text-white">Signature Experience Pillars</h3>
          <p className="text-xs text-[#A3A3A3]/70 mt-0.5">
            Bespoke travel categories (Honeymoons, Europe Rail, Corporate Retreats, Family Holidays, Wildlife) with photos, inclusions, and descriptions.
          </p>
        </div>

        <div className="space-y-4">
          {experiencePillars.map((pillar, idx) => (
            <div key={pillar.typeKey || idx} className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E37500] uppercase tracking-wider">
                  Pillar {idx + 1}: {pillar.title}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#262626] text-[#A3A3A3]/80 font-medium">
                  {pillar.number || `0${idx + 1}`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Title</label>
                  <input
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Subtitle</label>
                  <input
                    value={pillar.subtitle}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], subtitle: e.target.value };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploadField
                    label="Pillar Visual Photography"
                    value={pillar.image}
                    onChange={(url) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], image: url };
                      setExperiencePillars(updated);
                    }}
                    aspectRatio="video"
                    helperText="High-impact photography displayed on the experience showcase card."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-[#A3A3A3] block mb-1">
                    Signature Inclusions (comma-separated)
                  </label>
                  <input
                    value={(pillar.highlights || []).join(', ')}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = {
                        ...updated[idx],
                        highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. How It Works (Interactive Steps) */}
      <div className="space-y-4 pt-4 border-t border-[#262626]">
        <div className="pb-3 border-b border-[#262626]">
          <h3 className="text-lg font-serif font-bold text-white">How It Works Steps (Curated to Departure)</h3>
          <p className="text-xs text-[#A3A3A3]/70 mt-0.5">
            The 4-step concierge journey displayed on the homepage process section.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(howItWorksSteps || []).map((stepItem, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E37500]">
                  Step {stepItem.step || `0${idx + 1}`}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1D1D1D] text-neutral-400 font-semibold border border-[#262626]">
                  {stepItem.actionBadge || 'Process Step'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Title</label>
                  <input
                    value={stepItem.title}
                    onChange={(e) => {
                      const updated = [...howItWorksSteps];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setHowItWorksSteps(updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Action Badge</label>
                  <input
                    value={stepItem.actionBadge || ''}
                    onChange={(e) => {
                      const updated = [...howItWorksSteps];
                      updated[idx] = { ...updated[idx], actionBadge: e.target.value };
                      setHowItWorksSteps(updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Subtitle</label>
                <input
                  value={stepItem.subtitle || ''}
                  onChange={(e) => {
                    const updated = [...howItWorksSteps];
                    updated[idx] = { ...updated[idx], subtitle: e.target.value };
                    setHowItWorksSteps(updated);
                  }}
                  className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={stepItem.description}
                  onChange={(e) => {
                    const updated = [...howItWorksSteps];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    setHowItWorksSteps(updated);
                  }}
                  className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Why Us (Luxury Trust Pillars) */}
      <div className="space-y-4 pt-4 border-t border-[#262626]">
        <div className="pb-3 border-b border-[#262626]">
          <h3 className="text-lg font-serif font-bold text-white">Why Travel With Us (Trust Pillars)</h3>
          <p className="text-xs text-[#A3A3A3]/70 mt-0.5">
            The 4 distinctive value propositions highlighting expertise, security, and white-glove 24/7 care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(whyUsPillars || []).map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E37500]">
                  Pillar 0{idx + 1}: {pillar.title}
                </span>
                <span className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1">
                  Icon: <code className="text-[#E37500] font-mono">{pillar.iconName || 'UserCheck'}</code>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Title</label>
                  <input
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = [...whyUsPillars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setWhyUsPillars(updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Select Icon</label>
                  <select
                    value={pillar.iconName || 'UserCheck'}
                    onChange={(e) => {
                      const updated = [...whyUsPillars];
                      updated[idx] = { ...updated[idx], iconName: e.target.value };
                      setWhyUsPillars(updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                  >
                    <option value="UserCheck">UserCheck (Dedicated Expert)</option>
                    <option value="ShieldCheck">ShieldCheck (Fully Secure)</option>
                    <option value="PhoneCall">PhoneCall (24/7 Support)</option>
                    <option value="Sparkles">Sparkles (Truly Bespoke)</option>
                    <option value="Award">Award (Excellence)</option>
                    <option value="Heart">Heart (Passion)</option>
                    <option value="Compass">Compass (Navigation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={pillar.description}
                  onChange={(e) => {
                    const updated = [...whyUsPillars];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    setWhyUsPillars(updated);
                  }}
                  className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
