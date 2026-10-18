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
  publishCms: (dataToPublish: Partial<CmsData>) => Promise<{ success: boolean; message?: string }>;
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
      const mergedPayload: CmsData = {
        ...cmsData,
        ...dataToPublish,
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

        return { success: true, message: 'All changes published & synced live across all pages!' };
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
    [cmsData, isLoading, hasUnsavedChanges, refreshCms, publishCms, heroData]
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
