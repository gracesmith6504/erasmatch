-- Move welcome email from profile INSERT to onboarding completion.
-- This lets us personalize the email with the student's destination city.

-- Drop the old INSERT trigger
DROP TRIGGER IF EXISTS on_profile_created_send_welcome_email ON profiles;

-- Replace the trigger function to pass city data
CREATE OR REPLACE FUNCTION public.trigger_send_welcome_email()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  payload jsonb;
  service_key text;
BEGIN
  -- Only fire when onboarding_complete flips from false/null to true
  IF NEW.onboarding_complete = true
     AND (OLD.onboarding_complete IS NULL OR OLD.onboarding_complete = false)
     AND NEW.email IS NOT NULL
  THEN
    -- Get service role key from vault
    SELECT decrypted_secret INTO service_key
    FROM vault.decrypted_secrets
    WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
    LIMIT 1;

    payload := jsonb_build_object(
      'record', jsonb_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'name', NEW.name,
        'city', NEW.city
      )
    );

    PERFORM net.http_post(
      url := 'https://ceoflcktscennfmmdrvp.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := payload
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create new UPDATE trigger that fires when onboarding completes
CREATE TRIGGER on_onboarding_complete_send_welcome_email
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_welcome_email();
