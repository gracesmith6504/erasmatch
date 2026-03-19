

# Block & Report User Feature

## Overview
Add the ability for users to block (and optionally report) other users. Blocked users are silently hidden — they cannot message you, see your profile, or appear in your student list.

## Database Changes

**New table: `blocked_users`**
- `id` (uuid, PK, default gen_random_uuid())
- `blocker_id` (uuid, NOT NULL) — the user who blocks
- `blocked_id` (uuid, NOT NULL) — the user being blocked
- `reason` (text, nullable) — optional report reason
- `reported` (boolean, default false) — flags "Block & Report"
- `created_at` (timestamptz, default now())
- Unique constraint on (blocker_id, blocked_id)

**RLS policies:**
- SELECT: authenticated, `auth.uid() = blocker_id`
- INSERT: authenticated, `auth.uid() = blocker_id`
- DELETE: authenticated, `auth.uid() = blocker_id` (for unblocking)
- Admins can SELECT all (for reviewing reports): `has_role(auth.uid(), 'admin')`

## New Hook: `useBlockedUsers`

Central hook (`src/hooks/useBlockedUsers.ts`) that:
- Fetches the current user's blocked list on mount
- Exposes `blockedIds: string[]`, `blockUser(id, reason?, reported?)`, `unblockUser(id)`, `isBlocked(id): boolean`
- Provides a helper `isBlockedByOrBlocking(id)` that checks bidirectional blocks via a security-definer function

**Security-definer function: `is_blocked(user_a, user_b)`**
Returns true if either user has blocked the other. Used in RLS policies and client-side filtering without exposing who blocked whom.

## Where Blocking is Enforced

### 1. Student List (`useStudentsData.ts`)
- Filter out profiles where `blockedIds.includes(profile.id)` from `filteredProfiles`

### 2. Profile View (`ProfileView.tsx`)
- If the viewed user has blocked the current user (check via `is_blocked` function), show "Profile not available" instead of profile content
- Add a "Block User" / "Block & Report" dropdown menu to the profile page (only for non-own profiles)

### 3. Direct Messages
- **Sending blocked** (`DataContext.tsx` / `handleSendMessage`): Before sending, check if either party has blocked the other. Show toast error if blocked.
- **Thread list** (`ThreadsList.tsx` / `MessagesContainer.tsx`): Filter out threads with blocked users from the visible list
- **Message header** (`MessageHeader.tsx`): Add a kebab menu (⋮) with "Block User" / "Block & Report" option

### 4. Profile View Page (`ProfileView.tsx`)
- Add dropdown with block/report option next to the "Send Message" button

## UI Components

### `BlockUserDialog` (`src/components/block/BlockUserDialog.tsx`)
- Confirmation dialog with two options:
  - "Block" — silently blocks, no report
  - "Block & Report" — blocks + sets `reported = true`, shows optional text field for reason
- Used from both profile view and message header

### Profile View additions
- Add a `MoreVertical` (kebab) icon button that opens a dropdown with "Block User" option
- When blocked, replace profile content with a neutral "This profile is not available" message

### Message Header additions
- Add kebab menu to `MessageHeader.tsx` with "Block User" option
- After blocking from messages, navigate back to thread list and remove the thread

## File Changes Summary

| File | Change |
|------|--------|
| `supabase/migrations/` | New migration: create `blocked_users` table, RLS, `is_blocked` function |
| `src/hooks/useBlockedUsers.ts` | New hook for block state management |
| `src/components/block/BlockUserDialog.tsx` | New confirmation/report dialog |
| `src/hooks/useStudentsData.ts` | Filter blocked users from results |
| `src/pages/ProfileView.tsx` | Add block option, show "not available" if blocked |
| `src/components/messages/MessageHeader.tsx` | Add kebab menu with block option |
| `src/components/messages/MessagesContainer.tsx` | Filter blocked threads |
| `src/contexts/DataContext.tsx` | Guard `handleSendMessage` against blocked users |
| `src/integrations/supabase/types.ts` | Auto-updated by Supabase after migration |

