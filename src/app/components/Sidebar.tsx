import React from 'react';
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Shield, User, Users, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import { AuthUser } from '../lib/types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const isMaster = user?.role === 'master';

  const allMenuItems = [
    { id: 'dashboard', label: isMaster ? '병원 목록' : '병원 관리', icon: LayoutDashboard, masterOnly: false },
    { id: 'logs', label: '로그 기록', icon: FileText, masterOnly: false },
    { id: 'patients', label: '환자 관리', icon: Users, masterOnly: false },
    { id: 'templates', label: '메시지 템플릿', icon: MessageSquare, masterOnly: false },
    { id: 'settings', label: '설정', icon: Settings, masterOnly: false },
  ];

  const menuItems = allMenuItems;


  return (
    <div className="w-56 bg-[#141414] border-r border-[#2A2A2A] flex flex-col h-full text-[#E2E3E4]">
      <div className="py-5 flex justify-center">
        <img src="/logo.png" alt="더하이메디 로고" className="w-20 object-contain" />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'dashboard');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                "flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 group",
                isActive
                  ? "bg-[#00E2E3]/10 text-[#00E2E3]"
                  : "hover:bg-[#2A2A2A] text-gray-400 hover:text-white"
              )}
            >
              <Icon size={20} className={clsx("mr-3", isActive ? "text-[#00E2E3]" : "group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-2">
        {/* Logged-in user info */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] mb-2">
            <div className={clsx(
              "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
              isMaster ? "bg-[#00E2E3]/20" : "bg-purple-500/20"
            )}>
              {isMaster
                ? <Shield size={15} className="text-[#00E2E3]" />
                : <User size={15} className="text-purple-400" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {isMaster ? 'Master' : user.hospitalName}
              </p>
              <p className={clsx(
                "text-[10px] font-medium truncate",
                isMaster ? "text-[#00E2E3]" : "text-purple-400"
              )}>
                {isMaster ? '전체 관리자' : `코드: ${user.hospitalCode}`}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};
