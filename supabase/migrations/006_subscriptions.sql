-- Migration 006: Tabla subscriptions (inactiva en beta)
-- Tabla preparada para integración futura con Stripe.
-- No se aplica lógica de bloqueo todavía.

-- ============================================================
-- 1. FUNCIÓN trigger para updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. TABLA subscriptions
-- ============================================================

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  plan_name text NOT NULL,
  country text NOT NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- ============================================================
-- 4. TRIGGER updated_at
-- ============================================================

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_subscriptions();

-- ============================================================
-- 5. RLS
-- ============================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- SELECT: usuario solo lee su propia suscripción
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: solo service role (Stripe webhook) — no permitir desde cliente
CREATE POLICY "Service role can insert subscriptions"
  ON subscriptions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE: solo service role (Stripe webhook) — no permitir desde cliente
CREATE POLICY "Service role can update subscriptions"
  ON subscriptions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
