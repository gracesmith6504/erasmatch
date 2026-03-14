CREATE TABLE public.email_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id text NOT NULL,
  receiver_id text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.email_notification_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_email_notification_log_lookup 
  ON public.email_notification_log (sender_id, receiver_id, sent_at DESC);