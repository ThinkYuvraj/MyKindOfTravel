import React from 'react';
import { ArrowDown, Check, Sparkles } from 'lucide-react';

export interface ScrollPaginationFooterProps {
  displayedCount: number;
  totalCount: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  itemNoun?: string;
  onPlanCustom?: () => void;
}

export const ScrollPaginationFooter: React.FC<ScrollPaginationFooterProps> = ({
  displayedCount,
  totalCount,
  hasMore,
  isLoadingMore,
  onLoadMore,
  sentinelRef,
  itemNoun = 'experiences',
  onPlanCustom,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="pt-8 pb-4 flex flex-col items-center justify-center space-y-4 w-full">
      {/* Intersection Observer Sentinel */}
      <div ref={sentinelRef} className="h-6 w-full -mt-6 pointer-events-none opacity-0" aria-hidden="true" />

      {/* Progress & Item Count Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <span>
          Showing <strong className="text-neutral-900 dark:text-white font-bold">{displayedCount}</strong> of{' '}
          <strong className="text-neutral-900 dark:text-white font-bold">{totalCount}</strong> {itemNoun}
        </span>
      </div>

      {/* Loading More State */}
      {isLoadingMore && (
        <div className="flex items-center gap-3 py-3 px-5 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/10 shadow-sm animate-in fade-in duration-150">
          <div className="w-4 h-4 rounded-full border-2 border-[#E37500] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Unveiling more curated {itemNoun}...
          </span>
        </div>
      )}

      {/* Manual Load More Button if not yet triggered */}
      {hasMore && !isLoadingMore && (
        <button
          type="button"
          onClick={onLoadMore}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-[#111111] hover:bg-[#E37500] dark:hover:bg-[#E37500] text-neutral-900 dark:text-white hover:text-white border border-neutral-200 dark:border-white/15 hover:border-[#E37500] transition-all duration-300 text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md active:scale-95 cursor-pointer touch-manipulation"
        >
          <span>Scroll down or click to load more</span>
          <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      )}

      {/* End of Catalog State */}
      {!hasMore && totalCount > 4 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 max-w-lg mx-auto text-center space-y-2.5 shadow-xs animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-[#E37500]/15 text-[#E37500] flex items-center justify-center mx-auto text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="font-serif text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
            You've explored all {totalCount} curated {itemNoun}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            Looking for a private island, secret lodge, or bespoke itinerary not listed here?
          </p>
          {onPlanCustom && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onPlanCustom}
                className="px-5 py-2 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95"
              >
                Request Custom Blueprint
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
