-- Server-side affiliate click tracking.
-- Records every outbound partner click regardless of ad blockers or
-- cookie consent, because the click routes through our edge function
-- before redirecting to the partner.

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  partner text NOT NULL,
  placement text NOT NULL,
  city text,
  category text,
  campaign text,
  destination_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for common queries: clicks per partner, per city, per day
CREATE INDEX idx_affiliate_clicks_partner_created
  ON public.affiliate_clicks (partner, created_at DESC);

CREATE INDEX idx_affiliate_clicks_city_created
  ON public.affiliate_clicks (city, created_at DESC)
  WHERE city IS NOT NULL;

-- RLS: users can insert their own clicks, only service role can read all
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY affiliate_clicks_insert ON public.affiliate_clicks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY affiliate_clicks_select_service ON public.affiliate_clicks
  FOR SELECT TO service_role
  USING (true);
