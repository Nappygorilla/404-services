-- 404 Services community schema.
-- Run this once in the Supabase SQL editor for the project that backs the site.
-- The browser only ever holds the public anon key; these policies do the work.

create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  board text not null check (board in ('announcements', 'issues')),
  title text not null check (char_length(title) between 4 and 120),
  body text not null check (char_length(body) between 10 and 4000),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 60),
  created_at timestamptz not null default now()
);

create index if not exists forum_threads_board_created_idx
  on public.forum_threads (board, created_at desc);

alter table public.forum_threads enable row level security;

-- Everyone, signed in or not, can read both boards.
drop policy if exists "board posts are public" on public.forum_threads;
create policy "board posts are public"
  on public.forum_threads for select
  using (true);

-- Signed-in members can open an issue topic, always under their own id.
drop policy if exists "members open issue topics" on public.forum_threads;
create policy "members open issue topics"
  on public.forum_threads for insert
  to authenticated
  with check (board = 'issues' and author_id = auth.uid());

-- Authors can remove their own topic.
drop policy if exists "authors delete own topics" on public.forum_threads;
create policy "authors delete own topics"
  on public.forum_threads for delete
  to authenticated
  using (author_id = auth.uid());

-- Announcements are read-only from the site. Post them with the service role
-- (dashboard SQL editor or an admin script), for example:
--   insert into public.forum_threads (board, title, body, author_id, author_name)
--   values ('announcements', 'Release 1.4.2', 'What changed…',
--           '<a uuid from auth.users>', '404 Services team');
