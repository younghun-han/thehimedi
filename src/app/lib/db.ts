import { supabase } from './supabase';
import { Hospital, CallLog, MessageTemplate, AuthUser, PatientRegistration } from './types';

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
    // Auto-set password from code if not provided
    if (!row.password) row.password = hospital.code.toLowerCase() + 'pw';

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
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  async updateHospitalPassword(hospitalId: string, newPassword: string): Promise<void> {
    const { error } = await supabase
      .from('hospitals')
      .update({ password: newPassword })
      .eq('id', hospitalId);
    if (error) throw new Error(error.message);
  }

  // ── Logs ───────────────────────────────────────────────────────────────────

  async getLogs(): Promise<CallLog[]> {
    // Fetch both tables concurrently
    const [msgLogsRes, skbLogsRes] = await Promise.all([
      supabase.from('call_logs').select('*').order('timestamp', { ascending: false }).limit(500),
      supabase.from('skb_call_history').select('*').order('created_at', { ascending: false }).limit(500)
    ]);

    if (msgLogsRes.error) console.error('getLogs (msg):', msgLogsRes.error.message);
    if (skbLogsRes.error) console.error('getLogs (skb):', skbLogsRes.error.message);

    const msgLogs = (msgLogsRes.data ?? []).map(rowToLog);
    const skbLogs = (skbLogsRes.data ?? []).map((row: any): CallLog => {
      // Map SKB status -> CallLog status enum
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
        startedAt: row.started_at,
        endedAt: row.ended_at,
        durationSec: row.duration_sec
      }
    });

    // Merge and sort
    const merged = [...msgLogs, ...skbLogs].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return merged.slice(0, 500); // Return most recent 500 overall
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
    };
    // Only include id if it's a valid non-empty string (not a client-generated placeholder)
    if (log.id && !log.id.startsWith('m_') && !log.id.startsWith('l')) {
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
    // Delete all templates for this account first, then re-insert
    let deleteQuery = supabase.from('message_templates').delete();
    if (hospitalId === null) {
      deleteQuery = deleteQuery.is('hospital_id', null);
    } else if (hospitalId) {
      deleteQuery = deleteQuery.eq('hospital_id', hospitalId);
    } else {
      // fallback: delete nothing
      return templates;
    }
    await deleteQuery;

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
    if (error) throw new Error(error.message);
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
      return password === data.password ? { role: 'master' } : null;
    }

    const { data, error } = await supabase
      .from('hospitals')
      .select('id, code, name, password')
      .ilike('code', code)
      .single();
    if (error || !data) return null;

    const expectedPw = data.password || (data.code.toLowerCase() + 'pw');
    if (password === expectedPw) {
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
    const { error } = await supabase
      .from('master_config')
      .update({ password: newPassword })
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

  async createRegistration(reg: PatientRegistration): Promise<PatientRegistration> {
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
