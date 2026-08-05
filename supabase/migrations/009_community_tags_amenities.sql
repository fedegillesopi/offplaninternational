-- Migration 009: Community tags + Property amenities reference tables
-- Ejecutar en SQL Editor. Despues ejecutar los seeds:
--   supabase/seed/community_tags.sql
--   supabase/seed/property_amenities.sql

-- ============================================================
-- PASO 1 — Crear tabla community_tags
-- ============================================================

CREATE TABLE public.community_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT community_tags_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_community_tags_slug ON public.community_tags(slug);
CREATE INDEX idx_community_tags_category ON public.community_tags(category);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_community_tags()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_community_tags ON public.community_tags;

CREATE TRIGGER trigger_set_updated_at_community_tags
  BEFORE UPDATE ON public.community_tags
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_community_tags();

ALTER TABLE public.community_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_tags_select_public"
  ON public.community_tags FOR SELECT
  USING (is_active = true);

-- ============================================================
-- PASO 2 — Crear tabla property_amenities
-- ============================================================

CREATE TABLE public.property_amenities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon_url text,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT property_amenities_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_property_amenities_slug ON public.property_amenities(slug);
CREATE INDEX idx_property_amenities_category ON public.property_amenities(category);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_property_amenities()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_property_amenities ON public.property_amenities;

CREATE TRIGGER trigger_set_updated_at_property_amenities
  BEFORE UPDATE ON public.property_amenities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_property_amenities();

ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_amenities_select_public"
  ON public.property_amenities FOR SELECT
  USING (is_active = true);
