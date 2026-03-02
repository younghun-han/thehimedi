-- =====================================================
-- 더하이메디 Supabase 초기 스키마 + 데이터
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- =====================================================

-- 1. 병원 테이블
create table if not exists hospitals (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  name            text not null,
  password        text not null default '',
  missed_calls    int default 0,
  status          text default 'Active',
  message         text default '',
  landing_link    text default '',
  api_key         text default '',
  carrier_api_key text default '',
  enable_call_ended boolean default false,
  call_ended_message text default '',
  manual_message  text default '',
  created_at      timestamptz default now()
);

-- 2. 마스터 설정 테이블
create table if not exists master_config (
  id       int primary key default 1,
  password text not null default 'admin1234'
);
insert into master_config (id, password) values (1, 'admin1234')
  on conflict (id) do nothing;

-- 3. 통화 로그 테이블
create table if not exists call_logs (
  id                 uuid primary key default gen_random_uuid(),
  hospital_id        uuid references hospitals(id) on delete cascade,
  timestamp          timestamptz default now(),
  caller_number      text,
  receiver_number    text,
  status             text,
  content            text,
  landing_visits     int default 0,
  last_landing_visit timestamptz,
  trigger_type       text default 'missed'
);

-- 4. 메시지 템플릿 테이블
create table if not exists message_templates (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null,
  content       text not null,
  last_modified date default current_date
);

-- 5. 환자 접수 테이블
create table if not exists patient_registrations (
  id           uuid primary key default gen_random_uuid(),
  hospital_id  uuid references hospitals(id) on delete cascade,
  name         text not null,
  phone        text not null,
  purpose      text not null,
  submitted_at timestamptz default now()
);

-- ─── RLS 설정 (내부 관리 도구 - anon key 전체 허용) ─────────────────────────

alter table hospitals enable row level security;
alter table call_logs enable row level security;
alter table message_templates enable row level security;
alter table patient_registrations enable row level security;
alter table master_config enable row level security;

create policy "allow_all" on hospitals for all using (true) with check (true);
create policy "allow_all" on call_logs for all using (true) with check (true);
create policy "allow_all" on message_templates for all using (true) with check (true);
create policy "allow_all" on patient_registrations for all using (true) with check (true);
create policy "allow_all" on master_config for all using (true) with check (true);

-- ─── 초기 병원 데이터 ────────────────────────────────────────────────────────

insert into hospitals (code, name, password, missed_calls, status, message, landing_link, api_key, carrier_api_key, enable_call_ended, call_ended_message, manual_message) values
  ('H001', '서울안과', 'h001pw', 12, 'Active',
   '[서울안과] 전화 연결이 어렵습니다. 홈페이지에서 예약 부탁드립니다.',
   'https://seouleye.example.com', 'sk_test_123456', 'kt_api_12345', true,
   '[서울안과] 전화 주셔서 감사합니다. 리뷰 남기기: https://g.page/r/seouleye',
   '[서울안과] 이번 달 이벤트 안내드립니다. 라식/라섹 최대 50% 할인! 예약하기: #{홈페이지}'),
  ('H002', '강남성형외과', 'h002pw', 5, 'Active',
   '[강남성형외과] 온라인 예약이 가능합니다.',
   'https://gangnamps.example.com', 'sk_test_789012', 'lg_api_67890', false, '', ''),
  ('H003', '행복한치과', 'h003pw', 0, 'Inactive',
   '[행복한치과] 잠시 후 다시 전화드리겠습니다.',
   'https://happydental.example.com', 'sk_test_345678', 'skt_api_54321', false, '', '')
on conflict (code) do nothing;

-- ─── 초기 메시지 템플릿 ──────────────────────────────────────────────────────

insert into message_templates (name, type, content) values
  ('기본 부재중 응답', 'missed', '[#{병원명}] 현재 통화가 어렵습니다. 홈페이지(#{홈페이지})에서 예약 가능합니다.'),
  ('진료 시간 안내', 'missed', '[#{병원명}] 점심시간(13:00~14:00)입니다. 오후 진료는 14시부터 시작됩니다.'),
  ('통화 종료 후 안내', 'callEnded', '[#{병원명}] 문의해주셔서 감사합니다. 오시는 길 안내: https://map.naver.com/...'),
  ('이벤트 홍보 (전체 발송)', 'manual', '[#{병원명}] 봄맞이 이벤트! 방문 상담 시 스케일링 무료. 예약하기: #{홈페이지}');

-- 6. SKB 통화 내역 테이블 (에이전트로부터 수집)
create table if not exists skb_call_history (
  id              uuid primary key default gen_random_uuid(),
  hospital_id     uuid references hospitals(id) on delete cascade,
  call_type       text not null, -- 'incoming', 'missed', 'completed'
  caller_number   text not null,
  receiver_number text not null,
  started_at      timestamptz,
  ended_at        timestamptz,
  duration_sec    int default 0,
  created_at      timestamptz default now()
);

alter table skb_call_history enable row level security;
create policy "allow_all" on skb_call_history for all using (true) with check (true);
