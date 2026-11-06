-- Let account deletion succeed for users who have affiliate click rows.
--
-- affiliate_clicks.user_id was created (20260820120000) as
-- REFERENCES auth.users(id) with no ON DELETE action, so
-- auth.admin.deleteUser() in the delete-account function failed for anyone
-- with a click, after their profile and messages were already gone.
--
-- ON DELETE SET NULL keeps the click for aggregate partner stats while
-- dropping the link to the deleted person.

DO $$
DECLARE
  r record;
BEGIN
  -- Drop whatever FK(s) currently point affiliate_clicks.user_id at auth.users,
  -- regardless of their generated name.
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_attribute att
      ON att.attrelid = con.conrelid
     AND att.attnum = ANY (con.conkey)
    WHERE con.contype = 'f'
      AND con.conrelid = 'public.affiliate_clicks'::regclass
      AND con.confrelid = 'auth.users'::regclass
      AND att.attname = 'user_id'
  LOOP
    EXECUTE format('ALTER TABLE public.affiliate_clicks DROP CONSTRAINT %I', r.conname);
  END LOOP;
END;
$$;

ALTER TABLE public.affiliate_clicks
  DROP CONSTRAINT IF EXISTS affiliate_clicks_user_id_fkey;

ALTER TABLE public.affiliate_clicks
  ADD CONSTRAINT affiliate_clicks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
