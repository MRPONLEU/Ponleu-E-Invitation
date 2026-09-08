import React, { useState, useEffect } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Language, CoupleEvent } from '../../types';

interface CoupleLoginGateProps {
  children: React.ReactNode;
  lang: Language;
  couple: CoupleEvent;
}

export function CoupleLoginGate({ children, lang, couple }: CoupleLoginGateProps) {
  const sessionKey = `couple_auth_${couple.id}`;
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(sessionKey) === 'true';
    } catch {
      return false;
    }
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If no auth details are set for this couple, let them in automatically (for backward compatibility)
  const requiresAuth = !!(couple.manageUsername || couple.managePassword);

  useEffect(() => {
    // Check session for this specific couple
    try {
      const storedAuth = sessionStorage.getItem(sessionKey) === 'true';
      setIsAuthenticated(storedAuth);
    } catch {
      setIsAuthenticated(false);
    }
    setUsername('');
    setPassword('');
    setError(null);
  }, [couple.id, sessionKey]);

  if (!requiresAuth || isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validUsername = (couple.manageUsername || '').trim().toLowerCase();
    const validPassword = couple.managePassword || '';

    // If both are required but only one is set, we still check what's set.
    const isUsernameMatch = !validUsername || username.trim().toLowerCase() === validUsername;
    const isPasswordMatch = !validPassword || password === validPassword;

    if (isUsernameMatch && isPasswordMatch) {
      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        console.warn('Could not save session', err);
      }
      setIsAuthenticated(true);
    } else {
      setError(lang === 'km' ? 'ឈ្មោះអ្នកប្រើប្រាស់ ឬលេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ!' : 'Invalid username or password!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-[#EAE6E1]">
        <div className="p-8 text-center bg-gradient-to-b from-amber-50 to-white">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-khmer-title text-gray-900 mb-2">
            {lang === 'km' ? 'ចូលផ្ទាំងគ្រប់គ្រងសំបុត្រ' : 'Manage Invitation'}
          </h2>
          <p className="text-sm text-gray-500 font-sans">
            {lang === 'km' ? `${couple.groomNameKh} និង ${couple.brideNameKh}` : `${couple.groomNameEn} & ${couple.brideNameEn}`}
          </p>
        </div>

        <div className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-4">
            {couple.manageUsername && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">
                  {lang === 'km' ? 'ឈ្មោះអ្នកប្រើប្រាស់' : 'Username'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={lang === 'km' ? 'បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់...' : 'Enter username...'}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {couple.managePassword && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">
                  {lang === 'km' ? 'លេខកូដសម្ងាត់' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-center animate-in fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white text-sm font-medium rounded-xl shadow-md hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {lang === 'km' ? 'ចូលប្រើប្រាស់' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
