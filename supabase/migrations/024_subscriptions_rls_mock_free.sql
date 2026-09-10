-- Migration 024: RLS para suscripciones en fase mock (plan free)
-- Permite que un usuario autenticado cree/actualice SU PROPIA suscripción
-- pero SOLO al plan free. Los tiers de pago quedan reservados a service_role
-- (Stripe webhook) hasta la integración real.
-- Se elimina cuando Stripe entre en producción.

-- INSERT: authenticated solo puede crear su propia suscripción free
DROP POLICY IF EXISTS "Users can insert own free subscription" ON subscriptions;
CREATE POLICY "Users can insert own free subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND plan_name = 'free');

-- UPDATE: authenticated solo puede cambiar su propia suscripción a free
DROP POLICY IF EXISTS "Users can update own subscription to free" ON subscriptions;
CREATE POLICY "Users can update own subscription to free"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND plan_name = 'free');

-- Una sola suscripción activa por usuario (evita duplicados por race condition)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_one_active_per_user
  ON subscriptions(user_id)
  WHERE status = 'active';