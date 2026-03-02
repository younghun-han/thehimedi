import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Save, ArrowLeft, X } from 'lucide-react';
import { MessageTemplate } from '../lib/types';
import { MessageTemplateEditor, TemplateType } from './MessageTemplateEditor';
import { motion } from 'framer-motion';

interface MessageTemplateListProps {
  templates: MessageTemplate[];
  onUpdateTemplates: (newTemplates: MessageTemplate[]) => void;
}

export const MessageTemplateList: React.FC<MessageTemplateListProps> = ({ templates, onUpdateTemplates }) => {
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const deletingId = confirmDeleteId;

  // Form state
  const [formData, setFormData] = useState<Partial<MessageTemplate>>({
    name: '',
    type: 'missed',
    content: ''
  });

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (template: MessageTemplate) => {
    setFormData({ ...template });
    setEditingId(template.id);
    setView('edit');
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      type: 'missed',
      content: ''
    });
    setEditingId(null);
    setView('create');
  };

  const handleSave = () => {
    if (!formData.name || !formData.content) return; // Simple validation

    if (view === 'create') {
      const newTemplate: MessageTemplate = {
        id: '', // Supabase will generate UUID
        name: formData.name!,
        type: formData.type as MessageTemplate['type'],
        content: formData.content!,
        lastModified: new Date().toISOString().split('T')[0]
      };
      onUpdateTemplates([newTemplate, ...templates]);
    } else if (view === 'edit' && editingId) {
      onUpdateTemplates(templates.map(t => t.id === editingId ? {
        ...t,
        name: formData.name!,
        type: formData.type as MessageTemplate['type'],
        content: formData.content!,
        lastModified: new Date().toISOString().split('T')[0]
      } : t));
    }
    setView('list');
  };

  const handleDelete = (id: string) => {
    onUpdateTemplates(templates.filter(t => t.id !== id));
    setConfirmDeleteId(null);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'missed': return '부재중 응답';
      case 'callEnded': return '전화통화 종료시';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'missed': return 'text-orange-400 bg-orange-900/20 border-orange-800';
      case 'callEnded': return 'text-blue-400 bg-blue-900/20 border-blue-800';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  if (view === 'list') {
    return (
      <div className="flex flex-col h-full bg-[#141414]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
          <div>
            <h2 className="text-2xl font-bold text-white">메시지 템플릿</h2>
            <p className="text-gray-400 mt-1">자주 사용하는 메시지 형식을 관리합니다</p>
          </div>
          <div className="flex items-center space-x-3">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="템플릿 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#383838] rounded-lg text-white focus:outline-none focus:border-[#00E2E3] w-64 transition-colors"
              />
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center px-4 py-2 bg-[#00E2E3] text-black font-semibold rounded-lg hover:bg-[#00c4c5] transition-colors shadow-[0_0_15px_rgba(0,226,227,0.3)]"
            >
              <Plus size={18} className="mr-2" />
              새 템플릿
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#00E2E3] transition-colors group flex flex-col"
              >
                {/* 제목 + 버튼 한 줄 */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-white truncate flex-1 mr-2">{template.name}</h3>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {deletingId === template.id ? (
                      <div className="flex items-center gap-1 bg-red-900/30 border border-red-800 rounded-lg px-2 py-1">
                        <span className="text-xs text-red-400 mr-1">삭제?</span>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="text-xs px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-500 transition-colors font-bold"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-0.5 text-gray-400 hover:text-white rounded hover:bg-[#383838] transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#383838] transition-colors"
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(template.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-[#383838] transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 bg-[#252525] rounded p-3 mb-3 overflow-hidden text-sm text-gray-400 border border-[#333]">
                  <p className="line-clamp-4 leading-relaxed">{template.content}</p>
                </div>

                <div className="text-xs text-gray-500">
                  <span>최종 수정: {template.lastModified}</span>
                </div>
              </motion.div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                검색된 템플릿이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Create/Edit View
  return (
    <div className="flex flex-col h-full bg-[#141414]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#2A2A2A]">
        <div className="flex items-center">
          <button
            onClick={() => setView('list')}
            className="mr-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">
              {view === 'create' ? '새 템플릿 생성' : '템플릿 수정'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">메시지 내용을 작성하고 변수를 활용하세요</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2 bg-[#00E2E3] text-black font-bold rounded-lg hover:bg-[#00c4c5] transition-colors shadow-[0_0_15px_rgba(0,226,227,0.3)]"
        >
          <Save size={18} className="mr-2" />
          저장
        </button>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] p-8 shadow-lg">
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                템플릿 이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 주말/공휴일 안내"
                className="w-full bg-[#383838] border border-[#4A4A4A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00E2E3] transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                메시지 내용
              </label>
              <MessageTemplateEditor
                type={'missed' as TemplateType}
                value={formData.content || ''}
                onChange={(val) => setFormData({ ...formData, content: val })}
                placeholder="내용을 입력하세요..."
                hideVariables={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
