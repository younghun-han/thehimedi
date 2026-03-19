import React, { useState } from 'react';
import { Search, Plus, PhoneMissed, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Hospital, CallLog } from '../lib/types';
import { motion } from 'framer-motion';

interface HospitalListProps {
  hospitals: Hospital[];
  logs?: CallLog[];
  onSelectHospital: (id: string) => void;
  onAddHospital?: () => void;
}

export const HospitalList: React.FC<HospitalListProps> = ({ hospitals, logs = [], onSelectHospital, onAddHospital }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // call_logs에서 병원별 부재중 횟수 실시간 집계
  const missedCountMap = logs.reduce<Record<string, number>>((acc, log) => {
    if (log.triggerType === 'missed') {
      acc[log.hospitalId] = (acc[log.hospitalId] ?? 0) + 1;
    }
    return acc;
  }, {});

  const filteredHospitals = hospitals.filter(h =>
    h.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#141414]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
        <div>
          <h2 className="text-2xl font-bold text-white">병원 목록</h2>
          <p className="text-gray-400 mt-1">등록된 모든 병원 및 모니터링 현황 관리</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="코드 또는 병원명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#383838] rounded-lg text-white focus:outline-none focus:border-[#00E2E3] w-64 transition-colors"
            />
          </div>
          {onAddHospital && (
            <button
              onClick={onAddHospital}
              className="flex items-center px-4 py-2 bg-[#00E2E3] text-black font-semibold rounded-lg hover:bg-[#00c4c5] transition-colors shadow-[0_0_15px_rgba(0,226,227,0.3)]"
            >
              <Plus size={18} className="mr-2" />
              새 병원 추가
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#252525] border-b border-[#333]">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">병원 코드</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">병원명</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">총 부재중 통화</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredHospitals.map((hospital, index) => (
                <motion.tr
                  key={hospital.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectHospital(hospital.id)}
                  className="hover:bg-[#2A2A2A] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white font-mono">
                    <span className="bg-[#383838] px-2 py-1 rounded text-[#00E2E3]">{hospital.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#E2E3E4]">
                    {hospital.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#E2E3E4]">
                    <div className="flex items-center">
                      <PhoneMissed size={16} className="text-red-400 mr-2" />
                      <span className="font-semibold">{missedCountMap[hospital.id] ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${hospital.status === 'Active'
                      ? 'bg-green-900/30 text-green-400 border-green-800'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                      {hospital.status === 'Active' ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                      {hospital.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-400">
                    <button className="p-2 hover:bg-[#383838] rounded-full transition-colors text-gray-400 group-hover:text-white">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredHospitals.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              검색 결과와 일치하는 병원이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
