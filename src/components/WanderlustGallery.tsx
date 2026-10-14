import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GALLERY_ITEMS } from '../data/travelData';
import { GalleryItem } from '../types';
import { Camera, MapPin, X, ChevronLeft, ChevronRight, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { GlassImage } from './GlassImage';
import { CarouselControlPill } from './CarouselControlPill';

interface WanderlustGalleryProps {
  items?: GalleryItem[];
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
  onPlanTripForLocation?: (location: string) => void;
}

export const WanderlustGallery: React.FC<WanderlustGalleryProps> = ({
  items,
  customBadge,
  customTitle,
  customSubtitle,
  onPlanTripForLocation,
}) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = ['All', 'Stays', 'Journeys', 'Moments', 'Gourmet'];
  const sourceItems = items && items.length > 0 ? items : GALLERY_ITEMS;

  const filtersWithCounts = useMemo(() => {
    return categories.map((cat) => {
      const count =
        cat === 'All'
          ? sourceItems.length
          : sourceItems.filter((item) => item.category === cat).length;
      return { label: cat, count };
    });
  }, [sourceItems]);

  const filteredItems =
    activeCategory === 'All'
      ? sourceItems
      : sourceItems.filter((item) => item.category === activeCategory);

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [activeCategory, filteredItems.length]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 24 : 380;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 24 : 380;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neutral-100/50 dark:bg-[#E37500]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        
        {/* Section Header & Right-Hand Pill Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>{customBadge || 'Moments & Memories'}</span>
            </div>
            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                Curated by Us, <br className="hidden sm:inline" />
                <span className="text-[#E37500] italic font-normal">Experienced by You</span>
              </h2>
            )}
            <p className="max-w-xl text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              {customSubtitle || 'Real travel snapshots captured across our private chalets, cliffside villas, overwater bungalows, and bespoke European journeys.'}
            </p>
          </div>

          {/* Caret Navigation & View All link - right hand side of heading */}
          <div className="flex items-center justify-start sm:justify-end w-full lg:w-auto">
            <CarouselControlPill
              onPrev={scrollLeft}
              onNext={scrollRight}
              canPrev={canScrollLeft}
              canNext={canScrollRight}
              prevLabel="Previous place"
              nextLabel="Next place"
              viewAllLink="/places"
              viewAllText="VIEW ALL"
            />
          </div>
        </div>

        {/* ── Category Filters: horizontally scrollable ─────────────────── */}
        <div className="w-full overflow-x-auto no-scrollbar py-1 mb-8">
          <div className="flex flex-row items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md shrink-0 w-max">
            {filtersWithCounts.map((f) => {
              const isActive = activeCategory === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => setActiveCategory(f.label)}
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

        {/* Carousel of Places with floating side carets on tablet/desktop */}
        <div className="relative group/carousel">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Previous place"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Next place"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar items-stretch touch-carousel"
          >
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between relative shrink-0 w-[84vw] xs:w-[78vw] max-w-[340px] sm:w-[340px] lg:w-[360px] min-h-[440px] sm:min-h-[460px] snap-start"
            >
              {/* Image Frame with Clean Aspect Ratio */}
              <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-100 dark:bg-[#111111] shrink-0">
                <GlassImage
                  src={item.image}
                  alt={item.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-none">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-md">
                    <ArrowUpRight className="w-4 h-4 text-[#E37500]" />
                    <span>View Photo</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/20">
                    {item.category}
                  </span>
                </div>

                {/* Always visible category badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Clean Uncluttered Typography Footer */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1 font-semibold text-[#E37500]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Sparkles className="w-3 h-3 text-[#E37500]" />
                      <span>Curated</span>
                    </span>
                  </div>

                  <div className="h-14 flex items-center">
                    <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="h-10 flex items-start">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                      {item.caption || 'Handpicked scenic moments curated by our local travel designers.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#E37500] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-neutral-400">Tap to inspect</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom Banner Link to All Places */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Looking for more inspiration across 40+ destinations?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Browse our complete catalog of private villas, alpine retreats, and coastal havens.
            </p>
          </div>
          <button
            onClick={() => navigate('/places')}
            className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>See All Places & Views</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Sleek Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Close image preview"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div className="w-full h-[50vh] sm:h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details Footer */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  <span className="font-semibold text-[#E37500] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activePhoto.location}
                  </span>
                  <span>·</span>
                  <span>{activePhoto.category}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  {activePhoto.title}
                </h3>
                {activePhoto.caption && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-xl">
                    {activePhoto.caption}
                  </p>
                )}
              </div>

              {onPlanTripForLocation && (
                <button
                  onClick={() => {
                    onPlanTripForLocation(activePhoto.location);
                    setActiveLightboxIndex(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Experience This</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
