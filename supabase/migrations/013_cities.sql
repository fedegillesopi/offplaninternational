-- Migration 013: Tabla cities
-- Ciudades curadas por país para el dropdown de la página de developer.
-- Ejecutar en SQL Editor. Despues ejecutar supabase/seed/cities.sql

-- ============================================================
-- PASO 1 — Crear tabla cities
-- ============================================================

CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  country text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT cities_pkey PRIMARY KEY (id),
  CONSTRAINT cities_country_name_key UNIQUE (country, name)
);

CREATE INDEX idx_cities_country ON public.cities(country);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_cities()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_cities ON public.cities;

CREATE TRIGGER trigger_set_updated_at_cities
  BEFORE UPDATE ON public.cities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_cities();

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cities_select_public"
  ON public.cities FOR SELECT
  USING (true);
