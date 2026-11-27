-- Limite de uso da IA do Respirar: 10 pedidos por hora e 30 por dia, por pessoa.
-- A tabela guarda só o código da pessoa e a hora (nunca o texto digitado) e some junto com a conta.
-- Já aplicada manualmente no painel do Supabase; este arquivo é o registro e é idempotente.
create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_user_created_idx
  on public.ai_usage (user_id, created_at desc);

alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;
grant all on public.ai_usage to service_role;

create or replace function public.consume_ai_quota()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  hour_limit constant int := 10;
  day_limit constant int := 30;
  used_hour int;
  used_day int;
begin
  if uid is null then
    raise exception 'Sem acesso';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(uid::text, 0));

  delete from public.ai_usage
   where user_id = uid and created_at < now() - interval '2 days';

  select count(*) filter (where created_at > now() - interval '1 hour'),
         count(*) filter (where created_at > now() - interval '1 day')
    into used_hour, used_day
    from public.ai_usage
   where user_id = uid;

  if used_hour >= hour_limit or used_day >= day_limit then
    return false;
  end if;

  insert into public.ai_usage (user_id) values (uid);
  return true;
end;
$$;

revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;
