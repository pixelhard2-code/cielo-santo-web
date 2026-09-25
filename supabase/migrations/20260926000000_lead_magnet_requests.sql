create table if not exists public.lead_magnet_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  resource text not null check (resource = 'siete_salmos_7d'),
  requested_at timestamptz not null default now(),
  unique (email, resource)
);

alter table public.lead_magnet_requests enable row level security;
revoke all on public.lead_magnet_requests from anon, authenticated;
grant all on public.lead_magnet_requests to service_role;

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
  delete from public.lead_magnet_requests where requested_at < now() - interval '90 days';
  delete from public.checkout_intents i
   where i.created_at < now() - interval '90 days'
     and not exists (select 1 from public.payments p where p.checkout_intent_id = i.id);
end;
$$;
