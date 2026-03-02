import React, { useState, useMemo, useRef } from 'react';
import {
    Search, Filter, User, Phone, Building, CheckCircle, XCircle,
    Calendar, MousePointerClick, Clock, MessageSquare, X,
    ArrowLeft, ArrowDownLeft, PhoneMissed, PhoneOff, Send, Copy, UploadCloud, Download, Plus, PhoneIncoming, PhoneCall
} from 'lucide-react';
import { toast } from 'sonner';
import { CallLog, Hospital, PatientRegistration, AuthUser } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { db } from '../lib/db';
import * as xlsx from 'xlsx';

interface PatientListProps {
    logs: CallLog[];
    hospitals: Hospital[];
    registrations: PatientRegistration[];
    user: AuthUser;
    onAddRegistrations: (regs: PatientRegistration[]) => void;
}

interface PatientSummary {
    phoneNumber: string;
    name?: string;
    purpose?: string;
    hospitalIds: string[];
    totalLogs: number;
    successCount: number;
    failedCount: number;
    lastContact: string;
    totalLandingVisits: number;
    logs: CallLog[];
}

const TRIGGER_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    missed: { label: '부재중 (문자)', icon: <PhoneMissed size={12} className="mr-1" />, color: 'text-red-400 bg-red-900/20 border-red-800/50' },
    callEnded: { label: '통화종료 (문자)', icon: <PhoneOff size={12} className="mr-1" />, color: 'text-blue-400 bg-blue-900/20 border-blue-800/50' },
    manual: { label: '수동발송', icon: <Send size={12} className="mr-1" />, color: 'text-purple-400 bg-purple-900/20 border-purple-800/50' },
    skb_missed: { label: '부재중 (SKB)', icon: <PhoneMissed size={12} className="mr-1" />, color: 'text-red-400 bg-red-900/20 border-red-800/50' },
    skb_incoming: { label: '수신중 (SKB)', icon: <PhoneIncoming size={12} className="mr-1" />, color: 'text-blue-400 bg-blue-900/20 border-blue-800/50' },
    skb_completed: { label: '통화완료 (SKB)', icon: <PhoneCall size={12} className="mr-1" />, color: 'text-green-400 bg-green-900/20 border-green-800/50' },
};

export const PatientList: React.FC<PatientListProps> = ({ logs, hospitals, registrations, user, onAddRegistrations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [hospitalFilter, setHospitalFilter] = useState<string>('All');
    const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
    const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const getHospitalName = (id: string) => hospitals.find(h => h.id === id)?.name ?? 'Unknown';

    const getCustomerNumber = (log: CallLog) =>
        log.triggerType === 'manual' ? log.receiverNumber : log.callerNumber;

    const handleCopyPurpose = (purpose: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(purpose);
        toast.success('접수 목적이 복사되었습니다.');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let targetHospitalId = user.hospitalId;
        if (user.role === 'master') {
            if (hospitalFilter === 'All') {
                toast.error('마스터 계정은 엑셀 업로드 시 특정 병원을 선택해야 합니다. "전체 병원" 필터를 변경해주세요.');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            targetHospitalId = hospitalFilter;
        }

        if (!targetHospitalId) {
            toast.error('업로드할 병원 정보를 찾을 수 없습니다.');
            return;
        }

        setIsUploading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = xlsx.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(worksheet) as any[];

            if (jsonData.length === 0) {
                toast.info('업로드된 파일에 데이터가 없습니다.');
                setIsUploading(false);
                return;
            }

            const newRegs: PatientRegistration[] = [];
            for (const row of jsonData) {
                // Determine values, allowing flexibility in column names
                const name = row['이름'] || row['환자명'] || row['name'] || '이름 없음';
                const phone = row['전화번호'] || row['핸드폰'] || row['연락처'] || row['phone'];
                const purpose = row['접수목적'] || row['목적'] || row['방문목적'] || row['purpose'] || '';

                if (!phone) continue; // Skip rows without phone numbers

                // Format phone number if needed, removing non-digits
                let cleanPhone = phone.toString().replace(/[^0-9]/g, '');
                // Auto format to 010-XXXX-XXXX if it is 11 digits
                if (cleanPhone.length === 11) {
                    cleanPhone = `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 7)}-${cleanPhone.slice(7)}`;
                } else if (cleanPhone.length === 10) {
                    cleanPhone = `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
                } else {
                    cleanPhone = phone.toString(); // keep original if unsure
                }

                newRegs.push({
                    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    hospitalId: targetHospitalId,
                    name: String(name).trim(),
                    phone: cleanPhone,
                    purpose: String(purpose).trim(),
                    submittedAt: new Date().toISOString(),
                });
            }

            if (newRegs.length > 0) {
                const createdRegs = await Promise.all(newRegs.map(reg => db.createRegistration(reg)));
                onAddRegistrations(createdRegs);
                toast.success(`총 ${createdRegs.length}명의 환자 정보가 성공적으로 업로드되었습니다.`);
            } else {
                toast.error('유효한 데이터(전화번호 포함)를 찾을 수 없습니다.');
            }
            setShowUploadModal(false);
        } catch (error) {
            console.error('Excel upload error:', error);
            toast.error('엑셀 파일 처리 중 오류가 발생했습니다. 양식을 확인해주세요.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Build patient summaries grouped by phone number
    // Start with registrations (접수폼), then merge call_logs on top
    const patientMap = useMemo(() => {
        const map = new Map<string, PatientSummary>();

        // 1. 접수폼 제출 데이터 먼저 추가 (최신순으로 덮어씀)
        // Sort registrations to ensure the latest one overwrites name/purpose if duplicates exist
        const sortedRegs = [...registrations].sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        sortedRegs.forEach(reg => {
            const phone = reg.phone || '알 수 없음';
            if (!map.has(phone)) {
                map.set(phone, {
                    phoneNumber: phone,
                    hospitalIds: [],
                    totalLogs: 0,
                    successCount: 0,
                    failedCount: 0,
                    lastContact: reg.submittedAt,
                    totalLandingVisits: 0,
                    logs: [],
                });
            }
            const p = map.get(phone)!;
            // Always update name/purpose with the latest registration
            if (reg.name) p.name = reg.name;
            if (reg.purpose) p.purpose = reg.purpose;
            if (!p.hospitalIds.includes(reg.hospitalId)) p.hospitalIds.push(reg.hospitalId);
            if (new Date(reg.submittedAt) > new Date(p.lastContact)) p.lastContact = reg.submittedAt;
        });

        // 2. call_logs 병합
        logs.forEach(log => {
            const phone = getCustomerNumber(log) || '알 수 없음';
            if (!map.has(phone)) {
                map.set(phone, {
                    phoneNumber: phone,
                    hospitalIds: [],
                    totalLogs: 0,
                    successCount: 0,
                    failedCount: 0,
                    lastContact: log.timestamp,
                    totalLandingVisits: 0,
                    logs: [],
                });
            }
            const p = map.get(phone)!;
            p.totalLogs += 1;
            if (log.status === 'Success') p.successCount += 1;
            else p.failedCount += 1;
            if (!p.hospitalIds.includes(log.hospitalId)) p.hospitalIds.push(log.hospitalId);
            if (new Date(log.timestamp) > new Date(p.lastContact)) p.lastContact = log.timestamp;
            p.totalLandingVisits += log.landingVisits ?? 0;
            p.logs.push(log);
        });
        return map;
    }, [logs, registrations]);

    const allPatients = useMemo(() =>
        Array.from(patientMap.values()).sort(
            (a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
        ), [patientMap]);

    const filteredPatients = useMemo(() => {
        return allPatients.filter(p => {
            const matchesSearch =
                p.phoneNumber.includes(searchTerm) ||
                p.hospitalIds.some(id => getHospitalName(id).toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesHospital = hospitalFilter === 'All' || p.hospitalIds.includes(hospitalFilter);
            return matchesSearch && matchesHospital;
        });
    }, [allPatients, searchTerm, hospitalFilter]);

    // Patient detail: sorted logs
    const patientLogs = useMemo(() =>
        selectedPatient
            ? [...selectedPatient.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            : [],
        [selectedPatient]);

    // ─── Patient Detail View ─────────────────────────────────────────────────
    if (selectedPatient) {
        return (
            <div className="flex flex-col h-full bg-[#141414] relative">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSelectedPatient(null)}
                            className="mr-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#00E2E3]/10 border border-[#00E2E3]/20">
                                    <User size={18} className="text-[#00E2E3]" />
                                </div>
                                {selectedPatient.name ? `${selectedPatient.name} (${selectedPatient.phoneNumber})` : selectedPatient.phoneNumber}
                            </h2>
                            {selectedPatient.purpose && (
                                <div className="flex items-center gap-2 mt-2 ml-12">
                                    <p className="text-sm text-[#00E2E3] bg-[#00E2E3]/10 px-3 py-1 border border-[#00E2E3]/20 rounded-md m-0">
                                        [접수 목적] {selectedPatient.purpose}
                                    </p>
                                    <button
                                        onClick={(e) => handleCopyPurpose(selectedPatient.purpose!, e)}
                                        className="text-[#00E2E3] opacity-70 hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-[#00E2E3]/10"
                                        title="목적 복사"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            )}
                            <p className="text-sm text-gray-500 mt-1 ml-12 flex items-center gap-1.5">
                                <Building size={14} className="text-gray-400" />
                                총 {selectedPatient.totalLogs}건 · 성공 {selectedPatient.successCount} · 실패 {selectedPatient.failedCount} · 랜딩방문 {selectedPatient.totalLandingVisits}회
                            </p>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-center">
                            <p className="text-xs text-gray-500">연관 병원</p>
                            <p className="text-white font-bold">{selectedPatient.hospitalIds.map(id => getHospitalName(id)).join(', ')}</p>
                        </div>
                    </div>
                </div>

                {/* Log Table */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#252525] border-b border-[#333]">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">일시</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">병원</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">유형</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">상태</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">랜딩 방문</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A]">
                                {patientLogs.map((log, idx) => {
                                    const trigger = TRIGGER_LABELS[log.triggerType ?? 'missed'];
                                    return (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            onClick={() => setSelectedLog(log)}
                                            className="hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                                                <div className="flex items-center">
                                                    <Calendar size={13} className="mr-2 opacity-70" />
                                                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white">
                                                <div className="flex items-center">
                                                    <Building size={13} className="mr-2 text-[#00E2E3] opacity-70" />
                                                    {getHospitalName(log.hospitalId)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${trigger.color}`}>
                                                    {trigger.icon}{trigger.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {log.type === 'skb_call' ? (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === 'Incoming' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                                                        log.status === 'Missed' ? 'bg-red-900/30 text-red-400 border-red-800' :
                                                            'bg-green-900/30 text-green-400 border-green-800'
                                                        }`}>
                                                        {log.status === 'Incoming' && <PhoneIncoming size={11} className="mr-1" />}
                                                        {log.status === 'Missed' && <PhoneMissed size={11} className="mr-1" />}
                                                        {log.status === 'Completed' && <PhoneCall size={11} className="mr-1" />}
                                                        {log.status === 'Incoming' ? '수신중' : log.status === 'Missed' ? '부재중' : '통화완료'}
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === 'Success' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                                                        {log.status === 'Success' ? <CheckCircle size={11} className="mr-1" /> : <XCircle size={11} className="mr-1" />}
                                                        {log.status === 'Success' ? '발송성공' : '발송실패'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-[#00E2E3]">
                                                {log.landingVisits !== undefined ? `${log.landingVisits}회` : <span className="text-gray-600">-</span>}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {patientLogs.length === 0 && (
                            <div className="p-12 text-center text-gray-500">로그 데이터가 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* Log Detail Modal (reused) */}
                <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} getHospitalName={getHospitalName} />
            </div>
        );
    }

    // ─── Patient List View ────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full bg-[#141414]">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
                <div>
                    <h2 className="text-2xl font-bold text-white">환자 관리</h2>
                    <p className="text-gray-400 mt-1">전화번호 기준으로 환자별 SMS 이력을 확인합니다</p>
                </div>
                <div className="flex items-center space-x-3">
                    {hospitals.length > 1 && (
                        <div className="flex items-center bg-[#2A2A2A] border border-[#383838] rounded-lg px-2">
                            <Building size={16} className="text-gray-400 ml-2" />
                            <select
                                value={hospitalFilter}
                                onChange={e => setHospitalFilter(e.target.value)}
                                className="bg-transparent text-white border-none focus:ring-0 py-2 px-2 text-sm focus:outline-none max-w-[150px]"
                            >
                                <option value="All">전체 병원</option>
                                {hospitals.map(h => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        className="hidden"
                    />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#383838] rounded-lg text-white text-sm transition-colors"
                        >
                            <Plus size={16} className="mr-2 text-[#00E2E3]" />
                            환자 추가
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            disabled={isUploading}
                            className="flex items-center px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#383838] rounded-lg text-white text-sm transition-colors"
                        >
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <UploadCloud size={16} className="mr-2 text-gray-400" />
                            )}
                            엑셀 업로드
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="번호, 이름, 목적 또는 병원명 검색..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#383838] rounded-lg text-white focus:outline-none focus:border-[#00E2E3] w-56 transition-colors"
                        />
                    </div>
                    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-sm text-gray-400">
                        총 <span className="text-white font-bold">{filteredPatients.length}</span>명
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#252525] border-b border-[#333]">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">이름 (전화번호)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">접수 목적</th>
                                {hospitals.length > 1 && <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">연관 병원</th>}
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">총 발송</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">성공 / 실패</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">랜딩방문</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">최근 연락</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {filteredPatients.map((patient, index) => (
                                <motion.tr
                                    key={patient.phoneNumber}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => setSelectedPatient(patient)}
                                    className="hover:bg-[#2A2A2A] cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-base">
                                                    {patient.name ? patient.name : '알 수 없음'}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono text-gray-500">{patient.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.purpose && (
                                            <div className="flex items-center mt-1 group/purpose">
                                                <span className="text-xs text-gray-500 truncate max-w-[150px]" title={patient.purpose}>
                                                    {patient.purpose}
                                                </span>
                                                <button
                                                    onClick={(e) => handleCopyPurpose(patient.purpose!, e)}
                                                    className="ml-1.5 text-gray-500 hover:text-[#00E2E3] opacity-0 group-hover/purpose:opacity-100 transition-all p-1 rounded hover:bg-[#2A2A2A]"
                                                    title="목적 복사"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        )}
                                        {!patient.purpose && <span className="text-gray-600">-</span>}
                                    </td>
                                    {hospitals.length > 1 && (
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {Array.from(new Set(patient.hospitalIds)).map(id => getHospitalName(id)).join(', ')}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-white font-bold font-mono">{patient.totalLogs}</span>
                                        <span className="text-gray-500 text-xs ml-1">건</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="inline-flex items-center text-xs font-medium text-green-400">
                                                <CheckCircle size={11} className="mr-1" />{patient.successCount}
                                            </span>
                                            <span className="text-gray-600">/</span>
                                            <span className="inline-flex items-center text-xs font-medium text-red-400">
                                                <XCircle size={11} className="mr-1" />{patient.failedCount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {patient.totalLandingVisits > 0 ? (
                                            <div className="flex items-center justify-center text-[#00E2E3] font-mono font-bold">
                                                <MousePointerClick size={14} className="mr-1.5" />
                                                {patient.totalLandingVisits}
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                                        <div className="flex items-center">
                                            <Clock size={13} className="mr-2 opacity-60" />
                                            {format(new Date(patient.lastContact), 'yyyy-MM-dd HH:mm')}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPatients.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            {logs.length === 0 ? '발송 로그가 없습니다.' : '검색 결과가 없습니다.'}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Excel Modal */}
            {showUploadModal && (
                <UploadExcelModal
                    onClose={() => setShowUploadModal(false)}
                    onUploadClick={() => fileInputRef.current?.click()}
                    isUploading={isUploading}
                />
            )}

            {/* Manual Add Patient Modal */}
            {showAddModal && (
                <AddPatientModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={async (reg) => {
                        try {
                            const newReg = await db.createRegistration(reg);
                            onAddRegistrations([newReg]);
                            setShowAddModal(false);
                            toast.success('환자 정보가 성공적으로 추가되었습니다.');
                        } catch (error) {
                            console.error('Failed to add registration:', error);
                            toast.error('환자 추가에 실패했습니다.');
                        }
                    }}
                    user={user}
                    hospitals={hospitals}
                    currentFilter={hospitalFilter}
                />
            )}
        </div>
    );
};

// ─── Shared Log Detail Modal ─────────────────────────────────────────────────
const LogDetailModal: React.FC<{
    log: CallLog | null;
    onClose: () => void;
    getHospitalName: (id: string) => string;
}> = ({ log, onClose, getHospitalName }) => {
    if (!log) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#1E1E1E] w-full max-w-2xl rounded-2xl border border-[#333] shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#252525]">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <MessageSquare size={18} className="mr-2 text-[#00E2E3]" />
                            로그 상세 정보
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#333]">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                                <p className="text-xs text-gray-500 mb-1">병원명</p>
                                <div className="flex items-center text-white font-medium">
                                    <Building size={16} className="mr-2 text-gray-400" />
                                    {getHospitalName(log.hospitalId)}
                                </div>
                            </div>
                            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                                <p className="text-xs text-gray-500 mb-1">고객 번호</p>
                                <div className="flex items-center text-white font-mono">
                                    <ArrowDownLeft size={16} className="mr-2 text-gray-400" />
                                    {log.triggerType === 'manual' ? log.receiverNumber : log.callerNumber}
                                </div>
                            </div>
                            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                                <p className="text-xs text-gray-500 mb-1">발송 시간</p>
                                <div className="flex items-center text-white font-mono text-sm">
                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                                </div>
                            </div>
                            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
                                <p className="text-xs text-gray-500 mb-1">상태</p>
                                <span className={`inline-flex items-center text-sm font-medium ${log.status === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {log.status === 'Success' ? <CheckCircle size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
                                    {log.status === 'Success' ? '발송 성공' : '발송 실패'}
                                </span>
                            </div>
                        </div>
                        {log.landingVisits !== undefined && (
                            <div className="bg-[#00E2E3]/10 p-4 rounded-xl border border-[#00E2E3]/30 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-[#00E2E3]/20 p-2 rounded-lg mr-4">
                                        <MousePointerClick size={24} className="text-[#00E2E3]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#00E2E3] font-bold uppercase tracking-wider">랜딩 페이지 유입</p>
                                        <p className="text-gray-300 text-sm mt-0.5">고객이 메시지 링크를 클릭하여 방문한 횟수</p>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white font-mono">
                                    {log.landingVisits}<span className="text-sm text-gray-500 ml-1 font-sans font-normal">회</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-gray-400">전송된 메시지 내용</p>
                                <span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-1 rounded border border-[#383838]">{log.content.length}자</span>
                            </div>
                            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {log.content}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-[#2A2A2A] bg-[#1E1E1E] flex justify-end">
                        <button onClick={onClose} className="px-6 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg transition-colors text-sm font-medium border border-[#383838]">닫기</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// ── Upload Excel Modal Component ──────────────────────────────────────────────
const UploadExcelModal: React.FC<{
    onClose: () => void;
    onUploadClick: () => void;
    isUploading: boolean;
}> = ({ onClose, onUploadClick, isUploading }) => {

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#1E1E1E] w-full max-w-md rounded-2xl border border-[#333] shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#252525]">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <UploadCloud size={18} className="mr-2 text-[#00E2E3]" />
                            엑셀 파일 대량 업로드
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#333]">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4 text-sm text-gray-300">
                        <p>환자 접수 데이터를 엑셀 파일로 한 번에 등록할 수 있습니다.</p>

                        <div className="bg-[#141414] border border-[#2A2A2A] p-4 rounded-lg space-y-2">
                            <h4 className="font-bold text-white mb-2">📌 업로드 방법</h4>
                            <ul className="list-disc pl-4 space-y-1 text-gray-400">
                                <li>엑셀 1행 제목(헤더)에 맞춰 <b>'이름', '전화번호'</b>를 기입합니다. (접수목적은 선택사항)</li>
                                <li>작성된 엑셀 파일을 우측 하단의 [파일 업로드] 버튼을 눌러 추가합니다.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 border-t border-[#2A2A2A] bg-[#252525] flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-transparent text-gray-400 hover:text-white rounded-lg transition-colors font-medium hover:bg-[#333]"
                        >
                            취소
                        </button>
                        <button
                            onClick={onUploadClick}
                            disabled={isUploading}
                            className="px-6 py-2 bg-[#00E2E3] text-black hover:bg-[#00c4c5] rounded-lg transition-colors font-bold flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                            ) : null}
                            파일 업로드
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// ── Manual Add Patient Modal Component ──────────────────────────────────────────
const AddPatientModal: React.FC<{
    onClose: () => void;
    onAdd: (reg: Omit<PatientRegistration, 'id' | 'submittedAt'>) => Promise<void>;
    user: AuthUser;
    hospitals: Hospital[];
    currentFilter: string;
}> = ({ onClose, onAdd, user, hospitals, currentFilter }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    let initialHospitalId = user.hospitalId;
    if (user.role === 'master' && currentFilter !== 'All') {
        initialHospitalId = currentFilter;
    }

    const [hospitalId, setHospitalId] = useState(initialHospitalId || '');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 3) {
            setPhone(val);
        } else if (val.length <= 7) {
            setPhone(`${val.slice(0, 3)}-${val.slice(3)}`);
        } else {
            setPhone(`${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !hospitalId) {
            toast.error('이름, 전화번호, 병원을 모두 선택해주세요.');
            return;
        }

        let cleanPhone = phone.toString().replace(/[^0-9]/g, '');
        if (cleanPhone.length === 11) {
            cleanPhone = `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 7)}-${cleanPhone.slice(7)}`;
        } else if (cleanPhone.length === 10) {
            cleanPhone = `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
        }

        setIsSubmitting(true);
        await onAdd({
            hospitalId,
            name: name.trim(),
            phone: cleanPhone,
            purpose: purpose.trim()
        });
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#1E1E1E] w-full max-w-md rounded-2xl border border-[#333] shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#252525]">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <User size={18} className="mr-2 text-[#00E2E3]" />
                            신규 환자 수동 추가
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#333]">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {user.role === 'master' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">병원 선택</label>
                                <select
                                    value={hospitalId}
                                    onChange={(e) => setHospitalId(e.target.value)}
                                    className="w-full bg-[#141414] border border-[#383838] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                                >
                                    <option value="" disabled>병원을 선택하세요</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">환자 이름</label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="환자 이름 입력"
                                className="w-full bg-[#141414] border border-[#383838] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">전화번호</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-0000-0000"
                                maxLength={13}
                                className="w-full bg-[#141414] border border-[#383838] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">접수 목적 (선택항목)</label>
                            <input
                                type="text"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="예) 임플란트 상담"
                                className="w-full bg-[#141414] border border-[#383838] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-transparent text-gray-400 hover:text-white rounded-lg transition-colors font-medium hover:bg-[#333]"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !name.trim() || phone.length < 12 || !hospitalId}
                                className="px-6 py-2 bg-[#00E2E3] text-black hover:bg-[#00c4c5] rounded-lg transition-colors font-bold flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '추가 중...' : '환자 추가'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
