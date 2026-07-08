-- Server-side usage logging (records every chat request incl. guests)
-- Applied to production 2026-07-03 via Supabase MCP
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event text not null default 'chat_request',
  session_key text,
  user_id uuid,
  provider text,
  model text,
  message_count int,
  chars_in int,
  chars_out int,
  ip_hash text,
  user_agent text
);
alter table public.usage_logs enable row level security;
create policy "app can insert usage" on public.usage_logs
  for insert to anon, authenticated with check (true);
create index idx_usage_logs_created_at on public.usage_logs(created_at desc);
create index idx_usage_logs_session on public.usage_logs(session_key);
