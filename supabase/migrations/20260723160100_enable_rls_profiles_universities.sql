-- Enable RLS on profiles and universities.
-- Policies were defined in earlier migrations but are inert without this.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- profiles: users can insert/update/delete only their own row
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- universities: all authenticated users can read
CREATE POLICY "Authenticated users can read universities"
  ON public.universities FOR SELECT TO authenticated
  USING (true);

-- Drop overly broad university UPDATE/DELETE policies that allow all
-- authenticated users. The admin-only policies from 20260316101021
-- will remain and be sufficient.
DROP POLICY IF EXISTS "Authenticated users can update universities" ON public.universities;
DROP POLICY IF EXISTS "Authenticated users can delete universities" ON public.universities;
