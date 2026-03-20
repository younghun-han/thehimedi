/**
 * Solapi SMS Service
 * API 키는 서버 사이드 Vercel Function(/api/send-sms)에서만 처리
 * 클라이언트 번들에 노출되지 않음
 */

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
 * /api/send-sms Vercel 서버리스 함수를 통해 발송 (API 키 서버 격리)
 */
export async function sendMessages(
    messages: SolapiMessage[]
): Promise<{ successCount: number; failCount: number; results: SolapiSendResult[] }> {
    // 메시지 타입 자동 결정 및 번호 포맷
    const formattedMessages = messages.map(msg => {
        const type = msg.type ?? (msg.text.length > 45 ? 'LMS' : 'SMS');
        return {
            to: msg.to.replace(/-/g, ''),
            from: msg.from.replace(/-/g, ''),
            text: msg.text,
            type,
            // LMS 미설정 시 첫 40바이트가 자동 제목으로 들어가 내용 중복 표시됨
            ...(type === 'LMS' ? { subject: '안내' } : {}),
        };
    });

    const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: formattedMessages }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error || `SMS 발송 오류 (${response.status})`);
    }

    // 결과 파싱 (send-many 응답: group 객체)
    const registeredSuccess = data?.count?.registeredSuccess ?? 0;
    const results: SolapiSendResult[] = formattedMessages.map((msg) => ({
        success: registeredSuccess > 0,
        messageId: data?.groupId,
        to: msg.to,
        error: registeredSuccess === 0
            ? (data?.log?.slice(-1)?.[0]?.message || JSON.stringify(data))
            : undefined,
    }));

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return { successCount, failCount, results };
}
