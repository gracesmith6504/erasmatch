

## Connect Button Feature Plan

### Summary

Replace the current "Message" button on student cards (and profile views) with a "Connect" button that opens a small modal requiring a short note (max 100 chars). That note gets sent as a regular DM using the existing messaging infrastructure. No new database tables needed.

### What Changes

**1. New Component: ConnectModal**
- File: `src/components/student/ConnectModal.tsx`
- A dialog with a text input (100 char max, mandatory), character counter, and Send button
- Accepts `studentId`, `studentName`, and optional context props (shared city/university) for placeholder hints
- Uses the existing `useSendMessage` hook to send the note as a normal DM
- On success: toast confirmation, close modal, optionally navigate to the chat

**2. Update StudentCardActions**
- File: `src/components/student/card/StudentCardActions.tsx`
- Replace the "Message" button with a "Connect" button (use `UserPlus` icon instead of `Mail`)
- Clicking opens the ConnectModal instead of navigating to `/messages?user=`
- Keep the "Profile" button unchanged

**3. Update ProfileView page**
- File: `src/pages/ProfileView.tsx` (and `src/components/profile/view/ProfileHeader.tsx`)
- The "Send Message" action on another user's profile should also use the ConnectModal for first contact
- If a conversation already exists (check via `useDirectMessages`), show "Message" and navigate to chat directly instead

**4. Personalized placeholder hints**
- Reuse the logic from `SuggestedPrompts.tsx` (shared city/university detection) to show a placeholder like *"e.g. Also heading to Barcelona in Sept!"* inside the ConnectModal input
- Keep it as placeholder text only, not pre-filled — user must type their own note

### Technical Details

- **No new tables or migrations.** The connect note is inserted into the existing `messages` table as a regular DM.
- **No new edge functions.** The existing `send-message-notification` function and in-app notification flow handle the notification automatically via `useSendMessage`.
- **ConnectModal** uses `Dialog` from `@/components/ui/dialog`, `Input` from `@/components/ui/input`, and `Button` from `@/components/ui/button`.
- Character limit enforced with `maxLength={100}` and a visible counter.
- Send button disabled when input is empty or whitespace-only.
- After sending, the modal closes and a toast confirms *"Connect request sent!"*

### Files to Create
- `src/components/student/ConnectModal.tsx`

### Files to Modify
- `src/components/student/card/StudentCardActions.tsx` — swap Message → Connect button, wire modal
- `src/pages/ProfileView.tsx` — add Connect flow for first-time contact
- `src/components/profile/view/ProfileHeader.tsx` — add Connect button for non-own profiles

### What This Does NOT Change
- No mutual matching or accept/reject flow
- No new connections table or friends list
- No changes to the Messages page, chat UI, or message delivery
- The suggested prompts inside existing chats remain untouched

