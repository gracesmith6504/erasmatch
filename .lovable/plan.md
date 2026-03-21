

## Hero Section Redesign Plan

### Problems to Fix
1. "Find your people" headline is generic
2. "Recently joined" card shows "just now" for everyone (fake)
3. "23 students joined today" / "+12%" / "Daily goal" section is an internal metric
4. Flag emojis rendering as codes on some devices/browsers
5. "Invite a friend" ShareButton looks out of place in the hero
6. Right-side content uses hardcoded fake data instead of real students

### Changes

**1. Remove the "daily goal" card entirely**
Delete the bottom card from `SocialProofCards.tsx` (the progress bar, +12%, daily goal section).

**2. Replace headline copy**
Change "Find your people" to something Erasmus-specific like "Your Erasmus starts here" or "Meet your crew before you land". Keeps the animated city rotation.

**3. Fix the rotating notification pill**
- Vary the timestamps ("2m ago", "5m ago", "12m ago") instead of static "2m ago"
- Ensure flag emojis render correctly (the current data already uses emoji characters like 🇸🇪, the "SE" issue is likely a rendering problem on certain systems, so we'll keep emoji but add a fallback)

**4. Remove ShareButton from hero**
Remove the "Invite a friend" button from the top-right of the hero section.

**5. Replace SocialProofCards with real student grid from database**
- Create a new Supabase **security definer function** `get_landing_page_profiles` that returns recent profiles with avatar photos, grouped by city. This function bypasses RLS so it works for unauthenticated visitors.
- Returns: first name only, avatar_url, city (destination). Limited to ~8-12 students who have profile photos.
- New component: `RealStudentGrid` replaces `SocialProofCards`. Shows students grouped by city in a clean grid with real avatars. No fake timestamps.
- The card header becomes the city name (e.g., "Barcelona", "Amsterdam") with a count of students going there.

**6. Fix "Recently joined" timestamps**
Instead of "just now" for all, use varied realistic times ("2m ago", "1h ago", "3h ago") that rotate with the data.

### Database Migration

```sql
CREATE OR REPLACE FUNCTION public.get_landing_page_profiles()
RETURNS TABLE (
  first_name text,
  avatar_url text,
  city text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    split_part(name, ' ', 1) as first_name,
    avatar_url,
    city
  FROM public.profiles
  WHERE deleted_at IS NULL
    AND avatar_url IS NOT NULL
    AND city IS NOT NULL
    AND name IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 12;
$$;
```

### Files to Change

| File | Action |
|------|--------|
| `src/components/home/hero/SocialProofCards.tsx` | Replace entirely with `RealStudentGrid.tsx` |
| `src/components/home/hero/RealStudentGrid.tsx` | New component fetching real profiles from the DB function |
| `src/components/home/hero/AnimatedCityHeadline.tsx` | Update headline copy |
| `src/components/home/hero/RotatingNotification.tsx` | Vary timestamps |
| `src/components/home/HeroSection.tsx` | Remove ShareButton, swap SocialProofCards for RealStudentGrid |

### Technical Details

- The `get_landing_page_profiles` function uses `SECURITY DEFINER` to bypass RLS, so unauthenticated landing page visitors see real student data.
- Only exposes first name, avatar URL, and city. No IDs, emails, or sensitive data.
- The `RealStudentGrid` component calls `supabase.rpc('get_landing_page_profiles')` on mount, with a hardcoded fallback array if the query fails (so the page never looks empty).
- Students are grouped by city using a simple `reduce`, then rendered as city sections with avatar thumbnails.

