
-- Create university_aliases table for abbreviations and alternate names
CREATE TABLE public.university_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id integer NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  alias text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(alias)
);

-- Enable RLS
ALTER TABLE public.university_aliases ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read aliases" ON public.university_aliases
  FOR SELECT TO public USING (true);

-- Admins can manage aliases
CREATE POLICY "Admins can insert aliases" ON public.university_aliases
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update aliases" ON public.university_aliases
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete aliases" ON public.university_aliases
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for fast lookups
CREATE INDEX idx_university_aliases_alias ON public.university_aliases (LOWER(alias));
CREATE INDEX idx_university_aliases_university_id ON public.university_aliases (university_id);

-- Seed with common abbreviations and alternate names
INSERT INTO public.university_aliases (university_id, alias) VALUES
  -- Ireland
  (48, 'UCD'), (15, 'TCD'), (143, 'DCU'), (147, 'TUD'), (147, 'TU Dublin'),
  (142, 'NUIG'), (142, 'NUI Galway'), (144, 'UCC'), (146, 'MU'),
  -- UK
  (310, 'UCL'), (244, 'KCL'), (244, 'King''s College'), (136, 'UoE'),
  (1, 'Oxon'), (243, 'GU'),
  -- Hungary
  (197, 'ELTE'), (216, 'Corvinus'), (216, 'BCE'),
  (215, 'BME'), (215, 'Műegyetem'),
  -- Italy
  (233, 'Polimi'), (233, 'PoliMi'), (151, 'UniBo'), (151, 'UNIBO'),
  (232, 'La Sapienza'), (33, 'Bocconi'), (33, 'SDA Bocconi'),
  (341, 'UniFi'),
  -- Germany
  (158, 'LMU'), (4, 'TUM'), (135, 'RWTH'), (349, 'FU Berlin'),
  (240, 'HU Berlin'), (241, 'Uni Heidelberg'),
  -- Netherlands
  (35, 'EUR'), (5, 'UvA'), (159, 'KUL'),
  -- France
  (97, 'Sciences Po'), (3, 'Sorbonne'),
  -- Spain
  (6, 'UB'), (224, 'UPF'), (39, 'UAB'),
  (45, 'UCM'), (45, 'Complutense'), (44, 'UC3M'), (44, 'Carlos III'),
  -- Portugal
  (220, 'NOVA'), (219, 'ULisboa'), (222, 'ISCTE'),
  (221, 'UCP'), (221, 'Católica'),
  -- Switzerland
  (2, 'ETH'), (2, 'ETHZ'),
  -- Scandinavia
  (7, 'KU'), (7, 'UCPH'), (10, 'HY'), (130, 'LU'),
  (212, 'NTNU'),
  -- Poland
  (90, 'UJ'), (36, 'UEK'), (36, 'CUE'),
  -- Czech Republic
  (211, 'CUNI'), (211, 'Karlova'),
  -- Belgium
  (201, 'UGent');
