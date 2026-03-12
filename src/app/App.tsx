import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { HospitalList } from './components/HospitalList';
import { HospitalDetail } from './components/HospitalDetail';
import { LogHistory } from './components/LogHistory';
import { AddHospitalForm } from './components/AddHospitalForm';
import { MessageTemplateList } from './components/MessageTemplateList';
import { Settings } from './components/Settings';
import { LoginPage } from './components/LoginPage';
import { PatientList } from './components/PatientList';
import { PatientRegistrationForm } from './components/PatientRegistrationForm';
import { db } from './lib/db';
import { supabase } from './lib/supabase';
import { sendMessages as solapiSendMessages } from './lib/solapi';
import { getLGInboundCalls, isMissedCall, LGInboundCall } from './lib/lg-api';
import { useAuth } from './lib/useAuth';
import { Hospital, CallLog, MessageTemplate } from './lib/types';
import './index.css';
import { Toaster, toast } from 'sonner';

export default function App() {
  // URL param check (computed before hooks for reference, but rendered after hooks)
  const urlParams = new URLSearchParams(window.location.search);
  const registerCode = urlParams.get('register');
  const trackLogId = urlParams.get('track');
  const trackDest = urlParams.get('dest');

  const { user, isLoading: authLoading, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [logFilterHospitalId, setLogFilterHospitalId] = useState<string>('All');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // LG 폴링: 병원별 마지막 처리 통화 TIME 추적
  const lgLastCallTimeRef = useRef<Map<string, string>>(new Map()); // hospitalId → last TIME
  const lgProcessedChannelsRef = useRef<Set<string>>(new Set());    // 중복 처리 방지

  // If this is a patient registration URL, show the form directly
  if (registerCode) {
    return <PatientRegistrationForm hospitalCode={registerCode} />;
  }

  // Landing page tracking redirect: use useEffect for side effects
  const trackingDone = useRef(false);
  useEffect(() => {
    if (trackLogId && trackDest && !trackingDone.current) {
      trackingDone.current = true;
      const processTracking = async () => {
        try {
          // Wait for the tracking request to finish before redirecting (prevents browser cancellation)
          await db.incrementLandingVisits(trackLogId);
        } catch (error) {
          console.error(error);
        } finally {
          let dest = decodeURIComponent(trackDest);
          if (!dest.startsWith('http://') && !dest.startsWith('https://')) {
            dest = 'https://' + dest;
          }
          window.location.replace(dest);
        }
      };
      processTracking();
    }
  }, [trackLogId, trackDest]);

  // If this is a landing page tracking redirect, show redirect screen
  if (trackLogId && trackDest) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#888' }}>이동 중...</p>
      </div>
    );
  }

  // Load initial data
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedHospitals, loadedLogs, loadedTemplates, loadedRegs] = await Promise.all([
          db.getHospitals(),
          db.getLogs(),
          // master: hospitalId=null, user: hospitalId=user.hospitalId
          db.getTemplates(user.role === 'master' ? null : user.hospitalId),
          db.getRegistrations(user.role === 'user' ? user.hospitalId : undefined),
        ]);

        // Filter by role
        if (user.role === 'user' && user.hospitalId) {
          setHospitals(loadedHospitals.filter(h => h.id === user.hospitalId));
          setLogs(loadedLogs.filter(l => l.hospitalId === user.hospitalId));
          setRegistrations(loadedRegs.filter(r => r.hospitalId === user.hospitalId));
        } else {
          setHospitals(loadedHospitals);
          setLogs(loadedLogs);
          setRegistrations(loadedRegs || []);
        }
        setTemplates(loadedTemplates);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
    setSelectedHospitalId(null);
    setHospitals([]);
    setLogs([]);
    setTemplates([]);
  };

  const handleResetPassword = async (hospitalId: string, hospitalCode: string) => {
    const defaultPw = hospitalCode.toLowerCase() + 'pw';
    await db.updateHospitalPassword(hospitalId, defaultPw);
    // Update local state too
    setHospitals(prev => prev.map(h => h.id === hospitalId ? { ...h, password: defaultPw } : h));
    toast.success(`비밀번호가 초기화되었습니다. (초기값: ${defaultPw})`);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setSelectedHospitalId(null);
    }
    if (view !== 'logs') {
      setLogFilterHospitalId('All');
    }
  };

  const handleSelectHospital = (id: string) => {
    setSelectedHospitalId(id);
    setCurrentView('detail');
  };

  const handleNavigateToLogs = (hospitalId: string) => {
    setLogFilterHospitalId(hospitalId);
    setCurrentView('logs');
  };

  const handleAddHospitalClick = () => {
    setCurrentView('add-hospital');
  };

  const handleCreateHospital = async (newHospital: Hospital) => {
    try {
      const created = await db.createHospital(newHospital);
      setHospitals(prev => [created, ...prev]);
      setCurrentView('dashboard');
      toast.success('병원이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('Create hospital failed:', error);
      toast.error('병원 생성에 실패했습니다.');
    }
  };

  const handleSaveHospital = async (updatedHospital: Hospital) => {
    try {
      await db.updateHospital(updatedHospital);
      setHospitals(prev => prev.map(h => h.id === updatedHospital.id ? updatedHospital : h));
      toast.success('병원 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Update hospital failed:', error);
      toast.error('병원 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteHospital = async (id: string) => {
    try {
      await db.deleteHospital(id);
      setHospitals(prev => prev.filter(h => h.id !== id));
      if (selectedHospitalId === id) {
        setCurrentView('dashboard');
        setSelectedHospitalId(null);
      }
      toast.success('병원이 삭제되었습니다.');
    } catch (error) {
      console.error('Delete hospital failed:', error);
      toast.error('병원 삭제에 실패했습니다.');
    }
  };

  const handleUpdateTemplates = async (newTemplates: MessageTemplate[]) => {
    try {
      const hospitalId = user?.role === 'master' ? null : user?.hospitalId;
      const updated = await db.updateTemplates(newTemplates, hospitalId);
      setTemplates(updated);
      toast.success('템플릿이 저장되었습니다.');
    } catch (error) {
      console.error('Update templates failed:', error);
      toast.error('템플릿 저장에 실패했습니다.');
    }
  };

  // Identify current active hospital based on user role
  const activeHospitalId = user?.role === 'master' ? selectedHospitalId : user?.hospitalId;

  const currentLogs = activeHospitalId
    ? logs.filter(log => log.hospitalId === activeHospitalId)
    : [];

  const activeHospital = activeHospitalId
    ? hospitals.find(h => h.id === activeHospitalId)
    : null;

  // Build a tracking URL for a log: clicking it increments landing_visits then redirects to the real landingLink
  const buildTrackingUrl = (logId: string, destUrl: string) => {
    const base = window.location.origin;
    return `${base}/?track=${encodeURIComponent(logId)}&dest=${encodeURIComponent(destUrl)}`;
  };

  // Replace variables in message with actual data and append tracking link
  const resolveMessageWithTracking = (rawMessage: string, hospital: Hospital, logId: string, receiverNumber?: string) => {
    let resolved = rawMessage;

    // 1. Hospital Name
    resolved = resolved.replace(/#{병원명}/g, hospital.name).replace(/{병원명}/g, hospital.name);

    // 2. Customer Name (lookup from registrations if possible)
    if (resolved.includes('고객명')) {
      const patientName = registrations.find(r => r.phone === receiverNumber)?.name || '고객님';
      resolved = resolved.replace(/#{고객명}/g, patientName).replace(/{고객명}/g, patientName);
    }

    // 3. Automatic Landing Page URL (Always append to the bottom if exists)
    if (hospital.landingLink) {
      const trackingUrl = buildTrackingUrl(logId, hospital.landingLink);
      // Remove any existing manual {홈페이지} variables to avoid confusion
      resolved = resolved.replace(/#{홈페이지}/g, '').replace(/{홈페이지}/g, '');
      resolved = resolved.trim() + "\n\n" + trackingUrl;
    }

    return resolved;
  };

  const handleManualBroadcast = async (hospitalId: string, message: string, targetNumbers: string[], fromNumber: string) => {
    try {
      const timestamp = new Date().toISOString();
      const hospital = hospitals.find(h => h.id === hospitalId);
      // fromNumber is passed directly from HospitalDetail's formData (live, unsaved value)

      if (!fromNumber) {
        toast.warning('발신번호가 설정되지 않았습니다. 병원 추가 설정에서 발신번호를 입력해주세요.');
      }

      // 로그 ID 미리 생성 (랜딩 트래킹용) - Must be a valid UUID to match DB schema safely
      const logEntries = targetNumbers.map((targetNumber, idx) => {
        const logId = crypto.randomUUID();
        const resolvedMessage = hospital
          ? resolveMessageWithTracking(message, hospital, logId, targetNumber)
          : message;
        return { logId, targetNumber, resolvedMessage };
      });

      // 솔라피 실제 발송
      let sendResults: Array<{ success: boolean; error?: string }> = logEntries.map(() => ({ success: false }));
      if (fromNumber) {
        try {
          const solapiMessages = logEntries.map(entry => ({
            to: entry.targetNumber,
            from: fromNumber,
            text: entry.resolvedMessage,
          }));
          const result = await solapiSendMessages(solapiMessages);
          sendResults = result.results;
          if (result.failCount > 0) {
            toast.warning(`${result.successCount}건 성공, ${result.failCount}건 실패`);
          }
        } catch (solapiError: any) {
          toast.error(`SMS 발송 실패: ${solapiError.message}`);
          sendResults = sendResults.map(r => ({ ...r, error: solapiError.message }));
        }
      }

      // DB 로그 저장
      const newLogs: CallLog[] = logEntries.map((entry, idx) => ({
        id: entry.logId,
        hospitalId,
        timestamp,
        callerNumber: fromNumber || hospital?.code || 'SYSTEM',
        receiverNumber: entry.targetNumber,
        status: sendResults[idx]?.success ? 'Success' : 'Failed',
        errorMessage: sendResults[idx]?.error || undefined,
        content: entry.resolvedMessage,
        landingVisits: 0,
        triggerType: 'manual'
      } as CallLog));

      const createdLogs = await Promise.all(newLogs.map(log => db.createLog(log)));
      setLogs(prev => [...createdLogs, ...prev]);
      if (fromNumber) {
        toast.success(`${targetNumbers.length}명에게 메시지 발송 완료`);
      } else {
        toast.success(`${targetNumbers.length}건 로그 저장 완료 (발신번호 미설정으로 실발송 없음)`);
      }
    } catch (error) {
      console.error('Manual broadcast failed:', error);
      toast.error('메시지 일괄 발송에 실패했습니다.');
    }
  };

  // ─── LG 미수신 처리 ──────────────────────────────────────────────────────────

  const handleLGMissedCall = async (hospital: Hospital, call: LGInboundCall) => {
    const callerNumber = call.SRC.replace(/-/g, '');
    const timestamp = new Date().toISOString();
    const logId = crypto.randomUUID();

    const message = hospital.message || '';
    const resolvedMessage = message
      ? resolveMessageWithTracking(message, hospital, logId, callerNumber)
      : '';

    let success = false;
    let errorMessage: string | undefined;

    if (hospital.senderNumber && resolvedMessage) {
      try {
        const result = await solapiSendMessages([{
          to: callerNumber,
          from: hospital.senderNumber,
          text: resolvedMessage,
        }]);
        success = result.results[0]?.success ?? false;
        errorMessage = result.results[0]?.error;
      } catch (err: any) {
        errorMessage = err.message;
      }
    }

    const newLog: CallLog = {
      id: logId,
      hospitalId: hospital.id,
      timestamp,
      callerNumber,
      receiverNumber: hospital.carrierApiKey || '',
      status: success ? 'Success' : (hospital.senderNumber && resolvedMessage ? 'Failed' : 'Missed'),
      content: resolvedMessage,
      landingVisits: 0,
      triggerType: 'missed',
      errorMessage,
    };

    try {
      const created = await db.createLog(newLog);
      setLogs(prev => [created, ...prev]);
      if (success) toast.success(`${callerNumber} 미수신 SMS 자동 발송`);
    } catch (err) {
      console.error('LG 로그 저장 실패:', err);
    }
  };

  // ─── Supabase Realtime: call_logs 실시간 구독 ────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('call_logs_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'call_logs' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          if (user.role === 'user' && user.hospitalId && row.hospital_id !== user.hospitalId) return;
          const newLog = {
            id: row.id,
            hospitalId: row.hospital_id,
            timestamp: row.timestamp,
            callerNumber: row.caller_number,
            receiverNumber: row.receiver_number,
            status: row.status as any,
            content: row.content,
            landingVisits: row.landing_visits ?? 0,
            lastLandingVisit: row.last_landing_visit ?? undefined,
            triggerType: row.trigger_type ?? 'missed',
            type: 'message' as const,
            errorMessage: row.error_message,
          };
          setLogs(prev => {
            if (prev.some(l => l.id === newLog.id)) return prev;
            return [newLog, ...prev];
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // ─── LG 폴링 (60초마다) ───────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;

    const lgHospitals = hospitals.filter(
      h => h.carrier === 'LG' && h.carrierApiKey && h.carrierApiPass
    );
    if (lgHospitals.length === 0) return;

    const pollOnce = async () => {
      for (const hospital of lgHospitals) {
        try {
          const data = await getLGInboundCalls(hospital.carrierApiKey!, hospital.carrierApiPass!);

          if (!data?.DATAS || !Array.isArray(data.DATAS)) continue;

          const calls = data.DATAS as import('./lib/lg-api').LGInboundCall[];
          const lastTime = lgLastCallTimeRef.current.get(hospital.id);
          const isFirstPoll = !lastTime;

          // 최신 통화 TIME 저장
          if (calls.length > 0) {
            lgLastCallTimeRef.current.set(hospital.id, calls[0].TIME);
          }

          // 첫 폴링: 기존 통화 기록만 저장 (SMS 미발송)
          if (isFirstPoll) {
            calls.forEach(c => lgProcessedChannelsRef.current.add(c.CHANNEL));
            continue;
          }

          // 새 미수신 통화만 처리
          for (const call of calls) {
            if (lgProcessedChannelsRef.current.has(call.CHANNEL)) continue;
            if (call.TIME <= lastTime!) {
              lgProcessedChannelsRef.current.add(call.CHANNEL);
              continue;
            }
            lgProcessedChannelsRef.current.add(call.CHANNEL);

            if (isMissedCall(call.STATUS)) {
              await handleLGMissedCall(hospital, call);
            }
          }
        } catch (err) {
          console.error(`LG 폴링 오류 (${hospital.name}):`, err);
        }
      }
    };

    // 초기 폴링 (기준선 설정)
    pollOnce();

    const interval = setInterval(pollOnce, 60_000);
    return () => clearInterval(interval);
  }, [hospitals, user]);

  // ─────────────────────────────────────────────────────────────────────────────

  const handleDeleteRegistrations = async (phone: string, hospitalId?: string) => {
    try {
      await db.deleteRegistrationsByPhone(phone, hospitalId);
      // Refresh registrations
      const loadedRegs = await db.getRegistrations(user?.role === 'user' ? user.hospitalId : undefined);
      setRegistrations(loadedRegs);

      toast.success('환자 정보가 삭제되었습니다. (관련 발송 이력은 로그 기록에 유지됩니다.)');
    } catch (error) {
      console.error('Delete registrations failed:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  const handleDeleteAllRegistrations = async (hospitalId?: string) => {
    try {
      await db.deleteAllRegistrations(hospitalId);
      setRegistrations(prev => hospitalId ? prev.filter(r => r.hospitalId !== hospitalId) : []);
      toast.success('모든 환자 정보가 삭제되었습니다.');
    } catch (error) {
      console.error('Delete all registrations failed:', error);
      toast.error('전체 삭제에 실패했습니다.');
    }
  };

  // Auth loading
  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-[#141414] items-center justify-center">
        <div className="text-[#00E2E3] animate-pulse font-mono text-xl">Loading...</div>
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return (
      <>
        <LoginPage onLogin={login} />
        <Toaster position="top-right" theme="dark" />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-[#141414] items-center justify-center">
        <div className="text-[#00E2E3] animate-pulse font-mono text-xl">Loading System...</div>
      </div>
    );
  }

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate} user={user} onLogout={handleLogout}>
      {currentView === 'dashboard' && user.role === 'master' && (
        <HospitalList
          hospitals={hospitals}
          onSelectHospital={handleSelectHospital}
          onAddHospital={handleAddHospitalClick}
        />
      )}

      {currentView === 'dashboard' && user.role === 'user' && activeHospital && (
        <HospitalDetail
          hospital={activeHospital}
          logs={currentLogs}
          registrations={registrations.filter(r => r.hospitalId === activeHospital.id)}
          templates={templates}
          onSave={handleSaveHospital}
          onNavigateToLogs={handleNavigateToLogs}
          onManualBroadcast={handleManualBroadcast}
        />
      )}

      {currentView === 'logs' && (
        <LogHistory
          logs={logs}
          hospitals={hospitals}
          initialHospitalFilter={logFilterHospitalId}
        />
      )}

      {currentView === 'patients' && (
        <PatientList
          logs={logs}
          hospitals={hospitals}
          registrations={registrations}
          user={user}
          onAddRegistrations={(newRegs) => setRegistrations(prev => [...newRegs, ...prev])}
          onDeleteRegistrations={async (phoneNumber, hospitalId) => {
            await db.deleteRegistrationsByPhone(phoneNumber, hospitalId);
            setRegistrations(prev => prev.filter(r => r.phone !== phoneNumber || (hospitalId && r.hospitalId !== hospitalId)));
            toast.success('환자 정보가 삭제되었습니다.');
          }}
          onDeleteAllRegistrations={async (hospitalId) => {
            await db.deleteAllRegistrations(hospitalId);
            setRegistrations(prev => hospitalId ? prev.filter(r => r.hospitalId !== hospitalId) : []);
            toast.success('모든 환자 정보가 삭제되었습니다.');
          }}
        />
      )}

      {currentView === 'templates' && (
        <MessageTemplateList
          templates={templates}
          onUpdateTemplates={handleUpdateTemplates}
        />
      )}

      {currentView === 'settings' && (
        <Settings user={user} />
      )}

      {currentView === 'add-hospital' && user.role === 'master' && (
        <AddHospitalForm
          onBack={() => handleNavigate('dashboard')}
          onSave={handleCreateHospital}
        />
      )}

      {currentView === 'detail' && user.role === 'master' && activeHospital && (
        <HospitalDetail
          hospital={activeHospital}
          logs={currentLogs}
          registrations={registrations.filter(r => r.hospitalId === activeHospital.id)}
          templates={templates}
          onBack={() => handleNavigate('dashboard')}
          onSave={handleSaveHospital}
          onDelete={handleDeleteHospital}
          onResetPassword={handleResetPassword}
          onNavigateToLogs={handleNavigateToLogs}
          onManualBroadcast={handleManualBroadcast}
        />
      )}

      {currentView !== 'dashboard' && currentView !== 'detail' && currentView !== 'add-hospital' && currentView !== 'logs' && currentView !== 'patients' && currentView !== 'templates' && currentView !== 'settings' && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-white">준비 중</h3>
            <p>{currentView} 모듈은 현재 개발 중입니다.</p>
          </div>
        </div>
      )}
      <Toaster position="top-right" theme="dark" />
    </Layout>
  );
}