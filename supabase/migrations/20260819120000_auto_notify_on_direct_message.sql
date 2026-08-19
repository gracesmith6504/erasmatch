-- Move DM notifications server-side: a database trigger creates the
-- in-app notification whenever a new direct message is inserted,
-- instead of relying on the sender's browser to do it.

CREATE OR REPLACE FUNCTION public.notify_on_direct_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sender_name text;
BEGIN
  -- Don't notify yourself
  IF NEW.sender_id = NEW.receiver_id THEN
    RETURN NEW;
  END IF;

  -- Look up sender name for the notification body
  SELECT COALESCE(name, 'Someone')
    INTO _sender_name
    FROM profiles
   WHERE id = NEW.sender_id;

  INSERT INTO notifications (user_id, type, actor_id, reference_id, title, body)
  VALUES (
    NEW.receiver_id,
    'direct_message',
    NEW.sender_id,
    NEW.id::text,
    'New message',
    _sender_name || ' sent you a message'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_direct_message_notify
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_direct_message();
