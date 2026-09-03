-- Migration 021: Prevent self role escalation in user_profiles
-- La politica "Users can update own user_profile" (migracion 002) solo tenia
-- USING sin WITH CHECK, permitiendo a cualquier usuario autenticado hacer
-- UPDATE user_profiles SET role = 'developer' WHERE id = auth.uid().
-- Esto comprometia todo el modelo de autorizacion por roles (saveProperty,
-- politicas de properties, migracion 020). Este trigger impide que el propio
-- usuario modifique su columna `role`. El cambio de rol queda reservado a un
-- flujo privilegiado (security definer) que se agregara cuando exista.

CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'users cannot change their own role';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_role_change_user_profiles ON public.user_profiles;

CREATE TRIGGER prevent_role_change_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_change();
