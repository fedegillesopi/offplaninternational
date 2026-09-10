-- Migration 025: Plan Free por defecto
-- Todo usuario nuevo recibe automáticamente el plan free en subscriptions.
-- Se hace en handle_new_user (security definer) para cubrir cualquier vía de registro
-- y porque el trigger ejecuta con privilegios que no chocan con RLS de la migración 024.

-- 1. Extender handle_new_user para crear la suscripción free
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role text;
BEGIN
  v_role := coalesce(new.raw_user_meta_data->>'role', 'developer');

  insert into public.user_profiles (id, role, full_name, email)
  values (new.id, v_role, '', new.email);

  insert into public.subscriptions (user_id, role, plan_name, country, status)
  values (new.id, v_role, 'free', '', 'active');

  return new;
end;
$$ language plpgsql security definer;

-- 2. Backfill: usuarios existentes sin suscripción activa reciben free
INSERT INTO public.subscriptions (user_id, role, plan_name, country, status)
SELECT up.id, up.role, 'free', '', 'active'
FROM public.user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions s
  WHERE s.user_id = up.id AND s.status = 'active'
)
ON CONFLICT DO NOTHING;