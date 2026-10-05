import React, { useState } from 'react';
import { CoupleEvent, AgendaItem, BankAccount, Language } from '../../types';
import { DEFAULT_WEDDING_AGENDAS } from '../../data/initialData';
import weddingArtwork368 from '../../assets/images/frome1.jpg';
import weddingArtworkClassic from '../../assets/images/frome.jpg';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  QrCode, 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  Sparkles, 
  Sun, 
  Scissors, 
  Utensils, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw,
  Save,
  BookOpen,
  ExternalLink,
  X
} from 'lucide-react';

interface WeddingDetailsEditorProps {
  couple: CoupleEvent;
  updateCouple: (updater: (prev: CoupleEvent) => CoupleEvent) => void;
  lang: Language;
  onPreviewGuest?: () => void;
}

export const WeddingDetailsEditor: React.FC<WeddingDetailsEditorProps> = ({
  couple,
  updateCouple,
  lang,
  onPreviewGuest
}) => {
  const [activeSection, setActiveSection] = useState<'program' | 'couple' | 'parents' | 'venue' | 'gallery' | 'banks'>('program');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('');
  const [galleryLightboxUrl, setGalleryLightboxUrl] = useState<string | null>(null);

  const showSavedAlert = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Gallery handlers
  const handleUploadGalleryPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newUrl = reader.result;
          updateCouple(prev => {
            const current = prev.galleryPhotos || [];
            return {
              ...prev,
              galleryPhotos: [...current, newUrl]
            };
          });
          showSavedAlert();
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddGalleryPhotoByUrl = () => {
    if (!newGalleryPhotoUrl.trim()) return;
    updateCouple(prev => ({
      ...prev,
      galleryPhotos: [...(prev.galleryPhotos || []), newGalleryPhotoUrl.trim()]
    }));
    setNewGalleryPhotoUrl('');
    showSavedAlert();
  };

  const handleDeleteGalleryPhoto = (index: number) => {
    updateCouple(prev => {
      const updated = [...(prev.galleryPhotos || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        galleryPhotos: updated
      };
    });
    showSavedAlert();
  };

  const handleMoveGalleryPhoto = (index: number, direction: 'left' | 'right') => {
    updateCouple(prev => {
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
    showSavedAlert();
  };

  const handleSetCoverPhoto = (photoUrl: string) => {
    updateCouple(prev => ({
      ...prev,
      coverPhoto: photoUrl
    }));
    showSavedAlert();
  };

  const handleSetFrontCoverPhoto = (photoUrl: string) => {
    updateCouple(prev => ({
      ...prev,
      cardBackgroundImage: photoUrl
    }));
    showSavedAlert();
  };

  const handleLoadSampleGallery = () => {
    updateCouple(prev => ({
      ...prev,
      galleryPhotos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop'
      ]
    }));
    showSavedAlert();
  };

  // Safe agendas extraction
  const currentAgendas: AgendaItem[] = Array.isArray(couple.agendas) ? couple.agendas : [];
  const day1Items = currentAgendas.filter(a => a.day === 1 || !a.day);
  const day2Items = currentAgendas.filter(a => a.day === 2);

  // Agenda handlers
  const handleUpdateAgendaItem = (id: string, updates: Partial<AgendaItem>) => {
    updateCouple(prev => ({
      ...prev,
      agendas: (prev.agendas || []).map(item => item.id === id ? { ...item, ...updates } : item)
    }));
    showSavedAlert();
  };

  const handleAddAgendaItem = (day: 1 | 2) => {
    const newItem: AgendaItem = {
      id: `ag_${Date.now()}`,
      day,
      time: day === 1 ? '០៣:០០ រសៀល' : '០៨:០០ ព្រឹក',
      titleKh: day === 1 ? 'ពិធីកម្មវិធីថ្មី' : 'ពិធីកម្មវិធីថ្មី',
      titleEn: 'New Ceremony',
      icon: day === 1 ? 'clock' : 'heart'
    };

    updateCouple(prev => ({
      ...prev,
      agendas: [...(prev.agendas || []), newItem]
    }));
    showSavedAlert();
  };

  const handleDeleteAgendaItem = (id: string) => {
    updateCouple(prev => ({
      ...prev,
      agendas: (prev.agendas || []).filter(item => item.id !== id)
    }));
    showSavedAlert();
  };

  const handleResetAgendasToDefault = () => {
    if (window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់កំណត់កាលវិភាគកម្មវិធីឡើងវិញទៅតាមគំរូប្រពៃណីខ្មែរស្ដង់ដារមែនទេ?' : 'Reset agendas to standard Khmer traditional schedule?')) {
      updateCouple(prev => ({
        ...prev,
        weddingProgramDay1TitleKh: 'កម្មវិធីថ្ងៃទី១ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៤',
        weddingProgramDay2TitleKh: 'កម្មវិធីថ្ងៃទី២ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៤',
        agendas: DEFAULT_WEDDING_AGENDAS
      }));
      showSavedAlert();
    }
  };

  // Bank account handlers
  const handleAddBankAccount = () => {
    const newBank: BankAccount = {
      id: `ba_${Date.now()}`,
      bankName: 'ABA Bank (KHQR)',
      accountName: `${couple.groomNameKh} & ${couple.brideNameKh}`,
      accountNumber: '000 000 000',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ABA_PAY_GIFT',
      currency: 'USD'
    };
    updateCouple(prev => ({
      ...prev,
      bankAccounts: [...(prev.bankAccounts || []), newBank]
    }));
    showSavedAlert();
  };

  const handleUpdateBank = (id: string, updates: Partial<BankAccount>) => {
    updateCouple(prev => ({
      ...prev,
      bankAccounts: (prev.bankAccounts || []).map(b => b.id === id ? { ...b, ...updates } : b)
    }));
    showSavedAlert();
  };

  const handleDeleteBank = (id: string) => {
    updateCouple(prev => ({
      ...prev,
      bankAccounts: (prev.bankAccounts || []).filter(b => b.id !== id)
    }));
    showSavedAlert();
  };

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
          showSavedAlert();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2 text-xs font-normal animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានជោគជ័យ!' : 'Changes saved successfully!'}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight font-khmer-title">
                  {lang === 'km' ? 'បញ្ចូល & កែប្រែព័ត៌មានធៀបការ' : 'Edit Wedding Information & Agendas'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 font-battambang">
                  {lang === 'km' 
                    ? 'កែប្រែកាលវិភាគកម្មវិធីពិធីការ ឈ្មោះកូនកម្លោះ-កូនក្រមុំ មាតាបិតា ថ្ងៃខែ និងទីតាំងពិធី'
                    : 'Customize wedding program timeline, couple names, parents, date, venue, and gift accounts'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onPreviewGuest && (
              <button
                type="button"
                onClick={onPreviewGuest}
                className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white rounded-xl text-xs font-normal hover:brightness-110 shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{lang === 'km' ? 'មើលធៀបការផ្ទាល់' : 'Preview e-Theap'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => setActiveSection('program')}
            className={`px-4 py-2 rounded-xl text-xs font-normal transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeSection === 'program'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-purple-50 border border-gray-200/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'កាលវិភាគកម្មវិធី (Agendas)' : 'Wedding Program'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {currentAgendas.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('couple')}
            className={`px-4 py-2 rounded-xl text-xs font-normal transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeSection === 'couple'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-purple-50 border border-gray-200/80'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'កូនកម្លោះ & កូនក្រមុំ' : 'Groom & Bride'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('parents')}
            className={`px-4 py-2 rounded-xl text-xs font-normal transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeSection === 'parents'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-purple-50 border border-gray-200/80'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'មាតាបិតាទាំងសងខាង' : 'Parents'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('venue')}
            className={`px-4 py-2 rounded-xl text-xs font-normal transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeSection === 'venue'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-purple-50 border border-gray-200/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'កាលបរិច្ឆេទ & ទីតាំង' : 'Date & Venue'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-normal transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeSection === 'gallery'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-purple-50 border border-gray-200/80'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'វិចិត្រសាលរូបភាព (Gallery)' : 'Photo Gallery'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {(couple.galleryPhotos || []).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('banks')}
            className={`px-4 py-2 rounded-xl text-xs font-normal transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeSection === 'banks'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-purple-50 border border-gray-200/80'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'កុងធនាគារចងដៃ (KHQR)' : 'Gift Banks'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {(couple.bankAccounts || []).length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: កាលវិភាគកម្មវិធីសិរីមង្គលអាពាហ៍ពិពាហ៍ (AGENDAS TIMELINE)      */}
      {/* ========================================================================= */}
      {activeSection === 'program' && (
        <div className="space-y-6">
          {/* Tip card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start justify-between gap-4 text-xs text-amber-900 font-battambang">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-950">
                  {lang === 'km' ? 'កាលវិភាគកម្មវិធីដែលបង្ហាញលើធៀបការ' : 'Wedding Program Displayed on Invitation'}
                </p>
                <p className="text-amber-800/90 mt-0.5 leading-relaxed">
                  {lang === 'km' 
                    ? 'អ្នកអាចកែប្រែចំណងជើងថ្ងៃទី១ និងថ្ងៃទី២ ព្រមទាំងបញ្ចូល ម៉ោង ឈ្មោះពិធី និងរូបតំណាងតាមការចង់បាន។ រាល់ការកែប្រែនឹងបង្ហាញផ្ទាល់ភ្លាមៗលើធៀបការ!'
                    : 'Customize Day 1 and Day 2 titles, time slots, ceremony names, and icons. All updates appear instantly on the live digital invitation!'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAgendasToDefault}
              className="px-3 py-1.5 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 rounded-xl text-xs font-normal flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
              title="កំណត់ឡើងវិញជាកម្មវិធីស្ដង់ដារ"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'km' ? 'ផ្ទុកគំរូស្ដង់ដារ' : 'Reset Default'}</span>
            </button>
          </div>

          {/* DAY 1 TIMELINE */}
          <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex-1">
                <span className="text-[11px] text-purple-700 uppercase font-semibold tracking-wider">
                  {lang === 'km' ? 'ផ្នែកទី ១' : 'Day 1 Program'}
                </span>
                <label className="block text-xs font-medium text-gray-700 mt-1 mb-1">
                  {lang === 'km' ? 'ចំណងជើងកម្មវិធីថ្ងៃទី១' : 'Day 1 Program Title'}
                </label>
                <input
                  type="text"
                  value={couple.weddingProgramDay1TitleKh || ''}
                  placeholder="កម្មវិធីថ្ងៃទី១ ថ្ងៃសៅរ៍ ទី០៦ ខែមករា ឆ្នាំ២០២៤"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, weddingProgramDay1TitleKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full max-w-lg px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden font-muol-light text-amber-900"
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddAgendaItem(1)}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-normal flex items-center gap-1.5 transition-colors self-start sm:self-end cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-600" />
                <span>{lang === 'km' ? '+ បន្ថែមពិធីថ្ងៃទី១' : '+ Add Day 1 Ceremony'}</span>
              </button>
            </div>

            {/* List of Day 1 Items */}
            <div className="space-y-3">
              {day1Items.length === 0 ? (
                <p className="text-center py-6 text-xs text-gray-400 font-battambang">
                  {lang === 'km' ? 'មិនទាន់មានពិធីសម្រាប់ថ្ងៃទី១ឡើយ' : 'No ceremonies added for Day 1'}
                </p>
              ) : (
                day1Items.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-gray-200/70 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3 group"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      {/* Icon selector */}
                      <select
                        value={item.icon || 'clock'}
                        onChange={e => handleUpdateAgendaItem(item.id, { icon: e.target.value as any })}
                        className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-battambang text-gray-700 cursor-pointer"
                      >
                        <option value="clock">🕒 នាឡិកា (Clock)</option>
                        <option value="sun">☀️ ព្រះអាទិត្យ (Sun)</option>
                        <option value="scissors">✂️ កន្ត្រៃ (Scissors)</option>
                        <option value="heart">❤️ បេះដូង (Heart)</option>
                        <option value="utensils">🍽️ អាហារ (Banquet)</option>
                        <option value="sparkles">✨ សិរីសួស្តី (Sparkles)</option>
                      </select>
                    </div>

                    {/* Time Input */}
                    <div className="w-full sm:w-36 shrink-0">
                      <input
                        type="text"
                        value={item.time}
                        placeholder="០២:០០ រសៀល"
                        onChange={e => handleUpdateAgendaItem(item.id, { time: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:border-[#D4AF37] outline-hidden text-[#8C6D1F] font-medium"
                      />
                    </div>

                    {/* Title Input */}
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={item.titleKh}
                        placeholder="ឈ្មោះពិធី ឧ. ពិធីសែនក្រុងពាលី"
                        onChange={e => handleUpdateAgendaItem(item.id, { titleKh: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:border-[#D4AF37] outline-hidden text-gray-900 font-medium font-battambang"
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAgendaItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer self-end sm:self-center"
                      title="លុបពិធីនេះ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DAY 2 TIMELINE */}
          <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex-1">
                <span className="text-[11px] text-purple-700 uppercase font-semibold tracking-wider">
                  {lang === 'km' ? 'ផ្នែកទី ២' : 'Day 2 Program'}
                </span>
                <label className="block text-xs font-medium text-gray-700 mt-1 mb-1">
                  {lang === 'km' ? 'ចំណងជើងកម្មវិធីថ្ងៃទី២' : 'Day 2 Program Title'}
                </label>
                <input
                  type="text"
                  value={couple.weddingProgramDay2TitleKh || ''}
                  placeholder="កម្មវិធីថ្ងៃទី២ ថ្ងៃអាទិត្យ ទី០៧ ខែមករា ឆ្នាំ២០២៤"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, weddingProgramDay2TitleKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full max-w-lg px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden font-muol-light text-amber-900"
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddAgendaItem(2)}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-normal flex items-center gap-1.5 transition-colors self-start sm:self-end cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-600" />
                <span>{lang === 'km' ? '+ បន្ថែមពិធីថ្ងៃទី២' : '+ Add Day 2 Ceremony'}</span>
              </button>
            </div>

            {/* List of Day 2 Items */}
            <div className="space-y-3">
              {day2Items.length === 0 ? (
                <p className="text-center py-6 text-xs text-gray-400 font-battambang">
                  {lang === 'km' ? 'មិនទាន់មានពិធីសម្រាប់ថ្ងៃទី២ឡើយ' : 'No ceremonies added for Day 2'}
                </p>
              ) : (
                day2Items.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-gray-200/70 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3 group"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      {/* Icon selector */}
                      <select
                        value={item.icon || 'clock'}
                        onChange={e => handleUpdateAgendaItem(item.id, { icon: e.target.value as any })}
                        className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-battambang text-gray-700 cursor-pointer"
                      >
                        <option value="sun">☀️ ព្រះអាទិត្យ (Sun)</option>
                        <option value="heart">❤️ បេះដូង (Heart)</option>
                        <option value="scissors">✂️ កន្ត្រៃ (Scissors)</option>
                        <option value="utensils">🍽️ អាហារ (Banquet)</option>
                        <option value="clock">🕒 នាឡិកា (Clock)</option>
                        <option value="sparkles">✨ សិរីសួស្តី (Sparkles)</option>
                      </select>
                    </div>

                    {/* Time Input */}
                    <div className="w-full sm:w-36 shrink-0">
                      <input
                        type="text"
                        value={item.time}
                        placeholder="០៦:៣០ ព្រឹក"
                        onChange={e => handleUpdateAgendaItem(item.id, { time: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:border-[#D4AF37] outline-hidden text-[#8C6D1F] font-medium"
                      />
                    </div>

                    {/* Title Input */}
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={item.titleKh}
                        placeholder="ឈ្មោះពិធី ឧ. ជួបជុំភ្ញៀវកិត្តិយស ដើម្បីរៀបចំហែជំនូន"
                        onChange={e => handleUpdateAgendaItem(item.id, { titleKh: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:border-[#D4AF37] outline-hidden text-gray-900 font-medium font-battambang"
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAgendaItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer self-end sm:self-center"
                      title="លុបពិធីនេះ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ព័ត៌មានកូនកម្លោះ & កូនក្រមុំ (GROOM & BRIDE DETAILS)               */}
      {/* ========================================================================= */}
      {activeSection === 'couple' && (
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-medium text-gray-900 font-khmer-title">
              {lang === 'km' ? 'ព័ត៌មានកូនកម្លោះ និង កូនក្រមុំ' : 'Bride & Groom Information'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'km' ? 'ឈ្មោះដែលបង្ហាញនៅទំព័រមុខ និងក្នុងសេចក្តីអញ្ជើញធៀបការ' : 'Names displayed on cover and invitation text'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groom Box */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
                {lang === 'km' ? 'ខាងកូនកម្លោះ (Groom)' : 'Groom Info'}
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះកូនកម្លោះ (ជាភាសាខ្មែរ)' : 'Groom Name (Khmer)'}
                </label>
                <input
                  type="text"
                  value={couple.groomNameKh}
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, groomNameKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះកូនកម្លោះ (ជាអក្សរឡាតាំង / English)' : 'Groom Name (English)'}
                </label>
                <input
                  type="text"
                  value={couple.groomNameEn}
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, groomNameEn: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះហៅក្រៅ (Nick Name)' : 'Groom Nickname'}
                </label>
                <input
                  type="text"
                  value={couple.groomNickKh || ''}
                  placeholder="វិបុល"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, groomNickKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>
            </div>

            {/* Bride Box */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4">
              <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider block">
                {lang === 'km' ? 'ខាងកូនក្រមុំ (Bride)' : 'Bride Info'}
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះកូនក្រមុំ (ជាភាសាខ្មែរ)' : 'Bride Name (Khmer)'}
                </label>
                <input
                  type="text"
                  value={couple.brideNameKh}
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, brideNameKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះកូនក្រមុំ (ជាអក្សរឡាតាំង / English)' : 'Bride Name (English)'}
                </label>
                <input
                  type="text"
                  value={couple.brideNameEn}
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, brideNameEn: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះហៅក្រៅ (Nick Name)' : 'Bride Nickname'}
                </label>
                <input
                  type="text"
                  value={couple.brideNickKh || ''}
                  placeholder="សុជាតា"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, brideNickKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Photo uploads */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
              {lang === 'km' ? 'រូបថត & គំនូរមង្គលការ (Wedding Photos & Artworks)' : 'Photos & Artworks'}
            </h4>

            {/* 1. FRONT COVER PHOTO / ARTWORK (រូបភាពទំព័រមុខធៀបការ) */}
            <div className="p-4 bg-gradient-to-br from-purple-50/60 via-[#FAF9F6] to-purple-50/30 border-2 border-purple-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                  <h5 className="text-xs font-semibold text-purple-950 uppercase tracking-wider">
                    {lang === 'km' ? '១. រូបភាពទំព័រមុខធៀបការ (Front Cover Artwork / Photo)' : '1. Front Cover Image'}
                  </h5>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                  {lang === 'km' ? 'ទំព័រមុខ 368' : 'Front Card'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden border-2 border-purple-300 shadow-sm bg-black/5 relative group self-center sm:self-auto">
                  <img 
                    src={couple.cardBackgroundImage || weddingArtwork368} 
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
                      ? 'រូបភាពគំនូរ ឬ រូបថត Pre-wedding ដែលបង្ហាញនៅទំព័រមុខ មុនពេលភ្ញៀវចុច «បើកសំបុត្រ»' 
                      : 'Illustration or photo displayed on the front card before guest opens the envelope.'}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'Upload រូបទំព័រមុខ' : 'Upload Front'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, url => {
                          updateCouple(prev => ({ ...prev, cardBackgroundImage: url }));
                        })}
                      />
                    </label>

                    {couple.cardBackgroundImage && (
                      <button
                        type="button"
                        onClick={() => {
                          updateCouple(prev => ({ ...prev, cardBackgroundImage: '' }));
                          showSavedAlert();
                        }}
                        className="px-2.5 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-red-600 text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        {lang === 'km' ? 'ប្រើ Default' : 'Reset'}
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="https://... (Image URL)"
                      value={couple.cardBackgroundImage || ''}
                      onChange={e => {
                        updateCouple(prev => ({ ...prev, cardBackgroundImage: e.target.value }));
                        showSavedAlert();
                      }}
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
                  onClick={() => {
                    updateCouple(prev => ({ 
                      ...prev, 
                      templateId: 'tpl_purple_02',
                      cardBackgroundImage: weddingArtwork368,
                      customTheme: {
                        ...prev.customTheme,
                        primaryColor: '#7E22CE',
                        accentColor: '#D4AF37',
                        envelopeStyle: 'royal-violet'
                      }
                    }));
                    showSavedAlert();
                  }}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-md transition-colors cursor-pointer"
                >
                  🌸 គំរូ 368 ផ្កាស្វាយ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateCouple(prev => ({ 
                      ...prev, 
                      templateId: 'tpl_gold_369',
                      cardBackgroundImage: weddingArtworkClassic,
                      customTheme: {
                        ...prev.customTheme,
                        primaryColor: '#D4AF37',
                        accentColor: '#8C6D1F',
                        envelopeStyle: 'classic-gold'
                      }
                    }));
                    showSavedAlert();
                  }}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md transition-colors cursor-pointer"
                >
                  🏛️ គំរូ 369 មាសបុរាណ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateCouple(prev => ({ ...prev, cardBackgroundImage: couple.coverPhoto }));
                    showSavedAlert();
                  }}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md transition-colors cursor-pointer"
                >
                  🖼️ ប្រើរូប Cover
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2. MAIN COVER PHOTO */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 flex items-center gap-4">
                <img
                  src={couple.coverPhoto}
                  alt="Cover Photo"
                  className="w-16 h-16 rounded-xl object-cover border border-amber-300 shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">
                    {lang === 'km' ? '២. រូបថតធំលើធៀបការ (Cover Photo)' : '2. Cover Photo URL'}
                  </label>
                  <input
                    type="text"
                    value={couple.coverPhoto}
                    onChange={e => {
                      updateCouple(prev => ({ ...prev, coverPhoto: e.target.value }));
                      showSavedAlert();
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-700"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3 h-3 text-purple-600" />
                      <span>{lang === 'km' ? 'Upload រូបភាព' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, url => updateCouple(prev => ({ ...prev, coverPhoto: url })))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Secondary Photo */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 flex items-center gap-4">
                <img
                  src={couple.secondaryPhoto || couple.coverPhoto}
                  alt="Secondary Photo"
                  className="w-16 h-16 rounded-xl object-cover border border-amber-300 shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">
                    {lang === 'km' ? '៣. រូបថតបន្ទាប់បន្សំ (Secondary Photo)' : '3. Secondary Photo URL'}
                  </label>
                  <input
                    type="text"
                    value={couple.secondaryPhoto || ''}
                    placeholder="https://..."
                    onChange={e => {
                      updateCouple(prev => ({ ...prev, secondaryPhoto: e.target.value }));
                      showSavedAlert();
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-700"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3 h-3 text-purple-600" />
                      <span>{lang === 'km' ? 'Upload រូបភាព' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, url => updateCouple(prev => ({ ...prev, secondaryPhoto: url })))}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ព័ត៌មានមាតាបិតាទាំងសងខាង (PARENTS INFORMATION)                    */}
      {/* ========================================================================= */}
      {activeSection === 'parents' && (
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-medium text-gray-900 font-khmer-title">
              {lang === 'km' ? 'ព័ត៌មានមាតាបិតាទាំងសងខាង' : 'Parents Information'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'km' ? 'ឈ្មោះមាតាបិតាដែលត្រូវរៀបរាប់នៅក្នុងសេចក្តីអញ្ជើញធៀបការ' : 'Parents names mentioned in the formal invitation letter'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groom's Parents */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
                {lang === 'km' ? 'មាតាបិតាខាងកូនកម្លោះ' : "Groom's Parents"}
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះឪពុកកូនកម្លោះ' : "Groom's Father (Khmer)"}
                </label>
                <input
                  type="text"
                  value={couple.groomFatherKh}
                  placeholder="លោក រ័ត្ន សុផល"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, groomFatherKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះម្តាយកូនកម្លោះ' : "Groom's Mother (Khmer)"}
                </label>
                <input
                  type="text"
                  value={couple.groomMotherKh}
                  placeholder="លោកស្រី ម៉ៅ សារី"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, groomMotherKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>
            </div>

            {/* Bride's Parents */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4">
              <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider block">
                {lang === 'km' ? 'មាតាបិតាខាងកូនក្រមុំ' : "Bride's Parents"}
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះឪពុកកូនក្រមុំ' : "Bride's Father (Khmer)"}
                </label>
                <input
                  type="text"
                  value={couple.brideFatherKh}
                  placeholder="លោក អ៊ុក សារឿន"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, brideFatherKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះម្តាយកូនក្រមុំ' : "Bride's Mother (Khmer)"}
                </label>
                <input
                  type="text"
                  value={couple.brideMotherKh}
                  placeholder="លោកស្រី ឃិន ចន្ថា"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, brideMotherKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: កាលបរិច្ឆេទ & ទីតាំងពិធី (DATE & VENUE)                         */}
      {/* ========================================================================= */}
      {activeSection === 'venue' && (
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-medium text-gray-900 font-khmer-title">
              {lang === 'km' ? 'កាលបរិច្ឆេទ ពេលវេលា និងទីតាំងពិធី' : 'Date, Time & Venue'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'km' ? 'កំណត់ថ្ងៃខែមង្គលការ ថ្ងៃចន្ទគតិ ទីតាំងគេហដ្ឋាន និងផែនទី Google Maps' : 'Configure wedding dates, lunar calendar, address, and map links'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates & Times */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                {lang === 'km' ? 'កាលបរិច្ឆេទ & ពេលវេលា' : 'Date & Auspicious Time'}
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ថ្ងៃខែឆ្នាំមង្គលការ (សកល / ខ្មែរ)' : 'Wedding Date (Khmer)'}
                </label>
                <input
                  type="text"
                  value={couple.weddingDateKh || couple.weddingDate}
                  placeholder="ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, weddingDateKh: e.target.value, weddingDate: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ថ្ងៃខែចន្ទគតិ (Auspicious Lunar Date)' : 'Lunar Auspicious Date'}
                </label>
                <input
                  type="text"
                  value={couple.auspiciousTextKh || ''}
                  placeholder="ត្រូវនឹងថ្ងៃ ៤រោច ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, auspiciousTextKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ពេលវេលាទទួលភ្ញៀវ' : 'Reception Time'}
                </label>
                <input
                  type="text"
                  value={couple.weddingTimeKh || ''}
                  placeholder="វេលាម៉ោង ១១:០០ ថ្ងៃត្រង់"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, weddingTimeKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>
            </div>

            {/* Venue & Location */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                {lang === 'km' ? 'ទីតាំងរៀបចំពិធី' : 'Venue Details'}
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះទីតាំង / គេហដ្ឋាន' : 'Venue Name'}
                </label>
                <input
                  type="text"
                  value={couple.venueNameKh}
                  placeholder="កេហដ្ឋានខាងស្រី"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, venueNameKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === 'km' ? 'អាសយដ្ឋានលម្អិត' : 'Detailed Address'}
                </label>
                <textarea
                  rows={2}
                  value={couple.venueAddressKh}
                  placeholder="ភូមិរំដេង ឃុំខ្នារពោធិ ស្រុកសូទ្រនិគ ខេត្តសៀមរាប។"
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, venueAddressKh: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden font-battambang text-gray-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-700">
                    {lang === 'km' ? 'តំណភ្ជាប់ Google Maps URL (Link Map)' : 'Google Maps URL'}
                  </label>
                  {couple.venueMapUrl && (
                    <a
                      href={couple.venueMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#8C6D1F] hover:underline flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{lang === 'km' ? 'សាកល្បងបើកមើល Link' : 'Test Map Link'}</span>
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={couple.venueMapUrl}
                  placeholder="https://maps.google.com/?q=... ឬ https://maps.app.goo.gl/..."
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, venueMapUrl: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:border-[#D4AF37] outline-hidden text-gray-900"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === 'km' ? 'ចម្លង Link ចែករំលែក (Share Link) ពី Google Maps ដើម្បីឱ្យភ្ញៀវចុចទៅដល់ទីតាំងកម្មវិធីផ្ទាល់' : 'Paste Google Maps share link so guests can easily navigate.'}
                </p>
              </div>
            </div>
          </div>

          {/* Drawn Map Image */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
              {lang === 'km' ? 'រូបភាពផែនទីគូរផ្ទាល់ (Drawn Venue Map)' : 'Custom Venue Map Image'}
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200/80">
              {couple.venueMapImage ? (
                <img
                  src={couple.venueMapImage}
                  alt="Venue Map"
                  className="w-24 h-24 rounded-xl object-cover border border-gray-300 shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-[10px] shrink-0">
                  <MapPin className="w-6 h-6 mb-1 text-gray-300" />
                  <span>គ្មានរូបផែនទី</span>
                </div>
              )}

              <div className="flex-1 space-y-1.5 w-full">
                <input
                  type="text"
                  value={couple.venueMapImage || ''}
                  placeholder="URL នៃរូបភាពផែនទី https://..."
                  onChange={e => {
                    updateCouple(prev => ({ ...prev, venueMapImage: e.target.value }));
                    showSavedAlert();
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-700"
                />
                <div className="flex items-center gap-2 pt-1">
                  <label className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3 text-purple-600" />
                    <span>{lang === 'km' ? 'Upload រូបផែនទី' : 'Upload Map Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, url => updateCouple(prev => ({ ...prev, venueMapImage: url })))}
                    />
                  </label>
                  {couple.venueMapImage && (
                    <button
                      type="button"
                      onClick={() => {
                        updateCouple(prev => ({ ...prev, venueMapImage: undefined }));
                        showSavedAlert();
                      }}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                    >
                      {lang === 'km' ? 'លុបរូបផែនទី' : 'Remove Map Image'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: វិចិត្រសាលរូបភាពអនុស្សាវរីយ៍ (PRE-WEDDING PHOTO GALLERY)         */}
      {/* ========================================================================= */}
      {activeSection === 'gallery' && (
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-medium text-gray-900 font-khmer-title flex items-center gap-2">
                    <span>{lang === 'km' ? 'កម្រងរូបភាពវិចិត្រសាល (Pre-Wedding Gallery)' : 'Pre-Wedding Photo Gallery'}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {(couple.galleryPhotos || []).length} {lang === 'km' ? 'សន្លឹក' : 'photos'}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-battambang">
                    {lang === 'km' 
                      ? 'រូបថត Pre-wedding ឬអនុស្សាវរីយ៍ទាំងនេះ នឹងបង្ហាញលើសំបុត្រអញ្ជើញធៀបការឌីជីថល សម្រាប់ភ្ញៀវទស្សនានិងចុចពង្រីកមើល'
                      : 'These photos appear in the commemorative photo gallery section of the wedding invitation for guests to browse and enlarge.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Batch Upload from device */}
              <label className="cursor-pointer px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-normal shadow-sm flex items-center gap-2 transition-transform active:scale-95">
                <Upload className="w-4 h-4" />
                <span>{lang === 'km' ? '+ Upload រូបថតច្រើនសន្លឹក' : '+ Upload Photos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUploadGalleryPhotos(e.target.files)}
                />
              </label>

              {/* Sample Preset Pack */}
              {(!couple.galleryPhotos || couple.galleryPhotos.length === 0) && (
                <button
                  type="button"
                  onClick={handleLoadSampleGallery}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#8C6D1F] border border-amber-200 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{lang === 'km' ? 'ដាក់រូបគំរូស្អាតៗ' : 'Load Samples'}</span>
                </button>
              )}

              {/* Clear All */}
              {(couple.galleryPhotos || []).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់លុបរូបភាពទាំងអស់ក្នុងវិចិត្រសាលមែនទេ?' : 'Are you sure you want to clear all gallery photos?')) {
                      updateCouple(prev => ({ ...prev, galleryPhotos: [] }));
                      showSavedAlert();
                    }
                  }}
                  className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="លុបរូបទាំងអស់"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Slideshow On Open Feature Toggle */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-purple-50/40 to-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-[#8C6D1F]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 font-khmer-title">
                  {lang === 'km' ? 'មុខងារ Slide Show រូបភាពវិចិត្រសាលពេលបើកធៀប' : 'Full-Screen Gallery Slideshow on Open'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                  {lang === 'km' ? 'មុខងារថ្មី' : 'New'}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 font-battambang leading-relaxed">
                {lang === 'km'
                  ? 'នៅពេលភ្ញៀវចុចប៊ូតុង "បើកសំបុត្រ" កម្មវិធីនឹងចាក់បញ្ចាំង Slide Show រូបភាពវិចិត្រសាល Pre-Wedding ពេញអេក្រង់អមដោយភ្លេងការ មុននឹងបន្តចូលដល់កម្មវិធីមង្គលការ'
                  : 'When guests click "Open Invitation", automatically present a full-screen animated pre-wedding photo slideshow with music before continuing to the invitation program.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
              <input
                type="checkbox"
                checked={couple.customTheme?.showSlideshowOnOpen !== false}
                onChange={(e) => {
                  updateCouple(prev => ({
                    ...prev,
                    customTheme: {
                      ...prev.customTheme,
                      showSlideshowOnOpen: e.target.checked
                    }
                  }));
                  showSavedAlert();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>

          {/* Add Image by URL Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-[#FAF9F6] rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 flex-1 px-2">
              <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="https://... (បិទភ្ជាប់ Link រូបភាព Paste Image URL)"
                value={newGalleryPhotoUrl}
                onChange={(e) => setNewGalleryPhotoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGalleryPhotoByUrl();
                  }
                }}
                className="flex-1 bg-transparent text-xs outline-hidden text-gray-800"
              />
            </div>
            <button
              type="button"
              onClick={handleAddGalleryPhotoByUrl}
              disabled={!newGalleryPhotoUrl.trim()}
              className="px-4 py-2 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white disabled:text-gray-400 text-xs rounded-xl font-medium transition-colors cursor-pointer"
            >
              {lang === 'km' ? '+ បន្ថែមរូប' : '+ Add Photo'}
            </button>
          </div>

          {/* Photo Gallery Grid */}
          {(!couple.galleryPhotos || couple.galleryPhotos.length === 0) ? (
            <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAF9F6]/50 space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto text-purple-600">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-800 font-battambang">
                  {lang === 'km' ? 'មិនទាន់មានរូបភាពក្នុងវិចិត្រសាលនៅឡើយទេ' : 'No photos in the gallery yet'}
                </h4>
                <p className="text-xs text-gray-500 font-battambang max-w-md mx-auto">
                  {lang === 'km' 
                    ? 'សូមចុចប៊ូតុង «Upload រូបថតច្រើនសន្លឹក» ដើម្បីជ្រើសរើសរូបពីទូរស័ព្ទ/កុំព្យូទ័រ ឬបិទភ្ជាប់ Link រូបភាព'
                    : 'Click "Upload Photos" to pick multiple photos from your device, or paste image URLs directly.'}
                </p>
              </div>
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'Upload រូបថតឥឡូវនេះ' : 'Upload Photos Now'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadGalleryPhotos(e.target.files)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {couple.galleryPhotos.map((photo, index) => {
                  const isCover = couple.coverPhoto === photo;
                  return (
                    <div 
                      key={index} 
                      className={`group relative rounded-2xl overflow-hidden border bg-black/5 aspect-square shadow-xs transition-all ${
                        isCover ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-gray-200 hover:border-purple-400'
                      }`}
                    >
                      <img 
                        src={photo} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Photo Index Badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                        #{index + 1}
                      </div>

                      {/* Cover Badge */}
                      {isCover && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#D4AF37] text-white text-[9px] font-bold rounded-md shadow-xs flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 fill-white" />
                          <span>Cover</span>
                        </div>
                      )}

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        {/* Top controls */}
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setGalleryLightboxUrl(photo)}
                            className="p-1.5 bg-white/80 hover:bg-white text-gray-800 rounded-lg text-xs cursor-pointer shadow-xs"
                            title="មើលរូបធំ"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryPhoto(index)}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs cursor-pointer shadow-xs"
                            title="លុបរូបនេះ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom controls */}
                        <div className="space-y-1">
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              type="button"
                              onClick={() => handleSetFrontCoverPhoto(photo)}
                              className="py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-medium flex items-center justify-center cursor-pointer shadow-xs"
                              title="ដាក់ជារូបភាពទំព័រមុខ"
                            >
                              <span>{lang === 'km' ? '⭐ មុខ' : 'Front'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetCoverPhoto(photo)}
                              className="py-1 bg-[#D4AF37] hover:bg-[#B8962D] text-white rounded-lg text-[9px] font-medium flex items-center justify-center cursor-pointer shadow-xs"
                              title="ដាក់ជារូបថតធំលើធៀបការ"
                            >
                              <span>{lang === 'km' ? 'Cover' : 'Cover'}</span>
                            </button>
                          </div>
                          
                          {/* Reordering buttons */}
                          <div className="flex items-center justify-between gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveGalleryPhoto(index, 'left')}
                              className="flex-1 py-1 bg-white/80 hover:bg-white disabled:opacity-30 text-gray-800 rounded-lg text-[10px] font-medium cursor-pointer"
                              title="រំកិលទៅមុខ"
                            >
                              ◀ ឆ្វេង
                            </button>
                            <button
                              type="button"
                              disabled={index === (couple.galleryPhotos?.length || 1) - 1}
                              onClick={() => handleMoveGalleryPhoto(index, 'right')}
                              className="flex-1 py-1 bg-white/80 hover:bg-white disabled:opacity-30 text-gray-800 rounded-lg text-[10px] font-medium cursor-pointer"
                              title="រំកិលទៅក្រោយ"
                            >
                              ស្តាំ ▶
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Helper tip */}
              <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-purple-900 font-battambang">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p>
                  {lang === 'km' 
                    ? 'គន្លឹះ៖ អ្នកអាចរំកិលលំដាប់រូបភាពបានដោយចុចប៊ូតុង ◀ ឆ្វេង ឬ ស្តាំ ▶ នៅពេលយកកណ្ដុរចង្អុលលើរូប ឬចុច «ដាក់ជារូប Cover» ដើម្បីកំណត់រូបថតមុខមាត់ចម្បងនៃធៀបការ។'
                    : 'Tip: You can reorder photos using ◀ / ▶ buttons on hover, or set any photo as the main Cover Photo.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: កុងធនាគារចងដៃ (BANK ACCOUNTS & QR CODES)                         */}
      {/* ========================================================================= */}
      {activeSection === 'banks' && (
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 font-khmer-title">
                {lang === 'km' ? 'កុងធនាគារទទួលចំណងដៃ & KHQR' : 'Gift Bank Accounts & QR Codes'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {lang === 'km' ? 'សម្រាប់ភ្ញៀវដែលចង់ស្កេន QR Code ចងដៃពីចម្ងាយ (ABA, ACLEDA, Wing...)' : 'For guests sending wedding gifts and monetary blessings via KHQR'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddBankAccount}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-4 h-4 text-purple-600" />
              <span>{lang === 'km' ? '+ បន្ថែមកុងធនាគារ' : '+ Add Bank Account'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {(couple.bankAccounts || []).length === 0 ? (
              <p className="text-center py-8 text-xs text-gray-400 font-battambang">
                {lang === 'km' ? 'មិនទាន់មានកុងធនាគារនៅឡើយទេ។ ចុចប៊ូតុងខាងលើដើម្បីបន្ថែម។' : 'No bank accounts added yet. Click above to add one.'}
              </p>
            ) : (
              (couple.bankAccounts || []).map((bank, index) => (
                <div 
                  key={bank.id} 
                  className="p-5 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      {lang === 'km' ? `គណនីទី ${index + 1}` : `Account #${index + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBank(bank.id)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="លុបកុងនេះ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {lang === 'km' ? 'ឈ្មោះធនាគារ' : 'Bank Name'}
                      </label>
                      <input
                        type="text"
                        value={bank.bankName}
                        placeholder="ABA Bank (KHQR)"
                        onChange={e => handleUpdateBank(bank.id, { bankName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {lang === 'km' ? 'ឈ្មោះគណនី' : 'Account Name'}
                      </label>
                      <input
                        type="text"
                        value={bank.accountName}
                        placeholder="RATH VIBOL & OUK SOCHEATA"
                        onChange={e => handleUpdateBank(bank.id, { accountName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {lang === 'km' ? 'លេខគណនី' : 'Account Number'}
                      </label>
                      <input
                        type="text"
                        value={bank.accountNumber}
                        placeholder="003 688 888 (USD)"
                        onChange={e => handleUpdateBank(bank.id, { accountNumber: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-900"
                      />
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {bank.qrUrl && (
                      <img 
                        src={bank.qrUrl} 
                        alt="Bank QR" 
                        className="w-20 h-20 rounded-xl object-contain bg-white p-1 border border-gray-200 shrink-0" 
                      />
                    )}
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="block text-xs font-medium text-gray-700">
                        {lang === 'km' ? 'រូបភាព QR Code' : 'QR Code Image URL'}
                      </label>
                      <input
                        type="text"
                        value={bank.qrUrl}
                        onChange={e => handleUpdateBank(bank.id, { qrUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-hidden text-gray-700"
                      />
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-[11px] text-gray-700 hover:bg-gray-50 cursor-pointer">
                        <Upload className="w-3 h-3 text-purple-600" />
                        <span>{lang === 'km' ? 'Upload រូប QR Code' : 'Upload QR Code'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFileUpload(e, url => handleUpdateBank(bank.id, { qrUrl: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lightbox for Gallery Photo in Couple Editor */}
      {galleryLightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setGalleryLightboxUrl(null)}
        >
          <button 
            type="button"
            className="absolute top-4 right-4 text-white p-2.5 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
            onClick={() => setGalleryLightboxUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={galleryLightboxUrl} 
            alt="Enlarged gallery photo" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
          />
        </div>
      )}

    </div>
  );
};
