

## Plan: SEO City Landing Pages for Top 10 Erasmus Destinations

### Approach: Hybrid (hardcoded content + live data where it looks good)

Based on the database check, your numbers are decent for the top cities (Barcelona 24, Budapest 24, Lisbon 23) but thin for others (Amsterdam 7, Rome 7). The plan uses **hardcoded city descriptions and FAQs** for SEO content, with **live university lists** (always solid) and **conditional student counts** (shown only when >= 5).

### What gets built

**1. City data file** (`src/data/cityLandingData.ts`)
- Static content for 10 cities: Barcelona, Lisbon, Milan, Prague, Budapest, Amsterdam, Madrid, Rome, Paris, Berlin
- Each city has: slug, display name, country, hero tagline, short description, emoji flag, 3-4 FAQ items (SEO-rich), and a hero image URL (from Unsplash or similar free source)

**2. City landing page component** (`src/pages/CityLanding.tsx`)
- Route: `/erasmus/:citySlug`
- Sets document title and meta description dynamically for SEO (e.g., "Erasmus in Barcelona 2025 - Meet Students | ErasMatch")
- Sections:
  - **Hero**: City name, country, tagline, gradient background, CTA "Join students in {city}"
  - **Stats strip**: Live university count from DB, conditional student count (shows "X+ students heading here" if >= 5, otherwise "Students joining soon")
  - **Universities list**: Live query of universities in that city, each linking to the existing UniversityHub page
  - **FAQ accordion**: 3-4 hardcoded Q&As targeting search queries like "Is Barcelona good for Erasmus?", "How much does it cost to live in Barcelona?"
  - **CTA section**: "Join ErasMatch" button linking to `/auth?mode=signup`

**3. Data hook** (`src/hooks/useCityLandingData.ts`)
- Queries `universities` table filtered by city name
- Queries `profiles` table for count of students with that city (simple count, no personal data exposed)
- Uses the existing `supabase` client; no RLS changes needed since universities are public-read and profiles count can use a new security-definer RPC

**4. Database: New RPC function** (migration)
- `get_city_stats(city_name text)` — returns `{ student_count, university_count }` as a security-definer function so unauthenticated visitors can see aggregate counts without accessing profiles directly

**5. Route + sitemap updates**
- Add `/erasmus/:citySlug` route in `AppRoutes.tsx` (public, no auth required)
- Add all 10 city URLs to `sitemap.xml`

### What it will NOT do
- No individual student cards or personal data on these pages (privacy + thin numbers)
- No forum integration on these pages (keeps them focused for SEO)

### Technical details

Files created/modified:
- `src/data/cityLandingData.ts` (new)
- `src/pages/CityLanding.tsx` (new)
- `src/hooks/useCityLandingData.ts` (new)
- `src/components/routing/AppRoutes.tsx` (add route)
- `public/sitemap.xml` (add 10 URLs)
- Migration: new `get_city_stats` RPC function

