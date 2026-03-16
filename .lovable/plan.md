

## Problem Analysis

Two interrelated issues are causing student drop-off and broken features:

### Issue 1: Missing Universities
- 279 universities in the database, but students type names that don't match (e.g. "Exeter University" vs the DB name, or universities simply not listed)
- Manual entry exists but many users miss it
- Manually added universities get inserted with no city/country data

### Issue 2: City Lookup Fails
- The destination university step does `.eq("name", value)` to look up the city (exact string match)
- When a student manually enters a university or the name differs slightly, city comes back null
- 66 profiles have a university set but no city, and some of those DO have a matching university in the DB with a city (e.g. "Mälardalens University" has city "Västerås" in the DB but the profile has no city)
- The city is critical: it drives the Cities view, city group chats, and city-based filtering

### Current Data
- 503 active profiles, 381 with a university, but only 315 with a city
- That means ~66 students are invisible in city-based features

---

## Solution Options

### Option A: External University API (e.g. Hipo Universities API)
Replace the static DB-backed dropdown with a live API call to a comprehensive university database.

**Pros:** Covers virtually every university worldwide. Always up to date.
**Cons:** Adds an external dependency. Free APIs (like Hipo) have no city data or inconsistent city data. Paid APIs add cost. Latency on every keystroke. Doesn't solve the city problem since these APIs often lack city fields or have inconsistent formatting.

### Option B: Hybrid - Keep DB + Free-text with Smart City Resolution
Keep the current dropdown with the auto-add feature, but fix the city gap by:
1. Adding a city input field to the destination step so students explicitly provide their city
2. When selecting from the dropdown, auto-fill city from the DB
3. When manually entering, let the student type the city too
4. Backfill existing profiles that have a university but no city

**Pros:** No external dependency. Solves both problems. Simple to implement. Works for all edge cases.
**Cons:** Asks one more question during onboarding.

### Option C: Google Places Autocomplete API
Use Google's Places API for university search with built-in city/country data.

**Pros:** Most comprehensive and accurate. Returns structured city/country automatically.
**Cons:** Requires API key and billing. Cost scales with usage. Over-engineered for this use case.

### Option D: Improve matching + background enrichment
Use fuzzy matching (Levenshtein distance) to match typed names to existing universities, and build an admin tool to enrich manually-added universities with city/country.

**Pros:** Improves match rates without changing UX.
**Cons:** Fuzzy matching can produce wrong matches. Admin enrichment is manual and doesn't scale. Doesn't help the student who types a university not in the DB at all.

---

## Recommended Approach: Option B (Hybrid)

This is the simplest fix that solves both problems without adding external dependencies or cost.

### Changes

**1. Add explicit city input to the Destination University step**
- When a user selects a university from the dropdown, auto-fill the city from the universities table (existing behavior, but now shown in an editable field)
- When the city lookup returns null (manual entry or missing data), show an empty city text input and let the student type their destination city
- The city field is always visible and editable, so students can correct wrong values

**2. Fix the manual entry flow to include city**
- When a student clicks "Can't find your university?" and enters manually, show a second input for city
- When saving via `autoAddUniversity`, also pass the city so the DB entry gets created with city data
- This enriches the DB for future students

**3. Backfill existing profiles**
- Run a one-time SQL update to set `profiles.city` from `universities.city` where the profile has a university but no city and a match exists in the universities table
- This fixes the ~6 profiles where the data exists but was never written to the profile

**4. Cache invalidation**
- After a manual university is added, clear the in-memory universities cache so it appears immediately in the dropdown

### Files to modify
- `src/components/onboarding/steps/DestinationUniversityStep.tsx` - Add editable city input field
- `src/components/UniversityAutocomplete.tsx` - Optionally expose city alongside university selection
- `src/components/university/ManualUniversityEntry.tsx` - Add city input field
- `src/components/university/useAutoAddUniversity.ts` - Accept and insert city parameter
- `src/components/profile/ProfileFormFields.tsx` - Ensure city is editable in profile settings too
- One migration to backfill existing profiles with missing cities

### Impact on existing users
- No breaking changes. Existing profiles with city data are unaffected.
- Profiles missing city data get backfilled where possible.
- The onboarding step gets one additional (auto-filled) field.

