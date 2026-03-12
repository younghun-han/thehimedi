export interface Hospital {
  id: string;
  code: string;
  name: string;
  password?: string;
  missedCalls: number;
  status: 'Active' | 'Inactive';
  message: string;
  landingLink: string;
  apiKey: string;
  carrierApiKey?: string;   // KT/STB: API Key | LG: 070번호 (id)
  carrierApiPass?: string;  // LG 전용: 비밀번호
  carrier?: 'KT' | 'STB' | 'LG';
  senderNumber?: string; // 솔라피 발신번호 (e.g. "01012345678")

  // Call Ended
  callEndedMessage?: string;
  enableCallEnded?: boolean;

  // Manual Trigger
  manualMessage?: string;
}

export interface AuthUser {
  role: 'master' | 'user';
  hospitalId?: string;
  hospitalCode?: string;
  hospitalName?: string;
}

export interface CallLog {
  id: string;
  hospitalId: string;
  timestamp: string;
  callerNumber: string;
  receiverNumber: string;
  status: 'Success' | 'Failed' | 'Incoming' | 'Missed' | 'Completed';
  content: string;
  landingVisits?: number;
  lastLandingVisit?: string;
  triggerType?: 'missed' | 'callEnded' | 'manual' | 'skb_incoming' | 'skb_missed' | 'skb_completed';
  type?: 'message' | 'skb_call';
  startedAt?: string;
  endedAt?: string;
  durationSec?: number;
  errorMessage?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'missed' | 'callEnded' | 'manual';
  content: string;
  lastModified: string;
}

export type View = 'dashboard' | 'detail';

export interface PatientRegistration {
  id: string;
  hospitalId: string;
  name: string;
  phone: string;
  purpose: string;
  submittedAt: string;
}

export interface SKBCallLog {
  id: string;
  hospitalId: string;
  callType: 'incoming' | 'missed' | 'completed';
  callerNumber: string;
  receiverNumber: string;
  startedAt?: string;
  endedAt?: string;
  durationSec?: number;
  createdAt: string;
}
