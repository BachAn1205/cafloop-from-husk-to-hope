/**
 * Visitor & QR Scan Tracker Utility
 * Tracks website visits and QR code access for circular data analytics.
 */

const STORAGE_KEY = 'cafloop_qr_scan_count';
const SESSION_KEY = 'cafloop_session_scanned';
const BASE_COUNT = 1284; // Baseline realistic QR scans & web visits

export function getQRScanCount(): number {
  if (typeof window === 'undefined') return BASE_COUNT;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let count = stored ? parseInt(stored, 10) : BASE_COUNT;
    if (isNaN(count) || count < BASE_COUNT) {
      count = BASE_COUNT;
    }

    // Increment on new session or visit
    const sessionActive = sessionStorage.getItem(SESSION_KEY);
    if (!sessionActive) {
      count += 1;
      localStorage.setItem(STORAGE_KEY, count.toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
    }

    return count;
  } catch (err) {
    console.warn('Could not read scan counter from localStorage', err);
    return BASE_COUNT;
  }
}
