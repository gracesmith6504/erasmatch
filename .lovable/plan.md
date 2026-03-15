

# In-App Notification System

## Overview
Add a bell icon notification system to the navbar with real-time updates, persistent storage in Supabase, and a dropdown showing recent notifications.

## Database

**New table: `notifications`**
```sql
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,          -- 'direct_message', 'profile_view', 'city_join'
  actor_id uuid NOT NULL,      -- who triggered the notification
  reference_id text,           -- message id, profile id, or city name
  title text NOT NULL,
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can insert notifications for others
CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Index for fast lookups
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, read, created_at DESC);
```

## Notification Triggers (client-side)

Notifications are created at the point of action — no database triggers needed:

1. **Direct message** — In the message sending logic, insert a notification for the receiver after sending the message.

2. **Profile view** — In `recordProfileView()`, insert a notification for the viewed user after recording the view.

3. **City group join** — When a user first sends a city message (or joins), check if that city has < 50 members. If so, insert a notification for each existing member.

## New Files

### `src/hooks/useNotifications.ts`
- Fetches recent notifications (last 30 days, limit 50) for the current user
- Subscribes to Supabase realtime `INSERT` events on `notifications` where `user_id = currentUserId`
- Exposes: `notifications`, `unreadCount`, `markAllAsRead()`, `markAsRead(id)`
- `markAllAsRead` does a bulk `UPDATE SET read = true WHERE user_id = currentUserId AND read = false`

### `src/components/layout/navbar/NotificationBell.tsx`
- Bell icon with red badge showing `unreadCount` (same style as message badge)
- Click opens a Popover dropdown (using existing `Popover` component)
- Dropdown shows list of recent notifications, each with:
  - Actor avatar (using existing `Avatar` component)
  - Description text (e.g. "Anna sent you a message", "Marco viewed your profile", "New student joined Barcelona")
  - Relative timestamp
  - Click navigates to relevant page (`/messages`, `/profile/{actor_id}`, `/messages` with city tab)
- Opening the popover calls `markAllAsRead()`
- Empty state: "No notifications yet"

## Integration Points

### Navbar changes
- **DesktopNav**: Add `NotificationBell` next to the profile icon in the authenticated section
- **MobileBottomNav**: Add a Bell icon to the bottom nav items (via `useNavigation` adding a notifications entry), or place it in the top bar area — better to add it next to the profile icon in the floating pill to keep it clean

### Creating notifications

1. **`src/components/messages/MessageInput.tsx`** (or wherever messages are sent): After inserting a message, also insert a notification row for the receiver.

2. **`src/hooks/useProfileViewers.ts`** (`recordProfileView`): After successfully recording a view, insert a notification for the viewed user.

3. **`src/components/messages/CityInput.tsx`**: When sending the first city message, query city member count. If < 50, insert notification for each existing member in that city.

### Navigation mapping
| Type | Navigate to |
|------|------------|
| `direct_message` | `/messages` (opens thread with actor) |
| `profile_view` | `/profile/{actor_id}` |
| `city_join` | `/messages` (city tab) |

## Design Details
- Bell icon: `lucide-react` `Bell` icon
- Badge: Same red dot style as existing message badge (`bg-destructive` rounded pill)
- Dropdown: Max height ~400px with scroll, width ~350px
- Each notification row: avatar (32px) + text + time, hover highlight
- Mobile: Same popover approach, positioned from top-right

## Deduplication
- Profile views already deduplicate (24h). Notification insert happens only on new view records (not updates).
- DM notifications: one per message send, no extra dedup needed since messages are discrete events.
- City join: only triggers on first message to that city by a user.

