-- Migration 003: Tabla properties
-- Crea la tabla principal de propiedades Off-Plan con RLS completo.

-- ============================================================
-- 1. FUNCIÓN trigger para updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at_properties()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. TABLA properties
-- ============================================================

CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  seller_type text NOT NULL CHECK (seller_type IN ('developer', 'broker', 'private_seller')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'off_market')),

  -- Ubicación
  country text NOT NULL,
  city text NOT NULL,
  community text,
  address text,

  -- Desarrollo (opcional — puede ser null para private sellers)
  development_name text,
  development_slug text,

  -- Datos de la unidad
  title text NOT NULL,
  slug text NOT NULL,
  UNIQUE(seller_id, slug),
  description text,
  property_type text NOT NULL CHECK (property_type IN ('apartment', 'villa', 'townhouse', 'penthouse', 'duplex')),
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  area_sqm numeric,
  floor integer,
  has_balcony boolean DEFAULT false,
  has_garden boolean DEFAULT false,

  -- Datos financieros
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('AED', 'USD', 'EUR', 'GBP')),
  deposit_percentage numeric,
  deposit_amount numeric,

  -- Plan de pago
  has_post_handover boolean DEFAULT false,
  handover_date date,
  payment_plan_months integer,

  -- Amenities
  amenities text[],

  -- Imágenes
  images text[],
  cover_image text,

  -- SEO y metadata
  tags text[],
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX idx_properties_seller_id ON properties(seller_id);
CREATE INDEX idx_properties_seller_type ON properties(seller_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_country ON properties(country);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_is_active ON properties(is_active);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_seller_id_is_active ON properties(seller_id, is_active);

-- ============================================================
-- 4. TRIGGER updated_at
-- ============================================================

CREATE TRIGGER set_updated_at_properties
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_properties();

-- ============================================================
-- 5. RLS
-- ============================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT público: cualquiera puede leer propiedades activas
CREATE POLICY "Public can view active properties"
  ON properties
  FOR SELECT
  USING (is_active = true);

-- SELECT privado: seller ve todas sus propiedades (incluidas inactivas)
CREATE POLICY "Sellers can view all their own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

-- INSERT: seller autenticado inserta sus propiedades, verificando que seller_type = role
CREATE POLICY "Sellers can insert their own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = seller_id
    AND (SELECT role FROM user_profiles WHERE id = auth.uid()) = seller_type
  );

-- UPDATE: seller solo puede actualizar sus propias propiedades
CREATE POLICY "Sellers can update their own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- DELETE: seller solo puede eliminar sus propias propiedades
CREATE POLICY "Sellers can delete their own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);
