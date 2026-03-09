-- Check for auth users without profiles in public.users
SELECT
  au.id,
  au.email,
  au.created_at,
  CASE
    WHEN pu.id IS NULL THEN 'Missing Profile'
    ELSE 'Has Profile'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;

-- If you want to create missing profiles, run this after fixing the policy:
-- INSERT INTO public.users (id, email, full_name)
-- SELECT
--   au.id,
--   au.email,
--   au.raw_user_meta_data->>'full_name'
-- FROM auth.users au
-- LEFT JOIN public.users pu ON au.id = pu.id
-- WHERE pu.id IS NULL;
