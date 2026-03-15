

## "Who Viewed My Profile" Feature

### 1. Database Migration

Create `profile_views` table with a unique constraint to deduplicate views within 24 hours:

```sql
CREATE TABLE public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate views from same viewer within 24h
CREATE UNIQUE INDEX profile_views_unique_daily 
  ON public.profile_views (viewer_id, viewed_id, (viewed_at::date));

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Users can read views on their own profile
CREATE POLICY "Users can see who viewed their profile"
  ON public.profile_views FOR SELECT TO authenticated
  USING (auth.uid() = viewed_id);

-- Authenticated users can insert views
CREATE POLICY "Authenticated users can record views"
  ON public.profile_views FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = viewer_id);
```

### 2. Record Profile Views

**`src/pages/ProfileView.tsx`** — Add a `useEffect` that inserts a row into `profile_views` when `currentUserId` exists, `profile` is loaded, and it's not the user's own profile. Use `.upsert()` with `onConflict` or a simple insert wrapped in a try/catch (the unique index will silently reject duplicates).

**`src/pages/PublicProfile.tsx`** — Same logic: after the profile loads, if the current user is authenticated and viewing someone else's profile, insert a view row.

Both will use a shared helper or inline logic:
```ts
const recordProfileView = async (viewerId: string, viewedId: string) => {
  if (viewerId === viewedId) return;
  await supabase.from('profile_views').insert({ viewer_id: viewerId, viewed_id: viewedId });
  // unique index handles dedup — errors are silently ignored
};
```

### 3. "Who Viewed Your Profile" Section on Profile Page

**Create `src/hooks/useProfileViewers.ts`** — A hook that:
- Takes `currentUserId`
- Queries `profile_views` for `viewed_id = currentUserId`, ordered by `viewed_at DESC`, limit 10, filtered to last 30 days
- Joins viewer profile data by fetching the viewer IDs then batch-fetching from `profiles`
- Returns `{ viewers, isLoading }`

**Update `src/pages/Profile.tsx`** — Inside the "Edit Profile" `TabsContent`, above or below the `ProfileForm`, add a "Who viewed your profile" card section:
- Show a heading with an Eye icon
- List up to 10 recent viewers, each showing: avatar (with initials fallback), name, home university, and a "Message" button linking to `/messages?user={viewerId}`
- Show "No profile views yet" empty state
- Only renders when `currentUserId` is present (which it always is on this protected route)

### 4. Type Updates

Add `profile_views` to `src/integrations/supabase/types.ts` — actually, this file auto-generates from the Supabase schema, so the migration will handle it. The code will use `.from('profile_views')` with type casting as needed until types regenerate.

### Summary of Files Changed

| File | Change |
|------|--------|
| Migration SQL | Create `profile_views` table + RLS |
| `src/pages/ProfileView.tsx` | Add `useEffect` to record view |
| `src/pages/PublicProfile.tsx` | Add `useEffect` to record view |
| `src/hooks/useProfileViewers.ts` | New hook to fetch recent viewers |
| `src/pages/Profile.tsx` | Add viewers section in Edit tab |

