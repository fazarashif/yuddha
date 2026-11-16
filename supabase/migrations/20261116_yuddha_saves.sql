-- Applied to the shared Supabase project "konco-mlayu".
-- Yuddha keeps one save per signed-in user. The data lives in its own schema,
-- which API roles cannot reach directly; the only way in is through the two
-- functions below, which act on the caller's own row.

create schema if not exists yuddha;
revoke all on schema yuddha from public, anon, authenticated;

create table yuddha.saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table yuddha.saves enable row level security;
revoke all on yuddha.saves from public, anon, authenticated;

create function public.yuddha_load_save()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('data', s.data, 'updated_at', s.updated_at)
  from yuddha.saves s
  where s.user_id = (select auth.uid());
$$;

create function public.yuddha_store_save(payload jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  stamp timestamptz;
begin
  if uid is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'save must be a JSON object' using errcode = '22023';
  end if;
  if pg_column_size(payload) > 1500000 then
    raise exception 'save too large' using errcode = '54000';
  end if;

  insert into yuddha.saves (user_id, data, updated_at)
  values (uid, payload, now())
  on conflict (user_id) do update set data = excluded.data, updated_at = now()
  returning updated_at into stamp;

  return stamp;
end;
$$;

revoke execute on function public.yuddha_load_save() from public, anon;
revoke execute on function public.yuddha_store_save(jsonb) from public, anon;
grant execute on function public.yuddha_load_save() to authenticated;
grant execute on function public.yuddha_store_save(jsonb) to authenticated;
