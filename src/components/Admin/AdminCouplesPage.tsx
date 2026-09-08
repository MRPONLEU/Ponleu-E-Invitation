import React, { useState } from 'react';
import { CoupleEvent, Template, Language, AgendaItem, BankAccount, MusicTrack } from '../../types';
import { DEFAULT_WEDDING_AGENDAS, INITIAL_MUSIC_TRACKS } from '../../data/initialData';
import { audioSynthesizer } from '../../utils/audioSynthesizer';
import weddingArtwork368 from '../../assets/images/frome1.jpg';
import weddingArtworkClassic from '../../assets/images/frome.jpg';
import { 
  Users, 
  Plus, 
  Calendar, 
  Check, 
  Copy, 
  Share2, 
  Edit3, 
  ExternalLink, 
  Search, 
  Eye, 
  X, 
  MapPin, 
  Package as PackageIcon, 
  Trash2, 
  Clock, 
  Save,
  RotateCcw,
  Sparkles,
  Sun,
  Scissors,
  Utensils,
  Heart,
  QrCode,
  Upload,
  Image as ImageIcon,
  Music,
  Play,
  Pause,
  Volume2,
  Tag,
  Send,
  Globe,
  Lock,
  KeyRound,
  User,
  EyeOff
} from 'lucide-react';
import { getGuestInvitationUrl, getCouplePortalUrl } from '../../utils/urlHelper';
import { ShareGuideModal } from '../ShareGuideModal';

interface AdminCouplesPageProps {
  couples: CoupleEvent[];
  setCouples: React.Dispatch<React.SetStateAction<CoupleEvent[]>>;
  templates: Template[];
  musicTracks?: MusicTrack[];
  lang: Language;
  onOpenNewCouple: () => void;
  onSelectCouple: (coupleId: string) => void;
  onPreviewCouple: (coupleId: string) => void;
}

export const AdminCouplesPage: React.FC<AdminCouplesPageProps> = ({
  couples,
  setCouples,
  templates,
  musicTracks = INITIAL_MUSIC_TRACKS,
  lang,
  onOpenNewCouple,
  onSelectCouple,
  onPreviewCouple,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailCouple, setSelectedDetailCouple] = useState<CoupleEvent | null>(null);
  const [editingCouple, setEditingCouple] = useState<CoupleEvent | null>(null);
  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('');
  const [adminGalleryLightbox, setAdminGalleryLightbox] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [showShareGuide, setShowShareGuide] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Audio Playback Preview Handler
  const handleTogglePlayMusic = (trackId: string, customAudioUrl?: string) => {
    if (playingTrackId === trackId) {
      audioSynthesizer.stop();
      setPlayingTrackId(null);
    } else {
      const track = musicTracks.find(t => t.id === trackId);
      audioSynthesizer.stop();
      audioSynthesizer.start(customAudioUrl || track?.audioUrl);
      setPlayingTrackId(trackId);
    }
  };

  // Gallery handlers for editingCouple
  const handleUploadGalleryPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newUrl = reader.result;
          setEditingCouple(prev => {
            if (!prev) return null;
            const current = prev.galleryPhotos || [];
            return {
              ...prev,
              galleryPhotos: [...current, newUrl]
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddGalleryPhotoByUrl = () => {
    if (!newGalleryPhotoUrl.trim()) return;
    setEditingCouple(prev => {
      if (!prev) return null;
      return {
        ...prev,
        galleryPhotos: [...(prev.galleryPhotos || []), newGalleryPhotoUrl.trim()]
      };
    });
    setNewGalleryPhotoUrl('');
  };

  const handleDeleteGalleryPhoto = (index: number) => {
    setEditingCouple(prev => {
      if (!prev) return null;
      const updated = [...(prev.galleryPhotos || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        galleryPhotos: updated
      };
    });
  };

  const handleMoveGalleryPhoto = (index: number, direction: 'left' | 'right') => {
    setEditingCouple(prev => {
      if (!prev) return null;
      const updated = [...(prev.galleryPhotos || [])];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return {
        ...prev,
        galleryPhotos: updated
      };
    });
  };

  // Agenda handlers for editingCouple
  const handleUpdateEditingAgenda = (id: string, updates: Partial<AgendaItem>) => {
    setEditingCouple(prev => {
      if (!prev) return null;
      return {
        ...prev,
        agendas: (prev.agendas || []).map(a => a.id === id ? { ...a, ...updates } : a)
      };
    });
  };

  const handleAddEditingAgenda = (day: 1 | 2) => {
    const newItem: AgendaItem = {
      id: `ag_${Date.now()}`,
      day,
      time: day === 1 ? '០៣:០០ រសៀល' : '០៨:០០ ព្រឹក',
      titleKh: day === 1 ? 'ពិធីសែនព្រេន ឬពិធីជួបជុំ' : 'ពិធីសិរីមង្គលថ្មី',
      titleEn: 'New Wedding Ceremony',
      icon: day === 1 ? 'clock' : 'heart'
    };
    setEditingCouple(prev => {
      if (!prev) return null;
      return {
        ...prev,
        agendas: [...(prev.agendas || []), newItem]
      };
    });
  };

  const handleDeleteEditingAgenda = (id: string) => {
    setEditingCouple(prev => {
      if (!prev) return null;
      return {
        ...prev,
        agendas: (prev.agendas || []).filter(a => a.id !== id)
      };
    });
  };

  const handleResetEditingAgendas = () => {
    setEditingCouple(prev => {
      if (!prev) return null;
      return {
        ...prev,
        weddingProgramDay1TitleKh: 'កម្មវិធីថ្ងៃទី១ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៤',
        weddingProgramDay2TitleKh: 'កម្មវិធីថ្ងៃទី២ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៤',
        agendas: DEFAULT_WEDDING_AGENDAS
      };
    });
  };

  // Bank handlers for editingCouple
  const handleAddEditingBank = () => {
    if (!editingCouple) return;
    const newBank: BankAccount = {
      id: `ba_${Date.now()}`,
      bankName: 'ABA Bank (KHQR)',
      accountName: `${editingCouple.groomNameKh} & ${editingCouple.brideNameKh}`,
      accountNumber: '000 000 000',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ABA_GIFT_PAY',
      currency: 'USD'
    };
    setEditingCouple(prev => prev ? {
      ...prev,
      bankAccounts: [...(prev.bankAccounts || []), newBank]
    } : null);
  };

  const handleUpdateEditingBank = (id: string, updates: Partial<BankAccount>) => {
    setEditingCouple(prev => prev ? {
      ...prev,
      bankAccounts: (prev.bankAccounts || []).map(b => b.id === id ? { ...b, ...updates } : b)
    } : null);
  };

  const handleDeleteEditingBank = (id: string) => {
    setEditingCouple(prev => prev ? {
      ...prev,
      bankAccounts: (prev.bankAccounts || []).filter(b => b.id !== id)
    } : null);
  };

  const handleUploadKHQR = (bankId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleUpdateEditingBank(bankId, { qrUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCouples = (couples || []).filter(c => {
    const q = (searchQuery || '').toLowerCase();
    return (
      (c.groomNameKh || '').toLowerCase().includes(q) ||
      (c.brideNameKh || '').toLowerCase().includes(q) ||
      (c.groomNameEn || '').toLowerCase().includes(q) ||
      (c.brideNameEn || '').toLowerCase().includes(q) ||
      (c.venueNameKh || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-normal text-gray-900 font-khmer-title">
              {lang === 'km' ? 'គ្រប់គ្រងគណនីគូស្វាមីភរិយា (Couple Accounts)' : 'Couple Client Accounts'}
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'km' 
              ? 'បង្កើតគណនីជូនកូនកម្លោះក្រមុំ កែប្រែទិន្នន័យពិធីមង្គលការ និងគ្រប់គ្រងតំណភ្ជាប់អញ្ជើញភ្ញៀវ'
              : 'Manage couples, assign customized templates, and generate direct invitation portals.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowShareGuide(true)}
            className="bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-200/90 px-3.5 py-2.5 rounded-xl text-xs font-normal shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title={lang === 'km' ? 'របៀបបង្កើត Link សាធារណៈ ជៀសវាង Error 403' : 'Public Link Guide'}
          >
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <span>{lang === 'km' ? 'Link សាធារណៈ (កុំឱ្យ Error 403)' : 'Public Link Guide'}</span>
          </button>

          <button
            onClick={onOpenNewCouple}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white px-4 py-2.5 rounded-xl text-xs font-normal hover:brightness-110 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'km' ? '+ បង្កើតគណនីកូនកម្លោះក្រមុំ' : '+ Create Couple'}</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-[#EAE6E1] rounded-2xl p-4 shadow-xs flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'km' ? 'ស្វែងរកឈ្មោះកូនកម្លោះ ឬកូនក្រមុំ...' : 'Search couple name or venue...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F5F0] border border-[#EAE6E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
        <span className="text-xs text-gray-500 font-normal">
          {filteredCouples.length} {lang === 'km' ? 'គូស្នេហ៍សរុប' : 'couples found'}
        </span>
      </div>

      {/* Mobile View: Clean list with Photo + Name + View Button ONLY */}
      <div className="block md:hidden space-y-3">
        {filteredCouples.map((c) => {
          return (
            <div 
              key={c.id}
              className="bg-white border border-[#EAE6E1] rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-[#D4AF37]/50 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={c.coverPhoto} 
                  alt={c.groomNameKh} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/50 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-normal text-gray-900 text-sm truncate">
                    {c.groomNameKh} & {c.brideNameKh}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans truncate">
                    {c.groomNameEn} & {c.brideNameEn}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetailCouple(c)}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-200/80 rounded-xl text-xs font-normal flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-2xs"
              >
                <Eye className="w-4 h-4 text-[#8C6D1F]" />
                <span>{lang === 'km' ? 'មើល' : 'View'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Full Table */}
      <div className="hidden md:block bg-white border border-[#EAE6E1] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#FAF9F6] text-gray-700 font-medium uppercase tracking-wider text-[10px] border-b border-[#EAE6E1]">
              <tr>
                <th className="py-3.5 px-4 min-w-[180px]">{lang === 'km' ? 'គូស្វាមីភរិយា' : 'Couple'}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{lang === 'km' ? 'កាលបរិច្ឆេទ & ទីតាំង' : 'Date & Venue'}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{lang === 'km' ? 'ម៉ូត Templet' : 'Assigned Template'}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{lang === 'km' ? 'ភ្ញៀវ / RSVP' : 'Guests / RSVPs'}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{lang === 'km' ? 'កញ្ចប់សេវា' : 'Package'}</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">{lang === 'km' ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {filteredCouples.map((c) => {
                const assignedTemplate = templates.find(t => t.id === c.templateId) || templates[0];
                const guestsCount = c.guests?.length || 0;
                const rsvpCount = c.guests ? c.guests.filter(g => g.rsvpStatus === 'attending').length : 0;
                const guestInvitationUrl = getGuestInvitationUrl(c.slug);
                const couplePortalUrl = getCouplePortalUrl(c.slug);

                return (
                  <tr key={c.id} className="hover:bg-[#FCFBF8] transition-colors">
                    
                    {/* Couple Names */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={c.coverPhoto} 
                          alt={c.groomNameKh} 
                          className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50 shrink-0"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm whitespace-nowrap">
                            {c.groomNameKh} & {c.brideNameKh}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-sans whitespace-nowrap">
                            <span>{c.groomNameEn} & {c.brideNameEn}</span>
                            {c.manageUsername && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-mono border border-amber-200">
                                <Lock className="w-2.5 h-2.5 text-[#D4AF37]" />
                                {c.manageUsername}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Wedding Date & Venue */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-gray-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{c.weddingDate}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[180px]">
                        {c.venueNameKh}
                      </div>
                    </td>

                    {/* Template Assigned */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: assignedTemplate.primaryColor }}></span>
                        {assignedTemplate.code} - {assignedTemplate.nameKh.split('(')[0]}
                      </span>
                    </td>

                    {/* Guest Stats */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">
                        {guestsCount} {lang === 'km' ? 'នាក់' : 'invited'}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">
                        {rsvpCount} {lang === 'km' ? 'បានឆ្លើយតប' : 'confirmed'}
                      </div>
                    </td>

                    {/* Package */}
                    <td className="py-4 px-4">
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-medium">
                        {c.packageType}
                      </span>
                    </td>

                    {/* Actions: Copy Couple Portal Link, Manage, Preview Guest */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Copy Portal Link for Couple (Icon Only) */}
                        <button
                          onClick={() => handleCopyLink(couplePortalUrl, `couple_${c.id}`)}
                          title={lang === 'km' ? 'Copy Link ផ្ញើឱ្យកូនកម្លោះក្រមុំកែប្រែ' : 'Copy Couple Management Link'}
                          className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-200/80 cursor-pointer transition-colors"
                        >
                          {copiedId === `couple_${c.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* Copy Guest Invitation Link (Icon Only) */}
                        <button
                          onClick={() => handleCopyLink(guestInvitationUrl, `guest_${c.id}`)}
                          title={lang === 'km' ? 'Copy Link សំបុត្រអញ្ជើញភ្ញៀវ' : 'Copy Guest Invitation Link'}
                          className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
                        >
                          {copiedId === `guest_${c.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Edit Wedding Details */}
                        <button
                          onClick={() => setEditingCouple(c)}
                          className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer transition-colors"
                          title={lang === 'km' ? 'កែប្រែព័ត៌មានលម្អិត' : 'Edit Wedding Details'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Couple Portal / Edit (Icon Only) */}
                        <button
                          onClick={() => onSelectCouple(c.id)}
                          className="p-1.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl cursor-pointer transition-colors"
                          title={lang === 'km' ? 'គ្រប់គ្រង Portal' : 'Manage Portal'}
                        >
                          <Users className="w-3.5 h-3.5" />
                        </button>

                        {/* View Live Guest Card */}
                        <button
                          onClick={() => onPreviewCouple(c.id)}
                          className="p-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#8C6D1F] cursor-pointer"
                          title="Preview e-Invitation"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Viewing Couple Details */}
      {selectedDetailCouple && (() => {
        const c = selectedDetailCouple;
        const assignedTemplate = templates.find(t => t.id === c.templateId) || templates[0];
        const guestsCount = c.guests?.length || 0;
        const rsvpCount = c.guests ? c.guests.filter(g => g.rsvpStatus === 'attending').length : 0;
        const guestInvitationUrl = getGuestInvitationUrl(c.slug);
        const couplePortalUrl = getCouplePortalUrl(c.slug);

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-md w-full my-auto max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#EAE6E1]">
              
              {/* Header with Photo & Close button */}
              <div className="relative p-5 sm:p-6 bg-gradient-to-br from-[#FAF8F3] to-[#F5EBD0] border-b border-[#EAE6E1] text-center shrink-0">
                <button
                  onClick={() => setSelectedDetailCouple(null)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <img 
                  src={c.coverPhoto} 
                  alt={c.groomNameKh} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto mb-2.5"
                />

                <h3 className="text-lg sm:text-xl font-normal text-gray-900 font-khmer-title">
                  {c.groomNameKh} & {c.brideNameKh}
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  {c.groomNameEn} & {c.brideNameEn}
                </p>
              </div>

              {/* Details Body (Scrollable) */}
              <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 overscroll-contain">
                
                {/* Wedding Date & Venue */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE6E1]">
                  <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase text-gray-400 font-medium block">
                      {lang === 'km' ? 'កាលបរិច្ឆេទ & ទីតាំង' : 'Date & Venue'}
                    </span>
                    <p className="font-medium text-gray-900 mt-0.5">{c.weddingDate}</p>
                    <p className="text-gray-600 mt-0.5">{c.venueNameKh}</p>
                    {c.venueAddressKh && <p className="text-gray-500 text-[11px] mt-0.5">{c.venueAddressKh}</p>}
                    
                    {/* Map Link & Image Indicator */}
                    {(c.venueMapUrl || c.venueMapImage) && (
                      <div className="flex items-center gap-2 pt-2 mt-2 border-t border-gray-200/60">
                        {c.venueMapImage && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={c.venueMapImage}
                              alt="Map Thumbnail"
                              className="w-8 h-8 rounded-lg object-cover border border-amber-300 shrink-0"
                            />
                            <span className="text-[10px] text-amber-900 font-medium">{lang === 'km' ? 'មានរូបផែនទី' : 'Map Image'}</span>
                          </div>
                        )}
                        {c.venueMapUrl && (
                          <a
                            href={c.venueMapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#8C6D1F] hover:underline font-medium bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                          >
                            <MapPin className="w-3 h-3 text-[#D4AF37]" />
                            <span>{lang === 'km' ? 'បើក Google Maps' : 'Google Maps'}</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Couple Login Credentials */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lang === 'km' ? 'គណនីចូលគ្រប់គ្រង (Login Account)' : 'Couple Login Account'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDetailCouple(null);
                        setEditingCouple(c);
                      }}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer"
                    >
                      {lang === 'km' ? 'កែប្រែ Password' : 'Edit Password'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="p-2 bg-white rounded-xl border border-amber-200">
                      <span className="text-[10px] text-gray-400 block font-medium">Username</span>
                      <span className="text-xs font-semibold text-gray-900 font-mono select-all">
                        {c.manageUsername || <span className="text-gray-400 font-normal italic font-sans">{lang === 'km' ? 'មិនមាន' : 'None'}</span>}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-amber-200">
                      <span className="text-[10px] text-gray-400 block font-medium">Password</span>
                      <span className="text-xs font-semibold text-amber-900 font-mono select-all">
                        {c.managePassword || <span className="text-gray-400 font-normal italic font-sans">{lang === 'km' ? 'មិនមាន' : 'None'}</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Template & Package */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE6E1]">
                    <span className="text-[10px] uppercase text-gray-400 font-medium block">
                      {lang === 'km' ? 'ម៉ូត Templet' : 'Template'}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: assignedTemplate.primaryColor }}></span>
                      <span className="font-medium text-amber-900 truncate">{assignedTemplate.code}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE6E1]">
                    <span className="text-[10px] uppercase text-gray-400 font-medium block">
                      {lang === 'km' ? 'កញ្ចប់សេវា' : 'Package'}
                    </span>
                    <p className="font-medium text-purple-700 mt-1">{c.packageType}</p>
                  </div>
                </div>

                {/* Guest Stats */}
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-emerald-700 font-medium block">
                      {lang === 'km' ? 'ភ្ញៀវសរុប' : 'Total Guests'}
                    </span>
                    <p className="font-medium text-emerald-900 mt-0.5">{guestsCount} {lang === 'km' ? 'នាក់' : 'invited'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-emerald-700 font-medium block">
                      {lang === 'km' ? 'ឆ្លើយតបចូលរួម' : 'Confirmed RSVP'}
                    </span>
                    <p className="font-medium text-emerald-700 mt-0.5">{rsvpCount} {lang === 'km' ? 'នាក់' : 'confirmed'}</p>
                  </div>
                </div>

                {/* Photo Gallery Preview */}
                <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6E1] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                      <span>{lang === 'km' ? 'កម្រងរូបភាពវិចិត្រសាល' : 'Photo Gallery'}</span>
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                      {(c.galleryPhotos || []).length} {lang === 'km' ? 'រូបភាព' : 'photos'}
                    </span>
                  </div>

                  {(c.galleryPhotos && c.galleryPhotos.length > 0) ? (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {c.galleryPhotos.slice(0, 4).map((photo, pIdx) => (
                        <div 
                          key={pIdx} 
                          onClick={() => setAdminGalleryLightbox(photo)}
                          className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-pointer group hover:border-[#D4AF37] transition-all"
                        >
                          <img src={photo} alt={`Gallery ${pIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          {pIdx === 3 && c.galleryPhotos.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                              +{c.galleryPhotos.length - 3}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 py-2 font-battambang">
                      {lang === 'km' ? 'មិនទាន់មានរូបភាពក្នុងវិចិត្រសាលនៅឡើយទេ។' : 'No gallery photos added yet.'}
                    </p>
                  )}
                </div>

                {/* Music Track Info Badge */}
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const track = musicTracks.find(t => t.titleKh === c.customTheme?.musicTrack || t.titleEn === c.customTheme?.musicTrack);
                        const trackId = track?.id || `couple_${c.id}`;
                        handleTogglePlayMusic(trackId, c.customTheme?.musicUrl || track?.audioUrl);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        playingTrackId === (musicTracks.find(t => t.titleKh === c.customTheme?.musicTrack || t.titleEn === c.customTheme?.musicTrack)?.id || `couple_${c.id}`)
                          ? 'bg-[#D4AF37] text-white animate-pulse'
                          : 'bg-white text-[#8C6D1F] border border-amber-300 hover:bg-amber-100'
                      }`}
                      title="Play/Pause Melody Preview"
                    >
                      {playingTrackId === (musicTracks.find(t => t.titleKh === c.customTheme?.musicTrack || t.titleEn === c.customTheme?.musicTrack)?.id || `couple_${c.id}`) ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase text-amber-800 font-medium block">
                        {lang === 'km' ? 'បទភ្លេងការ' : 'Music Track'}
                      </span>
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {c.customTheme?.musicTrack || 'Nevermind Wedding Melody'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    c.customTheme?.enableMusic !== false 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.customTheme?.enableMusic !== false ? (lang === 'km' ? 'បើកភ្លេង' : 'Auto Play') : (lang === 'km' ? 'បិទភ្លេង' : 'Muted')}
                  </span>
                </div>

                {/* Actions Grid */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setSelectedDetailCouple(null);
                      setEditingCouple(c);
                    }}
                    className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{lang === 'km' ? 'កែប្រែព័ត៌មានលម្អិតមង្គលការ' : 'Edit Wedding Details'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(couplePortalUrl, `modal_couple_${c.id}`)}
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-200 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer"
                  >
                    {copiedId === `modal_couple_${c.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{lang === 'km' ? 'ចម្លង Link ផ្ញើឱ្យកូនកម្លោះក្រមុំ' : 'Copy Couple Portal Link'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(guestInvitationUrl, `modal_guest_${c.id}`)}
                    className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer"
                  >
                    {copiedId === `modal_guest_${c.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{lang === 'km' ? 'ចម្លង Link សំបុត្រអញ្ជើញភ្ញៀវ' : 'Copy Guest Invitation Link'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedDetailCouple(null);
                        onSelectCouple(c.id);
                      }}
                      className="py-2.5 px-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl flex items-center justify-center gap-1.5 font-medium cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'គ្រប់គ្រង Portal' : 'Manage Portal'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDetailCouple(null);
                        onPreviewCouple(c.id);
                      }}
                      className="py-2.5 px-3 bg-[#D4AF37] hover:bg-[#B8962D] text-white rounded-xl flex items-center justify-center gap-1.5 font-medium cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'មើលសំបុត្រ' : 'Preview Live'}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* Modal for Editing Wedding Details */}
      {editingCouple && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAE6E1] p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#D4AF37] rounded-full"></span>
                  {lang === 'km' ? `កែប្រែព័ត៌មានលម្អិត: ${editingCouple.groomNameKh} & ${editingCouple.brideNameKh}` : `Edit Details: ${editingCouple.groomNameEn} & ${editingCouple.brideNameEn}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {lang === 'km' ? 'កែប្រែឈ្មោះ ឪពុកម្តាយ កាលបរិច្ឆេទ ទីតាំង រូបថត កាលវិភាគ និងកុងធនាគារ' : 'Update names, parents, date, venue, photos, agendas and bank accounts'}
                </p>
              </div>
              <button
                onClick={() => setEditingCouple(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Couple Login Credentials (Username & Password) */}
              <div className="p-5 bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-yellow-50/60 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8962D] text-white flex items-center justify-center shadow-xs">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-amber-950 uppercase tracking-wider">
                        {lang === 'km' ? 'ព័ត៌មានចូលប្រព័ន្ធរបស់កូនកម្លោះក្រមុំ (Couple Login Security)' : 'Couple Login Credentials'}
                      </h4>
                      <p className="text-[11px] text-amber-800/80 mt-0.5 font-normal">
                        {lang === 'km' ? 'កំណត់ ឬកែប្រែ Username & Password សម្រាប់ឱ្យកូនកម្លោះក្រមុំចូលគ្រប់គ្រងធៀប' : 'Set or update username and password for couple to manage their invitation'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 font-medium border border-amber-300/60 shrink-0">
                    {editingCouple.manageUsername ? (lang === 'km' ? '🔒 មានសុវត្ថិភាព' : '🔒 Protected') : (lang === 'km' ? '🔓 មិនទាន់មាន Password' : '🔓 No Password')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-amber-950 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lang === 'km' ? 'ឈ្មោះអ្នកប្រើប្រាស់ (Username)' : 'Username'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. sokha2026"
                      value={editingCouple.manageUsername || ''}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, manageUsername: e.target.value } : null)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-amber-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-amber-950 mb-1 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lang === 'km' ? 'លេខកូដសម្ងាត់ (Password)' : 'Password'}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showEditPassword ? 'text' : 'password'}
                        placeholder="e.g. 123456"
                        value={editingCouple.managePassword || ''}
                        onChange={(e) => setEditingCouple(prev => prev ? { ...prev, managePassword: e.target.value } : null)}
                        className="w-full pl-3.5 pr-10 py-2 text-xs bg-white border border-amber-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-gray-900 font-mono font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                        title={showEditPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos & Nicknames */}
              <div className="space-y-4">
                <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#D4AF37] rounded-full"></span>
                  {lang === 'km' ? 'រូបថតមង្គលការ & ឈ្មោះហៅក្រៅ' : 'Wedding Photos & Nicknames'}
                </h4>

                {/* Nicknames Grid */}
                <div className="p-4 bg-[#FAF9F6] border border-gray-200 rounded-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1 font-medium">{lang === 'km' ? 'ឈ្មោះហៅក្រៅកូនកម្លោះ (Groom Nickname)' : 'Groom Nickname'}</label>
                      <input
                        type="text"
                        placeholder="ឧ. វិបុល"
                        value={editingCouple.groomNickKh || ''}
                        onChange={(e) => setEditingCouple(prev => prev ? { ...prev, groomNickKh: e.target.value } : null)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 mb-1 font-medium">{lang === 'km' ? 'ឈ្មោះហៅក្រៅកូនក្រមុំ (Bride Nickname)' : 'Bride Nickname'}</label>
                      <input
                        type="text"
                        placeholder="ឧ. សុជាតា"
                        value={editingCouple.brideNickKh || ''}
                        onChange={(e) => setEditingCouple(prev => prev ? { ...prev, brideNickKh: e.target.value } : null)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2 Primary Wedding Photos: 1. Front Cover (ទំព័រមុខធៀបការ) & 2. Main Cover Photo (រូបថតធំលើធៀបការ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* 1. FRONT COVER PHOTO / ARTWORK (រូបភាពទំព័រមុខធៀបការ) */}
                  <div className="p-4 bg-gradient-to-br from-purple-50/60 via-[#FAF9F6] to-purple-50/30 border-2 border-purple-200/80 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        <h5 className="text-xs font-semibold text-purple-950 uppercase tracking-wider">
                          {lang === 'km' ? '១. រូបភាពទំព័រមុខធៀបការ (Front Cover)' : '1. Front Cover Image'}
                        </h5>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                        {lang === 'km' ? 'ទំព័រមុខ 368' : 'Front Card'}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden border-2 border-purple-300 shadow-sm bg-black/5 relative group">
                        <img 
                          src={editingCouple.cardBackgroundImage || weddingArtwork368} 
                          alt="Front Card" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = weddingArtwork368;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <p className="text-[11px] text-gray-600 leading-tight">
                          {lang === 'km' 
                            ? 'រូបភាពគំនូរ ឬ រូបថតដែលបង្ហាញនៅទំព័រមុខ មុនពេលភ្ញៀវចុច «បើកសំបុត្រ»' 
                            : 'Illustration or photo shown on the front card before opening envelope.'}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="cursor-pointer px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{lang === 'km' ? 'Upload រូបទំព័រមុខ' : 'Upload Front'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: reader.result as string } : null);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          {editingCouple.cardBackgroundImage && (
                            <button
                              type="button"
                              onClick={() => setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: '' } : null)}
                              className="px-2.5 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-red-600 text-xs rounded-xl transition-colors cursor-pointer"
                              title="ប្រើគំនូរលំនាំដើម"
                            >
                              {lang === 'km' ? 'ប្រើ Default' : 'Reset'}
                            </button>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="https://... (Image Link)"
                            value={editingCouple.cardBackgroundImage || ''}
                            onChange={(e) => setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: e.target.value } : null)}
                            className="w-full px-2.5 py-1 text-[11px] bg-white border border-purple-200 rounded-lg outline-hidden focus:border-purple-400 text-gray-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="pt-1.5 border-t border-purple-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 font-medium">{lang === 'km' ? 'គំរូស្រាប់:' : 'Presets:'}</span>
                      <button
                        type="button"
                        onClick={() => setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: weddingArtwork368 } : null)}
                        className="px-2 py-0.5 text-[10px] bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-md transition-colors cursor-pointer"
                      >
                        🌸 គំនូរផ្កាស្វាយ 368
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: weddingArtworkClassic } : null)}
                        className="px-2 py-0.5 text-[10px] bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md transition-colors cursor-pointer"
                      >
                        🏛️ គំនូរបុរាណ
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: editingCouple.coverPhoto } : null)}
                        className="px-2 py-0.5 text-[10px] bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md transition-colors cursor-pointer"
                      >
                        🖼️ ប្រើរូប Cover
                      </button>
                    </div>
                  </div>

                  {/* 2. COVER PHOTO (រូបថតធំលើធៀបការ - Inner Background) */}
                  <div className="p-4 bg-gradient-to-br from-amber-50/60 via-[#FAF9F6] to-amber-50/30 border-2 border-amber-200/80 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        <h5 className="text-xs font-semibold text-amber-950 uppercase tracking-wider">
                          {lang === 'km' ? '២. រូបថតធំលើធៀបការ (Cover Photo)' : '2. Main Cover Photo'}
                        </h5>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                        {lang === 'km' ? 'ផ្ទៃខាងក្នុង' : 'Inner Backdrop'}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden border-2 border-amber-300 shadow-sm bg-black/5 relative group">
                        <img 
                          src={editingCouple.coverPhoto} 
                          alt="Cover Photo" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <p className="text-[11px] text-gray-600 leading-tight">
                          {lang === 'km' 
                            ? 'រូបថតធំផ្ទៃខាងក្រោយ បង្ហាញបន្ទាប់ពីភ្ញៀវចុច «បើកសំបុត្រ» រួច' 
                            : 'Main background photo shown after guest opens the envelope.'}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="cursor-pointer px-3 py-1.5 bg-[#D4AF37] hover:bg-[#B8962D] text-white text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{lang === 'km' ? 'Upload រូប Cover' : 'Upload Cover'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      setEditingCouple(prev => prev ? { ...prev, coverPhoto: reader.result as string } : null);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="https://... (Cover Image URL)"
                            value={editingCouple.coverPhoto}
                            onChange={(e) => setEditingCouple(prev => prev ? { ...prev, coverPhoto: e.target.value } : null)}
                            className="w-full px-2.5 py-1 text-[11px] bg-white border border-amber-200 rounded-lg outline-hidden focus:border-amber-400 text-gray-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick helper */}
                    <div className="pt-1.5 border-t border-amber-100 flex items-center justify-between text-[10px] text-amber-800">
                      <span>✨ {lang === 'km' ? 'អាចជ្រើសពី Gallery ខាងក្រោមបាន' : 'Can also select from Gallery below'}</span>
                    </div>
                  </div>

                </div>

                {/* Photo Gallery Section (វិចិត្រសាលរូបភាព) */}
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200/90 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        <span>{lang === 'km' ? 'កម្រងរូបភាពវិចិត្រសាល (Pre-Wedding Gallery)' : 'Photo Gallery'}</span>
                        <span className="text-[11px] font-medium text-purple-700 bg-purple-100/80 border border-purple-200 px-2 py-0.5 rounded-full">
                          {(editingCouple.galleryPhotos || []).length} {lang === 'km' ? 'រូបភាព' : 'photos'}
                        </span>
                      </h5>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-battambang">
                        {lang === 'km' ? 'បញ្ចូលរូបថតអនុស្សាវរីយ៍ Pre-wedding បង្ហាញលើសំបុត្រអញ្ជើញធៀបការ' : 'Upload Pre-wedding photos displayed on the invitation'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Batch Upload Button */}
                      <label className="cursor-pointer px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'km' ? '+ Upload រូបថតច្រើនសន្លឹក' : '+ Upload Photos'}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadGalleryPhotos(e.target.files)}
                        />
                      </label>

                      {/* Sample photos button if empty */}
                      {(!editingCouple.galleryPhotos || editingCouple.galleryPhotos.length === 0) && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCouple(prev => prev ? {
                              ...prev,
                              galleryPhotos: [
                                'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
                                'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop'
                              ]
                            } : null);
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-200 text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                          <span>{lang === 'km' ? 'ដាក់រូបគំរូ' : 'Sample'}</span>
                        </button>
                      )}

                      {/* Clear All Button */}
                      {(editingCouple.galleryPhotos || []).length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់លុបរូបភាពទាំងអស់ក្នុងវិចិត្រសាលមែនទេ?' : 'Clear all gallery photos?')) {
                              setEditingCouple(prev => prev ? { ...prev, galleryPhotos: [] } : null);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="លុបរូបទាំងអស់"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Slideshow On Open Feature Toggle */}
                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-xs font-semibold text-gray-900 font-khmer-title">
                          {lang === 'km' ? 'ចាក់ Slide Show រូបភាពវិចិត្រសាលពេលបើកធៀប' : 'Auto Slideshow on Open'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-battambang">
                        {lang === 'km' 
                          ? 'បង្ហាញ Slide show រូបភាពពេញអេក្រង់អមភ្លេងការពេលភ្ញៀវចុចបើកសំបុត្រ'
                          : 'Show full-screen animated photo slideshow when guests open the envelope.'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={editingCouple.customTheme?.showSlideshowOnOpen !== false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEditingCouple(prev => prev ? {
                            ...prev,
                            customTheme: {
                              ...prev.customTheme,
                              showSlideshowOnOpen: checked
                            }
                          } : null);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  {/* Add by URL */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200">
                    <ImageIcon className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      placeholder="https://... (Paste Image URL)"
                      value={newGalleryPhotoUrl}
                      onChange={(e) => setNewGalleryPhotoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGalleryPhotoByUrl();
                        }
                      }}
                      className="flex-1 bg-transparent px-2 py-1 text-xs outline-hidden text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryPhotoByUrl}
                      disabled={!newGalleryPhotoUrl.trim()}
                      className="px-3 py-1 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white disabled:text-gray-400 text-xs rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      {lang === 'km' ? '+ បន្ថែមរូប' : '+ Add'}
                    </button>
                  </div>

                  {/* Photos Grid */}
                  {(!editingCouple.galleryPhotos || editingCouple.galleryPhotos.length === 0) ? (
                    <div className="text-center py-6 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-white/50 space-y-1">
                      <ImageIcon className="w-6 h-6 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-battambang">
                        {lang === 'km' ? 'មិនទាន់មានរូបភាពក្នុងវិចិត្រសាលនៅឡើយទេ' : 'No photos in the gallery yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {editingCouple.galleryPhotos.map((photo, index) => (
                        <div 
                          key={index} 
                          className="group relative rounded-xl overflow-hidden border border-gray-200 bg-black/5 aspect-square shadow-xs hover:border-[#D4AF37] transition-all"
                        >
                          <img 
                            src={photo} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Number badge */}
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                            #{index + 1}
                          </div>

                          {/* Actions overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setAdminGalleryLightbox(photo)}
                                className="p-1 bg-white/80 hover:bg-white text-gray-800 rounded text-xs cursor-pointer"
                                title="មើលរូបធំ"
                              >
                                <Eye className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryPhoto(index)}
                                className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs cursor-pointer"
                                title="លុបរូបនេះ"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <div className="grid grid-cols-2 gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCouple(prev => prev ? { ...prev, cardBackgroundImage: photo } : null);
                                  }}
                                  className="py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[8.5px] font-medium flex items-center justify-center cursor-pointer shadow-xs"
                                  title="កំណត់ជារូបភាពទំព័រមុខ"
                                >
                                  <span>{lang === 'km' ? 'មុខ' : 'Front'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCouple(prev => prev ? { ...prev, coverPhoto: photo } : null);
                                  }}
                                  className="py-0.5 bg-[#D4AF37] hover:bg-[#B8962D] text-white rounded text-[8.5px] font-medium flex items-center justify-center cursor-pointer shadow-xs"
                                  title="កំណត់ជារូបថតធំលើធៀបការ"
                                >
                                  <span>{lang === 'km' ? 'Cover' : 'Cover'}</span>
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveGalleryPhoto(index, 'left')}
                                  className="flex-1 py-0.5 bg-white/80 hover:bg-white disabled:opacity-30 text-gray-800 rounded text-[9px] font-medium cursor-pointer"
                                  title="រំកិលទៅមុខ"
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  disabled={index === (editingCouple.galleryPhotos?.length || 1) - 1}
                                  onClick={() => handleMoveGalleryPhoto(index, 'right')}
                                  className="flex-1 py-0.5 bg-white/80 hover:bg-white disabled:opacity-30 text-gray-800 rounded text-[9px] font-medium cursor-pointer"
                                  title="រំកិលទៅក្រោយ"
                                >
                                  ▶
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Music Track Selection (ជ្រើសរើសបទចម្រៀង / ភ្លេងការ) */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                      <Music className="w-4 h-4 text-[#D4AF37]" />
                      <span>{lang === 'km' ? 'ជ្រើសរើសបទចម្រៀង / ភ្លេងការ' : 'Select Background Music Track'}</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {lang === 'km' ? 'ជ្រើសរើសបទភ្លេងការពីបណ្ណាល័យ ឬបញ្ចូល Link អូឌីយ៉ូផ្ទាល់ខ្លួន (Dropbox, Google Drive, MP3)' : 'Select wedding background music track or enter direct MP3 / Dropbox link'}
                    </p>
                  </div>

                  {/* Enable Music Auto-play Toggle */}
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100/80 transition-colors self-start sm:self-auto">
                    <input
                      type="checkbox"
                      checked={editingCouple.customTheme?.enableMusic !== false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingCouple(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            customTheme: {
                              primaryColor: prev.customTheme?.primaryColor || '#D4AF37',
                              accentColor: prev.customTheme?.accentColor || '#8C6D1F',
                              enablePetals: prev.customTheme?.enablePetals ?? true,
                              envelopeStyle: prev.customTheme?.envelopeStyle || 'classic-gold',
                              musicTrack: prev.customTheme?.musicTrack || '',
                              musicUrl: prev.customTheme?.musicUrl || '',
                              fontFamilyKhmer: prev.customTheme?.fontFamilyKhmer,
                              enableMusic: checked
                            }
                          };
                        });
                      }}
                      className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      {lang === 'km' ? 'ចាក់ភ្លេងស្វ័យប្រវត្តិ (Auto-play)' : 'Auto-play Music'}
                    </span>
                  </label>
                </div>

                {/* Current Active Music Track Banner */}
                {(editingCouple.customTheme?.musicTrack || editingCouple.customTheme?.musicUrl) && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
                            {lang === 'km' ? 'បទចម្រៀងដែលបានជ្រើសរើស' : 'Current Active Music'}
                          </span>
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-medium rounded-md">
                            Active
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-900 line-clamp-1">
                          {editingCouple.customTheme.musicTrack || 'Custom MP3 Audio Track'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const track = musicTracks.find(t => t.titleKh === editingCouple.customTheme?.musicTrack || t.titleEn === editingCouple.customTheme?.musicTrack);
                          const trackId = track?.id || 'custom_edit_track';
                          handleTogglePlayMusic(trackId, editingCouple.customTheme?.musicUrl || track?.audioUrl);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          playingTrackId === (musicTracks.find(t => t.titleKh === editingCouple.customTheme?.musicTrack || t.titleEn === editingCouple.customTheme?.musicTrack)?.id || 'custom_edit_track')
                            ? 'bg-[#D4AF37] text-white animate-pulse'
                            : 'bg-white text-[#8C6D1F] border border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        {playingTrackId === (musicTracks.find(t => t.titleKh === editingCouple.customTheme?.musicTrack || t.titleEn === editingCouple.customTheme?.musicTrack)?.id || 'custom_edit_track') ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>{lang === 'km' ? 'ផ្អាកស្ដាប់' : 'Pause'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{lang === 'km' ? 'ស្ដាប់សាកល្បង' : 'Play'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          audioSynthesizer.stop();
                          setPlayingTrackId(null);
                          setEditingCouple(prev => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              customTheme: {
                                primaryColor: prev.customTheme?.primaryColor || '#D4AF37',
                                accentColor: prev.customTheme?.accentColor || '#8C6D1F',
                                enablePetals: prev.customTheme?.enablePetals ?? true,
                                envelopeStyle: prev.customTheme?.envelopeStyle || 'classic-gold',
                                fontFamilyKhmer: prev.customTheme?.fontFamilyKhmer,
                                enableMusic: prev.customTheme?.enableMusic ?? true,
                                musicTrack: '',
                                musicUrl: ''
                              }
                            };
                          });
                        }}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title={lang === 'km' ? 'ដកបទចម្រៀងចេញ' : 'Remove Track'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'km' ? 'ដកចេញ' : 'Clear'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Music Tracks Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                    <span>{lang === 'km' ? 'បញ្ជីបទភ្លេងការក្នុងបណ្ណាល័យ (Admin Music Library)' : 'Music Library Tracks'}</span>
                    <span className="text-[11px] text-gray-400">({musicTracks.length} {lang === 'km' ? 'បទ' : 'tracks'})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto p-1">
                    {musicTracks.map((track) => {
                      const isSelected = editingCouple.customTheme?.musicTrack === track.titleKh || editingCouple.customTheme?.musicTrack === track.titleEn;
                      const isPlaying = playingTrackId === track.id;

                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            setEditingCouple(prev => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                customTheme: {
                                  primaryColor: prev.customTheme?.primaryColor || '#D4AF37',
                                  accentColor: prev.customTheme?.accentColor || '#8C6D1F',
                                  enablePetals: prev.customTheme?.enablePetals ?? true,
                                  envelopeStyle: prev.customTheme?.envelopeStyle || 'classic-gold',
                                  fontFamilyKhmer: prev.customTheme?.fontFamilyKhmer,
                                  enableMusic: true,
                                  musicTrack: track.titleKh,
                                  musicUrl: track.audioUrl || ''
                                }
                              };
                            });
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-amber-50/70 border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-xs'
                              : 'bg-[#FAF9F6] border-gray-200 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5 min-w-0">
                              {/* Mini Play / Pause button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTogglePlayMusic(track.id, track.audioUrl);
                                }}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                  isPlaying
                                    ? 'bg-[#D4AF37] text-white animate-pulse shadow-sm'
                                    : 'bg-white text-[#8C6D1F] border border-amber-200 hover:bg-amber-100'
                                }`}
                                title={isPlaying ? 'Pause' : 'Play Preview'}
                              >
                                {isPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </button>

                              <div className="min-w-0">
                                <h5 className="text-xs font-medium text-gray-900 line-clamp-1">
                                  {track.titleKh}
                                </h5>
                                <p className="text-[10px] text-gray-500 line-clamp-1">
                                  {track.titleEn}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-gray-200/60">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                              {track.category}
                            </span>
                            {track.duration && (
                              <span className="text-gray-400 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {track.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Audio URL / MP3 Link Input */}
                <div className="p-3 bg-[#FAF9F6] border border-gray-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-medium text-gray-700">
                    {lang === 'km' ? 'ឬ បញ្ចូលតំណភ្ជាប់បទចម្រៀងផ្ទាល់ខ្លួន (Custom Audio URL / Dropbox / Drive / MP3)' : 'Or Enter Custom Audio / Dropbox / MP3 URL'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={editingCouple.customTheme?.musicUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setEditingCouple(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            customTheme: {
                              primaryColor: prev.customTheme?.primaryColor || '#D4AF37',
                              accentColor: prev.customTheme?.accentColor || '#8C6D1F',
                              enablePetals: prev.customTheme?.enablePetals ?? true,
                              envelopeStyle: prev.customTheme?.envelopeStyle || 'classic-gold',
                              fontFamilyKhmer: prev.customTheme?.fontFamilyKhmer,
                              enableMusic: true,
                              musicUrl: url,
                              musicTrack: url ? (prev.customTheme?.musicTrack || 'Custom Audio Track') : prev.customTheme?.musicTrack || ''
                            }
                          };
                        });
                      }}
                      placeholder="https://.../Nevermind.mp3 ឬ Dropbox link"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white font-mono"
                    />

                    {editingCouple.customTheme?.musicUrl && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlayMusic('custom_link_preview', editingCouple.customTheme?.musicUrl)}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        {playingTrackId === 'custom_link_preview' ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Test</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#D4AF37] rounded-full"></span>
                  {lang === 'km' ? 'ឈ្មោះកូនកម្លោះ & កូនក្រមុំ' : 'Bride & Groom Names'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Groom Name (Khmer)</label>
                    <input
                      type="text"
                      value={editingCouple.groomNameKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, groomNameKh: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Groom Name (English)</label>
                    <input
                      type="text"
                      value={editingCouple.groomNameEn}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, groomNameEn: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Bride Name (Khmer)</label>
                    <input
                      type="text"
                      value={editingCouple.brideNameKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, brideNameKh: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Bride Name (English)</label>
                    <input
                      type="text"
                      value={editingCouple.brideNameEn}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, brideNameEn: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Parents */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#D4AF37] rounded-full"></span>
                  {lang === 'km' ? 'ឈ្មោះមាតាបិតា' : 'Parents'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#FAF9F6] border border-gray-200 rounded-2xl space-y-2">
                    <span className="text-xs font-normal text-[#8C6D1F]">Groom Parents</span>
                    <input
                      type="text"
                      placeholder="Father Name"
                      value={editingCouple.groomFatherKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, groomFatherKh: e.target.value } : null)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Mother Name"
                      value={editingCouple.groomMotherKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, groomMotherKh: e.target.value } : null)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="p-3 bg-[#FAF9F6] border border-gray-200 rounded-2xl space-y-2">
                    <span className="text-xs font-normal text-pink-700">Bride Parents</span>
                    <input
                      type="text"
                      placeholder="Father Name"
                      value={editingCouple.brideFatherKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, brideFatherKh: e.target.value } : null)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Mother Name"
                      value={editingCouple.brideMotherKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, brideMotherKh: e.target.value } : null)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#D4AF37] rounded-full"></span>
                  {lang === 'km' ? 'កាលបរិច្ឆេទ & ទីតាំង' : 'Date & Venue'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Wedding Date</label>
                    <input
                      type="date"
                      value={editingCouple.weddingDate}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, weddingDate: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Lunar Date Text</label>
                    <input
                      type="text"
                      value={editingCouple.auspiciousTextKh || ''}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, auspiciousTextKh: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={editingCouple.venueNameKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, venueNameKh: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Venue Address</label>
                    <input
                      type="text"
                      value={editingCouple.venueAddressKh}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, venueAddressKh: e.target.value } : null)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Google Maps Link & Map Image */}
                <div className="space-y-4 pt-3 border-t border-gray-100">
                  {/* Map Link */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1 flex items-center justify-between">
                      <span className="font-medium flex items-center gap-1.5 text-gray-900">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {lang === 'km' ? 'តំណភ្ជាប់ Google Maps (Link Map)' : 'Google Maps URL / Link'}
                      </span>
                      {editingCouple.venueMapUrl && (
                        <a
                          href={editingCouple.venueMapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#8C6D1F] hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{lang === 'km' ? 'សាកល្បងបើកមើល Link' : 'Test Map Link'}</span>
                        </a>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://maps.app.goo.gl/... ឬ https://maps.google.com/?q=..."
                        value={editingCouple.venueMapUrl || ''}
                        onChange={(e) => setEditingCouple(prev => prev ? { ...prev, venueMapUrl: e.target.value } : null)}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] text-gray-800 bg-white"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {lang === 'km' ? 'ចម្លងតំណភ្ជាប់ Share ពីកម្មវិធី Google Maps ដើម្បីឱ្យភ្ញៀវចុចទៅដល់ទីតាំងដោយផ្ទាល់' : 'Paste the Google Maps share link so guests can navigate with 1 click.'}
                    </p>
                  </div>

                  {/* Venue Map Image */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-900 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                      <span>{lang === 'km' ? 'រូបភាពផែនទីទីតាំង (Venue Map Image / Screenshot / Drawn Map)' : 'Venue Map Image / Screenshot'}</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#FAF9F6] border border-gray-200 rounded-2xl">
                      {editingCouple.venueMapImage ? (
                        <div className="relative group shrink-0">
                          <img
                            src={editingCouple.venueMapImage}
                            alt="Venue Map"
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border-2 border-amber-300/80 bg-white shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingCouple(prev => prev ? { ...prev, venueMapImage: '' } : null)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors cursor-pointer"
                            title="លុបរូបផែនទី"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-[10px] shrink-0">
                          <MapPin className="w-6 h-6 text-gray-300 mb-1" />
                          <span>{lang === 'km' ? 'គ្មានរូបផែនទី' : 'No Map Image'}</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-2 w-full">
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-0.5">
                            {lang === 'km' ? 'បញ្ចូល URL រូបភាពផែនទី (បើមាន) ៖' : 'Or Paste Map Image URL:'}
                          </label>
                          <input
                            type="url"
                            placeholder="https://.../map.jpg"
                            value={editingCouple.venueMapImage || ''}
                            onChange={(e) => setEditingCouple(prev => prev ? { ...prev, venueMapImage: e.target.value } : null)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37]"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50/60 border border-amber-300/80 text-[#8C6D1F] rounded-xl text-xs font-medium transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{lang === 'km' ? 'Upload រូបភាពផែនទីពីទូរស័ព្ទ/កុំព្យូទ័រ' : 'Upload Map Image File'}</span>
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
                                      setEditingCouple(prev => prev ? { ...prev, venueMapImage: reader.result as string } : null);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {editingCouple.venueMapImage && (
                            <button
                              type="button"
                              onClick={() => setEditingCouple(prev => prev ? { ...prev, venueMapImage: '' } : null)}
                              className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            >
                              {lang === 'km' ? 'លុបរូប' : 'Remove'}
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {lang === 'km' ? 'លោកអ្នកអាច Upload រូបប្លង់ផែនទីគូរផ្ទាល់ (Drawn Map), ផែនទីកាត់ត ឬ Screenshot ផែនទីជាក់ស្ដែង' : 'You can upload hand-drawn maps, designed road guides, or screenshot maps.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wedding Program Agendas (កាលវិភាគកម្មវិធីសិរីមង្គល) */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                      <span className="w-2 h-4 bg-[#D4AF37] rounded-full"></span>
                      <span>{lang === 'km' ? 'កាលវិភាគកម្មវិធីសិរីមង្គលអាពាហ៍ពិពាហ៍' : 'Wedding Program & Agendas'}</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {lang === 'km' ? 'កំណត់ពេលវេលា ឈ្មោះពិធី និងជ្រើសរើសរូបតំណាង Icon សម្រាប់ថ្ងៃទី១ និងថ្ងៃទី២' : 'Configure ceremony timeline, titles and icons for Day 1 and Day 2'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetEditingAgendas}
                    className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ផ្ទុកគំរូកម្មវិធីស្ដង់ដារ' : 'Load Default Agendas'}</span>
                  </button>
                </div>

                {/* Day 1 Section */}
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-medium text-amber-900">{lang === 'km' ? 'កម្មវិធីថ្ងៃទី១' : 'Day 1 Ceremony'}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="ចំណងជើងកម្មវិធីថ្ងៃទី១"
                      value={editingCouple.weddingProgramDay1TitleKh || 'កម្មវិធីថ្ងៃទី១ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៤'}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, weddingProgramDay1TitleKh: e.target.value } : null)}
                      className="w-full sm:w-80 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  {/* Day 1 Items */}
                  <div className="space-y-2">
                    {(editingCouple.agendas || []).filter(a => a.day === 1 || !a.day).map((item) => (
                      <div key={item.id} className="p-2.5 bg-white rounded-xl border border-gray-200 flex flex-wrap sm:flex-nowrap items-center gap-2">
                        <div className="w-28 shrink-0">
                          <input
                            type="text"
                            placeholder="ម៉ោង (e.g. ០២:០០ រសៀល)"
                            value={item.time}
                            onChange={(e) => handleUpdateEditingAgenda(item.id, { time: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-[#FAF9F6] text-[#8C6D1F] font-medium"
                          />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <input
                            type="text"
                            placeholder="ឈ្មោះពិធី (e.g. ពិធីសែនក្រុងពាលី)"
                            value={item.titleKh}
                            onChange={(e) => handleUpdateEditingAgenda(item.id, { titleKh: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div className="w-28 shrink-0">
                          <select
                            value={item.icon || 'clock'}
                            onChange={(e) => handleUpdateEditingAgenda(item.id, { icon: e.target.value as any })}
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-[#FAF9F6] text-gray-700"
                          >
                            <option value="clock">🕒 នាឡិកា</option>
                            <option value="sun">☀️ ព្រឹក/ថ្ងៃ</option>
                            <option value="scissors">✂️ កាត់សក់</option>
                            <option value="utensils">🍽️ អាហារ</option>
                            <option value="heart">❤️ បេះដូង</option>
                            <option value="sparkles">✨ សិរីសួស្តី</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEditingAgenda(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="លុបពិធីនេះ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddEditingAgenda(1)}
                    className="w-full py-2 border border-dashed border-amber-300 hover:bg-amber-50/70 text-[#8C6D1F] rounded-xl text-xs font-normal flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'km' ? '+ បន្ថែមពិធីថ្ងៃទី១' : '+ Add Day 1 Ceremony'}</span>
                  </button>
                </div>

                {/* Day 2 Section */}
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                      <span className="text-xs font-medium text-pink-900">{lang === 'km' ? 'កម្មវិធីថ្ងៃទី២' : 'Day 2 Ceremony'}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="ចំណងជើងកម្មវិធីថ្ងៃទី២"
                      value={editingCouple.weddingProgramDay2TitleKh || 'កម្មវិធីថ្ងៃទី២ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៤'}
                      onChange={(e) => setEditingCouple(prev => prev ? { ...prev, weddingProgramDay2TitleKh: e.target.value } : null)}
                      className="w-full sm:w-80 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  {/* Day 2 Items */}
                  <div className="space-y-2">
                    {(editingCouple.agendas || []).filter(a => a.day === 2).map((item) => (
                      <div key={item.id} className="p-2.5 bg-white rounded-xl border border-gray-200 flex flex-wrap sm:flex-nowrap items-center gap-2">
                        <div className="w-28 shrink-0">
                          <input
                            type="text"
                            placeholder="ម៉ោង (e.g. ០៧:០០ ព្រឹក)"
                            value={item.time}
                            onChange={(e) => handleUpdateEditingAgenda(item.id, { time: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-[#FAF9F6] text-pink-800 font-medium"
                          />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <input
                            type="text"
                            placeholder="ឈ្មោះពិធី (e.g. ពិធីហែជំនូន)"
                            value={item.titleKh}
                            onChange={(e) => handleUpdateEditingAgenda(item.id, { titleKh: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div className="w-28 shrink-0">
                          <select
                            value={item.icon || 'clock'}
                            onChange={(e) => handleUpdateEditingAgenda(item.id, { icon: e.target.value as any })}
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-[#FAF9F6] text-gray-700"
                          >
                            <option value="clock">🕒 នាឡិកា</option>
                            <option value="sun">☀️ ព្រឹក/ថ្ងៃ</option>
                            <option value="scissors">✂️ កាត់សក់</option>
                            <option value="utensils">🍽️ អាហារ</option>
                            <option value="heart">❤️ បេះដូង</option>
                            <option value="sparkles">✨ សិរីសួស្តី</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEditingAgenda(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="លុបពិធីនេះ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddEditingAgenda(2)}
                    className="w-full py-2 border border-dashed border-pink-300 hover:bg-pink-50/70 text-pink-700 rounded-xl text-xs font-normal flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'km' ? '+ បន្ថែមពិធីថ្ងៃទី២' : '+ Add Day 2 Ceremony'}</span>
                  </button>
                </div>
              </div>

              {/* Bank Accounts & KHQR */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-normal text-gray-900 font-khmer-title flex items-center gap-2">
                      <span className="w-2 h-4 bg-[#D4AF37] rounded-full"></span>
                      <span>{lang === 'km' ? 'កុងធនាគារចងដៃ & ABA KHQR' : 'Bank Accounts & Digital Gifts'}</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {lang === 'km' ? 'បញ្ចូលកុងធនាគារសម្រាប់ទទួលចំណងដៃ និង QR Code' : 'Add bank accounts and QR codes for digital gifts'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEditingBank}
                    className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'បន្ថែមកុងធនាគារ' : 'Add Bank'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(editingCouple.bankAccounts || []).map((bank) => (
                    <div key={bank.id} className="p-4 bg-[#FAF9F6] rounded-2xl border border-gray-200 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleDeleteEditingBank(bank.id)}
                        className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="លុបកុងនេះ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          {bank.qrUrl ? (
                            <img src={bank.qrUrl} alt="QR Code" className="w-full h-full object-contain rounded-lg" />
                          ) : (
                            <QrCode className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 text-[11px] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Upload className="w-3 h-3 text-[#D4AF37]" />
                            <span>Upload QR</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleUploadKHQR(bank.id, e)}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-0.5">ឈ្មោះធនាគារ (Bank Name)</label>
                          <input
                            type="text"
                            value={bank.bankName}
                            onChange={(e) => handleUpdateEditingBank(bank.id, { bankName: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                            placeholder="ABA Bank (KHQR)"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-0.5">ឈ្មោះគណនី (Account Name)</label>
                          <input
                            type="text"
                            value={bank.accountName}
                            onChange={(e) => handleUpdateEditingBank(bank.id, { accountName: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                            placeholder="Vireak & Sokha"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-0.5">លេខគណនី (Account Number)</label>
                          <input
                            type="text"
                            value={bank.accountNumber}
                            onChange={(e) => handleUpdateEditingBank(bank.id, { accountNumber: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg font-mono text-[#8C6D1F]"
                            placeholder="000 123 456"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingCouple(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-normal rounded-xl cursor-pointer"
              >
                {lang === 'km' ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setCouples(prev => prev.map(c => c.id === editingCouple.id ? editingCouple : c));
                  setEditingCouple(null);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white text-xs font-normal rounded-xl shadow-sm hover:brightness-110 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{lang === 'km' ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'Save Changes'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox for Gallery Photo in Admin */}
      {adminGalleryLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setAdminGalleryLightbox(null)}
        >
          <button 
            type="button"
            className="absolute top-4 right-4 text-white p-2.5 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
            onClick={() => setAdminGalleryLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={adminGalleryLightbox} 
            alt="Enlarged gallery photo" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
          />
        </div>
      )}

      {/* Share / Public Link Guide Modal */}
      <ShareGuideModal
        isOpen={showShareGuide}
        onClose={() => setShowShareGuide(false)}
        lang={lang}
      />

    </div>
  );
};

