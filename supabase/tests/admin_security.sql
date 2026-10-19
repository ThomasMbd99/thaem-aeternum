-- Run with: supabase db query --linked --file supabase/tests/admin_security.sql
-- All fixtures and successful writes are rolled back. No email or payment APIs are called.
begin;
insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data) values
  ('d4710000-0000-4000-8000-000000000001', 'security-customer@example.invalid', now(), '{"role":"admin"}'),
  ('d4710000-0000-4000-8000-000000000002', 'security-admin@example.invalid', now(), '{}'),
  ('d4710000-0000-4000-8000-000000000003', 'security-unconfirmed@example.invalid', null, '{}');
insert into private.admin_users (user_id) values
  ('d4710000-0000-4000-8000-000000000002'), ('d4710000-0000-4000-8000-000000000003');
insert into public.parfums (id, nom, famille, stock) values (-990001, '__security_fixture__', 'SACRÆ', 7);
insert into public.articles (id, titre, slug, publie) values
  ('d4710000-0000-4000-8000-000000000011', 'Security published', '__security_published__', true),
  ('d4710000-0000-4000-8000-000000000012', 'Security draft', '__security_draft__', false);
insert into public.commandes (id, user_id, email) values
  (-990001, 'd4710000-0000-4000-8000-000000000001', 'security-customer@example.invalid'),
  (-990002, 'd4710000-0000-4000-8000-000000000002', 'security-admin@example.invalid');
insert into public.commande_items (id, commande_id) values (-990001, -990001), (-990002, -990002);
insert into public.promo_codes (id, code, percentage) values
  ('d4710000-0000-4000-8000-000000000021', '__SECURITY_FIXTURE__', 10);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  assert not public.is_admin(), 'Visitor gained admin';
  assert (select count(*) = 1 from public.parfums where id = -990001), 'Public catalogue broken';
  assert (select count(*) = 1 from public.articles where slug = '__security_published__'), 'Published article inaccessible';
  assert (select count(*) = 0 from public.articles where slug = '__security_draft__'), 'Draft leaked';
  assert not has_table_privilege(current_user, 'public.commandes', 'SELECT'), 'Public orders readable';
  assert not has_table_privilege(current_user, 'public.commande_items', 'SELECT'), 'Public order items readable';
  assert not has_table_privilege(current_user, 'public.promo_codes', 'SELECT'), 'Public promotions readable';
  assert not has_table_privilege(current_user, 'public.parfums', 'UPDATE'), 'Public catalogue writable';
  begin
    insert into storage.objects (id, bucket_id, name) values
      ('d4710000-0000-4000-8000-000000000031', 'parfums', '__security_fixture__');
    raise exception 'Visitor uploaded an image';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d4710000-0000-4000-8000-000000000001","role":"authenticated","user_metadata":{"role":"admin"}}', true);
do $$ declare affected integer; begin
  assert not public.is_admin(), 'User metadata granted admin';
  assert (select count(*) = 1 from public.commandes where id in (-990001,-990002)), 'Order isolation failed';
  assert (select count(*) = 1 from public.commande_items where id in (-990001,-990002)), 'Order item isolation failed';
  assert (select count(*) = 0 from public.articles where slug = '__security_draft__'), 'Customer saw draft';
  assert (select count(*) = 0 from public.promo_codes), 'Customer listed promotions';
  assert not has_schema_privilege(current_user, 'private', 'USAGE'), 'Role table exposed';
  assert not has_function_privilege(current_user, 'public.increment_promo_usage(uuid)', 'EXECUTE'), 'Privileged RPC exposed';
  update public.parfums set stock = 999 where id = -990001;
  get diagnostics affected = row_count;
  assert affected = 0, 'Customer changed stock';
  update public.commandes set statut = 'paid' where id = -990001;
  get diagnostics affected = row_count;
  assert affected = 0, 'Customer changed payment status';
  delete from public.articles where slug = '__security_published__';
  get diagnostics affected = row_count;
  assert affected = 0, 'Customer deleted published article';
  begin
    insert into public.parfums (id, nom, famille) values (-990002, 'forged', 'SACRÆ');
    raise exception 'Customer created a product';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.commandes (id, email) values (-990003, 'forged@example.invalid');
    raise exception 'Customer forged an order';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (id, bucket_id, name) values
      ('d4710000-0000-4000-8000-000000000031', 'parfums', '__security_fixture__');
    raise exception 'Customer uploaded an image';
  exception when insufficient_privilege then null; end;
  update public.profiles set prenom = 'Security Test' where id = 'd4710000-0000-4000-8000-000000000001';
  get diagnostics affected = row_count;
  assert affected = 1, 'Customer cannot edit own profile';
  update public.profiles set prenom = 'forged' where id = 'd4710000-0000-4000-8000-000000000002';
  get diagnostics affected = row_count;
  assert affected = 0, 'Customer edited another profile';
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d4710000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $$ declare affected integer; begin
  assert public.is_admin(), 'Confirmed allowlisted administrator denied';
  assert (select count(*) = 2 from public.commandes where id in (-990001,-990002)), 'Admin cannot read orders';
  assert (select count(*) = 2 from public.commande_items where id in (-990001,-990002)), 'Admin cannot read order items';
  assert (select count(*) = 1 from public.articles where slug = '__security_draft__'), 'Admin cannot read drafts';
  assert (select count(*) = 1 from public.promo_codes where code = '__SECURITY_FIXTURE__'), 'Admin cannot read promotions';
  update public.parfums set stock = 8 where id = -990001;
  get diagnostics affected = row_count;
  assert affected = 1, 'Admin cannot update stock';
  update public.commandes set statut = 'shipped', numero_suivi = 'TEST' where id = -990001;
  get diagnostics affected = row_count;
  assert affected = 1, 'Admin cannot update shipment';
  insert into storage.objects (id, bucket_id, name) values
    ('d4710000-0000-4000-8000-000000000031', 'parfums', '__security_fixture__');
  assert not has_table_privilege(current_user, 'public.commandes', 'INSERT'), 'Browser can forge paid orders';
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d4710000-0000-4000-8000-000000000003","role":"authenticated"}', true);
do $$ begin assert not public.is_admin(), 'Unconfirmed administrator admitted'; end $$;
reset role;

-- Revocation takes effect against an already-issued JWT.
delete from private.admin_users where user_id = 'd4710000-0000-4000-8000-000000000002';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d4710000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $$ begin assert not public.is_admin(), 'Revoked admin still authorized'; end $$;
reset role;
do $$ begin
  assert has_table_privilege('service_role', 'public.commandes', 'INSERT'), 'Payment webhook cannot insert orders';
  assert has_table_privilege('service_role', 'public.commande_items', 'INSERT'), 'Payment webhook cannot insert items';
  assert has_function_privilege('service_role', 'public.increment_promo_usage(uuid)', 'EXECUTE'), 'Payment webhook RPC broken';
end $$;
rollback;
select 'PASS: anonymous, customer, admin, unconfirmed, revoked and service roles' as security_regression;
