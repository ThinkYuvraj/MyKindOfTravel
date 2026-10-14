import React, { useState, useMemo } from 'react';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PackageModal } from '../components/PackageModal';
import { EnquiryModal } from '../components/EnquiryModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { GlassImage } from '../components/GlassImage';
import { useWishlist } from '../context/WishlistContext';
import { WishlistModal } from '../components/WishlistModal';
import { useCms } from '../context/CmsContext';
import { useScrollPagination } from '../utils/useScrollPagination';
import { ScrollPaginationFooter } from '../components/ScrollPaginationFooter';
import { Search, Clock, Check, Plane, Heart, Eye, ArrowRight, Ticket, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Honeymoon', 'Alpine Luxury', 'Scenic Rail', 'Cultural & Heritage', 'Tropical & Beach'];

const checkPackageCategory = (pkg: TravelPackage, category: string) => {
  if (category === 'All') return true;
  if (category === 'Honeymoon') {
    return pkg.tag?.toLowerCase().includes('honeymoon') || pkg.title.toLowerCase().includes('honeymoon') || pkg.destination.includes('Santorini') || pkg.destination.includes('Maldives');
  }
  if (category === 'Alpine Luxury') {
    return pkg.destination.includes('Switzerland') || (pkg.tag && pkg.tag.toLowerCase().includes('alpine'));
  }
  if (category === 'Scenic Rail') {
    return pkg.title.toLowerCase().includes('rail') || pkg.features.some(f => f.toLowerCase().includes('train') || f.toLowerCase().includes('rail'));
  }
  if (category === 'Cultural & Heritage') {
    return pkg.destination.includes('Paris') || pkg.destination.includes('Prague') || pkg.destination.includes('Kyoto');
  }
  if (category === 'Tropical & Beach') {
    return pkg.destination.includes('Bali') || pkg.destination.includes('Maldives');
  }
  return true;
};

export default function PackagesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');
  const [enquiryPackageName, setEnquiryPackageName] = useState('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const { togglePackageWishlist, isPackageSaved } = useWishlist();
  const { packages } = useCms();

  const filtersWithCounts = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const count = packages.filter((pkg) => checkPackageCategory(pkg, cat)).length;
      return { label: cat, count };
    });
  }, [packages]);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.tag && pkg.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = checkPackageCategory(pkg, selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [packages, searchQuery, selectedCategory]);

  // Progressive Scroll-based Pagination
  const {
    visibleItems: visiblePackages,
    displayedCount,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
  } = useScrollPagination<TravelPackage>({
    items: filteredPackages,
    pageSize: 6,
    initialPageSize: 6,
    resetDeps: [searchQuery, selectedCategory],
  });

  const handleEnquire = (pkg: TravelPackage) => {
    setEnquiryDestination(pkg.destination);
    setEnquiryTripType(pkg.tag.includes('Honeymoon') ? 'Honeymoon' : 'Luxury Europe Tour');
    setEnquiryPackageName(pkg.title);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-10">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Ticket className="w-3.5 h-3.5" />
              <span>Proven Luxury Itineraries</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Curated <span className="italic font-serif text-[#E37500] font-normal">Travel Packages</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Every package is an insider blueprint crafted with private transfers, boutique 5-star suites, and handpicked local moments. Fully flexible to your dates and preferences.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages (e.g. Swiss Glacier, Maldives Lagoon, Paris Chic)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            {/* Category Pills in continuous capsule */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md overflow-x-auto no-scrollbar shrink-0 max-w-full">
              {filtersWithCounts.map((f) => {
                const isActive = selectedCategory === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setSelectedCategory(f.label)}
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

          {/* Packages Grid */}
          {filteredPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 items-stretch">
                {visiblePackages.map((pkg) => {
                  const isSaved = isPackageSaved(pkg.id);

                  return (
                    <div
                      key={pkg.id}
                      className="group rounded-3xl overflow-hidden bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 shadow-xs hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[530px] sm:min-h-[560px]"
                    >
                    {/* Image Header */}
                    <div className="flex flex-col flex-1">
                      <div className="relative h-52 overflow-hidden w-full shrink-0 bg-neutral-100 dark:bg-[#111111]">
                        <GlassImage
                          src={pkg.image}
                          alt={pkg.title}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-end gap-2 z-10">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePackageWishlist(pkg.id);
                              }}
                              className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer ${
                                isSaved
                                  ? 'bg-[#E37500] text-white'
                                  : 'bg-black/50 text-white hover:bg-black/75'
                              }`}
                              title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white font-medium z-10">
                          <Plane className="w-3.5 h-3.5 text-[#E37500] -rotate-45" />
                          <span>{pkg.destination}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="h-5 flex items-center gap-1 text-xs text-[#E37500] font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="h-14 flex items-start">
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight line-clamp-2">
                              {pkg.title}
                            </h3>
                          </div>
                          <div className="h-9 flex items-start">
                            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed line-clamp-2">
                              {pkg.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Features Bullet List */}
                        <div className="h-20 space-y-1.5 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex flex-col justify-center">
                          {pkg.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                              <div className="w-4 h-4 rounded-full bg-[#E37500]/15 dark:bg-[#E37500]/25 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-[#E37500] stroke-[3]" />
                              </div>
                              <span className="truncate font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="pt-2">
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-400 block font-medium font-sans uppercase tracking-wider">Starting from</span>
                          <span className="text-xl sm:text-2xl font-bold font-sans text-neutral-900 dark:text-white tracking-normal tabular-nums price-tag">
                            {pkg.startingPrice.replace('Starting from ', '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="flex-1 py-2.5 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-neutral-200 dark:border-white/20 shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E37500]" />
                        <span>Itinerary</span>
                      </button>

                      <button
                        onClick={() => handleEnquire(pkg)}
                        className="flex-1 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#E37500]/25 active:scale-95 border border-white/20 cursor-pointer"
                      >
                        <span>Enquire</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
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
              itemNoun="packages"
              onPlanCustom={() => {
                setEnquiryDestination('Custom Package');
                setEnquiryTripType('Bespoke Package');
                setIsEnquiryOpen(true);
              }}
            />
          </>
        ) : (
            <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl border border-neutral-200 dark:border-white/10 p-8">
              <Compass className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">No packages match your search</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 mb-4">
                Try resetting your filters or search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Package Modal */}
      {selectedPackage && (
        <PackageModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onCustomise={(pkg) => {
            setSelectedPackage(null);
            handleEnquire(pkg);
          }}
        />
      )}

      {/* Popup Enquiry Card */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
        initialPackageName={enquiryPackageName}
      />

      {/* Wishlist Drawer */}
      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'contact') setIsEnquiryOpen(true);
          else if (path === 'destinations') navigate('/destinations');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
          setEnquiryDestination(name);
          setEnquiryPackageName('');
          setIsEnquiryOpen(true);
        }}
        onSelectTripType={(type) => {
          setEnquiryTripType(type);
          setEnquiryPackageName('');
          setIsEnquiryOpen(true);
        }}
        onPlanTrip={() => setIsEnquiryOpen(true)}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
