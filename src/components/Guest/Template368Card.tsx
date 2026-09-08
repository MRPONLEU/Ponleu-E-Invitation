import React from 'react';
import { Sparkles, Play, Heart } from 'lucide-react';
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
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none font-battambang bg-black/5">
      
      {/* 9:16 Exact Aspect Ratio Container */}
      <div 
        className="relative mx-auto flex flex-col justify-between overflow-hidden shadow-2xl bg-white shrink-0"
        style={{
          aspectRatio: '9/16',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%'
        }}
      >
        
        {/* Background Artwork filling 100% entire area */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={couple.cardBackgroundImage || weddingArtwork368}
            alt="គំរូ 368 សិរីមង្គលអាពាហ៍ពិពាហ៍"
            className="w-full h-full object-cover object-center block animate-smooth-kenburns transform-gpu"
            onError={(e) => {
              (e.target as HTMLImageElement).src = weddingArtwork368;
            }}
          />
          {/* Gradient Overlay: ពណ៌ប្រដេញខ្មៅទៅថ្លា អាចមើលឃើញរូបច្បាស់ និងអក្សរច្បាស់ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 via-45% to-transparent pointer-events-none"></div>
        </div>

        {/* OVERLAY CONTENT (GOLD CALLIGRAPHY, GUEST BOX, AUSPICIOUS DETAILS) */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-20 text-center pointer-events-none">
          
          {/* 1. TOP HEADER: TITLE IMAGE (frome3.png) */}
          <div className="pt-1 sm:pt-2 space-y-1 animate-smooth-fade-down delay-100">
            <div className="inline-block relative">
              <img
                src={weddingTitleImage}
                alt="សិរីមង្គល អាពាហ៍ពិពាហ៍"
                className="w-52 sm:w-60 h-auto object-contain mx-auto drop-shadow-md animate-golden-shimmer"
              />
              <div className="flex items-center justify-center gap-1.5 mt-0.5 animate-ornament-expand delay-200">
                <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#F3D372]"></span>
                <span className="text-[#FFD700] text-[10px] drop-shadow-xs">❖</span>
                <span className="text-[10px] sm:text-[11px] font-serif-luxury tracking-[0.22em] text-[#FFF8DC] uppercase font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  WEDDING INVITATION
                </span>
                <span className="text-[#FFD700] text-[10px] drop-shadow-xs">❖</span>
                <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#F3D372]"></span>
              </div>
            </div>
          </div>

          {/* 2. LOWER SECTION: GUEST BOX & AUSPICIOUS WEDDING DETAILS */}
          <div className="space-y-2 pb-2 sm:pb-4 pointer-events-auto">
            
            {/* "សូមគោរពអញ្ជើញ" */}
            <div className="space-y-0.5 animate-smooth-fade-up delay-300">
              <p 
                className="text-sm sm:text-base font-normal font-khmer-title text-[#FFE58F] drop-shadow-[0_1px_3px_rgba(50,10,60,0.9)]"
              >
                សូមគោរពអញ្ជើញ
              </p>

              {/* GUEST NAME PLAQUE BOX WITH GOLD FILIGREE */}
              <div className="relative max-w-[320px] mx-auto my-1 animate-smooth-fade-up delay-450">
                {/* Crown Filigree at Top Center */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30">
                  <svg viewBox="0 0 60 16" className="w-12 h-4 fill-[#D4AF37] drop-shadow-xs">
                    <path d="M30,0 Q35,8 45,5 Q37,16 30,15 Q23,16 15,5 Q25,8 30,0 Z" />
                    <circle cx="30" cy="3" r="1.5" fill="#8C6D1F" />
                  </svg>
                </div>

                <div className="relative bg-white/95 rounded-xl border-2 border-[#D4AF37] px-4 py-2 sm:py-2.5 shadow-lg backdrop-blur-xs">
                  {/* Corner Accent Ornaments */}
                  <span className="absolute top-0.5 left-1 text-[#D4AF37] text-[10px] leading-none">❖</span>
                  <span className="absolute top-0.5 right-1 text-[#D4AF37] text-[10px] leading-none">❖</span>
                  <span className="absolute bottom-0.5 left-1 text-[#D4AF37] text-[10px] leading-none">❖</span>
                  <span className="absolute bottom-0.5 right-1 text-[#D4AF37] text-[10px] leading-none">❖</span>

                  <p className="text-sm sm:text-base font-medium text-[#B8860B] font-khmer-title truncate">
                    {currentGuest ? `${currentGuest.titleKh} ${currentGuest.fullNameKh}` : 'លោក លៃ ពន្លឺ និងភរិយា'}
                  </p>
                </div>
              </div>
            </div>

            {/* AUSPICIOUS WEDDING DATE & SCHEDULE */}
            <div className="relative z-30 space-y-1.5 text-xs sm:text-sm leading-relaxed text-white px-2 py-2 max-w-[360px] mx-auto animate-smooth-fade-up delay-600">
              
              {/* Solar Date */}
              <p className="font-normal font-muol-light leading-normal text-[#FFE58F] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-base sm:text-lg">
                {couple.weddingDateKh || formatKhmerDate(couple.weddingDate) || 'ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦'}
              </p>

              {/* Time & Venue */}
              <p className="leading-relaxed text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-normal text-xs sm:text-sm">
                {couple.weddingTimeKh?.includes(couple.venueNameKh || 'កេហដ្ឋានខាងស្រី')
                  ? couple.weddingTimeKh
                  : (couple.weddingTimeKh?.includes('ស្ថិតនៅ')
                      ? `${couple.weddingTimeKh} ${couple.venueNameKh || 'កេហដ្ឋានខាងស្រី'}`
                      : `${couple.weddingTimeKh || 'វេលាម៉ោង ១១:០០នាទីថ្ងៃត្រង់'} ស្ថិតនៅ${couple.venueNameKh || 'កេហដ្ឋានខាងស្រី'}`)}
              </p>

              {/* Venue Address */}
              <p className="leading-relaxed text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-normal text-xs sm:text-sm">
                {couple.venueAddressKh?.replace(/^(កេហដ្ឋានខាងស្រី|គេហដ្ឋានខាងស្រី)[\s\u200B]*/, '') || 'ភូមិរំដេង ឃុំខ្នារពោធិ ស្រុកសូទ្រនិគ ខេត្តសៀមរាប។'}
              </p>

              {/* Blessing Line */}
              <p className="italic pt-0.5 text-[#FFE58F] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-medium text-xs sm:text-sm">
                ដោយមេត្រីភាព ។ សូមអរគុណ !
              </p>
            </div>

            {/* OPEN INVITATION BUTTON */}
            {!isOpen && (
              <div className="pt-2 animate-smooth-fade-up delay-750">
                <button
                  id="open-template-368-btn"
                  onClick={onOpen}
                  className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#6B21A8] text-white shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 border-2 border-[#D4AF37] ring-4 ring-purple-400/30 animate-golden-ripple"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-300 text-purple-900 flex items-center justify-center shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-purple-900 ml-0.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-normal font-khmer-title tracking-wide text-amber-100">
                    បើកសំបុត្រ
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

