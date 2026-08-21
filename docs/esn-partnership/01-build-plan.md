# ErasMatch × ESN — Concrete Build Plan

_Date: 2026-08-21. Target: land 3–5 ESN local sections this semester._
_Companion doc: `00-esn-research.md` (why these choices)._

---

## 0. The strategy in one paragraph

The research says the wedge is **pre-arrival community + killing repeated questions**, sold to a
**single section president** as **free / zero-data / zero-setup**, and the install path is **"one smart
link in your Instagram bio."** Welcome Week is ~2–6 weeks away, so the true MVP must ship in **days** and
**we configure everything** — no volunteer touches a CMS. The great news: ErasMatch already contains
~70% of the primitives. We are mostly **recombining existing systems**, not building new ones.

### What we reuse (already in the repo)

| ESN need | Existing primitive | Where |
|---|---|---|
| Section-branded invite link + signup attribution | `ref_code` / `invited_by` / `?ref=` capture / `get_referrer_profile` / `ReferralBanner` | `pages/Auth.tsx`, `contexts/auth/authUtils.ts`, `components/auth/GoogleAuthHandler.tsx`, `components/home/ReferralBanner.tsx` |
| A branded destination page with live stats | `/erasmus/:citySlug` = static `cityLandingData.ts` + live `useCityLandingData` (`get_city_stats`, avatars, unis) | `pages/CityLanding.tsx`, `data/cityLandingData.ts`, `hooks/useCityLandingData.ts` |
| City-guide practical cards | `ESimRecommendation` (reusable affiliate card) + unused `universities.accommodation_info` / `erasmus_tips` / `links` | `components/esim/ESimRecommendation.tsx` |
| Click/partner attribution | `track-click` edge fn + `affiliate_clicks` + `useOutboundLink({campaign})` | `supabase/functions/track-click`, `lib/analytics.ts` |
| Admin-gated area + roles | `/admin/universities` + `user_roles` + `useIsAdmin`/`has_role` | `pages/AdminUniversities.tsx`, `hooks/useIsAdmin.ts` |
| "Who's incoming, my city, Fall 2026" | `profiles.city` + `arrival_date` + `semester` + `looking_for` | schema |
| Invite kit (copy link, share) | `InviteFriendModal` / `ShareModal` / `ShareButton` | `components/share/*` |
| Data-privacy story | `privacy_consent_at` + `export-user-data` + `delete-account` edge fns | `supabase/functions/*` |

**Design principle inherited from the codebase:** ErasMatch already does **static-first, then dynamic**
(20 cities live in `cityLandingData.ts`, not a table). We do the same for sections — seed the 3–5 pilots
in a static config, ship the public experience in days, and only move to DB tables + a self-serve
dashboard once sections are converting.

---

## Phase 0 — Ship in days (the real MVP for pilots)

**Goal:** hand a section president one link for their Instagram bio, and start attributing signups to
their section. 100% founder-configured. No new admin UI. No DB migration required to go live.

### 0.1 Static section config (mirror `cityLandingData.ts`)

**Create `src/data/sectionData.ts`:**

```ts
export interface SectionInfo {
  slug: string;               // "esn-lisboa"  -> /esn/esn-lisboa  &  ?section=esn-lisboa
  name: string;               // "ESN Lisboa"
  city: string;               // "Lisbon"  (must match profiles.city / universities.city)
  country: string;
  flag: string;               // "🇵🇹"
  universities: string[];     // one city can have several sections/unis (Barcelona reality)
  accentColor?: string;       // section's own brand colour (NOT ESN International)
  logoUrl?: string;           // section's own logo in /public (respect ESN logo rules)
  tagline: string;
  intro: string;
  welcomeWeek?: { start: string; end: string; scheduleUrl?: string };
  links: {                    // interoperate, don't replace
    instagram?: string;
    website?: string;
    whatsapp?: string;        // their per-semester incoming WhatsApp/Telegram group
    telegram?: string;
    buddyProgram?: string;    // deep-link to BuddySystem / Papaya / Broaddy / their form
    esncard?: string;
  };
  events?: { title: string; date: string; location?: string; url?: string }[]; // seeded by us for MVP
}

export const sectionData: SectionInfo[] = [ /* 3–5 pilots, filled with the president */ ];
export const getSectionBySlug = (slug: string) => sectionData.find(s => s.slug === slug);
```

Reason for static: zero infra to ship, and the pilot content (welcome-week dates, their WhatsApp link,
a handful of events) is small and we're entering it _with_ the president on the onboarding call anyway.

### 0.2 Public section page

**Create `src/pages/SectionLanding.tsx`** (clone the structure of `CityLanding.tsx`):

- `useParams<{ sectionSlug }>()` → `getSectionBySlug`; `<Navigate to="/students">` if unknown.
- **Branded hero:** section logo + `accentColor`, `flag country`, welcome-week countdown chip, tagline.
- **Live social proof:** reuse `useCityLandingData(section.city)` for `studentCount` / avatars →
  _"37 students already joined for Lisbon this semester."_ (No new backend needed.)
- **Primary CTA** → `/auth?mode=signup&section={slug}` — _"Meet your people before you land."_
  For logged-in users → `/students?city={city}`.
- **City guide** (`<CityGuide city=.. country=.. />`, see 0.4) — SIM/transport/housing/registration.
- **Their channels:** Instagram, incoming WhatsApp/Telegram, Buddy Program (deep-link — we complement,
  not replace), ESNcard. **Welcome-week schedule** link + seeded `events`.
- **SEO block** (reuse `SEO` + JSON-LD `CollectionPage` + `Event`) → the page also ranks for
  _"ESN Lisboa incoming students / Erasmus Lisbon"_, a bonus acquisition channel.

**Create `src/components/section/`:** `SectionHero.tsx`, `SectionChannels.tsx`, `SectionEvents.tsx`
(+ `EventCard.tsx`). Keep them dumb/presentational, fed by `SectionInfo`.

### 0.3 Signup attribution (the "tracks signups" requirement)

Reuse the referral mechanism exactly, with a parallel field. **No data export — attribution is a
server-side column set at signup, so the section sees a _count_, never a list.**

1. **Migration `add_section_attribution.sql`:**
   ```sql
   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS joined_via_section text NULL;
   CREATE INDEX IF NOT EXISTS idx_profiles_joined_via_section
     ON public.profiles (joined_via_section) WHERE joined_via_section IS NOT NULL;

   -- read-only count RPC for the section page / dashboard (no PII returned)
   CREATE OR REPLACE FUNCTION public.get_section_signup_count(_slug text)
   RETURNS integer LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
     SELECT count(*)::int FROM profiles
     WHERE joined_via_section = _slug AND deleted_at IS NULL;
   $$;
   ```
2. **`src/pages/Auth.tsx`** — alongside the existing `refCode` capture (~line 45, 76):
   `const section = searchParams.get("section");` and
   `if (section) sessionStorage.setItem("pendingSectionSlug", section);` in both the Google and
   email flows. Optionally render a **`SectionBanner`** ("ESN Lisboa invited you 🎉") mirroring
   `ReferralBanner`, fed by `getSectionBySlug` (static → no fetch needed in Phase 0).
3. **`src/contexts/auth/authUtils.ts`** (~line 43) — when creating the profile, also write
   `joined_via_section: options?.sectionSlug ?? null`.
4. **`src/components/auth/GoogleAuthHandler.tsx`** (~line 27) — apply
   `sessionStorage.getItem("pendingSectionSlug")` into `updates.joined_via_section`, same shape as
   `pendingRef`.
5. **PostHog** — capture `section_landing_viewed` / `section_cta_clicked` with `{ slug }` for a click→
   signup funnel (secondary signal; the column is the source of truth). Add `"section_landing"` to
   `OutboundPlacement` in `lib/analytics.ts` so any partner cards on the page attribute per-section via
   the existing `campaign` field.

### 0.4 City guides (kills the "repeated questions" tax)

Generalize the existing eSIM card into a reusable practical-info block, seeded static-first.

- **Refactor:** extract a generic **`src/components/guide/GuideCard.tsx`** from `ESimRecommendation`
  (icon, title, blurb, CTA, optional promo pill, `full`/`compact` variants). Re-implement
  `ESimRecommendation` as one `GuideCard` instance so nothing regresses.
- **Create `src/data/cityGuideData.ts`:** per-city ordered cards for the pilot cities:
  `sim` (→ existing Airalo card), `transport`, `housing`, `registration`, `bank`, `insurance`,
  each `{ title, body, linkUrl?, partnerSlug? }`. Seed from the sections' own survival-guide content
  (they'll happily give it — it's what they answer manually today).
- **Create `src/components/section/CityGuide.tsx`** — renders `cityGuideData[city]` as `GuideCard`s.
  Reused on both `SectionLanding` and (later) `CityLanding`.
- Where a guide item maps to an affiliate (SIM=Airalo; later housing=Uniplaces/HousingAnywhere,
  which are _already ESN-friendly brands_), route through `track-click` with
  `campaign="section_{slug}"` → **per-section revenue attribution** falls out for free.

### 0.5 Invite kit (what we actually hand the president)

**Create `src/components/section/SectionInviteKit.tsx`** (reuse `ShareModal`/`InviteFriendModal`):
copy-to-clipboard link `https://www.erasmatch.com/esn/{slug}`, a **QR code** (for print/story), and a
one-line "put this in your Instagram bio" instruction. For Phase 0 this can live on a simple
unlisted `/esn/{slug}/kit` view or just be a doc we send — the president needs the _link + QR_, nothing
more.

### 0.6 Routing

**`src/components/routing/AppRoutes.tsx`:** add
`<Route path="/esn/:sectionSlug" element={<SectionLanding />} />` (lazy, like `CityLanding`).

**Phase 0 acceptance:** a president can paste `erasmatch.com/esn/esn-lisboa` into their bio; incoming
students see a branded page with live "X joined", their WhatsApp/buddy links, and a city guide; every
signup is attributed via `joined_via_section`; we can report the count. **Zero volunteer setup, zero
data export.**

---

## Phase 1 — After first yes (weeks, as sections convert)

Move from static config to a real, but still founder-managed, backend + a **read-only** section view.

### 1.1 Tables (migration `create_sections_tables.sql`)

```sql
CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  country text, country_code text,
  university_names text[] DEFAULT '{}',
  logo_url text, accent_color text,
  tagline text, intro text,
  instagram_url text, website_url text, whatsapp_url text,
  telegram_url text, buddy_program_url text, esncard_url text,
  welcome_week_start date, welcome_week_end date, welcome_week_schedule_url text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.section_admins (            -- who manages which section
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'editor',          -- owner | editor
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section_id, user_id)
);

CREATE TABLE public.section_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title text NOT NULL, description text, location text, url text,
  starts_at timestamptz NOT NULL, ends_at timestamptz,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**RLS (mirror existing patterns):**
- `sections`, `section_events`: public `SELECT` where the section `is_published`; `INSERT/UPDATE/DELETE`
  only for a `section_admins` row of that section (helper `is_section_admin(_section_id)` SECURITY
  DEFINER, modeled on `has_role`/`is_blocked`).
- `section_admins`: readable by the user themselves + global admins; writable by global admins only
  (we assign section admins — keeps control with the founder).
- Keep `get_section_signup_count` as the **only** way section data crosses into per-section numbers —
  it returns a count, never rows, so RLS on `profiles` stays untouched and no PII leaks.

Add RPCs `get_section_by_slug(_slug)` and `get_section_stats(_slug)` (count + universities + preview
avatars, reusing `get_city_preview_avatars`). Migrate `sectionData.ts` content into the tables; the
public page reads DB with the static file as fallback.

### 1.2 Read-only section dashboard

**Route** `/esn/:sectionSlug/dashboard` (protected, `ProtectedRoute` + `useSectionAdmin(slug)` gate,
same shape as `useIsAdmin`). **Create `src/pages/SectionDashboard.tsx`** + `hooks/useSectionAdmin.ts`,
`hooks/useSectionStats.ts`. Shows:
- **Signups attributed to this section** (`get_section_signup_count`) + **incoming preview** —
  aggregate/opt-in only: counts by university, by arrival month, top `looking_for` tags. **No names,
  no export** (this is the privacy promise made literal in the UI).
- **Welcome-week countdown** + the seeded events (read-only for now).
- **Invite kit** (`SectionInviteKit`) — their link, QR, bio snippet, printable poster.
- A one-screen **"show your International Office"** summary (signups + engagement) — the artifact that
  makes the section look good to the university.

### 1.3 Onboarding nudge

**`src/components/onboarding/steps/DestinationUniversityStep.tsx`:** if `pendingSectionSlug` is set,
pre-select the section's city (and university when unambiguous) → less friction + tighter attribution.
Optional post-onboarding card: _"ESN {name}'s Welcome Week starts in 12 days — here's their schedule +
WhatsApp."_

---

## Phase 2 — Later (scale & self-serve)

Only worth building once ≥3 sections are live and asking for it:

- **Self-serve section admin CMS** — let owners edit their own info/events/guide (the Phase 1 dashboard
  becomes writable). This is what removes _us_ from the loop at scale.
- **`/esn` section directory** + search (SEO + discovery across sections; handle multi-section cities).
- **Welcome-week schedule builder** (day-by-day agenda students can save/RSVP → `section_events`).
- **Buddy-program interop**: deep-link + optional lightweight import of a section's BuddySystem/Papaya
  pairings so a matched buddy shows up inside ErasMatch chat (complement, never replace the matcher).
- **Per-section partner offers**: section-scoped guide cards via `track-click` `campaign="section_{slug}"`
  → the beginning of a revenue story that mirrors ESN's own (value through a gate, no data sold).
- **City-level umbrella pages** (`@esn_bcn` → UAB/UB/UPC/UPF) aggregating sibling sections.
- Consider migrating `CityLanding` to consume `cityGuideData`/`sections` so city + section pages share
  one content system.

---

## File-by-file checklist

**Create**
- `src/data/sectionData.ts` · `src/data/cityGuideData.ts`
- `src/pages/SectionLanding.tsx` · `src/pages/SectionDashboard.tsx` _(Phase 1)_
- `src/components/section/`: `SectionHero.tsx`, `SectionChannels.tsx`, `SectionEvents.tsx`,
  `EventCard.tsx`, `CityGuide.tsx`, `SectionInviteKit.tsx`, `SectionBanner.tsx`
- `src/components/guide/GuideCard.tsx` _(extracted from ESimRecommendation)_
- `src/hooks/useSection.ts`, `useSectionStats.ts`, `useSectionAdmin.ts` _(Phase 1)_
- Migrations: `..._add_section_attribution.sql` _(Phase 0)_, `..._create_sections_tables.sql` _(Phase 1)_

**Modify**
- `src/components/routing/AppRoutes.tsx` — add `/esn/:sectionSlug` (+ `/dashboard` in P1)
- `src/pages/Auth.tsx` — capture `?section=`, optional `SectionBanner`
- `src/contexts/auth/authUtils.ts` — persist `joined_via_section`
- `src/components/auth/GoogleAuthHandler.tsx` — apply `pendingSectionSlug`
- `src/components/esim/ESimRecommendation.tsx` — re-implement on `GuideCard`
- `src/lib/analytics.ts` — add `"section_landing"` placement + section events
- `src/components/onboarding/steps/DestinationUniversityStep.tsx` — pre-select from section _(P1)_
- `src/integrations/supabase/types.ts` — regenerate after each migration

---

## Guardrails from the research (bake into the build)

1. **Never claim "official ESN partner" or use the ESN logo.** Co-brand with the _section's own_
   logo/colour only (`logoUrl`/`accentColor`). Add a small "Not affiliated with ESN International"
   footer on section pages to stay clean.
2. **Students opt in themselves; sections never export a list.** Attribution is a count
   (`get_section_signup_count`); the dashboard shows aggregates only. This is the whole privacy pitch —
   make it literal in the UI copy.
3. **Complement, don't replace, buddy matching.** Deep-link to BuddySystem/Papaya/Broaddy; never
   position against them, especially in France/Italy/Czechia.
4. **Zero volunteer setup + effortless handover.** We configure Phase 0/1; self-serve CMS waits for
   Phase 2. Assume the board changes every year.
5. **Ship for the Welcome-Week clock.** Phase 0 is days, not weeks — a static config + one page + one
   column is enough to start pilots now.

---

## First-week concrete sequence

1. Migration `add_section_attribution.sql` (`joined_via_section` + count RPC). _(~½ day)_
2. `sectionData.ts` (1 pilot to start) + `SectionLanding.tsx` reusing `useCityLandingData`. _(1 day)_
3. Wire `?section=` capture through `Auth.tsx` → `authUtils.ts` → `GoogleAuthHandler.tsx`. _(~½ day)_
4. Extract `GuideCard` + `cityGuideData.ts` for the pilot city; drop `CityGuide` into the page. _(1 day)_
5. `SectionInviteKit` (link + QR). _(~½ day)_
6. Add the route, deploy, hand the president the link + QR. _(same day)_

→ **~3–4 working days to a live, attributable, section-branded pilot** — then repeat `sectionData.ts`
entries per new section and iterate into Phase 1 as they convert.
