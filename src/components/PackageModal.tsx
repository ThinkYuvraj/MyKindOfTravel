import React, { useEffect, useState } from 'react';
import { TravelPackage } from '../types';
import { X, Check, Clock, MapPin, ArrowRight, Sparkles, Share2, CheckCheck } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface PackageModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
  onCustomise: (pkg: TravelPackage) => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({ pkg, onClose, onCustomise }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pkg) return;

    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Escape key listener to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pkg, onClose]);

  if (!pkg) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Discover this luxury journey: ${pkg.title} (${pkg.destination}) - Starting ${pkg.startingPrice} with My Kind of Travel. https://mykindoftravel.com`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-3 sm:p-6 bg-black/65 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[94dvh] sm:max-h-[90vh] bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/15 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col text-neutral-900 dark:text-white transition-colors">
        {/* Modal Header with Glassmorphic Skeleton Image */}
        <div className="relative h-40 xs:h-48 sm:h-64 md:h-72 shrink-0 overflow-hidden w-full">
          <GlassImage
            src={pkg.image}
            alt={pkg.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover filter brightness-95"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Action Buttons: Share & Close */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 dark:bg-[#141414]/90 hover:bg-[#E37500] text-neutral-900 dark:text-white hover:text-white border border-neutral-200 dark:border-white/20 transition-colors shadow-sm backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold px-3"
              title="Share Itinerary"
              aria-label="Share package"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4 text-[#E37500] dark:text-[#E37500]" />
                  <span className="text-[11px] text-[#E37500] dark:text-[#E37500]">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px]">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 dark:bg-[#141414]/90 hover:bg-[#E37500] text-neutral-900 dark:text-white hover:text-white border border-neutral-200 dark:border-white/20 transition-colors shadow-sm backdrop-blur-md"
              aria-label="Close modal (Esc)"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header Info */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1 z-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
              {pkg.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-200 pt-1 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E37500]" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                {pkg.destination}
              </span>
              <span className="font-sans font-bold text-[#E37500] text-sm tabular-nums price-tag">
                {pkg.startingPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-[#0A0A0A]">
          {/* Inclusions */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E37500]" />
              <span>Bespoke Inclusions & Perks</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pkg.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300 p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                  <Check className="w-4 h-4 text-[#E37500] shrink-0 mt-0.5" />
                  <span className="font-medium">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E37500]" />
              <span>Day-by-Day Flow (Customisable)</span>
            </h3>
            <div className="space-y-3">
              {pkg.dayHighlights.map((item) => (
                <div key={item.day} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-[#E37500]/30">
                    D{item.day}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-white dark:bg-[#0E0E0E] border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            <span>Starting at </span>
            <span className="font-sans font-bold text-[#E37500] text-base tabular-nums price-tag">
              {pkg.startingPrice}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-700 dark:text-white text-xs font-bold border border-neutral-200 dark:border-white/20 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onCustomise(pkg)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#E37500]/25 border border-white/20 cursor-pointer"
            >
              <span>Customise This Package</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
