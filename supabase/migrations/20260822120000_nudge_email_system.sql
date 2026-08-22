-- Nudge email system: sends a reminder email when a direct message goes
-- unread for 48 hours.  Only messages created AFTER this migration is
-- applied are eligible — every existing message is grandfathered out.
--
-- Architecture:
--   1. nudge_config        — single-row settings (delay, cooldown, activation ts)
--   2. message_nudge_log   — audit trail of nudged messages (prevents re-nudging)
--   3. find_pending_nudges — Postgres function encapsulating the query
--   4. pg_cron job         — calls send-nudge-email Edge Function every hour

-- ══════════════════════════════════════════════════════════════════════
-- 1. Enable pg_cron (pg_net is already installed)
-- ══════════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- ══════════════════════════════════════════════════════════════════════
-- 2. Configuration table (single row)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.nudge_config (
  id         int          PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  activated_at  timestamptz NOT NULL DEFAULT now(),
  enabled       boolean     NOT NULL DEFAULT true,
  delay_hours   int         NOT NULL DEFAULT 48,
  cooldown_hours int        NOT NULL DEFAULT 24,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.nudge_config IS 'Single-row config for the unread-message nudge email system.';
COMMENT ON COLUMN public.nudge_config.activated_at IS 'Only messages created after this timestamp are eligible for nudging.';
COMMENT ON COLUMN public.nudge_config.delay_hours IS 'Hours an unread message must age before triggering a nudge (default 48).';
COMMENT ON COLUMN public.nudge_config.cooldown_hours IS 'Minimum hours between nudge emails to the same receiver (default 24).';

INSERT INTO public.nudge_config (activated_at)
VALUES (now())
ON CONFLICT (id) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════
-- 3. Nudge log — one row per message included in a nudge email
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.message_nudge_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_id uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_id  uuid        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  sent_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nudge_per_message UNIQUE (message_id)
);

CREATE INDEX IF NOT EXISTS idx_nudge_log_receiver_sent
  ON public.message_nudge_log (receiver_id, sent_at DESC);

COMMENT ON TABLE public.message_nudge_log IS 'Audit trail of nudge emails sent for unread messages.';

-- ══════════════════════════════════════════════════════════════════════
-- 4. RLS — service-role only, no user-facing policies
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE public.nudge_config      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_nudge_log ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════════════
-- 5. find_pending_nudges() — returns receivers who need a nudge email
-- ══════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.find_pending_nudges()
RETURNS TABLE (
  receiver_id    uuid,
  receiver_email text,
  receiver_name  text,
  unread_count   bigint,
  sender_names   text[],
  message_ids    uuid[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH config AS (
    SELECT activated_at, delay_hours, cooldown_hours
    FROM nudge_config
    WHERE id = 1 AND enabled = true
  ),
  eligible AS (
    SELECT m.id, m.receiver_id, m.sender_id
    FROM messages m
    CROSS JOIN config c
    WHERE
      -- Only messages created after the system was activated
      m.created_at > c.activated_at
      -- Message has aged past the delay threshold
      AND m.created_at < now() - make_interval(hours => c.delay_hours)
      -- Not a self-message
      AND m.sender_id != m.receiver_id
      -- Receiver hasn't read it (read_by is text[])
      AND (m.read_by IS NULL OR NOT (m.receiver_id::text = ANY(m.read_by)))
      -- Not already nudged about this specific message
      AND NOT EXISTS (
        SELECT 1 FROM message_nudge_log mnl WHERE mnl.message_id = m.id
      )
      -- Receiver account is alive
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = m.receiver_id AND p.deleted_at IS NULL
      )
      -- Sender account is alive (don't nudge about messages from deleted users)
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = m.sender_id AND p.deleted_at IS NULL
      )
      -- Receiver hasn't been nudged within the cooldown window
      AND NOT EXISTS (
        SELECT 1 FROM message_nudge_log mnl
        WHERE mnl.receiver_id = m.receiver_id
          AND mnl.sent_at > now() - make_interval(hours => c.cooldown_hours)
      )
  )
  SELECT
    e.receiver_id,
    recv.email        AS receiver_email,
    COALESCE(recv.name, 'there') AS receiver_name,
    count(*)::bigint  AS unread_count,
    array_agg(DISTINCT COALESCE(sender.name, 'Someone')) AS sender_names,
    array_agg(e.id)   AS message_ids
  FROM eligible e
  JOIN profiles recv   ON recv.id = e.receiver_id
  JOIN profiles sender ON sender.id = e.sender_id
  WHERE recv.email IS NOT NULL
  GROUP BY e.receiver_id, recv.email, recv.name;
$$;

COMMENT ON FUNCTION public.find_pending_nudges IS
  'Returns users who have unread DMs older than delay_hours and have not been nudged within cooldown_hours.';

-- ══════════════════════════════════════════════════════════════════════
-- 6. pg_cron job — fires every hour at minute :05
-- ══════════════════════════════════════════════════════════════════════
SELECT cron.schedule(
  'nudge-unread-messages',
  '5 * * * *',
  $$
  SELECT net.http_post(
    url    := 'https://ceoflcktscennfmmdrvp.supabase.co/functions/v1/send-nudge-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
        LIMIT 1
      )
    ),
    body   := '{}'::jsonb
  );
  $$
);
