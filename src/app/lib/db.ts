import { supabase } from './supabase';
import { Hospital, CallLog, MessageTemplate, AuthUser, PatientRegistration } from './types';

// ─── 비밀번호 해싱 (SHA-256) ────────────────────────────────────────────────────
async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 해시 비교 (타이밍 공격 방지용 상수 시간 비교) */
async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  // 해시된 값인 경우 (64자 hex)
  if (stored.length === 64) {
    const hashed = await hashPassword(plain);
    return hashed === stored;
  }
  // 레거시 평문 비교 (마이그레이션 기간 하위 호환)
  return plain === stored;
}

// ─── 타입 매핑 헬퍼 ────────────────────────────────────────────────────────────

function rowToHospital(row: any): Hospital {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    password: row.password,
    missedCalls: row.missed_calls ?? 0,
    status: row.status ?? 'Active',
    message: row.message ?? '',
    landingLink: row.landing_link ?? '',
    apiKey: row.api_key ?? '',
    carrierApiKey: row.carrier_api_key ?? '',
    carrierApiPass: row.carrier_api_pass ?? '',
    carrier: row.carrier ?? undefined,
    senderNumber: row.sender_number ?? '',
    enableCallEnded: row.enable_call_ended ?? false,
    callEndedMessage: row.call_ended_message ?? '',
    manualMessage: row.manual_message ?? '',
  };
}

function hospitalToRow(h: Hospital) {
  return {
    id: h.id,
    code: h.code,
    name: h.name,
    password: h.password ?? (h.code.toLowerCase() + 'pw'),
    missed_calls: h.missedCalls,
    status: h.status,
    message: h.message,
    landing_link: h.landingLink,
    api_key: h.apiKey,
    carrier_api_key: h.carrierApiKey,
    carrier_api_pass: h.carrierApiPass ?? '',
    carrier: h.carrier ?? null,
    sender_number: h.senderNumber ?? '',
    enable_call_ended: h.enableCallEnded,
    call_ended_message: h.callEndedMessage,
    manual_message: h.manualMessage,
  };
}

function rowToLog(row: any): CallLog {
  return {
    id: row.id,
    hospitalId: row.hospital_id,
    timestamp: row.timestamp,
    callerNumber: row.caller_number,
    receiverNumber: row.receiver_number,
    status: row.status as 'Success' | 'Failed' | 'Incoming' | 'Missed' | 'Completed',
    content: row.content,
    landingVisits: row.landing_visits ?? 0,
    lastLandingVisit: row.last_landing_visit ?? undefined,
    triggerType: row.trigger_type ?? 'missed',
    type: 'message', // Default to message for standard call_logs table
    errorMessage: row.error_message,
  };
}

function rowToTemplate(row: any): MessageTemplate {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    content: row.content,
    lastModified: row.last_modified,
  };
}

function rowToRegistration(row: any): PatientRegistration {
  return {
    id: row.id,
    hospitalId: row.hospital_id,
    name: row.name,
    phone: row.phone,
    purpose: row.purpose,
    submittedAt: row.submitted_at,
  };
}

function rowToSkbCallLog(row: any): import('./types').SKBCallLog {
  return {
    id: row.id,
    hospitalId: row.hospital_id,
    callType: row.call_type,
    callerNumber: row.caller_number,
    receiverNumber: row.receiver_number,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    durationSec: row.duration_sec,
    createdAt: row.created_at,
  };
}

// ─── Auth 세션 (sessionStorage 유지) ─────────────────────────────────────────

const SESSION_KEY = 'app_auth_session';

// ─── DB 클래스 ────────────────────────────────────────────────────────────────

class SupabaseDB {

  // ── Hospitals ──────────────────────────────────────────────────────────────

  async getHospitals(): Promise<Hospital[]> {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) { console.error('getHospitals:', error.message); return []; }
    return (data ?? []).map(rowToHospital);
  }

  async createHospital(hospital: Hospital): Promise<Hospital> {
    const row = hospitalToRow(hospital);
    // Let Supabase generate UUID - remove empty id
    if (!row.id) delete (row as any).id;
    // Auto-set password from code if not provided, then hash it
    const plainPw = row.password || (hospital.code.toLowerCase() + 'pw');
    row.password = await hashPassword(plainPw);

    const { data, error } = await supabase
      .from('hospitals')
      .insert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToHospital(data);
  }

  async updateHospital(hospital: Hospital): Promise<Hospital> {
    const { data, error } = await supabase
      .from('hospitals')
      .update(hospitalToRow(hospital))
      .eq('id', hospital.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToHospital(data);
  }

  async deleteHospital(id: string): Promise<void> {
    // message_templates에는 hospital_id FK CASCADE가 없으므로 먼저 수동 삭제
    await supabase.from('message_templates').delete().eq('hospital_id', id);
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  async updateHospitalPassword(hospitalId: string, newPassword: string): Promise<void> {
    const hashed = await hashPassword(newPassword);
    const { error } = await supabase
      .from('hospitals')
      .update({ password: hashed })
      .eq('id', hospitalId);
    if (error) throw new Error(error.message);
  }

  // ── Logs ───────────────────────────────────────────────────────────────────

  async getLogs(): Promise<CallLog[]> {
    // Fetch both tables concurrently (한 테이블당 1000건 → 병합 후 최신 1000건 반환)
    const [msgLogsRes, skbLogsRes] = await Promise.all([
      supabase.from('call_logs').select('*').order('timestamp', { ascending: false }).limit(1000),
      supabase.from('skb_call_history').select('*').order('created_at', { ascending: false }).limit(1000)
    ]);

    if (msgLogsRes.error) console.error('getLogs (msg):', msgLogsRes.error.message);
    if (skbLogsRes.error) console.error('getLogs (skb):', skbLogsRes.error.message);

    const msgLogs = (msgLogsRes.data ?? []).map(rowToLog);
    const skbLogs = (skbLogsRes.data ?? []).map((row: any): CallLog => {
      let status: CallLog['status'] = 'Completed';
      let triggerType: CallLog['triggerType'] = 'skb_completed';
      if (row.call_type === 'incoming') { status = 'Incoming'; triggerType = 'skb_incoming'; }
      if (row.call_type === 'missed') { status = 'Missed'; triggerType = 'skb_missed'; }

      return {
        id: row.id,
        hospitalId: row.hospital_id,
        timestamp: row.created_at,
        callerNumber: row.caller_number,
        receiverNumber: row.receiver_number,
        status,
        content: `SKB통화 (${row.call_type})`,
        triggerType,
        type: 'skb_call',
        landingVisits: 0, // #13: SKB 로그는 랜딩 트래킹 없음 → 기본값 0
        startedAt: row.started_at,
        endedAt: row.ended_at,
        durationSec: row.duration_sec
      }
    });

    const merged = [...msgLogs, ...skbLogs].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return merged.slice(0, 1000); // #10: 최신 1000건 반환
  }

  async createLog(log: CallLog): Promise<CallLog> {
    const row: any = {
      hospital_id: log.hospitalId,
      timestamp: log.timestamp,
      caller_number: log.callerNumber,
      receiver_number: log.receiverNumber,
      status: log.status,
      content: log.content,
      landing_visits: log.landingVisits ?? 0,
      last_landing_visit: log.lastLandingVisit ?? null,
      trigger_type: log.triggerType ?? 'missed',
      error_message: log.errorMessage ?? null,
    };
    // In order for tracking to work, the ID generated by the client must exactly match the DB ID. 
    // If the client provides an ID, we MUST use it, as it's embedded in the SMS text.
    if (log.id) {
      row.id = log.id;
    }
    const { data, error } = await supabase
      .from('call_logs')
      .insert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToLog(data);
  }

  async getSkbCallLogs(hospitalId?: string): Promise<import('./types').SKBCallLog[]> {
    let query = supabase
      .from('skb_call_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId);
    }

    const { data, error } = await query;
    if (error) { console.error('getSkbCallLogs:', error.message); return []; }
    return (data ?? []).map(rowToSkbCallLog);
  }

  // ── Templates ─────────────────────────────────────────────────────────────

  async getTemplates(hospitalId?: string | null): Promise<MessageTemplate[]> {
    let query = supabase
      .from('message_templates')
      .select('*')
      .order('last_modified', { ascending: false });

    if (hospitalId === null) {
      // master: templates where hospital_id IS NULL
      query = query.is('hospital_id', null);
    } else if (hospitalId) {
      // user: templates where hospital_id matches
      query = query.eq('hospital_id', hospitalId);
    }

    const { data, error } = await query;
    if (error) { console.error('getTemplates:', error.message); return []; }
    return (data ?? []).map(rowToTemplate);
  }

  async updateTemplates(templates: MessageTemplate[], hospitalId?: string | null): Promise<MessageTemplate[]> {
    // 삭제 전 현재 템플릿 백업 (삽입 실패 시 롤백용)
    let deleteQuery = supabase.from('message_templates').delete();
    if (hospitalId === null) {
      deleteQuery = deleteQuery.is('hospital_id', null);
    } else if (hospitalId) {
      deleteQuery = deleteQuery.eq('hospital_id', hospitalId);
    } else {
      return templates;
    }

    // 백업 조회
    let backupQuery = supabase.from('message_templates').select('*');
    if (hospitalId === null) backupQuery = backupQuery.is('hospital_id', null);
    else if (hospitalId) backupQuery = backupQuery.eq('hospital_id', hospitalId);
    const { data: backup } = await backupQuery;

    const { error: deleteError } = await deleteQuery;
    if (deleteError) throw new Error(deleteError.message);

    if (templates.length === 0) return [];

    const rows = templates.map(t => ({
      ...(t.id ? { id: t.id } : {}),
      name: t.name,
      type: t.type,
      content: t.content,
      last_modified: t.lastModified,
      hospital_id: hospitalId ?? null,
    }));

    const { data, error } = await supabase
      .from('message_templates')
      .insert(rows)
      .select();

    if (error) {
      // 삽입 실패 시 백업 복원 시도
      if (backup && backup.length > 0) {
        await supabase.from('message_templates').insert(backup).select();
      }
      throw new Error(`템플릿 저장 실패: ${error.message}. 이전 데이터 복원을 시도했습니다.`);
    }
    return (data ?? []).map(rowToTemplate);
  }


  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(code: string, password: string): Promise<AuthUser | null> {
    if (code.toLowerCase() === 'master') {
      const { data, error } = await supabase
        .from('master_config')
        .select('password')
        .eq('id', 1)
        .single();
      if (error || !data) return null;
      const masterOk = await verifyPassword(password, data.password);
      return masterOk ? { role: 'master' } : null;
    }

    const { data, error } = await supabase
      .from('hospitals')
      .select('id, code, name, password')
      .ilike('code', code)
      .single();
    if (error || !data) return null;

    const storedPw = data.password || (data.code.toLowerCase() + 'pw');
    const ok = await verifyPassword(password, storedPw);
    if (ok) {
      return {
        role: 'user',
        hospitalId: data.id,
        hospitalCode: data.code,
        hospitalName: data.name,
      };
    }
    return null;
  }

  getSession(): AuthUser | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  saveSession(user: AuthUser): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }

  async updateMasterPassword(newPassword: string): Promise<void> {
    const hashed = await hashPassword(newPassword);
    const { error } = await supabase
      .from('master_config')
      .update({ password: hashed })
      .eq('id', 1);
    if (error) throw new Error(error.message);
  }

  // ── Patient Registrations ─────────────────────────────────────────────────

  async getRegistrations(hospitalId?: string): Promise<PatientRegistration[]> {
    let query = supabase
      .from('patient_registrations')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (hospitalId) query = query.eq('hospital_id', hospitalId);
    const { data, error } = await query;
    if (error) { console.error('getRegistrations:', error.message); return []; }
    return (data ?? []).map(rowToRegistration);
  }

  async createRegistration(reg: Omit<PatientRegistration, 'id' | 'submittedAt'>): Promise<PatientRegistration> {
    const row = {
      hospital_id: reg.hospitalId,
      name: reg.name,
      phone: reg.phone,
      purpose: reg.purpose,
    };
    const { data, error } = await supabase
      .from('patient_registrations')
      .insert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToRegistration(data);
  }

  async deleteRegistration(id: string): Promise<void> {
    const { error } = await supabase
      .from('patient_registrations')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  async deleteRegistrationsByPhone(phone: string, hospitalId?: string): Promise<void> {
    let query = supabase.from('patient_registrations').delete().eq('phone', phone);
    if (hospitalId) query = (query as any).eq('hospital_id', hospitalId);
    const { error } = await query;
    if (error) throw new Error(error.message);
  }

  async deleteAllRegistrations(hospitalId?: string): Promise<void> {
    let query = supabase.from('patient_registrations').delete();
    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId);
    } else {
      query = (query as any).not('id', 'is', null);
    }
    const { error } = await query;
    if (error) throw new Error(error.message);
  }

  async deleteLogsByPhone(phone: string, hospitalId?: string): Promise<void> {
    let queryMsg = supabase.from('call_logs').delete().or(`caller_number.eq.${phone},receiver_number.eq.${phone}`);
    if (hospitalId) queryMsg = (queryMsg as any).eq('hospital_id', hospitalId);

    let querySkb = supabase.from('skb_call_history').delete().or(`caller_number.eq.${phone},receiver_number.eq.${phone}`);
    if (hospitalId) querySkb = (querySkb as any).eq('hospital_id', hospitalId);

    const [msgRes, skbRes] = await Promise.all([queryMsg, querySkb]);
    if (msgRes.error) throw new Error(msgRes.error.message);
    if (skbRes.error) throw new Error(skbRes.error.message);
  }

  async deleteAllLogs(hospitalId?: string): Promise<void> {
    let queryMsg = supabase.from('call_logs').delete();
    if (hospitalId) queryMsg = queryMsg.eq('hospital_id', hospitalId);
    else queryMsg = (queryMsg as any).not('id', 'is', null);

    let querySkb = supabase.from('skb_call_history').delete();
    if (hospitalId) querySkb = querySkb.eq('hospital_id', hospitalId);
    else querySkb = (querySkb as any).not('id', 'is', null);

    const [msgRes, skbRes] = await Promise.all([queryMsg, querySkb]);
    if (msgRes.error) throw new Error(msgRes.error.message);
    if (skbRes.error) throw new Error(skbRes.error.message);
  }

  async incrementLandingVisits(logId: string): Promise<void> {
    // Increment the landing_visits counter and update last_landing_visit timestamp
    const { error } = await supabase.rpc('increment_landing_visits', { log_id: logId });
    if (error) {
      // Fallback: manual increment if RPC not available
      const { data: current } = await supabase
        .from('call_logs')
        .select('landing_visits')
        .eq('id', logId)
        .single();
      const currentVisits = current?.landing_visits ?? 0;
      await supabase
        .from('call_logs')
        .update({
          landing_visits: currentVisits + 1,
          last_landing_visit: new Date().toISOString(),
        })
        .eq('id', logId);
    }
  }
}

export const db = new SupabaseDB();
