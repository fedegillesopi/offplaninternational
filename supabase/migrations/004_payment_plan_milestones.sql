-- Migration 004: Tabla payment_plan_milestones
-- Crea la tabla de hitos del plan de pago asociada a cada propiedad.

-- ============================================================
-- 1. TABLA payment_plan_milestones
-- ============================================================

CREATE TABLE payment_plan_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  milestone_name text NOT NULL,
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  amount numeric,
  due_date date,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. ÍNDICE
-- ============================================================

CREATE INDEX idx_payment_plan_milestones_property_id ON payment_plan_milestones(property_id);

-- ============================================================
-- 3. RLS
-- ============================================================

ALTER TABLE payment_plan_milestones ENABLE ROW LEVEL SECURITY;

-- SELECT público: milestones de propiedades activas
CREATE POLICY "Public can view milestones of active properties"
  ON payment_plan_milestones
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND is_active = true)
  );

-- INSERT: seller dueño de la propiedad
CREATE POLICY "Sellers can insert milestones for their own properties"
  ON payment_plan_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND seller_id = auth.uid())
  );

-- UPDATE: seller dueño de la propiedad
CREATE POLICY "Sellers can update milestones for their own properties"
  ON payment_plan_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND seller_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND seller_id = auth.uid())
  );

-- DELETE: seller dueño de la propiedad
CREATE POLICY "Sellers can delete milestones for their own properties"
  ON payment_plan_milestones
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND seller_id = auth.uid())
  );
