import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Hospital } from '../lib/types';

interface PatientRegistrationFormProps {
    hospitalCode: string;
}

export const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({ hospitalCode }) => {
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    const [form, setForm] = useState({ name: '', purpose: '' });
    const [phone, setPhone] = useState({ mid: '', last: '' }); // 010-[mid]-[last]
    const [errors, setErrors] = useState<{ name?: string; phone?: string; purpose?: string; privacy?: string }>({});

    useEffect(() => {
        const find = async () => {
            const hospitals = await db.getHospitals();
            const found = hospitals.find(h => h.code.toLowerCase() === hospitalCode.toLowerCase());
            if (found) setHospital(found);
            else setNotFound(true);
        };
        find();
    }, [hospitalCode]);

    const getFullPhone = () => `010-${phone.mid}-${phone.last}`;

    const validate = () => {
        const e: { name?: string; phone?: string; purpose?: string; privacy?: string } = {};
        if (!form.name.trim()) e.name = '이름을 입력해주세요.';
        if (phone.mid.length !== 4 || phone.last.length !== 4)
            e.phone = '전화번호 4자리를 모두 입력해주세요.';
        if (!form.purpose.trim()) e.purpose = '방문 목적을 입력해주세요.';
        if (!privacyChecked) e.privacy = '개인정보 수집 및 이용에 동의해야 합니다.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !hospital) return;
        setIsLoading(true);
        await db.createRegistration({
            id: `reg_${Date.now()}`,
            hospitalId: hospital.id,
            name: form.name.trim(),
            phone: getFullPhone(),
            purpose: form.purpose.trim(),
            submittedAt: new Date().toISOString(),
        });
        setIsLoading(false);
        setSubmitted(true);
    };

    // ── 접수 완료 ────────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#000' }}>접수가 완료되었습니다</h2>
                </div>
            </div>
        );
    }

    // ── 병원 없음 ─────────────────────────────────────────────────────────────
    if (notFound) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>잘못된 접수 링크입니다</h2>
                    <p style={{ color: '#000' }}>병원 코드를 확인해주세요.</p>
                </div>
            </div>
        );
    }

    // ── 로딩 ─────────────────────────────────────────────────────────────────
    if (!hospital) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#aaa', fontFamily: 'sans-serif' }}>불러오는 중...</p>
            </div>
        );
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 12px',
        fontSize: 16,
        color: '#000',
        border: '1px solid #ccc',
        borderRadius: 6,
        outline: 'none',
        boxSizing: 'border-box',
    };
    const errStyle: React.CSSProperties = { color: '#e53e3e', fontSize: 13, marginTop: 4 };
    const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 15, color: '#000' };

    // ── 폼 ───────────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ width: '100%', maxWidth: 440, padding: '40px 24px' }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#000' }}>{hospital.name}</h1>
                <p style={{ color: '#000', marginBottom: 32, fontSize: 15 }}>환자 접수 신청서를 작성해주세요.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>이름</label>
                        <input
                            type="text"
                            placeholder="홍길동"
                            value={form.name}
                            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(err => ({ ...err, name: '' })); }}
                            style={{ ...inputStyle, borderColor: errors.name ? '#e53e3e' : '#ccc' }}
                        />
                        {errors.name && <p style={errStyle}>{errors.name}</p>}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>전화번호</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* 010 고정 */}
                            <div style={{ ...inputStyle, width: 64, flexShrink: 0, textAlign: 'center', background: '#f4f4f4', color: '#555', borderColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, userSelect: 'none' }}>
                                010
                            </div>
                            <span style={{ fontSize: 20, color: '#aaa', flexShrink: 0 }}>-</span>
                            <input
                                id="phone-mid"
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="0000"
                                value={phone.mid}
                                onChange={e => {
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setPhone(p => ({ ...p, mid: v }));
                                    setErrors(err => ({ ...err, phone: '' }));
                                    if (v.length === 4) document.getElementById('phone-last')?.focus();
                                }}
                                style={{ ...inputStyle, width: 80, textAlign: 'center', letterSpacing: 4, borderColor: errors.phone ? '#e53e3e' : '#ccc' }}
                            />
                            <span style={{ fontSize: 20, color: '#aaa', flexShrink: 0 }}>-</span>
                            <input
                                id="phone-last"
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="0000"
                                value={phone.last}
                                onChange={e => {
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setPhone(p => ({ ...p, last: v }));
                                    setErrors(err => ({ ...err, phone: '' }));
                                }}
                                style={{ ...inputStyle, width: 80, textAlign: 'center', letterSpacing: 4, borderColor: errors.phone ? '#e53e3e' : '#ccc' }}
                            />
                        </div>
                        {errors.phone && <p style={errStyle}>{errors.phone}</p>}
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <label style={labelStyle}>방문 목적</label>
                        <textarea
                            placeholder="예: 초진 / 정기검진 등"
                            value={form.purpose}
                            onChange={e => { setForm(f => ({ ...f, purpose: e.target.value })); setErrors(err => ({ ...err, purpose: '' })); }}
                            rows={3}
                            style={{ ...inputStyle, borderColor: errors.purpose ? '#e53e3e' : '#ccc', resize: 'vertical' }}
                        />
                        {errors.purpose && <p style={errStyle}>{errors.purpose}</p>}
                    </div>
                    <div style={{ marginBottom: errors.privacy ? 8 : 32 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={privacyChecked}
                                onChange={e => {
                                    setPrivacyChecked(e.target.checked);
                                    if (e.target.checked) setErrors(err => ({ ...err, privacy: '' }));
                                }}
                                style={{ margin: 0, marginRight: 8, width: 16, height: 16, cursor: 'pointer', marginTop: 2, flexShrink: 0 }}
                            />
                            <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>
                                개인정보 수집 및 이용, 마케팅 활용에 동의합니다
                            </span>
                        </label>
                        {hospital.landingLink && (
                            <a
                                href={hospital.landingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-block', marginTop: 6, marginLeft: 24, fontSize: 12, color: '#0070f3', textDecoration: 'underline' }}
                            >
                                병원 홈페이지 바로가기 →
                            </a>
                        )}
                        {errors.privacy && <p style={{ ...errStyle, marginTop: 8 }}>{errors.privacy}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '13px',
                            fontSize: 16,
                            fontWeight: 700,
                            background: isLoading ? '#aaa' : '#111',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading ? '접수 중...' : '접수 완료'}
                    </button>
                </form>
            </div>
        </div>
    );
};
