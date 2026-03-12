/**
 * Vercel Serverless Function: LG Centrex API Proxy
 * LG Centrex API는 CORS를 지원하지 않으므로 서버 측에서 프록시 처리
 */

const LG_BASE_URL = 'https://centrex.uplus.co.kr/RestApi';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, params } = req.body || {};

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint is required' });
  }

  // 허용된 엔드포인트만 프록시
  const allowedEndpoints = [
    'getinboundcall',
    'callhistory',
    'smssend',
    'setringcallback',
    'getringcallback',
    'delringcallback',
  ];

  if (!allowedEndpoints.includes(endpoint)) {
    return res.status(403).json({ error: 'Endpoint not allowed' });
  }

  try {
    const formData = new URLSearchParams(params || {});
    const lgUrl = `${LG_BASE_URL}/${endpoint}`;

    const response = await fetch(lgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(200).send(text);
    }
  } catch (error) {
    console.error('LG proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
