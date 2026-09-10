-- Migration 023: Development pages
-- Bucket de imágenes, columnas nuevas en developments y RLS del owner.
-- Ejecutar en SQL Editor.

-- ============================================================
-- 1. BUCKET development-images
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'development-images',
  'development-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- SELECT: público
CREATE POLICY "Public can view development images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'development-images');

-- INSERT: solo usuarios autenticados, en su propia carpeta
CREATE POLICY "Authenticated users can upload development images to their own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'development-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: solo el dueño de la carpeta
CREATE POLICY "Users can delete their own development images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'development-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 2. COLUMNAS NUEVAS EN developments
-- ============================================================

ALTER TABLE public.developments
  ADD COLUMN starting_price numeric,
  ADD COLUMN starting_price_currency text,
  ADD COLUMN property_types text[],
  ADD COLUMN total_area numeric;

ALTER TABLE public.developments
  ADD CONSTRAINT developments_starting_price_currency_check
  CHECK (starting_price_currency IN ('AED', 'USD', 'EUR', 'GBP'));

-- ============================================================
-- 3. ÍNDICE
-- ============================================================

CREATE INDEX idx_developments_developer_active
  ON public.developments (developer_id, is_active);

-- ============================================================
-- 4. RLS DEL OWNER (SELECT, INSERT, UPDATE)
-- ============================================================

-- SELECT: owner ve todos sus developments (activos e inactivos)
CREATE POLICY "developments_select_own"
  ON public.developments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  );

-- INSERT: solo si el developer_id le pertenece
CREATE POLICY "developments_insert_own"
  ON public.developments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developer_id
        AND d.user_profile_id = auth.uid()
    )
  );

-- UPDATE: solo si el developer_id le pertenece
CREATE POLICY "developments_update_own"
  ON public.developments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  );

-- DELETE: solo si el developer_id le pertenece
CREATE POLICY "developments_delete_own"
  ON public.developments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  );
