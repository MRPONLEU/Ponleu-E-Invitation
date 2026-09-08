import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoupleEvent, Language } from '../../types';

interface WeddingGallerySlideshowProps {
  couple: CoupleEvent;
  lang: Language;
  onProceedToInvitation: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

// 4 Distinct Cinematic Ken Burns animation variants (Zoom In, Zoom Out, Pan Right, Pan Left)
const SLIDE_VARIANTS = [
  // 0: Majestic Slow Zoom In (Push In)
  {
    initial: { scale: 1.0, x: '0%', y: '0%', opacity: 0 },
    animate: { scale: 1.16, x: '0%', y: '-1.5%', opacity: 1 },
    exit: { opacity: 0, scale: 1.18 },
    transition: {
      scale: { duration: 5.5, ease: 'easeOut' as const },
      x: { duration: 5.5, ease: 'easeOut' as const },
      y: { duration: 5.5, ease: 'easeOut' as const },
      opacity: { duration: 0.9, ease: 'easeInOut' as const },
    },
  },
  // 1: Cinematic Slow Zoom Out (Pull Back)
  {
    initial: { scale: 1.2, x: '1%', y: '1%', opacity: 0 },
    animate: { scale: 1.02, x: '-0.5%', y: '-0.5%', opacity: 1 },
    exit: { opacity: 0, scale: 1.0 },
    transition: {
      scale: { duration: 5.5, ease: 'easeOut' as const },
      x: { duration: 5.5, ease: 'easeOut' as const },
      y: { duration: 5.5, ease: 'easeOut' as const },
      opacity: { duration: 0.9, ease: 'easeInOut' as const },
    },
  },
  // 2: Gentle Pan Right + Slow Scale
  {
    initial: { scale: 1.06, x: '-2.5%', y: '1%', opacity: 0 },
    animate: { scale: 1.18, x: '2%', y: '-1%', opacity: 1 },
    exit: { opacity: 0, scale: 1.2 },
    transition: {
      scale: { duration: 5.5, ease: 'easeOut' as const },
      x: { duration: 5.5, ease: 'easeOut' as const },
      y: { duration: 5.5, ease: 'easeOut' as const },
      opacity: { duration: 0.9, ease: 'easeInOut' as const },
    },
  },
  // 3: Gentle Pan Left + Slow Pull Back
  {
    initial: { scale: 1.2, x: '2.5%', y: '-1%', opacity: 0 },
    animate: { scale: 1.05, x: '-1.8%', y: '1%', opacity: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: {
      scale: { duration: 5.5, ease: 'easeOut' as const },
      x: { duration: 5.5, ease: 'easeOut' as const },
      y: { duration: 5.5, ease: 'easeOut' as const },
      opacity: { duration: 0.9, ease: 'easeInOut' as const },
    },
  },
];

export const WeddingGallerySlideshow: React.FC<WeddingGallerySlideshowProps> = ({
  couple,
  lang,
  onProceedToInvitation,
}) => {
  // Extract all available photos for the slideshow
  const photos = useMemo(() => {
    const list: string[] = [];
    if (couple.coverPhoto) list.push(couple.coverPhoto);
    if (couple.secondaryPhoto && !list.includes(couple.secondaryPhoto)) {
      list.push(couple.secondaryPhoto);
    }
    if (couple.cardBackgroundImage && !list.includes(couple.cardBackgroundImage)) {
      list.push(couple.cardBackgroundImage);
    }
    if (couple.galleryPhotos && couple.galleryPhotos.length > 0) {
      for (const p of couple.galleryPhotos) {
        if (p && !list.includes(p)) list.push(p);
      }
    }
    return list.length > 0 ? list : [couple.coverPhoto];
  }, [couple]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const SLIDE_DURATION = 4000; // 4 seconds per slide for majestic cinematic experience
  const TICK_INTERVAL = 50;

  const handleNext = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => {
      if (prev >= photos.length - 1) {
        setHasCompletedCycle(true);
        return 0; // Loop back to first photo
      }
      if (prev === photos.length - 2) {
        setHasCompletedCycle(true);
      }
      return prev + 1;
    });
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  // Smooth progress ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + (TICK_INTERVAL / SLIDE_DURATION) * 100));
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Advance to next slide when progress hits 100% (loops indefinitely until Skip is clicked)
  useEffect(() => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentIndex((prev) => {
        if (prev >= photos.length - 1) {
          setHasCompletedCycle(true);
          return 0; // Loop back to the first photo
        }
        if (prev === photos.length - 2) {
          setHasCompletedCycle(true);
        }
        return prev + 1;
      });
    }
  }, [progress, photos.length]);

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next photo
        handleNext();
      } else {
        // Swiped right -> prev photo
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Screen click handler: left side goes back, right side goes next
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentPhoto = photos[currentIndex] || couple.coverPhoto;
  const currentVariant = SLIDE_VARIANTS[currentIndex % SLIDE_VARIANTS.length];

  return (
    <div 
      className="fixed inset-0 z-50 w-full h-full flex flex-col justify-between bg-black select-none overflow-hidden font-battambang"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleScreenClick}
    >
      {/* Dynamic blurred ambient background layer to prevent letterboxing */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-2xl opacity-40 scale-110 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentPhoto})` }}
      />

      {/* 100% Full-Screen Portrait Photo with Dynamic Ken Burns Zoom In/Out Motion */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={currentVariant.transition}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <img
              src={currentPhoto}
              alt={`${couple.groomNameKh} & ${couple.brideNameKh}`}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic Vignette Overlays */}
      {/* Top subtle vignette for progress bar readability */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Bottom deep gradient for couple names and text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

      {/* Warm Golden Light Leaks / Sun Flare */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Top-Right Golden Sun Flare */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-radial from-amber-300/30 via-yellow-500/10 to-transparent pointer-events-none" />

        {/* Bottom-Left Warm Ambient Glow */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-radial from-amber-500/20 via-orange-500/5 to-transparent pointer-events-none" />

        {/* Floating Fairy Bokeh Dust Particles */}
        <motion.div 
          animate={{ y: [-15, -60, -15], x: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-8 w-2 h-2 rounded-full bg-amber-200 blur-[0.5px] shadow-[0_0_8px_rgba(251,191,36,0.8)]"
        />
        <motion.div 
          animate={{ y: [0, -45, 0], x: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-1/3 right-12 w-3 h-3 rounded-full bg-yellow-300 blur-[0.5px] shadow-[0_0_10px_rgba(253,224,71,0.9)]"
        />
        <motion.div 
          animate={{ y: [-10, -50, -10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          className="absolute bottom-1/3 left-16 w-2.5 h-2.5 rounded-full bg-amber-100 blur-[0.5px] shadow-[0_0_8px_rgba(254,243,199,0.7)]"
        />
      </div>

      {/* ================= TOP STORY PROGRESS & SKIP ================= */}
      <div className="relative z-20 w-full max-w-xl mx-auto px-4 pt-4 pb-2 space-y-2">
        {/* Subtle Story-style Progress Bars */}
        <div className="flex items-center gap-1.5 w-full">
          {photos.map((_, idx) => (
            <div 
              key={idx} 
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs"
            >
              <div 
                className="h-full bg-gradient-to-r from-[#DFBA49] to-[#F3ECE0] rounded-full transition-all duration-75"
                style={{
                  width: idx === currentIndex 
                    ? `${progress}%` 
                    : idx < currentIndex 
                      ? '100%' 
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Minimal Subtle Skip Text Button - Shown once cycle completes or on the last photo */}
        <div className="flex justify-end pr-1 min-h-[34px]">
          {(hasCompletedCycle || currentIndex === photos.length - 1) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={(e) => {
                e.stopPropagation();
                onProceedToInvitation();
              }}
              className="text-gray-900 text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer py-1.5 px-4 rounded-full bg-gradient-to-r from-[#FFE58F] via-[#F6D062] to-[#FFE58F] hover:brightness-105 active:scale-95 shadow-[0_4px_16px_rgba(218,165,32,0.4)] border border-amber-200/80 flex items-center gap-1"
            >
              <span>{lang === 'km' ? 'រំលង ›' : 'Skip ›'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* ================= BOTTOM: COUPLE NAMES & TAP HINT ================= */}
      <motion.div 
        key={`couple-names-${currentIndex}`}
        initial={{ opacity: 0.85, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-xl mx-auto px-5 pb-8 sm:pb-10 pt-4 text-center space-y-2 pointer-events-none"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal font-khmer-title text-[#FFE58F] drop-shadow-[0_2px_14px_rgba(0,0,0,0.98)] tracking-wide">
          {couple.groomNameKh} &amp; {couple.brideNameKh}
        </h2>
        {couple.groomNameEn && couple.brideNameEn && (
          <p className="text-xs sm:text-sm text-amber-200/95 font-serif-luxury tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {couple.groomNameEn} &amp; {couple.brideNameEn}
          </p>
        )}
        {(hasCompletedCycle || currentIndex === photos.length - 1) ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProceedToInvitation();
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-200 hover:text-white font-medium tracking-wider animate-pulse pt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors cursor-pointer"
          >
            <span>{lang === 'km' ? 'ចុច «រំលង» ដើម្បីចូលមើលសំបុត្រមង្គលការ ›' : 'Tap «Skip» to view invitation ›'}</span>
          </button>
        ) : (
          <p className="text-[11px] sm:text-xs text-white/70 font-light tracking-wider animate-pulse pt-1 drop-shadow-md">
            {lang === 'km' ? 'ចុចលើអេក្រង់ដើម្បីមើលរូបបន្ទាប់ ›' : 'Tap screen for next photo ›'}
          </p>
        )}
      </motion.div>
    </div>
  );
};

