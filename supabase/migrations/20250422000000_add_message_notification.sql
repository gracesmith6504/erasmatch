
-- Create a function to handle new messages
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result RECORD;
BEGIN
  -- Call the edge function
  SELECT * FROM net.http_post(
    url:='https://ceoflcktscennfmmdrvp.supabase.co/functions/v1/send-message-email',
    headers:=json_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlb2ZsY2t0c2Nlbm5mbW1kcnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDYyOTksImV4cCI6MjA1OTUyMjI5OX0.zopyN4ImWvZ-i6JJjjW0mCc0n3IQtAbmniQ1rstwJFQ'
    ),
    body:=json_build_object(
      'message_id', NEW.id,
      'sender_id', NEW.sender_id,
      'receiver_id', NEW.receiver_id,
      'content', NEW.content
    )::text
  ) INTO result;

  RETURN NEW;
END;
$$;

-- Create trigger that fires after inserting a new message
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message();
