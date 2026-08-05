-- Seed: Off Plan International property subcategories (carga unica desde CSV de Webflow)
-- Ejecutar despues de la migracion 010_property_subcategories.sql

INSERT INTO public.property_subcategories (name, slug, category)
VALUES
('Apartment', 'apartment', 'residential'),
('Building', 'building', 'residential'),
('Bulk Unit', 'bulk-unit', 'commercial'),
('Commercial Building', 'commercial-building', 'commercial'),
('Commercial Floor', 'commercial-floor', 'commercial'),
('Commercial Land', 'commercial-land', 'commercial'),
('Commercial Villa', 'commercial-villa', 'commercial'),
('Factory', 'factory', 'commercial'),
('Floor', 'floor', 'residential'),
('Hotel Apartment', 'hotel-apartment', 'residential'),
('Industrial Land', 'industrial-land', 'commercial'),
('Labour Camp', 'labour-camp', 'commercial'),
('Land', 'land', 'residential'),
('Mixed Use Land', 'mixed-use-land', 'commercial'),
('Office', 'office', 'commercial'),
('Other Commercial', 'other-commercial', 'commercial'),
('Penthouse', 'penthouse', 'residential'),
('Shop', 'shop', 'commercial'),
('Showroom', 'showroom', 'commercial'),
('Townhouse', 'townhouse', 'residential'),
('Villa', 'villa', 'residential'),
('Villa Compound', 'villa-compound', 'residential'),
('Warehouse', 'warehouse', 'commercial')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  is_active = true;
