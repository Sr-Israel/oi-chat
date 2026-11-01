-- Permite que visitantes leiam somente arquivos do bucket privado
-- associados a documentos marcados como públicos na tabela public.documents.
-- Os demais arquivos continuam privados.
create policy "Public can read published ASDCC documents"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'asdcc-documentos'
  and exists (
    select 1
    from public.documents d
    where d.file_url = storage.objects.name
      and d.is_public = true
  )
);
