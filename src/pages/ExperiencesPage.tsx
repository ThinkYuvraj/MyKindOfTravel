import React, { useState, useMemo } from 'react';
import { EXPERIENCE_PILLARS, DESTINATIONS, COMPANY_INFO } from '../data/travelData';
import { ExperiencePillar } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnquiryModal } from '../components/EnquiryModal';
import { WishlistModal } from '../components/WishlistModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { useCms } from '../context/CmsContext';
import { useScrollPagination } from '../utils/useScrollPagination';
import { ScrollPaginationFooter } from '../components/ScrollPaginationFooter';
import { Sparkles, Check, ArrowRight, Compass, Search, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EXTENDED_EXPERIENCES: ExperiencePillar[] = [
  ...EXPERIENCE_PILLARS,
  {
    number: '07',
    title: 'Alpine Rail & Glacier Expeditions',
    subtitle: 'Panoramic mountain routes and top-of-the-world summits',
    description: 'First-class Glacier Express, Bernina Express, and Jungfraujoch cogwheel journeys carved across Swiss peaks, viaducts, and pristine alpine lakes.',
    ctaText: 'Explore rail trips',
    typeKey: 'Alpine Rail',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    highlights: ['First-class panoramic glass dome seats', 'Matterhorn view chalet accommodations', 'Luggage transfer between Swiss stations', 'Private glacier guides & chocolate tasting'],
  },
  {
    number: '08',
    title: 'Michelin Dining & Private Wine Trails',
    subtitle: 'Epicurean journeys for discerning palates',
    description: 'After-hours access to Bordeaux vineyards, private Tuscan olive mills, and reserved chef’s tables facing iconic skylines in Paris and Tokyo.',
    ctaText: 'Discover gourmet',
    typeKey: 'Gourmet & Wine',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Private sommelier vineyard tastings', 'Eiffel Tower private terrace dinner', 'Truffle hunting in Piedmont', 'Michelin 3-star omakase dining in Kyoto'],
  },
];

export default function ExperiencesPage() {
  const navigate = useNavigate();
  const { experiencePillars } = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryTripType, setEnquiryTripType] = useState('');

  const types = ['All', 'Honeymoon', 'Luxury Europe', 'Corporate', 'Family', 'Wellness', 'Rail', 'Gourmet'];

  const allExperiences = useMemo(() => {
    const additional = [
      {
        number: '07',
        title: 'Alpine Rail & Glacier Expeditions',
        subtitle: 'Panoramic mountain routes and top-of-the-world summits',
        description: 'First-class Glacier Express, Bernina Express, and Jungfraujoch cogwheel journeys carved across Swiss peaks, viaducts, and pristine alpine lakes.',
        ctaText: 'Explore rail trips',
        typeKey: 'Alpine Rail',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
        highlights: ['First-class panoramic glass dome seats', 'Matterhorn view chalet accommodations', 'Luggage transfer between Swiss stations', 'Private glacier guides & chocolate tasting'],
      },
      {
        number: '08',
        title: 'Michelin Dining & Private Wine Trails',
        subtitle: 'Epicurean journeys for discerning palates',
        description: 'After-hours access to Bordeaux vineyards, private Tuscan olive mills, and reserved chef’s tables facing iconic skylines in Paris and Tokyo.',
        ctaText: 'Discover gourmet',
        typeKey: 'Gourmet & Wine',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
        highlights: ['Private sommelier vineyard tastings', 'Eiffel Tower private terrace dinner', 'Truffle hunting in Piedmont', 'Michelin 3-star omakase dining in Kyoto'],
      },
    ];

    const existingNumbers = new Set(experiencePillars.map((p) => p.number));
    const extraToAdd = additional.filter((a) => !existingNumbers.has(a.number));
    return [...experiencePillars, ...extraToAdd];
  }, [experiencePillars]);

  const filtersWithCounts = useMemo(() => {
    return types.map((type) => {
      let count = 0;
      if (type === 'All') {
        count = allExperiences.length;
      } else {
        count = allExperiences.filter((exp) => {
          const text = (exp.title + ' ' + exp.typeKey).toLowerCase();
          return text.includes(type.toLowerCase());
        }).length;
      }
      return { label: type, count };
    });
  }, [allExperiences]);

  const filteredExperiences = useMemo(() => {
    return allExperiences.filter((exp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exp.title.toLowerCase().includes(q) ||
        exp.description.toLowerCase().includes(q) ||
        exp.highlights.some((h) => h.toLowerCase().includes(q));

      let matchesType = true;
      if (selectedType !== 'All') {
        const text = (exp.title + ' ' + exp.typeKey).toLowerCase();
        matchesType = text.includes(selectedType.toLowerCase());
      }

      return matchesSearch && matchesType;
    });
  }, [allExperiences, searchQuery, selectedType]);

  // Progressive Scroll-based Pagination
  const {
    visibleItems: visibleExperiences,
    displayedCount,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
  } = useScrollPagination<ExperiencePillar>({
    items: filteredExperiences,
    pageSize: 6,
    initialPageSize: 6,
    resetDeps: [searchQuery, selectedType],
  });

  const handleStartPlanning = (tripType: string) => {
    setEnquiryTripType(tripType);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Travel Pillars</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Every Kind of <span className="italic font-serif text-[#E37500] font-normal">Extraordinary</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Whether you seek intimate honeymoon romance, multi-generational family ease, executive team retreats, or adrenaline in the Swiss Alps, explore our curated holiday pillars below.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/places')}
                className="px-5 py-2.5 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-neutral-200 dark:border-white/10 shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#E37500]" />
                <span>Explore Curated Places</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experiences (e.g., honeymoon, villa, rail, corporate)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            {/* Filter Pills in continuous capsule */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md overflow-x-auto no-scrollbar shrink-0">
              {filtersWithCounts.map((f) => {
                const isActive = selectedType === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setSelectedType(f.label)}
                    disabled={f.count === 0}
                    aria-pressed={isActive}
                    className={`
                      relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold
                      transition-all duration-200 whitespace-nowrap shrink-0
                      disabled:opacity-35 disabled:cursor-not-allowed
                      ${isActive
                        ? 'bg-[#E37500] text-white shadow-md shadow-[#E37500]/25 scale-[1.02]'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    <span>{f.label}</span>
                    {f.label !== 'All' && (
                      <span
                        className={`
                          inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold
                          transition-colors duration-200
                          ${isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                          }
                        `}
                      >
                        {f.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experiences Grid */}
          {filteredExperiences.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 items-stretch">
                {visibleExperiences.map((exp) => (
                  <div
                    key={exp.number}
                    className="rounded-3xl overflow-hidden bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 shadow-xs flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative min-h-[500px] sm:min-h-[540px]"
                  >
                    <div className="flex flex-col flex-1">
                      {/* Image with Pillar Number */}
                      {exp.image && (
                        <div className="relative w-full h-52 overflow-hidden border-b border-neutral-200 dark:border-white/10 shrink-0">
                          <img
                            src={exp.image}
                            alt={exp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                          <div className="absolute top-3.5 left-3.5 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md text-white font-serif font-bold text-xs border border-white/20">
                            {exp.number}
                          </div>
                        </div>
                      )}

                      {/* Body */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="h-14 flex items-center">
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight line-clamp-2">
                              {exp.title}
                            </h3>
                          </div>
                          <div className="h-10 flex items-start">
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                              {exp.description}
                            </p>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="h-24 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex flex-col justify-center space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E37500] block">
                            Signature Highlights:
                          </span>
                          {exp.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                              <div className="w-3.5 h-3.5 rounded-full bg-[#E37500]/10 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-[#E37500] stroke-[3]" />
                              </div>
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="p-5 sm:p-6 pt-0 shrink-0">
                      <button
                        onClick={() => handleStartPlanning(exp.typeKey)}
                        className="w-full py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <span>{exp.ctaText}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progressive Scroll Pagination Footer */}
              <ScrollPaginationFooter
                displayedCount={displayedCount}
                totalCount={totalCount}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMore}
                sentinelRef={sentinelRef}
                itemNoun="experiences"
                onPlanCustom={() => handleStartPlanning('Custom Experience')}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-neutral-50 dark:bg-[#0B0B0B] rounded-3xl border border-neutral-200 dark:border-white/10 p-8 space-y-4">
              <Compass className="w-12 h-12 text-neutral-400 mx-auto mb-2 opacity-50" />
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                No matching experiences found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
                We couldn’t find pillars matching your current query. Try resetting your search or exploring all categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('All');
                }}
                className="px-6 py-2.5 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#C66500] transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Bottom Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 dark:bg-[#0A0A0A] border border-neutral-800 dark:border-white/15 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Have a completely custom travel concept in mind?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Our private concierge crafts unique itineraries blending multiple experiences, private aviation, and luxury villas.
              </p>
            </div>

            <button
              onClick={() => handleStartPlanning('Custom Itinerary')}
              className="px-8 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#E37500]/30 transition-all shrink-0 active:scale-95"
            >
              <span>Design Your Blueprint</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </main>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialTripType={enquiryTripType}
      />

      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else if (path === 'contact') setIsEnquiryOpen(true);
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
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
