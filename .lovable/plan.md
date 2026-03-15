

# Personalised Student Suggestions After Onboarding

## What we're building
A dismissable section that appears at the top of the `/students` page when `?from=onboarding` is present, showing 3-4 student cards matching the new user's destination city or university, with a headline "Students also going to [city]".

## Approach

### New component: `src/components/student/SuggestedStudents.tsx`
- Props: `profiles: Profile[]`, `currentUserId: string`, `cityName: string | null`, `universityName: string | null`, `onDismiss: () => void`
- Filters `profiles` to find others sharing the same `city` (primary) or `university` (fallback), excluding the current user
- Prioritizes profiles with avatars, takes up to 4
- Renders a styled card with heading "Students also going to [city]", dismiss X button, and a horizontal row of `StudentCard` components
- Uses `sessionStorage` key `suggestedStudentsDismissed` so it only shows once per onboarding
- If no matches found, don't render anything

### Changes to `src/pages/Students.tsx`
- Detect `from=onboarding` param (already done)
- Find the current user's profile to get their `city` and `university`
- Render `SuggestedStudents` between the `WelcomeBanner` and the page heading
- Track dismissed state; once dismissed, hide the section

### Design
- Horizontal scrollable row of 3-4 cards on mobile, grid on desktop
- Light accent background (same `bg-erasmatch-green/10` style as WelcomeBanner)
- Dismiss button top-right (X icon, same pattern as WelcomeBanner)
- No new database queries needed -- uses the already-loaded `profiles` array from props

### Technical details
- Pure client-side filtering, no additional Supabase calls
- Matching logic: filter by `city` first; if fewer than 3 results, also include `university` matches
- Sort matches: avatar holders first, then by profile completeness (reuse existing sort logic)
- `sessionStorage` for dismissal (not `localStorage`) so it reappears on next sign-up but not on page refresh during same session

