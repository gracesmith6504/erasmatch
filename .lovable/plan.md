The plan looks good to me with those fixes applied. Here's the final version:

---

## City Payoff Interstitial + "People You Should Meet"

### Files to create

`src/components/onboarding/CityPayoff.tsx` Full-screen interstitial shown after `CompletionCelebration` completes, before navigating to `/students`.

- Queries `profiles` filtered by `city`, excludes current user, `deleted_at` is null, orders by `avatar_url` not null first, limit 3 for display
- Gets total count separately (or from the same query — count all, display 3)
- Headline: `"X students are already going to [city] 🎉"` where X is total count
- Shows up to 3 avatar bubbles in a row using the existing `Avatar` component
- Zero-match fallback: `"You're the first one heading to [city]! More students are joining every day."`
- CTA: `"Meet them →"` (or `"Explore students →"` if zero matches) — navigates to `/students?from=onboarding`
- Auto-advances after **6 seconds** if matches exist, **4 seconds** if zero matches
- Framer Motion fade-in consistent with `CompletionCelebration` style

`src/components/student/PeopleToMeet.tsx` Scored recommendation section shown at the top of `/students`.

- Props: `profiles`, `currentUserId`, `currentProfile`
- Scoring per candidate: same city +10 · same university +8 · same semester +6 · each shared personality tag +3 · has avatar +2
- Exclusion set: query `messages` where `sender_id = currentUserId OR receiver_id = currentUserId`, collect all unique partner IDs from both columns — exclude anyone in that set
- Use `useQuery(['messaged-users', currentUserId])` with a stable key, not a bare `useEffect`
- Take top 5 by score
- Layout: horizontally scrollable row on mobile (`overflow-x-auto flex gap-3`), `grid grid-cols-5` on desktop
- Use `StudentAvatar` + `StudentInfo` + `PersonalityTags` directly instead of the full `StudentCard` — avoids grid layout conflicts
- Each card has a `"Say hi"` button that opens `ConnectModal` with `initialNote` pre-filled: `"Hey [name]! I saw we're both going to [city] — are you excited yet? 😄"` (trimmed to stay safely under 100 chars)
- Dismissible via X button — persists to `localStorage` (not `sessionStorage`) so it survives new browser sessions
- Only re-appears if the user clears storage or a new higher-scored candidate appears (optional, can be a v2 concern)

---

### Files to modify

`src/components/onboarding/OnboardingFlow.tsx`

- Add `showCityPayoff: boolean` state, initially false
- In `handleCelebrationComplete`, instead of navigating to `/students`, set `showCityPayoff = true`
- Render `<CityPayoff>` when `showCityPayoff` is true, passing `city` and `userId`
- `CityPayoff.onComplete` navigates to `/students?from=onboarding`

`src/pages/Students.tsx`

- Remove `SuggestedStudents` import and usage entirely
- Add `PeopleToMeet` in its place
- Show condition: URL has `?from=onboarding` **OR** current profile has both `city` and `university` set — not just the onboarding path

`src/components/student/ConnectModal.tsx`

- Add optional `initialNote?: string` prop
- Initialize the note state with `initialNote ?? ''` instead of `''`
- Keep the 100-char hard limit — the pre-filled template is short enough if you trim it

`src/components/student/card/StudentCardActions.tsx`

- Add optional `initialNote?: string` prop
- Pass it through to `ConnectModal`

---

### What's explicitly out of scope

- No new database tables or migrations
- No changes to the messages page, chat UI, or message delivery
- No accept/reject connection flow
- `SuggestedStudents.tsx` can be deleted once `PeopleToMeet` is confirmed working