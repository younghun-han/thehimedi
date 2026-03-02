import React, { useState } from 'react';
import { Search, Filter, Calendar, Phone, CheckCircle, XCircle, Building, Download, MousePointerClick, X, MessageSquare, ArrowDownLeft, Clock, PhoneIncoming, PhoneMissed, PhoneCall } from 'lucide-react';
import { CallLog, Hospital } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface LogHistoryProps {
  logs: CallLog[];
  hospitals: Hospital[];
  initialHospitalFilter?: string;
}

export const LogHistory: React.FC<LogHistoryProps> = ({ logs, hospitals, initialHospitalFilter = 'All' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Failed' | 'Incoming' | 'Missed' | 'Completed'>('All');
  const [hospitalFilter, setHospitalFilter] = useState<string>(initialHospitalFilter);
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  // Update filter when prop changes
  React.useEffect(() => {
    setHospitalFilter(initialHospitalFilter);
  }, [initialHospitalFilter]);

  // Helper to get hospital name
  const getHospitalName = (id: string) => {
    const hospital = hospitals.find(h => h.id === id);
    return hospital ? hospital.name : 'Unknown Hospital';
  };

  // Helper to get customer number
  const getCustomerNumber = (log: CallLog) => {
    // For manual messages, receiver is the customer
    if (log.triggerType === 'manual') {
      return log.receiverNumber;
    }
    // For missed/ended calls, caller is the customer
    return log.callerNumber;
  };

  const filteredLogs = logs.filter(log => {
    const hospitalName = getHospitalName(log.hospitalId).toLowerCase();
    const customerNumber = getCustomerNumber(log) || '';
    const matchesSearch =
      hospitalName.includes(searchTerm.toLowerCase()) ||
      customerNumber.includes(searchTerm) ||
      log.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    const matchesHospital = hospitalFilter === 'All' || log.hospitalId === hospitalFilter;

    return matchesSearch && matchesStatus && matchesHospital;
  });

  // Sort by timestamp desc
  const sortedLogs = [...filteredLogs].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening if clicking download inside a row (though button is outside)

    // CSV Header
    const headers = ['일시,병원명,고객 번호,상태,랜딩 방문,최근 랜딩 방문,메시지 내용'];

    // CSV Rows
    const rows = sortedLogs.map(log => {
      const timestamp = format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss');
      const hospitalName = getHospitalName(log.hospitalId);
      const visits = log.landingVisits !== undefined ? log.landingVisits : 0;
      const lastVisit = log.lastLandingVisit ? format(new Date(log.lastLandingVisit), 'yyyy-MM-dd HH:mm:ss') : '-';
      const content = log.content.replace(/,/g, ' '); // Replace commas to prevent CSV breakage
      const customer = getCustomerNumber(log) || '';
      return `${timestamp},${hospitalName},${customer},${log.status},${visits},${lastVisit},${content}`;
    });

    // Combine and create blob
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel support
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `log_report_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] relative">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
        <div>
          <h2 className="text-2xl font-bold text-white">로그 기록</h2>
          <p className="text-gray-400 mt-1">전체 발송 이력 및 통화 로그를 확인합니다</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#2A2A2A] border border-[#383838] rounded-lg px-2">
            <Building size={16} className="text-gray-400 ml-2" />
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="bg-transparent text-white border-none focus:ring-0 py-2 px-2 text-sm focus:outline-none max-w-[150px]"
            >
              <option value="All">전체 병원</option>
              {hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center bg-[#2A2A2A] border border-[#383838] rounded-lg px-2">
            <Filter size={16} className="text-gray-400 ml-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-white border-none focus:ring-0 py-2 px-2 text-sm focus:outline-none"
            >
              <option value="All">전체 상태</option>
              <option value="Success">문자 성공</option>
              <option value="Failed">문자 실패</option>
              <option value="Incoming">수신중 (SKB)</option>
              <option value="Missed">부재중 (SKB)</option>
              <option value="Completed">통화완료 (SKB)</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#383838] rounded-lg text-white focus:outline-none focus:border-[#00E2E3] w-48 transition-colors"
            />
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-[#00E2E3] text-black font-bold rounded-lg hover:bg-[#00c4c5] transition-colors ml-2"
          >
            <Download size={18} className="mr-2" />
            다운로드
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#252525] border-b border-[#333]">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">일시</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">병원명</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">고객 번호</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">랜딩 방문</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">최근 랜딩 방문</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {sortedLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-[#2A2A2A] transition-colors cursor-pointer active:bg-[#333]"
                >
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 opacity-70" />
                      {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    <div className="flex items-center">
                      <Building size={14} className="mr-2 text-[#00E2E3] opacity-70" />
                      {getHospitalName(log.hospitalId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#E2E3E4] font-mono">
                    <div className="flex items-center">
                      <ArrowDownLeft size={14} className="mr-2 text-gray-500" />
                      {getCustomerNumber(log) || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {log.type === 'skb_call' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === 'Incoming' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                          log.status === 'Missed' ? 'bg-red-900/30 text-red-400 border-red-800' :
                            'bg-green-900/30 text-green-400 border-green-800'
                        }`}>
                        {log.status === 'Incoming' && <PhoneIncoming size={12} className="mr-1" />}
                        {log.status === 'Missed' && <PhoneMissed size={12} className="mr-1" />}
                        {log.status === 'Completed' && <PhoneCall size={12} className="mr-1" />}
                        {log.status === 'Incoming' ? '수신중' : log.status === 'Missed' ? '부재중' : '통화완료'}
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === 'Success'
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                          : 'bg-red-900/30 text-red-400 border-red-800'
                        }`}>
                        {log.status === 'Success' ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                        {log.status === 'Success' ? '발송 성공' : '발송 실패'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-white">
                    {log.landingVisits !== undefined ? (
                      <div className="flex items-center text-[#00E2E3]">
                        <MousePointerClick size={14} className="mr-2 opacity-70" />
                        {log.landingVisits}회
                      </div>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {log.lastLandingVisit ? (
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2 text-gray-500" />
                        {format(new Date(log.lastLandingVisit), 'MM-dd HH:mm')}
                      </div>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              로그 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#1E1E1E] w-full max-w-2xl rounded-2xl border border-[#333] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#252525]">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <MessageSquare size={18} className="mr-2 text-[#00E2E3]" />
                  로그 상세 정보
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#333]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">

                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                    <p className="text-xs text-gray-500 mb-1">병원명</p>
                    <div className="flex items-center text-white font-medium">
                      <Building size={16} className="mr-2 text-gray-400" />
                      {getHospitalName(selectedLog.hospitalId)}
                    </div>
                  </div>

                  <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                    <p className="text-xs text-gray-500 mb-1">수신자 번호</p>
                    <div className="flex items-center text-white font-mono">
                      <ArrowDownLeft size={16} className="mr-2 text-gray-400" />
                      {selectedLog.receiverNumber || '-'}
                    </div>
                  </div>

                  <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                    <p className="text-xs text-gray-500 mb-1">발송 시간</p>
                    <div className="flex items-center text-white font-mono text-sm">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {format(new Date(selectedLog.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                  </div>

                  <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                    <p className="text-xs text-gray-500 mb-1">상태</p>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center text-sm font-medium ${selectedLog.status === 'Success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {selectedLog.status === 'Success' ? <CheckCircle size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
                        {selectedLog.status === 'Success' ? '발송 성공' : '발송 실패'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Landing Visits Highlight */}
                {selectedLog.landingVisits !== undefined && (
                  <div className="bg-[#00E2E3]/10 p-4 rounded-xl border border-[#00E2E3]/30 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-[#00E2E3]/20 p-2 rounded-lg mr-4">
                        <MousePointerClick size={24} className="text-[#00E2E3]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#00E2E3] font-bold uppercase tracking-wider">랜딩 페이지 유입 성과</p>
                        <p className="text-gray-300 text-sm mt-0.5">고객이 메시지 링크를 클릭하여 방문한 횟수</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">
                      {selectedLog.landingVisits}
                      <span className="text-sm text-gray-500 ml-1 font-sans font-normal">회</span>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-400">전송된 메시지 내용</p>
                    <span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-1 rounded border border-[#383838]">
                      {selectedLog.content.length}자
                    </span>
                  </div>
                  <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                    {selectedLog.content}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#2A2A2A] bg-[#1E1E1E] flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-6 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg transition-colors text-sm font-medium border border-[#383838]"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};