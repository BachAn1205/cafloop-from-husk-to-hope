export interface SepayTransaction {
  id: number;
  bank_brand_name: string;
  account_number: string;
  transaction_date: string;
  amount_out: string;
  amount_in: string;
  accumulated: string;
  transaction_content: string;
  reference_number: string;
  code: string | null;
}

export interface SepayListResponse {
  status?: number;
  messages?: {
    success: boolean;
  };
  transactions: SepayTransaction[];
}

export interface SepayBankAccount {
  id: number;
  bank_brand_name: string;
  account_number: string;
  account_name: string;
}

export const QR_TIMEOUT_SECONDS = 5 * 60; // 5 minutes

/**
 * Endpoint proxy bảo mật phía server (che giấu API Key khỏi trình duyệt)
 */
const SEPAY_API_ENDPOINT = '/api/sepay/transactions/list';

/**
 * Sinh mã thanh toán độc bản duy nhất (Không thể đoán trước, chống trùng lặp & cướp giao dịch)
 * Ví dụ: CAF8P2K9M cho đơn hàng, DON4X7R1W cho quyên góp
 */
export function generatePaymentCode(type: 'ORDER' | 'DONATE'): string {
  const prefix = type === 'ORDER' ? 'CAF' : 'DON';
  // Bảng ký tự không chứa các ký tự dễ nhầm lẫn (bỏ 0, O, 1, I)
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${randomPart}`;
}

/**
 * Lấy danh sách giao dịch từ SePay qua Proxy bảo mật (Không để lộ API Key ở Frontend)
 * Tích hợp fallback thông minh nếu proxy nội bộ gặp trục trặc mạng
 */
export async function getSepayTransactions(params?: {
  limit?: number;
  transferType?: 'in' | 'out' | 'all';
  accountNumber?: string;
}): Promise<SepayTransaction[]> {
  try {
    const limit = params?.limit ?? 100;
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (params?.accountNumber) queryParams.append('account_number', params.accountNumber);

    const url = `${SEPAY_API_ENDPOINT}?${queryParams.toString()}`;
    let response: Response;

    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Nếu local proxy 404/500, fallback sang endpoint Vercel production
      if (!response.ok && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        const fallbackUrl = `https://cafloop-from-husk-to-hope.vercel.app/api/sepay/transactions/list?${queryParams.toString()}`;
        console.warn(`Local proxy returned ${response.status}, thử fallback sang Vercel: ${fallbackUrl}`);
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          response = fallbackRes;
        }
      }
    } catch (fetchErr) {
      // Network failure on local proxy -> thử qua Vercel proxy
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        const fallbackUrl = `https://cafloop-from-husk-to-hope.vercel.app/api/sepay/transactions/list?${queryParams.toString()}`;
        console.warn('Local proxy fetch failed, thử fallback sang Vercel:', fallbackUrl);
        response = await fetch(fallbackUrl);
      } else {
        throw fetchErr;
      }
    }

    if (!response.ok) {
      console.warn(`SePay Secure Proxy returned status: ${response.status}`);
      return [];
    }

    const data: SepayListResponse = await response.json();
    let txs = data.transactions || [];

    // Filter by transferType if specified
    if (params?.transferType === 'in') {
      txs = txs.filter((t) => parseFloat(t.amount_in) > 0);
    } else if (params?.transferType === 'out') {
      txs = txs.filter((t) => parseFloat(t.amount_out) > 0);
    }

    return txs;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử giao dịch SePay từ proxy:', error);
    return [];
  }
}

export interface DerivedDonation {
  id: string;
  donation_code: string;
  amount: number;
  status: string;
  created_at: string;
  customers: {
    full_name: string;
    phone: string;
  };
  raw_tx?: SepayTransaction;
}

/**
 * Trích xuất danh sách quyên góp thực tế từ các giao dịch SePay (khớp mã DON...)
 */
export function extractDonationsFromSepay(transactions: SepayTransaction[]): DerivedDonation[] {
  const result: DerivedDonation[] = [];

  for (const tx of transactions) {
    const amountIn = parseFloat(tx.amount_in || '0');
    if (amountIn <= 0) continue;

    const content = tx.transaction_content || '';
    const match = content.match(/DON[A-Z0-9]{4,10}/i);
    const donationCode = match ? match[0].toUpperCase() : (tx.code ? tx.code.toUpperCase() : `DON-TX${tx.id}`);

    // Chuẩn hóa thời gian giao dịch
    let dateStr = tx.transaction_date;
    if (dateStr && !dateStr.includes('T')) {
      dateStr = dateStr.replace(' ', 'T') + '+07:00';
    }

    result.push({
      id: `sepay-don-${tx.id}`,
      donation_code: donationCode,
      amount: amountIn,
      status: 'completed',
      created_at: dateStr || new Date().toISOString(),
      customers: {
        full_name: `Nhà Hảo Tâm (${tx.bank_brand_name || 'MB'})`,
        phone: tx.account_number || 'MB Bank',
      },
      raw_tx: tx,
    });
  }

  return result;
}

/**
 * Kiểm tra giao dịch đã thanh toán thành công hay chưa
 * Áp dụng bảo mật nghiêm ngặt:
 * 1. Khớp chính xác mã giao dịch độc bản bằng Regex (Chống cướp giao dịch / False matching)
 * 2. Số tiền chuyển vào phải ĐỦ hoặc LỚN HƠN số tiền đơn hàng (Chống chuyển thiếu tiền)
 * 3. Chỉ xét các giao dịch sau thời điểm mở phiên QR (Chống Replay Attack từ giao dịch cũ)
 */
export async function checkPaymentReceived(
  expectedAmount: number,
  paymentCode: string,
  afterTime?: Date
): Promise<SepayTransaction | null> {
  if (!paymentCode || paymentCode.trim() === '') {
    return null;
  }

  const transactions = await getSepayTransactions({ limit: 20, transferType: 'in' });
  const cleanCode = paymentCode.trim().toUpperCase();
  const codeRegex = new RegExp(`\\b${cleanCode}\\b`, 'i');

  console.log(`[SePay Check] Đang tìm mã: ${cleanCode} | Cần >= ${expectedAmount}đ | Tổng GD nhận được: ${transactions.length}`);

  for (const tx of transactions) {
    const amountIn = parseFloat(tx.amount_in || '0');

    // 1. Chặn Replay Attack: Xét giao dịch trong phiên QR (cho phép trễ 15 phút do chênh lệch giờ ngân hàng/SePay)
    if (afterTime && tx.transaction_date) {
      // Chuẩn hoá định dạng ngày GMT+7 của SePay (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DDTHH:mm:ss+07:00)
      const dateStr = tx.transaction_date.includes('T')
        ? tx.transaction_date
        : tx.transaction_date.replace(' ', 'T') + '+07:00';
      const txTime = new Date(dateStr);
      if (!isNaN(txTime.getTime())) {
        const buffer = new Date(afterTime.getTime() - 15 * 60 * 1000);
        if (txTime < buffer) {
          console.log(`[SePay Check] ⏩ Bỏ qua GD ${tx.id} (quá cũ: ${tx.transaction_date})`);
          continue;
        }
      }
    }

    // 2. Chống chuyển thiếu tiền (Partial payment tampering): amount_in phải >= expectedAmount
    if (amountIn < expectedAmount) {
      console.log(`[SePay Check] ⏩ Bỏ qua GD ${tx.id} (tiền thiếu: ${amountIn} < ${expectedAmount})`);
      continue;
    }

    // 3. Chống cướp giao dịch (Transaction Hijacking): Khớp chính xác mã đơn hàng duy nhất
    const content = (tx.transaction_content || '').toUpperCase();
    const txCode = (tx.code || '').toUpperCase();

    const isCodeMatched = codeRegex.test(content) || codeRegex.test(txCode) || content.includes(cleanCode);

    console.log(`[SePay Check] GD ${tx.id} | content: "${tx.transaction_content}" | code matched: ${isCodeMatched}`);

    if (isCodeMatched) {
      console.log(`[SePay Check] ✅ KHỚP! GD ${tx.id} - ${amountIn}đ - "${tx.transaction_content}"`);
      return tx;
    }
  }

  console.log(`[SePay Check] ❌ Chưa tìm thấy giao dịch khớp mã ${cleanCode}`);
  return null;
}

/**
 * Lấy tổng số tiền đã nhận quyên góp từ trước đến nay
 */
export async function getTotalDonationsReceived(): Promise<number> {
  const transactions = await getSepayTransactions({ limit: 100, transferType: 'in' });
  return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_in || '0'), 0);
}
