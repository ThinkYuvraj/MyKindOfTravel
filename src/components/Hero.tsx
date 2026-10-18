import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import heroVideo from '../assets/videos/HeroVideo.mp4';
import heroBgImage from '../assets/images/hero-terraces.jpg';
import { TornPaperDivider } from './TornPaperDivider';

// High-definition scenic aerial travel video stream (HeroVideo.mp4 primary)
const DEFAULT_HERO_VIDEOS = [
  heroVideo,
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-mountain-range-at-sunset-41628-large.mp4',
  'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4',
];

interface HeroProps {
  onPlanTrip: () => void;
  onExploreDestinations: () => void;
  onSelectHighlight?: (destinationName: string) => void;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  bgImage?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTrip,
  onExploreDestinations,
  title,
  subtitle,
  badgeText,
  bgImage,
  primaryButtonText,
  secondaryButtonText,
}) => {
  const displayTitle = title?.trim() ? title : 'EXPLORE. DREAM. DISCOVER.';
  const displaySubtitle = subtitle?.trim()
    ? subtitle
    : "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.";
  const displayBadge = badgeText?.trim() ? badgeText : 'My Kind of Travel • Bespoke Journeys';
  const displayPrimaryBtn = primaryButtonText?.trim() ? primaryButtonText : 'START EXPLORING';
  const displaySecondaryBtn = secondaryButtonText?.trim() ? secondaryButtonText : 'PLAN TRIP';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  // Determine if bgImage is a video URL or custom uploaded video
  const isBgVideo =
    Boolean(bgImage) &&
    (bgImage!.includes('.mp4') ||
      bgImage!.includes('.webm') ||
      bgImage!.includes('.mov') ||
      bgImage!.startsWith('data:video/') ||
      bgImage!.startsWith('/hero-video.mp4'));

  const activeVideoSrc = customVideoUrl || (isBgVideo ? bgImage! : heroVideo);
  const activePoster = !isBgVideo && bgImage && bgImage.trim() ? bgImage : heroBgImage;

  // Ensure video autoplays and loops infinitely with controls hidden
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.defaultMuted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.controls = false;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Retry muted playback on user interaction if browser policy blocked initial frame
      });
    }
  }, [activeVideoSrc]);

  // Allow dropping a video file directly onto the Hero section to set it immediately
  const handleDropVideo = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;

    const localBlobUrl = URL.createObjectURL(file);
    setCustomVideoUrl(localBlobUrl);
    setVideoFailed(false);

    try {
      const res = await fetch('/api/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'video/mp4' },
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.videoUrl) {
          setCustomVideoUrl(data.videoUrl);
        }
      }
    } catch (err) {
      console.warn('Could not persist dropped video to server:', err);
    }
  };

  return (
    <section
      id="hero"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropVideo}
      className="relative w-full h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black text-white select-none top-0 mt-0 pt-0"
    >
      {/* Background Infinite Autoplay Video (No Controls) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {!videoFailed ? (
          <video
            ref={videoRef}
            key={activeVideoSrc}
            poster={activePoster}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover object-center scale-[1.02] pointer-events-none select-none [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
          >
            <source src={activeVideoSrc} type="video/mp4" />
            {DEFAULT_HERO_VIDEOS.map((url, idx) => (
              <source key={idx} src={url} type="video/mp4" />
            ))}
          </video>
        ) : (
          <img
            src={activePoster}
            alt="Bespoke luxury travel landscapes"
            className="w-full h-full object-cover object-center scale-105"
          />
        )}

        {/* Subtle Vignette & Gradient Overlays for Crystal-Clear Text Contrast */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70 pointer-events-none" />
      </div>

      {/* Hero Centered Content Acquiring Full Main Frame */}
      <div className="relative z-10 w-full max-w-6xl 2xl:max-w-7xl 3xl:max-w-[88rem] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 text-center flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 sm:pb-24">
        {/* Eyebrow Pill Tagline Badge */}
        {displayBadge && (
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-[#E37500]/50 backdrop-blur-md shadow-lg transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E37500] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-white/95">
              {displayBadge}
            </span>
          </div>
        )}

        {/* Main Display Headline - Responsive Fluid Size */}
        <h1 className="font-sans font-extrabold uppercase text-white tracking-[0.03em] sm:tracking-[0.06em] md:tracking-[0.08em] text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.25rem] leading-[1.12] sm:leading-[1.06] drop-shadow-[0_4px_22px_rgba(0,0,0,0.9)] max-w-2xl sm:max-w-4xl lg:max-w-5xl 2xl:max-w-6xl mx-auto">
          {displayTitle}
        </h1>

        {/* Descriptive Subtitle for My Kind of Travel */}
        <p className="mt-4 sm:mt-6 px-1 sm:px-4 text-white/95 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-[1.35rem] font-normal max-w-xs xs:max-w-md sm:max-w-xl md:max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] whitespace-pre-line">
          {displaySubtitle}
        </p>

        {/* Slogan */}
        <div className="mt-3 sm:mt-5 flex flex-col items-center">
          <span className="text-white/90 text-xs sm:text-sm md:text-base font-medium tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Your personal travel designer awaits
          </span>
        </div>

        {/* Action Buttons: Crystal Glassmorphic Transparent Styling */}
        <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[270px] xs:max-w-[300px] sm:max-w-none mx-auto">
          <button
            onClick={onExploreDestinations}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 xs:px-7 sm:px-9 md:px-11 py-3 xs:py-3.5 sm:py-4 bg-[#E37500]/20 hover:bg-[#E37500]/40 backdrop-blur-xl border border-[#E37500]/80 hover:border-white text-white font-extrabold text-[11px] xs:text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(227,117,0,0.25)] hover:shadow-[0_8px_35px_rgba(227,117,0,0.45)] hover:scale-[1.03] active:scale-95 text-center rounded-full cursor-pointer"
          >
            {displayPrimaryBtn}
          </button>

          <button
            onClick={onPlanTrip}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 xs:px-7 sm:px-9 md:px-10 py-3 xs:py-3.5 sm:py-4 bg-white/5 hover:bg-white/15 backdrop-blur-xl border border-white/40 hover:border-white/80 text-white hover:text-white font-bold text-[11px] xs:text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_35px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-95 rounded-full text-center cursor-pointer"
          >
            <span>{displaySecondaryBtn}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Torn Paper Jagged Edge Divider at the bottom transitioning seamlessly */}
      <TornPaperDivider position="bottom" />
    </section>
  );
};
