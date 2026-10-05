import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Play, ChevronDown, Heart } from 'lucide-react';
import { CoupleEvent, Guest } from '../../types';

// High-resolution wedding artwork assets
import weddingArtwork368 from '../../assets/images/frome1.jpg';
import weddingTitleImage from '../../assets/images/frome3.png';

const toKhmerNum = (num: number | string) => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).split('').map(d => /\d/.test(d) ? khmerDigits[parseInt(d)] : d).join('');
};

const formatKhmerDate = (dateString: string) => {
  if (!dateString || !dateString.includes('-')) return dateString;
  const days = ['ថ្ងៃអាទិត្យ', 'ថ្ងៃចន្ទ', 'ថ្ងៃអង្គារ', 'ថ្ងៃពុធ', 'ថ្ងៃព្រហស្បតិ៍', 'ថ្ងៃសុក្រ', 'ថ្ងៃសៅរ៍'];
  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  
  const [year, month, day] = dateString.split('-');
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(dateObj.getTime())) return dateString;
  
  const dayName = days[dateObj.getDay()];
  const khmerDay = toKhmerNum(Number(day));
  const monthName = months[dateObj.getMonth()];
  const khmerYear = toKhmerNum(year);
  
  return `${dayName} ទី${khmerDay} ខែ${monthName} ឆ្នាំ${khmerYear}`;
};

const cleanParentName = (name: string | undefined) => {
  if (!name) return '';
  return name.replace(/^(លោក|លោកស្រី|អ្នកស្រី|អ្នកមីង|លោកពូ)[\s\u200B]*/, '').trim();
};

interface Template368CardProps {
  couple: CoupleEvent;
  currentGuest: Guest | null;
  onOpen: () => void;
  isOpen?: boolean;
}

export const Template368Card: React.FC<Template368CardProps> = ({
  couple,
  currentGuest,
  onOpen,
  isOpen = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop > 30) {
      setHasScrolled(true);
    }
  };

  const bgImage = couple.cardBackgroundImage || weddingArtwork368;
  const topFrameImage = couple.cardOverlayFrame;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none font-battambang bg-black/5">
      
      {/* 9:16 Aspect Ratio Card Frame */}
      <div 
        className="relative mx-auto flex flex-col justify-between overflow-hidden shadow-2xl bg-[#FCFAF5] shrink-0"
        style={{
          aspectRatio: '9/16',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%'
        }}
      >
        
        {/* ======================================================== */}
        {/* 1. LAYER 1 (BOTTOM BACKGROUND): weddingArtwork368 */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <img
            src={bgImage}
            alt="ផ្ទៃខាងក្រោយ Frame"
            className="w-full h-full object-cover object-center block transform-gpu"
            onError={(e) => {
              (e.target as HTMLImageElement).src = weddingArtwork368;
            }}
          />
          {/* Subtle soft gradient overlay for clear Khmer text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-950/15 pointer-events-none"></div>
        </div>

        {/* ======================================================== */}
        {/* 2. LAYER 2 (MIDDLE SCROLLABLE CONTENT): អក្សររំកិលចុះឡើង  */}
        {/* ======================================================== */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 z-10 overflow-y-auto no-scrollbar scroll-smooth px-8 sm:px-11 pt-14 sm:pt-18 pb-24 sm:pb-28 text-center flex flex-col items-center justify-start space-y-4 cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          
          {/* 2.1 TOP HEADER: TITLE IMAGE (frome3.png) */}
          <div className="pt-2 space-y-1 animate-smooth-fade-down delay-100 shrink-0">
            <div className="inline-block relative">
              <img
                src={weddingTitleImage}
                alt="សិរីមង្គល អាពាហ៍ពិពាហ៍"
                className="w-48 sm:w-56 h-auto object-contain mx-auto drop-shadow-md animate-golden-shimmer"
              />
              <div className="flex items-center justify-center gap-1.5 mt-0.5 animate-ornament-expand delay-200">
                <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#B8860B]"></span>
                <span className="text-[#B8860B] text-[10px]">❖</span>
                <span className="text-[10px] sm:text-[11px] font-serif-luxury tracking-[0.22em] text-[#78350F] uppercase font-bold drop-shadow-xs">
                  WEDDING INVITATION
                </span>
                <span className="text-[#B8860B] text-[10px]">❖</span>
                <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#B8860B]"></span>
              </div>
            </div>
          </div>

          {/* 2.2 BRIDE & GROOM NAMES */}
          <div className="space-y-1 py-1 shrink-0 animate-smooth-fade-up delay-200">
            <div className="text-xl sm:text-2xl font-normal font-muol-light text-[#832729] drop-shadow-xs leading-snug">
              <div>{couple.groomNameKh}</div>
              <div className="text-[#D4AF37] text-lg font-serif-luxury my-0.5 inline-block">&</div>
              <div>{couple.brideNameKh}</div>
            </div>
            <div className="text-xs sm:text-sm font-serif-luxury tracking-widest text-[#8C6D1F] font-semibold">
              {couple.groomNameEn} & {couple.brideNameEn}
            </div>
          </div>

          {/* 2.3 PARENTS BLESSING SECTION */}
          <div className="w-full max-w-[280px] bg-white/75 backdrop-blur-xs rounded-2xl border border-[#D4AF37]/40 px-3 py-2 text-xs text-gray-800 shadow-xs shrink-0 animate-smooth-fade-up delay-300">
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
              <div className="text-left space-y-0.5 border-r border-[#D4AF37]/30 pr-1.5">
                <p className="text-[10px] font-medium text-[#B8860B]">មាតាបិតាខាងប្រុស</p>
                <p className="truncate text-gray-900 font-medium">លោក {cleanParentName(couple.groomFatherKh)}</p>
                <p className="truncate text-gray-900 font-medium">លោកស្រី {cleanParentName(couple.groomMotherKh)}</p>
              </div>
              <div className="text-right space-y-0.5 pl-1.5">
                <p className="text-[10px] font-medium text-[#B8860B]">មាតាបិតាខាងស្រី</p>
                <p className="truncate text-gray-900 font-medium">លោក {cleanParentName(couple.brideFatherKh)}</p>
                <p className="truncate text-gray-900 font-medium">លោកស្រី {cleanParentName(couple.brideMotherKh)}</p>
              </div>
            </div>
          </div>

          {/* 2.4 GUEST HONORIFIC PLAQUE (សូមគោរពអញ្ជើញ) */}
          <div className="w-full space-y-1 shrink-0 animate-smooth-fade-up delay-400">
            <p className="text-xs sm:text-sm font-normal font-khmer-title text-[#832729] drop-shadow-xs">
              សូមគោរពអញ្ជើញ
            </p>

            {/* GUEST NAME PLAQUE BOX WITH GOLD FILIGREE */}
            <div className="relative max-w-[300px] mx-auto my-0.5">
              {/* Crown Filigree at Top Center */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                <svg viewBox="0 0 60 16" className="w-10 h-3.5 fill-[#D4AF37]">
                  <path d="M30,0 Q35,8 45,5 Q37,16 30,15 Q23,16 15,5 Q25,8 30,0 Z" />
                  <circle cx="30" cy="3" r="1.5" fill="#8C6D1F" />
                </svg>
              </div>

              <div className="relative bg-white/95 rounded-xl border-2 border-[#D4AF37] px-4 py-2 shadow-md backdrop-blur-xs">
                <span className="absolute top-0.5 left-1 text-[#D4AF37] text-[9px] leading-none">❖</span>
                <span className="absolute top-0.5 right-1 text-[#D4AF37] text-[9px] leading-none">❖</span>
                <span className="absolute bottom-0.5 left-1 text-[#D4AF37] text-[9px] leading-none">❖</span>
                <span className="absolute bottom-0.5 right-1 text-[#D4AF37] text-[9px] leading-none">❖</span>

                <p className="text-xs sm:text-sm font-medium text-[#832729] font-khmer-title truncate">
                  {currentGuest ? `${currentGuest.titleKh} ${currentGuest.fullNameKh}` : 'លោក លៃ ពន្លឺ និងភរិយា'}
                </p>
              </div>
            </div>
          </div>

          {/* 2.5 AUSPICIOUS WEDDING DATE & SCHEDULE */}
          <div className="relative z-10 space-y-1.5 text-xs leading-relaxed text-gray-900 px-2 py-1 max-w-[320px] mx-auto shrink-0 animate-smooth-fade-up delay-500">
            {/* Solar Date */}
            <p className="font-normal font-muol-light leading-normal text-[#832729] text-sm sm:text-base drop-shadow-xs">
              {couple.weddingDateKh || formatKhmerDate(couple.weddingDate) || 'ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦'}
            </p>

            {/* Lunar / Auspicious Line */}
            {couple.auspiciousTextKh && (
              <p className="text-[11px] text-[#8C6D1F] font-normal leading-relaxed">
                {couple.auspiciousTextKh}
              </p>
            )}

            {/* Time & Venue */}
            <p className="leading-relaxed text-gray-900 font-medium text-xs">
              {couple.weddingTimeKh?.includes(couple.venueNameKh || 'កេហដ្ឋានខាងស្រី')
                ? couple.weddingTimeKh
                : (couple.weddingTimeKh?.includes('ស្ថិតនៅ')
                    ? `${couple.weddingTimeKh} ${couple.venueNameKh || 'កេហដ្ឋានខាងស្រី'}`
                    : `${couple.weddingTimeKh || 'វេលាម៉ោង ១១:០០នាទីថ្ងៃត្រង់'} ស្ថិតនៅ${couple.venueNameKh || 'កេហដ្ឋានខាងស្រី'}`)}
            </p>

            {/* Venue Address */}
            <p className="leading-relaxed text-gray-700 font-normal text-[11px] sm:text-xs">
              {couple.venueAddressKh?.replace(/^(កេហដ្ឋានខាងស្រី|គេហដ្ឋានខាងស្រី)[\s\u200B]*/, '') || 'ភូមិរំដេង ឃុំខ្នារពោធិ ស្រុកសូទ្រនិគ ខេត្តសៀមរាប។'}
            </p>

            {/* Blessing Line */}
            <p className="italic pt-0.5 text-[#B8860B] font-medium text-xs">
              ដោយមេត្រីភាព ។ សូមអរគុណ !
            </p>
          </div>

          {/* 2.6 OPEN INVITATION BUTTON */}
          {!isOpen && (
            <div className="pt-2 pb-6 shrink-0 animate-smooth-fade-up delay-600">
              <button
                id="open-template-368-btn"
                onClick={onOpen}
                className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#832729] via-[#9E3336] to-[#681B1C] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/30 animate-golden-ripple cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-amber-300 text-red-950 flex items-center justify-center shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-red-950 ml-0.5" />
                </div>
                <span className="text-xs sm:text-sm font-normal font-khmer-title tracking-wide text-amber-100">
                  បើកសំបុត្រ
                </span>
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
              </button>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* 3. LAYER 3 (TOP OVERLAY FRAME): Optional overlay frame */}
        {/* ======================================================== */}
        {topFrameImage && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden select-none">
            <img
              src={topFrameImage}
              alt="ស៊ុមមុខ Frame"
              className="w-full h-full object-fill block drop-shadow-md"
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* Floating Scroll Hint Indicator (ដើម្បីដឹងថាអាចអូសបាន) */}
        {/* ======================================================== */}
        {!hasScrolled && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1 animate-bounce opacity-85">
            <span className="text-[10px] font-medium text-[#832729] bg-white/90 px-2 py-0.5 rounded-full border border-[#D4AF37]/50 shadow-xs">
              អូសចុះឡើង ↕
            </span>
            <ChevronDown className="w-4 h-4 text-[#832729]" />
          </div>
        )}

      </div>

    </div>
  );
};


