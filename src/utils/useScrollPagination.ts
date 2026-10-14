import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface UseScrollPaginationOptions<T> {
  items: T[];
  pageSize?: number;
  initialPageSize?: number;
  resetDeps?: unknown[];
}

export interface UseScrollPaginationReturn<T> {
  visibleItems: T[];
  displayedCount: number;
  totalCount: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollPagination<T>({
  items,
  pageSize = 6,
  initialPageSize = 6,
  resetDeps = [],
}: UseScrollPaginationOptions<T>): UseScrollPaginationReturn<T> {
  const [displayedCount, setDisplayedCount] = useState<number>(initialPageSize);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when items or filters change
  useEffect(() => {
    setDisplayedCount(initialPageSize);
    setIsLoadingMore(false);
  }, [items.length, initialPageSize, ...resetDeps]);

  const hasMore = displayedCount < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    // Micro-delay gives a smooth, premium loading feedback sensation
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + pageSize, items.length));
      setIsLoadingMore(false);
    }, 280);
  }, [hasMore, isLoadingMore, pageSize, items.length]);

  // IntersectionObserver for scroll-based auto loading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        rootMargin: '300px', // Pre-fetch 300px before reaching the sentinel for seamless scroll
        threshold: 0.05,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  const visibleItems = items.slice(0, displayedCount);

  return {
    visibleItems,
    displayedCount: Math.min(displayedCount, items.length),
    totalCount: items.length,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
  };
}
