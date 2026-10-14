import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXPERIENCE_PILLARS } from '../data/travelData';
import { ExperiencePillar } from '../types';
import { ArrowRight, Sparkles, Check, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { CarouselControlPill } from './CarouselControlPill';

interface ExperiencesSectionProps {
  pillars?: ExperiencePillar[];
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
  onPlanTripType: (tripType: string) => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  pillars,
  customBadge,
  customTitle,
  customSubtitle,
  onPlanTripType,
}) => {
  const navigate = useNavigate();
  const activePillars = pillars && pillars.length > 0 ? pillars : EXPERIENCE_PILLARS;
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
  }, [activePillars]);

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
    <section id="experiences" className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        {/* Section Heading & Caret Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 backdrop-blur-md text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
              <span>{customBadge || 'What we curate'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Every kind of <span className="italic font-serif text-[#E37500] font-normal">extraordinary</span>
              </h2>
            )}

            <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
              {customSubtitle || 'Tailored journeys created for personal celebrations, multi-city cultural quests, executive gatherings, and spontaneous luxury getaways.'}
            </p>
          </div>

          {/* Caret Controls & Link to All Experiences in unified pill */}
          <div className="flex items-center justify-start sm:justify-end w-full lg:w-auto">
            <CarouselControlPill
              onPrev={scrollLeft}
              onNext={scrollRight}
              canPrev={canScrollLeft}
              canNext={canScrollRight}
              prevLabel="Previous experience"
              nextLabel="Next experience"
              viewAllLink="/experiences"
              viewAllText="VIEW ALL"
            />
          </div>
        </div>

        {/* Pure Caret Carousel of Experiences with Floating Side Carets on tablet/desktop */}
        <div className="relative group/carousel">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Previous experience"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Next experience"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar items-stretch touch-carousel"
          >
          {activePillars.map((exp) => (
            <div
              key={exp.number}
              className="rounded-3xl backdrop-blur-xl bg-white dark:bg-[#0B0B0B]/95 border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative shrink-0 w-[86vw] xs:w-[80vw] max-w-[350px] sm:w-[350px] md:w-[360px] lg:w-[380px] min-h-[490px] sm:min-h-[520px] snap-start"
            >
              {/* Pillar Image Header */}
              {exp.image && (
                <div className="relative w-full h-40 xs:h-44 overflow-hidden border-b border-neutral-200 dark:border-white/10 shrink-0">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              <div className="p-5 sm:p-6 md:p-7 flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-2.5">
                  <div className="h-14 flex items-center">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight line-clamp-2">
                      {exp.title}
                    </h3>
                  </div>

                  <div className="h-16 flex items-start">
                    <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal line-clamp-3">
                      {exp.description}
                    </p>
                  </div>

                  {/* Micro Highlights */}
                  <div className="h-16 flex flex-col justify-center pt-2 space-y-1.5 border-t border-neutral-200 dark:border-white/10">
                    {exp.highlights.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-200">
                        <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                        <span className="truncate font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Link with #E37500 */}
                <div className="pt-3 border-t border-neutral-100 dark:border-white/5 relative z-10">
                  <button
                    onClick={() => onPlanTripType(exp.typeKey)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E37500] hover:text-[#C66500] transition-colors group/link cursor-pointer"
                  >
                    <span>{exp.ctaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom Banner to Explore All Experiences */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Curious about our complete range of holiday styles?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Explore all pillars — from panoramic alpine rail and luxury villas to private culinary masterclasses.
            </p>
          </div>
          <button
            onClick={() => navigate('/experiences')}
            className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore All Experiences</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
