-- Migration 018: Remove has_balcony and has_garden columns
-- Estos datos ya se capturan via el sistema de amenities
-- (slugs: balcony, private-garden, landscaped-gardens, rooftop-garden).
-- Los booleanos son redundantes.
-- Ejecutar en SQL Editor.

ALTER TABLE public.properties
  DROP COLUMN IF EXISTS has_balcony,
  DROP COLUMN IF EXISTS has_garden;
