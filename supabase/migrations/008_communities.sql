-- Migration 008: Communities + community_translations
-- Ejecutar en SQL Editor. Despues ejecutar supabase/seed/communities.sql

-- ============================================================
-- PASO 1 — Crear tabla communities
-- ============================================================

CREATE TABLE public.communities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  country text,
  city text,
  location text,
  average_price_range text,
  highlight_image text,
  images text[],
  tags text[],
  google_map_url text,
  developer_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT communities_pkey PRIMARY KEY (id),
  CONSTRAINT communities_developer_id_fkey
    FOREIGN KEY (developer_id)
    REFERENCES public.developers(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_communities_slug ON public.communities(slug);
CREATE INDEX idx_communities_country ON public.communities(country);
CREATE INDEX idx_communities_city ON public.communities(city);
CREATE INDEX idx_communities_developer_id ON public.communities(developer_id);
CREATE INDEX idx_communities_is_active ON public.communities(is_active);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_communities()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_communities ON public.communities;

CREATE TRIGGER trigger_set_updated_at_communities
  BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_communities();

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "communities_select_public"
  ON public.communities FOR SELECT
  USING (is_active = true);

-- ============================================================
-- PASO 2 — Crear tabla community_translations
-- ============================================================

CREATE TABLE public.community_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  locale text NOT NULL,
  name text NOT NULL,
  short_description text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT community_translations_pkey PRIMARY KEY (id),
  CONSTRAINT community_translations_community_id_fkey
    FOREIGN KEY (community_id)
    REFERENCES public.communities(id)
    ON DELETE CASCADE,
  CONSTRAINT community_translations_community_id_locale_key
    UNIQUE (community_id, locale)
);

CREATE INDEX idx_community_translations_community_id
  ON public.community_translations(community_id);
CREATE INDEX idx_community_translations_locale
  ON public.community_translations(locale);

CREATE OR REPLACE FUNCTION trigger_set_updated_at_community_translations()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_community_translations ON public.community_translations;

CREATE TRIGGER trigger_set_updated_at_community_translations
  BEFORE UPDATE ON public.community_translations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_community_translations();

ALTER TABLE public.community_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_translations_select_public"
  ON public.community_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE id = community_id AND is_active = true
    )
  );
