

## Referral Invite Prompt After First Message

### New file: `src/components/share/InviteFriendModal.tsx`

A warm, lightweight Dialog modal with:
- Headline: "Know anyone else doing Erasmus?"
- Subtext: "Send them your link — they'll see your profile first when they sign up."
- WhatsApp share button (green, opens `wa.me` URL with pre-filled text including `?ref={ref_code}`)
- Copy link button (copies `erasmatch.com/?ref={ref_code}`, shows "Copied!" for 2s)
- "maybe later" dismiss link below buttons
- All three actions (WhatsApp, copy, dismiss) set `localStorage.invitePromptSeen` and close the modal
- Props: `open`, `onOpenChange`, `refCode: string`

### Modified file: `src/components/student/ConnectModal.tsx`

After `sendMessage` succeeds (line 53-54), before closing:
1. Add state: `showInviteModal`
2. After successful send, check `localStorage.getItem('invitePromptSeen')` — if already set, close normally
3. If not set, query message count: `supabase.from('messages').select('id', { count: 'exact', head: true }).eq('sender_id', currentUserId)`
4. If count === 1, set `showInviteModal = true` instead of immediately closing the ConnectModal
5. If count > 1, close normally
6. Get `ref_code` from `useAuth().currentUserProfile.ref_code`
7. Render `<InviteFriendModal>` at the bottom of the component, controlled by `showInviteModal` state
8. When InviteFriendModal closes, also close the ConnectModal

### Technical notes
- No database changes needed — just a read query on existing `messages` table
- Uses existing `Dialog` component and `useAuth` hook
- WhatsApp URL is hardcoded with `{USER_REF_CODE}` replaced dynamically
- localStorage key `invitePromptSeen` prevents re-showing permanently

