import React, { useState, useEffect } from 'react';
import { X, Calendar, Heart, Sparkles, Check, ArrowRight, Share2, CheckCheck } from 'lucide-react';
import { DestinationItem } from '../types';
import { GlassImage } from './GlassImage';

interface DestinationModalProps {
  destination: DestinationItem | null;
  onClose: () => void;
  onEnquire: (destinationName: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onEnquire,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (destination) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [destination, onClose]);

  if (!destination) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/destinations?highlight=${encodeURIComponent(destination.name)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Discover ${destination.name} - My Kind of Travel`,
          text: destination.description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-3 sm:p-6 bg-black/70 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[94dvh] sm:max-h-[90vh] bg-white dark:bg-[#0A0A0A] backdrop-blur-2xl border border-neutral-200 dark:border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-neutral-900 dark:text-white transition-colors">
        {/* Header Image with Glassmorphic Skeleton */}
        <div className="relative h-40 xs:h-48 sm:h-64 overflow-hidden shrink-0 w-full bg-neutral-100 dark:bg-neutral-900">
          <GlassImage
            src={destination.image}
            alt={destination.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover filter brightness-95"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Action Buttons: Share & Close */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 dark:bg-[#141414]/90 hover:bg-[#E37500] dark:hover:bg-[#E37500] text-neutral-900 dark:text-white hover:text-white border border-neutral-200/80 dark:border-white/20 transition-colors shadow-sm backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold px-3"
              title="Share Destination"
              aria-label="Share destination"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4 text-[#E37500]" />
                  <span className="text-[11px] text-[#E37500]">Copied!</span>
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
              className="p-2 rounded-full bg-white/90 dark:bg-[#141414]/90 hover:bg-[#E37500] dark:hover:bg-[#E37500] text-neutral-900 dark:text-white hover:text-white border border-neutral-200/80 dark:border-white/20 transition-colors shadow-sm backdrop-blur-md"
              aria-label="Close modal (Esc)"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#E37500] text-white text-[10px] uppercase tracking-widest font-bold shadow-xs">
              {destination.region}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1.5 drop-shadow-sm">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 bg-transparent">
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
            {destination.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Best Season */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E37500]">
                <Calendar className="w-4 h-4" />
                <span>Best Time to Visit</span>
              </div>
              <p className="text-xs text-neutral-900 dark:text-white font-medium">
                {destination.bestTime}
              </p>
            </div>

            {/* Ideal For */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E37500]">
                <Heart className="w-4 h-4" />
                <span>Ideal For</span>
              </div>
              <p className="text-xs text-neutral-900 dark:text-white font-medium">
                {destination.idealFor}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E37500]" />
              <span>Signature Experiences We Curate</span>
            </h4>
            <div className="space-y-2">
              {destination.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                  <Check className="w-4 h-4 text-[#E37500] shrink-0 mt-0.5" />
                  <span className="font-medium">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-neutral-50 dark:bg-[#0E0E0E] border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-bold">Estimated Investment</span>
            <span className="font-sans font-bold text-[#E37500] text-sm sm:text-base">
              {destination.priceNote}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-neutral-200/70 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-800 dark:text-neutral-200 text-xs font-bold border border-neutral-300/80 dark:border-white/10 transition-all text-center"
            >
              Close
            </button>
            <button
              onClick={() => onEnquire(destination.name)}
              className="flex-[2] sm:flex-none px-5 py-2.5 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#E37500]/25 border border-white/20 active:scale-95 transition-all"
            >
              <span>Enquire for {destination.name.split(',')[0]}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
