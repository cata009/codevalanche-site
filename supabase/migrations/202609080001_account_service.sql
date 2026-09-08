-- Application-owned data only. Auth internals are read through a service-role-only RPC.
begin;
create table public.codevalanche_account_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 analytics_consent boolean not null default false,
 deletion_requested_at timestamptz,
 deletion_scheduled_for timestamptz,
 blocked boolean not null default false,
 updated_at timestamptz not null default now()
);
create table public.codevalanche_revoked_sessions (
 session_id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 revoked_at timestamptz not null default now()
);
create table public.codevalanche_feedback (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 category text not null check(category in ('bug','idea','general')), message text not null check(length(message) between 1 and 4000), created_at timestamptz not null default now()
);
create table public.codevalanche_events (
 id uuid primary key, user_id uuid references auth.users(id) on delete set null,
 event_name text not null check(event_name in ('website_view','download_clicked','app_opened')),
 platform text not null check(platform in ('web','windows','macos','linux','ios','android')),
 created_at timestamptz not null default now()
);
create table public.codevalanche_rate_limits (bucket text primary key, started_at timestamptz not null default now(), hits integer not null default 1);
alter table public.codevalanche_account_state enable row level security;
alter table public.codevalanche_revoked_sessions enable row level security;
alter table public.codevalanche_feedback enable row level security;
alter table public.codevalanche_events enable row level security;
alter table public.codevalanche_rate_limits enable row level security;
-- All data access goes through the verified-session Edge Function. No browser writes.
revoke all on public.codevalanche_account_state, public.codevalanche_revoked_sessions, public.codevalanche_feedback, public.codevalanche_events, public.codevalanche_rate_limits from anon, authenticated;
grant all on public.codevalanche_account_state, public.codevalanche_revoked_sessions, public.codevalanche_feedback, public.codevalanche_events, public.codevalanche_rate_limits to service_role;
create function public.codevalanche_sessions(p_user_id uuid)
returns table(id uuid, created_at timestamptz, updated_at timestamptz, user_agent text)
language sql stable security definer set search_path = '' as $$
 select s.id, s.created_at, s.updated_at, s.user_agent from auth.sessions s
 where s.user_id = p_user_id and (s.not_after is null or s.not_after > now())
 and not exists(select 1 from public.codevalanche_revoked_sessions r where r.session_id=s.id)
$$;
revoke all on function public.codevalanche_sessions(uuid) from public, anon, authenticated;
grant execute on function public.codevalanche_sessions(uuid) to service_role;
create function public.codevalanche_rate_limit(p_bucket text, p_limit integer default 60)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_hits integer;
begin
 insert into public.codevalanche_rate_limits(bucket) values(p_bucket)
 on conflict(bucket) do update set hits=case when codevalanche_rate_limits.started_at < now()-interval '1 minute' then 1 else codevalanche_rate_limits.hits+1 end,
 started_at=case when codevalanche_rate_limits.started_at < now()-interval '1 minute' then now() else codevalanche_rate_limits.started_at end
 returning hits into v_hits;
 return v_hits <= p_limit;
end;
$$;
revoke all on function public.codevalanche_rate_limit(text,integer) from public, anon, authenticated;
grant execute on function public.codevalanche_rate_limit(text,integer) to service_role;
commit;
