import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/travelData';
import { DestinationItem } from '../types';
import { ArrowUpRight, Compass, Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassImage } from './GlassImage';
import { CarouselControlPill } from './CarouselControlPill';

interface DestinationsSectionProps {
  data?: DestinationItem[];
  onSelectDestination: (dest: DestinationItem) => void;
  onEnquireDestination: (destName: string) => void;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

const DESTINATION_META: Record<string, { code: string; flightTime: string }> = {
  'bali': { code: 'DPS', flightTime: '8h 45m · 1-Stop' },
  'paris': { code: 'CDG', flightTime: '9h 15m · Direct' },
  'switzerland': { code: 'ZRH', flightTime: '8h 30m · Direct' },
  'santorini': { code: 'JTR', flightTime: '10h 30m · 1-Stop' },
  'maldives': { code: 'MLE', flightTime: '2h 45m · Direct' },
  'amalfi': { code: 'NAP', flightTime: '9h 40m · 1-Stop' },
  'kyoto': { code: 'HND', flightTime: '8h 20m · Direct' },
  'cappadocia': { code: 'NAV', flightTime: '8h 15m · 1-Stop' },
  'prague': { code: 'PRG', flightTime: '9h 50m · 1-Stop' },
};

const matchesRegion = (dest: DestinationItem, region: string) => {
  if (region === 'All') return true;
  const regLower = (dest.region || '').toLowerCase();
  const idLower = (dest.id || '').toLowerCase();
  const nameLower = (dest.name || '').toLowerCase();

  if (region === 'Europe') {
    return (
      regLower.includes('europe') ||
      ['paris', 'switzerland', 'amalfi', 'santorini', 'prague', 'cappadocia'].includes(idLower)
    );
  }
  if (region === 'Southeast Asia') {
    return (
      regLower.includes('indonesia') ||
      regLower.includes('south-east') ||
      regLower.includes('southeast') ||
      ['bali'].includes(idLower)
    );
  }
  if (region === 'Islands & Beaches') {
    return (
      ['bali', 'maldives', 'santorini', 'amalfi'].includes(idLower) ||
      regLower.includes('ocean') ||
      regLower.includes('sea') ||
      nameLower.includes('maldives') ||
      nameLower.includes('bali') ||
      nameLower.includes('santorini')
    );
  }
  if (region === 'East Asia') {
    return (
      regLower.includes('east asia') ||
      ['kyoto'].includes(idLower) ||
      nameLower.includes('japan') ||
      nameLower.includes('kyoto') ||
      nameLower.includes('tokyo')
    );
  }
  return true;
};

const REGION_FILTERS = [
  'All',
  'Europe',
  'Southeast Asia',
  'Islands & Beaches',
  'East Asia',
];

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  data = DESTINATIONS,
  onSelectDestination,
  onEnquireDestination,
  customBadge,
  customTitle,
  customSubtitle,
}) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('All');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [selectedRegion, data]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 16 : 360;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 16 : 360;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const filtersWithCounts = useMemo(() => {
    return REGION_FILTERS.map((region) => {
      const count = data.filter((dest) => matchesRegion(dest, region)).length;
      return { label: region, count };
    });
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((dest) => matchesRegion(dest, selectedRegion));
  }, [data, selectedRegion]);

  return (
    <section id="destinations" className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      {/* Subtle ambient lighting with website tone */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-neutral-100/50 dark:bg-[#E37500]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Heading - Featured Destinations */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/10 backdrop-blur-md text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#E37500]" />
            <span>{customBadge || 'Handpicked Guides & Journeys'}</span>
          </div>

          {customTitle ? (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {customTitle}
            </h2>
          ) : (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Our Picked <span className="italic font-serif text-[#E37500] font-normal">Locations</span>
            </h2>
          )}

          <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            {customSubtitle || 'Explore world-renowned wonders, secret terraced hills, private island villas, and bucket-list cultural expeditions.'}
          </p>
        </div>

        {/* ── Category Filters and Caret Navigation ───────────────────────── */}
        <div className="flex flex-col items-center gap-3.5 mb-8 w-full">
          {/* Continuous category capsule pill container */}
          <div className="w-full flex justify-center overflow-x-auto no-scrollbar pb-1">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md shrink-0">
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

          {/* Caret Navigation & View All link - directly under the category section */}
          <div className="flex items-center justify-center w-full">
            <CarouselControlPill
              onPrev={scrollLeft}
              onNext={scrollRight}
              canPrev={canScrollLeft}
              canNext={canScrollRight}
              prevLabel="Previous destination"
              nextLabel="Next destination"
              viewAllLink="/destinations"
              viewAllText="VIEW ALL"
            />
          </div>
        </div>

        {/* Pure Caret Carousel of Destinations with side floating carets on tablet/desktop */}
        <div className="relative group/carousel">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Previous destination"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Next destination"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar items-stretch touch-carousel"
          >
          {filteredData.map((dest) => {
            const meta = DESTINATION_META[dest.id] || { code: 'Direct', flightTime: 'Curated Flight Route' };

            return (
              <div
                key={dest.id}
                className="group rounded-3xl overflow-hidden backdrop-blur-xl bg-white dark:bg-[#0B0B0B]/95 border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1 relative shrink-0 w-[86vw] xs:w-[80vw] max-w-[340px] sm:w-[340px] lg:w-[350px] xl:w-[360px] min-h-[500px] sm:min-h-[520px] snap-start"
              >
                <div className="flex flex-col flex-1">
                  {/* Image */}
                  <div className="relative h-44 xs:h-48 sm:h-50 overflow-hidden w-full shrink-0 bg-neutral-100 dark:bg-[#111111]">
                    <GlassImage
                      src={dest.image}
                      alt={dest.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Body: Heading on top, pills directly below heading */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Destination Heading */}
                      <div className="h-14 flex items-center">
                        <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight line-clamp-2">
                          {dest.name}
                        </h3>
                      </div>

                      {/* Pills below heading inside card */}
                      <div className="h-7 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white text-[11px] font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                          <span>{meta.flightTime}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#E37500] text-white text-[11px] font-bold shadow-sm shadow-[#E37500]/25 whitespace-nowrap">
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

                    {/* Highlights List */}
                    <div className="h-16 space-y-1.5 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                        <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                        <span>Signature Inclusions:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
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
                    onClick={() => onSelectDestination(dest)}
                    className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1 group/btn transition-colors cursor-pointer"
                  >
                    <span>View Itinerary</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#E37500]" />
                  </button>

                  <button
                    onClick={() => onEnquireDestination(dest.name)}
                    className="px-5 py-2 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Bottom Banner to Explore All Destinations */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Looking for a custom multi-country blueprint?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Explore our full portfolio of worldwide destinations with flight times, pricing, and signature inclusions.
            </p>
          </div>
          <button
            onClick={() => navigate('/destinations')}
            className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore All Destinations</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};

