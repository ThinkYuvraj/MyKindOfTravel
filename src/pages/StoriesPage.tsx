import React, { useState } from 'react';
import { TESTIMONIALS, COMPANY_INFO } from '../data/travelData';
import { TestimonialItem } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { WishlistModal } from '../components/WishlistModal';
import { EnquiryModal } from '../components/EnquiryModal';
import { useCms } from '../context/CmsContext';
import { useScrollPagination } from '../utils/useScrollPagination';
import { ScrollPaginationFooter } from '../components/ScrollPaginationFooter';
import { Heart, Star, MapPin, Quote, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StoriesPage() {
  const navigate = useNavigate();
  const { testimonials } = useCms();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryTripType, setEnquiryTripType] = useState('');

  // Progressive Scroll-based Pagination
  const {
    visibleItems: visibleStories,
    displayedCount,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
  } = useScrollPagination<TestimonialItem>({
    items: testimonials,
    pageSize: 4,
    initialPageSize: 4,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-12">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Heart className="w-3.5 h-3.5 text-[#E37500]" />
              <span>Real Experiences · India's Discerning Travelers</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Client Stories & <span className="italic font-serif text-[#E37500] font-normal">Memories</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Read uncensored feedback from our clients across Mumbai, Delhi, Bengaluru, and beyond who trusted My Kind of Travel for honeymoons, anniversaries, multi-generational family milestones, and private escapes.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 items-stretch">
            {visibleStories.map((review) => (
              <div
                key={review.id}
                className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 relative group hover:-translate-y-1 transition-all duration-300 h-[290px] sm:h-[310px]"
              >
                <div className="space-y-3 flex-1 flex flex-col">
                  {/* Stars & Location */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#E37500]">
                      {Array.from({ length: review.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                      <span>{review.tripInfo}</span>
                    </span>
                  </div>

                  {/* Quote with uniform clamp */}
                  <div className="h-28 flex items-start overflow-hidden">
                    <blockquote className="font-serif text-sm sm:text-base leading-relaxed text-neutral-900 dark:text-white italic line-clamp-4">
                      "{review.quote}"
                    </blockquote>
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-200 dark:border-white/20"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#E37500] text-white flex items-center justify-center font-bold text-sm">
                        {review.initial || review.author[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                        {review.author}
                      </h4>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {review.year}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#E37500] px-2.5 py-1 rounded-full bg-[#E37500]/10 border border-[#E37500]/20">
                    Verified Journey
                  </span>
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
            itemNoun="stories"
            onPlanCustom={() => setIsEnquiryOpen(true)}
          />

          {/* Bottom Banner */}
          <div className="p-8 sm:p-12 rounded-3xl sm:rounded-4xl bg-neutral-900 dark:bg-[#0A0A0A] border border-neutral-800 dark:border-white/15 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Ready to create your own unforgettable story?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Connect directly with your private concierge to build an itinerary tailored to your rhythm and milestones.
              </p>
            </div>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#E37500]/30 transition-all shrink-0 active:scale-95"
            >
              <span>Design Your Trip</span>
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
          else if (path === 'contact') setIsEnquiryOpen(true);
          else navigate(`/#${path}`);
        }}
        onSelectDestination={() => setIsEnquiryOpen(true)}
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
