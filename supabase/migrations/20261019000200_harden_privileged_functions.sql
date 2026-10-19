begin;

-- Keep anonymous storage decisions independent of privileged function execution.
drop policy parfums_insert_boundary on storage.objects;
drop policy parfums_update_boundary on storage.objects;
drop policy parfums_delete_boundary on storage.objects;
create policy parfums_anon_insert_boundary on storage.objects as restrictive for insert to anon
  with check (bucket_id <> 'parfums');
create policy parfums_anon_update_boundary on storage.objects as restrictive for update to anon
  using (bucket_id <> 'parfums') with check (bucket_id <> 'parfums');
create policy parfums_anon_delete_boundary on storage.objects as restrictive for delete to anon
  using (bucket_id <> 'parfums');
create policy parfums_insert_boundary on storage.objects as restrictive for insert to authenticated
  with check (bucket_id <> 'parfums' or (select public.is_admin()));
create policy parfums_update_boundary on storage.objects as restrictive for update to authenticated
  using (bucket_id <> 'parfums' or (select public.is_admin()))
  with check (bucket_id <> 'parfums' or (select public.is_admin()));
create policy parfums_delete_boundary on storage.objects as restrictive for delete to authenticated
  using (bucket_id <> 'parfums' or (select public.is_admin()));
revoke execute on function public.is_admin() from anon;

alter function public.handle_new_user() set search_path = '';
create or replace function public.increment_promo_usage(promo_id uuid)
returns void language sql security definer set search_path = ''
as $$
  update public.promo_codes
  set used_count = used_count + 1
  where id = promo_id and (max_uses is null or used_count < max_uses);
$$;
revoke execute on function public.increment_promo_usage(uuid) from public, anon, authenticated;
grant execute on function public.increment_promo_usage(uuid) to service_role;
commit;
