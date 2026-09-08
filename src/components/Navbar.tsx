import React, { useState } from 'react';
import { Template, CoupleEvent, Language } from '../types';
import { 
  Menu,
  Volume2, 
  VolumeX, 
  Globe, 
  Eye, 
  ChevronRight, 
  Sparkles,
  LayoutDashboard, 
  Palette, 
  Users, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { weddingAudioPlayer } from '../utils/audioSynthesizer';
import { AdminUserState, AUTHORIZED_ADMIN_EMAIL } from '../lib/adminAuth';

interface NavbarProps {
  currentView: 'admin' | 'couple' | 'guest';
  setCurrentView: (view: 'admin' | 'couple' | 'guest') => void;
  couples: CoupleEvent[];
  selectedCoupleId: string;
  setSelectedCoupleId: (id: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onToggleMobileSidebar?: () => void;
  activeCoupleTab?: 'overview' | 'details' | 'template' | 'guests' | 'wishes';
  setActiveCoupleTab?: (tab: 'overview' | 'details' | 'template' | 'guests' | 'wishes') => void;
  adminActiveSection?: 'overview' | 'templates' | 'couples' | 'footer' | 'music';
  setAdminActiveSection?: (section: 'overview' | 'templates' | 'couples' | 'footer' | 'music') => void;
  adminUser?: AdminUserState | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  couples,
  selectedCoupleId,
  setSelectedCoupleId,
  lang,
  setLang,
  onToggleMobileSidebar,
  activeCoupleTab = 'guests',
  setActiveCoupleTab,
  adminActiveSection = 'overview',
  setAdminActiveSection,
  adminUser
}) => {
  const [isPlaying, setIsPlaying] = useState(weddingAudioPlayer.getPlayingState());
  const selectedCouple = couples.find(c => c.id === selectedCoupleId) || couples[0];

  const toggleMusic = () => {
    const state = weddingAudioPlayer.toggle();
    setIsPlaying(state);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE6E1] shadow-2xs font-battambang">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & App Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Sidebar Toggle Button - in admin & couple mode */}
          {currentView !== 'guest' && (
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 border border-gray-200"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* App Brand Logo */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF0055] via-[#FF1B6B] to-[#FF4585] flex items-center justify-center text-white shadow-sm shadow-pink-500/20 shrink-0">
              <span className="font-serif-luxury font-normal text-base italic tracking-tighter">eI</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-normal text-gray-900 tracking-tight">eInvite</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-pink-50 text-[#FF1B6B] font-normal border border-pink-100/60">Wedding</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">ធៀបការឌីជីថល</span>
            </div>
          </div>
        </div>

        {/* Right Tools: Music Synth, Lang Switcher, Full Screen */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Admin Email Badge */}
          {currentView === 'admin' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/90 border border-amber-200/90 rounded-xl text-[11px] text-amber-950 font-mono shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[190px]">{adminUser?.email || AUTHORIZED_ADMIN_EMAIL}</span>
            </div>
          )}

          {/* Quick Preview Button */}
          {currentView !== 'guest' ? (
            <button
              onClick={() => setCurrentView('guest')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-amber-50 text-gray-700 hover:text-[#8C6D1F] border border-[#EAE6E1] text-xs font-normal transition-all shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'km' ? 'មើលសំបុត្រ' : 'Preview'}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('couple')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-normal transition-all shadow-xs"
            >
              <span>{lang === 'km' ? 'ត្រឡប់មកវិញ' : 'Exit View'}</span>
            </button>
          )}

          {/* Audio Synthesizer toggle */}
          <button
            id="audio-synth-toggle-btn"
            onClick={toggleMusic}
            title={isPlaying ? 'ផ្អាកភ្លេងការ (Pause Music)' : 'ចាក់ភ្លេងការ (Play Romantic Melody)'}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
              isPlaying
                ? 'bg-amber-50 border-amber-300 text-amber-700 animate-pulse'
                : 'bg-white border-[#EAE6E1] text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <span className="hidden xl:inline text-[11px] font-normal">
              {isPlaying ? (lang === 'km' ? 'ភ្លេងការ ON' : 'Music ON') : (lang === 'km' ? 'ភ្លេងការ OFF' : 'Music OFF')}
            </span>
          </button>

          {/* Language Toggle Button */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#EAE6E1] bg-white text-xs font-normal text-gray-700 hover:bg-gray-50 shadow-2xs"
            title="ប្តូរភាសា / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
