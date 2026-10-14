import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plane,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import { GlassImage } from './GlassImage';
import { VIP_PRIVILEGES, VipPrivilege } from '../data/travelData';
import { CarouselControlPill } from './CarouselControlPill';

interface VipPrivilegesSectionProps {
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
  privileges?: VipPrivilege[];
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Plane,
  Sparkles,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Crown,
};

export const VipPrivilegesSection: React.FC<VipPrivilegesSectionProps> = ({
  customBadge,
  customTitle,
  customSubtitle,
  privileges = VIP_PRIVILEGES,
}) => {
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
  }, [privileges]);

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

  return (
    <section
      id="vip-privileges"
      className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300"
    >
      <div className="section-container">
        {/* Section Header with Caret Controls Only (No unnecessary buttons) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 backdrop-blur-md text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
              <span>{customBadge || 'Curated Privileges'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Signature VIP <span className="italic font-serif text-[#E37500] font-normal">Privileges</span>
              </h2>
            )}

            <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
              {customSubtitle || 'Exclusive perks reserved for our private clients'}
            </p>
          </div>

          {/* Caret Navigation Controls in sleek capsule pill */}
          <div className="flex items-center justify-end self-start sm:self-end">
            <CarouselControlPill
              onPrev={scrollLeft}
              onNext={scrollRight}
              canPrev={canScrollLeft}
              canNext={canScrollRight}
              prevLabel="Previous perk"
              nextLabel="Next perk"
            />
          </div>
        </div>

        {/* ── Caret Carousel with Side Floating Carets on tablet/desktop ── */}
        <div className="relative group/carousel">
          {/* Floating Left Side Caret */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Previous perk"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Floating Right Side Caret */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Next perk"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar items-stretch touch-carousel"
          >
            {privileges.map((perk) => {
              const IconComponent = (perk.iconName && ICON_MAP[perk.iconName]) || Sparkles;

              return (
                <div
                  key={perk.id}
                  className="rounded-3xl backdrop-blur-xl bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative shrink-0 w-[86vw] xs:w-[80vw] max-w-[350px] sm:w-[350px] lg:w-[380px] min-h-[440px] sm:min-h-[460px] snap-start"
                >
                  {/* Top Image & Badge */}
                  <div className="relative w-full h-44 xs:h-48 overflow-hidden bg-neutral-100 dark:bg-[#111111] shrink-0">
                    <GlassImage
                      src={perk.image}
                      alt={perk.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Badge at top right */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] uppercase tracking-widest text-white font-bold border border-white/20 shadow-xs">
                        {perk.badge}
                      </span>
                    </div>

                    {/* Floating Icon at bottom left */}
                    <div className="absolute bottom-3.5 left-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-[#111111]/95 text-[#E37500] flex items-center justify-center shadow-md border border-white/30 dark:border-white/10">
                        <IconComponent className="w-5 h-5 stroke-[2.2]" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-14 flex items-center">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight line-clamp-2">
                          {perk.title}
                        </h3>
                      </div>

                      <div className="h-5 flex items-center">
                        {perk.highlight ? (
                          <p className="text-xs font-semibold text-[#E37500] tracking-wide truncate">
                            {perk.highlight}
                          </p>
                        ) : null}
                      </div>

                      <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal line-clamp-3">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
