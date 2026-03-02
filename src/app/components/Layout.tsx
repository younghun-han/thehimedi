import React from 'react';
import { Sidebar } from './Sidebar';
import { AuthUser } from '../lib/types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, user, onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-[#141414] text-[#E2E3E4] overflow-hidden font-sans">
      <Sidebar currentView={currentView} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};
