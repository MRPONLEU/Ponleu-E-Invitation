import React, { useState } from 'react';
import { Template, CoupleEvent, Language } from '../../types';
import { Palette, Search, Plus, Edit3, Eye } from 'lucide-react';

interface AdminTemplatesPageProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  couples: CoupleEvent[];
  setCouples: React.Dispatch<React.SetStateAction<CoupleEvent[]>>;
  lang: Language;
  onOpenNewTemplate: () => void;
  onEditTemplate: (tpl: Template) => void;
  onPreviewCouple: (coupleId: string) => void;
}

export const AdminTemplatesPage: React.FC<AdminTemplatesPageProps> = ({
  templates,
  setTemplates,
  couples,
  setCouples,
  lang,
  onOpenNewTemplate,
  onEditTemplate,
  onPreviewCouple,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');

  const filteredTemplates = (templates || []).filter(t => {
    const q = (searchQuery || '').toLowerCase();
    const matchSearch = (t.nameKh || '').toLowerCase().includes(q) || 
                        (t.nameEn || '').toLowerCase().includes(q) ||
                        (t.code || '').toLowerCase().includes(q);
    const matchStyle = selectedStyleFilter === 'all' || t.style === selectedStyleFilter;
    return matchSearch && matchStyle;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#D4AF37] rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-normal text-gray-900 font-khmer-title">
              {lang === 'km' ? 'បណ្ណាល័យគំរូរចនា (Template Showcase)' : 'E-Invitation Template Catalog'}
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'km' 
              ? 'ម៉ូតសំបុត្រអញ្ជើញដែលត្រូវបានរៀបចំយ៉ាងប្រណិត អាចកែសម្រួលពណ៌ អក្សរ ភ្លេងការ និងក្បូរក្បាច់បាន'
              : 'Select, customize, or craft new wedding templates with audio, colors, and Khmer borders.'}
          </p>
        </div>

        <button
          onClick={onOpenNewTemplate}
          className="bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white px-4 py-2.5 rounded-xl text-xs font-normal hover:brightness-110 shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'km' ? '+ បង្កើតគំរូ Templet ថ្មី' : '+ New Template'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAE6E1] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'km' ? 'ស្វែងរកម៉ូត Templet...' : 'Search template...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F5F0] border border-[#EAE6E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStyleFilter}
            onChange={(e) => setSelectedStyleFilter(e.target.value)}
            className="text-xs bg-[#F7F5F0] border border-[#EAE6E1] rounded-xl px-3 py-2 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          >
            <option value="all">{lang === 'km' ? 'រចនាប័ទ្មទាំងអស់' : 'All Styles'}</option>
            <option value="traditional-gold">{lang === 'km' ? 'បុរាណខ្មែរ មាស' : 'Khmer Royal Gold'}</option>
            <option value="royal-blush">{lang === 'km' ? 'ផ្កាកុលាប & សសរ' : 'Royal Rose Arch'}</option>
            <option value="nature-green">{lang === 'km' ? 'ធម្មជាតិបៃតង' : 'Nature Green'}</option>
            <option value="modern-ivory">{lang === 'km' ? 'ទំនើបស៊ីវិល័យ' : 'Modern Luxury'}</option>
            <option value="royal-violet">{lang === 'km' ? 'ស្វាយរាជវាំង' : 'Royal Violet'}</option>
          </select>
        </div>
      </div>

      {/* Templates Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div 
            key={tpl.id}
            className="group bg-white border border-[#EAE6E1] rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Top Visual Card Preview */}
            <div className="relative h-60 bg-gray-100 overflow-hidden flex items-center justify-center p-3">
              <img 
                src={tpl.coverImage} 
                alt={tpl.nameKh}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlaid Gold Card Frame Mockup */}
              <div className="absolute inset-5 rounded-xl border-2 border-[#D4AF37]/70 pointer-events-none flex flex-col justify-between p-3 bg-gradient-to-t from-black/60 via-transparent to-black/30 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-normal px-2 py-0.5 bg-black/50 backdrop-blur-xs rounded text-amber-300 border border-[#D4AF37]/50">
                    {tpl.code}
                  </span>
                  {tpl.badge && (
                    <span className="text-[10px] font-normal px-2 py-0.5 bg-[#D4AF37] text-white rounded-full shadow-xs">
                      {tpl.badge}
                    </span>
                  )}
                </div>
                
                <div className="text-center bg-black/40 backdrop-blur-xs rounded-lg p-2 border border-white/20">
                  <p className="text-[10px] text-[#DFBA49] uppercase tracking-widest font-normal">
                    Wedding Invitation
                  </p>
                  <p className="text-xs font-normal font-serif-luxury truncate">
                    {tpl.nameEn.split('&')[0]}
                  </p>
                </div>
              </div>

              {/* Color Swatch Pill */}
              <div className="absolute top-5 right-5 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-full shadow-xs border border-gray-200">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.primaryColor }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.accentColor }}></div>
              </div>
            </div>

            {/* Template Meta Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-normal text-sm text-gray-900 line-clamp-1 font-khmer-title">
                  {tpl.nameKh}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {tpl.descriptionKh}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {lang === 'km' ? `ប្រើប្រាស់ ${tpl.usageCount} ដង` : `Used ${tpl.usageCount} times`}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditTemplate(tpl)}
                    className="px-3 py-1.5 text-[11px] font-normal bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'កែសម្រួល' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (couples.length > 0) {
                        setCouples(prev => prev.map(c => ({ ...c, templateId: tpl.id })));
                        onPreviewCouple(couples[0].id);
                      }
                    }}
                    className="px-3 py-1.5 text-[11px] font-normal bg-[#D4AF37] hover:bg-[#B8962D] text-white rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'មើលគំរូ' : 'Preview'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
