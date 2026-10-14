import React, { useState, useMemo } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationItem } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DestinationModal } from '../components/DestinationModal';
import { EnquiryModal } from '../components/EnquiryModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { GlassImage } from '../components/GlassImage';
import { useWishlist } from '../context/WishlistContext';
import { WishlistModal } from '../components/WishlistModal';
import { useCms } from '../context/CmsContext';
import { useScrollPagination } from '../utils/useScrollPagination';
import { ScrollPaginationFooter } from '../components/ScrollPaginationFooter';
import { Search, MapPin, Clock, Sparkles, ArrowUpRight, Heart, Filter, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DESTINATION_META: Record<string, { code: string; flightTime: string }> = {
  bali: { code: 'DPS', flightTime: '8h 45m · 1-Stop' },
  paris: { code: 'CDG', flightTime: '9h 15m · Direct' },
  switzerland: { code: 'ZRH', flightTime: '8h 30m · Direct' },
  santorini: { code: 'JTR', flightTime: '10h 30m · 1-Stop' },
  maldives: { code: 'MLE', flightTime: '2h 45m · Direct' },
  amalfi: { code: 'NAP', flightTime: '9h 40m · 1-Stop' },
  kyoto: { code: 'HND', flightTime: '8h 20m · Direct' },
  cappadocia: { code: 'NAV', flightTime: '8h 15m · 1-Stop' },
  prague: { code: 'PRG', flightTime: '9h 50m · 1-Stop' },
};

const REGIONS = ['All', 'Europe', 'Southeast Asia', 'Islands & Beaches', 'East Asia'];

const checkItemRegion = (item: DestinationItem, region: string) => {
  if (region === 'All') return true;
  if (region === 'Europe') {
    return ['France', 'Switzerland', 'Greece', 'Italy', 'Czech Republic'].includes(item.country);
  }
  if (region === 'Southeast Asia') {
    return item.country === 'Indonesia';
  }
  if (region === 'Islands & Beaches') {
    return ['Maldives', 'Indonesia', 'Greece'].includes(item.country);
  }
  if (region === 'East Asia') {
    return ['Japan'].includes(item.country);
  }
  return true;
};

export default function DestinationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const { toggleDestinationWishlist, isDestinationSaved } = useWishlist();
  const { destinations } = useCms();

  const filtersWithCounts = useMemo(() => {
    return REGIONS.map((region) => {
      const count = destinations.filter((item) => checkItemRegion(item, region)).length;
      return { label: region, count };
    });
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = checkItemRegion(item, selectedRegion);
      return matchesSearch && matchesRegion;
    });
  }, [destinations, searchQuery, selectedRegion]);

  // Progressive Scroll-based Pagination
  const {
    visibleItems: visibleDestinations,
    displayedCount,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
  } = useScrollPagination<DestinationItem>({
    items: filteredDestinations,
    pageSize: 6,
    initialPageSize: 6,
    resetDeps: [searchQuery, selectedRegion],
  });

  const handleEnquire = (destName: string) => {
    setEnquiryDestination(destName);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Floating Navbar */}
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-10">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Worldwide Luxury Blueprints</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Our Picked <span className="italic font-serif text-[#E37500] font-normal">Locations</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Explore our portfolio of private chalets, overwater lagoons, clifftop villas, and iconic scenic routes. Every destination is fully customizable around your schedule and travel rhythm.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, or vibe (e.g. Bali, Alps, romantic)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            {/* Region Pills in continuous capsule */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md overflow-x-auto no-scrollbar shrink-0 max-w-full">
              {filtersWithCounts.map((f) => {
                const isActive = selectedRegion === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setSelectedRegion(f.label)}
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

          {/* Destinations Grid */}
          {filteredDestinations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 items-stretch">
                {visibleDestinations.map((dest) => {
                  const meta = DESTINATION_META[dest.id] || { code: 'Direct', flightTime: 'Curated Route' };
                  const isSaved = isDestinationSaved(dest.id);

                  return (
                    <div
                      key={dest.id}
                      className="group rounded-3xl overflow-hidden bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 shadow-xs hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[500px] sm:min-h-[520px] relative"
                    >
                    <div className="flex flex-col flex-1">
                      {/* Clean Image Container without text/badge overlays */}
                      <div className="relative h-48 sm:h-50 overflow-hidden w-full shrink-0 bg-neutral-100 dark:bg-[#111111]">
                        <GlassImage
                          src={dest.image}
                          alt={dest.name}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Card Body with all metadata */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          {/* Title and Wishlist Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="h-14 flex items-center flex-1">
                              <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight line-clamp-2">
                                {dest.name}
                              </h3>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDestinationWishlist(dest.id);
                              }}
                              className={`p-2 rounded-full border transition-all shrink-0 cursor-pointer ${
                                isSaved
                                  ? 'bg-[#E37500] border-[#E37500] text-white shadow-xs'
                                  : 'bg-neutral-100 dark:bg-white/10 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-[#E37500]'
                              }`}
                              title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                              aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          {/* Badges Bar: Flight Time & Starting Price */}
                          <div className="h-7 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 text-[11px] font-medium font-sans">
                              <Clock className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                              <span>{meta.flightTime}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#E37500] text-white text-[11px] font-bold font-sans shadow-sm shadow-[#E37500]/25 whitespace-nowrap">
                              {dest.priceNote.replace('Starting from ', 'From ')}
                            </span>
                          </div>

                          {/* Description */}
                          <div className="h-10 flex items-start">
                            <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                              {dest.description}
                            </p>
                          </div>
                        </div>

                        {/* Inclusions */}
                        <div className="h-16 space-y-1.5 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                            <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                            <span>Signature Inclusions:</span>
                          </div>
                          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                            {(dest.highlights || []).slice(0, 2).map((hl, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E37500] shrink-0" />
                                <span className="truncate">{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 flex items-center justify-between gap-3 border-t border-neutral-200 dark:border-white/10 shrink-0">
                      <button
                        onClick={() => setSelectedDestination(dest)}
                        className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1 group/btn transition-colors cursor-pointer"
                      >
                        <span>View Itinerary</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#E37500]" />
                      </button>

                      <button
                        onClick={() => handleEnquire(dest.name)}
                        className="px-5 py-2 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                      >
                        Enquire
                      </button>
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
              itemNoun="destinations"
              onPlanCustom={() => {
                setEnquiryDestination('Custom Destination');
                setEnquiryTripType('Tailor-Made Journey');
                setIsEnquiryOpen(true);
              }}
            />
          </>
        ) : (
            <div className="text-center py-20 bg-neutral-50 dark:bg-[#0E0E0E] rounded-3xl border border-neutral-200 dark:border-white/10 p-8">
              <Compass className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">No destinations found</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 mb-4">
                Try searching for a different country, or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                }}
                className="px-5 py-2 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Destination Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onEnquire={(name) => {
            setSelectedDestination(null);
            handleEnquire(name);
          }}
        />
      )}

      {/* Popup Enquiry Card */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
      />

      {/* Wishlist Drawer */}
      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'contact') setIsEnquiryOpen(true);
          else if (path === 'packages') navigate('/packages');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => handleEnquire(name)}
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
