-- Migration 007: Developers, Developments, Properties rebuild, Milestones rebuild
-- Ejecutar en SQL Editor en el orden exacto indicado.

-- ============================================================
-- PASO 0 — Estandarizar naming de función existente en user_profiles
-- ============================================================

-- La función se llama update_updated_at_column() (creada en migraciones previas).
-- La renombramos para que sea consistente con el resto del proyecto.
-- El trigger en user_profiles se actualiza automáticamente al renombrar la función.

ALTER FUNCTION update_updated_at_column()
  RENAME TO trigger_set_updated_at_user_profiles;

-- ============================================================
-- PASO 1 — Crear tabla developers
-- ============================================================

CREATE TABLE public.developers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  website text,
  description text,
  country text,
  is_verified boolean NOT NULL DEFAULT false,
  user_profile_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT developers_pkey PRIMARY KEY (id),
  CONSTRAINT developers_user_profile_id_fkey
    FOREIGN KEY (user_profile_id)
    REFERENCES public.user_profiles(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_developers_slug ON public.developers(slug);
CREATE INDEX idx_developers_user_profile_id ON public.developers(user_profile_id);
CREATE INDEX idx_developers_country ON public.developers(country);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_developers()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at_developers
  BEFORE UPDATE ON public.developers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_developers();

ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "developers_select_public"
  ON public.developers FOR SELECT
  USING (is_verified = true);

CREATE POLICY "developers_select_own"
  ON public.developers FOR SELECT
  USING (auth.uid() = user_profile_id);

-- ============================================================
-- PASO 2 — Crear tabla developments
-- ============================================================

CREATE TABLE public.developments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  developer_id uuid,
  description text,
  country text,
  city text,
  community text,
  cover_image text,
  images text[],
  amenities text[],
  handover_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT developments_pkey PRIMARY KEY (id),
  CONSTRAINT developments_developer_id_fkey
    FOREIGN KEY (developer_id)
    REFERENCES public.developers(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_developments_slug ON public.developments(slug);
CREATE INDEX idx_developments_developer_id ON public.developments(developer_id);
CREATE INDEX idx_developments_country ON public.developments(country);
CREATE INDEX idx_developments_city ON public.developments(city);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_developments()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at_developments
  BEFORE UPDATE ON public.developments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_developments();

ALTER TABLE public.developments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "developments_select_public"
  ON public.developments FOR SELECT
  USING (is_active = true);

-- ============================================================
-- PASO 3 — Reemplazar tabla properties
-- ============================================================

DROP TABLE IF EXISTS public.properties CASCADE;

CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  listed_by_id uuid NOT NULL,
  listed_by_type text NOT NULL
    CHECK (listed_by_type = ANY (ARRAY['developer','broker','private_seller'])),

  developer_id uuid,
  development_id uuid,

  status text NOT NULL DEFAULT 'available'
    CHECK (status = ANY (ARRAY['available','sold','reserved','off_market'])),

  country text NOT NULL,
  city text NOT NULL,
  community text,
  address text,

  title text NOT NULL,
  slug text NOT NULL,
  description text,
  property_type text NOT NULL
    CHECK (property_type = ANY (ARRAY['apartment','villa','townhouse','penthouse','duplex'])),
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  area_sqm numeric,
  floor integer,
  has_balcony boolean DEFAULT false,
  has_garden boolean DEFAULT false,

  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'
    CHECK (currency = ANY (ARRAY['AED','USD','EUR','GBP'])),
  deposit_percentage numeric,
  deposit_amount numeric,

  has_post_handover boolean DEFAULT false,
  handover_date date,
  payment_plan_months integer,

  amenities text[],
  images text[],
  cover_image text,
  tags text[],

  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT properties_slug_unique UNIQUE (listed_by_id, slug),

  CONSTRAINT properties_listed_by_id_fkey
    FOREIGN KEY (listed_by_id)
    REFERENCES public.user_profiles(id)
    ON DELETE CASCADE,

  CONSTRAINT properties_developer_id_fkey
    FOREIGN KEY (developer_id)
    REFERENCES public.developers(id)
    ON DELETE SET NULL,

  CONSTRAINT properties_development_id_fkey
    FOREIGN KEY (development_id)
    REFERENCES public.developments(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_properties_listed_by_id ON public.properties(listed_by_id);
CREATE INDEX idx_properties_listed_by_type ON public.properties(listed_by_type);
CREATE INDEX idx_properties_developer_id ON public.properties(developer_id);
CREATE INDEX idx_properties_development_id ON public.properties(development_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_country ON public.properties(country);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_is_active ON public.properties(is_active);
CREATE INDEX idx_properties_listed_by_active ON public.properties(listed_by_id, is_active);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_properties()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at_properties
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_properties();

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_select_public"
  ON public.properties FOR SELECT
  USING (is_active = true);

CREATE POLICY "properties_select_own"
  ON public.properties FOR SELECT
  USING (auth.uid() = listed_by_id);

CREATE POLICY "properties_insert"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() = listed_by_id
    AND listed_by_type = (
      SELECT role FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "properties_update"
  ON public.properties FOR UPDATE
  USING (auth.uid() = listed_by_id);

CREATE POLICY "properties_delete"
  ON public.properties FOR DELETE
  USING (auth.uid() = listed_by_id);

-- ============================================================
-- PASO 4 — Recrear payment_plan_milestones
-- ============================================================

DROP TABLE IF EXISTS public.payment_plan_milestones;

CREATE TABLE public.payment_plan_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  milestone_name text NOT NULL,
  percentage numeric NOT NULL
    CHECK (percentage >= 0 AND percentage <= 100),
  amount numeric,
  due_date date,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT payment_plan_milestones_pkey PRIMARY KEY (id),
  CONSTRAINT payment_plan_milestones_property_id_fkey
    FOREIGN KEY (property_id)
    REFERENCES public.properties(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_milestones_property_id ON public.payment_plan_milestones(property_id);

ALTER TABLE public.payment_plan_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "milestones_select_public"
  ON public.payment_plan_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND is_active = true
    )
  );

CREATE POLICY "milestones_insert"
  ON public.payment_plan_milestones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND listed_by_id = auth.uid()
    )
  );

CREATE POLICY "milestones_update"
  ON public.payment_plan_milestones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND listed_by_id = auth.uid()
    )
  );

CREATE POLICY "milestones_delete"
  ON public.payment_plan_milestones FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND listed_by_id = auth.uid()
    )
  );
