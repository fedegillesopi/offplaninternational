-- Migration 022: Broker credentials (RERA card, QR code, agency ORN, confirmation)
-- Agrega campos de credenciales al perfil público del broker.
-- Ejecutar en SQL Editor.

ALTER TABLE public.broker_profiles
  ADD COLUMN IF NOT EXISTS rera_card_url text,
  ADD COLUMN IF NOT EXISTS qr_code_url text,
  ADD COLUMN IF NOT EXISTS agency_orn text,
  ADD COLUMN IF NOT EXISTS details_confirmed boolean NOT NULL DEFAULT false;
