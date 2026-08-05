-- Migration 012: Storage bucket developer-images
-- Bucket de imágenes de la página de developer (cover y logo) con políticas de acceso.
-- Ejecutar en SQL Editor.

-- ============================================================
-- 1. BUCKET developer-images
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'developer-images',
  'developer-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- ============================================================
-- 2. POLÍTICAS DE STORAGE
-- ============================================================

-- SELECT: público, cualquiera puede leer
CREATE POLICY "Public can view developer images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'developer-images');

-- INSERT: solo usuarios autenticados, en su propia carpeta
CREATE POLICY "Authenticated users can upload developer images to their own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'developer-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: solo el dueño de la carpeta
CREATE POLICY "Users can delete their own developer images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'developer-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
