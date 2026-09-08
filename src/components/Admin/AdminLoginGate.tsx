import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  AUTHORIZED_ADMIN_EMAIL, 
  loginWithGoogle, 
  loginWithPasscode, 
  AdminUserState 
} from '../../lib/adminAuth';
import { Language } from '../../types';

interface AdminLoginGateProps {
  onSuccess: (user: AdminUserState) => void;
  onCancel: () => void;
  lang: Language;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onSuccess,
  onCancel,
  lang
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoadingGoogle(true);
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'បរាជ័យក្នុងការចូលគណនី');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'កំហុសបច្ចេកទេស');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithPasscode(passcode);
    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setErrorMsg(res.error || 'លេខកូដមិនត្រឹមត្រូវ');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 font-battambang">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE6E1] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header with Dark Gold Royal Luxury Theme */}
        <div className="bg-gradient-to-br from-[#0B132B] via-[#1C2A4A] to-[#0B132B] p-7 text-white text-center relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF1B6B]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] p-0.5 shadow-lg shadow-amber-500/20 mb-3.5">
              <div className="w-full h-full bg-[#0B132B] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>

            <span className="text-[11px] font-normal uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#DFBA49] border border-[#D4AF37]/30 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3" />
              {lang === 'km' ? 'ប្រព័ន្ធការពារសុវត្ថិភាព VIP' : 'Master Security Gate'}
            </span>

            <h2 className="text-xl sm:text-2xl font-normal font-khmer-title tracking-tight text-white">
              {lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង Admin' : 'Admin Portal Login'}
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              {lang === 'km' 
                ? 'ទិន្នន័យ និងសិទ្ធិគ្រប់គ្រងត្រូវបានភ្ជាប់ជាមួយ Email តែមួយគត់'
                : 'Authorized management is exclusively tied to one verified email address.'}
            </p>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Designated Admin Email Display Badge */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-amber-900">
                  {lang === 'km' ? 'គណនី Admin ផ្លូវការ' : 'Designated Admin Email'}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate tracking-tight font-mono">
                {AUTHORIZED_ADMIN_EMAIL}
              </div>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Option 1: Google Sign In Button */}
          <div>
            <button
              id="admin-google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-medium transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoadingGoogle ? (
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span>
                {lang === 'km' 
                  ? 'ចូលដោយប្រើ Google (Sign In with Google)'
                  : 'Sign in with Google Account'}
              </span>
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-1.5">
              {lang === 'km' 
                ? 'ផ្ទៀងផ្ទាត់ដោយផ្ទាល់ជាមួយអ៊ីមែល ' + AUTHORIZED_ADMIN_EMAIL
                : 'Direct authentication for ' + AUTHORIZED_ADMIN_EMAIL}
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 uppercase font-medium">
              {lang === 'km' ? 'ឬ បញ្ចូលកូដសម្ងាត់' : 'Or Admin Passcode'}
            </span>
          </div>

          {/* Option 2: Quick Passcode Login */}
          <form onSubmit={handlePasscodeLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {lang === 'km' ? 'លេខកូដសម្ងាត់ Admin (Passcode)' : 'Admin Security Key'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="********"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-end mt-1 text-[11px] text-gray-400">
                <span className="text-amber-600 font-medium">Instant Access</span>
              </div>
            </div>

            <button
              id="admin-passcode-submit-btn"
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#B8962D] hover:brightness-105 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់ និងចូល Admin' : 'Verify & Enter Admin'}</span>
            </button>
          </form>

          {/* Return to Public/Wedding View */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅមើលទំព័រគូស្វាមីភរិយា' : 'Return to Wedding Portal'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
