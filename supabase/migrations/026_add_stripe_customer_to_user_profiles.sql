-- Migration 026: Columna stripe_customer_id en user_profiles
-- Persiste el Stripe customer de por vida (independiente de la suscripción activa)
-- para poder crear sesiones de Customer Portal / Checkout aunque no haya suscripción.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id
  ON public.user_profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;