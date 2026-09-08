import React from 'react';
import { Template, CoupleEvent, Language } from '../types';
import { GuestInvitationView } from './Guest/GuestInvitationView';
import { ExternalLink, X, Sparkles } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleEvent;
  templates: Template[];
  guestCode?: string;
  setCouples: React.Dispatch<React.SetStateAction<CoupleEvent[]>>;
  lang: Language;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  couple,
  templates,
  guestCode,
  setCouples,
  lang,
}) => {
  if (!isOpen) return null;

  const handleOpenInNewTab = () => {
    let url = `${window.location.origin}${window.location.pathname}#guest`;
    if (guestCode) {
      url += `?code=${guestCode}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-0 sm:p-3 animate-fade-in overflow-hidden font-battambang">
      
      {/* Main Preview Container - Clean Edge-to-Edge Frameless Screen */}
      <div className="w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden relative h-full">
        <div 
          className="mx-auto bg-transparent sm:bg-white rounded-none sm:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300 shrink-0"
          style={{
            aspectRatio: '9/16',
            height: '100%',
            maxHeight: '100%',
            maxWidth: '100%'
          }}
        >
          
          {/* Frameless Screen View without scrollbars */}
          <div className="w-full h-full overflow-y-auto no-scrollbar relative">
            <GuestInvitationView
              couple={couple}
              templates={templates}
              guestCode={guestCode}
              setCouples={setCouples}
              lang={lang}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
