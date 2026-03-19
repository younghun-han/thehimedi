/**
 * Vercel Cron Job: LG Centrex 미수신 감지 → Solapi SMS 자동 발송
 *
 * - 매 1분마다 실행 (Vercel Pro) 또는 외부 크론 서비스에서 POST 호출
 * - 브라우저 없이도 동작 (서버사이드)
 * - 상태 저장: hospitals.lg_last_call_time (마지막 처리한 LG 통화 TIME)
 */

import { createClient } from '@supabase/supabase-js';
import { createHash, createHmac } from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SOLAPI_API_KEY = process.env.VITE_SOLAPI_API_KEY;
const SOLAPI_API_SECRET = process.env.VITE_SOLAPI_API_SECRET;

// ─── Solapi HMAC-SHA256 인증 ─────────────────────────────────────────────────

async function buildSolapiAuth() {
  const date = new Date().toISOString();
  const salt = Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 14);
  const signature = createHmac('sha256', SOLAPI_API_SECRET)
    .update(date + salt)
    .digest('hex');
  return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

async function sendSolapiSms(to, from, text) {
  const auth = await buildSolapiAuth();
  const type = text.length > 45 ? 'LMS' : 'SMS';
  const res = await fetch('https://api.solapi.com/messages/v4/send-many', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({
      messages: [{ to: to.replace(/-/g, ''), from: from.replace(/-/g, ''), text, type }],
    }),
  });
  const data = await res.json();
  // send-many 응답은 group 객체 (messages 배열 없음)
  const success = (data?.count?.registeredSuccess ?? 0) > 0;
  return {
    success,
    error: !success ? (data?.log?.slice(-1)?.[0]?.message || JSON.stringify(data)) : undefined,
  };
}

// ─── LG API 호출 ─────────────────────────────────────────────────────────────

async function getLGInboundCalls(id, passRaw, numPerPage = 50) {
  const cleanId = id.replace(/-/g, '');
  const pass = createHash('sha512').update(passRaw).digest('hex');
  const params = new URLSearchParams({ id: cleanId, pass, page: '1', num_per_page: String(numPerPage) });
  const res = await fetch('https://centrex.uplus.co.kr/RestApi/getinboundcall', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  return res.json();
}

// ─── 메인 핸들러 ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Vercel 크론 또는 CRON_SECRET 토큰으로 보안
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase env vars missing' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const results = [];

  // LG 통신사 병원 조회
  const { data: hospitals, error: hospErr } = await supabase
    .from('hospitals')
    .select('*')
    .eq('carrier', 'LG')
    .not('carrier_api_key', 'is', null)
    .not('carrier_api_pass', 'is', null);

  if (hospErr || !hospitals?.length) {
    return res.json({ message: 'No LG hospitals', error: hospErr?.message });
  }

  for (const hospital of hospitals) {
    const lastCallTime = hospital.lg_last_call_time || null;

    let lgData;
    try {
      lgData = await getLGInboundCalls(hospital.carrier_api_key, hospital.carrier_api_pass);
    } catch (err) {
      results.push({ hospital: hospital.name, error: err.message });
      continue;
    }

    if (lgData?.SVC_RT !== '0000' || !lgData?.DATAS) {
      // 첫 실행: 기준선 저장 (현재 최신 통화 TIME)
      if (!lastCallTime && lgData?.DATAS?.length > 0) {
        await supabase
          .from('hospitals')
          .update({ lg_last_call_time: lgData.DATAS[0].TIME })
          .eq('id', hospital.id);
      } else if (!lastCallTime) {
        // 통화 기록 없음 → 현재 시각(KST) 저장
        const kstNow = new Date(Date.now() + 9 * 3600 * 1000)
          .toISOString()
          .replace('T', ' ')
          .slice(0, 19);
        await supabase
          .from('hospitals')
          .update({ lg_last_call_time: kstNow })
          .eq('id', hospital.id);
      }
      results.push({ hospital: hospital.name, message: `LG API: ${lgData?.SVC_RT} ${lgData?.SVC_MSG}` });
      continue;
    }

    const calls = lgData.DATAS;

    // 첫 실행: 미수신 통화 로그 기록 (SMS 미발송), 기준선 설정
    if (!lastCallTime) {
      const baseline = calls[0]?.TIME || new Date(Date.now() + 9 * 3600 * 1000)
        .toISOString().replace('T', ' ').slice(0, 19);

      let baselineLogged = 0;
      for (const call of calls) {
        if (call.STATUS !== 'NO ANSWER' && call.STATUS !== 'CANCEL') continue;
        const logId = crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
        const kstTime = call.TIME;
        const utcTimestamp = new Date(
          new Date(kstTime.replace(' ', 'T') + '+09:00').getTime()
        ).toISOString();
        await supabase.from('call_logs').insert({
          id: logId,
          hospital_id: hospital.id,
          timestamp: utcTimestamp,
          caller_number: call.SRC,
          receiver_number: hospital.carrier_api_key || '',
          status: 'Missed',
          content: '',
          landing_visits: 0,
          trigger_type: 'missed',
          error_message: null,
        });
        baselineLogged++;
      }

      await supabase
        .from('hospitals')
        .update({ lg_last_call_time: baseline })
        .eq('id', hospital.id);
      results.push({ hospital: hospital.name, message: '첫 실행: 기준선 설정', baseline, baselineLogged });
      continue;
    }

    // 새 통화 처리 (미수신 + 통화종료)
    let newLastTime = lastCallTime;
    let smsSent = 0;

    for (const call of calls) {
      if (call.TIME <= lastCallTime) continue;
      const isMissed = call.STATUS === 'NO ANSWER' || call.STATUS === 'CANCEL';
      const isAnswered = call.STATUS === 'ANSWERED';
      if (!isMissed && !isAnswered) {
        if (call.TIME > newLastTime) newLastTime = call.TIME;
        continue;
      }

      // 중복 체크: 같은 CHANNEL 로그 있으면 스킵
      const { data: existing } = await supabase
        .from('call_logs')
        .select('id')
        .eq('hospital_id', hospital.id)
        .eq('caller_number', call.SRC)
        .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 최근 5분
        .limit(1);

      if (existing?.length > 0) {
        if (call.TIME > newLastTime) newLastTime = call.TIME;
        continue;
      }

      // SMS 발송
      const logId = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);

      const triggerType = isMissed ? 'missed' : 'callEnded';
      const message = isMissed
        ? (hospital.message || '')
        : (hospital.call_ended_message || '');
      const landingLink = hospital.landing_link || '';

      let resolvedMessage = message
        .replace(/#{병원명}/g, hospital.name)
        .replace(/{병원명}/g, hospital.name)
        .replace(/#{고객명}/g, '고객님')
        .replace(/{고객명}/g, '고객님')
        .replace(/#{홈페이지}/g, '')   // 랜딩 없으면 변수 제거
        .replace(/{홈페이지}/g, '');

      if (landingLink) {
        const trackingUrl = `${process.env.APP_URL || 'https://thehimedi.vercel.app'}/?track=${encodeURIComponent(logId)}&dest=${encodeURIComponent(landingLink)}`;
        resolvedMessage = resolvedMessage.trim() + '\n\n' + trackingUrl;
      }

      let success = false;
      let errorMessage;

      if (hospital.sender_number && resolvedMessage) {
        try {
          const result = await sendSolapiSms(call.SRC, hospital.sender_number, resolvedMessage);
          success = result.success;
          errorMessage = result.error;
        } catch (err) {
          errorMessage = err.message;
        }
      }

      // DB 로그 저장
      const kstTime = call.TIME; // LG TIME은 이미 KST
      const utcTimestamp = new Date(
        new Date(kstTime.replace(' ', 'T') + '+09:00').getTime()
      ).toISOString();

      await supabase.from('call_logs').insert({
        id: logId,
        hospital_id: hospital.id,
        timestamp: utcTimestamp,
        caller_number: call.SRC,
        receiver_number: hospital.carrier_api_key || '',
        status: success ? 'Success' : (hospital.sender_number && resolvedMessage ? 'Failed' : 'Missed'),
        content: resolvedMessage,
        landing_visits: 0,
        trigger_type: triggerType,
        error_message: errorMessage || null,
      });

      if (call.TIME > newLastTime) newLastTime = call.TIME;
      smsSent++;
    }

    // 마지막 처리 시간 업데이트
    if (newLastTime !== lastCallTime) {
      await supabase
        .from('hospitals')
        .update({ lg_last_call_time: newLastTime })
        .eq('id', hospital.id);
    }

    results.push({ hospital: hospital.name, smsSent, lastCallTime: newLastTime });
  }

  return res.json({ ok: true, results });
}
