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
  status: number;
  messages: {
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

export const QR_TIMEOUT_SECONDS = 5 * 60;

const SEPAY_BASE_URL = typeof window !== 'undefined' ? '/sepay-api' : 'https://my.sepay.vn/userapi';

function getApiKey(): string {
  return (
    import.meta.env.VITE_SEPAY_API_KEY ||
    import.meta.env.SEPAY_API_KEY ||
    ''
  );
}

/**
  * Lấy danh sách giao dịch từ SePay (Tiền vào / Tiền ra)
  */
export async function getSepayTransactions(params?: {
  limit?: number;
  transferType?: 'in' | 'out' | 'all';
  accountNumber?: string;
}): Promise<SepayTransaction[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('SePay API Key chưa được cấu hình trong .env');
    return [];
  }

  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.accountNumber) queryParams.append('account_number', params.accountNumber);

    const url = `${SEPAY_BASE_URL}/transactions/list?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SePay API Error: ${response.statusText}`);
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
    console.error('Lỗi khi tải lịch sử giao dịch SePay:', error);
    return [];
  }
}

/**
  * Kiểm tra giao dịch đã chuyển tiền thành công chưa (dựa trên Số tiền & Nội dung / SĐT)
  * @param afterTime - Chỉ trả về các giao dịch sau thời điểm này (phòng tránh lựa chọn giao dịch cũ)
  */
export async function checkPaymentReceived(
  expectedAmount: number,
  phone?: string,
  name?: string,
  afterTime?: Date
): Promise<SepayTransaction | null> {
  const transactions = await getSepayTransactions({ limit: 20, transferType: 'in' });

  for (const tx of transactions) {
    const amountIn = parseFloat(tx.amount_in || '0');

    // 0. Lọc giao dịch cũ hơn thời điểm mở QR
    if (afterTime) {
      const txTime = new Date(tx.transaction_date);
      // Cho phép 30 giây trước khi mở QR (buffer for clock skew)
      const buffer = new Date(afterTime.getTime() - 30 * 1000);
      if (txTime < buffer) continue;
    }

    // 1. Kiểm tra số tiền nhận khớp với số tiền người dùng nhập
    if (Math.abs(amountIn - expectedAmount) < 1) {
      const content = (tx.transaction_content || '').toLowerCase();
      const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
      const cleanName = name ? name.toLowerCase().trim() : '';

      // 2. Linh hoạt khớp nội dung
      if (
        (!cleanPhone && !cleanName) ||
        (cleanPhone && content.includes(cleanPhone)) ||
        (cleanName && content.includes(cleanName)) ||
        content.includes('ung ho') ||
        content.includes('caf') ||
        content.includes('cafloop') ||
        (tx.code && (tx.code.toLowerCase().includes(cleanPhone) || tx.code.toLowerCase().includes(cleanName)))
      ) {
        return tx;
      }
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
