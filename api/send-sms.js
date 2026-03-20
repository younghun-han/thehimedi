/**
 * Vercel Serverless Function: Solapi SMS 발송
 * API 키를 서버 환경변수에서 읽어 클라이언트에 노출하지 않음
 */

const SOLAPI_ENDPOINT = 'https://api.solapi.com/messages/v4/send-many';

async function generateSignature(apiSecret, date, salt) {
    const message = date + salt;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(apiSecret);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function buildAuthHeader(apiKey, apiSecret) {
    const date = new Date().toISOString();
    const salt = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
    const signature = await generateSignature(apiSecret, date, salt);
    return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY;
    const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET;

    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
        return res.status(500).json({ error: 'Solapi API 키가 서버에 설정되지 않았습니다.' });
    }

    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages 배열이 필요합니다.' });
    }

    try {
        const authHeader = await buildAuthHeader(SOLAPI_API_KEY, SOLAPI_API_SECRET);
        const response = await fetch(SOLAPI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: authHeader },
            body: JSON.stringify({ messages }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data?.message || `Solapi 오류 (${response.status})`, raw: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('send-sms error:', error);
        return res.status(500).json({ error: error.message });
    }
}
