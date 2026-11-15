-- Private mapping maintained by a database trigger whenever a Supabase
-- Discord identity is linked or unlinked. Browser clients cannot read/write it.
create table if not exists public.discord_links (
  discord_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.discord_links is
  'Private mapping maintained from verified Supabase Discord identities.';

alter table public.discord_links enable row level security;
revoke all on table public.discord_links from anon, authenticated;
grant all on table public.discord_links to service_role;

create or replace function public.sync_discord_identity_link()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.provider = 'discord' then
      delete from public.discord_links
      where discord_id = old.provider_id and user_id = old.user_id;
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE'
     and old.provider = 'discord'
     and (new.provider <> 'discord' or new.provider_id <> old.provider_id) then
    delete from public.discord_links
    where discord_id = old.provider_id and user_id = old.user_id;
  end if;

  if new.provider = 'discord' then
    insert into public.discord_links (discord_id, user_id)
    values (new.provider_id, new.user_id)
    on conflict (discord_id) do update
      set user_id = excluded.user_id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_discord_identity_link() from public, anon, authenticated;

drop trigger if exists sync_discord_identity_link on auth.identities;
create trigger sync_discord_identity_link
after insert or update or delete on auth.identities
for each row execute function public.sync_discord_identity_link();

-- Backfill any Discord identities linked before this migration was applied.
insert into public.discord_links (discord_id, user_id)
select provider_id, user_id
from auth.identities
where provider = 'discord'
on conflict (discord_id) do update
  set user_id = excluded.user_id;
