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
 */
export async function getSepayTransactions(params?: {
  limit?: number;
  transferType?: 'in' | 'out' | 'all';
  accountNumber?: string;
}): Promise<SepayTransaction[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.accountNumber) queryParams.append('account_number', params.accountNumber);

    const url = `${SEPAY_API_ENDPOINT}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
        if (txTime < buffer) continue;
      }
    }

    // 2. Chống chuyển thiếu tiền (Partial payment tampering): amount_in phải >= expectedAmount
    if (amountIn < expectedAmount) {
      continue;
    }

    // 3. Chống cướp giao dịch (Transaction Hijacking): Khớp chính xác mã đơn hàng duy nhất
    const content = (tx.transaction_content || '').toUpperCase();
    const txCode = (tx.code || '').toUpperCase();

    const isCodeMatched = codeRegex.test(content) || codeRegex.test(txCode) || content.includes(cleanCode);

    if (isCodeMatched) {
      return tx;
    }
  }

  return null;
}

/**
 * Lấy tổng số tiền đã nhận quyên góp từ trước đến nay
 */
export async function getTotalDonationsReceived(): Promise<number> {
  const transactions = await getSepayTransactions({ limit: 100, transferType: 'in' });
  return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_in || '0'), 0);
}
