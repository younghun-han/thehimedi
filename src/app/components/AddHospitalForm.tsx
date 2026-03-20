import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Building } from 'lucide-react';
import { Hospital } from '../lib/types';
import { motion } from 'framer-motion';

interface AddHospitalFormProps {
  onBack: () => void;
  onSave: (hospital: Hospital) => Promise<void> | void;
}

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const AddHospitalForm: React.FC<AddHospitalFormProps> = ({ onBack, onSave }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false); // 동기 잠금: React StrictMode 이중 실행 / 더블클릭 방지

  const handleSave = async () => {
    if (!name.trim()) {
      setError('병원명은 필수입니다');
      return;
    }

    if (savingRef.current) return; // 이미 처리 중이면 즉시 차단
    savingRef.current = true;
    setIsSaving(true);

    const newHospital: Hospital = {
      id: '', // Supabase will generate UUID
      name: name.trim(),
      code: generateRandomCode(),
      password: '',  // will be auto-set on first login attempt
      landingLink: '',
      carrierApiKey: '',
      message: '',
      status: 'Active',
      missedCalls: 0,
      apiKey: `sk_live_${Math.random().toString(36).substr(2, 12)}`
    };
    // password defaults to code.toLowerCase() + 'pw' per server logic

    await onSave(newHospital);
    savingRef.current = false;
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A] bg-[#141414] z-10">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">새 병원 추가</h2>
            <p className="text-sm text-gray-500 mt-1">관리 시스템에 새로운 병원을 등록합니다</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            취소
          </button>
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
            {isSaving ? '생성 중...' : '병원 생성'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-8 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-8 flex items-center border-b border-[#2A2A2A] pb-4">
              <Building className="w-5 h-5 mr-2 text-[#00E2E3]" />
              기본 정보
            </h3>

            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    병원명
                  </label>
                  {error && <span className="text-xs text-red-400">{error}</span>}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="예: 서울안과"
                  className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors placeholder-gray-500 text-lg"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  * 병원 코드는 자동으로 생성되며, 상세 설정은 생성 후 관리 페이지에서 가능합니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};