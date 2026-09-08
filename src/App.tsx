import React, { useState, useEffect } from 'react';
import { Template, CoupleEvent, Language, MusicTrack } from './types';
import { INITIAL_TEMPLATES, INITIAL_COUPLES, INITIAL_MUSIC_TRACKS } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminLoginGate } from './components/Admin/AdminLoginGate';
import { CoupleDashboard } from './components/Couple/CoupleDashboard';
import { CoupleLoginGate } from './components/Couple/CoupleLoginGate';
import { GuestInvitationView } from './components/Guest/GuestInvitationView';
import { PreviewModal } from './components/PreviewModal';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  AdminUserState, 
  AUTHORIZED_ADMIN_EMAIL, 
  getStoredAdminSession, 
  saveAdminSession, 
  adminLogout 
} from './lib/adminAuth';

const STORAGE_TEMPLATES_KEY = 'e_invitation_templates_v4';
const STORAGE_COUPLES_KEY = 'e_invitation_couples_v4';
const STORAGE_MUSIC_KEY = 'e_invitation_music_v1';
const STORAGE_LANG_KEY = 'e_invitation_lang_v1';

export default function App() {
  const [_templates, _setTemplates] = useState<Template[]>([]);
  const [_musicTracks, _setMusicTracks] = useState<MusicTrack[]>([]);
  const [_couples, _setCouples] = useState<CoupleEvent[]>([]);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUserState | null>(() => getStoredAdminSession());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        const session: AdminUserState = {
          email: AUTHORIZED_ADMIN_EMAIL,
          displayName: fbUser.displayName || 'Admin Ponleu',
          photoURL: fbUser.photoURL || undefined,
          method: 'google',
          loginTime: Date.now()
        };
        setAdminUser(session);
        saveAdminSession(session);
      }
    });
    return () => unsub();
  }, []);

  const handleAdminLogout = async () => {
    await adminLogout();
    setAdminUser(null);
  };

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    const init = async () => {
      const { subscribeToCollection } = await import('./lib/firebaseSync');
      unsubs.push(subscribeToCollection<Template>('templates', (data) => {
        _setTemplates(data.length ? data : INITIAL_TEMPLATES);
      }));
      unsubs.push(subscribeToCollection<MusicTrack>('musicTracks', (data) => {
        _setMusicTracks(data.length ? data : INITIAL_MUSIC_TRACKS);
      }));
      unsubs.push(subscribeToCollection<CoupleEvent>('couples', (data) => {
        _setCouples(data.length ? data : INITIAL_COUPLES);
      }));
      setIsFirebaseReady(true);
    };
    init();
    return () => unsubs.forEach(u => u());
  }, []);

  const setTemplates = React.useCallback((action: React.SetStateAction<Template[]>) => {
    _setTemplates(prev => {
      const next = typeof action === 'function' ? (action as any)(prev) : action;
      import('./lib/firebaseSync').then(({ syncCollectionToFirestore }) => {
        syncCollectionToFirestore('templates', prev, next);
      });
      return next;
    });
  }, []);

  const setMusicTracks = React.useCallback((action: React.SetStateAction<MusicTrack[]>) => {
    _setMusicTracks(prev => {
      const next = typeof action === 'function' ? (action as any)(prev) : action;
      import('./lib/firebaseSync').then(({ syncCollectionToFirestore }) => {
        syncCollectionToFirestore('musicTracks', prev, next);
      });
      return next;
    });
  }, []);

  const setCouples = React.useCallback((action: React.SetStateAction<CoupleEvent[]>) => {
    _setCouples(prev => {
      const next = typeof action === 'function' ? (action as any)(prev) : action;
      import('./lib/firebaseSync').then(({ syncCollectionToFirestore }) => {
        syncCollectionToFirestore('couples', prev, next);
      });
      return next;
    });
  }, []);

  const templates = _templates.length ? _templates : INITIAL_TEMPLATES;
  const musicTracks = _musicTracks.length ? _musicTracks : INITIAL_MUSIC_TRACKS;
  const couples = _couples.length ? _couples : INITIAL_COUPLES;

  const [selectedCoupleId, setSelectedCoupleId] = useState<string>(() => {
    return couples[0]?.id || 'couple_368';
  });

  const [currentView, setCurrentView] = useState<'admin' | 'couple' | 'guest'>('admin');
  const [currentGuestCode, setCurrentGuestCode] = useState<string | undefined>(undefined);
  const [activeCoupleTab, setActiveCoupleTab] = useState<'overview' | 'details' | 'template' | 'guests' | 'wishes'>('overview');
  const [adminActiveSection, setAdminActiveSection] = useState<'overview' | 'templates' | 'couples' | 'footer' | 'music'>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Keep a ref of couples to avoid triggering URL reset when couples state updates
  const couplesRef = React.useRef(couples);
  useEffect(() => {
    couplesRef.current = couples;
  }, [couples]);

  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      return (saved === 'en' || saved === 'km') ? (saved as Language) : 'km';
    } catch {
      return 'km';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch (err) {
      console.warn('Failed to save lang', err);
    }
  }, [lang]);

  // URL Hash & Search Query Parser for direct links (Supports #manage/slug, ?c=slug, etc.)
  const parseUrl = React.useCallback((isInitialMount = false) => {
    const currentCouples = couplesRef.current.length ? couplesRef.current : INITIAL_COUPLES;
    const rawHash = window.location.hash || '';
    const cleanHash = rawHash.replace(/^#\/?/, '');
    const searchParams = new URLSearchParams(window.location.search);
    
    let coupleSlug = searchParams.get('c') || searchParams.get('couple') || '';
    let guestParam = searchParams.get('guest');
    const editParam = searchParams.get('edit') || searchParams.get('manage');
    const viewParam = searchParams.get('view');

    // Check pathname (e.g. /c/vibol-socheata)
    const pathname = window.location.pathname;
    if (pathname.startsWith('/c/')) {
      const pathSlug = pathname.replace('/c/', '').split('/')[0];
      if (pathSlug) coupleSlug = decodeURIComponent(pathSlug);
    }

    // Helper to find couple by slug or ID case-insensitively
    const findCouple = (target: string) => {
      if (!target) return undefined;
      const decoded = decodeURIComponent(target).trim().toLowerCase();
      return currentCouples.find(c => 
        (c.slug && c.slug.toLowerCase() === decoded) || 
        (c.id && c.id.toLowerCase() === decoded)
      );
    };

    // 1. Couple Management Route (#manage/slug or #edit/slug or ?manage=slug or ?edit=slug)
    if (cleanHash.startsWith('manage/') || cleanHash.startsWith('edit/')) {
      const slug = cleanHash.replace(/^(manage|edit)\//, '');
      const found = findCouple(slug);
      if (found) {
        setSelectedCoupleId(found.id);
        setActiveCoupleTab('overview');
        setCurrentView('couple');
        return;
      } else if (currentCouples.length > 0) {
        setSelectedCoupleId(currentCouples[0].id);
        setActiveCoupleTab('overview');
        setCurrentView('couple');
        return;
      }
    } else if (editParam) {
      const found = findCouple(editParam);
      if (found) {
        setSelectedCoupleId(found.id);
        setActiveCoupleTab('overview');
        setCurrentView('couple');
        return;
      } else if (currentCouples.length > 0) {
        setSelectedCoupleId(currentCouples[0].id);
        setActiveCoupleTab('overview');
        setCurrentView('couple');
        return;
      }
    }

    // 2. Guest Invitation link
    if (cleanHash && cleanHash !== 'admin' && !cleanHash.startsWith('manage')) {
      if (cleanHash.includes('?')) {
        const parts = cleanHash.split('?');
        coupleSlug = parts[0];
        const hashParams = new URLSearchParams(parts[1]);
        if (!guestParam && hashParams.get('guest')) {
          guestParam = hashParams.get('guest');
        }
      } else {
        coupleSlug = cleanHash;
      }
    }

    if (coupleSlug && coupleSlug !== 'admin') {
      const found = findCouple(coupleSlug);
      if (found) {
        setSelectedCoupleId(found.id);
        setCurrentGuestCode(guestParam || undefined);
        setCurrentView('guest');
        return;
      } else if (currentCouples.length > 0) {
        setSelectedCoupleId(currentCouples[0].id);
        setCurrentGuestCode(guestParam || undefined);
        setCurrentView('guest');
        return;
      }
    } else if (guestParam) {
      setCurrentGuestCode(guestParam);
      setCurrentView('guest');
      return;
    }

    if (viewParam === 'couple') {
      setCurrentView('couple');
      return;
    }

    // 3. Explicit Admin route or initial mount fallback
    if (cleanHash === 'admin') {
      setCurrentView('admin');
    } else if (isInitialMount && !cleanHash && !coupleSlug && !guestParam && !editParam) {
      setCurrentView('admin');
    }
  }, []);

  useEffect(() => {
    parseUrl(true);
    const onHashChange = () => parseUrl(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [parseUrl]);

  // Re-run parseUrl when Firestore completes sync so incoming URLs map to loaded data
  useEffect(() => {
    if (isFirebaseReady) {
      parseUrl(false);
    }
  }, [isFirebaseReady, parseUrl]);

  // Active couple object
  const activeCouple = couples.find(c => c.id === selectedCoupleId) || couples[0] || INITIAL_COUPLES[0];

  const handleSelectCoupleFromAdmin = (coupleId: string) => {
    setSelectedCoupleId(coupleId);
    setActiveCoupleTab('overview');
    setCurrentView('couple');
  };

  const handlePreviewCouple = (coupleId: string, guestCode?: string) => {
    setSelectedCoupleId(coupleId);
    setCurrentGuestCode(guestCode);
    setIsPreviewModalOpen(true);
  };

  // If in Guest Invitation full view
  if (currentView === 'guest') {
    return (
      <div className="h-[100dvh] w-full overflow-hidden bg-[#FDFCFB] font-battambang selection:bg-[#D4AF37]/25 selection:text-[#8C6D1F]">
        <GuestInvitationView
          couple={activeCouple}
          templates={templates}
          guestCode={currentGuestCode}
          setCouples={setCouples}
          lang={lang}
          onBackToAdmin={() => {
            setCurrentView('couple');
            setActiveCoupleTab('overview');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-battambang selection:bg-[#D4AF37]/25 selection:text-[#8C6D1F]">
      
      {/* 1. Left Sidebar Navigation - Displayed in Admin and Couple modes */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(v) => {
          setCurrentView(v);
          if (v !== 'guest') {
            setCurrentGuestCode(undefined);
          }
        }}
        couples={couples}
        selectedCoupleId={selectedCoupleId}
        setSelectedCoupleId={setSelectedCoupleId}
        activeCoupleTab={activeCoupleTab}
        setActiveCoupleTab={setActiveCoupleTab}
        adminActiveSection={adminActiveSection}
        setAdminActiveSection={setAdminActiveSection}
        lang={lang}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        adminUser={adminUser}
        onAdminLogout={handleAdminLogout}
      />

      {/* 2. Main Content Wrapper (Shifted by w-72 for Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        {/* Top Header Bar with Breadcrumb and Controls */}
        <Navbar
          currentView={currentView}
          setCurrentView={(v) => {
            setCurrentView(v);
            if (v !== 'guest') {
              setCurrentGuestCode(undefined);
            }
          }}
          couples={couples}
          selectedCoupleId={selectedCoupleId}
          setSelectedCoupleId={setSelectedCoupleId}
          lang={lang}
          setLang={setLang}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          activeCoupleTab={activeCoupleTab}
          setActiveCoupleTab={setActiveCoupleTab}
          adminActiveSection={adminActiveSection}
          setAdminActiveSection={setAdminActiveSection}
          adminUser={adminUser}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-x-hidden">
          {currentView === 'admin' && (
            adminUser ? (
              <AdminDashboard
                templates={templates}
                setTemplates={setTemplates}
                couples={couples}
                setCouples={setCouples}
                musicTracks={musicTracks}
                setMusicTracks={setMusicTracks}
                onSelectCouple={handleSelectCoupleFromAdmin}
                onPreviewCouple={(id) => handlePreviewCouple(id)}
                lang={lang}
                activeSection={adminActiveSection}
              />
            ) : (
              <AdminLoginGate
                onSuccess={(user) => setAdminUser(user)}
                onCancel={() => {
                  setCurrentView('couple');
                  setActiveCoupleTab('overview');
                }}
                lang={lang}
              />
            )
          )}

          {currentView === 'couple' && (
            <CoupleLoginGate couple={activeCouple} lang={lang}>
              <CoupleDashboard
                couple={activeCouple}
                setCouples={setCouples}
                templates={templates}
                musicTracks={musicTracks}
                onPreviewGuest={(guestCode) => handlePreviewCouple(activeCouple.id, guestCode)}
                lang={lang}
                activeTab={activeCoupleTab}
                onTabChange={setActiveCoupleTab}
              />
            </CoupleLoginGate>
          )}
        </main>

      </div>

      {/* Pop Up Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        couple={activeCouple}
        templates={templates}
        guestCode={currentGuestCode}
        setCouples={setCouples}
        lang={lang}
      />

    </div>
  );
}
