-- Private storage for loader builds. Direct browser access is denied; the
-- signed-download Edge Function uses the service role to issue short-lived URLs
-- after checking the caller's active entitlement.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-releases',
  'product-releases',
  false,
  524288000,
  array['application/zip', 'application/octet-stream']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
