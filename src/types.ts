export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  tag?: string;
  priceNote: string;
  image: string;
  description: string;
  highlights: string[];
  bestTime: string;
  idealFor: string;
}

export interface ExperiencePillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  image: string;
  highlights: string[];
  typeKey: string;
}

export interface TravelPackage {
  id: string;
  tag: string;
  badge?: string;
  title: string;
  subtitle: string;
  duration: string;
  destination: string;
  startingPrice: string;
  image: string;
  features: string[];
  inclusions: string[];
  dayHighlights: {
    day: number;
    title: string;
    details: string;
  }[];
}

export interface TestimonialItem {
  id: string;
  rating: number;
  quote: string;
  initial: string;
  author: string;
  tripInfo: string;
  year: string;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: 'All' | 'Stays' | 'Journeys' | 'Moments' | 'Gourmet';
  image: string;
  caption: string;
  aspect?: 'tall' | 'wide' | 'square';
}

export interface EnrichedPlace {
  id: string;
  title: string;
  propertySubtitle: string;
  location: string;
  country: string;
  region: 'Indian Ocean' | 'Europe' | 'Southeast Asia' | 'East Asia' | 'Middle East' | string;
  category: 'Stays' | 'Journeys' | 'Moments' | 'Gourmet' | string;
  theme: 'overwater' | 'alpine' | 'coastal' | 'heritage' | 'gourmet' | string;
  image: string;
  additionalImages?: string[];
  caption: string;
  highlights: string[];
  bestSeason: string;
  idealStay: string;
  transferNote: string;
  startingPriceNote: string;
  curatorNote: string;
  isFeatured?: boolean;
}

export interface EnquiryForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination: string;
  tripType: string;
  travelDates: string;
  guestCount: string;
  message: string;
}

export type BuiltInSectionKey =
  | 'hero'
  | 'destinations'
  | 'marquee'
  | 'about'
  | 'radar'
  | 'experiences'
  | 'vipPrivileges'
  | 'howItWorks'
  | 'packages'
  | 'gallery'
  | 'testimonials'
  | 'whyUs'
  | 'contact';

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  icon?: string;
  badge?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  layout: 'grid-cards' | 'banner-cta' | 'faq' | 'split-story';
  theme: 'light' | 'dark' | 'caramel';
  backgroundImage?: string;
  enabled: boolean;
  items: CustomSectionItem[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  subtitle?: string;
  description: string;
  actionBadge?: string;
  badge?: string;
}

export interface WhyUsPillar {
  title: string;
  description: string;
  iconName?: string;
  stat?: string;
}

export interface SectionCustomContent {
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  backgroundImage?: string;
}

export interface CMSData {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge?: string;
  heroBgImage?: string;
  primaryButton: string;
  secondaryButton: string;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  destinations: DestinationItem[];
  packages: TravelPackage[];
  marquee: string[];
  testimonials: TestimonialItem[];
  experiencePillars: ExperiencePillar[];
  gallery?: GalleryItem[];
  customSections: CustomSection[];
  howItWorksSteps?: HowItWorksStep[];
  whyUsPillars?: WhyUsPillar[];
  sectionHeaders?: Record<string, SectionCustomContent>;
  companyInfo: {
    name: string;
    tagline: string;
    phone: string;
    phoneRaw: string;
    email: string;
    website: string;
    supportHours: string;
    yearsCrafting: string;
    establishedYear: string;
    currentYear: string;
    promise: string;
    philosophy: string;
    standardText?: string;
  };
}

export interface InquiryLead {
  id: string;
  refId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination: string;
  tripType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted' | 'booked';
}
