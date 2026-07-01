-- Catálogo Online Inteligente - Supabase SQL
-- 1) Pega todo este archivo en Supabase > SQL Editor > Run.
-- 2) Luego crea un usuario admin en Authentication > Users.
-- 3) Desactiva el registro público si solo la dueña usará el panel.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  background_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric(10,2) not null default 0,
  old_price numeric(10,2),
  short_description text,
  long_description text,
  whatsapp_text text,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  stock integer,
  is_active boolean not null default true,
  is_offer boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_tags (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  tag text not null,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Bucket público para imágenes de productos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.ai_tags enable row level security;

-- Reiniciar políticas para poder ejecutar este SQL más de una vez.
drop policy if exists "Public read active categories" on public.categories;
drop policy if exists "Authenticated manage categories" on public.categories;
drop policy if exists "Public read active products" on public.products;
drop policy if exists "Authenticated manage products" on public.products;
drop policy if exists "Public read tags" on public.ai_tags;
drop policy if exists "Authenticated manage tags" on public.ai_tags;
drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Authenticated upload product images" on storage.objects;
drop policy if exists "Authenticated update product images" on storage.objects;
drop policy if exists "Authenticated delete product images" on storage.objects;

create policy "Public read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

create policy "Anon and Authenticated manage categories"
on public.categories
for all
to anon, authenticated
using (true)
with check (true);

create policy "Public read active products"
on public.products
for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

create policy "Anon and Authenticated manage products"
on public.products
for all
to anon, authenticated
using (true)
with check (true);

create policy "Public read tags"
on public.ai_tags
for select
to anon, authenticated
using (true);

create policy "Anon and Authenticated manage tags"
on public.ai_tags
for all
to anon, authenticated
using (true)
with check (true);

create policy "Public read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "Authenticated upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "Authenticated update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "Authenticated delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');

insert into public.categories (name, slug, description, is_active)
values
  ('Perfumes', 'perfumes', 'Fragancias elegantes, frescas y dulces para diferentes ocasiones.', true),
  ('Cremas', 'cremas', 'Productos de cuidado personal con presentación limpia y delicada.', true),
  ('Maquillaje', 'maquillaje', 'Opciones modernas para complementar una rutina de belleza.', true),
  ('Promociones', 'promociones', 'Productos en oferta y combos especiales por tiempo limitado.', true),
  ('Accesorios', 'accesorios', 'Detalles prácticos y bonitos para uso diario o regalo.', true)
on conflict (slug) do nothing;
