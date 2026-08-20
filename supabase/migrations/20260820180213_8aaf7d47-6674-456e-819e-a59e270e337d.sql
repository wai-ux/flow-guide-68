DELETE FROM public.user_progress p
USING public.user_progress q
WHERE p.user_id = q.user_id
  AND p.module_slug = q.module_slug
  AND p.ctid > q.ctid;

ALTER TABLE public.user_progress
  ADD CONSTRAINT user_progress_user_module_unique UNIQUE (user_id, module_slug);