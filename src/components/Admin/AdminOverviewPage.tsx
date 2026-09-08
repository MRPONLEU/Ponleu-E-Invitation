import React from 'react';
import { Template, CoupleEvent, Language } from '../../types';
import { Sparkles, Users, Palette, Plus, HeartHandshake, TrendingUp, Share2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { AUTHORIZED_ADMIN_EMAIL } from '../../lib/adminAuth';

interface AdminOverviewPageProps {
  templates: Template[];
  couples: CoupleEvent[];
  lang: Language;
  onNavigateToTemplates: () => void;
  onNavigateToCouples: () => void;
  onOpenNewTemplate: () => void;
  onOpenNewCouple: () => void;
  onSelectCouple: (id: string) => void;
  onPreviewCouple: (id: string) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  templates,
  couples,
  lang,
  onNavigateToTemplates,
  onNavigateToCouples,
  onOpenNewTemplate,
  onOpenNewCouple,
  onSelectCouple,
  onPreviewCouple,
}) => {
  const totalGuests = (couples || []).reduce((acc, c) => acc + (c.guests?.length || 0), 0);
  const totalRsvpConfirmed = (couples || []).reduce((acc, c) => acc + (c.guests ? c.guests.filter(g => g.rsvpStatus === 'attending').length : 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Bento Grid Top Section: Overview & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Metric 1: Main Platform Summary Banner (Bento 6-col) */}
        <div className="md:col-span-6 bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#171717] rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-lg border border-gray-800 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-[#D4AF37]/20 text-[#DFBA49] text-xs font-normal px-2.5 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងសំបុត្រអញ្ជើញ VIP' : 'VIP E-Invitation Master Platform'}
              </span>
              <span className="bg-emerald-500/15 text-emerald-300 text-xs font-normal px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {AUTHORIZED_ADMIN_EMAIL}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight font-khmer-title leading-snug">
              {lang === 'km' ? 'ផ្ទាំងបញ្ជា និងគ្រប់គ្រងទូទៅ' : 'Admin Operations Hub'}
            </h2>
            <p className="text-sm text-gray-300 mt-2 max-w-md">
              {lang === 'km' 
                ? 'បង្កើត និងកែសម្រួលគំរូកាត (Template) បង្កើតគណនីគូស្នេហ៍ និងចម្លង Link អញ្ជើញភ្ញៀវម្នាក់ៗបានភ្លាមៗ។'
                : 'Create customized templates, provision bride & groom accounts, and instantly generate personalized guest invitation links.'}
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenNewTemplate}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white px-4 py-2.5 rounded-xl text-xs font-normal hover:brightness-110 shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'km' ? '+ បង្កើតគំរូ Templet ថ្មី' : '+ Create New Template'}</span>
            </button>

            <button
              onClick={onOpenNewCouple}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-normal backdrop-blur-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              <span>{lang === 'km' ? '+ បង្កើតគណនីគូស្វាមីភរិយា' : '+ New Couple Account'}</span>
            </button>
          </div>

          {/* Decorative Pattern Background */}
          <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 pointer-events-none">
            <div className="w-48 h-48 rounded-full border-8 border-[#D4AF37]"></div>
          </div>
        </div>

        {/* Metric 2: Couples Stats (Bento 3-col) */}
        <div 
          onClick={onNavigateToCouples}
          className="md:col-span-3 bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden hover:border-pink-300 transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal uppercase tracking-wider text-gray-500">
                {lang === 'km' ? 'គូស្នេហ៍ក្នុងប្រព័ន្ធ' : 'Active Couples'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-normal text-gray-900 mt-4 tracking-tight">
              {couples.length}
            </div>
            <p className="text-xs text-emerald-600 font-normal mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? '១០០% ដំណើរការល្អ' : 'All packages active'}</span>
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 mt-4 text-xs text-gray-500 flex items-center justify-between">
            <span>{lang === 'km' ? 'សរុបភ្ញៀវ៖' : 'Total Guests:'} <strong className="text-gray-800">{totalGuests}</strong></span>
            <span className="text-pink-600 font-normal group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Metric 3: Template Count & RSVPs (Bento 3-col) */}
        <div 
          onClick={onNavigateToTemplates}
          className="md:col-span-3 bg-gradient-to-br from-[#FAF8F3] to-[#F3ECE0] border border-[#DFBA49]/40 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#D4AF37] transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal uppercase tracking-wider text-[#8C6D1F]">
                {lang === 'km' ? 'គំរូរចនា Templet' : 'Template Styles'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#8C6D1F] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-normal text-[#1A1A1A] mt-4 tracking-tight">
              {templates.length}
            </div>
            <p className="text-xs text-[#8C6D1F] font-normal mt-2">
              {lang === 'km' ? 'ម៉ូតខ្មែរបុរាណ & ស៊ីវិល័យ' : 'Khmer Traditional & Modern'}
            </p>
          </div>
          <div className="pt-4 border-t border-[#D4AF37]/20 mt-4 text-xs text-gray-700 flex justify-between items-center">
            <span>{lang === 'km' ? 'ឆ្លើយតបចូលរួម:' : 'Confirmed:'} <strong className="text-emerald-700 font-normal">{totalRsvpConfirmed}</strong></span>
            <span className="text-[#8C6D1F] font-normal group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

      </div>

      {/* Quick Navigation Cards to Separate Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Templates Page Quick Card */}
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs flex items-center justify-between hover:border-[#D4AF37]/60 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#8C6D1F] flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-normal text-gray-900 font-khmer-title">
              {lang === 'km' ? 'បណ្ណាល័យគំរូរចនា (Templates)' : 'Template Catalog Page'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm">
              {lang === 'km' ? 'គ្រប់គ្រងម៉ូតសំបុត្រទាំងអស់ កែពណ៌ ភ្លេងការ និងក្បាច់រចនា' : 'Manage all templates, color themes, background music and aesthetics.'}
            </p>
          </div>
          <button
            onClick={onNavigateToTemplates}
            className="px-4 py-2.5 bg-[#FAF8F3] hover:bg-[#F3ECE0] text-[#8C6D1F] border border-[#DFBA49]/40 rounded-xl text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>{lang === 'km' ? 'ចូលទៅកាន់ Page ម៉ូត' : 'Open Templates Page'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Couples Page Quick Card */}
        <div className="bg-white border border-[#EAE6E1] rounded-3xl p-6 shadow-xs flex items-center justify-between hover:border-pink-300 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-normal text-gray-900 font-khmer-title">
              {lang === 'km' ? 'បញ្ជីគូស្វាមីភរិយា (Couple Accounts)' : 'Couple Accounts Page'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm">
              {lang === 'km' ? 'បញ្ជីឈ្មោះគូស្នេហ៍ ចម្លង Link ផ្ញើជូន និងចូលគ្រប់គ្រងព័ត៌មានមង្គលការ' : 'View all registered couples, copy portal links and manage wedding details.'}
            </p>
          </div>
          <button
            onClick={onNavigateToCouples}
            className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-xl text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>{lang === 'km' ? 'ចូលទៅកាន់ Page គូស្នេហ៍' : 'Open Couples Page'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
