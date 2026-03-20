import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginPageProps {
    onLogin: (code: string, password: string) => Promise<boolean>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [failCount, setFailCount] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);
    const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

    // 잠금 카운트다운 타이머
    React.useEffect(() => {
        if (!lockedUntil) return;
        const id = setInterval(() => {
            const left = Math.ceil((lockedUntil - Date.now()) / 1000);
            if (left <= 0) { setLockedUntil(null); setLockSecondsLeft(0); setFailCount(0); }
            else setLockSecondsLeft(left);
        }, 1000);
        return () => clearInterval(id);
    }, [lockedUntil]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lockedUntil && Date.now() < lockedUntil) return;
        if (!code.trim() || !password.trim()) {
            setError('병원 코드와 비밀번호를 입력해주세요.');
            return;
        }
        setIsLoading(true);
        setError('');
        const success = await onLogin(code.trim(), password);
        if (!success) {
            const next = failCount + 1;
            setFailCount(next);
            if (next >= 5) {
                const until = Date.now() + 30_000;
                setLockedUntil(until);
                setLockSecondsLeft(30);
                setError('로그인 5회 실패. 30초 후 다시 시도해주세요.');
            } else {
                setError(`병원 코드 또는 비밀번호가 올바르지 않습니다. (${next}/5)`);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="flex h-screen w-full bg-[#0D0D0D] items-center justify-center overflow-hidden relative">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00E2E3]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00E2E3]/3 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md mx-4">
                {/* Logo / Title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00E2E3]/10 border border-[#00E2E3]/20 mb-5">
                        <Lock size={28} className="text-[#00E2E3]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">더하이메디</h1>
                    <p className="text-gray-500 mt-2 text-sm">병원 관리 시스템에 로그인하세요</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Code input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                병원 코드 / 마스터 ID
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={e => { setCode(e.target.value); setError(''); }}
                                    placeholder="예: H001 또는 master"
                                    className="w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#00E2E3]/50 focus:ring-1 focus:ring-[#00E2E3]/30 transition-all"
                                    autoComplete="username"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full pl-10 pr-12 py-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#00E2E3]/50 focus:ring-1 focus:ring-[#00E2E3]/30 transition-all"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                                {error}
                                {lockedUntil && lockSecondsLeft > 0 && (
                                    <span className="ml-1 font-mono font-bold">{lockSecondsLeft}s</span>
                                )}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading || !!lockedUntil}
                            className="w-full flex items-center justify-center gap-2 bg-[#00E2E3] text-[#0D0D0D] font-semibold py-3 rounded-lg hover:bg-[#00c8c9] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            ) : (
                                <LogIn size={18} />
                            )}
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    {/* Help text */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        마스터 계정 또는 병원 고유코드로 로그인하세요
                    </p>
                </div>
            </div>
        </div>
    );
};
