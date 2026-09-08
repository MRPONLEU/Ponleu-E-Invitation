import React, { useState } from 'react';
import { Template, CoupleEvent, Language, MusicTrack } from '../../types';
import { DEFAULT_WEDDING_AGENDAS } from '../../data/initialData';
import { AdminOverviewPage } from './AdminOverviewPage';
import { AdminTemplatesPage } from './AdminTemplatesPage';
import { AdminCouplesPage } from './AdminCouplesPage';
import { audioSynthesizer } from '../../utils/audioSynthesizer';
import { AUTHORIZED_ADMIN_EMAIL } from '../../lib/adminAuth';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  Phone, 
  Facebook, 
  MessageCircle, 
  Check, 
  Eye, 
  Layout,
  Music,
  Play,
  Pause,
  Plus,
  Edit3,
  Volume2,
  Tag,
  Clock,
  MapPin,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  couples: CoupleEvent[];
  setCouples: React.Dispatch<React.SetStateAction<CoupleEvent[]>>;
  musicTracks?: MusicTrack[];
  setMusicTracks?: React.Dispatch<React.SetStateAction<MusicTrack[]>>;
  onSelectCouple: (coupleId: string) => void;
  onPreviewCouple: (coupleId: string) => void;
  lang: Language;
  activeSection?: 'overview' | 'templates' | 'couples' | 'footer' | 'music';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  templates,
  setTemplates,
  couples,
  setCouples,
  musicTracks = [],
  setMusicTracks,
  onSelectCouple,
  onPreviewCouple,
  lang,
  activeSection = 'overview'
}) => {
  // Music Track state
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [trackToDelete, setTrackToDelete] = useState<MusicTrack | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
  const [musicForm, setMusicForm] = useState<Partial<MusicTrack>>({
    titleKh: '',
    titleEn: '',
    category: 'ភ្លេងការបុរាណ',
    duration: '3:30',
    audioUrl: '',
    isPopular: false
  });
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [musicCategoryFilter, setMusicCategoryFilter] = useState<string>('all');

  const handleOpenAddMusicModal = () => {
    setEditingTrack(null);
    setMusicForm({
      titleKh: '',
      titleEn: '',
      category: 'ភ្លេងការបុរាណ',
      duration: '3:30',
      audioUrl: '',
      isPopular: false
    });
    setIsMusicModalOpen(true);
  };

  const handleOpenEditMusicModal = (track: MusicTrack) => {
    setEditingTrack(track);
    setMusicForm(track);
    setIsMusicModalOpen(true);
  };

  const handleSaveMusicTrack = () => {
    if (!musicForm.titleKh?.trim()) return;
    if (!setMusicTracks) return;

    if (editingTrack) {
      setMusicTracks(prev => prev.map(t => t.id === editingTrack.id ? {
        ...t,
        titleKh: musicForm.titleKh || t.titleKh,
        titleEn: musicForm.titleEn || t.titleEn,
        category: musicForm.category || t.category,
        duration: musicForm.duration || t.duration,
        audioUrl: musicForm.audioUrl || t.audioUrl,
        isPopular: musicForm.isPopular ?? t.isPopular
      } : t));
    } else {
      const newTrack: MusicTrack = {
        id: `track-${Date.now()}`,
        titleKh: musicForm.titleKh || 'បទចម្រៀងថ្មី',
        titleEn: musicForm.titleEn || 'New Music Track',
        category: musicForm.category || 'ភ្លេងការបុរាណ',
        duration: musicForm.duration || '3:30',
        audioUrl: musicForm.audioUrl || '',
        isPopular: musicForm.isPopular ?? false
      };
      setMusicTracks(prev => [newTrack, ...prev]);
    }
    setIsMusicModalOpen(false);
  };

  const handleDeleteMusicTrack = (track: MusicTrack) => {
    setTrackToDelete(track);
  };

  const handleConfirmDeleteTrack = () => {
    if (!trackToDelete || !setMusicTracks) return;
    const deletedTitle = trackToDelete.titleKh || trackToDelete.titleEn;

    if (playingTrackId === trackToDelete.id) {
      audioSynthesizer.stop();
      setPlayingTrackId(null);
    }

    setMusicTracks(prev => prev.filter(t => t.id !== trackToDelete.id));
    setTrackToDelete(null);
    if (isMusicModalOpen) setIsMusicModalOpen(false);

    setDeleteSuccessMsg(lang === 'km' ? `បានលុບບទចម្រៀង "${deletedTitle}" ដោយជោគជ័យ!` : `Successfully deleted "${deletedTitle}"!`);
    setTimeout(() => {
      setDeleteSuccessMsg(null);
    }, 4000);
  };

  const handleTogglePlayMusicTrack = (trackId: string) => {
    if (playingTrackId === trackId) {
      audioSynthesizer.stop();
      setPlayingTrackId(null);
    } else {
      const track = musicTracks.find(t => t.id === trackId);
      audioSynthesizer.stop();
      audioSynthesizer.start(track?.audioUrl);
      setPlayingTrackId(trackId);
    }
  };

  // New Template Modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplateForm, setNewTemplateForm] = useState<Partial<Template>>({
    code: 'T10',
    nameKh: 'T10_RoyalLotus (មាសប្រណិត ផ្កាឈូករាជវាំង)',
    nameEn: 'T10_Royal Lotus & Golden Arch',
    style: 'traditional-gold',
    badge: 'ម៉ូតថ្មី',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    primaryColor: '#D4AF37',
    accentColor: '#8C6D1F',
    bgGradient: 'from-[#FCF8EE] via-[#FDFCFB] to-[#F5EBD0]',
    fontFamily: 'Moul',
    descriptionKh: 'រចនាប័ទ្មបែបបុរាណរំលេចដោយក្បាច់ផ្កាឈូកទិព្វ និងរំលេចពណ៌មាសប្រណិត។',
    descriptionEn: 'Regal sacred lotus embellishments with warm gold royal highlights.',
    musicTrackTitle: 'ភ្លេងការខ្មែរ - សិរីមង្គល',
    tags: ['ប្រណិត', 'ផ្កាឈូក', 'មាស']
  });

  // New Couple Modal state
  const [isCoupleModalOpen, setIsCoupleModalOpen] = useState(false);
  const [newCoupleForm, setNewCoupleForm] = useState({
    manageUsername: '',
    managePassword: '',
    groomNameKh: 'ចាន់ សុភ័ក្ត្រ',
    groomNameEn: 'Chan Sopheak',
    brideNameKh: 'ស៊ុន ស្រីនីត',
    brideNameEn: 'Sun Sreynit',
    groomFatherKh: 'លោក ចាន់ វណ្ណា',
    groomMotherKh: 'លោកស្រី កែវ ផល្លា',
    brideFatherKh: 'លោក ស៊ុន គង់',
    brideMotherKh: 'លោកស្រី ម៉ៅ សុផល',
    weddingDate: '2026-12-25',
    weddingTimeKh: 'វេលាម៉ោង ៧:០០ ព្រឹក ដល់ ១០:០០ យប់',
    venueNameKh: 'សណ្ឋាគារ ហ្គាឌិន ស៊ីធី (Garden City Ballroom)',
    venueAddressKh: 'ផ្លូវជាតិ ៦A រាជធានីភ្នំពេញ',
    venueMapUrl: 'https://maps.google.com/?q=Garden+City+Hotel+Phnom+Penh',
    venueMapImage: '',
    templateId: templates[0]?.id || 'tpl_gold_01',
    packageType: 'VIP Gold' as const
  });

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...newTemplateForm } as Template : t));
    } else {
      const newTpl: Template = {
        ...newTemplateForm as Template,
        id: `tpl_${Date.now()}`,
        usageCount: 0,
        tags: typeof newTemplateForm.tags === 'string' ? (newTemplateForm.tags as string).split(',').map((s: string) => s.trim()) : (newTemplateForm.tags || ['ថ្មី'])
      };
      setTemplates(prev => [newTpl, ...prev]);
    }
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleCreateCouple = (e: React.FormEvent) => {
    e.preventDefault();
    const groomPart = (newCoupleForm.groomNameEn || 'groom').toLowerCase().replace(/\s+/g, '-');
    const bridePart = (newCoupleForm.brideNameEn || 'bride').toLowerCase().replace(/\s+/g, '-');
    const slug = `${groomPart}-${bridePart}`;
    const newCouple: CoupleEvent = {
      id: `couple_${Date.now()}`,
      slug: slug || `couple-${Date.now()}`,
      manageUsername: newCoupleForm.manageUsername,
      managePassword: newCoupleForm.managePassword,
      groomNameKh: newCoupleForm.groomNameKh,
      groomNameEn: newCoupleForm.groomNameEn,
      brideNameKh: newCoupleForm.brideNameKh,
      brideNameEn: newCoupleForm.brideNameEn,
      groomNickKh: newCoupleForm.groomNameKh.split(' ').pop(),
      brideNickKh: newCoupleForm.brideNameKh.split(' ').pop(),
      groomFatherKh: newCoupleForm.groomFatherKh,
      groomMotherKh: newCoupleForm.groomMotherKh,
      brideFatherKh: newCoupleForm.brideFatherKh,
      brideMotherKh: newCoupleForm.brideMotherKh,
      weddingDate: newCoupleForm.weddingDate,
      weddingTimeKh: newCoupleForm.weddingTimeKh,
      weddingTimeEn: 'From 7:00 AM to 10:00 PM',
      auspiciousTextKh: 'ថ្ងៃសិរីសួស្តី ជ័យមង្គល វិបុលសុខ មហាប្រសើរ',
      venueNameKh: newCoupleForm.venueNameKh,
      venueNameEn: 'Garden City Hotel Ballroom',
      venueAddressKh: newCoupleForm.venueAddressKh,
      venueAddressEn: 'National Road 6A, Phnom Penh',
      venueMapUrl: newCoupleForm.venueMapUrl || 'https://maps.google.com/?q=Garden+City+Hotel+Phnom+Penh',
      venueMapImage: newCoupleForm.venueMapImage || '',
      templateId: newCoupleForm.templateId,
      customTheme: {
        primaryColor: '#D4AF37',
        accentColor: '#8C6D1F',
        enablePetals: true,
        enableMusic: true,
        musicTrack: 'Khmer Classical Chimes',
        envelopeStyle: 'classic-gold'
      },
      coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      galleryPhotos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'
      ],
      loveStoryKh: '«ក្ដីស្រលាញ់ដែលចាប់ផ្ដើមពីការយល់ចិត្ត និងការផ្ដល់តម្លៃឱ្យគ្នាទៅវិញទៅមក»',
      weddingProgramDay1TitleKh: 'កម្មវិធីថ្ងៃទី១ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៤',
      weddingProgramDay2TitleKh: 'កម្មវិធីថ្ងៃទី២ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៤',
      agendas: DEFAULT_WEDDING_AGENDAS,
      bankAccounts: [
        {
          id: 'ba_def',
          bankName: 'ABA Bank (KHQR)',
          accountName: `${newCoupleForm.groomNameEn.toUpperCase()} & ${newCoupleForm.brideNameEn.toUpperCase()}`,
          accountNumber: '001 999 888',
          qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ABA_NEW_COUPLE_001999888',
          currency: 'USD'
        }
      ],
      guests: [
        {
          id: `gst_${Date.now()}_1`,
          code: 'vip-01',
          titleKh: 'ឯកឧត្តម',
          titleEn: 'H.E.',
          fullNameKh: 'ស៊្រុន សុភារម្យ',
          fullNameEn: 'Srun Sophearom',
          side: 'groom',
          category: 'VIP',
          paxExpected: 2,
          rsvpStatus: 'attending',
          attendeesCount: 2,
          wishMessage: 'សូមជូនពរក្មួយទាំងពីរជួបតែសុភមង្គល!'
        }
      ],
      wishes: [
        {
          id: `wsh_${Date.now()}`,
          guestName: 'ឯកឧត្តម ស៊្រុន សុភារម្យ',
          message: 'សូមជូនពរក្មួយទាំងពីរជួបតែសុភមង្គល!',
          date: '២២ តុលា ២០២៦',
          attendees: 2,
          isAttending: true,
          side: 'groom'
        }
      ],
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
      packageType: newCoupleForm.packageType
    };

    setCouples(prev => [newCouple, ...prev]);
    setIsCoupleModalOpen(false);
    onSelectCouple(newCouple.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Render Separate Pages Based on activeSection */}
      {activeSection === 'overview' && (
        <AdminOverviewPage
          templates={templates}
          couples={couples}
          lang={lang}
          onNavigateToTemplates={() => {
            // Trigger hash or section change if needed, or parent can handle
            window.location.hash = '#admin-templates';
          }}
          onNavigateToCouples={() => {
            window.location.hash = '#admin-couples';
          }}
          onOpenNewTemplate={() => {
            setEditingTemplate(null);
            setIsTemplateModalOpen(true);
          }}
          onOpenNewCouple={() => setIsCoupleModalOpen(true)}
          onSelectCouple={onSelectCouple}
          onPreviewCouple={onPreviewCouple}
        />
      )}

      {activeSection === 'templates' && (
        <AdminTemplatesPage
          templates={templates}
          setTemplates={setTemplates}
          couples={couples}
          setCouples={setCouples}
          lang={lang}
          onOpenNewTemplate={() => {
            setEditingTemplate(null);
            setIsTemplateModalOpen(true);
          }}
          onEditTemplate={(tpl) => {
            setEditingTemplate(tpl);
            setNewTemplateForm(tpl);
            setIsTemplateModalOpen(true);
          }}
          onPreviewCouple={onPreviewCouple}
        />
      )}

      {activeSection === 'couples' && (
        <AdminCouplesPage
          couples={couples}
          setCouples={setCouples}
          templates={templates}
          musicTracks={musicTracks}
          lang={lang}
          onOpenNewCouple={() => setIsCoupleModalOpen(true)}
          onSelectCouple={onSelectCouple}
          onPreviewCouple={onPreviewCouple}
        />
      )}

      {/* ADMIN FOOTER SETTINGS SECTION */}
      {activeSection === 'footer' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                <span className="w-2.5 h-6 bg-[#D4AF37] rounded-full"></span>
                {lang === 'km' ? 'កំណត់ព័ត៌មាន Footer & Promo ទូទៅ (Admin Footer Settings)' : 'Global Footer & Promo Settings'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'km' 
                  ? 'កំណត់ឡូហ្គោរោងពុម្ព អត្ថបទប្រមូលសិន និងលេខទំនាក់ទំនងសម្រាប់បង្ហាញនៅផ្នែកខាងក្រោមនៃសំបុត្រទាំងអស់' 
                  : 'Configure printing logo, promotional text, and contacts shown at the bottom of invitations'}
              </p>
            </div>

            {couples[0] && (
              <button
                onClick={() => onPreviewCouple(couples[0].id)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white text-xs font-normal rounded-xl shadow-xs hover:brightness-110 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
              >
                <Eye className="w-4 h-4" />
                <span>{lang === 'km' ? 'មើលលទ្ធផលសំបុត្រ' : 'Preview Sample Invitation'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Controls Column */}
            <div className="space-y-6">
              
              {/* Logo & Promo Text Block */}
              <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 font-khmer-title flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    {lang === 'km' ? 'ឡូហ្គោ និងអត្ថបទប្រមូលសិន (Admin Promo Footer)' : 'Admin Logo & Promo Footer'}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={couples[0]?.adminPromo?.enabled ?? true}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        setCouples(prev => prev.map(c => ({
                          ...c,
                          adminPromo: {
                            ...(c.adminPromo || { textKh: '' }),
                            enabled,
                            textKh: c.adminPromo?.textKh || 'រៀបចំដោយ ពន្លឺ-បោះពុម្ភ / ទំនាក់ទំនង៖ 097 370 7998'
                          }
                        })));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  {/* Upload Image File / URL */}
                  <div>
                    <label className="block text-xs font-normal text-gray-700 mb-1.5">
                      {lang === 'km' ? 'រូបភាពឡូហ្គោរោងពុម្ព (Upload រូបភាព ឬបញ្ចូល URL)' : 'Logo Image (Upload File or URL)'}
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <label className="cursor-pointer px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors shrink-0 shadow-2xs">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>{lang === 'km' ? 'ជ្រើសរើសរូបភាពឡូហ្គោ' : 'Upload Logo File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const imgData = reader.result as string;
                                setCouples(prev => prev.map(c => ({
                                  ...c,
                                  adminPromo: {
                                    ...(c.adminPromo || { enabled: true, textKh: '' }),
                                    imageUrl: imgData
                                  }
                                })));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        value={couples[0]?.adminPromo?.imageUrl || ''}
                        onChange={(e) => {
                          const url = e.target.value;
                          setCouples(prev => prev.map(c => ({
                            ...c,
                            adminPromo: {
                              ...(c.adminPromo || { enabled: true, textKh: '' }),
                              imageUrl: url
                            }
                          })));
                        }}
                        placeholder="https://... ឬ Upload រូបភាព"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    {/* Logo Preview */}
                    {couples[0]?.adminPromo?.imageUrl && (
                      <div className="mt-3 p-3 bg-gray-900/90 border border-gray-800 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-[10px] text-gray-400 font-mono">PREVIEW:</span>
                          <img src={couples[0].adminPromo.imageUrl} alt="Logo Preview" className="h-9 max-w-[180px] object-contain" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCouples(prev => prev.map(c => ({
                              ...c,
                              adminPromo: {
                                ...(c.adminPromo || { enabled: true, textKh: '' }),
                                imageUrl: ''
                              }
                            })));
                          }}
                          className="text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-2.5 py-1 rounded-lg border border-red-800/40 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> លុប
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Promo Text */}
                  <div>
                    <label className="block text-xs font-normal text-gray-700 mb-1">
                      {lang === 'km' ? 'អត្ថបទប្រមូលសិន ឬអាសយដ្ឋាន/លេខទូរស័ព្ទ' : 'Promo / Address Text'}
                    </label>
                    <textarea
                      rows={3}
                      value={couples[0]?.adminPromo?.textKh || ''}
                      onChange={(e) => {
                        const text = e.target.value;
                        setCouples(prev => prev.map(c => ({
                          ...c,
                          adminPromo: {
                            ...(c.adminPromo || { enabled: true }),
                            textKh: text
                          }
                        })));
                      }}
                      placeholder="រៀបចំដោយ ពន្លឺ-បោះពុម្ភ / ទំនាក់ទំនង៖ 097 370 7998"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Contacts Block */}
              <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-medium text-gray-900 font-khmer-title flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  {lang === 'km' ? 'ប៊ូតុងទំនាក់ទំនងរហ័ស (Social Contacts)' : 'Quick Social Contacts'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-normal text-gray-700 mb-1">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook URL</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={couples[0]?.contactFacebook || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCouples(prev => prev.map(c => ({ ...c, contactFacebook: val })));
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="https://www.facebook.com/..."
                      />
                      <Facebook className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-normal text-gray-700 mb-1">
                      <MessageCircle className="w-4 h-4 text-sky-500" />
                      <span>Telegram URL / Username</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={couples[0]?.contactTelegram || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCouples(prev => prev.map(c => ({ ...c, contactTelegram: val })));
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="https://t.me/..."
                      />
                      <MessageCircle className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-normal text-gray-700 mb-1">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Phone Number</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={couples[0]?.contactPhone || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCouples(prev => prev.map(c => ({ ...c, contactPhone: val })));
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="097 370 7998"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-normal text-gray-700 mb-1">
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'km' ? 'អ៊ីមែល Admin (ភ្ជាប់ជាមួយទិន្នន័យ)' : 'Authorized Admin Email'}</span>
                    </label>
                    <div className="flex items-center justify-between gap-2 p-2.5 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs">
                      <span className="font-mono font-semibold text-gray-900 truncate">{AUTHORIZED_ADMIN_EMAIL}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-100 text-emerald-800 font-sans font-medium flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {lang === 'km' ? 'ភ្ជាប់រួច' : 'Connected'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {lang === 'km' ? 'ទិន្នន័យទាំងអស់នៃផ្ទាំង Admin ត្រូវបានការពារ និងភ្ជាប់ជាមួយអ៊ីមែលនេះតែមួយគត់។' : 'All admin operations are strictly authorized for this email address only.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Live Preview Column */}
            <div className="space-y-6">
              <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 font-khmer-title flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    {lang === 'km' ? 'ការបង្ហាញលទ្ធផល Footer ជាក់ស្ដែង (Live Footer Preview)' : 'Live Footer Preview'}
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Real-time
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  {lang === 'km' ? 'នេះជាទម្រង់ Footer ដូចដែលភ្ញៀវនឹងឃើញនៅលើសំបុត្រអញ្ជើញឌីជីថល៖' : 'This is how the footer appears to guests on the live e-invitation:'}
                </p>

                {/* Live Mock Frame */}
                <div className="bg-[#121212] rounded-3xl p-4 border border-gray-800 shadow-2xl overflow-hidden">
                  <div className="bg-black/85 backdrop-blur-md border-t border-[#D4AF37]/50 p-5 rounded-2xl text-center space-y-3">
                    
                    {/* Logo */}
                    {couples[0]?.adminPromo?.enabled && couples[0]?.adminPromo?.imageUrl && (
                      <div className="flex items-center justify-center pt-1 pb-1">
                        <img 
                          src={couples[0].adminPromo.imageUrl} 
                          alt="Logo Preview" 
                          className="h-12 max-w-[260px] object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" 
                        />
                      </div>
                    )}

                    {/* Promo Text */}
                    {couples[0]?.adminPromo?.enabled && couples[0]?.adminPromo?.textKh && (
                      <div className="text-[12px] font-battambang text-[#D4AF37]/95 whitespace-pre-line leading-relaxed">
                        {couples[0].adminPromo.textKh}
                      </div>
                    )}

                    {/* Contact Icons */}
                    {(couples[0]?.contactFacebook || couples[0]?.contactTelegram || couples[0]?.contactPhone) && (
                      <div className="flex items-center justify-center gap-2.5 pt-1">
                        {couples[0]?.contactPhone && (
                          <div title={`Phone: ${couples[0].contactPhone}`} className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-black/40 text-[#D4AF37] flex items-center justify-center">
                            <Phone className="w-4 h-4 text-emerald-400" />
                          </div>
                        )}
                        {couples[0]?.contactTelegram && (
                          <div title="Telegram" className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-black/40 text-[#D4AF37] flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-sky-400" />
                          </div>
                        )}
                        {couples[0]?.contactFacebook && (
                          <div title="Facebook" className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-black/40 text-[#D4AF37] flex items-center justify-center">
                            <Facebook className="w-4 h-4 text-blue-400" />
                          </div>
                        )}
                      </div>
                    )}

                    {(!couples[0]?.adminPromo?.enabled && !couples[0]?.contactFacebook && !couples[0]?.contactTelegram && !couples[0]?.contactPhone) && (
                      <div className="text-xs text-gray-500 italic py-4">
                        (គ្មានព័ត៌មាន Footer ឬទំនាក់ទំនង)
                      </div>
                    )}

                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs text-amber-900 space-y-1">
                  <p className="font-medium">💡 ចំណាំ៖</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    ព័ត៌មាន Footer និងឡូហ្គោដែលកំណត់នៅទីនេះ នឹងត្រូវបានអាប់ដេតជាសកល និងលេចបង្ហាញនៅផ្នែកខាងក្រោមនៃសំបុត្រអញ្ជើញទាំងអស់។
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-normal bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'km' ? 'រាល់ការកែប្រែត្រូវបានរក្សាទុកស្វ័យប្រវត្តិ (Auto-Saved)' : 'All changes auto-saved'}</span>
            </div>

            {couples[0] && (
              <button
                onClick={() => onPreviewCouple(couples[0].id)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white text-xs font-normal rounded-xl shadow-sm hover:brightness-110 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>{lang === 'km' ? 'មើលលទ្ធផលសំបុត្រផ្ទាល់' : 'Preview Live E-Invitation'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ADMIN MUSIC TRACKS MANAGEMENT SECTION */}
      {activeSection === 'music' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                <Music className="w-5 h-5 text-[#D4AF37]" />
                {lang === 'km' ? 'គ្រប់គ្រងបណ្ណាល័យបទចម្រៀង/ភ្លេងការ (Admin Music Library)' : 'Admin Music Library Management'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'km' 
                  ? 'បង្កើត កែប្រែ ឬលុບບទចម្រៀង/ភ្លេងការ ដើម្បីឱ្យកូនកម្លោះក្រមុំអាចជ្រើសរើសយកទៅប្រើប្រាស់ក្នុងសំបុត្រអញ្ជើញឌីជីថល' 
                  : 'Manage wedding background music tracks for couples to choose for their e-invitations'}
              </p>
            </div>

            <button
              onClick={handleOpenAddMusicModal}
              className="px-4 py-2.5 bg-gradient-to-r from-[#FF1B6B] to-[#D80053] text-white text-xs font-medium rounded-xl shadow-md shadow-pink-900/20 hover:brightness-110 flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'km' ? 'បន្ថែមបទចម្រៀងថ្មី' : 'Add New Track'}</span>
            </button>
          </div>

          {/* Delete Success Toast Banner */}
          {deleteSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{deleteSuccessMsg}</span>
              </div>
              <button onClick={() => setDeleteSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
            </div>
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All Tracks' },
              { id: 'ភ្លេងការបុរាណ', labelKh: 'ភ្លេងការបុរាណ', labelEn: 'Traditional Khmer' },
              { id: 'ភ្លេងការសម័យ', labelKh: 'ភ្លេងការសម័យ', labelEn: 'Modern Wedding' },
              { id: 'ភ្លេងពិណពាទ្យ', labelKh: 'ភ្លេងពិណពាទ្យ', labelEn: 'Pinpeat Symphony' },
              { id: 'Acoustic Pop', labelKh: 'Acoustic / Pop', labelEn: 'Acoustic / Pop' },
            ].map(cat => {
              const count = cat.id === 'all' 
                ? musicTracks.length 
                : musicTracks.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setMusicCategoryFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    musicCategoryFilter === cat.id
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{lang === 'km' ? cat.labelKh : cat.labelEn}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    musicCategoryFilter === cat.id ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Music Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicTracks
              .filter(t => musicCategoryFilter === 'all' || t.category === musicCategoryFilter)
              .map((track) => {
                const isPlaying = playingTrackId === track.id;
                return (
                  <div 
                    key={track.id}
                    className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                      isPlaying ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-md' : 'border-[#EAE6E1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Play/Pause Button */}
                        <button
                          onClick={() => handleTogglePlayMusicTrack(track.id)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                            isPlaying
                              ? 'bg-[#D4AF37] text-white animate-pulse shadow-md'
                              : 'bg-amber-50 text-[#8C6D1F] hover:bg-amber-100 border border-amber-200'
                          }`}
                          title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </button>

                        <div>
                          <h4 className="text-xs font-normal text-gray-900 font-khmer-title line-clamp-1">
                            {track.titleKh}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {track.titleEn}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                              <Tag className="w-3 h-3 text-amber-600" />
                              {track.category}
                            </span>
                            {track.duration && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {track.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {track.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/10 text-amber-700 font-medium border border-amber-300/40 shrink-0">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-600 animate-bounce' : 'text-gray-400'}`} />
                        <span>{isPlaying ? 'កំពុងស្ដាប់...' : 'ចុចដើម្បីស្ដាប់សាកល្បង'}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditMusicModal(track)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Track"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMusicTrack(track)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Track"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {musicTracks.length === 0 && (
            <div className="bg-white border border-[#EAE6E1] rounded-3xl p-12 text-center space-y-3">
              <Music className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">គ្មានបទចម្រៀងនៅក្នុងបណ្ណាល័យនៅឡើយទេ</p>
              <button
                onClick={handleOpenAddMusicModal}
                className="px-4 py-2 bg-[#D4AF37] text-white text-xs font-normal rounded-xl shadow-xs"
              >
                + បន្ថែមបទចម្រៀងដំបូង
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create or Edit Template */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EAE6E1] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-normal text-gray-900 font-khmer-title">
                  {editingTemplate 
                    ? (lang === 'km' ? 'កែសម្រួលគំរូ Templet' : 'Edit Template')
                    : (lang === 'km' ? 'បង្កើតគំរូ Templet ថ្មី' : 'Create New Template')}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'km' ? 'កំណត់រូបរាង ពណ៌ ពុម្ពអក្សរ និងភ្លេងការសម្រាប់គំរូនេះ' : 'Configure theme colors, styles and romantic audio'}
                </p>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-normal text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'កូដគំរូ (Template Code)' : 'Template Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplateForm.code || ''}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, code: e.target.value })}
                    placeholder="e.g. T10"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'រចនាប័ទ្ម (Style Archetype)' : 'Style Archetype'}
                  </label>
                  <select
                    value={newTemplateForm.style || 'traditional-gold'}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, style: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    <option value="traditional-gold">Khmer Royal Gold (បុរាណខ្មែរ មាស)</option>
                    <option value="royal-blush">Royal Blush Arch (ផ្កាកុលាប & សសរ)</option>
                    <option value="nature-green">Botanical Garden (ធម្មជាតិបៃតង)</option>
                    <option value="modern-ivory">Modern Ivory (ទំនើបស៊ីវិល័យ)</option>
                    <option value="royal-violet">Royal Violet (ស្វាយរាជវាំង)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះគំរូ (ជាភាសាខ្មែរ)' : 'Template Name (Khmer)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplateForm.nameKh || ''}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, nameKh: e.target.value })}
                    placeholder="e.g. T10_RoyalLotus (មាសប្រណិត ផ្កាឈូករាជវាំង)"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះគំរូ (English)' : 'Template Name (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplateForm.nameEn || ''}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, nameEn: e.target.value })}
                    placeholder="e.g. T10_Royal Lotus & Golden Arch"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ពណ៌ចម្បង (Primary Color)' : 'Primary Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newTemplateForm.primaryColor || '#D4AF37'}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, primaryColor: e.target.value })}
                      className="w-10 h-9 p-1 border rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newTemplateForm.primaryColor || '#D4AF37'}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, primaryColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ពណ៌បន្ទាប់បន្សំ (Accent Color)' : 'Accent Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newTemplateForm.accentColor || '#8C6D1F'}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, accentColor: e.target.value })}
                      className="w-10 h-9 p-1 border rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newTemplateForm.accentColor || '#8C6D1F'}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, accentColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'តំណភ្ជាប់រូបភាពគំរូ (Cover Image URL)' : 'Cover Image URL'}
                  </label>
                  <input
                    type="url"
                    required
                    value={newTemplateForm.coverImage || ''}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, coverImage: e.target.value, previewImage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ចំណងជើងបទភ្លេង (Audio Track)' : 'Audio Melody Title'}
                  </label>
                  <input
                    type="text"
                    value={newTemplateForm.musicTrackTitle || ''}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, musicTrackTitle: e.target.value })}
                    placeholder="ភ្លេងការខ្មែរ - បង្កក់សិរី"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ការពិពណ៌នា (Description)' : 'Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={newTemplateForm.descriptionKh || ''}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, descriptionKh: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 text-xs font-normal text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-normal bg-[#D4AF37] hover:bg-[#B8962D] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {lang === 'km' ? 'រក្សាទុកគំរូ' : 'Save Template'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal: Create Couple Account */}
      {isCoupleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EAE6E1] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-normal text-gray-900 font-khmer-title">
                  {lang === 'km' ? 'បង្កើតគណនីគូស្វាមីភរិយាថ្មី' : 'Create New Couple Event'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'km' ? 'បញ្ចូលព័ត៌មានកូនកម្លោះក្រមុំ និងជ្រើសរើសម៉ូត Templet' : 'Enter bride & groom names and assign wedding template'}
                </p>
              </div>
              <button 
                onClick={() => setIsCoupleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-normal text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCouple} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Auth Details */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-medium text-amber-900">
                      {lang === 'km' ? 'ព័ត៌មានចូលប្រព័ន្ធរបស់គូស្វាមីភរិយា (Couple Login)' : 'Couple Login Credentials'}
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-700 mb-1">
                      {lang === 'km' ? 'ឈ្មោះអ្នកប្រើប្រាស់ (Username)' : 'Username'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newCoupleForm.manageUsername}
                      onChange={(e) => setNewCoupleForm({ ...newCoupleForm, manageUsername: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-700 mb-1">
                      {lang === 'km' ? 'លេខកូដសម្ងាត់ (Password)' : 'Password'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newCoupleForm.managePassword}
                      onChange={(e) => setNewCoupleForm({ ...newCoupleForm, managePassword: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Groom Name */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះកូនកម្លោះ (ជាភាសាខ្មែរ)' : 'Groom Name (Khmer)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupleForm.groomNameKh}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, groomNameKh: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះកូនកម្លោះ (English)' : 'Groom Name (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupleForm.groomNameEn}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, groomNameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Bride Name */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះកូនក្រមុំ (ជាភាសាខ្មែរ)' : 'Bride Name (Khmer)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupleForm.brideNameKh}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, brideNameKh: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះកូនក្រមុំ (English)' : 'Bride Name (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupleForm.brideNameEn}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, brideNameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Wedding Date */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'កាលបរិច្ឆេទមង្គលការ' : 'Wedding Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newCoupleForm.weddingDate}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, weddingDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ជ្រើសរើសម៉ូត Templet' : 'Select Template'}
                  </label>
                  <select
                    value={newCoupleForm.templateId}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, templateId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.code} - {t.nameKh.split('(')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Venue Name & Address */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ទីតាំងរៀបចំពិធី (Venue Name)' : 'Venue Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupleForm.venueNameKh}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, venueNameKh: e.target.value })}
                    placeholder="e.g. មណ្ឌលសន្និបាតកោះពេជ្រ"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'អាសយដ្ឋានទីតាំង (Address)' : 'Venue Address'}
                  </label>
                  <input
                    type="text"
                    value={newCoupleForm.venueAddressKh}
                    onChange={(e) => setNewCoupleForm({ ...newCoupleForm, venueAddressKh: e.target.value })}
                    placeholder="e.g. សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Google Maps Link & Map Image */}
                <div className="sm:col-span-2 space-y-3 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {lang === 'km' ? 'ផែនទីទីតាំងកម្មវិធី (Google Maps & Map Image)' : 'Venue Map Details'}
                    </span>
                  </div>

                  {/* Map Link */}
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">
                      {lang === 'km' ? 'តំណភ្ជាប់ Google Maps URL (Link Map)' : 'Google Maps URL'}
                    </label>
                    <input
                      type="url"
                      value={newCoupleForm.venueMapUrl}
                      onChange={(e) => setNewCoupleForm({ ...newCoupleForm, venueMapUrl: e.target.value })}
                      placeholder="https://maps.app.goo.gl/... ឬ https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Map Image Upload & URL */}
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">
                      {lang === 'km' ? 'រូបភាពផែនទីគូរដៃ ឬ Screenshot (Map Image)' : 'Map Image (Upload or URL)'}
                    </label>
                    <div className="flex items-center gap-3">
                      {newCoupleForm.venueMapImage ? (
                        <div className="relative group shrink-0">
                          <img
                            src={newCoupleForm.venueMapImage}
                            alt="Map preview"
                            className="w-14 h-14 rounded-xl object-cover border border-amber-300 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setNewCoupleForm({ ...newCoupleForm, venueMapImage: '' })}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer px-3 py-2 bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{lang === 'km' ? 'Upload រូបផែនទី' : 'Upload Map'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setNewCoupleForm(prev => ({ ...prev, venueMapImage: reader.result as string }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      )}
                      <input
                        type="url"
                        value={newCoupleForm.venueMapImage}
                        onChange={(e) => setNewCoupleForm({ ...newCoupleForm, venueMapImage: e.target.value })}
                        placeholder={lang === 'km' ? 'ឬ បញ្ចូលតំណភ្ជាប់ URL រូបភាព...' : 'Or enter image URL...'}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Package Type */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'កញ្ចប់សេវាកម្ម (Package)' : 'Service Package'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['VIP Gold', 'Diamond Pro', 'Standard'].map(pkg => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => setNewCoupleForm({ ...newCoupleForm, packageType: pkg as any })}
                        className={`p-3 rounded-xl border text-xs font-normal text-center transition-all cursor-pointer ${
                          newCoupleForm.packageType === pkg
                            ? 'border-[#D4AF37] bg-amber-50 text-amber-900 shadow-2xs'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCoupleModalOpen(false)}
                  className="px-4 py-2 text-xs font-normal text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-normal bg-[#D4AF37] hover:bg-[#B8962D] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {lang === 'km' ? 'បង្កើតគណនី និងចូលកែប្រែ' : 'Create & Open Editor'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal: Create or Edit Music Track */}
      {isMusicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EAE6E1] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-[#D4AF37] flex items-center justify-center border border-amber-200">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-normal text-gray-900 font-khmer-title">
                    {editingTrack 
                      ? (lang === 'km' ? 'កែប្រែព័ត៌មានបទចម្រៀង' : 'Edit Music Track')
                      : (lang === 'km' ? 'បន្ថែមបទចម្រៀង/ភ្លេងការថ្មី' : 'Add New Music Track')}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {lang === 'km' ? 'បញ្ចូលឈ្មោះ និងប្រភេទបទចម្រៀងសម្រាប់បណ្ណាល័យ' : 'Fill in track details for the music library'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsMusicModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveMusicTrack(); }} className="space-y-4">
              {/* Title Khmer */}
              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  {lang === 'km' ? 'ចំណងជើងបទចម្រៀង (ភាសាខ្មែរ)' : 'Track Title (Khmer)'} *
                </label>
                <input
                  type="text"
                  required
                  value={musicForm.titleKh || ''}
                  onChange={(e) => setMusicForm({ ...musicForm, titleKh: e.target.value })}
                  placeholder="ឧ. ភ្លេងការខ្មែរ - ផ្កាស្លា"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Title English */}
              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  {lang === 'km' ? 'ចំណងជើងបទចម្រៀង (ភាសាអង់គ្លេស)' : 'Track Title (English)'}
                </label>
                <input
                  type="text"
                  value={musicForm.titleEn || ''}
                  onChange={(e) => setMusicForm({ ...musicForm, titleEn: e.target.value })}
                  placeholder="e.g. Khmer Classical Phka Sla"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'ប្រភេទបទចម្រៀង' : 'Category'}
                  </label>
                  <select
                    value={musicForm.category || 'ភ្លេងការបុរាណ'}
                    onChange={(e) => setMusicForm({ ...musicForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-white"
                  >
                    <option value="ភ្លេងការបុរាណ">ភ្លេងការបុរាណ (Traditional)</option>
                    <option value="ភ្លេងការសម័យ">ភ្លេងការសម័យ (Modern)</option>
                    <option value="ភ្លេងពិណពាទ្យ">ភ្លេងពិណពាទ្យ (Pinpeat)</option>
                    <option value="Acoustic Pop">Acoustic / Pop</option>
                    <option value="ផ្សេងៗ">ផ្សេងៗ (Other)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-normal text-gray-700 mb-1">
                    {lang === 'km' ? 'រយៈពេលបទ (Duration)' : 'Duration'}
                  </label>
                  <input
                    type="text"
                    value={musicForm.duration || ''}
                    onChange={(e) => setMusicForm({ ...musicForm, duration: e.target.value })}
                    placeholder="ឧ. 3:45"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Upload Audio File / URL */}
              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  {lang === 'km' ? 'ឯកសារចម្រៀង MP3 (Upload ឬបញ្ចូល Dropbox / Direct URL)' : 'Audio File (Upload, Dropbox Link, or Direct URL)'}
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>Upload MP3</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setMusicForm({ ...musicForm, audioUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <input
                    type="url"
                    value={musicForm.audioUrl || ''}
                    onChange={(e) => setMusicForm({ ...musicForm, audioUrl: e.target.value })}
                    placeholder="https://www.dropbox.com/.../song.mp3?dl=0"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  {musicForm.audioUrl && (
                    <button
                      type="button"
                      onClick={() => setMusicForm({ ...musicForm, audioUrl: '' })}
                      className="px-2.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-medium shrink-0 transition-colors"
                      title="Clear Audio Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-amber-800 bg-amber-50/80 p-2 rounded-lg mt-1.5 border border-amber-200/60 flex items-center gap-1">
                  💡 {lang === 'km' ? 'គាំទ្រ Dropbox Link (ដូចជា dl=0), Google Drive ឬ MP3 Direct Links។ ប្រព័ន្ធនឹងបំប្លែងទៅជា Stream ស្វ័យប្រវត្តិ!' : 'Supports Dropbox share links (with dl=0), Google Drive, or MP3 URLs. Automatically streamable!'}
                </p>
              </div>

              {/* Set Popular checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopularTrack"
                  checked={musicForm.isPopular || false}
                  onChange={(e) => setMusicForm({ ...musicForm, isPopular: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                />
                <label htmlFor="isPopularTrack" className="text-xs text-gray-700 cursor-pointer">
                  {lang === 'km' ? 'កំណត់ជាបទពេញនិយម (Set as Popular Track)' : 'Mark as Popular Track'}
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                {editingTrack ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteMusicTrack(editingTrack)}
                    className="px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'លុບບទចម្រៀងនេះ' : 'Delete Track'}</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMusicModalOpen(false)}
                    className="px-4 py-2 text-xs font-normal text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-normal bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white rounded-xl shadow-xs"
                  >
                    {lang === 'km' ? 'រក្សាទុកបទចម្រៀង' : 'Save Music Track'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal: Delete Music Track Confirmation */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-red-100 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-gray-900 font-khmer-title">
                  {lang === 'km' ? 'បញ្ជាក់ការលុບບទចម្រៀង' : 'Confirm Delete Track'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'km' ? 'តើអ្នកប្រាកដជាចង់លុບບទចម្រៀងនេះចេញពីបណ្ណាល័យមែនទេ?' : 'Are you sure you want to delete this track from the library?'}
                </p>
              </div>
            </div>

            {/* Track Info Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
              <h4 className="text-xs font-semibold text-gray-900 font-khmer-title">
                {trackToDelete.titleKh}
              </h4>
              {trackToDelete.titleEn && (
                <p className="text-[11px] text-gray-500">{trackToDelete.titleEn}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-white border border-gray-200 text-gray-600">
                  {trackToDelete.category}
                </span>
                {trackToDelete.duration && (
                  <span className="text-[10px] text-gray-400">
                    ⏱️ {trackToDelete.duration}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-red-600 bg-red-50/60 p-3 rounded-xl border border-red-100">
              ⚠️ {lang === 'km' ? 'សម្គាល់៖ ការលុបនេះមិនអាចសើរើឡើងវិញបានទេ!' : 'Note: This action cannot be undone!'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                className="px-4 py-2 text-xs font-normal text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                {lang === 'km' ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTrack}
                className="px-5 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'បាទ/ចាស លុບບទចម្រៀង' : 'Yes, Delete Track'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
