import React, { useState, useEffect } from 'react';
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
import { useAuth } from './lib/useAuth';
import { Hospital, CallLog, MessageTemplate } from './lib/types';
import './index.css';
import { Toaster, toast } from 'sonner';

export default function App() {
  // URL param check (computed before hooks for reference, but rendered after hooks)
  const urlParams = new URLSearchParams(window.location.search);
  const registerCode = urlParams.get('register');

  const { user, isLoading: authLoading, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [logFilterHospitalId, setLogFilterHospitalId] = useState<string>('All');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // If this is a patient registration URL, show the form directly
  if (registerCode) {
    return <PatientRegistrationForm hospitalCode={registerCode} />;
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

  const handleManualBroadcast = async (hospitalId: string, message: string, targetNumbers: string[]) => {
    try {
      const timestamp = new Date().toISOString();
      const hospital = hospitals.find(h => h.id === hospitalId);
      const senderNumber = hospital?.code || 'SYSTEM';

      const newLogs: CallLog[] = targetNumbers.map((targetNumber, idx) => ({
        id: `m_${Date.now()}_${idx}`,
        hospitalId,
        timestamp,
        callerNumber: senderNumber,
        receiverNumber: targetNumber,
        status: Math.random() > 0.05 ? 'Success' : 'Failed',
        content: message,
        landingVisits: 0,
        triggerType: 'manual'
      }));

      const createdLogs = await Promise.all(newLogs.map(log => db.createLog(log)));
      setLogs(prev => [...createdLogs, ...prev]);
      toast.success(`${targetNumbers.length}명에게 메시지 발송을 완료했습니다.`);
    } catch (error) {
      console.error('Manual broadcast failed:', error);
      toast.error('메시지 일괄 발송에 실패했습니다.');
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