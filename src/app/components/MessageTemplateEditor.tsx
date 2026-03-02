import React from 'react';
import { Plus, HelpCircle } from 'lucide-react';

export type TemplateType = 'missed' | 'callEnded' | 'review' | 'reservation';

interface MessageTemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  type: TemplateType;
  placeholder?: string;
  hideVariables?: boolean;
}

const VARIABLES: Record<TemplateType, { key: string; label: string; desc: string }[]> = {
  missed: [
    { key: '#{고객명}', label: '고객명', desc: '전화 건 사람의 이름 (저장된 경우)' },
    { key: '#{병원명}', label: '병원명', desc: '설정된 병원 이름' },
    { key: '#{홈페이지}', label: '홈페이지', desc: '랜딩 페이지 링크' },
  ],
  callEnded: [
    { key: '#{고객명}', label: '고객명', desc: '통화 상대방 이름' },
    { key: '#{병원명}', label: '병원명', desc: '설정된 병원 이름' },
    { key: '#{홈페이지}', label: '홈페이지', desc: '랜딩 페이지 링크' },
    { key: '#{예약링크}', label: '예약링크', desc: '온라인 예약 페이지' },
  ],
  review: [
    { key: '#{고객명}', label: '고객명', desc: '방문 고객 이름' },
    { key: '#{병원명}', label: '병원명', desc: '설정된 병원 이름' },
    { key: '#{리뷰링크}', label: '리뷰링크', desc: '리뷰 작성 페이지 링크' },
    { key: '#{진료일}', label: '진료일', desc: '진료 받은 날짜' },
  ],
  reservation: [
    { key: '#{고객명}', label: '고객명', desc: '예약자 이름' },
    { key: '#{병원명}', label: '병원명', desc: '설정된 병원 이름' },
    { key: '#{예약일시}', label: '예약일시', desc: '확정된 예약 날짜 및 시간' },
    { key: '#{담당의}', label: '담당의', desc: '예약된 담당 의사' },
  ],
};

export const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = ({ 
  value, 
  onChange, 
  type,
  placeholder,
  hideVariables = false
}) => {
  const insertVariable = (variableKey: string) => {
    // Simple append for now, could be improved to insert at cursor position
    const textarea = document.getElementById(`template-editor-${type}`) as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + variableKey + value.substring(end);
      onChange(newValue);
      
      // Restore cursor position after update (needs setTimeout to wait for render)
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableKey.length, start + variableKey.length);
      }, 0);
    } else {
      onChange(value + variableKey);
    }
  };

  return (
    <div className="flex flex-col border border-[#4A4A4A] rounded-lg bg-[#383838] overflow-hidden focus-within:border-[#00E2E3] transition-colors">
      {/* Toolbar */}
      {!hideVariables && VARIABLES[type] && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#2A2A2A] border-b border-[#4A4A4A]">
          <span className="text-xs text-gray-400 font-medium mr-1">변수 삽입:</span>
          {VARIABLES[type].map((v) => (
            <button
              key={v.key}
              onClick={() => insertVariable(v.key)}
              title={v.desc}
              className="flex items-center px-2 py-1 text-xs font-mono bg-[#383838] text-[#00E2E3] border border-[#4A4A4A] rounded hover:bg-[#444] hover:border-[#00E2E3] transition-colors"
            >
              <Plus size={10} className="mr-1" />
              {v.label}
            </button>
          ))}
          <div className="flex-1" />
          <div className="group relative">
            <HelpCircle size={14} className="text-gray-500 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-black border border-[#333] rounded text-xs text-gray-300 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              변수는 발송 시 실제 데이터로 자동 치환됩니다.
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <textarea
        id={`template-editor-${type}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full bg-[#383838] p-3 text-white focus:outline-none resize-none text-sm leading-relaxed font-sans"
      />

      {/* Footer */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-[#2A2A2A] border-t border-[#4A4A4A]">
        <div className="text-xs text-gray-500">
          * {type === 'missed' ? 'LMS' : '알림톡/LMS'} 포맷 자동 변환
        </div>
        <div className={`text-xs font-mono ${value.length > 80 ? 'text-yellow-500' : 'text-gray-400'}`}>
          {value.length} / {value.length > 45 ? '2000 (LMS)' : '45 (SMS)'}
        </div>
      </div>
    </div>
  );
};
