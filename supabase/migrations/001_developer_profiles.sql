-- ============================================================
-- Migration: 001_developer_profiles
-- Descripción: Tabla de perfiles de developer + triggers + RLS
-- Ejecutar en: SQL Editor de Supabase
-- ============================================================

-- 1. Función para actualizar updated_at automáticamente
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Crear tabla developer_profiles
create table if not exists public.developer_profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  full_name       text        not null,
  company_name    text        not null,
  operating_country text      not null, -- código ISO 2 letras: 'AE', 'PT', 'MX', etc.
  email           text        not null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 3. Activar Row Level Security
alter table public.developer_profiles enable row level security;

-- 4. Políticas RLS
create policy "Users can read own profile"
  on public.developer_profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.developer_profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.developer_profiles
  for update
  using (auth.uid() = id);

-- 5. Trigger para actualizar updated_at en cada modificación
create trigger set_updated_at
  before update on public.developer_profiles
  for each row
  execute function public.update_updated_at_column();

-- 6. Función que se ejecuta al crear un nuevo usuario en auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.developer_profiles (id, full_name, company_name, operating_country, email)
  values (
    new.id,
    '',      -- se completa en onboarding
    '',      -- se completa en onboarding
    '',      -- se completa en onboarding
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 7. Trigger que inserta automáticamente el perfil al registrarse
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
