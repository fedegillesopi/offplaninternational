-- Migration 005: Storage bucket property-images
-- Crea el bucket de imágenes de propiedades con políticas de acceso.

-- ============================================================
-- 1. BUCKET property-images
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- ============================================================
-- 2. POLÍTICAS DE STORAGE
-- ============================================================

-- SELECT: público, cualquiera puede leer
CREATE POLICY "Public can view property images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'property-images');

-- INSERT: solo usuarios autenticados, en su propia carpeta
CREATE POLICY "Authenticated users can upload to their own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: solo el dueño de la carpeta
CREATE POLICY "Users can delete their own property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
