
-- Create a function to handle new messages
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- We'll handle email notifications via the application instead of directly from the trigger
  -- This removes the dependency on net.http_post which isn't available
  RETURN NEW;
END;
$$;

-- Create trigger that fires after inserting a new message
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message();
