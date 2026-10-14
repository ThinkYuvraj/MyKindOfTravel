import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnquiryModal } from '../components/EnquiryModal';
import { WishlistModal } from '../components/WishlistModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { GlassImage } from '../components/GlassImage';
import { useWishlist } from '../context/WishlistContext';
import { useCms } from '../context/CmsContext';
import { useScrollPagination } from '../utils/useScrollPagination';
import { ScrollPaginationFooter } from '../components/ScrollPaginationFooter';
import {
  Search,
  MapPin,
  Camera,
  Compass,
  ArrowUpRight,
  Heart,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
  Clock,
  Plane,
  Award,
  ShieldCheck,
  PhoneCall,
  Crown,
  Eye,
  Share2,
} from 'lucide-react';

export interface EnrichedPlace {
  id: string;
  title: string;
  propertySubtitle: string;
  location: string;
  country: string;
  region: 'Indian Ocean' | 'Europe' | 'Southeast Asia' | 'East Asia' | 'Middle East';
  category: 'Stays' | 'Journeys' | 'Moments' | 'Gourmet';
  theme: 'overwater' | 'alpine' | 'coastal' | 'heritage' | 'gourmet';
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

export const CURATED_PLACES_DATA: EnrichedPlace[] = [
  {
    id: 'place-soneva-jani',
    title: 'Overwater Lagoon Reserve with Ocean Slide',
    propertySubtitle: 'Soneva Jani, Medhufaru Island',
    location: 'Noonu Atoll, Maldives',
    country: 'Maldives',
    region: 'Indian Ocean',
    category: 'Stays',
    theme: 'overwater',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    caption: 'Two-storey overwater sanctuary featuring a curved water slide straight into the turquoise lagoon, retractable master bedroom roof for night stargazing, and private glass sea deck.',
    highlights: ['Retractable Stargazing Roof', 'Private Lagoon Water Slide', 'Barefoot Butler Service', 'Catamaran Net Lounges'],
    bestSeason: 'November to April (Dry Sun & Clear Waters)',
    idealStay: '5 to 7 Nights',
    transferNote: '35-minute scenic seaplane from Velana International (Malé)',
    startingPriceNote: 'Starting from ₹2,40,000 / Night',
    curatorNote: 'Our top recommendation for milestone honeymoons and romantic anniversaries where sheer privacy is paramount.',
    isFeatured: true,
  },
  {
    id: 'place-zermatt-matterhorn',
    title: 'Matterhorn Alpine Glass Chalet Suite',
    propertySubtitle: 'Omnia Mountain Sanctuary',
    location: 'Zermatt, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Stays',
    theme: 'alpine',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    caption: 'Floor-to-ceiling glass alpine retreat perched high on the rock face above Zermatt, offering unobstructed panoramic views of the iconic Matterhorn summit from your private cedar hot tub.',
    highlights: ['Direct Matterhorn Summit Views', 'Private Open Fireplace', 'Alpine Spa & Cedar Sauna', 'Private Electric Chauffeur'],
    bestSeason: 'Dec – Mar (Ski & Snow) & Jun – Sep (Lush Alpine Hikes)',
    idealStay: '4 to 6 Nights',
    transferNote: 'First-class Matterhorn Gotthard Bahn from Zurich or Geneva',
    startingPriceNote: 'Starting from ₹1,80,000 / Night',
    curatorNote: 'The indoor-outdoor thermal infinity pool facing the snow-capped peak is unforgettable at sunset.',
    isFeatured: true,
  },
  {
    id: 'place-hanging-gardens-bali',
    title: 'Two-Tier Jungle Infinity Hanging Sanctuary',
    propertySubtitle: 'Ayung River Valley Private Enclave',
    location: 'Ubud, Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    category: 'Stays',
    theme: 'coastal',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sensational cantilevered infinity pool suspended dramatically above the sacred Ayung River valley jungle mist, accompanied by morning yoga pavilions and private Balinese temple blessings.',
    highlights: ['Cantilevered Split-Level Pool', 'Private Bamboo Villa Pavilions', 'Floating Sunrise Champagne Breakfast', 'Ayung River Valley Vistas'],
    bestSeason: 'April to October (Dry & Breeze Season)',
    idealStay: '3 to 5 Nights',
    transferNote: '75-minute luxury Mercedes chauffeur from Denpasar Airport',
    startingPriceNote: 'Starting from ₹85,000 / Night',
    curatorNote: 'Wake up to the sounds of mist clearing through the rainforest canopy with total seclusion.',
    isFeatured: true,
  },
  {
    id: 'place-le-sirenuse-positano',
    title: 'Pastel Cliffside Heritage Villa & Terrace',
    propertySubtitle: 'Le Sirenuse Boutique Haven',
    location: 'Positano, Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    category: 'Stays',
    theme: 'coastal',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    caption: 'Legendary clifftop suites bathed in Mediterranean sunshine, adorned with antique Neapolitan majolica tiles, lemon trees, and private balconies directly overlooking the pastel cascade of Positano.',
    highlights: ['Private Balcony Over Positano Bay', 'Private Riva Yacht Charters to Capri', 'Michelin-Starred Champagne Bar', 'Handmade Vietri Ceramics'],
    bestSeason: 'May to October',
    idealStay: '4 to 6 Nights',
    transferNote: 'Private chauffeur along the Amalfi cliff road or private boat from Naples',
    startingPriceNote: 'Starting from ₹2,10,000 / Night',
    curatorNote: 'Indulge in an evening aperitivo at Franco’s Bar overlooking the golden hues reflecting off the bay.',
    isFeatured: true,
  },
  {
    id: 'place-hoshinoya-kyoto',
    title: 'Riverside Ryokan & Secluded Forest Onsen',
    propertySubtitle: 'Hoshinoya Arashiyama River Retreat',
    location: 'Kyoto, Japan',
    country: 'Japan',
    region: 'East Asia',
    category: 'Stays',
    theme: 'heritage',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Accessible only by private wooden riverboat gliding through emerald gorges, this centuries-old riverside sanctuary offers handcrafted tatami pavilions, private cedar hot tubs, and authentic Kaiseki dining.',
    highlights: ['Private Riverboat Arrival', 'Seasonal Kaiseki Multi-Course', 'Cypress Wood Onsen Baths', 'Arashiyama Bamboo Grove Access'],
    bestSeason: 'March to May (Sakura Blossoms) & Oct to Nov (Autumn Maple)',
    idealStay: '3 to 5 Nights',
    transferNote: 'Private car from Kansai International or 15 mins from Kyoto Station',
    startingPriceNote: 'Starting from ₹1,65,000 / Night',
    curatorNote: 'A profound immersion in Japanese tranquility where modern stress dissolves into river mist.',
  },
  {
    id: 'place-cappadocia-dawn',
    title: 'Dawn Above the Fairy Valleys & Hot Air Balloons',
    propertySubtitle: 'Göreme Valley Cave Suite Viewpoint',
    location: 'Göreme, Cappadocia',
    country: 'Turkey',
    region: 'Europe',
    category: 'Moments',
    theme: 'heritage',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
    caption: 'Private rooftop terrace dressed in Turkish kilim carpets and silver samovars, watching over a hundred colourful hot air balloons gently rise across ancient volcanic tufa spires at daybreak.',
    highlights: ['Private Sunrise Balloon Flight', 'Hand-Carved Volcanic Cave Suite', 'Champagne Breakfast on Carpet Terrace', 'Underground City Private Guide'],
    bestSeason: 'April to June & September to November',
    idealStay: '3 Nights',
    transferNote: '45-minute private chauffeur from Nevşehir Kapadokya Airport (NAV)',
    startingPriceNote: 'Starting from ₹75,000 / Night',
    curatorNote: 'We secure the highest panoramic suite terrace in the valley for uncrowded, private photography.',
  },
  {
    id: 'place-glacier-express',
    title: 'Glacier Express Excellence Class Panoramic Route',
    propertySubtitle: 'The Slowest Express Train in the World',
    location: 'Zermatt to St. Moritz',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Journeys',
    theme: 'alpine',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'An unforgettable 8-hour scenic voyage through 291 bridges and 91 tunnels across the Swiss Alps in ultra-exclusive Excellence Class with personal concierge, guaranteed window seats, and 5-course gourmet dining.',
    highlights: ['Guaranteed First-Class Window Seat', '5-Course Swiss Wine Pairing Menu', 'Exclusive Glacier Bar on Board', 'Rhine Gorge & Oberalp Pass Views'],
    bestSeason: 'Year-Round (Winter Wonderland in Jan-Mar, Alpine Green in Jun-Aug)',
    idealStay: '1 Day Epic Journey (Paired with Zermatt & St. Moritz Stays)',
    transferNote: 'Board directly from Zermatt or St. Moritz rail terminal',
    startingPriceNote: 'Starting from ₹85,000 / Person',
    curatorNote: 'Excellence Class is limited to just 20 privileged seats per train. We secure bookings months in advance.',
  },
  {
    id: 'place-santorini-oia',
    title: 'Caldera Cliff Cave Jacuzzi & Golden Hour Sunset',
    propertySubtitle: 'Canaves Oia Epitome Luxury Suites',
    location: 'Oia, Santorini',
    country: 'Greece',
    region: 'Europe',
    category: 'Moments',
    theme: 'coastal',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    caption: 'Perched on the volcanic rim of the Santorini Caldera, featuring private whitewashed cliff-edge cave plunge pools where you savor chilled Assyrtiko wine as the sun melts into the cobalt Aegean.',
    highlights: ['Private Caldera Plunge Pool', 'Unobstructed Oia Sunset Views', 'Private Catamaran Sunset Sailing', 'Boutique Volcanic Wine Tasting'],
    bestSeason: 'May to October (Sunny & Vibrant)',
    idealStay: '4 to 6 Nights',
    transferNote: '25-minute VIP Mercedes transfer from Thira Airport (JTR)',
    startingPriceNote: 'Starting from ₹1,45,000 / Night',
    curatorNote: 'Located just outside the crowded walking path so you enjoy total quiet and uninterrupted sunset views.',
  },
  {
    id: 'place-riva-amalfi',
    title: 'Private Riva Speedboat Faraglioni Charter',
    propertySubtitle: 'Custom Mediterranean Sea Excursion',
    location: 'Amalfi Coast & Capri',
    country: 'Italy',
    region: 'Europe',
    category: 'Journeys',
    theme: 'coastal',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    caption: 'Skim across the sparkling Gulf of Salerno aboard a mahogany Riva Dolceriva speedboat, cruising past emerald sea caves, private Capri coves, and dining at secluded clifftop restaurants accessible only by boat.',
    highlights: ['Private Riva Yacht & Captain', 'Secluded Blue & Green Grotto Visits', 'Champagne & Fresh Antipasti Onboard', 'Cliffside Lunch at Conca del Sogno'],
    bestSeason: 'June to September',
    idealStay: 'Full Day Private Charter',
    transferNote: 'Direct boarding from Positano, Amalfi, or Capri marina',
    startingPriceNote: 'Starting from ₹2,20,000 / Day Charter',
    curatorNote: 'The ultimate way to explore Capri without the crowded public ferry queues.',
  },
  {
    id: 'place-michelin-paris',
    title: 'Private Balcony Michelin Dining Facing Eiffel Tower',
    propertySubtitle: 'Shangri-La Terrace Panorama',
    location: 'Paris, France',
    country: 'France',
    region: 'Europe',
    category: 'Gourmet',
    theme: 'gourmet',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    caption: 'A bespoke 7-course culinary symphony prepared by private executive chefs and served on your private suite terrace directly facing the twinkling lights of the Eiffel Tower across the Seine.',
    highlights: ['Private Eiffel Tower Terrace', 'Sommelier-Selected French Vintages', 'Custom 7-Course Caviar & Truffle Menu', 'Dedicated Personal Butler for the Evening'],
    bestSeason: 'April to October & Festive December',
    idealStay: 'Signature Evening Experience',
    transferNote: 'Luxury Maybach chauffeur within central Paris',
    startingPriceNote: 'Starting from ₹1,20,000 / Couple',
    curatorNote: 'The quintessential Parisian celebration for proposals, anniversaries, and milestones.',
  },
  {
    id: 'place-lake-como',
    title: 'Villa d’Este Lakeside Renaissance Estate',
    propertySubtitle: 'Cernobbio Grand Waterfront Palace',
    location: 'Lake Como, Italy',
    country: 'Italy',
    region: 'Europe',
    category: 'Stays',
    theme: 'coastal',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
    caption: 'A 16th-century princely residence surrounded by 25 acres of Renaissance gardens, featuring a world-famous floating pool on the lake and private mahogany water taxi transfers to Bellagio.',
    highlights: ['Iconic Floating Pool on Lake Como', 'Century-Old Mosaic Nympheum Gardens', 'Private Vintage Water Limousine', 'Michelin-Selected Terrace Dining'],
    bestSeason: 'April to October',
    idealStay: '3 to 5 Nights',
    transferNote: '50-minute luxury private drive from Milan Malpensa Airport (MXP)',
    startingPriceNote: 'Starting from ₹2,30,000 / Night',
    curatorNote: 'Timeless aristocratic glamour. Relaxing with Bellinis on the lakeside terrace is pure poetry.',
  },
  {
    id: 'place-al-maha-dubai',
    title: 'Royal Bedouin Pool Pavilion in Desert Dunes',
    propertySubtitle: 'Al Maha Luxury Desert Conservation Reserve',
    location: 'Dubai Desert Reserve, UAE',
    country: 'UAE',
    region: 'Middle East',
    category: 'Stays',
    theme: 'heritage',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    caption: 'Secluded tented pavilions styled with authentic Arab antiquities and private temperature-controlled infinity plunge pools overlooking crimson dunes where Arabian oryx and gazelles roam freely.',
    highlights: ['Private Dune Plunge Pool', 'Arabian Wildlife & Oryx Watching', 'Private Falconry Demonstration', 'Sunset Camel Caravan & Champagne Dunes'],
    bestSeason: 'October to April (Pleasant Desert Winter)',
    idealStay: '2 to 3 Nights',
    transferNote: '45-minute Range Rover desert transfer from Dubai International (DXB)',
    startingPriceNote: 'Starting from ₹1,50,000 / Night',
    curatorNote: 'A serene contrast to downtown Dubai. Total stillness under starlit desert skies.',
  },
  {
    id: 'place-charles-bridge',
    title: 'Charles Bridge Gothic Twilight Walk & Private Chamber Concert',
    propertySubtitle: 'Bohemian Royalty Heritage Experience',
    location: 'Prague, Czech Republic',
    country: 'Czech Republic',
    region: 'Europe',
    category: 'Moments',
    theme: 'heritage',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Private after-hours twilight walk across the misty 14th-century Charles Bridge with our resident medieval historian, concluding with a private string quartet performance inside a Baroque palace library.',
    highlights: ['Privileged After-Hours Access', 'Private Baroque Palace Concert', 'Vintage Horse Carriage Ride', 'Panoramic Vltava River Views'],
    bestSeason: 'May to September & December for Christmas Fairytales',
    idealStay: '3 to 4 Nights',
    transferNote: '25-minute Mercedes chauffeur from Václav Havel Airport Prague',
    startingPriceNote: 'Starting from ₹60,000 / Experience',
    curatorNote: 'Prague reveals its genuine soul in the early morning and blue twilight hours when the day crowds vanish.',
  },
  {
    id: 'place-nusa-penida',
    title: 'Kelingking T-Rex Ridge & Private Yacht Seclusion',
    propertySubtitle: 'Nusa Archipelago Hidden Sanctuary',
    location: 'Nusa Penida, Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    category: 'Moments',
    theme: 'coastal',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    caption: 'Breathtaking cobalt ocean swells breaking against towering dinosaur-shaped limestone sea cliffs, paired with private catamaran anchoring in crystal coves for manta ray snorkeling.',
    highlights: ['Private Catamaran Charter', 'Manta Point Snorkeling with Marine Biologist', 'Cliffside Heli-Sightseeing Option', 'Secluded Beach Picnic Basket'],
    bestSeason: 'April to October',
    idealStay: 'Full Day Yacht Excursion or 2 Nights Boutique Eco-Chalet',
    transferNote: '35-minute private speedboat charter from Sanur Harbour, Bali',
    startingPriceNote: 'Starting from ₹95,000 / Day Charter',
    curatorNote: 'Avoid the bumpy island roads by exploring the coastlines aboard our private twin-engine yacht.',
  },
  {
    id: 'place-jungfraujoch-alps',
    title: 'Jungfraujoch 3,454m Glacier Ice Palace Summit',
    propertySubtitle: 'Top of Europe Alpine Excursion',
    location: 'Interlaken, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Journeys',
    theme: 'alpine',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ascend to the highest railway station in Europe via the cutting-edge Eiger Express gondola and historic cogwheel mountain train, discovering carved ice tunnels inside the Aletsch Glacier.',
    highlights: ['Eiger Express VIP Gondola with Champagne', 'Aletsch Glacier Ice Caves Stroll', 'Sphinx Observatory Terrace 3,571m', 'Private Mountain Guide & Fondue Lunch'],
    bestSeason: 'June to October for green valleys & Dec to April for pristine snow',
    idealStay: 'Day Tour from Interlaken or Grindelwald',
    transferNote: 'Dedicated cogwheel rail and cableway connections',
    startingPriceNote: 'Starting from ₹45,000 / Person',
    curatorNote: 'The scale of the Aletsch Glacier is awe-inspiring. Standing on the Sphinx deck feels like touching the sky.',
  },
  {
    id: 'place-private-jet-sky',
    title: 'Bespoke Private Sky Sanctuary & Long-Range Charter',
    propertySubtitle: 'Gulfstream G650 & Falcon 8X Fleet',
    location: 'Global VIP Routing',
    country: 'International',
    region: 'Middle East',
    category: 'Journeys',
    theme: 'gourmet',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    caption: 'Seamless point-to-point private air transport with dedicated runway tarmac tarmac pickup, gourmet dining tailored to your dietary wishes, lie-flat bedrooms, and custom customs clearance.',
    highlights: ['VIP Private Jet Terminal & FBO Lounge', 'Lie-Flat Master Stateroom Beds', 'Michelin-Trained In-Flight Culinary Team', 'Direct Island Runway Access'],
    bestSeason: 'On-Demand Year-Round',
    idealStay: 'Private Charter Flights',
    transferNote: 'Dedicated private jet terminals in Delhi, Mumbai, Dubai, London & Zurich',
    startingPriceNote: 'Custom Quote Per Flight Route',
    curatorNote: 'For families and VIP delegations seeking zero terminal delays, absolute privacy, and custom flight timings.',
  },
];

const CATEGORIES = ['All', 'Stays', 'Journeys', 'Moments', 'Gourmet'] as const;
const REGIONS = ['All', 'Europe', 'Southeast Asia', 'Indian Ocean', 'East Asia', 'Middle East'] as const;
const THEMES = [
  { id: 'all', label: 'All Curations' },
  { id: 'overwater', label: 'Overwater & Lagoons' },
  { id: 'alpine', label: 'Alpine & Snow Sanctuaries' },
  { id: 'coastal', label: 'Mediterranean & Coastal' },
  { id: 'heritage', label: 'Historic & Royal Estates' },
] as const;

export default function PlacesPage() {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'curator' | 'name' | 'region'>('curator');

  // Interactive Lightbox State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Enquiry Concierge Modal State
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');

  // Wishlist Context
  const { toggleDestinationWishlist, isDestinationSaved } = useWishlist();
  const { places: cmsPlaces } = useCms();

  // Caret Carousel Refs for themed carousels
  const overwaterCarouselRef = useRef<HTMLDivElement>(null);
  const alpineCarouselRef = useRef<HTMLDivElement>(null);

  // Filtered places calculation
  const filteredPlaces = useMemo(() => {
    return cmsPlaces.filter((place) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        place.title.toLowerCase().includes(q) ||
        place.location.toLowerCase().includes(q) ||
        place.country.toLowerCase().includes(q) ||
        place.propertySubtitle.toLowerCase().includes(q) ||
        place.caption.toLowerCase().includes(q) ||
        place.highlights.some((h) => h.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' || place.category === selectedCategory;

      const matchesRegion =
        selectedRegion === 'All' || place.region === selectedRegion;

      const matchesTheme =
        selectedTheme === 'all' || place.theme === selectedTheme;

      return matchesSearch && matchesCat && matchesRegion && matchesTheme;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'region') return a.region.localeCompare(b.region);
      return 0; // curator default order
    });
  }, [cmsPlaces, searchQuery, selectedCategory, selectedRegion, selectedTheme, sortBy]);

  // Progressive Scroll-based Pagination
  const {
    visibleItems: visiblePlaces,
    displayedCount,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
  } = useScrollPagination<EnrichedPlace>({
    items: filteredPlaces,
    pageSize: 6,
    initialPageSize: 6,
    resetDeps: [searchQuery, selectedCategory, selectedRegion, selectedTheme, sortBy],
  });

  // Themed places subsets for carousels
  const overwaterPlaces = useMemo(
    () => cmsPlaces.filter((p) => p.theme === 'overwater' || p.region === 'Indian Ocean'),
    [cmsPlaces]
  );

  const alpinePlaces = useMemo(
    () => cmsPlaces.filter((p) => p.theme === 'alpine' || p.country === 'Switzerland'),
    [cmsPlaces]
  );

  // Active Photo in Lightbox
  const activePhoto =
    activeLightboxIndex !== null ? filteredPlaces[activeLightboxIndex] : null;

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredPlaces.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredPlaces.length) % filteredPlaces.length
            : null
        );
      } else if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredPlaces.length]);

  const handleNextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPlaces.length);
    }
  };

  const handlePrevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredPlaces.length) % filteredPlaces.length
      );
    }
  };

  const handlePlanForPlace = (location: string, title?: string) => {
    setEnquiryDestination(location);
    if (title) {
      setEnquiryTripType(`Curated Place: ${title}`);
    }
    setIsEnquiryOpen(true);
    setActiveLightboxIndex(null);
  };

  // Helper scroll for horizontal carousels
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Spotlight Sanctuary of the Season
  const spotlightPlace = CURATED_PLACES_DATA[0]; // Soneva Jani

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-24 space-y-16 sm:space-y-20">
        
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="section-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-neutral-200 dark:border-white/10">
            <div className="max-w-3xl space-y-5">
              {/* Breadcrumb / Top Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
                <Crown className="w-3.5 h-3.5 text-[#E37500]" />
                <span>The Global Places Portfolio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E37500]/40" />
                <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                  {CURATED_PLACES_DATA.length} Verified Sanctuaries
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
                Curated Places & <br className="hidden sm:inline" />
                <span className="italic font-serif text-[#E37500] font-normal">
                  Private Sanctuaries
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl font-normal">
                A hand-selected global directory of overwater lagoons, cliffside infinity villas, panoramic glacier rail cars, and secluded royal estates. Every property is vetted personally by our founders to guarantee genuine luxury, absolute privacy, and effortless execution.
              </p>

              {/* Trust & Prestige Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E37500]" />
                  <span>100% Founder Vetted</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#E37500]" />
                  <span>VIP Privileges & Upgrades</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#E37500]" />
                  <span>24/7 Dedicated Butler</span>
                </span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => handlePlanForPlace('Bespoke Sanctuary Curation')}
                className="px-6 py-3 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Custom Sourcing</span>
              </button>
              <button
                onClick={() => navigate('/destinations')}
                className="px-5 py-3 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-neutral-200 dark:border-white/10 shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#E37500]" />
                <span>View Full Itineraries</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SPOTLIGHT SANCTUARY OF THE SEASON BANNER */}
        {/* ============================================================ */}
        <section className="section-container">
          <div className="relative rounded-3xl overflow-hidden bg-black text-white shadow-2xl border border-neutral-800">
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <img
                src={spotlightPlace.image}
                alt={spotlightPlace.title}
                className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E37500] text-white text-[11px] font-bold uppercase tracking-widest shadow-md">
                <Crown className="w-3.5 h-3.5" />
                <span>Sanctuary Spotlight of the Season</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#E37500] font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>{spotlightPlace.location}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/80">{spotlightPlace.propertySubtitle}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                  {spotlightPlace.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                {spotlightPlace.caption}
              </p>

              {/* Highlights Pill Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {spotlightPlace.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20"
                  >
                    ✦ {h}
                  </span>
                ))}
              </div>

              {/* Bottom Details Row */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/20">
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Best Season to Visit
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {spotlightPlace.bestSeason} · {spotlightPlace.idealStay}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const idx = CURATED_PLACES_DATA.findIndex((p) => p.id === spotlightPlace.id);
                      setActiveLightboxIndex(idx >= 0 ? idx : 0);
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/25 flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspect</span>
                  </button>
                  <button
                    onClick={() => handlePlanForPlace(spotlightPlace.location, spotlightPlace.title)}
                    className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>Plan Sanctuary Journey</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* THEMED CARETS: OVERWATER & COASTAL SANCTUARIES */}
        {/* ============================================================ */}
        <section className="section-container space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#E37500] font-bold">
                Signature Collection
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Azure Lagoons & Overwater Havens
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                Private overwater bungalows, yacht moorings, and cliffside Mediterranean retreats with direct sea immersion.
              </p>
            </div>

            {/* Caret Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(overwaterCarouselRef, -380)}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all shadow-xs active:scale-95"
                aria-label="Previous overwater place"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => scrollCarousel(overwaterCarouselRef, 380)}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all shadow-xs active:scale-95"
                aria-label="Next overwater place"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={overwaterCarouselRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {overwaterPlaces.map((place) => {
              const isSaved = isDestinationSaved(place.id);
              const idx = CURATED_PLACES_DATA.findIndex((p) => p.id === place.id);

              return (
                <div
                  key={place.id}
                  onClick={() => setActiveLightboxIndex(idx >= 0 ? idx : 0)}
                  className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 shadow-xs flex flex-col relative shrink-0 w-[85vw] sm:w-[360px] snap-start"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-100 dark:bg-[#111111]">
                    <GlassImage
                      src={place.image}
                      alt={place.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        {place.country}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestinationWishlist(place.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                          isSaved ? 'bg-[#E37500] text-white' : 'bg-black/50 text-white hover:bg-black/75'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#E37500] font-semibold">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{place.location}</span>
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors line-clamp-1">
                        {place.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                        {place.caption}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                        {place.idealStay}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlanForPlace(place.location, place.title);
                        }}
                        className="px-3.5 py-1 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C66500] transition-all"
                      >
                        Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* THEMED CARETS: ALPINE PEAKS & SNOW SANCTUARIES */}
        {/* ============================================================ */}
        <section className="section-container space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#E37500] font-bold">
                High Altitude Sanctuaries
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Alpine Peaks & Fairytale Mountain Havens
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                Glacier chalets, panoramic 1st-class glass trains, and majestic Swiss & Austrian mountain sanctuaries.
              </p>
            </div>

            {/* Caret Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(alpineCarouselRef, -380)}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all shadow-xs active:scale-95"
                aria-label="Previous alpine place"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => scrollCarousel(alpineCarouselRef, 380)}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all shadow-xs active:scale-95"
                aria-label="Next alpine place"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={alpineCarouselRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {alpinePlaces.map((place) => {
              const isSaved = isDestinationSaved(place.id);
              const idx = CURATED_PLACES_DATA.findIndex((p) => p.id === place.id);

              return (
                <div
                  key={place.id}
                  onClick={() => setActiveLightboxIndex(idx >= 0 ? idx : 0)}
                  className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 shadow-xs flex flex-col relative shrink-0 w-[85vw] sm:w-[360px] snap-start"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-100 dark:bg-[#111111]">
                    <GlassImage
                      src={place.image}
                      alt={place.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        {place.country}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestinationWishlist(place.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                          isSaved ? 'bg-[#E37500] text-white' : 'bg-black/50 text-white hover:bg-black/75'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#E37500] font-semibold">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{place.location}</span>
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors line-clamp-1">
                        {place.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                        {place.caption}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                        {place.idealStay}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlanForPlace(place.location, place.title);
                        }}
                        className="px-3.5 py-1 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C66500] transition-all"
                      >
                        Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* COMPREHENSIVE FILTER & SEARCH BAR */}
        {/* ============================================================ */}
        <section className="section-container space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E37500] font-bold">
                Interactive Catalog
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Explore All Curated Places
              </h2>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-neutral-400">
              Showing {filteredPlaces.length} of {cmsPlaces.length} Sanctuaries
            </span>
          </div>

          {/* Search & Filter Controls Container */}
          <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 shadow-xs">
            {/* Top row: Search input + Sort By */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search places by name, country, feature (e.g. Maldives, Zermatt, slide, private pool)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 whitespace-nowrap font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                >
                  <option value="curator">Curator’s Choice</option>
                  <option value="name">Name (A–Z)</option>
                  <option value="region">Region (A–Z)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills: Categories & Themes */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-neutral-200 dark:border-white/10">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">Type:</span>
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-[#E37500] text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Region Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">Region:</span>
                {REGIONS.map((region) => {
                  const isActive = selectedRegion === region;
                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-neutral-200 dark:border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">Collection:</span>
              {THEMES.map((theme) => {
                const isActive = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#E37500]/15 text-[#E37500] border border-[#E37500]/40 font-bold'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {theme.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* PLACES CATALOG CARDS */}
          {/* ============================================================ */}
          {filteredPlaces.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 items-stretch">
                {visiblePlaces.map((place) => {
                  const isSaved = isDestinationSaved(place.id);
                  const origIdx = filteredPlaces.findIndex((p) => p.id === place.id);

                  return (
                    <div
                      key={place.id}
                      onClick={() => setActiveLightboxIndex(origIdx >= 0 ? origIdx : 0)}
                      className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 shadow-xs flex flex-col justify-between relative min-h-[500px] sm:min-h-[520px]"
                    >
                    {/* Image Container */}
                    <div className="w-full h-52 shrink-0 overflow-hidden relative bg-neutral-100 dark:bg-[#111111]">
                      <GlassImage
                        src={place.image}
                        alt={place.title}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-md">
                          <Eye className="w-4 h-4 text-[#E37500]" />
                          <span>Inspect Full Details</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/20">
                          {place.idealStay}
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-xs">
                          {place.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDestinationWishlist(place.id);
                          }}
                          className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                            isSaved
                              ? 'bg-[#E37500] text-white shadow-sm'
                              : 'bg-black/50 text-white hover:bg-black/75'
                          }`}
                          title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span className="flex items-center gap-1 font-semibold text-[#E37500]">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{place.location}</span>
                          </span>
                          <span className="text-[11px] text-neutral-400 font-medium">{place.region}</span>
                        </div>

                        <div className="h-14 flex items-center">
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-snug line-clamp-2">
                            {place.title}
                          </h3>
                        </div>

                        <div className="h-10 flex items-start">
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                            {place.caption}
                          </p>
                        </div>
                      </div>

                      {/* Highlights Tag Cloud */}
                      <div className="flex flex-wrap gap-1.5 pt-1 h-12 overflow-hidden content-start">
                        {place.highlights.slice(0, 3).map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[10px] font-medium text-neutral-600 dark:text-neutral-300"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Bottom action row */}
                      <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between gap-2 shrink-0">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                            Best Season
                          </span>
                          <p className="text-xs font-medium text-neutral-900 dark:text-white truncate max-w-[130px]">
                            {place.bestSeason.split('(')[0]}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLightboxIndex(origIdx >= 0 ? origIdx : 0);
                            }}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#E37500]" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlanForPlace(place.location, place.title);
                            }}
                            className="px-4 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progressive Scroll Pagination Footer */}
            <ScrollPaginationFooter
              displayedCount={displayedCount}
              totalCount={totalCount}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
              sentinelRef={sentinelRef}
              itemNoun="sanctuaries"
              onPlanCustom={() => {
                setEnquiryDestination('Custom Sanctuary');
                setEnquiryTripType('Bespoke Luxury');
                setIsEnquiryOpen(true);
              }}
            />
          </>
        ) : (
            <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl border border-neutral-200 dark:border-white/10 p-8 space-y-4">
              <Compass className="w-12 h-12 text-neutral-400 mx-auto mb-2 opacity-50" />
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                No matching sanctuaries found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
                We couldn’t find places matching your current combination of filters. Try clearing your search keyword or switching category tabs.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedRegion('All');
                  setSelectedTheme('all');
                }}
                className="px-6 py-2.5 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#C66500] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* THE CONCIERGE PROMISE STRIP */}
        {/* ============================================================ */}
        <section className="section-container">
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 shadow-xs">
            <div className="max-w-2xl mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 text-[#E37500] text-xs font-bold uppercase tracking-widest">
                <Award className="w-4 h-4 text-[#E37500]" />
                <span>The My Kind of Travel Standard</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Why Reserve Sanctuaries Through Our Concierge
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 text-[#E37500] border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-white">
                  Founder Vetted
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Every estate, resort, and rail passage is tested personally. Zero generic aggregator listings.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 text-[#E37500] border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-white">
                  VIP Upgrades & Inclusions
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Complimentary room upgrades, daily gourmet breakfasts, spa credits, and champagne upon arrival.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 text-[#E37500] border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-white">
                  Private Air & Charters
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Direct seaplane bookings, vintage yacht charters, and helicopter transfers coordinated end-to-end.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 text-[#E37500] border border-neutral-200 dark:border-white/10 flex items-center justify-center font-bold">
                  04
                </div>
                <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-white">
                  24/7 Dedicated Butler
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Instant WhatsApp responses and on-the-ground support from departure until your safe return.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CUSTOM UNLISTED RETREAT CALLOUT BANNER */}
        {/* ============================================================ */}
        <section className="section-container">
          <div className="rounded-3xl p-8 sm:p-12 bg-neutral-900 dark:bg-[#0A0A0A] border border-neutral-800 dark:border-white/15 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Private Sourcing</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                Seeking an Unlisted Private Island or Remote Alpine Estate?
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                Beyond our public portfolio, our founders maintain direct relationships with private island owners, historic châteaux in France, and secluded safari lodges throughout Africa.
              </p>
            </div>

            <button
              onClick={() => handlePlanForPlace('Unlisted Private Sanctuary Inquiry')}
              className="px-8 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Consult Our Founders</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* ============================================================ */}
      {/* INTERACTIVE FULLSCREEN LIGHTBOX & SANCTUARY DEEP DIVE */}
      {/* ============================================================ */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-white flex flex-col no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close & Counter Bar */}
            <div className="sticky top-0 z-30 p-4 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                <span className="text-[#E37500] font-bold">
                  Place {activeLightboxIndex !== null ? activeLightboxIndex + 1 : 1}
                </span>
                <span>of</span>
                <span>{filteredPlaces.length}</span>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="hidden sm:inline">{activePhoto.location}</span>
              </div>

              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-900 dark:text-white flex items-center justify-center transition-all"
                aria-label="Close photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Arrows */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all shadow-md"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNextLightbox}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all shadow-md"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Main High-Res Image Display */}
            <div className="w-full h-[45vh] sm:h-[55vh] bg-black flex items-center justify-center overflow-hidden relative">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                {activePhoto.propertySubtitle}
              </div>
            </div>

            {/* Comprehensive Details Drawer */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#E37500]">
                    <MapPin className="w-4 h-4" />
                    <span>{activePhoto.location}</span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-neutral-500 dark:text-neutral-400">{activePhoto.region}</span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-neutral-500 dark:text-neutral-400">{activePhoto.category}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    {activePhoto.title}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {activePhoto.caption}
                  </p>
                </div>

                {/* Plan Trip CTA Box */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shrink-0 lg:w-72 space-y-3">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                    Concierge Pricing
                  </span>
                  <div className="font-sans text-lg font-bold text-[#E37500] tabular-nums price-tag">
                    {activePhoto.startingPriceNote}
                  </div>
                  <button
                    onClick={() => handlePlanForPlace(activePhoto.location, activePhoto.title)}
                    className="w-full py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Plan Journey Here</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Highlights & Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Best Season</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                    {activePhoto.bestSeason}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Ideal Stay</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                    {activePhoto.idealStay}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <Plane className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Transfers</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                    {activePhoto.transferNote}
                  </p>
                </div>
              </div>

              {/* Curator Note Callout */}
              {activePhoto.curatorNote && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-neutral-800 dark:text-amber-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#E37500] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-[#E37500]">Curator’s Personal Note:</strong>{' '}
                    {activePhoto.curatorNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
      />

      {/* Wishlist Drawer */}
      <WishlistModal />

      {/* Footer */}
      <Footer
        onNavigate={(path) => {
          if (path === 'contact') setIsEnquiryOpen(true);
          else if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
          setEnquiryDestination(name);
          setIsEnquiryOpen(true);
        }}
        onSelectTripType={(type) => {
          setEnquiryTripType(type);
          setIsEnquiryOpen(true);
        }}
        onPlanTrip={() => setIsEnquiryOpen(true)}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
