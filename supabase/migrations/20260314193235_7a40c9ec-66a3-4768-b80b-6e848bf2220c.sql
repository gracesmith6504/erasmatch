
-- Create a trigger function that calls the send-welcome-email edge function
CREATE OR REPLACE FUNCTION public.trigger_send_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Only fire for brand new profiles (not re-registrations restoring deleted_at)
  IF NEW.email IS NOT NULL THEN
    payload := jsonb_build_object(
      'record', jsonb_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'name', NEW.name
      )
    );

    PERFORM net.http_post(
      url := 'https://ceoflcktscennfmmdrvp.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlb2ZsY2t0c2Nlbm5mbW1kcnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDYyOTksImV4cCI6MjA1OTUyMjI5OX0.zopyN4ImWvZ-i6JJjjW0mCc0n3IQtAbmniQ1rstwJFQ'
      ),
      body := payload
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger on INSERT only
CREATE TRIGGER on_profile_created_send_welcome_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_welcome_email();
