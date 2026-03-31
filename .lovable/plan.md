## Plan: Full-Page Recommended Students After Onboarding

### What changes

When `?from=onboarding` is in the URL, the `/students` page will show an expanded, full-page version of the "People you should meet" section instead of the small 5-card row. The regular student grid, filters, and tabs will be hidden until the user dismisses the recommendations or scrolls past them.

### Approach

**Modify `src/components/student/PeopleToMeet.tsx**`

- Accept a new prop `fullPage?: boolean` (true when `?from=onboarding`)
- When `fullPage` is true:
  - Increase the candidate limit from 5 to 12 (or however many score > 0)
  - Render as a full grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`) instead of a single scrollable row
  - Use larger cards with bigger avatars (h-20 w-20), more visible shared tags (show up to 3), and university info
  - Show a header: "People you should meet 👋" with subtext: "Based on your city, university, and interests"
  - Add a "Show all students →" button at the bottom that dismisses the full-page view (sets `fullPage` to false via a callback, does NOT persist to localStorage — only the X dismiss is permanent)
- When `fullPage` is false: keep current compact 5-card row behaviour unchanged

**Modify `src/pages/Students.tsx**`

- Pass `fullPage={fromOnboarding}` to `PeopleToMeet`
- Add state `showFullRecommendations` initialized to `fromOnboarding`
- When `fullPage` mode is active and not dismissed, hide the "Find Erasmus Students" heading, tabs, filters, and student grid
- When user clicks "Show all students →" in PeopleToMeet, set `showFullRecommendations` to false, revealing the normal page
- The compact PeopleToMeet row still shows at the top of the normal view (existing behaviour)

note: **Make sure the empty state is handled.** If someone signs up for a niche city with only 1 or 2 other users, the full page grid looks sad with 2 cards on it. Set a minimum threshold — if fewer than 4 scored profiles exist, skip the full page mode entirely and go straight to the normal students page with just the compact row.

**The "Show all students" button copy could be better.** "Show all students →" feels like a dismissal. Try "Browse everyone going →" — same action but frames it as exploration rather than giving up on the recommendations.

**Don't hide the header.** Hiding the "Find Erasmus Students" heading and tabs is fine, but make sure there's still enough context on screen that the user knows where they are. First time on the platform, they're still orienting.

### Technical details

- No new files, no new database queries — just UI layout changes
- The scoring logic stays the same, only `.slice(0, N)` changes based on `fullPage`
- The "Show all students" action is a callback prop (`onShowAll`) passed from Students.tsx