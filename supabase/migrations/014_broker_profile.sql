-- Migration 014: Broker profile table + storage bucket
-- Tabla broker_profiles para la página pública del broker + bucket broker-images.
-- Ejecutar en SQL Editor.

-- ============================================================
-- PASO 1 — Tabla broker_profiles
-- ============================================================

CREATE TABLE public.broker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id uuid NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  profile_image text,
  personal_url text,
  description text,
  country text,
  city text,
  email_public text,
  phone text,
  whatsapp text,
  closed_transactions integer DEFAULT 0,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indices
CREATE INDEX idx_broker_profiles_slug ON public.broker_profiles(slug);
CREATE INDEX idx_broker_profiles_user_profile_id ON public.broker_profiles(user_profile_id);

-- Función + trigger updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at_broker_profiles()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at_broker_profiles
  BEFORE UPDATE ON public.broker_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at_broker_profiles();

-- ============================================================
-- PASO 2 — Políticas RLS
-- ============================================================

ALTER TABLE public.broker_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT público: brokers verificados
CREATE POLICY "broker_profiles_select_public"
  ON public.broker_profiles FOR SELECT
  USING (is_verified = true);

-- SELECT propio: broker ve su propio perfil (sin filtro verificación)
CREATE POLICY "broker_profiles_select_own"
  ON public.broker_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_profile_id);

-- INSERT propio
CREATE POLICY "broker_profiles_insert_own"
  ON public.broker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_profile_id);

-- UPDATE propio
CREATE POLICY "broker_profiles_update_own"
  ON public.broker_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_profile_id);

-- ============================================================
-- PASO 3 — Bucket broker-images
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'broker-images',
  'broker-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- SELECT: público
CREATE POLICY "broker_images_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'broker-images');

-- INSERT: solo en carpeta propia
CREATE POLICY "broker_images_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'broker-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: solo en carpeta propia
CREATE POLICY "broker_images_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'broker-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
