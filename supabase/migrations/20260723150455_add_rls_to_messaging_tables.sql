-- ============================================================
-- Add Row Level Security to messaging tables
-- Tables: messages, group_messages, city_messages
-- (city_forums and city_comments tables no longer exist)
-- ============================================================

-- ============================================================
-- 1. MESSAGES (private direct messages)
-- ============================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can send messages as themselves"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Admins can update messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (
    auth.uid() = sender_id
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================================
-- 2. GROUP_MESSAGES (university group chats — visible to all)
-- ============================================================
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read group messages"
  ON public.group_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can send group messages as themselves"
  ON public.group_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete own group messages"
  ON public.group_messages FOR DELETE
  TO authenticated
  USING (
    auth.uid() = sender_id
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================================
-- 3. CITY_MESSAGES (city chats — visible to all)
-- ============================================================
ALTER TABLE public.city_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read city messages"
  ON public.city_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can send city messages as themselves"
  ON public.city_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete own city messages"
  ON public.city_messages FOR DELETE
  TO authenticated
  USING (
    auth.uid() = sender_id
    OR public.has_role(auth.uid(), 'admin')
  );
