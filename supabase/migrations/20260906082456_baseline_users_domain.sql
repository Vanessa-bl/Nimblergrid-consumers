-- BASELINE: sistema de usuarios de hallo-one
-- Estado inicial: profiles, user_roles, agencies, agency_members + indexes
-- Aplicado a producción manualmente antes de introducir CI/CD.
-- Marcar como applied con: npx supabase migration repair --status applied 20260906082456


-- ============================================
-- 000_schemas.sql
-- ============================================
create schema if not exists private;

comment on schema private is
  'SECURITY DEFINER helpers y triggers del sistema. No expuesto via PostgREST.';

revoke all on schema private from public;

grant usage on schema private to supabase_auth_admin;
grant usage on schema private to authenticated;
grant usage on schema private to service_role;

alter default privileges in schema private
  revoke execute on functions from public;

-- ============================================
-- 001_user_types.sql
-- ============================================
-- Roles globales asignables via user_roles.
-- Aditivos: un user puede tener varios activos al mismo tiempo.
create type public.global_role as enum (
  'client',         -- puede buscar, guardar favoritos, contactar. Default de todos.
  'owner',          -- puede publicar propiedades a nombre propio (particular).
  'platform_admin'  -- staff de hallo-one.
);

comment on type public.global_role is
  'Roles globales asignables via public.user_roles. Aditivos y revocables.';


-- Rol interno de un user dentro de una agencia especifica.
-- Solo se usa en public.agency_members (scoped a UNA agency).
create type public.agency_role as enum (
  'agent',
  'coordinator',
  'agency_admin'
);

comment on type public.agency_role is
  'Rol interno de un user dentro de una agency. Vive solo en public.agency_members, no en user_roles.';


-- Plan de subscripcion de la agencia (afecta limites de listings/miembros).
create type public.agency_tier as enum (
  'starter',
  'office'
);

comment on type public.agency_tier is
  'Plan de subscripcion de una agency.';

-- ============================================
-- 002_profiles.sql
-- ============================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Un perfil por cada auth.users. Todos los roles se gestionan en public.user_roles (globales) y public.agency_members (por agencia).';

alter table public.profiles enable row level security;
alter table public.profiles force row level security;


-- Sincroniza email desde auth.users cuando el user lo cambia.
create or replace function private.sync_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles
       set email = new.email
     where id = new.id;
  end if;
  return new;
end;
$$;

revoke execute on function private.sync_user_email() from public;
grant  execute on function private.sync_user_email() to supabase_auth_admin;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function private.sync_user_email();

-- Nota: profiles.id y profiles.email ya estan indexados implicitamente
-- por PRIMARY KEY y UNIQUE constraint respectivamente. No hacen falta indices adicionales.

-- ============================================
-- 003_user_roles.sql
-- ============================================
create table public.user_roles (
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        public.global_role not null,
  granted_at  timestamptz not null default now(),
  granted_by  uuid references auth.users(id),
  revoked_at  timestamptz,
  primary key (user_id, role)
);

comment on table public.user_roles is
  'Roles globales activos de un user. revoked_at != null = rol inactivo (soft delete). Multiples roles por user permitidos.';

alter table public.user_roles enable row level security;
alter table public.user_roles force row level security;


-- Partial index sobre user_roles activos.
-- Complementa el PK compuesto (user_id, role) reduciendo tamaño del indice
-- para el 99% de queries que filtran por revoked_at is null (has_role, JWT hook).
create index if not exists user_roles_user_id_active_idx
  on public.user_roles (user_id)
  where revoked_at is null;


-- Helper: chequea si un user tiene un rol global activo.
-- Usado por RLS policies y por el custom_access_token_hook.
create or replace function private.has_role(p_user uuid, p_role public.global_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
     where user_id = p_user
       and role = p_role
       and revoked_at is null
  );
$$;

revoke execute on function private.has_role(uuid, public.global_role) from public;
grant  execute on function private.has_role(uuid, public.global_role) to authenticated, service_role, supabase_auth_admin;


-- Trigger de alta de usuario:
-- 1) crea el profile,
-- 2) le asigna el rol 'client' (default de todos).
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'client');

  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public;
grant  execute on function private.handle_new_user() to supabase_auth_admin;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ============================================
-- 004_agencies.sql
-- ============================================
create table public.agencies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  tier        public.agency_tier not null default 'starter',
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

comment on table public.agencies is
  'Inmobiliarias registradas en la plataforma. Cada una tiene su equipo en public.agency_members.';

alter table public.agencies enable row level security;
alter table public.agencies force row level security;


create table public.agency_members (
  agency_id    uuid not null references public.agencies(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  agency_role  public.agency_role not null,
  invited_by   uuid references auth.users(id),
  joined_at    timestamptz not null default now(),
  removed_at   timestamptz,
  primary key (agency_id, user_id)
);

comment on table public.agency_members is
  'Membresia de un user en una agency con su rol interno (agent | coordinator | agency_admin). removed_at != null = miembro removido (soft delete). Un user puede pertenecer a multiples agencies.';

alter table public.agency_members enable row level security;
alter table public.agency_members force row level security;


-- Partial FK index sobre agency_members activos por user_id.
-- Requerido porque el PK compuesto (agency_id, user_id) NO cubre WHERE user_id = X
-- (user_id no es leading column). Acelera user_agencies(uid), is_agency_member() y JWT hook.
create index if not exists agency_members_user_id_active_idx
  on public.agency_members (user_id)
  where removed_at is null;


-- Helper: chequea si un user es miembro activo de una agency especifica.
create or replace function private.is_agency_member(p_user uuid, p_agency uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.agency_members
     where user_id = p_user
       and agency_id = p_agency
       and removed_at is null
  );
$$;

revoke execute on function private.is_agency_member(uuid, uuid) from public;
grant  execute on function private.is_agency_member(uuid, uuid) to authenticated, service_role;


-- Helper: devuelve todas las membresias activas de un user (para armar el JWT).
create or replace function private.user_agencies(p_user uuid)
returns table (agency_id uuid, agency_role public.agency_role)
language sql
stable
security definer
set search_path = ''
as $$
  select agency_id, agency_role
    from public.agency_members
   where user_id = p_user
     and removed_at is null;
$$;

revoke execute on function private.user_agencies(uuid) from public;
grant  execute on function private.user_agencies(uuid) to authenticated, service_role, supabase_auth_admin;
