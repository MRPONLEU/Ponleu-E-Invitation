// Centralized URL Helper for E-Invitation and Couple Portals
// Prevents Google 403 Forbidden errors when sharing links from development sandbox

const STORAGE_CUSTOM_URL_KEY = 'wedding_custom_public_url_v1';
export const DEFAULT_SHARED_APP_URL = 'https://ais-pre-255ksygkliubjzkw7nl5hs-346599610180.asia-southeast1.run.app';

/**
 * Check if the current origin or URL is a private developer sandbox that requires Google account authentication
 */
export function isPrivateDevEnvironment(url?: string): boolean {
  try {
    const target = url || (typeof window !== 'undefined' ? window.location.origin : '');
    return (
      target.includes('ais-dev-') || 
      target.includes('aistudio.google.com') || 
      target.includes('localhost') || 
      target.includes('127.0.0.1')
    );
  } catch {
    return false;
  }
}

/**
 * Get user configured public domain or default public URL
 */
export function getStoredCustomBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_CUSTOM_URL_KEY) || '';
  } catch {
    return '';
  }
}

export function saveCustomBaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed) {
      localStorage.setItem(STORAGE_CUSTOM_URL_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_CUSTOM_URL_KEY);
    }
  } catch (err) {
    console.warn('Failed to save custom base url', err);
  }
}

/**
 * Get the best public-accessible Base URL for guests and couples
 */
export function getAppBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  
  // 1. If user specified a custom domain (e.g. deployed domain)
  const custom = getStoredCustomBaseUrl();
  if (custom) return custom;

  const currentOrigin = window.location.origin;

  // 2. If running inside the private developer sandbox (ais-dev-), 
  // sharing this directly to guests causes Google 403 Forbidden.
  // We prefer the public Shared App URL if available, or fallback gracefully.
  if (currentOrigin.includes('ais-dev-')) {
    // When on ais-dev, the public counterpart is ais-pre
    return currentOrigin.replace('ais-dev-', 'ais-pre-');
  }

  return currentOrigin;
}

/**
 * Generate full guest invitation link
 */
export function getGuestInvitationUrl(coupleSlug: string, guestCode?: string): string {
  const base = getAppBaseUrl();
  const cleanSlug = encodeURIComponent(coupleSlug.trim());
  if (guestCode) {
    return `${base}/?c=${cleanSlug}&guest=${encodeURIComponent(guestCode.trim())}`;
  }
  return `${base}/?c=${cleanSlug}`;
}

/**
 * Generate full couple portal management link
 */
export function getCouplePortalUrl(coupleSlug: string): string {
  const base = getAppBaseUrl();
  const cleanSlug = encodeURIComponent(coupleSlug.trim());
  return `${base}/#manage/${cleanSlug}`;
}
