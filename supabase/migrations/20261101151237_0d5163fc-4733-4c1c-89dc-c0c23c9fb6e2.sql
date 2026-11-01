drop policy if exists "Público consulta configurações" on public.site_settings;
drop policy if exists "Leitura pública das imagens ASDCC" on storage.objects;
drop policy if exists "Public can read published ASDCC documents" on storage.objects;
create policy "Equipe acessa imagens ASDCC" on storage.objects for select to authenticated
  using (bucket_id = 'asdcc-imagens' and public.is_staff());