-- Migration 016: Drop property_type column
-- property_type queda obsoleto: la clasificacion ahora viene solo de
-- property_subcategories (columna subcategory). Se elimina la columna
-- junto con su CHECK constraint inline y su indice.
-- Ejecutar en SQL Editor.

DROP INDEX IF EXISTS idx_properties_property_type;

ALTER TABLE public.properties
  DROP COLUMN property_type;