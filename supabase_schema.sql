-- ============================================
-- TONOBIL DZ - Full Database Setup Script
-- Safe to re-run: drops everything first
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- CLEAN UP (drop in correct order)
-- ============================================
drop table if exists public.reviews cascade;
drop table if exists public.bookings cascade;
drop table if exists public.cars cascade;
drop table if exists public.users cascade;

drop type if exists kyc_status_enum cascade;
drop type if exists host_status_enum cascade;
drop type if exists transmission_enum cascade;
drop type if exists car_status_enum cascade;
drop type if exists booking_status_enum cascade;
drop type if exists payment_method_enum cascade;

-- ============================================
-- 1. ENUMS
-- ============================================
create type kyc_status_enum as enum ('none', 'pending', 'verified');
create type host_status_enum as enum ('none', 'pending', 'approved');
create type transmission_enum as enum ('auto', 'manual');
create type car_status_enum as enum ('active', 'pending');
create type booking_status_enum as enum ('upcoming', 'active', 'past', 'cancelled');
create type payment_method_enum as enum ('edahabia', 'cash');

-- ============================================
-- 2. TABLES
-- ============================================

-- users table (linked to auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text unique,
  phone text,
  avatar_url text,
  kyc_status kyc_status_enum default 'none',
  host_status host_status_enum default 'none',
  id_document_url text,
  license_document_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- cars table
create table public.cars (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.users(id) on delete cascade not null,
  make text not null,
  model text not null,
  year int not null,
  price_per_day int not null,
  deposit_amount int not null,
  transmission transmission_enum not null,
  fuel_type text not null,
  seats int not null,
  doors int not null,
  mileage int not null,
  images text[] not null default '{}',
  instant_book boolean default false,
  insurance_included boolean default false,
  features text[] default '{}',
  city text not null,
  wilaya text not null,
  address text not null,
  description text,
  car_type text not null,
  status car_status_enum default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- bookings table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  host_id uuid references public.users(id) on delete cascade not null,
  reference_number text unique not null,
  check_in date not null,
  check_out date not null,
  check_in_time time,
  check_out_time time,
  total_price int not null,
  status booking_status_enum default 'upcoming',
  payment_method payment_method_enum not null,
  agreed_to_policy boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 3. TRIGGER: Auto-create user profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================
alter table public.users enable row level security;
alter table public.cars enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- Users
create policy "Users can view all profiles"
  on public.users for select using (true);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);
create policy "Admins can update any profile"
  on public.users for update using (
    exists (select 1 from public.users as u where u.id = auth.uid() and u.is_admin = true)
  );

-- Cars
create policy "Cars are viewable by everyone"
  on public.cars for select using (true);
create policy "Hosts can insert their own cars"
  on public.cars for insert with check (auth.uid() = host_id);
create policy "Hosts can update their own cars"
  on public.cars for update using (auth.uid() = host_id);
create policy "Hosts can delete their own cars"
  on public.cars for delete using (auth.uid() = host_id);
create policy "Admins can update any car"
  on public.cars for update using (
    exists (select 1 from public.users as u where u.id = auth.uid() and u.is_admin = true)
  );
create policy "Admins can delete any car"
  on public.cars for delete using (
    exists (select 1 from public.users as u where u.id = auth.uid() and u.is_admin = true)
  );

-- Bookings
create policy "Users can view their own bookings"
  on public.bookings for select using (auth.uid() = user_id or auth.uid() = host_id);
create policy "Admins can view all bookings"
  on public.bookings for select using (
    exists (select 1 from public.users as u where u.id = auth.uid() and u.is_admin = true)
  );
create policy "Users can create bookings"
  on public.bookings for insert with check (auth.uid() = user_id);
create policy "Users and hosts can update bookings"
  on public.bookings for update using (auth.uid() = user_id or auth.uid() = host_id);

-- Reviews
create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);
create policy "Users can insert reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

-- ============================================
-- 5. STORAGE BUCKETS
-- ============================================

-- car-images (Public)
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

drop policy if exists "Car images are publicly accessible" on storage.objects;
create policy "Car images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'car-images');

drop policy if exists "Authenticated users can upload car images" on storage.objects;
create policy "Authenticated users can upload car images"
  on storage.objects for insert
  with check (bucket_id = 'car-images' and auth.role() = 'authenticated');

-- avatars (Public)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatars are publicly accessible" on storage.objects;
create policy "Avatars are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Authenticated users can upload avatars" on storage.objects;
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- kyc-documents (Private)
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

drop policy if exists "Users can view their own documents" on storage.objects;
create policy "Users can view their own documents"
  on storage.objects for select
  using (bucket_id = 'kyc-documents' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can upload their own documents" on storage.objects;
create policy "Users can upload their own documents"
  on storage.objects for insert
  with check (bucket_id = 'kyc-documents' and auth.role() = 'authenticated');
