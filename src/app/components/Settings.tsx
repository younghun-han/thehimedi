import React, { useState, useEffect } from 'react';
import { User, Save, Lock, Clock, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthUser } from '../lib/types';
import { toast } from 'sonner';
import { db } from '../lib/db';

export const Settings: React.FC<{ user?: AuthUser | null }> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Determine display ID based on user object (master vs hospital)
  const displayId = user?.role === 'master' ? '마스터 관리자' : (user?.hospitalId || 'Unknown');

  // State for Password Change
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // State for Do Not Disturb (DND) Time
  const [dndSettings, setDndSettings] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  });

  // DND 설정 로드
  useEffect(() => {
    if (user?.role === 'user' && user.hospitalId) {
      db.getHospitals().then(hospitals => {
        const hospital = hospitals.find(h => h.id === user.hospitalId);
        if (hospital) {
          setDndSettings({
            enabled: hospital.dndEnabled ?? false,
            startTime: hospital.dndStartTime ?? '22:00',
            endTime: hospital.dndEndTime ?? '08:00',
          });
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error('모든 비밀번호 필드를 입력해주세요.');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Verify current password
      let verified = false;
      if (user?.role === 'master') {
        const result = await db.login('master', passwordForm.current);
        verified = !!result;
      } else if (user?.role === 'user' && user.hospitalCode) {
        const result = await db.login(user.hospitalCode, passwordForm.current);
        verified = !!result;
      }

      if (!verified) {
        toast.error('현재 비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      // 2. Update to new password
      if (user?.role === 'master') {
        await db.updateMasterPassword(passwordForm.new);
      } else if (user?.role === 'user' && user.hospitalId) {
        await db.updateHospitalPassword(user.hospitalId, passwordForm.new);
      }

      setPasswordForm({ current: '', new: '', confirm: '' });
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
    } catch (err) {
      console.error('Password change error:', err);
      toast.error('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDnd = async () => {
    if (user?.role !== 'user' || !user.hospitalId) {
      toast.error('병원 계정만 DND 설정을 저장할 수 있습니다.');
      return;
    }
    try {
      const hospitals = await db.getHospitals();
      const hospital = hospitals.find(h => h.id === user.hospitalId);
      if (!hospital) return;
      await db.updateHospital({
        ...hospital,
        dndEnabled: dndSettings.enabled,
        dndStartTime: dndSettings.startTime,
        dndEndTime: dndSettings.endTime,
      });
      toast.success('발송 금지 시간이 저장되었습니다.');
    } catch (err) {
      console.error('DND save error:', err);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#141414]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
        <div>
          <h2 className="text-2xl font-bold text-white">설정</h2>
          <p className="text-gray-400 mt-1">관리자 계정 및 보안 설정</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center px-6 py-2 bg-[#00E2E3] text-black font-bold rounded-lg hover:bg-[#00c4c5] transition-all shadow-[0_0_15px_rgba(0,226,227,0.3)] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {isLoading ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-[#141414]">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Admin ID / Email Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 text-white mb-2">
              <User size={20} className="text-[#00E2E3]" />
              <h3 className="text-lg font-bold">관리자 정보</h3>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-6 space-y-6">
              <InputGroup label="관리자 ID">
                <input
                  type="text"
                  value={displayId}
                  disabled
                  className="w-full bg-[#1E1E1E] border border-[#333] text-gray-400 rounded-lg px-4 py-2.5 outline-none cursor-not-allowed text-sm"
                />
              </InputGroup>
            </div>
          </motion.div>

          {/* Password Change Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 text-white mb-2">
              <Lock size={20} className="text-[#00E2E3]" />
              <h3 className="text-lg font-bold">비밀번호 변경</h3>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-6 space-y-6">
              <InputGroup label="현재 비밀번호">
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                  placeholder="••••••••"
                />
              </InputGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="새 비밀번호">
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                    placeholder="••••••••"
                  />
                </InputGroup>
                <InputGroup label="새 비밀번호 확인">
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className={`w-full bg-[#383838] border rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors ${passwordForm.confirm && passwordForm.new !== passwordForm.confirm
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#4A4A4A] focus:border-[#00E2E3]'
                      }`}
                    placeholder="••••••••"
                  />
                </InputGroup>
              </div>
              {passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </motion.div>

          {/* Do Not Disturb (DND) Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 text-white mb-2">
              <Clock size={20} className="text-[#00E2E3]" />
              <h3 className="text-lg font-bold">문자 발송 금지 시간 설정</h3>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">야간/특정 시간 발송 제한</p>
                  <p className="text-sm text-gray-500 mt-1">설정된 시간 동안에는 자동 문자 발송이 중단됩니다.</p>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={() => setDndSettings({ ...dndSettings, enabled: !dndSettings.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dndSettings.enabled ? 'bg-[#00E2E3]' : 'bg-[#383838]'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dndSettings.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {dndSettings.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-6 pt-4 border-t border-[#2A2A2A]"
                >
                  <InputGroup label="시작 시간">
                    <input
                      type="time"
                      value={dndSettings.startTime}
                      onChange={(e) => setDndSettings({ ...dndSettings, startTime: e.target.value })}
                      className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                    />
                  </InputGroup>
                  <InputGroup label="종료 시간">
                    <input
                      type="time"
                      value={dndSettings.endTime}
                      onChange={(e) => setDndSettings({ ...dndSettings, endTime: e.target.value })}
                      className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                    />
                  </InputGroup>
                </motion.div>
              )}
              {user?.role === 'user' && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveDnd}
                    className="flex items-center px-4 py-2 bg-[#00E2E3] text-black font-bold rounded-lg hover:bg-[#00c4c5] transition-all text-sm"
                  >
                    <Save size={14} className="mr-1.5" />
                    저장
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Patient Registration Link (user only) */}
          {user?.role === 'user' && user.hospitalCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 text-white mb-2">
                <LinkIcon size={20} className="text-[#00E2E3]" />
                <h3 className="text-lg font-bold">환자 접수 링크</h3>
              </div>
              <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-6">
                <p className="text-sm text-gray-400 mb-4">이 링크를 환자에게 공유하면 환자가 직접 접수 정보를 입력할 수 있습니다.</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#252525] border border-[#383838] rounded px-3 py-2.5 text-[#00E2E3] text-sm font-mono truncate">
                    {`${window.location.origin}/?register=${user.hospitalCode}`}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?register=${user.hospitalCode}`); }}
                    className="flex-shrink-0 px-4 py-2.5 bg-[#00E2E3]/10 border border-[#00E2E3]/30 text-[#00E2E3] rounded-lg hover:bg-[#00E2E3]/20 transition-colors text-sm font-bold"
                  >
                    복사
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
      {label}
    </label>
    {children}
  </div>
);
