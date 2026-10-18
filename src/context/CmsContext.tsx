import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  DESTINATIONS,
  POPULAR_PACKAGES,
  MARQUEE_ITEMS,
  TESTIMONIALS,
  EXPERIENCE_PILLARS,
  COMPANY_INFO,
  GALLERY_ITEMS,
  HOW_IT_WORKS_STEPS,
  WHY_US_PILLARS,
} from '../data/travelData';
import { CURATED_PLACES_DATA } from '../data/curatedPlacesData';
import { DestinationItem, TravelPackage, TestimonialItem, ExperiencePillar, GalleryItem, EnrichedPlace } from '../types';

export interface CmsData {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroBgImage: string;
  primaryButton: string;
  secondaryButton: string;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  destinations: DestinationItem[];
  packages: TravelPackage[];
  places: EnrichedPlace[];
  marquee: string[];
  testimonials: TestimonialItem[];
  experiencePillars: ExperiencePillar[];
  gallery: GalleryItem[];
  customSections: any[];
  companyInfo: typeof COMPANY_INFO;
  howItWorksSteps: typeof HOW_IT_WORKS_STEPS;
  whyUsPillars: typeof WHY_US_PILLARS;
  sectionHeaders: Record<string, any>;
  lastPublishedAt?: string;
  version?: number;
}

const DEFAULT_SECTION_ORDER = [
  'hero',
  'marquee',
  'howItWorks',
  'destinations',
  'experiences',
  'vipPrivileges',
  'packages',
  'gallery',
  'testimonials',
  'whyUs',
  'contact',
];

const DEFAULT_SECTION_VISIBILITY: Record<string, boolean> = {
  hero: true,
  destinations: true,
  marquee: true,
  experiences: true,
  vipPrivileges: true,
  howItWorks: true,
  packages: true,
  gallery: true,
  testimonials: true,
  whyUs: true,
  contact: true,
};

export const INITIAL_CMS_DATA: CmsData = {
  heroTitle: 'EXPLORE. DREAM. DISCOVER.',
  heroSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
  heroBadge: 'My Kind of Travel • Bespoke Journeys',
  heroBgImage: '',
  primaryButton: 'START EXPLORING',
  secondaryButton: 'PLAN TRIP',
  sectionOrder: DEFAULT_SECTION_ORDER,
  sectionVisibility: DEFAULT_SECTION_VISIBILITY,
  destinations: DESTINATIONS,
  packages: POPULAR_PACKAGES,
  places: CURATED_PLACES_DATA,
  marquee: MARQUEE_ITEMS,
  testimonials: TESTIMONIALS,
  experiencePillars: EXPERIENCE_PILLARS,
  gallery: GALLERY_ITEMS,
  customSections: [],
  companyInfo: COMPANY_INFO,
  howItWorksSteps: HOW_IT_WORKS_STEPS,
  whyUsPillars: WHY_US_PILLARS,
  sectionHeaders: {},
  lastPublishedAt: new Date().toISOString(),
  version: 1,
};

interface CmsContextType {
  cmsData: CmsData;
  isLoading: boolean;
  lastPublishedAt: string | null;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  refreshCms: () => Promise<void>;
  publishCms: (dataToPublish: Partial<CmsData>) => Promise<{ success: boolean; message?: string; git?: any }>;
  syncToGitHub: () => Promise<{ success: boolean; pushed: boolean; message: string; commitHash?: string }>;
  // Fast direct accessors
  destinations: DestinationItem[];
  packages: TravelPackage[];
  places: EnrichedPlace[];
  testimonials: TestimonialItem[];
  experiencePillars: ExperiencePillar[];
  gallery: GalleryItem[];
  companyInfo: typeof COMPANY_INFO;
  marquee: string[];
  howItWorksSteps: typeof HOW_IT_WORKS_STEPS;
  whyUsPillars: typeof WHY_US_PILLARS;
  sectionHeaders: Record<string, any>;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  heroData: {
    heroTitle: string;
    heroSubtitle: string;
    heroBadge: string;
    heroBgImage: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

const CmsContext = createContext<CmsContextType | null>(null);

const CMS_BROADCAST_CHANNEL = 'mkt_cms_realtime_sync';

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CmsData>(() => {
    // Attempt hydration from localStorage cache for sub-millisecond initial render
    try {
      const cached = localStorage.getItem('mkt_cached_cms_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...INITIAL_CMS_DATA,
          ...parsed,
          heroTitle: parsed.heroTitle?.trim() || INITIAL_CMS_DATA.heroTitle,
          heroSubtitle: parsed.heroSubtitle?.trim() || INITIAL_CMS_DATA.heroSubtitle,
          heroBadge: parsed.heroBadge?.trim() || INITIAL_CMS_DATA.heroBadge,
          primaryButton: parsed.primaryButton?.trim() || INITIAL_CMS_DATA.primaryButton,
          secondaryButton: parsed.secondaryButton?.trim() || INITIAL_CMS_DATA.secondaryButton,
          places: parsed.places && parsed.places.length > 0 ? parsed.places : INITIAL_CMS_DATA.places,
        };
      }
    } catch (e) {
      // Ignore cache parse errors
    }
    return INITIAL_CMS_DATA;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Synchronize state across browser tabs & sessions
  const applyCmsPayload = useCallback((payload: Partial<CmsData>) => {
    setCmsData((prev) => {
      const updated: CmsData = {
        ...prev,
        ...payload,
        heroTitle: payload.heroTitle?.trim() || prev.heroTitle || INITIAL_CMS_DATA.heroTitle,
        heroSubtitle: payload.heroSubtitle?.trim() || prev.heroSubtitle || INITIAL_CMS_DATA.heroSubtitle,
        heroBadge: payload.heroBadge?.trim() || prev.heroBadge || INITIAL_CMS_DATA.heroBadge,
        primaryButton: payload.primaryButton?.trim() || prev.primaryButton || INITIAL_CMS_DATA.primaryButton,
        secondaryButton: payload.secondaryButton?.trim() || prev.secondaryButton || INITIAL_CMS_DATA.secondaryButton,
        destinations: payload.destinations || prev.destinations || INITIAL_CMS_DATA.destinations,
        packages: payload.packages || prev.packages || INITIAL_CMS_DATA.packages,
        places: payload.places && payload.places.length > 0 ? payload.places : (prev.places || INITIAL_CMS_DATA.places),
        testimonials: payload.testimonials || prev.testimonials || INITIAL_CMS_DATA.testimonials,
        experiencePillars: payload.experiencePillars || prev.experiencePillars || INITIAL_CMS_DATA.experiencePillars,
        gallery: payload.gallery || prev.gallery || INITIAL_CMS_DATA.gallery,
        companyInfo: { ...prev.companyInfo, ...(payload.companyInfo || {}) },
        howItWorksSteps: payload.howItWorksSteps || prev.howItWorksSteps || INITIAL_CMS_DATA.howItWorksSteps,
        whyUsPillars: payload.whyUsPillars || prev.whyUsPillars || INITIAL_CMS_DATA.whyUsPillars,
        sectionHeaders: payload.sectionHeaders || prev.sectionHeaders || {},
        lastPublishedAt: payload.lastPublishedAt || new Date().toISOString(),
      };

      try {
        localStorage.setItem('mkt_cached_cms_data', JSON.stringify(updated));
      } catch (e) {
        // storage quota exceeded or disabled
      }
      return updated;
    });
  }, []);

  const refreshCms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        applyCmsPayload(data);
      }
    } catch (err) {
      console.warn('[CMS Sync] Failed to fetch /api/cms, using current state', err);
    } finally {
      setIsLoading(false);
    }
  }, [applyCmsPayload]);

  // Initial fetch on mount
  useEffect(() => {
    refreshCms();
  }, [refreshCms]);

  // Setup cross-tab and in-memory broadcast listeners for real-time sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(CMS_BROADCAST_CHANNEL);
        channel.onmessage = (event) => {
          if (event.data?.type === 'CMS_PUBLISHED' && event.data?.payload) {
            applyCmsPayload(event.data.payload);
          }
        };
      }
    } catch (e) {
      // BroadcastChannel unsupported
    }

    const handleCustomEvent = (event: Event) => {
      const customEvt = event as CustomEvent;
      if (customEvt.detail) {
        applyCmsPayload(customEvt.detail);
      }
    };

    window.addEventListener('mkt:cms:published', handleCustomEvent);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener('mkt:cms:published', handleCustomEvent);
    };
  }, [applyCmsPayload]);

  // Publish CMS changes to backend and immediately broadcast to all subscribers
  const publishCms = useCallback(
    async (dataToPublish: Partial<CmsData>) => {
      const cleanHeroTitle = dataToPublish.heroTitle?.trim() || cmsData.heroTitle || INITIAL_CMS_DATA.heroTitle;
      const cleanHeroSubtitle = dataToPublish.heroSubtitle?.trim() || cmsData.heroSubtitle || INITIAL_CMS_DATA.heroSubtitle;
      const cleanHeroBadge = dataToPublish.heroBadge?.trim() || cmsData.heroBadge || INITIAL_CMS_DATA.heroBadge;
      const cleanPrimaryBtn = dataToPublish.primaryButton?.trim() || cmsData.primaryButton || INITIAL_CMS_DATA.primaryButton;
      const cleanSecondaryBtn = dataToPublish.secondaryButton?.trim() || cmsData.secondaryButton || INITIAL_CMS_DATA.secondaryButton;

      const cleanHeaders = { ...(cmsData.sectionHeaders || {}), ...(dataToPublish.sectionHeaders || {}) };
      if (cleanHeaders.hero) {
        cleanHeaders.hero = {
          ...cleanHeaders.hero,
          title: cleanHeaders.hero.title?.trim() || cleanHeroTitle,
          subtitle: cleanHeaders.hero.subtitle?.trim() || cleanHeroSubtitle,
          badge: cleanHeaders.hero.badge?.trim() || cleanHeroBadge,
          primaryButton: cleanHeaders.hero.primaryButton?.trim() || cleanPrimaryBtn,
          secondaryButton: cleanHeaders.hero.secondaryButton?.trim() || cleanSecondaryBtn,
        };
      }

      const mergedPayload: CmsData = {
        ...cmsData,
        ...dataToPublish,
        heroTitle: cleanHeroTitle,
        heroSubtitle: cleanHeroSubtitle,
        heroBadge: cleanHeroBadge,
        primaryButton: cleanPrimaryBtn,
        secondaryButton: cleanSecondaryBtn,
        sectionHeaders: cleanHeaders,
        lastPublishedAt: new Date().toISOString(),
        version: (cmsData.version || 1) + 1,
      };

      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mergedPayload),
        });

        const contentType = res.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (!isJson) {
          // Server returned HTML (e.g. index.html from SPA rewrite or Apache 404/500 page)
          // Persist locally so user edits are NEVER lost
          applyCmsPayload(mergedPayload);
          setHasUnsavedChanges(false);

          try {
            if (typeof BroadcastChannel !== 'undefined') {
              const channel = new BroadcastChannel(CMS_BROADCAST_CHANNEL);
              channel.postMessage({ type: 'CMS_PUBLISHED', payload: mergedPayload });
              channel.close();
            }
          } catch (e) {}

          window.dispatchEvent(new CustomEvent('mkt:cms:published', { detail: mergedPayload }));

          return {
            success: true,
            message:
              'Changes saved locally in browser! (Note: The server at /api/cms returned HTML instead of JSON. Ensure the Node.js backend is running to persist to disk).',
          };
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error (${res.status}) while saving CMS data`);
        }

        const json = await res.json();
        const finalData = json.data || mergedPayload;

        // Apply locally
        applyCmsPayload(finalData);
        setHasUnsavedChanges(false);

        // Broadcast to other tabs & windows
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(CMS_BROADCAST_CHANNEL);
            channel.postMessage({ type: 'CMS_PUBLISHED', payload: finalData });
            channel.close();
          }
        } catch (e) {}

        // Dispatch local event
        window.dispatchEvent(new CustomEvent('mkt:cms:published', { detail: finalData }));

        const message = json.git?.pushed
          ? `All changes published & pushed to GitHub (${json.git.commitHash})!`
          : json.message || 'All changes published & synced live across all pages!';

        return { success: true, message, git: json.git };
      } catch (err: any) {
        console.error('[CMS Publish Error]:', err);
        // Fallback: Still persist in localStorage so user work is never lost
        applyCmsPayload(mergedPayload);
        setHasUnsavedChanges(false);

        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(CMS_BROADCAST_CHANNEL);
            channel.postMessage({ type: 'CMS_PUBLISHED', payload: mergedPayload });
            channel.close();
          }
        } catch (e) {}

        window.dispatchEvent(new CustomEvent('mkt:cms:published', { detail: mergedPayload }));

        return {
          success: true,
          message: `Changes saved locally in browser! (Server sync notice: ${err?.message || 'Server connection failed'})`,
        };
      }
    },
    [cmsData, applyCmsPayload]
  );

  const syncToGitHub = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/git-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          pushed: false,
          message: 'Server returned HTML instead of JSON. Ensure the Node.js backend is running.',
        };
      }
      return await res.json();
    } catch (e: any) {
      return {
        success: false,
        pushed: false,
        message: e?.message || 'Network error triggering git push',
      };
    }
  }, []);

  const heroData = useMemo(
    () => ({
      heroTitle: cmsData.heroTitle,
      heroSubtitle: cmsData.heroSubtitle,
      heroBadge: cmsData.heroBadge,
      heroBgImage: cmsData.heroBgImage,
      primaryButton: cmsData.primaryButton,
      secondaryButton: cmsData.secondaryButton,
    }),
    [
      cmsData.heroTitle,
      cmsData.heroSubtitle,
      cmsData.heroBadge,
      cmsData.heroBgImage,
      cmsData.primaryButton,
      cmsData.secondaryButton,
    ]
  );

  const value = useMemo<CmsContextType>(
    () => ({
      cmsData,
      isLoading,
      lastPublishedAt: cmsData.lastPublishedAt || null,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      refreshCms,
      publishCms,
      syncToGitHub,
      destinations: cmsData.destinations,
      packages: cmsData.packages,
      places: cmsData.places,
      testimonials: cmsData.testimonials,
      experiencePillars: cmsData.experiencePillars,
      gallery: cmsData.gallery,
      companyInfo: cmsData.companyInfo,
      marquee: cmsData.marquee,
      howItWorksSteps: cmsData.howItWorksSteps,
      whyUsPillars: cmsData.whyUsPillars,
      sectionHeaders: cmsData.sectionHeaders,
      sectionOrder: cmsData.sectionOrder,
      sectionVisibility: cmsData.sectionVisibility,
      heroData,
    }),
    [cmsData, isLoading, hasUnsavedChanges, refreshCms, publishCms, syncToGitHub, heroData]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
};

export function useCms(): CmsContextType {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
