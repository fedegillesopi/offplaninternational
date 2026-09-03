-- Migration 019: Development details fields on properties
-- Agrega campos planos para la seccion "Development Details" de la propiedad:
--   - development: nombre del desarrollo (texto libre, los 3 perfiles)
--   - development_area: area total del desarrollo (numero libre)
--   - developer: nombre del developer (texto plano para broker/private_seller;
--     para rol developer se autocompleta desde developers.name en la app)
-- Para el rol developer, el vinculo a su perfil se resuelve via developer_id
-- (columna ya existente); broker/private_seller guardan solo el texto en developer.
-- Ejecutar en SQL Editor.

ALTER TABLE public.properties
  ADD COLUMN development text,
  ADD COLUMN development_area numeric,
  ADD COLUMN developer text;
