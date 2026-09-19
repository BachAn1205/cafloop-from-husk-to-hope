/**
 * Vercel Serverless Function: /api/sepay/transactions/list
 * Proxy bảo mật: Chuyển tiếp request tới SePay API với Bearer token phía server
 * Che giấu SEPAY_API_KEY khỏi trình duyệt (chỉ được đọc ở server runtime)
 */
export default async function handler(req, res) {
  // Chỉ chấp nhận GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.SEPAY_API_KEY || '';
  if (!apiKey) {
    return res.status(500).json({ error: 'SEPAY_API_KEY is not configured on server' });
  }

  try {
    // Chuyển tiếp query params từ client (limit, account_number, ...)
    const query = req.url ? req.url.split('?')[1] || '' : '';
    const targetUrl = `https://my.sepay.vn/userapi/transactions/list${query ? `?${query}` : ''}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();
    res.status(response.status).setHeader('Content-Type', 'application/json').send(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
}
