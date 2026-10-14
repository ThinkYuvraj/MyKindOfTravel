import React, { useState, useRef, useEffect } from 'react';
import { TESTIMONIALS } from '../data/travelData';
import { TestimonialItem } from '../types';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassImage } from './GlassImage';
import { CarouselControlPill } from './CarouselControlPill';

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  customBadge,
  customTitle,
  customSubtitle,
}) => {
  const activeReviews = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;
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
  }, [activeReviews]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 24 : 480;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 24 : 480;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="stories" className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-black text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        {/* Heading & Caret Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-[#E37500]/20 text-[#E37500]" />
              <span>{customBadge || 'Real stories'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Trips that <span className="italic font-serif text-[#E37500] font-normal">changed everything</span>
              </h2>
            )}

            <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
              {customSubtitle || 'Honest feedback from Indian couples, corporate leaders, and families who trusted us with their most cherished milestones.'}
            </p>
          </div>

          {/* Caret Controls & Link to All Stories in unified pill */}
          <div className="flex items-center justify-start sm:justify-end w-full lg:w-auto">
            <CarouselControlPill
              onPrev={scrollLeft}
              onNext={scrollRight}
              canPrev={canScrollLeft}
              canNext={canScrollRight}
              prevLabel="Previous story"
              nextLabel="Next story"
              viewAllLink="/stories"
              viewAllText="VIEW ALL"
            />
          </div>
        </div>

        {/* Stories Carousel with floating side carets */}
        <div className="relative group/carousel">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border border-neutral-200 dark:border-white/20 shadow-md text-neutral-900 dark:text-white items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-90 cursor-pointer"
            aria-label="Next story"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar items-stretch touch-carousel"
          >
            {activeReviews.map((review) => (
              <div
                key={review.id}
                className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 flex flex-col justify-between shadow-[0_6px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative group shrink-0 w-[88vw] xs:w-[84vw] sm:w-[460px] md:w-[480px] lg:w-[520px] min-h-[300px] sm:min-h-[320px] snap-start"
              >
                <div className="space-y-3">
                  {/* 5 Stars in vibrant #E37500 */}
                  <div className="flex items-center gap-1 text-[#E37500]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E37500] text-[#E37500]" />
                    ))}
                  </div>

                  {/* Quote with fixed height and clamp */}
                  <div className="h-28 flex items-start overflow-hidden">
                    <p className="text-neutral-700 dark:text-neutral-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal italic line-clamp-4">
                      "{review.quote}"
                    </p>
                  </div>
                </div>

                {/* Author & Avatar */}
                <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center gap-3">
                  {review.avatar ? (
                    <GlassImage
                      src={review.avatar}
                      alt={review.author}
                      containerClassName="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-neutral-200 dark:border-white/20 shadow-xs"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#E37500]/15 dark:bg-[#E37500]/25 text-[#E37500] font-serif font-bold text-base flex items-center justify-center border border-[#E37500]/30 shrink-0">
                      {review.initial}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                      {review.author}
                    </h4>
                    <p className="text-xs text-[#E37500] font-semibold">
                      {review.tripInfo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
