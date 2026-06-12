-- DV3 Tools — initial schema
-- Run this in the Supabase SQL Editor (or `supabase db push`).

-- ============================================================
-- 1. PROFILES — one row per auth user, holds the in-game name
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  ign text unique check (char_length(ign) between 2 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create an empty profile when a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. COLLECTIONS — the 20 sticker albums
-- ============================================================
create table public.collections (
  id smallint primary key check (id between 1 and 20),
  slug text not null unique,
  name_en text not null,
  name_fr text not null,
  sort_order smallint not null
);

-- ============================================================
-- 3. STICKERS — 180 stickers, 9 per collection
--    id = (collection_id - 1) * 9 + position  →  1..180
-- ============================================================
create table public.stickers (
  id smallint primary key check (id between 1 and 180),
  collection_id smallint not null references public.collections (id),
  position smallint not null check (position between 1 and 9),
  name_en text,
  name_fr text,
  unique (collection_id, position)
);

-- ============================================================
-- 4. USER_STICKERS — per-user inventory (owned + duplicates)
-- ============================================================
create table public.user_stickers (
  user_id uuid not null references public.profiles (id) on delete cascade,
  sticker_id smallint not null references public.stickers (id),
  owned boolean not null default false,
  duplicates smallint not null default 0 check (duplicates between 0 and 99),
  updated_at timestamptz not null default now(),
  primary key (user_id, sticker_id)
);

create index user_stickers_sticker_idx on public.user_stickers (sticker_id);

-- ============================================================
-- 5. SEED DATA — placeholder names, edit name_en / name_fr later
-- ============================================================
insert into public.collections (id, slug, name_en, name_fr, sort_order)
select n,
       'collection-' || lpad(n::text, 2, '0'),
       'Collection ' || n,
       'Collection ' || n,
       n
from generate_series(1, 20) as n;

insert into public.stickers (id, collection_id, position)
select (c - 1) * 9 + p, c, p
from generate_series(1, 20) as c,
     generate_series(1, 9) as p;

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.stickers enable row level security;
alter table public.user_stickers enable row level security;

-- Profiles: readable by everyone (IGN shown on the trade board),
-- writable only by the owner.
create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Reference data: read-only for everyone.
create policy "collections_select_all" on public.collections
  for select using (true);
create policy "stickers_select_all" on public.stickers
  for select using (true);

-- Inventory: readable by authenticated users (needed for trade matching),
-- writable only by the owner.
create policy "user_stickers_select_authenticated" on public.user_stickers
  for select to authenticated using (true);
create policy "user_stickers_insert_own" on public.user_stickers
  for insert with check (auth.uid() = user_id);
create policy "user_stickers_update_own" on public.user_stickers
  for update using (auth.uid() = user_id);
create policy "user_stickers_delete_own" on public.user_stickers
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 7. TRADE MATCHING RPC
--    For the calling user, returns every other player with:
--      they_have: sticker ids the caller is missing and the partner
--                 has as duplicates
--      they_need: sticker ids the partner is missing and the caller
--                 has as duplicates
--    Only mutually relevant partners (at least one direction non-empty)
--    with a set IGN are returned, best matches first.
-- ============================================================
create function public.get_trade_matches()
returns table (
  partner_id uuid,
  partner_ign text,
  they_have smallint[],
  they_need smallint[]
)
language sql
security invoker
stable
as $$
  with my_missing as (
    select s.id from public.stickers s
    where not exists (
      select 1 from public.user_stickers us
      where us.user_id = auth.uid() and us.sticker_id = s.id and us.owned
    )
  ),
  my_dupes as (
    select sticker_id from public.user_stickers
    where user_id = auth.uid() and duplicates > 0
  ),
  partners as (
    select p.id, p.ign,
      array(
        select us.sticker_id from public.user_stickers us
        join my_missing m on m.id = us.sticker_id
        where us.user_id = p.id and us.duplicates > 0
        order by us.sticker_id
      ) as they_have,
      array(
        select d.sticker_id from my_dupes d
        where not exists (
          select 1 from public.user_stickers us
          where us.user_id = p.id and us.sticker_id = d.sticker_id and us.owned
        )
        order by d.sticker_id
      ) as they_need
    from public.profiles p
    where p.id <> auth.uid() and p.ign is not null
  )
  select id, ign, they_have, they_need
  from partners
  where cardinality(they_have) > 0 or cardinality(they_need) > 0
  order by least(cardinality(they_have), cardinality(they_need)) desc,
           cardinality(they_have) + cardinality(they_need) desc;
$$;
