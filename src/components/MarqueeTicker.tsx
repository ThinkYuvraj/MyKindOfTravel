import React from 'react';
import { MARQUEE_ITEMS } from '../data/travelData';
import { Plane, Compass } from 'lucide-react';

interface MarqueeTickerProps {
  items?: string[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ items = MARQUEE_ITEMS }) => {
  const activeItems = items && items.length > 0 ? items : MARQUEE_ITEMS;
  // Duplicate array multiple times for smooth continuous loop
  const repeated = [...activeItems, ...activeItems, ...activeItems, ...activeItems];

  return (
    <div className="w-full bg-white dark:bg-[#050505] text-neutral-900 dark:text-neutral-200 border-y border-neutral-200 dark:border-white/10 overflow-hidden py-3 select-none relative shadow-xs transition-colors">
      <div className="flex w-max items-center animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {repeated.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 px-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              {idx % 4 === 0 && <Plane className="w-3.5 h-3.5 text-[#E37500] -rotate-45" />}
              {idx % 4 === 2 && <Compass className="w-3.5 h-3.5 text-[#E37500]" />}
              <span>{item}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E37500]/60 inline-block shadow-xs" />
          </div>
        ))}
      </div>
    </div>
  );
};
