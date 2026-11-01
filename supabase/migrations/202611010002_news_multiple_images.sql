alter table public.news
add column if not exists images text[] not null default '{}'::text[];
