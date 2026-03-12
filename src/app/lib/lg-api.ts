/**
 * LG U+ Centrex REST API Client
 * API 문서: Centrex Rest API 연동 규격서 Version 4.2 (2025.11.05)
 *
 * 인증: id (070번호, 하이픈 제거) + pass (SHA-512 암호화된 비밀번호)
 * 기본 URL: https://centrex.uplus.co.kr/RestApi/ (CORS 없음 → /api/lg-proxy 경유)
 */

const PROXY_URL = '/api/lg-proxy';

// ─── SHA-512 암호화 (Web Crypto API) ──────────────────────────────────────────

export async function sha512(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── 공통 요청 ────────────────────────────────────────────────────────────────

async function lgRequest(endpoint: string, params: Record<string, string>): Promise<any> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, params }),
  });

  if (!response.ok) {
    throw new Error(`LG 프록시 오류 (${response.status})`);
  }

  return response.json();
}

// ─── 타입 정의 ────────────────────────────────────────────────────────────────

export interface LGInboundCall {
  NO: number;
  TIME: string;      // "2019-08-13 13:53:54" (서버 로컬 시간)
  SRC: string;       // 발신자 번호 (ex: "010XXXX9087")
  DST: string;       // 수신 070 번호
  DURATION: string;  // 통화 지속 시간(초)
  STATUS: 'ANSWERED' | 'NO ANSWER' | 'CANCEL' | 'BUSY' | 'FAILED';
  CHANNEL: string;
  DSTCHANNEL: string;
  ENDTIME: string;
  APPDATA: string;
}

export interface LGApiResponse<T = any> {
  SVC_RT: string;   // "0000" = 정상
  SVC_MSG: string;
  LISTINFO?: {
    page: string | number;
    numperpage: string | number;
    total: string | number;
  };
  DATAS: T | null;
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

/**
 * 외부인입번호별 수신 통화이력 조회 (항목 22)
 * STATUS: ANSWERED | NO ANSWER | CANCEL | BUSY | FAILED
 * 주의: id에 하이픈이 포함된 경우 자동 제거 (e.g. "070-7576-0371" → "07075760371")
 */
export async function getLGInboundCalls(
  id: string,
  passRaw: string,
  page = 1,
  numPerPage = 50
): Promise<LGApiResponse<LGInboundCall[]>> {
  const cleanId = id.replace(/-/g, '');
  const pass = await sha512(passRaw);
  return lgRequest('getinboundcall', {
    id: cleanId,
    pass,
    page: String(page),
    num_per_page: String(numPerPage),
  });
}

/**
 * 통화이력 조회 (항목 8) - inbound/outbound
 */
export async function getLGCallHistory(
  id: string,
  passRaw: string,
  calltype: 'inbound' | 'outbound' = 'inbound',
  page = 1
): Promise<LGApiResponse> {
  const cleanId = id.replace(/-/g, '');
  const pass = await sha512(passRaw);
  return lgRequest('callhistory', { id: cleanId, pass, calltype, page: String(page) });
}

/**
 * 문자 메시지 전송 (항목 9)
 * destnumber: 수신번호 (','로 구분하여 최대 10개)
 * smsmsg: SMS 80byte 이내, LMS 720byte 이내
 */
export async function sendLGSms(
  id: string,
  passRaw: string,
  destnumber: string,
  smsmsg: string
): Promise<{ success: boolean; restCount?: number; error?: string }> {
  const cleanId = id.replace(/-/g, '');
  const pass = await sha512(passRaw);
  const data = await lgRequest('smssend', { id: cleanId, pass, destnumber, smsmsg });
  return {
    success: data?.SVC_RT === '0000',
    restCount: data?.DATAS?.RESTCOUNT,
    error: data?.SVC_RT !== '0000' ? `[${data?.SVC_RT}] ${data?.SVC_MSG}` : undefined,
  };
}

/**
 * 미수신 여부 판단 (STATUS 기준)
 * NO ANSWER: 수신자가 받지 않음 (링 타임아웃)
 * CANCEL: 발신자가 연결 전 끊음
 */
export function isMissedCall(status: LGInboundCall['STATUS']): boolean {
  return status === 'NO ANSWER' || status === 'CANCEL';
}
