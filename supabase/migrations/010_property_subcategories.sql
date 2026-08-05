-- Migration 010: Property subcategories reference table
-- Ejecutar en SQL Editor. Despues ejecutar supabase/seed/property_subcategories.sql

CREATE TABLE public.property_subcategories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT property_subcategories_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_property_subcategories_slug ON public.property_subcategories(slug);
CREATE INDEX idx_property_subcategories_category ON public.property_subcategories(category);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_property_subcategories()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_property_subcategories ON public.property_subcategories;

CREATE TRIGGER trigger_set_updated_at_property_subcategories
  BEFORE UPDATE ON public.property_subcategories
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_property_subcategories();

ALTER TABLE public.property_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_subcategories_select_public"
  ON public.property_subcategories FOR SELECT
  USING (is_active = true);
