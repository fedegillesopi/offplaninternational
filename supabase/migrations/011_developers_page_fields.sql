-- Migration 011: Developer page fields + ownership policies
-- Agrega campos de la página pública de developer y políticas de INSERT/UPDATE del owner.
-- Ejecutar en SQL Editor.

-- ============================================================
-- PASO 1 — Agregar campos de la página pública a developers
-- ============================================================

ALTER TABLE public.developers
  ADD COLUMN cover_image text,
  ADD COLUMN city text,
  ADD COLUMN on_time_completion integer,
  ADD COLUMN email text,
  ADD COLUMN phone text;

-- Una sola página por usuario de perfil developer
ALTER TABLE public.developers
  ADD CONSTRAINT developers_user_profile_id_unique UNIQUE (user_profile_id);

-- ============================================================
-- PASO 2 — Políticas RLS del owner (crear/editar su página)
-- ============================================================

CREATE POLICY "developers_insert_own"
  ON public.developers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_profile_id);

CREATE POLICY "developers_update_own"
  ON public.developers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_profile_id);
