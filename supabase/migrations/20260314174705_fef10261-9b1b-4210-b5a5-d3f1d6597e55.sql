CREATE TABLE public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('direct', 'group', 'city')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON public.message_reactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add reactions" ON public.message_reactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions" ON public.message_reactions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_message_reactions_message ON public.message_reactions(message_id, message_type);