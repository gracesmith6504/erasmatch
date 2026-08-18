-- Drop duplicate trigger that was sending two welcome emails per signup.
-- Keeps on_profile_created_send_welcome_email, removes on_profile_created.
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
