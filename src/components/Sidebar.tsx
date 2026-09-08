import React from 'react';
import { CoupleEvent, Language } from '../types';
import { 
  LayoutDashboard, 
  Palette, 
  Users, 
  FileText, 
  MessageSquareHeart, 
  Eye, 
  Share2, 
  Calendar,
  Sparkles,
  Heart,
  Layout,
  Music,
  BookOpen,
  LogOut
} from 'lucide-react';
import { AdminUserState, AUTHORIZED_ADMIN_EMAIL } from '../lib/adminAuth';

interface SidebarProps {
  currentView: 'admin' | 'couple' | 'guest';
  setCurrentView: (view: 'admin' | 'couple' | 'guest') => void;
  couples: CoupleEvent[];
  selectedCoupleId: string;
  setSelectedCoupleId: (id: string) => void;
  activeCoupleTab?: 'overview' | 'details' | 'template' | 'guests' | 'wishes';
  setActiveCoupleTab?: (tab: 'overview' | 'details' | 'template' | 'guests' | 'wishes') => void;
  adminActiveSection?: 'overview' | 'templates' | 'couples' | 'footer' | 'music';
  setAdminActiveSection?: (section: 'overview' | 'templates' | 'couples' | 'footer' | 'music') => void;
  lang: Language;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  adminUser?: AdminUserState | null;
  onAdminLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  couples,
  selectedCoupleId,
  setSelectedCoupleId,
  activeCoupleTab = 'overview',
  setActiveCoupleTab,
  adminActiveSection = 'overview',
  setAdminActiveSection,
  lang,
  isOpenMobile,
  onCloseMobile,
  adminUser,
  onAdminLogout
}) => {
  const selectedCouple = couples.find(c => c.id === selectedCoupleId) || couples[0];

  const handleNavClick = (
    view: 'admin' | 'couple' | 'guest', 
    adminSection?: 'overview' | 'templates' | 'couples' | 'footer' | 'music', 
    coupleTab?: 'overview' | 'details' | 'template' | 'guests' | 'wishes'
  ) => {
    setCurrentView(view);
    if (adminSection && setAdminActiveSection) {
      setAdminActiveSection(adminSection);
    }
    if (coupleTab && setActiveCoupleTab) {
      setActiveCoupleTab(coupleTab);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B132B] text-slate-200 flex flex-col border-r border-[#1C2A4A] transition-transform duration-300 ease-in-out font-battambang select-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* 1. Header / Brand Logo */}
        <div className="p-5 flex items-center gap-3.5 border-b border-[#1A2644]">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF0055] via-[#FF1B6B] to-[#FF4585] flex items-center justify-center text-white shadow-lg shadow-pink-900/40 shrink-0">
            <span className="font-serif-luxury font-normal text-xl italic tracking-tighter">eI</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-normal text-white tracking-tight leading-none truncate">
                {currentView === 'admin' ? 'eInvite Admin' : 'eInvite Wedding'}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
              {currentView === 'admin' ? 'ផ្ទាំងគ្រប់គ្រងទូទៅ' : 'ផ្ទាំងគ្រប់គ្រងអាពាហ៍ពិពាហ៍'}
            </p>
          </div>
        </div>

        {/* 2. Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          
          {/* A. COUPLE PORTAL MENU ITEMS */}
          {currentView === 'couple' ? (
            <div className="space-y-4">
              
              {/* Main Menu Label */}
              <div className="px-2">
                <span className="text-[11px] font-normal text-slate-400 uppercase tracking-wider">
                  {lang === 'km' ? 'ម៉ឺនុយគ្រប់គ្រង' : 'Management Menu'}
                </span>
              </div>

              {/* Menu List */}
              <div className="space-y-1.5">
                {/* 1. គ្រប់គ្រងទូទៅ (Overview) */}
                <button
                  id="sidebar-couple-tab-overview"
                  onClick={() => handleNavClick('couple', undefined, 'overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                    activeCoupleTab === 'overview'
                      ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className={`w-4 h-4 ${activeCoupleTab === 'overview' ? 'text-white' : 'text-[#FF1B6B]'}`} />
                    <span>{lang === 'km' ? 'គ្រប់គ្រងទូទៅ' : 'Overview'}</span>
                  </div>
                  <Sparkles className="w-3 h-3 text-amber-300 opacity-80" />
                </button>

                {/* 2. រចនាប័ទ្ម (Template) */}
                <button
                  id="sidebar-couple-tab-template"
                  onClick={() => handleNavClick('couple', undefined, 'template')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                    activeCoupleTab === 'template'
                      ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Palette className={`w-4 h-4 ${activeCoupleTab === 'template' ? 'text-white' : 'text-[#FF1B6B]'}`} />
                    <span>{lang === 'km' ? 'រចនាប័ទ្ម' : 'Template'}</span>
                  </div>
                </button>

                {/* 3. បញ្ជីភ្ញៀវ (Guest List) */}
                <button
                  id="sidebar-couple-tab-guests"
                  onClick={() => handleNavClick('couple', undefined, 'guests')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                    activeCoupleTab === 'guests'
                      ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 ${activeCoupleTab === 'guests' ? 'text-white' : 'text-[#FF1B6B]'}`} />
                    <span>{lang === 'km' ? 'បញ្ជីភ្ញៀវ' : 'Guest List'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                    activeCoupleTab === 'guests'
                      ? 'bg-white/20 text-white'
                      : 'bg-pink-500/20 text-[#FF4585] border border-pink-500/30'
                  }`}>
                    {selectedCouple?.guests?.length || 0}
                  </span>
                </button>

                {/* 4. សារជូនពរ (Wishes) */}
                <button
                  id="sidebar-couple-tab-wishes"
                  onClick={() => handleNavClick('couple', undefined, 'wishes')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                    activeCoupleTab === 'wishes'
                      ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquareHeart className={`w-4 h-4 ${activeCoupleTab === 'wishes' ? 'text-white' : 'text-[#FF1B6B]'}`} />
                    <span>{lang === 'km' ? 'សារជូនពរ' : 'Wishes'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                    activeCoupleTab === 'wishes'
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedCouple?.wishes?.length || 0}
                  </span>
                </button>
              </div>

              {/* Preview Button in Sidebar */}
              <div className="pt-3">
                <button
                  onClick={() => handleNavClick('guest')}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white text-xs font-normal transition-all shadow-md shadow-amber-950/30"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'km' ? 'មើលសំបុត្រអញ្ជើញផ្ទាល់' : 'Preview Live Invitation'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* B. ADMIN PORTAL MENU ITEMS */
            <div className="space-y-1.5">
              {/* Dashboard / ផ្ទាំងគ្រប់គ្រង */}
              <button
                id="sidebar-nav-dashboard"
                onClick={() => handleNavClick('admin', 'overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                  currentView === 'admin' && adminActiveSection === 'overview'
                    ? 'bg-white/10 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${currentView === 'admin' && adminActiveSection === 'overview' ? 'text-[#FF1B6B]' : 'text-slate-400'}`} />
                <span>{lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard'}</span>
              </button>

              {/* Templates / រចនាប័ទ្ម (Templates) */}
              <button
                id="sidebar-nav-templates"
                onClick={() => handleNavClick('admin', 'templates')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                  currentView === 'admin' && adminActiveSection === 'templates'
                    ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Palette className={`w-4 h-4 ${currentView === 'admin' && adminActiveSection === 'templates' ? 'text-white' : 'text-slate-400'}`} />
                <span>{lang === 'km' ? 'រចនាប័ទ្ម (Templates)' : 'Templates'}</span>
              </button>

              {/* Couples List / បញ្ជីកូនកម្លោះក្រមុំ */}
              <button
                id="sidebar-nav-couples"
                onClick={() => handleNavClick('admin', 'couples')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                  currentView === 'admin' && adminActiveSection === 'couples'
                    ? 'bg-white/10 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className={`w-4 h-4 ${currentView === 'admin' && adminActiveSection === 'couples' ? 'text-[#FF1B6B]' : 'text-slate-400'}`} />
                <span>{lang === 'km' ? 'បញ្ជីកូនកម្លោះក្រមុំ' : 'Couples List'}</span>
              </button>

              {/* Footer Settings / កំណត់ព័ត៌មាន Footer */}
              <button
                id="sidebar-nav-footer"
                onClick={() => handleNavClick('admin', 'footer')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                  currentView === 'admin' && adminActiveSection === 'footer'
                    ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layout className={`w-4 h-4 ${currentView === 'admin' && adminActiveSection === 'footer' ? 'text-white' : 'text-slate-400'}`} />
                  <span>{lang === 'km' ? 'កំណត់ព័ត៌មាន Footer' : 'Footer Settings'}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-amber-500/20 text-amber-300 font-medium">
                  Logo
                </span>
              </button>

              {/* Music Management / គ្រប់គ្រងបទចម្រៀង/ភ្លេងការ */}
              <button
                id="sidebar-nav-music"
                onClick={() => handleNavClick('admin', 'music')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all ${
                  currentView === 'admin' && adminActiveSection === 'music'
                    ? 'bg-[#FF1B6B] text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Music className={`w-4 h-4 ${currentView === 'admin' && adminActiveSection === 'music' ? 'text-white' : 'text-slate-400'}`} />
                  <span>{lang === 'km' ? 'គ្រប់គ្រងបទចម្រៀង/ភ្លេង' : 'Music Library'}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-pink-500/20 text-pink-300 font-medium">
                  New
                </span>
              </button>
            </div>
          )}

        </div>

        {/* 3. Bottom Footer Profile */}
        <div className="p-3.5 border-t border-[#1A2644] bg-[#080E21] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {currentView === 'admin' && adminUser?.photoURL ? (
              <img 
                src={adminUser.photoURL} 
                alt="Admin" 
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-amber-400/40 object-cover shrink-0" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1A2644] border border-[#2A3A60] flex items-center justify-center text-[10px] font-medium text-[#FF4585] tracking-wider shrink-0">
                {currentView === 'admin' ? 'ADM' : 'WED'}
              </div>
            )}
            
            <div className="overflow-hidden min-w-0 flex-1">
              <h4 className="text-xs font-medium text-white truncate font-mono">
                {currentView === 'admin' ? (adminUser?.email || AUTHORIZED_ADMIN_EMAIL) : selectedCouple ? `${selectedCouple.groomNickKh || selectedCouple.groomNameKh || ''} & ${selectedCouple.brideNickKh || selectedCouple.brideNameKh || ''}` : 'គូស្វាមីភរិយា'}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <p className="text-[10px] text-amber-400/90 font-medium truncate">
                  {currentView === 'admin' ? 'Master Admin' : 'គូស្វាមីភរិយា'}
                </p>
              </div>
            </div>
          </div>

          {currentView === 'admin' && onAdminLogout && (
            <button
              onClick={onAdminLogout}
              title={lang === 'km' ? 'ចាកចេញពី Admin (Sign Out)' : 'Sign Out Admin'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </aside>
    </>
  );
};

