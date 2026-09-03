-- Migration 015: Property subcategory column
-- Agrega la columna subcategory a properties para persistir la subcategoría
-- seleccionada en el form (tabla de referencia property_subcategories).
-- Ejecutar en SQL Editor.

ALTER TABLE public.properties
  ADD COLUMN subcategory text;
