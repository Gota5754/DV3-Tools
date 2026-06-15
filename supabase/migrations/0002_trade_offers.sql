-- DV3 Tools — peer-to-peer trade offers
-- Run this in the Supabase SQL Editor after 0001_initial_schema.sql.
--
-- Flow:
--   1. A sender creates an offer (offered_sticker_ids = what they give,
--      requested_sticker_ids = what they want from the recipient).
--   2. The recipient accepts or rejects it.
--   3. Once accepted, BOTH parties confirm the in-game trade actually
--      happened. Only when both have confirmed are the two collections
--      updated atomically and the offer marked 'completed'.

-- ============================================================
-- 1. TABLE
-- ============================================================
create table public.trade_offers (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null,
  to_user uuid not null,
  offered_sticker_ids smallint[] not null,
  requested_sticker_ids smallint[] not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  from_confirmed boolean not null default false,
  to_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trade_offers_from_fkey foreign key (from_user)
    references public.profiles (id) on delete cascade,
  constraint trade_offers_to_fkey foreign key (to_user)
    references public.profiles (id) on delete cascade,
  constraint trade_offers_distinct check (from_user <> to_user),
  constraint trade_offers_non_empty
    check (cardinality(offered_sticker_ids) > 0
       and cardinality(requested_sticker_ids) > 0)
);

create index trade_offers_to_idx on public.trade_offers (to_user, status);
create index trade_offers_from_idx on public.trade_offers (from_user, status);

-- ============================================================
-- 2. ROW LEVEL SECURITY
--    Participants can read their offers; senders can insert.
--    All state changes go through SECURITY DEFINER functions below,
--    so no UPDATE/DELETE policy is granted.
-- ============================================================
alter table public.trade_offers enable row level security;

create policy "trade_offers_select_participant" on public.trade_offers
  for select to authenticated
  using (auth.uid() = from_user or auth.uid() = to_user);

create policy "trade_offers_insert_sender" on public.trade_offers
  for insert to authenticated
  with check (auth.uid() = from_user);

-- ============================================================
-- 3. LIST MY OFFERS (incoming + outgoing) with partner profile
-- ============================================================
create function public.get_my_trade_offers()
returns table (
  id uuid,
  i_am_sender boolean,
  partner_id uuid,
  partner_ign text,
  partner_discord text,
  partner_uid text,
  offered_ids smallint[],
  requested_ids smallint[],
  status text,
  from_confirmed boolean,
  to_confirmed boolean,
  created_at timestamptz
)
language sql
security invoker
stable
as $$
  select
    o.id,
    o.from_user = auth.uid() as i_am_sender,
    case when o.from_user = auth.uid() then o.to_user else o.from_user end,
    p.ign, p.discord, p.uid,
    o.offered_sticker_ids,
    o.requested_sticker_ids,
    o.status,
    o.from_confirmed,
    o.to_confirmed,
    o.created_at
  from public.trade_offers o
  join public.profiles p
    on p.id = case when o.from_user = auth.uid() then o.to_user else o.from_user end
  where o.from_user = auth.uid() or o.to_user = auth.uid()
  order by o.created_at desc;
$$;

-- ============================================================
-- 4. RESPOND (recipient accepts / rejects a pending offer)
-- ============================================================
create function public.respond_to_trade(p_offer_id uuid, p_accept boolean)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  o public.trade_offers;
begin
  select * into o from public.trade_offers where id = p_offer_id for update;
  if not found then raise exception 'offer not found'; end if;
  if auth.uid() <> o.to_user then raise exception 'only the recipient can respond'; end if;
  if o.status <> 'pending' then raise exception 'offer is not pending'; end if;

  update public.trade_offers
    set status = case when p_accept then 'accepted' else 'rejected' end,
        updated_at = now()
    where id = p_offer_id;

  return case when p_accept then 'accepted' else 'rejected' end;
end;
$$;

-- ============================================================
-- 5. CANCEL (either participant withdraws a pending/accepted offer)
-- ============================================================
create function public.cancel_trade(p_offer_id uuid)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  o public.trade_offers;
begin
  select * into o from public.trade_offers where id = p_offer_id for update;
  if not found then raise exception 'offer not found'; end if;
  if auth.uid() <> o.from_user and auth.uid() <> o.to_user then
    raise exception 'not a participant';
  end if;
  if o.status not in ('pending', 'accepted') then
    raise exception 'offer cannot be cancelled';
  end if;

  update public.trade_offers set status = 'cancelled', updated_at = now()
    where id = p_offer_id;

  return 'cancelled';
end;
$$;

-- ============================================================
-- 6. CONFIRM (each party confirms the in-game trade happened;
--    when both have confirmed, apply inventory changes atomically)
-- ============================================================
create function public.confirm_trade(p_offer_id uuid)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  o public.trade_offers;
  sid smallint;
begin
  select * into o from public.trade_offers where id = p_offer_id for update;
  if not found then raise exception 'offer not found'; end if;
  if auth.uid() <> o.from_user and auth.uid() <> o.to_user then
    raise exception 'not a participant';
  end if;
  if o.status <> 'accepted' then raise exception 'offer is not accepted'; end if;

  if auth.uid() = o.from_user then
    update public.trade_offers set from_confirmed = true, updated_at = now()
      where id = p_offer_id;
    o.from_confirmed := true;
  else
    update public.trade_offers set to_confirmed = true, updated_at = now()
      where id = p_offer_id;
    o.to_confirmed := true;
  end if;

  -- Both confirmed → apply the exchange to both inventories.
  if o.from_confirmed and o.to_confirmed then
    -- Givers each lose one duplicate (sender gives offered, recipient gives requested).
    update public.user_stickers
      set duplicates = greatest(0, duplicates - 1), updated_at = now()
      where (user_id = o.from_user and sticker_id = any (o.offered_sticker_ids))
         or (user_id = o.to_user   and sticker_id = any (o.requested_sticker_ids));

    -- Sender receives the requested stickers.
    foreach sid in array o.requested_sticker_ids loop
      insert into public.user_stickers (user_id, sticker_id, owned, duplicates, updated_at)
      values (o.from_user, sid, true, 0, now())
      on conflict (user_id, sticker_id) do update
        set duplicates = case when user_stickers.owned
                              then user_stickers.duplicates + 1 else 0 end,
            owned = true,
            updated_at = now();
    end loop;

    -- Recipient receives the offered stickers.
    foreach sid in array o.offered_sticker_ids loop
      insert into public.user_stickers (user_id, sticker_id, owned, duplicates, updated_at)
      values (o.to_user, sid, true, 0, now())
      on conflict (user_id, sticker_id) do update
        set duplicates = case when user_stickers.owned
                              then user_stickers.duplicates + 1 else 0 end,
            owned = true,
            updated_at = now();
    end loop;

    update public.trade_offers set status = 'completed', updated_at = now()
      where id = p_offer_id;
    return 'completed';
  end if;

  return 'accepted';
end;
$$;
