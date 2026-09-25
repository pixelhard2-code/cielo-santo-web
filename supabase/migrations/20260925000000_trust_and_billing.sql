-- Public-facing data is read/written through server routes using the service role.
-- Keep RLS enabled and never expose the service role key to the browser.
create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('paid-resources', 'paid-resources', false)
on conflict (id) do nothing;

create table if not exists public.peticiones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 80),
  peticion text not null check (char_length(peticion) between 1 and 500),
  es_privada boolean not null default false,
  tipo text not null default 'peticion' check (tipo in ('peticion', 'agradecimiento')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobado', 'rechazado')),
  apoyos integer not null default 0 check (apoyos >= 0),
  created_at timestamptz not null default now()
);
alter table public.peticiones enable row level security;
create index if not exists peticiones_public_feed_idx
  on public.peticiones (created_at desc) where es_privada = false and estado = 'aprobado';

create table if not exists public.petition_support_actions (
  petition_id uuid not null references public.peticiones(id) on delete cascade,
  client_hash text not null,
  created_at timestamptz not null default now(),
  primary key (petition_id, client_hash)
);
alter table public.petition_support_actions enable row level security;

create or replace function public.record_petition_support(petition_uuid uuid, p_client_hash text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare updated_count integer;
declare inserted_action integer;
begin
  insert into public.petition_support_actions (petition_id, client_hash)
  select petition_uuid, p_client_hash
   where exists (select 1 from public.peticiones where id = petition_uuid and estado = 'aprobado' and es_privada = false)
  on conflict do nothing;
  get diagnostics inserted_action = row_count;

  if inserted_action = 1 then
  update public.peticiones
     set apoyos = apoyos + 1
   where id = petition_uuid and estado = 'aprobado' and es_privada = false
   returning apoyos into updated_count;
  else
    select apoyos into updated_count from public.peticiones
     where id = petition_uuid and estado = 'aprobado' and es_privada = false;
  end if;
  if updated_count is null then return null; end if;
  return jsonb_build_object('apoyos', updated_count, 'already_supported', inserted_action = 0);
end;
$$;

create table if not exists public.reportes_peticiones (
  id uuid primary key default gen_random_uuid(),
  peticion_id uuid not null references public.peticiones(id) on delete cascade,
  motivo text,
  created_at timestamptz not null default now()
);
alter table public.reportes_peticiones enable row level security;

create table if not exists public.daily_amens (
  delivery_date date primary key,
  count integer not null default 0 check (count >= 0)
);
alter table public.daily_amens enable row level security;

create table if not exists public.daily_amen_actions (
  delivery_date date not null,
  client_hash text not null,
  created_at timestamptz not null default now(),
  primary key (delivery_date, client_hash)
);
alter table public.daily_amen_actions enable row level security;

create or replace function public.record_daily_amen(p_day date, p_client_hash text)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare total_count integer;
begin
  insert into public.daily_amen_actions (delivery_date, client_hash)
  values (p_day, p_client_hash)
  on conflict do nothing;
  if found then
    insert into public.daily_amens (delivery_date, count)
    values (p_day, 1)
    on conflict (delivery_date) do update set count = public.daily_amens.count + 1;
  end if;
  select count into total_count from public.daily_amens where delivery_date = p_day;
  return coalesce(total_count, 0);
end;
$$;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  daily_enabled boolean not null default true,
  confirmation_token_hash text,
  confirmation_expires_at timestamptz,
  consented_at timestamptz not null default now(),
  confirmed_at timestamptz
);
alter table public.newsletter_subscribers enable row level security;

create table if not exists public.newsletter_unsubscribe_tokens (
  token_hash text primary key,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.newsletter_unsubscribe_tokens enable row level security;

create table if not exists public.subscription_members (
  id uuid primary key default gen_random_uuid(),
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  email text not null,
  status text not null default 'active',
  welcome_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscription_members enable row level security;

create table if not exists public.daily_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  delivery_date date not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  unique (email, delivery_date)
);
alter table public.daily_email_deliveries enable row level security;

create table if not exists public.rate_limit_buckets (
  bucket text not null,
  key_hash text not null,
  window_started_at timestamptz not null default now(),
  count integer not null default 1,
  primary key (bucket, key_hash)
);
alter table public.rate_limit_buckets enable row level security;

create or replace function public.consume_rate_limit(p_bucket text, p_key_hash text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare current_count integer;
begin
  insert into public.rate_limit_buckets (bucket, key_hash, window_started_at, count)
  values (p_bucket, p_key_hash, now(), 1)
  on conflict (bucket, key_hash) do update set
    count = case
      when public.rate_limit_buckets.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
      else public.rate_limit_buckets.count + 1
    end,
    window_started_at = case
      when public.rate_limit_buckets.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
      else public.rate_limit_buckets.window_started_at
    end
  returning count into current_count;
  return current_count <= p_max;
end;
$$;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'mercadopago')),
  provider_payment_id text not null,
  provider_session_id text,
  checkout_intent_id uuid,
  sku text not null,
  fund text check (fund in ('operativo', 'solidario', 'continuidad')),
  email text not null,
  amount integer not null check (amount > 0),
  currency text not null default 'CLP',
  status text not null,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);
alter table public.payments enable row level security;

create table if not exists public.checkout_intents (
  id uuid primary key default gen_random_uuid(),
  sku text not null,
  fund text check (fund in ('operativo', 'solidario', 'continuidad')),
  email text not null,
  amount integer not null check (amount > 0),
  currency text not null default 'CLP',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.checkout_intents enable row level security;

create or replace function public.cleanup_ephemeral_data()
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from public.peticiones
   where created_at < now() - interval '90 days'
     and (es_privada = true or estado <> 'aprobado');
  delete from public.daily_email_deliveries where delivery_date < current_date - 120;
  delete from public.daily_amen_actions where delivery_date < current_date - 400;
  delete from public.daily_amens where delivery_date < current_date - 400;
  delete from public.petition_support_actions where created_at < now() - interval '365 days';
  delete from public.rate_limit_buckets where window_started_at < now() - interval '2 days';
  delete from public.newsletter_subscribers where status = 'pending' and consented_at < now() - interval '48 hours';
  delete from public.newsletter_unsubscribe_tokens where created_at < now() - interval '365 days';
  delete from public.checkout_intents i
   where i.created_at < now() - interval '90 days'
     and not exists (select 1 from public.payments p where p.checkout_intent_id = i.id);
end;
$$;

revoke all on public.peticiones, public.reportes_peticiones, public.petition_support_actions,
  public.daily_amens, public.daily_amen_actions,
  public.newsletter_subscribers, public.subscription_members,
  public.newsletter_unsubscribe_tokens,
  public.daily_email_deliveries, public.payments,
  public.rate_limit_buckets, public.checkout_intents from anon, authenticated;
grant all on public.peticiones, public.reportes_peticiones, public.petition_support_actions,
  public.daily_amens, public.daily_amen_actions,
  public.newsletter_subscribers, public.subscription_members,
  public.newsletter_unsubscribe_tokens,
  public.daily_email_deliveries, public.payments,
  public.rate_limit_buckets, public.checkout_intents to service_role;
grant execute on function public.record_petition_support(uuid, text) to service_role;
grant execute on function public.record_daily_amen(date, text) to service_role;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;
grant execute on function public.cleanup_ephemeral_data() to service_role;
