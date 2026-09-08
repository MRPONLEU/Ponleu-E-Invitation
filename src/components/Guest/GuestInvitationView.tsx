import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Template, CoupleEvent, Guest, Language } from '../../types';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Volume2, 
  VolumeX, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  QrCode, 
  MessageSquareHeart, 
  Send, 
  Navigation, 
  Sun, 
  Scissors, 
  Utensils, 
  Award,
  ChevronDown,
  X,
  CalendarPlus,
  Play,
  Facebook,
  Phone,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingAudioPlayer } from '../../utils/audioSynthesizer';
import { Template368Card } from './Template368Card';
import { WeddingGallerySlideshow } from './WeddingGallerySlideshow';
import weddingTitleImage from '../../assets/images/frome3.png';
import loveOrnament from '../../assets/images/love.png';
import ponleuLogo from '../../assets/images/ponleu_logo.svg';

const cleanParentName = (name?: string) => {
  if (!name) return '';
  let cleaned = name.trim();
  // Strip honorific titles from parent name (ឯកឧត្តម, លោកជំទាវ, លោក, លោកស្រី, អ្នកឧកញ៉ា, ឧកញ៉ា)
  const titlePattern = /^(ឯកឧត្តម|លោកជំទាវ|លោកស្រី|លោក|អ្នកឧកញ៉ា|ឧកញ៉ា)[\s\u200B]*/;
  while (titlePattern.test(cleaned)) {
    cleaned = cleaned.replace(titlePattern, '').trim();
  }
  return cleaned;
};

const getKhmerMonogramLetter = (fullName?: string) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  // Khmer names: [Family Name, Given Name]
  // In wedding monograms, the given name's initial or main consonant is traditionally used
  const target = parts[parts.length - 1] || parts[0];
  const match = target.match(/^[\u1780-\u17B3]/);
  return match ? match[0] : target.charAt(0);
};

const toKhmerNum = (num: number | string) => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).split('').map(d => /\d/.test(d) ? khmerDigits[parseInt(d, 10)] : d).join('');
};

const formatKhmerDate = (dateString?: string) => {
  if (!dateString) return '';
  if (!dateString.includes('-')) return dateString;
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

interface GuestInvitationViewProps {
  couple: CoupleEvent;
  templates: Template[];
  guestCode?: string;
  setCouples: React.Dispatch<React.SetStateAction<CoupleEvent[]>>;
  lang: Language;
  onBackToAdmin?: () => void;
}

export const GuestInvitationView: React.FC<GuestInvitationViewProps> = ({
  couple,
  templates,
  guestCode,
  setCouples,
  lang,
  onBackToAdmin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // RSVP Form State
  const [rsvpAttending, setRsvpAttending] = useState<'attending' | 'declined'>('attending');
  const [rsvpPax, setRsvpPax] = useState<number>(2);
  const [rsvpName, setRsvpName] = useState<string>('');
  const [rsvpMessage, setRsvpMessage] = useState<string>('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);

  // Find personalized guest if code exists
  const currentGuest = (couple.guests || []).find(g => g.code === guestCode);

  useEffect(() => {
    if (currentGuest) {
      setRsvpName(`${currentGuest.titleKh} ${currentGuest.fullNameKh}`);
      setRsvpPax(currentGuest.paxExpected || 2);
      if (currentGuest.rsvpStatus !== 'pending') {
        setRsvpSubmitted(true);
      }
    } else {
      setRsvpName('');
    }
  }, [currentGuest]);

  // Current template
  const tpl = templates.find(t => t.id === couple.templateId) || templates[0];
  const isPurpleTheme = tpl.style === 'royal-violet' || couple.customTheme.primaryColor === '#7E22CE' || tpl.id === 'tpl_purple_02';

  // Dynamic Khmer font family class
  const khmerTitleFont = couple.customTheme.fontFamilyKhmer === 'moul'
    ? 'font-khmer-title'
    : couple.customTheme.fontFamilyKhmer === 'kantumruy'
    ? 'font-kantumruy font-normal'
    : 'font-battambang font-normal';

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(`${couple.weddingDate}T07:00:00`).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [couple.weddingDate]);

  const getAudioUrl = () => {
    if (couple.customTheme.musicUrl) return couple.customTheme.musicUrl;
    if (couple.customTheme.musicTrack && (couple.customTheme.musicTrack.startsWith('http://') || couple.customTheme.musicTrack.startsWith('https://'))) {
      return couple.customTheme.musicTrack;
    }
    return undefined;
  };

  // Handle open envelope
  const handleOpenEnvelope = () => {
    if (couple.customTheme?.enableMusic) {
      weddingAudioPlayer.start(getAudioUrl());
      setIsPlaying(true);
    }
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Check if slideshow on open is enabled (default is true)
    if (couple.customTheme?.showSlideshowOnOpen !== false) {
      setIsSlideshowOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  // When guest proceeds from slideshow to the invitation
  const handleProceedFromSlideshow = () => {
    setIsSlideshowOpen(false);
    setIsOpen(true);
  };

  const toggleMusic = () => {
    const state = weddingAudioPlayer.toggle(getAudioUrl());
    setIsPlaying(state);
  };

  // Submit RSVP
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    const newWish = {
      id: `wsh_${Date.now()}`,
      guestName: rsvpName,
      guestTitle: currentGuest?.titleKh || '',
      message: rsvpMessage.trim() || 'សូមជូនពរឱ្យគូស្វាមីភរិយាថ្មីជួបតែសុភមង្គល និងស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង!',
      date: new Date().toLocaleDateString('km-KH', { day: 'numeric', month: 'long', year: 'numeric' }),
      attendees: rsvpAttending === 'attending' ? rsvpPax : 0,
      isAttending: rsvpAttending === 'attending',
      side: currentGuest?.side || 'mutual'
    };

    // Update couple
    setCouples(prev => prev.map(c => {
      if (c.id !== couple.id) return c;
      const updatedGuests = (c.guests || []).map(g => {
        if (currentGuest && g.id === currentGuest.id) {
          return {
            ...g,
            rsvpStatus: rsvpAttending,
            attendeesCount: rsvpAttending === 'attending' ? rsvpPax : 0,
            wishMessage: rsvpMessage,
            rsvpDate: new Date().toISOString().split('T')[0]
          };
        }
        return g;
      });

      return {
        ...c,
        guests: updatedGuests,
        wishes: [newWish, ...(c.wishes || [])]
      };
    }));

    setRsvpSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`ពិធីអាពាហ៍ពិពាហ៍ ${couple.groomNameKh} & ${couple.brideNameKh}`);
    const details = encodeURIComponent(`សូមគោរពអញ្ជើញចូលរួមពិធីអាពាហ៍ពិពាហ៍\nទីតាំង៖ ${couple.venueNameKh}\nអាសយដ្ឋាន៖ ${couple.venueAddressKh}`);
    const location = encodeURIComponent(couple.venueAddressKh || couple.venueNameKh);
    const dateFormatted = couple.weddingDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T000000Z/${dateFormatted}T160000Z&details=${details}&location=${location}`;
  };

  return (
    <div className={`min-h-full h-full ${isOpen ? 'bg-transparent pb-20 overflow-y-auto overflow-x-hidden' : `bg-gradient-to-b ${tpl.bgGradient} pb-0 overflow-hidden`} relative text-[#2D2D2D] selection:bg-[#D4AF37]/30 no-scrollbar`}>
      
      {/* Background Couple Photo behind all text when Invitation is Opened with GPU-Accelerated Ken Burns */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#1A1A1A]">
          <img 
            src={couple.coverPhoto || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'}
            alt="Background Couple"
            className="w-full h-full object-cover object-center animate-smooth-kenburns transform-gpu"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop';
            }}
          />
          {/* Subtle gradient overlay to ensure text readability without heavy GPU filter */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent via-70% to-black/90 pointer-events-none"></div>
        </div>
      )}

      {/* Floating Sparkles / Falling Rose Petals Layer */}
      {couple.customTheme.enablePetals && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="animate-petal absolute text-pink-300/40 text-lg sm:text-xl select-none"
              style={{
                left: `${(i * 9) + 4}%`,
                animationDuration: `${7 + (i % 5) * 2}s`,
                animationDelay: `${i * 0.8}s`
              }}
            >
              🌸
            </div>
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`sparkle_${i}`}
              className="animate-pulse absolute text-[#D4AF37]/30 text-sm select-none"
              style={{
                top: `${(i * 15) + 10}%`,
                right: `${(i * 12) + 5}%`,
                animationDuration: `${3 + i}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Controls (Music Only) at Top-Right */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center justify-center">
        
        {/* Audio Controller (No Background, Just Icon) */}
        <button
          id="guest-music-btn"
          onClick={toggleMusic}
          className={`p-2 transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
            isPlaying ? 'text-[#D4AF37]' : 'text-gray-400/70 hover:text-[#D4AF37]'
          }`}
          title={isPlaying ? 'ផ្អាកភ្លេងការ (Pause Music)' : 'ចាក់ភ្លេងការ (Play Music)'}
        >
          {isPlaying ? (
            <Volume2 className="w-7 h-7 drop-shadow-md" />
          ) : (
            <VolumeX className="w-7 h-7 drop-shadow-md" />
          )}
        </button>
      </div>

      {/* FULL-SCREEN PRE-WEDDING GALLERY SLIDESHOW */}
      {isSlideshowOpen && (
        <WeddingGallerySlideshow
          couple={couple}
          lang={lang}
          onProceedToInvitation={handleProceedFromSlideshow}
          isPlayingMusic={isPlaying}
          onToggleMusic={toggleMusic}
        />
      )}

      {/* ENVELOPE OPENING OVERLAY / WELCOME FRONT COVER (IF NOT YET OPENED) */}
      {!isOpen ? (
        <div className="relative z-30 h-full flex items-center justify-center p-0 w-full">
          <div className="w-full h-full text-center animate-in fade-in zoom-in-95 duration-500 flex flex-col justify-center items-center">
            {isPurpleTheme ? (
              <Template368Card
                couple={couple}
                currentGuest={currentGuest}
                onOpen={handleOpenEnvelope}
                isOpen={isOpen}
              />
            ) : (
              /* Classic Gold Front Cover Card Container */
              <div className="relative w-full max-w-none sm:max-w-md mx-auto bg-gradient-to-b from-[#FFF5F5] via-[#FFFDF9] to-[#FCEFEF] border-4 border-[#E8C29D]/50 rounded-[36px] p-5 sm:p-7 shadow-2xl overflow-hidden text-center space-y-3.5 animate-smooth-fade-up">
                
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#DFBA49] to-[#B8962D]"></div>
                
                {/* Background Frame Border */}
                <div className="absolute inset-x-2 top-2 bottom-2 rounded-[30px] border border-[#D4AF37]/25 pointer-events-none"></div>

                {/* 1. Header Title: សិរីមង្គល អាពាហ៍ពិពាហ៍ */}
                <div className="pt-2 space-y-1 animate-smooth-fade-down delay-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-normal bg-white/80 border-[#D4AF37]/30 text-[#8C6D1F]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>សំបុត្រអញ្ជើញអាពាហ៍ពិពាហ៍ឌីជីថល</span>
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-normal ${khmerTitleFont} text-[#8B3A3A] tracking-wide pt-0.5`}>
                    សិរីមង្គល អាពាហ៍ពិពាហ៍
                  </h2>
                </div>

                {/* 2. Monogram Emblem Badge */}
                <div className="flex justify-center my-0.5 animate-smooth-fade-up delay-200">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1.5 shadow-md border-2 border-[#D4AF37] flex items-center justify-center relative bg-gradient-to-br from-[#8B2323] via-[#A83232] to-[#681818] animate-golden-ripple">
                    <div className="w-full h-full rounded-full border border-[#DFBA49]/60 flex flex-col items-center justify-center text-amber-100 font-khmer-title">
                      <span className="text-xs sm:text-sm font-bold leading-none">
                        {couple.groomNickKh?.substring(0, 1) || 'វ'}
                      </span>
                      <div className="w-4 h-[1px] bg-amber-200/50 my-0.5"></div>
                      <span className="text-xs sm:text-sm font-bold leading-none">
                        {couple.brideNickKh?.substring(0, 1) || 'ស'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Auspicious Date */}
                <p className={`text-xs sm:text-sm font-normal font-battambang text-[#8B3A3A] animate-smooth-fade-up delay-300`}>
                  {couple.auspiciousTextKh || `ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦`}
                </p>

                {/* 4. Center Bride & Groom Photo */}
                <div className="relative mx-auto max-w-[260px] rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-[#D4AF37]/40 my-1 animate-smooth-fade-up delay-450">
                  <img
                    src={couple.coverPhoto}
                    alt={`${couple.groomNameKh} & ${couple.brideNameKh}`}
                    className="w-full h-52 sm:h-60 object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* 5. Guest Honorific Box: "សូមគោរពអញ្ជើញ" */}
                <div className="space-y-1 pt-1 animate-smooth-fade-up delay-600">
                  <p className={`text-xs font-medium ${khmerTitleFont} text-[#8B3A3A]`}>
                    សូមគោរពអញ្ជើញ
                  </p>
                  <div className="px-4 py-2 bg-white/95 rounded-2xl border-2 border-[#D4AF37]/40 shadow-xs backdrop-blur-xs max-w-xs mx-auto">
                    <h3 className={`text-sm sm:text-base font-normal text-gray-900 ${khmerTitleFont} truncate`}>
                      {currentGuest ? `${currentGuest.titleKh} ${currentGuest.fullNameKh}` : 'ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា'}
                    </h3>
                  </div>
                </div>

                {/* 6. Interactive Open Button "បើកសំបុត្រ" */}
                <div className="pt-1.5 animate-smooth-fade-up delay-750">
                  <button
                    id="open-invitation-btn"
                    onClick={handleOpenEnvelope}
                    className="group relative inline-flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#8B2323] via-[#A83232] to-[#8B2323] text-amber-200 border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/30 shadow-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 animate-golden-ripple">
                      <Play className="w-5 h-5 fill-amber-200 ml-0.5" />
                    </div>
                    <span className={`text-xs font-normal ${khmerTitleFont} text-[#8B3A3A] group-hover:text-red-700 transition-colors`}>
                      បើកសំបុត្រ
                    </span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      ) : (

        /* LIVE INVITATION CARD CONTENT (WHEN OPENED) */
        <>
          <div className="w-full animate-in fade-in duration-700">
            
            {/* Section 1: Full-Screen (100dvh) 9:16 Hero Section */}
          <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between p-6 sm:p-8 text-center text-white overflow-hidden select-none z-10">

            {/* Ambient Floating Gold Dust Sparkles */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <span className="absolute top-[18%] left-[12%] text-amber-300/60 text-xs animate-ping [animation-duration:3s]">✦</span>
              <span className="absolute top-[28%] right-[15%] text-amber-200/50 text-sm animate-pulse [animation-duration:4s]">✨</span>
              <span className="absolute top-[65%] left-[18%] text-amber-300/40 text-xs animate-pulse [animation-duration:3.5s]">✦</span>
              <span className="absolute top-[75%] right-[20%] text-amber-200/60 text-xs animate-ping [animation-duration:4.5s]">✨</span>
            </div>

            {/* Top Header with Silky Smooth GPU Fade & Slide Animation */}
            <div className="relative z-10 pt-3 sm:pt-5 space-y-1.5 flex flex-col items-center">
              <img
                src={weddingTitleImage}
                alt="សិរីមង្គល អាពាហ៍ពិពាហ៍"
                className="w-56 sm:w-68 h-auto object-contain mx-auto drop-shadow-2xl animate-smooth-fade-down transform-gpu animate-golden-shimmer"
              />
              <div className="flex items-center justify-center gap-2 mt-0.5 animate-ornament-expand delay-200">
                <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#F3D372]"></span>
                <span className="text-[#FFD700] text-[10px] sm:text-xs">❖</span>
                <span className="text-[11px] sm:text-xs font-serif-luxury tracking-[0.25em] text-[#FFF8DC] uppercase font-bold [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                  WEDDING INVITATION
                </span>
                <span className="text-[#FFD700] text-[10px] sm:text-xs">❖</span>
                <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#F3D372]"></span>
              </div>
            </div>

            {/* Bottom Content: Couple Names, Date & Scroll Indicator with Staggered Pure-CSS GPU Smooth Reveal */}
            <div className="relative z-10 space-y-4 pb-6 sm:pb-8">
              {/* Bride & Groom Name Display */}
              <div className="space-y-1.5">
                <div className={`text-3xl sm:text-4xl font-normal ${khmerTitleFont} text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.95)] leading-snug`}>
                  <div className="animate-smooth-fade-up delay-200 transform-gpu">{couple.groomNameKh}</div>
                  <div className="text-[#FFE58F] text-xl font-serif-luxury my-0.5 [text-shadow:0_0_10px_rgba(255,229,143,0.7)] animate-smooth-fade-up delay-300 transform-gpu inline-block">
                    &
                  </div>
                  <div className="animate-smooth-fade-up delay-450 transform-gpu">{couple.brideNameKh}</div>
                </div>

                {/* English Names */}
                <div className="text-sm sm:text-base font-normal text-amber-100/95 font-serif-luxury tracking-widest [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] animate-smooth-fade-up delay-600 transform-gpu">
                  {couple.groomNameEn} & {couple.brideNameEn}
                </div>
              </div>

              {/* Gentle Floating Scroll-Down Indicator with Golden Glow Wave */}
              <div className="pt-2 flex flex-col items-center justify-center gap-1.5 text-white/85 animate-smooth-fade-up delay-750">
                <span className="text-[11px] font-light tracking-wider [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">អូសចុះក្រោម</span>
                <div className="w-8 h-8 rounded-full border border-amber-300/50 bg-black/30 backdrop-blur-xs flex items-center justify-center animate-gentle-bounce animate-golden-ripple transform-gpu">
                  <ChevronDown className="w-4 h-4 text-[#FFE58F]" />
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Content Sections Container with translucent backdrop for text readability and smooth 250px gradient fade */}
          <div 
            className="max-w-xl mx-auto px-6 pt-28 pb-4 space-y-12 relative z-10 text-white/95 bg-black/60 backdrop-blur-md -mt-32"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 250px, black 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0px, black 250px, black 100%)'
            }}
          >

            {/* Traditional Invitation Text Section */}
            <div className="text-center space-y-8 animate-in slide-in-from-bottom duration-700">
              
              <div className="space-y-1 pt-[100px]">
                <h2 className={`text-2xl sm:text-[28px] font-normal font-muol-light text-[#D4AF37] drop-shadow-sm leading-relaxed`}>
                  សិរីមង្គល<br/>អាពាហ៍ពិពាហ៍
                </h2>
                {/* Decorative divider under title */}
                <div className="flex items-center justify-center gap-2 text-[#D4AF37]/60 pt-2 pb-2">
                  <span className="w-16 h-px bg-gradient-to-l from-[#D4AF37]/60 to-transparent"></span>
                  <span className="text-sm">❖</span>
                  <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37]/60 to-transparent"></span>
                </div>
              </div>

              <div className="flex justify-between items-start text-sm sm:text-base font-normal text-white/95 font-battambang">
                <div className="space-y-1.5 text-left flex-1">
                  <p className="leading-relaxed">
                    <span className="font-battambang text-white/95">លោក </span>
                    <span className="text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-muol-light">{cleanParentName(couple.groomFatherKh)}</span>
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-battambang text-white/95">លោកស្រី </span>
                    <span className="text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-muol-light">{cleanParentName(couple.groomMotherKh)}</span>
                  </p>
                </div>
                <div className="space-y-1.5 text-right flex-1">
                  <p className="leading-relaxed">
                    <span className="font-battambang text-white/95">លោក </span>
                    <span className="text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-muol-light">{cleanParentName(couple.brideFatherKh)}</span>
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-battambang text-white/95">លោកស្រី </span>
                    <span className="text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-muol-light">{cleanParentName(couple.brideMotherKh)}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-normal font-muol-light text-[#D4AF37] leading-relaxed pt-1">
                  មានកិត្តិយសសូមគោរពអញ្ជើញ
                </h3>
                <div className="text-sm sm:text-base leading-relaxed text-white/95 font-battambang space-y-1 sm:space-y-1.5 max-w-xl mx-auto text-center px-2 sm:px-4">
                  <p className="whitespace-nowrap">ឯកឧត្តម លោកឧកញ៉ា លោកជំទាវ លោក លោកស្រី</p>
                  <p className="whitespace-nowrap">អ្នកនាងកញ្ញា និង ប្រិយមិត្តទាំងអស់អញ្ជើញចូលរួមជាអធិបតី</p>
                  <p className="whitespace-nowrap">និងជាភ្ញៀវកិត្តិយសដើម្បីប្រសិទ្ធិ ពរជ័យ សិរីសួស្តី ជ័យមង្គល</p>
                  <p className="whitespace-nowrap">ដល់គូស្វាមី ភរិយាថ្មី ក្នុង <span className="text-[#F3D372] font-semibold">ពិធីរៀបអាពាហ៍ពិពាហ៍</span></p>
                  <p className="whitespace-nowrap">កូនប្រុស - កូនស្រី របស់យើងខ្ញុំ</p>
                </div>
              </div>

              {/* Couple Ornament with Initials Inside and Names Below (ទម្រង់ដូចរូបទី ២) */}
              <div className="space-y-1 my-2 max-w-lg mx-auto">
                {/* Golden Heart Filigree Ornament with Monogram Initials inside */}
                <div className="relative px-2 sm:px-4">
                  <img
                    src={loveOrnament}
                    alt="Golden Heart Filigree Ornament"
                    className="w-full h-auto object-contain mx-auto select-none pointer-events-none"
                  />
                  {/* Initials inside the heart - centered nicely inside the heart cavity */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-4 min-[400px]:pt-6 sm:pt-8">
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1 font-muol-light text-2xl min-[400px]:text-3xl sm:text-4xl text-[#F3D372] select-none">
                      <span>{getKhmerMonogramLetter(couple.groomNameKh) || 'វ'}</span>
                      <span>{getKhmerMonogramLetter(couple.brideNameKh) || 'ស'}</span>
                    </div>
                  </div>
                </div>

                {/* Names placed symmetrically outward under the ornament wings (ចេញក្រៅបន្តិច) */}
                <div className="flex justify-between items-start w-full px-0 sm:px-1 -mt-7 min-[400px]:-mt-9 sm:-mt-12 relative z-10 pb-2 font-battambang">
                  {/* Left: Groom Name */}
                  <div className="text-center space-y-0.5 sm:space-y-1 flex-1 max-w-[48%]">
                    <p className="text-xs min-[400px]:text-[13px] sm:text-sm text-[#F3D372] font-battambang font-medium">
                      កូនប្រុសនាម
                    </p>
                    <p className="text-lg min-[400px]:text-xl sm:text-2xl font-muol-light text-[#F3D372] leading-tight tracking-wide">
                      {couple.groomNameKh}
                    </p>
                  </div>

                  {/* Right: Bride Name */}
                  <div className="text-center space-y-0.5 sm:space-y-1 flex-1 max-w-[48%]">
                    <p className="text-xs min-[400px]:text-[13px] sm:text-sm text-[#F3D372] font-battambang font-medium">
                      កូនស្រីនាម
                    </p>
                    <p className="text-lg min-[400px]:text-xl sm:text-2xl font-muol-light text-[#F3D372] leading-tight tracking-wide">
                      {couple.brideNameKh}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and Location matching Image 2 */}
              <div className="space-y-1.5 sm:space-y-2 font-battambang text-white/95 pt-3 text-center max-w-lg mx-auto">
                {/* Solar Date (សូរិយគតិ) - ទំហំស្មើឈ្មោះឳពុកម្ដាយ (text-sm sm:text-base font-muol-light) */}
                <p className="font-muol-light text-[#F3D372] text-sm sm:text-base leading-relaxed tracking-wide pb-1">
                  {couple.weddingDateKh || formatKhmerDate(couple.weddingDate) || 'ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦'}
                </p>

                {/* Lunar Calendar Date (ចន្ទគតិ) */}
                <p className="font-battambang font-medium text-sm sm:text-base leading-relaxed px-2">
                  {(() => {
                    const fullText = (couple.auspiciousTextKh || 'ត្រូវនឹងថ្ងៃ ៤រោច ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០').startsWith('ត្រូវនឹង')
                      ? (couple.auspiciousTextKh || 'ត្រូវនឹងថ្ងៃ ៤រោច ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០')
                      : `ត្រូវនឹង${couple.auspiciousTextKh}`;
                    if (fullText.startsWith('ត្រូវនឹង')) {
                      const rest = fullText.replace(/^ត្រូវនឹង\s*/, '');
                      return (
                        <>
                          <span className="text-white/90">ត្រូវនឹង</span>{' '}
                          <span className="text-[#F3D372] font-semibold">{rest}</span>
                        </>
                      );
                    }
                    return <span className="text-[#F3D372] font-semibold">{fullText}</span>;
                  })()}
                </p>

                <p className="font-battambang font-medium text-white text-sm sm:text-base leading-relaxed px-2">
                  {couple.weddingTimeKh?.includes(couple.venueNameKh || 'កេហដ្ឋានខាងស្រី')
                    ? couple.weddingTimeKh
                    : (couple.weddingTimeKh?.includes('ស្ថិតនៅ')
                        ? `${couple.weddingTimeKh} ${couple.venueNameKh || 'កេហដ្ឋានខាងស្រី'}`
                        : `${couple.weddingTimeKh || 'វេលាម៉ោង ១១:០០នាទីថ្ងៃត្រង់'} ស្ថិតនៅ${couple.venueNameKh || 'កេហដ្ឋានខាងស្រី'}`)}
                </p>

                <p className="font-battambang font-normal text-white/95 text-sm sm:text-base leading-relaxed px-4">
                  {couple.venueAddressKh?.replace(/^(កេហដ្ឋានខាងស្រី|គេហដ្ឋានខាងស្រី)[\s\u200B]*/, '') || 'ភូមិរំដេង ឃុំខ្នារពោធិ ស្រុកសូទ្រនិគ ខេត្តសៀមរាប។'}
                </p>

                <p className="font-battambang text-[#F3D372] italic font-medium text-sm sm:text-base pt-1 tracking-wide">
                  ដោយមេត្រីភាព ។ សូមអរគុណ !
                </p>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-700 delay-150 pt-10 relative">

              <div className="space-y-1 mb-8">
                <h3 className="text-xl sm:text-2xl font-normal font-muol-light text-[#D4AF37] leading-relaxed drop-shadow-sm">
                  កម្មវិធីសិរីមង្គល<br/>អាពាហ៍ពិពាហ៍
                </h3>
                {/* Decorative divider under title */}
                <div className="flex items-center justify-center gap-2 text-[#D4AF37]/60 pt-2 pb-2">
                  <span className="w-16 h-px bg-gradient-to-l from-[#D4AF37]/60 to-transparent"></span>
                  <span className="text-sm">❖</span>
                  <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37]/60 to-transparent"></span>
                </div>
              </div>
              
              {/* Event Timeline */}
              {(() => {
                const agendas = couple.agendas && couple.agendas.length > 0 ? couple.agendas : [];
                const day1Agendas = agendas.filter(a => a.day === 1 || !a.day);
                const day2Agendas = agendas.filter(a => a.day === 2);
                
                const renderAgendaIcon = (icon?: string) => {
                  switch (icon) {
                    case 'sun': return <Sun className="w-4 h-4" />;
                    case 'scissors': return <Scissors className="w-4 h-4" />;
                    case 'utensils': return <Utensils className="w-4 h-4" />;
                    case 'heart': return <Heart className="w-4 h-4" />;
                    case 'sparkles': return <Sparkles className="w-4 h-4" />;
                    default: return <Clock className="w-4 h-4" />;
                  }
                };

                return (
                  <div className="space-y-8 text-left max-w-sm mx-auto pt-2">
                    {/* Day 1 */}
                    <div className="space-y-4">
                      <h4 className="font-muol-light text-[15px] sm:text-base text-[#F3D372] leading-relaxed tracking-wide text-center pb-2">
                        {couple.weddingProgramDay1TitleKh || 'កម្មវិធីថ្ងៃទី១ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៤'}
                      </h4>
                      <div className="space-y-5">
                        {day1Agendas.length > 0 ? (
                          day1Agendas.map(item => (
                            <div key={item.id} className="flex items-start gap-4 group">
                              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] bg-black/30 backdrop-blur-sm group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                                {renderAgendaIcon(item.icon)}
                              </div>
                              <div className="space-y-1 pt-0.5 flex-1">
                                <p className="text-sm font-normal text-[#D4AF37] font-battambang tracking-wide drop-shadow-sm">{item.time}</p>
                                <h4 className="text-[15px] font-normal text-white/95 font-battambang leading-relaxed">{item.titleKh}</h4>
                                {item.descKh && <p className="text-xs text-white/70 font-battambang">{item.descKh}</p>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-xs text-white/60 font-battambang py-3">មិនទាន់មានកម្មវិធី</p>
                        )}
                      </div>
                    </div>

                    {/* Day 2 */}
                    {(day2Agendas.length > 0 || couple.weddingProgramDay2TitleKh) && (
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <h4 className="font-muol-light text-[15px] sm:text-base text-[#F3D372] leading-relaxed tracking-wide text-center pb-2">
                          {couple.weddingProgramDay2TitleKh || 'កម្មវិធីថ្ងៃទី២ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៤'}
                        </h4>
                        <div className="space-y-5">
                          {day2Agendas.map(item => (
                            <div key={item.id} className="flex items-start gap-4 group">
                              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] bg-black/30 backdrop-blur-sm group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                                {renderAgendaIcon(item.icon)}
                              </div>
                              <div className="space-y-1 pt-0.5 flex-1">
                                <p className="text-sm font-normal text-[#D4AF37] font-battambang tracking-wide drop-shadow-sm">{item.time}</p>
                                <h4 className="text-[15px] font-normal text-white/95 font-battambang leading-relaxed">{item.titleKh}</h4>
                                {item.descKh && <p className="text-xs text-white/70 font-battambang">{item.descKh}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Location */}
            <div className="text-center space-y-6 pt-10 pb-4 flex flex-col items-center">
              
               <div className="space-y-1">
                 <h3 className="text-xl sm:text-2xl font-normal font-muol-light text-[#D4AF37] leading-relaxed drop-shadow-sm">
                   ផែនទី<br/>{couple.venueNameKh || 'ទីតាំងកម្មវិធី'}
                 </h3>
                 {couple.venueAddressKh && (
                   <p className="text-white/80 font-battambang text-xs max-w-sm mx-auto pt-1 leading-relaxed">
                     {couple.venueAddressKh}
                   </p>
                 )}
                 {/* Decorative divider under title */}
                 <div className="flex items-center justify-center gap-2 text-[#D4AF37]/60 pt-2">
                   <span className="w-16 h-px bg-gradient-to-l from-[#D4AF37]/60 to-transparent"></span>
                   <span className="text-sm">❖</span>
                   <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37]/60 to-transparent"></span>
                 </div>
               </div>

               {/* Drawn/Custom Map Image (If provided) - Enlarged and Responsive */}
               {couple.venueMapImage && (
                 <div className="w-full -mx-1 sm:mx-0 max-w-xl px-0 sm:px-2">
                   <div 
                     onClick={() => {
                       setActivePhoto(couple.venueMapImage!);
                       setLightboxZoom(1);
                     }}
                     className="w-full mx-auto overflow-hidden rounded-2xl border-2 border-[#D4AF37]/70 shadow-[0_8px_32px_rgba(212,175,55,0.25)] bg-black/40 cursor-pointer group relative transition-all duration-300 hover:border-[#FFE58F] hover:shadow-[0_12px_40px_rgba(212,175,55,0.4)]"
                     title="ចុចដើម្បីមើលរូបភាពធំពេញអេក្រង់"
                   >
                     <img 
                       src={couple.venueMapImage} 
                       alt="ផែនទីទីតាំងកម្មវិធី (Venue Map)" 
                       className="w-full h-auto object-contain max-h-[720px] sm:max-h-[820px] transition-transform duration-300 group-hover:scale-[1.01]"
                     />
                   </div>
                 </div>
               )}

               <a 
                 href={couple.venueMapUrl || `https://maps.google.com/?q=${encodeURIComponent((couple.venueNameKh || '') + ' ' + (couple.venueAddressKh || ''))}`} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#D4AF37] text-white/95 bg-black/80 hover:bg-[#D4AF37]/20 transition-all font-battambang text-[15px] shadow-sm group cursor-pointer"
               >
                 <MapPin className="w-[18px] h-[18px] text-[#D4AF37] group-hover:scale-110 transition-transform" />
                 បើកមើលក្នុង <span className="font-serif-luxury tracking-wider ml-1">Google Maps</span>
               </a>
            </div>

            {/* Photo Gallery - Styled for Dark Mode / Pink Background */}
            {couple.galleryPhotos && couple.galleryPhotos.length > 0 && (
              <div className="space-y-6 pt-10 text-center border-t border-[#D4AF37]/30">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-normal font-muol-light text-[#D4AF37] leading-relaxed drop-shadow-sm">
                    កម្រង<br/>រូបភាពអនុស្សាវរីយ៍
                  </h3>
                  {/* Decorative divider under title */}
                  <div className="flex items-center justify-center gap-2 text-[#D4AF37]/60 pt-2">
                    <span className="w-16 h-px bg-gradient-to-l from-[#D4AF37]/60 to-transparent"></span>
                    <span className="text-sm">❖</span>
                    <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37]/60 to-transparent"></span>
                  </div>
                </div>

                {/* Full-Screen Slideshow Launcher Button */}
                <div className="flex justify-center pb-1">
                  <button
                    id="gallery-watch-slideshow-btn"
                    onClick={() => setIsSlideshowOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37]/25 via-[#DFBA49]/40 to-[#D4AF37]/25 hover:from-[#D4AF37]/45 hover:to-[#D4AF37]/45 border border-[#D4AF37]/70 text-[#FFE58F] text-xs font-normal transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#FFE58F]" />
                    <span>{lang === 'km' ? 'ទស្សនា Slide Show រូបភាពវិចិត្រសាល' : 'Watch Gallery Slideshow'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(couple.galleryPhotos || []).map((photo, idx) => (
                    <div key={idx} onClick={() => setActivePhoto(photo)} className="relative h-36 sm:h-44 rounded-xl overflow-hidden cursor-pointer group ring-1 ring-[#D4AF37]/40 shadow-sm bg-black/10">
                      <img src={photo} alt="Pre-wedding" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Gift (KHQR) */}
            <div className="space-y-6 text-center pt-10 border-t border-[#D4AF37]/30">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-normal font-muol-light text-[#D4AF37] leading-relaxed drop-shadow-sm">
                  ចងដៃ<br/>អាពាហ៍ពិពាហ៍
                </h3>
                {/* Decorative divider under title */}
                <div className="flex items-center justify-center gap-2 text-[#D4AF37]/60 pt-2">
                  <span className="w-16 h-px bg-gradient-to-l from-[#D4AF37]/60 to-transparent"></span>
                  <span className="text-sm">❖</span>
                  <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37]/60 to-transparent"></span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {(couple.bankAccounts || []).map((ba) => (
                  <div key={ba.id} className="p-5 rounded-2xl bg-black/30 backdrop-blur-md border border-[#D4AF37]/40 space-y-4 shadow-sm">
                    <span className="text-sm font-normal text-[#D4AF37] block font-battambang drop-shadow-sm">{ba.bankName}</span>
                    <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto border-2 border-[#D4AF37]/50 shadow-md">
                      <img src={ba.qrUrl} alt={ba.bankName} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-sm font-battambang text-white/95">
                      <p>{ba.accountName}</p>
                      <p className="text-[#D4AF37] font-mono mt-1 text-xs drop-shadow-sm">{ba.accountNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RSVP Form */}
            <div className="space-y-6 pt-10 text-center border-t border-[#D4AF37]/30 relative" id="rsvp-section">

              <h3 className={`text-2xl font-normal ${khmerTitleFont} text-[#D4AF37]`}>
                ការឆ្លើយតប និងសៀវភៅជូនពរ
              </h3>
              
              {rsvpSubmitted ? (
                <div className="p-6 bg-black/30 rounded-2xl border border-[#D4AF37]/40 text-center space-y-3 backdrop-blur-sm shadow-sm">
                  <div className="text-3xl text-[#D4AF37] mx-auto">✓</div>
                  <h4 className="font-normal text-base text-white/95 font-battambang">សូមអរគុណយ៉ាងជ្រាលជ្រៅ!</h4>
                  <p className="text-xs text-white/70">ការឆ្លើយតបរបស់អ្នកត្រូវបានកត់ត្រារួចរាល់។</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-lg mx-auto text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRsvpAttending('attending')} className={`p-3.5 rounded-xl border text-xs font-normal flex items-center justify-center gap-2 transition-all ${rsvpAttending === 'attending' ? 'border-[#D4AF37] bg-white/10 text-white/95 shadow-sm' : 'border-[#D4AF37]/30 text-white/70 bg-black/20'}`}>
                      ✓ ខ្ញុំនឹងចូលរួម
                    </button>
                    <button type="button" onClick={() => setRsvpAttending('declined')} className={`p-3.5 rounded-xl border text-xs font-normal flex items-center justify-center gap-2 transition-all ${rsvpAttending === 'declined' ? 'border-rose-400 bg-rose-50 text-rose-800 shadow-sm' : 'border-[#D4AF37]/30 text-white/70 bg-black/20'}`}>
                      ✕ សូមអភ័យទោស
                    </button>
                  </div>
                  <div>
                    <input type="text" required value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="គោរមងារ និងឈ្មោះរបស់អ្នក" className="w-full px-4 py-3.5 text-sm bg-black/30 border border-[#D4AF37]/40 rounded-xl focus:border-[#D4AF37] focus:outline-none text-white/95 placeholder-gray-600 font-battambang backdrop-blur-sm" />
                  </div>
                  {rsvpAttending === 'attending' && (
                    <div>
                      <select value={rsvpPax} onChange={(e) => setRsvpPax(Number(e.target.value))} className="w-full px-4 py-3.5 text-sm bg-black/30 border border-[#D4AF37]/40 rounded-xl focus:border-[#D4AF37] focus:outline-none text-white/95 appearance-none font-battambang backdrop-blur-sm">
                        <option value={1} className="bg-[#3B1E42]">១ នាក់</option>
                        <option value={2} className="bg-[#3B1E42]">២ នាក់</option>
                        <option value={3} className="bg-[#3B1E42]">៣ នាក់</option>
                        <option value={4} className="bg-[#3B1E42]">៤ នាក់</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <textarea rows={3} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="ពាក្យជូនពរ..." className="w-full px-4 py-3.5 text-sm bg-black/30 border border-[#D4AF37]/40 rounded-xl focus:border-[#D4AF37] focus:outline-none text-white/95 placeholder-gray-600 font-battambang backdrop-blur-sm" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 flex items-center justify-center gap-2 transition-transform active:scale-95 font-battambang mt-2">
                    <Send className="w-4 h-4" /> ផ្ញើការឆ្លើយតប
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Floating Share / Copy Link Toolbar */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-normal text-gray-700 shadow-xs flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{copiedLink ? 'បានចម្លងតំណភ្ជាប់!' : 'ចម្លង Link សំបុត្រ'}</span>
            </button>
          </div>

          {/* Footer Branding */}
          <div className="text-center pt-2 pb-2 text-[11px] text-gray-400 space-y-0.5">
            <p>E-Invitation Platform © 2026</p>
            <p>រៀបចំយ៉ាងប្រណិតជូនគូស្វាមីភរិយាថ្មី {couple.groomNickKh} & {couple.brideNickKh}</p>
          </div>
        </div>

        {/* Admin Promo & Contacts (If enabled or provided) - Connected seamlessly */}
        {(couple.adminPromo?.enabled || couple.contactFacebook || couple.contactTelegram || couple.contactPhone) && (
          <div className="w-full text-center mt-0 pt-0">
            <div className="p-5 bg-black/85 backdrop-blur-md border-t border-[#D4AF37]/50 shadow-2xl w-full space-y-3">
              {/* Logo Display at Top of Footer */}
              <div className="flex items-center justify-center pt-1 pb-1">
                <img 
                  src={couple.adminPromo?.imageUrl || ponleuLogo} 
                  alt="Ponleu Printing Logo" 
                  className="h-12 max-w-[280px] object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" 
                />
              </div>

              {couple.adminPromo?.enabled && couple.adminPromo.textKh && (
                <div className="text-[13px] font-battambang text-[#D4AF37]/95 whitespace-pre-line leading-relaxed">
                  {couple.adminPromo.textKh}
                </div>
              )}

              {/* Contact Icons in Footer */}
              {(couple.contactFacebook || couple.contactTelegram || couple.contactPhone) && (
                <div className="flex items-center justify-center gap-2.5 pt-1">
                  {couple.contactPhone && (
                    <a 
                      href={`tel:${couple.contactPhone.replace(/\s+/g, '')}`} 
                      title={`Call: ${couple.contactPhone}`}
                      className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-black/40 hover:bg-[#D4AF37]/20 transition-all text-[#D4AF37] flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </a>
                  )}
                  {couple.contactTelegram && (
                    <a 
                      href={couple.contactTelegram.startsWith('http') ? couple.contactTelegram : `https://t.me/${couple.contactTelegram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      title="Telegram"
                      className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-black/40 hover:bg-[#D4AF37]/20 transition-all text-[#D4AF37] flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 text-sky-400" />
                    </a>
                  )}
                  {couple.contactFacebook && (
                    <a 
                      href={couple.contactFacebook.startsWith('http') ? couple.contactFacebook : `https://facebook.com/${couple.contactFacebook}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      title="Facebook"
                      className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-black/40 hover:bg-[#D4AF37]/20 transition-all text-[#D4AF37] flex items-center justify-center"
                    >
                      <Facebook className="w-4 h-4 text-blue-400" />
                    </a>
                  )}
                </div>
              )}

              {couple.adminPromo?.enabled && couple.adminPromo.linkUrl && (
                <div>
                  <a href={couple.adminPromo.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 mt-2 px-5 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-battambang hover:bg-[#D4AF37]/20 transition-all">
                    ចូលទៅកាន់ទំព័រ <span className="text-[10px]">▶</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )}

      {/* Lightbox Modal for Photo Gallery & Map */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={() => { setActivePhoto(null); setLightboxZoom(1); }}
        >
          {/* Top Control Bar */}
          <div 
            className="w-full max-w-2xl flex items-center justify-between z-20 py-2 px-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-amber-200/90 font-battambang font-medium">
                {activePhoto === couple.venueMapImage ? '🗺️ ផែនទីទីតាំងកម្មវិធី' : '🖼️ រូបភាព'}
              </span>
              <div className="flex items-center bg-white/15 rounded-full p-0.5 border border-white/20">
                <button
                  type="button"
                  onClick={() => setLightboxZoom(prev => Math.max(1, +(prev - 0.5).toFixed(1)))}
                  disabled={lightboxZoom <= 1}
                  className="p-1.5 hover:bg-white/25 rounded-full disabled:opacity-35 transition-all cursor-pointer"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </button>
                <span className="text-xs font-mono px-2 text-amber-300 min-w-[42px] text-center font-semibold">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(prev => Math.min(3, +(prev + 0.5).toFixed(1)))}
                  disabled={lightboxZoom >= 3}
                  className="p-1.5 hover:bg-white/25 rounded-full disabled:opacity-35 transition-all cursor-pointer"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <button 
              type="button"
              className="text-white p-2 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-battambang"
              onClick={() => { setActivePhoto(null); setLightboxZoom(1); }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Image with Zoom */}
          <div 
            className="flex-1 w-full flex items-center justify-center overflow-auto p-1 sm:p-2"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActivePhoto(null);
                setLightboxZoom(1);
              }
            }}
          >
            <img 
              src={activePhoto} 
              alt="Enlarged view" 
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: 'center center' }}
              className="max-w-full max-h-[86vh] object-contain rounded-xl shadow-2xl transition-transform duration-200 cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxZoom(prev => (prev >= 2.5 ? 1 : +(prev + 0.5).toFixed(1)));
              }}
            />
          </div>

          <p className="text-[11px] sm:text-xs text-white/60 pb-2 font-battambang text-center pointer-events-none">
            ចុចលើរូបដើម្បីពង្រីក (Zoom) ឬចុចកន្លែងទំនេរដើម្បីបិទ
          </p>
        </div>
      )}

    </div>
  );
};
