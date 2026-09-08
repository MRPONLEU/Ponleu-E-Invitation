import React, { useState } from 'react';
import { Language } from '../types';
import { 
  X, 
  Share2, 
  AlertTriangle, 
  Check, 
  Copy, 
  ExternalLink, 
  Globe, 
  ShieldAlert, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  getAppBaseUrl, 
  getStoredCustomBaseUrl, 
  saveCustomBaseUrl, 
  isPrivateDevEnvironment, 
  DEFAULT_SHARED_APP_URL 
} from '../utils/urlHelper';

interface ShareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ShareGuideModal: React.FC<ShareGuideModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [customUrl, setCustomUrl] = useState(getStoredCustomBaseUrl() || DEFAULT_SHARED_APP_URL);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSharedUrl, setCopiedSharedUrl] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveCustomBaseUrl(customUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSharedUrl(true);
    setTimeout(() => setCopiedSharedUrl(false), 2000);
  };

  const isCurrentDev = isPrivateDevEnvironment();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-normal text-gray-900 font-khmer-title">
                {lang === 'km' ? 'របៀបចែករំលែក Link កុំឱ្យ Error 403' : 'How to Share Links without Error 403'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'km' ? 'ការណែនាំបង្កើត Public Link សម្រាប់កូនកម្លោះក្រមុំ និងភ្ញៀវ' : 'Public invitation link setup guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs text-gray-700">
          
          {/* Why Error 403 box */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{lang === 'km' ? 'ហេតុអ្វីបានជាចេញ Google 403 Forbidden?' : 'Why does Google 403 Error appear?'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-900/80">
              {lang === 'km' 
                ? 'ដោយសារ Link ក្នុងផ្ទាំង Edit (ais-dev-... ឬ aistudio.google.com) គឺសម្រាប់តែម្ចាស់គណនី Google Developer តែប៉ុណ្ណោះ។ ប្រសិនបើផ្ញើ Link នេះទៅកាន់ទូរសព្ទ ឬអ្នកដទៃ Google នឹងទប់ស្កាត់ភ្លាមៗ។'
                : 'The edit preview URL (ais-dev or aistudio.google.com) is private to the developer. External users or mobile phones are blocked by Google authentication.'}
            </p>
          </div>

          {/* Step 1: Click Share in AI Studio */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6E1] space-y-2.5">
            <div className="flex items-center gap-2 font-medium text-gray-900">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
              <span>{lang === 'km' ? 'ចុចប៊ូតុង "Share" នៅលើ Google AI Studio' : 'Click "Share" in Google AI Studio'}</span>
            </div>
            <p className="text-[11px] text-gray-600 pl-7">
              {lang === 'km'
                ? 'នៅរបារខាងលើបង្អស់នៃកម្មវិធី Google AI Studio សូមចុចប៊ូតុង "Share" ដើម្បី Publish កម្មវិធីនេះជាសាធារណៈ។ ភ្ញៀវ និងកូនកម្លោះក្រមុំអាចបើកបានដោយមិនចាំបាច់មានគណនី Google ឡើយ។'
                : 'In Google AI Studio top bar, click "Share" to publish the app. Then anyone can open the link freely.'}
            </p>
          </div>

          {/* Step 2: Set or Verify Public URL */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 font-medium text-gray-900">
              <span className="w-5 h-5 rounded-full bg-[#8C6D1F] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
              <span>{lang === 'km' ? 'Public Shared URL សម្រាប់ចែករំលែក' : 'Public Shared URL for links'}</span>
            </div>
            <div className="space-y-1.5 pl-7">
              <label className="text-[11px] text-gray-600 block">
                {lang === 'km' ? 'តំណភ្ជាប់ Public Domain / Shared App URL របស់អ្នក៖' : 'Your Public Domain / Shared App URL:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://ais-pre-..."
                  className="flex-1 p-2 rounded-xl bg-white border border-amber-300 text-xs font-mono text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-xs"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isSaved ? (lang === 'km' ? 'បានរក្សាទុក' : 'Saved') : (lang === 'km' ? 'រក្សាទុក' : 'Save')}</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-500">
                {lang === 'km' 
                  ? 'រាល់ប៊ូតុង "ចម្លង Link" នៅក្នុងផ្ទាំង Admin និងផ្ទាំងកូនកម្លោះក្រមុំ នឹងប្រើប្រាស់ Public URL នេះដោយស្វ័យប្រវត្តិ។' 
                  : 'All "Copy Link" buttons in Admin and Couple dashboard will use this URL automatically.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getAppBaseUrl().slice(0, 36)}...</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
          >
            {lang === 'km' ? 'យល់ព្រម' : 'Got it'}
          </button>
        </div>

      </div>
    </div>
  );
};
