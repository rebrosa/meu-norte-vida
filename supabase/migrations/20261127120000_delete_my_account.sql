-- Apaga a conta de quem chama: diário, dados da Comunidade e o login.
-- A auditoria da Comunidade fica anônima (actor_id vira o UUID nulo).
-- Já aplicada manualmente no painel do Supabase; este arquivo é o registro e é idempotente.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Sem acesso';
  end if;

  -- Comunidade
  delete from public.community_reactions where user_id = uid;
  delete from public.community_reports where reporter_id = uid;
  delete from public.community_stories where author_id = uid;
  update public.community_audit
     set actor_id = '00000000-0000-0000-0000-000000000000'
   where actor_id = uid;
  delete from public.community_roles where user_id = uid;

  -- Diário
  delete from public.chat_messages where user_id = uid;
  delete from public.relapse_events where user_id = uid;
  delete from public.episodes where user_id = uid;
  delete from public.decision_letters where user_id = uid;
  delete from public.profiles where id = uid;

  -- Login
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
