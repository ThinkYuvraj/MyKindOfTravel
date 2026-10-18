import React, { useState } from 'react';
import {
  CustomSection,
  CustomSectionItem,
  SectionCustomContent,
  HowItWorksStep,
  WhyUsPillar,
  ExperiencePillar,
} from '../types';
import { ImageUploadField } from './ImageUploadField';
import {
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  LayoutGrid,
  Megaphone,
  HelpCircle,
  Columns,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

export type AdminTab =
  | 'sections'
  | 'hero'
  | 'destinations'
  | 'packages'
  | 'gallery'
  | 'content'
  | 'leads'
  | 'settings';

interface SectionsManagerProps {
  sectionOrder: string[];
  setSectionOrder: React.Dispatch<React.SetStateAction<string[]>>;
  sectionVisibility: Record<string, boolean>;
  setSectionVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  customSections: CustomSection[];
  setCustomSections: React.Dispatch<React.SetStateAction<CustomSection[]>>;
  sectionHeaders?: Record<string, SectionCustomContent>;
  setSectionHeaders?: React.Dispatch<React.SetStateAction<Record<string, SectionCustomContent>>>;
  howItWorksSteps?: HowItWorksStep[];
  setHowItWorksSteps?: React.Dispatch<React.SetStateAction<HowItWorksStep[]>>;
  whyUsPillars?: WhyUsPillar[];
  setWhyUsPillars?: React.Dispatch<React.SetStateAction<WhyUsPillar[]>>;
  heroBgImage?: string;
  setHeroBgImage?: React.Dispatch<React.SetStateAction<string>>;
  heroTitle?: string;
  setHeroTitle?: React.Dispatch<React.SetStateAction<string>>;
  heroSubtitle?: string;
  setHeroSubtitle?: React.Dispatch<React.SetStateAction<string>>;
  heroBadge?: string;
  setHeroBadge?: React.Dispatch<React.SetStateAction<string>>;
  primaryButton?: string;
  setPrimaryButton?: React.Dispatch<React.SetStateAction<string>>;
  secondaryButton?: string;
  setSecondaryButton?: React.Dispatch<React.SetStateAction<string>>;
  experiencePillars?: ExperiencePillar[];
  setExperiencePillars?: React.Dispatch<React.SetStateAction<ExperiencePillar[]>>;
  onNavigateTab?: (tab: AdminTab) => void;
  setIsDirty?: (dirty: boolean) => void;
  onSaveAndPublish?: () => Promise<void>;
}

interface BuiltInSectionConfig {
  label: string;
  desc: string;
  defaultBadge: string;
  defaultTitle: string;
  defaultSubtitle: string;
  dedicatedTab?: AdminTab;
  tabLabel?: string;
  hasSpecialEditor?: 'howItWorks' | 'whyUs';
}

const BUILT_IN_SECTIONS: Record<string, BuiltInSectionConfig> = {
  hero: {
    label: 'Hero Banner',
    desc: 'Top marquee headline, travel badges, CTA buttons & background photography',
    defaultBadge: 'My Kind of Travel • Bespoke Journeys',
    defaultTitle: 'EXPLORE. DREAM. DISCOVER.',
    defaultSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
    dedicatedTab: 'hero',
    tabLabel: 'Edit Hero & Banner Media',
  },
  destinations: {
    label: 'Our Picked Locations',
    desc: 'Handpicked destination cards with flight corridors, pricing & guides',
    defaultBadge: 'Handpicked Guides & Journeys',
    defaultTitle: 'Our Picked Locations',
    defaultSubtitle: 'Explore world-renowned wonders, secret terraced hills, private island villas, and bucket-list cultural expeditions.',
    dedicatedTab: 'destinations',
    tabLabel: 'Manage All Destinations',
  },
  marquee: {
    label: 'Marquee Ticker',
    desc: 'Flowing animated ticker highlighting top travel hotspots and specializations',
    defaultBadge: 'Trending Destinations',
    defaultTitle: 'Direct Corridors & Specialist Tags',
    defaultSubtitle: 'Real-time flowing ribbon of luxury destinations from India.',
    dedicatedTab: 'hero',
    tabLabel: 'Manage Marquee Items',
  },
  radar: {
    label: 'Flight Route Radar',
    desc: 'Interactive flight corridor viewer with flight times and direct routes from India',
    defaultBadge: 'Direct Route Radar',
    defaultTitle: 'Bespoke Flight Corridors from India',
    defaultSubtitle: 'Preview flight times, curated connections, and signature on-ground luxury waiting for you at each destination.',
  },
  experiences: {
    label: 'Experience Pillars',
    desc: '6 distinct travel themes: Honeymoon, Family, Ultra-Luxury, Culinary & Adventure',
    defaultBadge: 'Tailored Travel Styles',
    defaultTitle: 'How do you want your journey to feel?',
    defaultSubtitle: 'Whether seeking quiet alpine solitude or bustling street markets, we shape each day around your tempo.',
    dedicatedTab: 'content',
    tabLabel: 'Manage 6 Experience Pillars',
  },
  howItWorks: {
    label: 'How It Works',
    desc: '4-step journey from initial spark to dream departure with 24/7 concierge',
    defaultBadge: 'Effortless Planning',
    defaultTitle: 'From First Spark to Unforgettable Return',
    defaultSubtitle: 'A transparent, four-step approach ensuring your holiday is seamless, private, and memorable.',
    hasSpecialEditor: 'howItWorks',
  },
  packages: {
    label: 'Popular Packages',
    desc: 'Ready-to-personalize itineraries with pricing, day breakdown, and inclusions',
    defaultBadge: 'Popular packages',
    defaultTitle: 'Curated journeys ready to personalise',
    defaultSubtitle: 'Proven itineraries designed for discerning travelers. Every package can be modified, upgraded, and reshuffled to match your exact dates and preferences.',
    dedicatedTab: 'packages',
    tabLabel: 'Manage Itineraries & Pricing',
  },
  gallery: {
    label: 'Wanderlust Gallery',
    desc: 'Visual photo mosaic filterable by Villas, Romance, Culture, Nature & Dining',
    defaultBadge: 'Visual Diary',
    defaultTitle: 'Moments Captured on Our Journeys',
    defaultSubtitle: 'A glimpse into the private villas, twilight dinners, and secluded landscapes crafted for our guests.',
    dedicatedTab: 'gallery',
    tabLabel: 'Manage Visual Gallery & Photos',
  },
  testimonials: {
    label: 'Client Stories',
    desc: 'Verified reviews from Indian couples, families, and solo travellers',
    defaultBadge: 'Traveller Stories',
    defaultTitle: 'Words from Our Discerning Guests',
    defaultSubtitle: 'Real experiences from honeymooners, families, and solo explorers who trusted us with their vacations.',
    dedicatedTab: 'content',
    tabLabel: 'Manage Client Reviews',
  },
  whyUs: {
    label: 'Why Choose Us',
    desc: 'Four core commitments: 100% Bespoke, <5 min WhatsApp concierge, verified stays, zero hidden fees',
    defaultBadge: 'The My Kind of Travel Difference',
    defaultTitle: 'Why Discerning Travellers Trust Us',
    defaultSubtitle: 'Direct insider access, verified boutique villas, and around-the-clock bespoke care from India to your destination.',
    hasSpecialEditor: 'whyUs',
  },
  contact: {
    label: 'Enquiry & Contact',
    desc: 'Lead generation form, direct WhatsApp/phone numbers and customer support hours',
    defaultBadge: 'Get in touch',
    defaultTitle: "Let's design your perfect trip",
    defaultSubtitle: "Share your travel dreams and we'll get back to you within 24 hours with a custom plan. No obligation, no pressure — just inspiration.",
    dedicatedTab: 'leads',
    tabLabel: 'View Incoming Inquiries CRM',
  },
};

const DEFAULT_HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: '01',
    title: 'Private Consultation',
    description: 'Tell us your dreams, tempo, and budget over WhatsApp or a personalized call with your dedicated holiday curator.',
    badge: 'Step 1 • Connect',
  },
  {
    step: '02',
    title: 'Tailored Master Blueprint',
    description: 'We draft a day-by-day itinerary with boutique stays, private transfers, and bespoke experiences tailored to you.',
    badge: 'Step 2 • Crafting',
  },
  {
    step: '03',
    title: 'Seamless Confirmations',
    description: 'We lock in flights, visas, 5-star handpicked hotels, skip-the-line tickets, and vetted on-ground chauffeurs.',
    badge: 'Step 3 • Lock-in',
  },
  {
    step: '04',
    title: 'Unscripted Wanderlust',
    description: 'Travel effortlessly with 24/7 WhatsApp concierge support, private guides, and round-the-clock peace of mind.',
    badge: 'Step 4 • Travel',
  },
];

const DEFAULT_WHY_US: WhyUsPillar[] = [
  {
    title: 'Zero Pre-Packaged Templates',
    description: 'Every journey is handcrafted from scratch. No cookie-cutter tour buses, no crowded tourist traps.',
    stat: '100% Bespoke',
  },
  {
    title: '24/7 India & Global Concierge',
    description: 'Your dedicated travel specialist is one WhatsApp tap away before, during, and after your entire journey.',
    stat: '< 5 Min Response',
  },
  {
    title: 'Vetted 5-Star & Boutique Partners',
    description: 'We only recommend hotels, villas, and private chauffeurs that have been rigorously inspected and vetted.',
    stat: '450+ Verified Stays',
  },
  {
    title: 'Transparent Pricing & Fair Value',
    description: 'Direct relationships with local destination management companies guarantee genuine value without hidden surcharges.',
    stat: 'Zero Hidden Fees',
  },
];

const SECTION_IMAGE_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    aspectRatio?: 'video' | 'wide' | 'square' | 'portrait';
    placeholder?: string;
  }
> = {
  hero: {
    title: 'Hero Panoramic Background & Visual Banner',
    description: 'The primary marquee panoramic visual displayed across the top hero banner of the live homepage.',
    aspectRatio: 'wide',
    placeholder: 'Select luxury preset, upload high-res image, or enter image URL',
  },
  experiences: {
    title: 'Experiences Section Background / Accent Banner',
    description: 'Atmospheric visual header for the curated travel styles and bespoke theme pillars.',
    aspectRatio: 'wide',
    placeholder: 'Select preset or paste image URL',
  },
  radar: {
    title: 'Flight Route Radar Section Accent / Map Graphic',
    description: 'Visual accent or global route graphic displayed above or behind the flight corridors.',
    aspectRatio: 'wide',
    placeholder: 'Paste route graphic or aviation landscape URL',
  },
  howItWorks: {
    title: 'How It Works Feature Visual',
    description: 'Editorial imagery illustrating the bespoke planning & private consultation process.',
    aspectRatio: 'video',
    placeholder: 'Select luxury preset or upload photo',
  },
  whyUs: {
    title: 'Why Discerning Travellers Trust Us Photography',
    description: 'Concierge, private aviation, or luxury hospitality imagery highlighting trust pillars.',
    aspectRatio: 'wide',
    placeholder: 'Select preset or enter photo URL',
  },
  destinations: {
    title: 'Destinations Section Header Banner',
    description: 'Header banner imagery for the featured world destinations section.',
    aspectRatio: 'wide',
    placeholder: 'Paste destination banner image URL',
  },
  packages: {
    title: 'Popular Packages Section Header Banner',
    description: 'Visual banner imagery for curated holiday itineraries.',
    aspectRatio: 'wide',
    placeholder: 'Paste packages banner image URL',
  },
  gallery: {
    title: 'Wanderlust Visual Gallery Section Header Banner',
    description: 'Featured photography banner for the mosaic gallery.',
    aspectRatio: 'wide',
    placeholder: 'Paste gallery banner image URL',
  },
  testimonials: {
    title: 'Client Stories Section Header Banner',
    description: 'Editorial traveler photo or banner displayed above client reviews.',
    aspectRatio: 'wide',
    placeholder: 'Paste traveler story banner URL',
  },
  contact: {
    title: 'Concierge Lounge & Consultation Photography',
    description: 'Visual imagery representing the 24/7 private concierge desk and booking consultation.',
    aspectRatio: 'wide',
    placeholder: 'Paste concierge lounge photo URL or select a preset',
  },
  marquee: {
    title: 'Marquee Ticker Accent Graphic',
    description: 'Optional subtle backdrop or brand graphic for the marquee ticker strip.',
    aspectRatio: 'wide',
    placeholder: 'Paste accent graphic URL',
  },
};

export const SectionsManager: React.FC<SectionsManagerProps> = ({
  sectionOrder,
  setSectionOrder,
  sectionVisibility,
  setSectionVisibility,
  customSections,
  setCustomSections,
  sectionHeaders = {},
  setSectionHeaders,
  howItWorksSteps = DEFAULT_HOW_IT_WORKS,
  setHowItWorksSteps,
  whyUsPillars = DEFAULT_WHY_US,
  setWhyUsPillars,
  heroBgImage,
  setHeroBgImage,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  heroBadge,
  setHeroBadge,
  primaryButton,
  setPrimaryButton,
  secondaryButton,
  setSecondaryButton,
  experiencePillars,
  setExperiencePillars,
  onNavigateTab,
  setIsDirty,
  onSaveAndPublish,
}) => {
  // Modal states
  const [editingBuiltInKey, setEditingBuiltInKey] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'content' | 'images'>('content');
  const [isPublishing, setIsPublishing] = useState(false);
  const [builtInForm, setBuiltInForm] = useState<SectionCustomContent>({
    badge: '',
    title: '',
    subtitle: '',
    image: '',
    backgroundImage: '',
    primaryButton: '',
    secondaryButton: '',
  });

  // Local copies for special sub-editors
  const [localSteps, setLocalSteps] = useState<HowItWorksStep[]>([]);
  const [localPillars, setLocalPillars] = useState<WhyUsPillar[]>([]);
  const [localExperiencePillars, setLocalExperiencePillars] = useState<ExperiencePillar[]>([]);

  // Custom section state
  const [editingCustomSection, setEditingCustomSection] = useState<CustomSection | null>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'visible' | 'hidden' | 'custom'>('all');

  // Helper to extract active preview image for a section
  const getSectionPreviewImage = (key: string): string | null => {
    if (key.startsWith('custom-')) {
      const sec = customSections.find((c) => c.id === key.replace('custom-', ''));
      return sec?.backgroundImage || sec?.items.find((item) => item.image)?.image || null;
    }
    if (sectionHeaders[key]?.image) {
      return sectionHeaders[key].image!;
    }
    if (key === 'hero' && heroBgImage) {
      return heroBgImage;
    }
    if (key === 'experiences' && experiencePillars && experiencePillars.length > 0) {
      return experiencePillars.find((p) => p.image)?.image || null;
    }
    return null;
  };

  // Open Built-in Editor
  const handleOpenBuiltInEditor = (key: string, initialTab: 'content' | 'images' = 'content') => {
    const config = BUILT_IN_SECTIONS[key];
    const currentHeader = sectionHeaders[key] || {};

    let currentImg = currentHeader.image || '';
    let currentBadge = currentHeader.badge;
    let currentTitle = currentHeader.title;
    let currentSubtitle = currentHeader.subtitle;
    let currentPrimaryBtn = currentHeader.primaryButton;
    let currentSecondaryBtn = currentHeader.secondaryButton;

    if (key === 'hero') {
      if (!currentImg && heroBgImage) currentImg = heroBgImage;
      if (currentBadge === undefined && heroBadge) currentBadge = heroBadge;
      if (currentTitle === undefined && heroTitle) currentTitle = heroTitle;
      if (currentSubtitle === undefined && heroSubtitle) currentSubtitle = heroSubtitle;
      if (!currentPrimaryBtn && primaryButton) currentPrimaryBtn = primaryButton;
      if (!currentSecondaryBtn && secondaryButton) currentSecondaryBtn = secondaryButton;
    }

    setBuiltInForm({
      badge: currentBadge !== undefined ? currentBadge : config?.defaultBadge || '',
      title: currentTitle !== undefined ? currentTitle : config?.defaultTitle || '',
      subtitle: currentSubtitle !== undefined ? currentSubtitle : config?.defaultSubtitle || '',
      image: currentImg,
      backgroundImage: currentHeader.backgroundImage || '',
      primaryButton: currentPrimaryBtn || 'START EXPLORING',
      secondaryButton: currentSecondaryBtn || 'PLAN TRIP',
    });

    if (key === 'howItWorks') {
      setLocalSteps(howItWorksSteps.length > 0 ? [...howItWorksSteps] : [...DEFAULT_HOW_IT_WORKS]);
    }
    if (key === 'whyUs') {
      setLocalPillars(whyUsPillars.length > 0 ? [...whyUsPillars] : [...DEFAULT_WHY_US]);
    }
    if (key === 'experiences' && experiencePillars) {
      setLocalExperiencePillars([...experiencePillars]);
    }

    setModalTab(initialTab);
    setEditingBuiltInKey(key);
  };

  // Save Built-in Editor Changes Locally
  const handleSaveBuiltInEditor = () => {
    if (!editingBuiltInKey) return;

    if (setSectionHeaders) {
      setSectionHeaders((prev) => ({
        ...prev,
        [editingBuiltInKey]: {
          badge: builtInForm.badge,
          title: builtInForm.title,
          subtitle: builtInForm.subtitle,
          image: builtInForm.image,
          backgroundImage: builtInForm.backgroundImage,
          primaryButton: builtInForm.primaryButton,
          secondaryButton: builtInForm.secondaryButton,
        },
      }));
    }

    if (editingBuiltInKey === 'hero') {
      if (setHeroBgImage) {
        setHeroBgImage(builtInForm.image || '');
      }
      if (setHeroTitle) {
        setHeroTitle(builtInForm.title || '');
      }
      if (setHeroSubtitle) {
        setHeroSubtitle(builtInForm.subtitle || '');
      }
      if (setHeroBadge) {
        setHeroBadge(builtInForm.badge || '');
      }
      if (setPrimaryButton && builtInForm.primaryButton) {
        setPrimaryButton(builtInForm.primaryButton);
      }
      if (setSecondaryButton && builtInForm.secondaryButton) {
        setSecondaryButton(builtInForm.secondaryButton);
      }
    }

    if (editingBuiltInKey === 'experiences' && setExperiencePillars) {
      setExperiencePillars(localExperiencePillars);
    }

    if (editingBuiltInKey === 'howItWorks' && setHowItWorksSteps) {
      setHowItWorksSteps(localSteps);
    }

    if (editingBuiltInKey === 'whyUs' && setWhyUsPillars) {
      setWhyUsPillars(localPillars);
    }

    if (setIsDirty) {
      setIsDirty(true);
    }

    setEditingBuiltInKey(null);
  };

  // Save Built-in & Immediately Publish
  const handleSaveAndPublishBuiltIn = async () => {
    handleSaveBuiltInEditor();
    if (onSaveAndPublish) {
      setIsPublishing(true);
      try {
        await onSaveAndPublish();
      } finally {
        setIsPublishing(false);
      }
    }
  };

  // Reset Built-in Section to Default
  const handleResetBuiltInToDefault = (key: string) => {
    const config = BUILT_IN_SECTIONS[key];
    if (!config) return;

    setBuiltInForm({
      badge: config.defaultBadge,
      title: config.defaultTitle,
      subtitle: config.defaultSubtitle,
      image: '',
      backgroundImage: '',
      primaryButton: 'START EXPLORING',
      secondaryButton: 'PLAN TRIP',
    });

    if (key === 'howItWorks') {
      setLocalSteps([...DEFAULT_HOW_IT_WORKS]);
    }
    if (key === 'whyUs') {
      setLocalPillars([...DEFAULT_WHY_US]);
    }
    if (setIsDirty) {
      setIsDirty(true);
    }
  };

  // Toggle Visibility
  const toggleVisibility = (key: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
    if (setIsDirty) {
      setIsDirty(true);
    }
  };

  // Move Section Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionOrder(newOrder);
    if (setIsDirty) {
      setIsDirty(true);
    }
  };

  // Move Section Down
  const moveDown = (index: number) => {
    if (index >= sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionOrder(newOrder);
    if (setIsDirty) {
      setIsDirty(true);
    }
  };

  // Initiate New Custom Section
  const handleStartCreateCustom = () => {
    const newId = `custom-${Date.now()}`;
    const newSection: CustomSection = {
      id: newId,
      title: 'Special Summer Escapes',
      subtitle: 'Handpicked boutique villas with private chefs and tailored excursions.',
      badgeText: 'Curated Collection',
      layout: 'grid-cards',
      theme: 'light',
      enabled: true,
      items: [
        {
          id: `item-${Date.now()}-1`,
          title: 'Amalfi Coast Cliffside Villa',
          subtitle: 'Positano, Italy',
          description: 'Private infinity pool overlooking the Mediterranean with concierge chauffeur.',
          badge: 'Exclusive',
          image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
          linkText: 'Explore Villa',
        },
      ],
    };
    setEditingCustomSection(newSection);
    setIsCreatingCustom(true);
  };

  // Save Custom Section Locally
  const handleSaveCustomSection = () => {
    if (!editingCustomSection) return;

    if (isCreatingCustom) {
      setCustomSections((prev) => [...prev, editingCustomSection]);
      setSectionOrder((prev) => [...prev, editingCustomSection.id]);
      setSectionVisibility((prev) => ({ ...prev, [editingCustomSection.id]: true }));
    } else {
      setCustomSections((prev) =>
        prev.map((s) => (s.id === editingCustomSection.id ? editingCustomSection : s))
      );
    }

    if (setIsDirty) {
      setIsDirty(true);
    }

    setEditingCustomSection(null);
    setIsCreatingCustom(false);
  };

  // Save Custom Section & Immediately Publish
  const handleSaveAndPublishCustom = async () => {
    handleSaveCustomSection();
    if (onSaveAndPublish) {
      setIsPublishing(true);
      try {
        await onSaveAndPublish();
      } finally {
        setIsPublishing(false);
      }
    }
  };

  // Delete Custom Section
  const handleDeleteCustomSection = (id: string) => {
    if (confirm('Are you sure you want to delete this custom section?')) {
      setCustomSections((prev) => prev.filter((s) => s.id !== id));
      setSectionOrder((prev) => prev.filter((k) => k !== id));
      setSectionVisibility((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (setIsDirty) {
        setIsDirty(true);
      }
    }
  };

  // Add Item to Editing Custom Section
  const handleAddItemToEditing = () => {
    if (!editingCustomSection) return;
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: 'New Highlight or Question',
      subtitle: '',
      description: 'Add detailed description or answer here.',
      badge: 'Feature',
      image: '',
      linkText: 'Learn More',
    };
    setEditingCustomSection({
      ...editingCustomSection,
      items: [...editingCustomSection.items, newItem],
    });
  };

  // Update Item in Editing Custom Section
  const handleUpdateEditingItem = (index: number, field: keyof CustomSectionItem, val: string) => {
    if (!editingCustomSection) return;
    const updated = [...editingCustomSection.items];
    updated[index] = { ...updated[index], [field]: val };
    setEditingCustomSection({ ...editingCustomSection, items: updated });
  };

  // Remove Item from Editing Custom Section
  const handleRemoveEditingItem = (index: number) => {
    if (!editingCustomSection) return;
    const updated = editingCustomSection.items.filter((_, i) => i !== index);
    setEditingCustomSection({ ...editingCustomSection, items: updated });
  };

  // Filtered section list
  const filteredOrder = sectionOrder.filter((key) => {
    const isCustom = key.startsWith('custom-');
    const customSec = isCustom ? customSections.find((s) => s.id === key) : null;
    const info = isCustom
      ? { label: customSec?.title || 'Custom Section', desc: customSec?.subtitle || '' }
      : BUILT_IN_SECTIONS[key] || { label: key, desc: '' };

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLabel = info.label.toLowerCase().includes(q);
      const matchDesc = info.desc.toLowerCase().includes(q);
      const matchKey = key.toLowerCase().includes(q);
      if (!matchLabel && !matchDesc && !matchKey) return false;
    }

    // Type filter
    const isVisible = sectionVisibility[key] !== false;
    if (filterType === 'visible' && !isVisible) return false;
    if (filterType === 'hidden' && isVisible) return false;
    if (filterType === 'custom' && !isCustom) return false;

    return true;
  });

  const totalVisible = sectionOrder.filter((k) => sectionVisibility[k] !== false).length;
  const totalHidden = sectionOrder.length - totalVisible;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2 text-[#E37500] font-bold text-xs uppercase tracking-widest mb-1.5">
            <Layers className="w-4 h-4" />
            <span>Modular Page Builder</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
            Homepage Sections Manager
          </h3>
          <p className="text-sm text-[#A3A3A3]/70 mt-1.5 max-w-2xl">
            Fully control every section on your live homepage. Reorder sections, toggle visibility,
            customize section headings, badges, and subtitles, or create dynamic custom layouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartCreateCustom}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E37500]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Custom Section</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#121212] border border-[#262626] rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections by name or keyword..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#181818] border border-[#262626] rounded-lg text-xs text-white placeholder-[#A3A3A3]/40 outline-none focus:border-[#E37500]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#A3A3A3]/50 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: `All (${sectionOrder.length})` },
            { id: 'visible', label: `Live (${totalVisible})` },
            { id: 'hidden', label: `Hidden (${totalHidden})` },
            { id: 'custom', label: `Custom (${customSections.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#E37500] text-white shadow-xs'
                  : 'bg-[#181818] text-[#A3A3A3]/70 hover:text-white hover:bg-[#262626]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {filteredOrder.length === 0 ? (
          <div className="p-8 text-center bg-[#121212]/60 border border-[#262626] rounded-xl text-[#A3A3A3]/60">
            <SlidersHorizontal className="w-8 h-8 text-[#E37500] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No sections found matching your query.</p>
          </div>
        ) : (
          filteredOrder.map((key) => {
            const actualIndex = sectionOrder.indexOf(key);
            const isCustom = key.startsWith('custom-');
            const customSec = isCustom ? customSections.find((s) => s.id === key) : null;
            const config = BUILT_IN_SECTIONS[key];

            const currentHeader = sectionHeaders[key];
            const previewImg = getSectionPreviewImage(key);
            const displayTitle = isCustom
              ? customSec?.title || 'Custom Section'
              : currentHeader?.title || config?.defaultTitle || key;
            const displayBadge = isCustom
              ? customSec?.badgeText || 'Custom'
              : currentHeader?.badge || config?.defaultBadge || '';
            const displayDesc = isCustom
              ? `Layout: ${customSec?.layout || 'grid-cards'} • ${customSec?.items?.length || 0} items`
              : config?.desc || 'Built-in section';

            const isVisible = sectionVisibility[key] !== false;

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border transition-all ${
                  isVisible
                    ? 'bg-[#121212]/90 border-[#262626] hover:border-[#E37500]/40 shadow-xs'
                    : 'bg-[#121212]/50 border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Position Number, Thumbnail, Info, and Status */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Position index badge */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <span className="w-8 h-8 rounded-lg bg-[#181818] text-[#E37500] border border-[#262626] text-xs font-mono font-bold flex items-center justify-center shadow-inner">
                        {actualIndex + 1}
                      </span>
                    </div>

                    {/* Section Thumbnail Preview */}
                    {previewImg ? (
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#262626] shadow-xs group/thumb">
                        <img
                          src={previewImg}
                          alt="Section photo preview"
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <span className="absolute bottom-0 right-0 p-0.5 bg-black/75 rounded-tl text-[8px] text-white">
                          <Camera className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[#181818] border border-[#262626]/80 text-[#A3A3A3]/30 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}

                    {/* Section Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-sm sm:text-base font-bold text-white truncate">
                          {config?.label || displayTitle}
                        </span>

                        {displayBadge && (
                          <span className="px-2 py-0.5 rounded-full bg-[#E37500]/15 text-[#C66500] border border-[#E37500]/30 text-[10px] uppercase tracking-wider font-bold">
                            {displayBadge}
                          </span>
                        )}

                        {isCustom ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#E37500]/20 text-[#E37500] border border-[#E37500]/30 text-[10px] uppercase tracking-wider font-bold">
                            Custom Section
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[#A3A3A3]/60 border border-white/10 text-[10px] uppercase tracking-wider font-medium">
                            Built-in
                          </span>
                        )}

                        {isVisible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E37500]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E37500] animate-pulse" />
                            Live on Site
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A3A3A3]/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3]/30" />
                            Hidden
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#A3A3A3]/60 truncate mt-1">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Move Up */}
                    <button
                      onClick={() => moveUp(actualIndex)}
                      disabled={actualIndex === 0}
                      title="Move section up"
                      className="p-2 rounded-lg bg-[#181818] hover:bg-[#262626] disabled:opacity-20 disabled:pointer-events-none text-[#A3A3A3] transition-colors border border-transparent hover:border-[#262626]"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveDown(actualIndex)}
                      disabled={actualIndex === sectionOrder.length - 1}
                      title="Move section down"
                      className="p-2 rounded-lg bg-[#181818] hover:bg-[#262626] disabled:opacity-20 disabled:pointer-events-none text-[#A3A3A3] transition-colors border border-transparent hover:border-[#262626]"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleVisibility(key)}
                      title={isVisible ? 'Hide this section from live homepage' : 'Show this section on live homepage'}
                      className={`p-2 rounded-lg transition-colors border ${
                        isVisible
                          ? 'bg-[#E37500]/20 border-[#E37500]/40 text-[#C66500] hover:bg-[#E37500]/30'
                          : 'bg-white/5 border-white/10 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Change Image Button */}
                    <button
                      onClick={() => {
                        if (isCustom && customSec) {
                          setEditingCustomSection(customSec);
                          setIsCreatingCustom(false);
                        } else {
                          handleOpenBuiltInEditor(key, 'images');
                        }
                      }}
                      title="Change, upload, or preview imagery for this section"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181818] hover:bg-[#262626] text-[#FFFFFF] hover:text-[#C66500] border border-[#262626] hover:border-[#E37500]/50 text-xs font-bold transition-all shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#E37500]" />
                      <span className="hidden sm:inline">Change Image</span>
                      <span className="sm:hidden">Photo</span>
                    </button>

                    {/* Edit Section Content Button */}
                    <button
                      onClick={() => {
                        if (isCustom && customSec) {
                          setEditingCustomSection(customSec);
                          setIsCreatingCustom(false);
                        } else {
                          handleOpenBuiltInEditor(key, 'content');
                        }
                      }}
                      title="Update section content, titles & details"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E37500]/20 hover:bg-[#E37500]/35 text-[#C66500] border border-[#E37500]/50 text-xs font-bold transition-all shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>

                    {/* If Custom, allow deleting */}
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteCustomSection(key)}
                        title="Delete custom section"
                        className="p-2 rounded-lg bg-[#121212] hover:bg-[#E37500]/20 text-[#A3A3A3] hover:text-[#E37500] border border-[#262626] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL 1: Built-in Section Content & Sub-editor ──────────────── */}
      {editingBuiltInKey && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E37500]/20 text-[#C66500] border border-[#E37500]/40 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Update Section: {BUILT_IN_SECTIONS[editingBuiltInKey]?.label || editingBuiltInKey}
                  </h3>
                  <p className="text-xs text-[#A3A3A3]/60">
                    Customize titles, badges, subtitles, and internal content.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResetBuiltInToDefault(editingBuiltInKey)}
                  title="Reset to original default texts"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#262626] text-xs text-[#A3A3A3]/70 hover:text-white border border-[#262626] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#E37500]" />
                  <span>Reset Default</span>
                </button>

                <button
                  onClick={() => setEditingBuiltInKey(null)}
                  className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#262626] text-[#A3A3A3]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
              <button
                type="button"
                onClick={() => setModalTab('content')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  modalTab === 'content'
                    ? 'bg-[#E37500] text-white shadow-md shadow-[#E37500]/20'
                    : 'bg-[#181818] text-[#A3A3A3]/70 hover:text-white border border-[#262626]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Content & Typography</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('images')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                  modalTab === 'images'
                    ? 'bg-[#E37500] text-white shadow-md shadow-[#E37500]/20'
                    : 'bg-[#181818] text-[#A3A3A3]/70 hover:text-white border border-[#262626]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Section Images & Media</span>
                {builtInForm.image && (
                  <span className="w-2 h-2 rounded-full bg-[#E37500] animate-pulse" />
                )}
              </button>
            </div>

            {/* TAB 1: Content & Typography */}
            {modalTab === 'content' && (
              <div className="space-y-6">
                {/* Quick jump to dedicated manager if available */}
            {BUILT_IN_SECTIONS[editingBuiltInKey]?.dedicatedTab && onNavigateTab && (
              <div className="p-3.5 rounded-xl bg-[#E37500]/10 border border-[#E37500]/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs text-[#C66500]">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>
                    Need to add or modify individual items (images, cards, prices)?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const targetTab = BUILT_IN_SECTIONS[editingBuiltInKey]?.dedicatedTab;
                    setEditingBuiltInKey(null);
                    if (targetTab) onNavigateTab(targetTab);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold shrink-0 transition-colors"
                >
                  <span>{BUILT_IN_SECTIONS[editingBuiltInKey]?.tabLabel || 'Open Dedicated Tab'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* General Header Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                  Section Badge / Tagline Eyebrow
                </label>
                <input
                  type="text"
                  value={builtInForm.badge || ''}
                  onChange={(e) => setBuiltInForm({ ...builtInForm, badge: e.target.value })}
                  placeholder="e.g. Handpicked Guides & Journeys"
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500] transition-colors"
                />
                <p className="text-[11px] text-[#A3A3A3]/50 mt-1">
                  Small pill tag displayed directly above the section headline.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                  Main Section Headline / Title
                </label>
                <input
                  type="text"
                  value={builtInForm.title || ''}
                  onChange={(e) => setBuiltInForm({ ...builtInForm, title: e.target.value })}
                  placeholder="e.g. Featured Destinations"
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm font-semibold outline-none focus:border-[#E37500] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                  Section Subtitle / Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={builtInForm.subtitle || ''}
                  onChange={(e) => setBuiltInForm({ ...builtInForm, subtitle: e.target.value })}
                  placeholder="Introductory text providing context for discerning travellers"
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500] transition-colors"
                />
              </div>

              {/* Special Button Config for Hero Banner */}
              {editingBuiltInKey === 'hero' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={builtInForm.primaryButton || ''}
                      onChange={(e) => setBuiltInForm({ ...builtInForm, primaryButton: e.target.value })}
                      placeholder="START EXPLORING"
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm font-semibold outline-none focus:border-[#E37500] transition-colors"
                    />
                    <p className="text-[11px] text-[#A3A3A3]/50 mt-1">Left accent button in the hero banner.</p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-1.5">
                      Secondary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={builtInForm.secondaryButton || ''}
                      onChange={(e) => setBuiltInForm({ ...builtInForm, secondaryButton: e.target.value })}
                      placeholder="PLAN TRIP"
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm font-semibold outline-none focus:border-[#E37500] transition-colors"
                    />
                    <p className="text-[11px] text-[#A3A3A3]/50 mt-1">Right glassmorphic button with arrow.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Special Sub-Editor: How It Works Steps */}
            {editingBuiltInKey === 'howItWorks' && (
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Interactive Planning Steps ({localSteps.length})</h4>
                    <p className="text-xs text-[#A3A3A3]/60">Customize the step titles and descriptions.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextNum = String(localSteps.length + 1).padStart(2, '0');
                      setLocalSteps([
                        ...localSteps,
                        {
                          step: nextNum,
                          title: 'New Step',
                          description: 'Step explanation goes here.',
                          badge: `Step ${localSteps.length + 1}`,
                        },
                      ]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-xs font-bold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {localSteps.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#E37500]">
                          Step #{idx + 1}
                        </span>
                        {localSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setLocalSteps(localSteps.filter((_, i) => i !== idx))}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Remove Step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#A3A3A3]/70 mb-1">
                            Step Badge
                          </label>
                          <input
                            type="text"
                            value={s.badge || ''}
                            onChange={(e) => {
                              const updated = [...localSteps];
                              updated[idx] = { ...updated[idx], badge: e.target.value };
                              setLocalSteps(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#A3A3A3]/70 mb-1">
                            Step Title
                          </label>
                          <input
                            type="text"
                            value={s.title}
                            onChange={(e) => {
                              const updated = [...localSteps];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setLocalSteps(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-[#A3A3A3]/70 mb-1">
                            Step Description
                          </label>
                          <textarea
                            rows={2}
                            value={s.description}
                            onChange={(e) => {
                              const updated = [...localSteps];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setLocalSteps(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Sub-Editor: Why Us Pillars */}
            {editingBuiltInKey === 'whyUs' && (
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Service Pillars & Trust Guarantees ({localPillars.length})</h4>
                    <p className="text-xs text-[#A3A3A3]/60">Customize your key client promises and stats.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalPillars([
                        ...localPillars,
                        {
                          title: 'New Promise',
                          description: 'Promise details.',
                          stat: '100% Quality',
                        },
                      ]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-xs font-bold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pillar</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {localPillars.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#E37500]">
                          Pillar #{idx + 1}
                        </span>
                        {localPillars.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setLocalPillars(localPillars.filter((_, i) => i !== idx))}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Remove Pillar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#A3A3A3]/70 mb-1">
                            Pillar Title
                          </label>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => {
                              const updated = [...localPillars];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setLocalPillars(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#A3A3A3]/70 mb-1">
                            Stat Badge (e.g. 100% Bespoke, &lt;5 Min Response)
                          </label>
                          <input
                            type="text"
                            value={p.stat || ''}
                            onChange={(e) => {
                              const updated = [...localPillars];
                              updated[idx] = { ...updated[idx], stat: e.target.value };
                              setLocalPillars(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-[#A3A3A3]/70 mb-1">
                            Pillar Description
                          </label>
                          <textarea
                            rows={2}
                            value={p.description}
                            onChange={(e) => {
                              const updated = [...localPillars];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setLocalPillars(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div>
            )}

            {/* TAB 2: Images & Photography */}
            {modalTab === 'images' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#E37500]" />
                      <span>
                        {SECTION_IMAGE_CONFIG[editingBuiltInKey]?.title || 'Section Visual & Photography'}
                      </span>
                    </h4>
                    {builtInForm.image && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E37500]/20 text-[#E37500] border border-[#E37500]/30 text-[10px] font-bold uppercase tracking-wider">
                        Custom Image Set
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A3A3A3]/60">
                    {SECTION_IMAGE_CONFIG[editingBuiltInKey]?.description ||
                      'Customize the imagery, photography, or backdrop banner for this section.'}
                  </p>
                </div>

                {/* Primary Image Upload Field for Section */}
                <ImageUploadField
                  label={SECTION_IMAGE_CONFIG[editingBuiltInKey]?.title || 'Section Photograph / Backdrop'}
                  value={builtInForm.image || ''}
                  onChange={(url) => setBuiltInForm({ ...builtInForm, image: url })}
                  aspectRatio={SECTION_IMAGE_CONFIG[editingBuiltInKey]?.aspectRatio || 'wide'}
                  placeholder={
                    SECTION_IMAGE_CONFIG[editingBuiltInKey]?.placeholder ||
                    'Select a travel preset, upload from device, or paste URL'
                  }
                  helperText={
                    editingBuiltInKey === 'hero'
                      ? 'This image serves as the main high-definition backdrop across the hero marquee.'
                      : editingBuiltInKey === 'about'
                      ? 'Featured atelier photography rendered directly beside the luxury travel philosophy.'
                      : 'High-definition photography or visual asset displayed in this section.'
                  }
                />

                {/* Special Experiences 6 Themes Sub-editor */}
                {editingBuiltInKey === 'experiences' && localExperiencePillars.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-[#262626]">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#E37500]" />
                        <span>Individual Experience Theme Photography (6 Themes)</span>
                      </h4>
                      <p className="text-xs text-[#A3A3A3]/60 mt-0.5">
                        Change the photograph for each of the 6 core experience cards on the homepage.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {localExperiencePillars.map((pillar, pIdx) => (
                        <div
                          key={pillar.number || pIdx}
                          className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white font-serif">
                              {pillar.number}. {pillar.title}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E37500] px-2 py-0.5 rounded-full bg-[#E37500]/10 border border-[#E37500]/20">
                              {pillar.typeKey}
                            </span>
                          </div>
                          <ImageUploadField
                            label={`Card Photo (${pillar.title})`}
                            value={pillar.image || ''}
                            onChange={(url) => {
                              const updated = [...localExperiencePillars];
                              updated[pIdx] = { ...updated[pIdx], image: url };
                              setLocalExperiencePillars(updated);
                            }}
                            aspectRatio="video"
                            placeholder="Select luxury preset or upload photo"
                            helperText={`Photo displayed on top of the ${pillar.title} card.`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct link to dedicated manager if available */}
                {BUILT_IN_SECTIONS[editingBuiltInKey]?.dedicatedTab && onNavigateTab && (
                  <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-white">Need to manage individual item photos?</h5>
                      <p className="text-[11px] text-[#A3A3A3]/60">
                        Open the dedicated manager to configure every single destination card, package itinerary, or gallery photo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetTab = BUILT_IN_SECTIONS[editingBuiltInKey]?.dedicatedTab;
                        setEditingBuiltInKey(null);
                        if (targetTab) onNavigateTab(targetTab);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold shrink-0 transition-colors"
                    >
                      <span>{BUILT_IN_SECTIONS[editingBuiltInKey]?.tabLabel || 'Open Dedicated Tab'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#262626]">
              <div className="text-xs text-neutral-400">
                <span>Select <b>Save & Publish Live</b> to sync changes directly to the live website.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBuiltInKey(null)}
                  disabled={isPublishing}
                  className="px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBuiltInEditor}
                  disabled={isPublishing}
                  className="px-4 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndPublishBuiltIn}
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E37500]/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Save & Publish Live</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Custom Section Editor ──────────────────────────────── */}
      {editingCustomSection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#E37500]" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    {isCreatingCustom ? 'Create New Custom Section' : 'Edit Custom Section'}
                  </h3>
                  <p className="text-xs text-[#A3A3A3]/60">Design a bespoke layout with custom media and cards.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCustomSection(null)}
                className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#262626] text-[#A3A3A3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout Archetype */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#A3A3A3] mb-2">
                Section Layout Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'grid-cards', name: 'Grid Cards', icon: LayoutGrid, desc: 'Cards with media & highlights' },
                  { id: 'banner-cta', name: 'Banner CTA', icon: Megaphone, desc: 'Full-width promotion strip' },
                  { id: 'faq', name: 'Q&A / FAQ', icon: HelpCircle, desc: 'Accordion knowledge base' },
                  { id: 'split-story', name: 'Split Story', icon: Columns, desc: 'Editorial image + narrative' },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = editingCustomSection.layout === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setEditingCustomSection({
                          ...editingCustomSection,
                          layout: type.id as any,
                        })
                      }
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-[#E37500]/20 border-[#E37500] text-white shadow-md'
                          : 'bg-[#121212] border-[#262626] text-[#A3A3A3]/70 hover:border-[#E37500]/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#C66500]' : 'text-neutral-400'}`} />
                      <div>
                        <div className="text-xs font-bold text-white">{type.name}</div>
                        <div className="text-[10px] text-[#A3A3A3]/60 mt-0.5">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#A3A3A3] mb-1">Section Badge / Eyebrow</label>
                <input
                  type="text"
                  value={editingCustomSection.badgeText || ''}
                  onChange={(e) =>
                    setEditingCustomSection({ ...editingCustomSection, badgeText: e.target.value })
                  }
                  placeholder="e.g. Limited Edition"
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A3A3A3] mb-1">Color Atmosphere</label>
                <select
                  value={editingCustomSection.theme}
                  onChange={(e) =>
                    setEditingCustomSection({
                      ...editingCustomSection,
                      theme: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500]"
                >
                  <option value="light">Crisp Light (Warm Cream & Linen)</option>
                  <option value="dark">Luxury Dark (Onyx Velvet)</option>
                  <option value="caramel">Cognac Caramel Glow</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#A3A3A3] mb-1">Section Heading Title</label>
                <input
                  type="text"
                  value={editingCustomSection.title}
                  onChange={(e) =>
                    setEditingCustomSection({ ...editingCustomSection, title: e.target.value })
                  }
                  placeholder="e.g. Private Island Retreats"
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#A3A3A3] mb-1">Subtitle / Context</label>
                <textarea
                  rows={2}
                  value={editingCustomSection.subtitle}
                  onChange={(e) =>
                    setEditingCustomSection({ ...editingCustomSection, subtitle: e.target.value })
                  }
                  placeholder="Brief introductory description for the section"
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#262626] text-white rounded-xl text-sm outline-none focus:border-[#E37500]"
                />
              </div>
            </div>

            {/* Section Background Media */}
            <div className="pt-2 border-t border-[#262626]">
              <ImageUploadField
                label="Section Background Photography (Optional Full-Width Backdrop)"
                value={editingCustomSection.backgroundImage || ''}
                onChange={(url) =>
                  setEditingCustomSection({ ...editingCustomSection, backgroundImage: url })
                }
                aspectRatio="wide"
                placeholder="Select luxury preset, upload high-res image, or enter image URL"
                helperText="Optional full-width background photo displayed behind this custom section with ambient glass overlay."
              />
            </div>

            {/* Section Items Manager */}
            <div className="space-y-3 pt-2 border-t border-[#262626]">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-bold text-[#A3A3A3]">
                  Content Items ({editingCustomSection.items.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddItemToEditing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-xs font-bold text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {editingCustomSection.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-[#121212] border border-[#262626] space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#E37500]">Item #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditingItem(idx)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Item Title / Question"
                        value={item.title}
                        onChange={(e) => handleUpdateEditingItem(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                      />
                      <input
                        placeholder="Subtitle or Location (optional)"
                        value={item.subtitle || ''}
                        onChange={(e) => handleUpdateEditingItem(idx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                      />
                      <input
                        placeholder="Badge (e.g. Popular, Included)"
                        value={item.badge || ''}
                        onChange={(e) => handleUpdateEditingItem(idx, 'badge', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                      />
                      <div className="sm:col-span-2">
                        <ImageUploadField
                          label="Item Photography / Media"
                          value={item.image || ''}
                          onChange={(url) => handleUpdateEditingItem(idx, 'image', url)}
                          aspectRatio="video"
                          placeholder="Select a travel preset or upload an image"
                          helperText="Card image or visual media for this section item."
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Description or Answer text"
                        value={item.description}
                        onChange={(e) => handleUpdateEditingItem(idx, 'description', e.target.value)}
                        className="sm:col-span-2 w-full px-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs text-white outline-none focus:border-[#E37500]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#262626]">
              <div className="text-xs text-neutral-400">
                <span>Save custom section and publish live to site.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setEditingCustomSection(null)}
                  disabled={isPublishing}
                  className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomSection}
                  disabled={isPublishing}
                  className="px-4 py-2 rounded-xl bg-[#262626] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndPublishCustom}
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E37500]/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Save & Publish Live</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
