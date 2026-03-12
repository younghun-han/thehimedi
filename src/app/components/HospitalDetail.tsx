import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Link as LinkIcon, Key, Clock, Phone, CheckCircle, XCircle, Shield, PhoneOff, ChevronDown, MousePointerClick, AlertTriangle, ArrowDownLeft, Send, Users, RotateCcw } from 'lucide-react';
import { Hospital, CallLog, MessageTemplate, PatientRegistration } from '../lib/types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MessageTemplateEditor } from './MessageTemplateEditor';
import { toast } from 'sonner';

const COST_PER_MESSAGE = 30; // Estimated cost per message (KRW)

interface HospitalDetailProps {
  hospital: Hospital;
  logs: CallLog[];
  registrations: PatientRegistration[];
  templates: MessageTemplate[];
  onBack?: () => void;
  onSave: (updated: Hospital) => Promise<void> | void;
  onDelete?: (id: string) => void;
  onResetPassword?: (hospitalId: string, hospitalCode: string) => Promise<void>;
  onNavigateToLogs: (hospitalId: string) => void;
  onManualBroadcast: (hospitalId: string, message: string, targetNumbers: string[], fromNumber: string) => Promise<void>;
}

export const HospitalDetail: React.FC<HospitalDetailProps> = ({
  hospital,
  logs,
  registrations,
  templates,
  onBack,
  onSave,
  onDelete,
  onResetPassword,
  onNavigateToLogs,
  onManualBroadcast
}) => {
  const [formData, setFormData] = useState<Hospital>(hospital);
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPw, setIsResettingPw] = useState(false);
  const [activeTab, setActiveTab] = useState<'missed' | 'callEnded' | 'manual'>('missed');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Manual Broadcast State
  const [isSending, setIsSending] = useState(false);

  // Update local state when hospital prop changes
  useEffect(() => {
    setFormData(hospital);
  }, [hospital]);

  // Reset template selection when tab changes
  useEffect(() => {
    setSelectedTemplateId('');
  }, [activeTab]);

  const handleChange = (field: keyof Hospital, value: string | 'Active' | 'Inactive') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);

    const template = templates.find(t => t.id === templateId);
    if (template) {
      let targetField: keyof Hospital = 'message';
      if (activeTab === 'callEnded') targetField = 'callEndedMessage';
      if (activeTab === 'manual') targetField = 'manualMessage';
      // 기존 내용 삭제 후 선택한 템플릿으로 덮어씌우기
      handleChange(targetField, template.content);
    }
  };

  const [confirmPwReset, setConfirmPwReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmManualSend, setConfirmManualSend] = useState(false);

  // When form data changes, reset confirmation states
  useEffect(() => {
    setConfirmPwReset(false);
    setConfirmDelete(false);
    setConfirmManualSend(false);
  }, [formData.id]);



  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  // Get unique customer numbers for manual broadcast (targets)
  const getUniqueTargetNumbers = () => {
    const numbers = new Set<string>();
    registrations.forEach(reg => {
      if (reg.phone && reg.phone.trim() !== '') {
        numbers.add(reg.phone);
      }
    });
    return Array.from(numbers);
  };

  // Helper to get customer number based on log type
  const getCustomerNumber = (log: CallLog) => {
    // For manual messages, receiver is the customer
    if (log.triggerType === 'manual') {
      return log.receiverNumber;
    }
    // For missed/ended calls, caller is the customer
    return log.callerNumber;
  };

  const uniqueTargets = getUniqueTargetNumbers();

  const executeManualSend = async () => {
    if (!formData.manualMessage) return;
    setIsSending(true);
    await onManualBroadcast(hospital.id, formData.manualMessage, uniqueTargets, formData.senderNumber || '');
    setIsSending(false);
  };

  const handleManualSendClick = () => {
    if (!formData.manualMessage || formData.manualMessage.trim() === '') {
      toast.error('발송할 메시지 내용을 입력해주세요.');
      return;
    }

    if (uniqueTargets.length === 0) {
      toast.error('발송 대상(로그 기록)이 없습니다.');
      return;
    }

    setConfirmManualSend(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A] bg-[#141414] z-10">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              {formData.name}
              <span className="ml-3 text-sm font-mono bg-[#2A2A2A] text-[#00E2E3] px-2 py-0.5 rounded border border-[#383838]">
                {formData.code}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">자동 응답 설정 및 로그 확인</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-2 bg-[#00E2E3] text-black font-bold rounded-lg hover:bg-[#00c4c5] transition-all shadow-[0_0_15px_rgba(0,226,227,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {isSaving ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Settings */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center border-b border-[#2A2A2A] pb-4">
                <SettingsSectionIcon />
                기본 설정
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormGroup label="병원명">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                  />
                </FormGroup>

                <FormGroup label="고유 코드 (읽기 전용)">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.code}
                      readOnly
                      className="w-full bg-[#252525] border border-[#333] rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed font-mono"
                    />
                    <Key size={16} className="absolute right-3 top-3 text-gray-600" />
                  </div>
                </FormGroup>

                <FormGroup label="병원 상태">
                  <div className="flex items-center justify-between bg-[#252525] p-3 rounded-lg border border-[#333]">
                    <div className="flex items-center">
                      {formData.status === 'Active' ? (
                        <CheckCircle size={18} className="text-green-400 mr-2" />
                      ) : (
                        <XCircle size={18} className="text-gray-400 mr-2" />
                      )}
                      <span className={`text-sm font-medium ${formData.status === 'Active' ? 'text-white' : 'text-gray-400'}`}>
                        {formData.status === 'Active' ? '운영 중 (Active)' : '비활성화 (Inactive)'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleChange('status', formData.status === 'Active' ? 'Inactive' : 'Active')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00E2E3] focus:ring-offset-2 focus:ring-offset-[#1E1E1E] ${formData.status === 'Active' ? 'bg-[#00E2E3]' : 'bg-gray-600'
                        }`}
                    >
                      <span
                        className={`${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                </FormGroup>
              </div>

              <div className="mb-6 space-y-4">
                <FormGroup label="통신사 선택">
                  <div className="flex space-x-2">
                    {(['KT', 'STB', 'LG'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => handleChange('carrier', c)}
                        className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${(formData.carrier || 'KT') === c
                          ? 'bg-[#00E2E3] text-black border-[#00E2E3]'
                          : 'bg-[#2A2A2A] text-gray-400 border-[#383838] hover:border-gray-500'
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </FormGroup>

                <FormGroup label={`${formData.carrier || 'KT'} API 설정`}>
                  <div className="bg-[#252525] p-4 rounded-lg border border-[#333] space-y-2">
                    {(formData.carrier || 'KT') === 'LG' ? (
                      <>
                        <div className="relative">
                          <Shield size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            value={formData.carrierApiKey || ''}
                            onChange={(e) => handleChange('carrierApiKey', e.target.value)}
                            placeholder="070 번호 입력 (예: 07012341234)"
                            className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors font-mono text-sm placeholder-gray-600"
                          />
                        </div>
                        <div className="relative">
                          <Shield size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="password"
                            value={formData.carrierApiPass || ''}
                            onChange={(e) => handleChange('carrierApiPass', e.target.value)}
                            placeholder="centrex.uplus.co.kr 로그인 비밀번호"
                            className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors font-mono text-sm placeholder-gray-600"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          * LG U+ 고급형 센트릭스 계정 정보를 입력해주세요. 비밀번호는 암호화되어 저장됩니다.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <Shield size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            value={formData.carrierApiKey || ''}
                            onChange={(e) => handleChange('carrierApiKey', e.target.value)}
                            placeholder={`${formData.carrier || 'KT'} API Key 입력`}
                            className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors font-mono text-sm placeholder-gray-600"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          * 현재 {formData.carrier || 'KT'} API 연동을 위한 키를 입력해주세요.
                        </p>
                      </>
                    )}
                  </div>
                </FormGroup>
              </div>

              <div className="mt-8 border-t border-[#2A2A2A] pt-6">
                <div className="flex space-x-1 bg-[#141414] p-1 rounded-lg border border-[#2A2A2A] mb-6">
                  <button
                    onClick={() => setActiveTab('missed')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'missed' ? 'bg-[#2A2A2A] text-white shadow-sm border border-[#383838]' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    <Phone size={16} className="mr-2" />
                    부재중 응답
                  </button>
                  <button
                    onClick={() => setActiveTab('callEnded')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'callEnded' ? 'bg-[#2A2A2A] text-white shadow-sm border border-[#383838]' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    <PhoneOff size={16} className="mr-2" />
                    전화통화 종료시
                  </button>
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'manual' ? 'bg-[#2A2A2A] text-white shadow-sm border border-[#383838]' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    <Send size={16} className="mr-2" />
                    수동 일괄 발송
                  </button>
                </div>

                {/* Tab Content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Common Template Select for all tabs */}
                  <div className="mb-3">
                    <FormGroup label={activeTab === 'manual' ? "수동 발송 메시지" : (activeTab === 'missed' ? "부재중 자동 응답 메시지" : "종료 후 안내 메시지")}>
                      <div className="relative mb-3">
                        <select
                          value={selectedTemplateId}
                          onChange={handleTemplateSelect}
                          className="w-full bg-[#252525] border border-[#4A4A4A] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00E2E3] appearance-none cursor-pointer hover:bg-[#2A2A2A] transition-colors pr-10"
                        >
                          <option value="">템플릿 선택하여 불러오기...</option>
                          {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                      </div>

                      <MessageTemplateEditor
                        type={(activeTab === 'manual' ? 'missed' : activeTab) as any}
                        value={
                          activeTab === 'missed' ? formData.message :
                            activeTab === 'callEnded' ? (formData.callEndedMessage || '') :
                              (formData.manualMessage || '')
                        }
                        onChange={(val) => {
                          if (activeTab === 'missed') handleChange('message', val);
                          else if (activeTab === 'callEnded') handleChange('callEndedMessage', val);
                          else handleChange('manualMessage', val);
                        }}
                        placeholder="메시지 내용을 입력하세요..."
                        hideVariables={true}
                      />
                    </FormGroup>
                  </div>

                  {/* Specific Content for Manual Tab */}
                  {activeTab === 'manual' && (
                    <div className="mt-6 bg-[#252525] p-5 rounded-lg border border-[#333]">
                      <h4 className="text-white font-medium flex items-center mb-3">
                        <Users size={18} className="mr-2 text-[#00E2E3]" />
                        발송 대상 확인
                      </h4>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 text-sm">
                          현재 등록된 전체 환자(연락처) 목록 수
                        </p>
                        <span className="text-2xl font-bold text-white font-mono">
                          {uniqueTargets.length}
                          <span className="text-sm text-gray-500 font-sans ml-1">명</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        {confirmManualSend ? (
                          <div className="w-full bg-[#00E2E3]/10 border border-[#00E2E3]/50 rounded-lg p-3 flex flex-col items-center">
                            <span className="text-sm font-bold text-white mb-1">
                              총 {uniqueTargets.length}명에게 발송하시겠습니까?
                            </span>
                            <span className="text-xs text-[#00E2E3] mb-3">
                              예상 발송 비용: 약 {(uniqueTargets.length * COST_PER_MESSAGE).toLocaleString()}원
                            </span>
                            <div className="flex items-center gap-2 w-full">
                              <button
                                onClick={async () => {
                                  setConfirmManualSend(false);
                                  await executeManualSend();
                                }}
                                className="flex-1 py-2 bg-[#00E2E3] text-black font-bold rounded hover:bg-[#00c4c5] transition-colors text-sm"
                              >
                                확인
                              </button>
                              <button
                                onClick={() => setConfirmManualSend(false)}
                                className="flex-1 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors text-sm"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={handleManualSendClick}
                            disabled={isSending || uniqueTargets.length === 0}
                            className="w-full py-3 bg-[#00E2E3] text-black font-bold rounded-lg hover:bg-[#00c4c5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {isSending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                발송 중...
                              </>
                            ) : (
                              <>
                                <Send size={18} className="mr-2" />
                                {uniqueTargets.length}명에게 일괄 발송하기
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        * 발송 시 새로운 로그가 생성되며, 실제 발송에는 시간이 소요될 수 있습니다.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Landing Page Link - Moved to Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-6 shadow-lg"
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                <LinkIcon size={16} className="mr-2" />
                추가 설정
              </h3>

              <div className="mb-6">
                <FormGroup label="SMS 발신번호 (솔라피 등록 번호)">
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={formData.senderNumber || ''}
                      onChange={(e) => handleChange('senderNumber', e.target.value)}
                      placeholder="01012345678 (하이픈 없이)"
                      className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors font-mono text-sm placeholder-gray-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * 솔라피 콘솔에 등록된 발신번호를 입력하세요. 미입력 시 실제 발송이 되지 않습니다.
                  </p>
                </FormGroup>
              </div>

              <FormGroup label="랜딩 페이지 링크">
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.landingLink}
                    onChange={(e) => handleChange('landingLink', e.target.value)}
                    className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg pl-10 pr-4 py-2.5 text-[#00E2E3] focus:outline-none focus:border-[#00E2E3] transition-colors font-mono text-sm underline underline-offset-2"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 메시지 내 <code>#{"{"}&quot;홈페이지&quot;{"}"}</code> 변수 사용 시 이 링크로 치환됩니다.
                </p>
              </FormGroup>

              {/* Patient Registration Link */}
              <div className="mt-6 border-t border-[#2A2A2A] pt-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                  <LinkIcon size={14} className="mr-2" />
                  환자 접수 링크
                </h3>
                <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-3">이 링크를 환자에게 공유하면 환자가 직접 접수 정보를 입력할 수 있습니다.</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-[#141414] border border-[#383838] rounded px-3 py-2 text-[#00E2E3] text-sm font-mono truncate">
                      {`${window.location.origin}/?register=${formData.code}`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/?register=${formData.code}`);
                        toast.success('링크가 복사되었습니다!');
                      }}
                      className="flex-shrink-0 px-3 py-2 bg-[#00E2E3]/10 border border-[#00E2E3]/30 text-[#00E2E3] rounded-lg hover:bg-[#00E2E3]/20 transition-colors text-xs font-bold"
                    >
                      복사
                    </button>
                  </div>
                </div>
              </div>

              {onResetPassword && (
                <div className="mt-6 border-t border-[#2A2A2A] pt-6">
                  <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4 flex items-center">
                    <Key size={14} className="mr-2" />
                    비밀번호 관리
                  </h3>
                  <div className="bg-[#252525] border border-[#333] rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-200 font-medium text-sm">비밀번호 초기화</h4>
                      <p className="text-gray-500 text-xs mt-1">초기 비밀번호: <span className="font-mono text-orange-400">{formData.code.toLowerCase()}pw</span></p>
                    </div>
                    {confirmPwReset ? (
                      <div className="flex items-center gap-2 bg-orange-900/10 border border-orange-800/30 rounded-lg px-2 py-1">
                        <span className="text-xs text-orange-400 mr-1 font-bold">정말 초기화?</span>
                        <button
                          onClick={async () => {
                            setConfirmPwReset(false);
                            setIsResettingPw(true);
                            await onResetPassword(formData.id, formData.code);
                            setIsResettingPw(false);
                          }}
                          disabled={isResettingPw}
                          className="text-xs px-3 py-1 bg-orange-600/80 text-white rounded hover:bg-orange-600 transition-colors font-bold disabled:opacity-50"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => setConfirmPwReset(false)}
                          disabled={isResettingPw}
                          className="p-1 px-2 text-gray-400 hover:text-white rounded hover:bg-[#383838] transition-colors text-xs"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmPwReset(true)}
                        disabled={isResettingPw}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-900/20 text-orange-400 border border-orange-800/50 rounded-lg hover:bg-orange-900/40 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RotateCcw size={14} className={isResettingPw ? 'animate-spin' : ''} />
                        {isResettingPw ? '초기화 중...' : 'PW 초기화'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {onDelete && (
                <div className="mt-8 border-t border-[#2A2A2A] pt-6">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    위험 구역
                  </h3>
                  <div className="bg-[#2A1515] border border-red-900/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-red-200 font-medium">병원 삭제</h4>
                      <p className="text-red-400/60 text-xs mt-1">이 병원의 모든 데이터와 로그가 영구적으로 삭제됩니다.</p>
                    </div>
                    {confirmDelete ? (
                      <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 rounded-lg px-2 py-1">
                        <span className="text-xs text-red-400 mr-1 font-bold">정말 삭제할까요?</span>
                        <button
                          onClick={() => {
                            setConfirmDelete(false);
                            onDelete(formData.id);
                          }}
                          className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors font-bold"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="p-1 px-2 text-gray-400 hover:text-white rounded hover:bg-[#383838] transition-colors text-xs"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded hover:bg-red-900/40 transition-colors text-sm font-bold"
                      >
                        삭제하기
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Logs */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] flex flex-col h-[600px] shadow-lg sticky top-6"
            >
              <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#252525] rounded-t-xl">
                <h3 className="font-semibold text-white">최근 로그</h3>
                <span className="text-xs bg-[#383838] text-gray-300 px-2 py-1 rounded-full">{logs.length} 건</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => onNavigateToLogs(hospital.id)}
                      className="bg-[#2A2A2A] rounded-lg p-3 border border-[#333] hover:border-[#00E2E3] transition-all group cursor-pointer hover:bg-[#333]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center text-xs text-gray-400 font-mono">
                          <Clock size={12} className="mr-1" />
                          {format(new Date(log.timestamp), 'MM-dd HH:mm')}
                        </div>
                        <StatusBadge status={log.status} />
                      </div>
                      <div className="flex items-center text-sm text-white mb-2 font-medium">
                        <ArrowDownLeft size={14} className="mr-2 text-gray-500" />
                        {getCustomerNumber(log) || '-'}
                      </div>
                      <div className="text-xs text-gray-500 bg-[#141414] p-2 rounded border border-[#333] truncate mb-2">
                        {log.content}
                      </div>

                      {log.landingVisits !== undefined && (
                        <div className="flex items-center justify-end text-xs text-gray-400">
                          <span className="flex items-center bg-[#1A1A1A] px-2 py-1 rounded border border-[#333] group-hover:border-[#555] transition-colors">
                            <MousePointerClick size={12} className="mr-1.5 text-[#00E2E3]" />
                            랜딩 방문: <span className="ml-1 text-white font-mono">{log.landingVisits}</span>회
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>로그가 없습니다</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Subcomponents for cleaner code
const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
      {label}
    </label>
    {children}
  </div>
);

const SettingsSectionIcon = () => (
  <svg className="w-5 h-5 mr-2 text-[#00E2E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const StatusBadge: React.FC<{ status: 'Success' | 'Failed' }> = ({ status }) => {
  const isSuccess = status === 'Success';
  return (
    <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${isSuccess ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
      }`}>
      {isSuccess ? <CheckCircle size={10} className="mr-1" /> : <XCircle size={10} className="mr-1" />}
      {status}
    </span>
  );
};

