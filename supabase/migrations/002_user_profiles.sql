-- ============================================================
-- Migration: 002_user_profiles
-- Descripción: Tabla unificada de perfiles con roles (developer, broker, private_seller)
--              + migración de datos desde developer_profiles + triggers + RLS
-- Ejecutar en: SQL Editor de Supabase
-- ============================================================

-- 1. Crear tabla user_profiles
create table if not exists public.user_profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  role                text        not null check (role in ('developer', 'broker', 'private_seller')),
  full_name           text        not null default '',
  email               text        not null,
  phone               text        not null default '',
  company_name        text        not null default '',
  company_website     text        not null default '',
  operating_country   text        not null default '',
  license_number      text        not null default '',
  country_of_residence text       not null default '',
  profile_completed   boolean     not null default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 2. Activar Row Level Security
alter table public.user_profiles enable row level security;

-- 3. Políticas RLS
create policy "Users can read own user_profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert own user_profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update own user_profile"
  on public.user_profiles
  for update
  using (auth.uid() = id);

-- 4. Trigger para actualizar updated_at en cada modificación
create trigger set_updated_at_user_profiles
  before update on public.user_profiles
  for each row
  execute function public.update_updated_at_column();

-- 5. Migrar datos existentes de developer_profiles → user_profiles
insert into public.user_profiles (id, role, full_name, email, phone, company_name, company_website, operating_country, license_number, country_of_residence, profile_completed, created_at, updated_at)
select
  dp.id,
  'developer',
  dp.full_name,
  dp.email,
  '',
  dp.company_name,
  '',
  dp.Operating_country,
  '',
  '',
  case when dp.company_name != '' then true else false end,
  dp.created_at,
  dp.updated_at
from public.developer_profiles dp
on conflict (id) do nothing;

-- 6. Actualizar trigger handle_new_user para crear en user_profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'developer'),
    '',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 7. Mantener developer_profiles trigger original intacto (no se modifica)
