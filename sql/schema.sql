-- Ejecuta este archivo en Supabase: SQL Editor > New query > Run
-- Crea las tablas del sistema de administracion.
-- RLS queda activo y sin politicas publicas: solo el backend (service_role) accede.

create extension if not exists "pgcrypto";

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  role_id uuid not null references public.roles (id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique,
  full_name text not null,
  email text unique,
  phone text,
  position text not null,
  salary numeric(12, 2),
  hire_date date not null default current_date,
  department_id uuid references public.departments (id) on delete set null,
  user_id uuid unique references public.users (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_departments_updated_at on public.departments;
create trigger trg_departments_updated_at
before update on public.departments
for each row execute function public.set_updated_at();

drop trigger if exists trg_employees_updated_at on public.employees;
create trigger trg_employees_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.departments enable row level security;
alter table public.employees enable row level security;

insert into public.roles (name, description)
values
  ('admin', 'Acceso total al sistema de administracion'),
  ('empleado', 'Acceso operativo limitado')
on conflict (name) do nothing;
