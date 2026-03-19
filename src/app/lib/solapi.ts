/**
 * Solapi SMS Service
 * 솔라피 REST API를 사용하여 실제 SMS 발송
 * Auth: HMAC-SHA256 (apiKey + date + salt → signature)
 */

const SOLAPI_API_KEY = (import.meta as any).env?.VITE_SOLAPI_API_KEY as string;
const SOLAPI_API_SECRET = (import.meta as any).env?.VITE_SOLAPI_API_SECRET as string;
const SOLAPI_ENDPOINT = 'https://api.solapi.com/messages/v4/send-many';

// HMAC-SHA256 서명 생성 (Web Crypto API 사용)
async function generateSignature(date: string, salt: string): Promise<string> {
    const message = date + salt;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SOLAPI_API_SECRET);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Authorization 헤더 생성
async function buildAuthHeader(): Promise<string> {
    const date = new Date().toISOString();
    const salt = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
    const signature = await generateSignature(date, salt);
    return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

export interface SolapiMessage {
    to: string;       // 수신자 번호 (e.g. "01012345678")
    from: string;     // 발신자 번호 (솔라피 등록된 번호)
    text: string;     // 메시지 내용
    type?: 'SMS' | 'LMS' | 'MMS'; // 기본값: 45자 이하 SMS, 초과 LMS
}

export interface SolapiSendResult {
    success: boolean;
    messageId?: string;
    to: string;
    error?: string;
}

/**
 * 단건 또는 다건 메시지 발송
 */
export async function sendMessages(
    messages: SolapiMessage[]
): Promise<{ successCount: number; failCount: number; results: SolapiSendResult[] }> {
    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
        throw new Error('솔라피 API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }

    const authHeader = await buildAuthHeader();

    // 메시지 타입 자동 결정
    const formattedMessages = messages.map(msg => ({
        to: msg.to.replace(/-/g, ''), // 하이픈 제거
        from: msg.from.replace(/-/g, ''),
        text: msg.text,
        type: msg.type ?? (msg.text.length > 45 ? 'LMS' : 'SMS'),
    }));

    const body = {
        messages: formattedMessages,
    };

    const response = await fetch(SOLAPI_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || `솔라피 API 오류 (${response.status})`);
    }

    // 결과 파싱 (send-many 응답은 group 객체, messages 배열 없음)
    const registeredSuccess = data?.count?.registeredSuccess ?? 0;
    const results: SolapiSendResult[] = formattedMessages.map((msg) => ({
        success: registeredSuccess > 0,
        messageId: data?.groupId,
        to: msg.to,
        error: registeredSuccess === 0 ? (data?.log?.slice(-1)?.[0]?.message || JSON.stringify(data)) : undefined,
    }));

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return { successCount, failCount, results };
}
