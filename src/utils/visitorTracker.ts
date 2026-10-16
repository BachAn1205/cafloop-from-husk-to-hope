/**
 * Visitor tracker — mỗi phiên truy cập website = 1 lượt (QR / web visit).
 * Lưu vào bảng Supabase `qr_visits`, chống trùng theo session + promise lock.
 */

import { supabase } from './supabase';

const SESSION_KEY = 'cafloop_session_visit_recorded';

let inFlight: Promise<number> | null = null;

/** Tổng số lượt truy cập đã lưu trên database. */
export async function getQRVisitCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('qr_visits')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Không đọc được qr_visits:', error.message);
      return 0;
    }
    return count ?? 0;
  } catch (err) {
    console.warn('Lỗi getQRVisitCount:', err);
    return 0;
  }
}

/**
 * Ghi 1 lượt truy cập nếu chưa ghi trong session hiện tại.
 * Trả về tổng số lượt sau khi ghi (hoặc tổng hiện tại nếu đã ghi rồi).
 */
export async function recordSiteVisit(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const alreadyRecorded = sessionStorage.getItem(SESSION_KEY) === 'true';

      if (!alreadyRecorded) {
        const { error } = await supabase.from('qr_visits').insert({
          path: window.location.pathname || '/',
          referrer: document.referrer || null,
        });

        if (error) {
          console.warn('Không ghi được lượt truy cập:', error.message);
        } else {
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
      }

      return await getQRVisitCount();
    } catch (err) {
      console.warn('Lỗi recordSiteVisit:', err);
      return 0;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/** @deprecated Dùng getQRVisitCount / recordSiteVisit */
export async function getQRScanCount(): Promise<number> {
  return getQRVisitCount();
}
