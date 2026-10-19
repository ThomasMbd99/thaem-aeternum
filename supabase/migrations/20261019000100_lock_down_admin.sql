begin;

-- No automatic bootstrap: only a trusted database operator can appoint an admin.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table private.admin_users enable row level security;
revoke all on private.admin_users from public, anon, authenticated;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from private.admin_users a
    join auth.users u on u.id = a.user_id
    where a.user_id = (select auth.uid())
      and u.email_confirmed_at is not null
      and (u.banned_until is null or u.banned_until <= now())
  );
$$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated, service_role;

-- Replace legacy permissive policies: adding another permissive policy is insufficient.
do $$
declare p record; t text;
begin
  foreach t in array array['parfums','articles','promo_codes','commandes','commande_items','profiles'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from public, anon, authenticated', t);
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
  end loop;
end $$;

grant select on public.parfums to anon, authenticated;
grant insert, update, delete on public.parfums to authenticated;
create policy catalogue_read on public.parfums for select to anon, authenticated using (true);
create policy catalogue_admin on public.parfums for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;
create policy articles_published on public.articles for select to anon, authenticated using (publie = true);
create policy articles_admin on public.articles for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

grant select, insert, update, delete on public.promo_codes to authenticated;
create policy promos_admin on public.promo_codes for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Customers can read their own orders, but cannot forge payment, totals or ownership.
grant select on public.commandes, public.commande_items to authenticated;
grant update (statut, numero_suivi) on public.commandes to authenticated;
create policy orders_read on public.commandes for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy orders_admin_update on public.commandes for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy order_items_read on public.commande_items for select to authenticated
  using (exists (select 1 from public.commandes c where c.id = commande_id));

grant select, delete on public.profiles to authenticated;
grant update (prenom, nom, telephone, adresse, ville, code_postal, pays) on public.profiles to authenticated;
create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy profiles_delete on public.profiles for delete to authenticated using (id = (select auth.uid()));

-- Favorites are optional on older installations.
do $$
declare p record;
begin
  if to_regclass('public.favoris') is not null then
    alter table public.favoris enable row level security;
    revoke all on public.favoris from public, anon, authenticated;
    grant select, insert, delete on public.favoris to authenticated;
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'favoris' loop
      execute format('drop policy %I on public.favoris', p.policyname);
    end loop;
    create policy favorites_owner on public.favoris for all to authenticated
      using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
  end if;
end $$;

-- Restrictive policies also constrain any pre-existing broad storage policies.
create policy parfums_insert_boundary on storage.objects as restrictive for insert to anon, authenticated
  with check (bucket_id <> 'parfums' or (auth.role() = 'authenticated' and (select public.is_admin())));
create policy parfums_update_boundary on storage.objects as restrictive for update to anon, authenticated
  using (bucket_id <> 'parfums' or (auth.role() = 'authenticated' and (select public.is_admin())))
  with check (bucket_id <> 'parfums' or (auth.role() = 'authenticated' and (select public.is_admin())));
create policy parfums_delete_boundary on storage.objects as restrictive for delete to anon, authenticated
  using (bucket_id <> 'parfums' or (auth.role() = 'authenticated' and (select public.is_admin())));
create policy parfums_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'parfums' and (select public.is_admin()));
create policy parfums_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'parfums' and (select public.is_admin()))
  with check (bucket_id = 'parfums' and (select public.is_admin()));
create policy parfums_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'parfums' and (select public.is_admin()));
create policy parfums_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'parfums' and (select public.is_admin()));

-- Prevent anonymous uploads from evaluating a function they cannot execute.
grant execute on function public.is_admin() to anon;

-- Existing privileged RPCs must not provide an alternate route around table RLS.
-- Browser code uses only is_admin; edge functions call RPCs with service_role.
do $$
declare f record;
begin
  for f in select p.oid::regprocedure as signature from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef and p.proname <> 'is_admin'
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.signature);
    execute format('grant execute on function %s to service_role', f.signature);
  end loop;
end $$;

commit;
