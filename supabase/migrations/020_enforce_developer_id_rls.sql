-- Migration 020: Enforce developer_id coherence in properties RLS
-- Refuerza las politicas INSERT y UPDATE de properties para que developer_id
-- sea coherente con el rol que lista la propiedad:
--   - rol 'developer'   -> developer_id debe ser SU propio developers.id
--   - broker/private    -> developer_id debe ser NULL
-- Evita body manipulation / spoofing de marca (vincular una propiedad a un
-- developer ajeno o verificado). Complementa la validacion server-side.
-- Nota: payment_plan_milestones ya fue eliminada en la migracion 017.

ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "properties_insert" ON public.properties;
DROP POLICY IF EXISTS "properties_update" ON public.properties;

CREATE POLICY "properties_insert"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() = listed_by_id
    AND listed_by_type = (
      SELECT role FROM public.user_profiles WHERE id = auth.uid()
    )
    AND (
      (listed_by_type = 'developer'
       AND developer_id = (
         SELECT id FROM public.developers WHERE user_profile_id = auth.uid()
       ))
      OR
      (listed_by_type <> 'developer' AND developer_id IS NULL)
    )
  );

CREATE POLICY "properties_update"
  ON public.properties FOR UPDATE
  USING (auth.uid() = listed_by_id)
  WITH CHECK (
    listed_by_type = (
      SELECT role FROM public.user_profiles WHERE id = auth.uid()
    )
    AND (
      (listed_by_type = 'developer'
       AND developer_id = (
         SELECT id FROM public.developers WHERE user_profile_id = auth.uid()
       ))
      OR
      (listed_by_type <> 'developer' AND developer_id IS NULL)
    )
  );

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
