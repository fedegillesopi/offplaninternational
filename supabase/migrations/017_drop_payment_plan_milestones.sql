-- Migration 017: Remove payment plan milestones & payment_plan_months
-- La seccion de Payment Plan Milestones y la logica de mortgage se eliminan
-- (no bien pensada desde el lado de producto, se replanteara en el futuro).
-- Se mantiene has_post_handover como informacion adicional simple.
-- Se elimina la tabla payment_plan_milestones y la columna payment_plan_months
-- de properties.
-- Ejecutar en SQL Editor.

DROP TABLE IF EXISTS public.payment_plan_milestones;

ALTER TABLE public.properties
  DROP COLUMN IF EXISTS payment_plan_months;
