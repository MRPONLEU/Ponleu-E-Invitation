import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth } from './firebase';

export const AUTHORIZED_ADMIN_EMAIL = 'mrponleu20000@gmail.com';
export const STORAGE_ADMIN_AUTH_KEY = 'einvitation_admin_session_v1';
const ADMIN_PASSCODES = ['Mr.@ponleu998'];

export interface AdminUserState {
  email: string;
  displayName: string;
  photoURL?: string;
  method: 'google' | 'passcode';
  loginTime: number;
}

export function getStoredAdminSession(): AdminUserState | null {
  try {
    const raw = localStorage.getItem(STORAGE_ADMIN_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && parsed.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse admin session', err);
  }
  return null;
}

export function saveAdminSession(session: AdminUserState) {
  try {
    localStorage.setItem(STORAGE_ADMIN_AUTH_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Failed to save admin session', err);
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(STORAGE_ADMIN_AUTH_KEY);
  } catch (err) {
    console.warn('Failed to clear admin session', err);
  }
}

export async function loginWithGoogle(): Promise<{ success: boolean; error?: string; user?: AdminUserState }> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    const email = fbUser.email?.toLowerCase();
    if (!email) {
      await fbSignOut(auth);
      return { success: false, error: 'មិនអាចទាញយកអាសយដ្ឋាន Email បានទេ' };
    }

    if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      await fbSignOut(auth);
      return { 
        success: false, 
        error: `គណនី (${email}) មិនមែនជា Admin ទេ។ ប្រព័ន្ធអនុញ្ញាតសម្រាប់តែ ${AUTHORIZED_ADMIN_EMAIL} តែប៉ុណ្ណោះ។` 
      };
    }

    const adminUser: AdminUserState = {
      email: AUTHORIZED_ADMIN_EMAIL,
      displayName: fbUser.displayName || 'Admin Ponleu',
      photoURL: fbUser.photoURL || undefined,
      method: 'google',
      loginTime: Date.now()
    };

    saveAdminSession(adminUser);
    return { success: true, user: adminUser };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    let message = error?.message || 'បរាជ័យក្នុងការចូលគណនី Google';
    if (error?.code === 'auth/popup-closed-by-user') {
      message = 'ផ្ទាំង Sign In ត្រូវបានបិទដោយអ្នកប្រើប្រាស់';
    } else if (error?.code === 'auth/popup-blocked') {
      message = 'Browser បានបិទផ្ទាំង Popup។ សូមបើក Popup ឬប្រើប្រាស់ Passcode';
    } else if (error?.code === 'auth/cancelled-popup-request') {
      message = 'សំណើ Sign In ត្រូវបានលុបចោល';
    }
    return { success: false, error: message };
  }
}

export function loginWithPasscode(passcode: string): { success: boolean; error?: string; user?: AdminUserState } {
  if (!passcode || !passcode.trim()) {
    return { success: false, error: 'សូមបញ្ចូលលេខកូដសម្ងាត់ Admin' };
  }

  const cleanPass = passcode.trim();
  const matched = ADMIN_PASSCODES.some(p => p === cleanPass);

  if (!matched) {
    return { success: false, error: 'លេខកូដសម្ងាត់ Admin មិនត្រឹមត្រូវទេ!' };
  }

  const adminUser: AdminUserState = {
    email: AUTHORIZED_ADMIN_EMAIL,
    displayName: 'Super Admin',
    method: 'passcode',
    loginTime: Date.now()
  };

  saveAdminSession(adminUser);
  return { success: true, user: adminUser };
}

export async function adminLogout(): Promise<void> {
  clearAdminSession();
  try {
    await fbSignOut(auth);
  } catch (e) {
    // Ignore signout error
  }
}
