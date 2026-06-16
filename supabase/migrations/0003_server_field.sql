-- ============================================================
-- Migration 0003 : server field + updated get_trade_matches
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add server column to profiles
alter table public.profiles
  add column if not exists server text
  check (server in ('europe', 'america', 'asia'));

-- 2. Replace get_trade_matches to include discord, uid, server
create or replace function public.get_trade_matches()
returns table (
  partner_id uuid,
  partner_ign text,
  partner_discord text,
  partner_uid text,
  partner_server text,
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
    select p.id, p.ign, p.discord, p.uid, p.server,
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
  select id, ign, discord, uid, server, they_have, they_need
  from partners
  where cardinality(they_have) > 0 or cardinality(they_need) > 0
  order by least(cardinality(they_have), cardinality(they_need)) desc,
           cardinality(they_have) + cardinality(they_need) desc;
$$;
