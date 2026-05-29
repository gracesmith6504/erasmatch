import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type DeleteAccountBody = {
  userId?: string;
};

const deleteWhereEquals = async (
  adminClient: ReturnType<typeof createClient>,
  table: string,
  column: string,
  userId: string,
) => {
  const { error } = await adminClient.from(table).delete().eq(column, userId);
  if (error) {
    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
};

const deleteWhereMatchesEither = async (
  adminClient: ReturnType<typeof createClient>,
  table: string,
  filter: string,
) => {
  const { error } = await adminClient.from(table).delete().or(filter);
  if (error) {
    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authorization = req.headers.get("Authorization");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error("Missing required Supabase environment variables");
    }

    if (!authorization) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as DeleteAccountBody;
    if (body.userId && body.userId !== user.id) {
      return new Response(JSON.stringify({ error: "You can only delete your own account" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: avatarFiles, error: avatarListError } = await adminClient.storage
      .from("avatars")
      .list(user.id, { limit: 100 });

    if (avatarListError) {
      throw new Error(`Failed to load avatar files: ${avatarListError.message}`);
    }

    if (avatarFiles.length > 0) {
      const avatarPaths = avatarFiles.map((file) => `${user.id}/${file.name}`);
      const { error: avatarRemoveError } = await adminClient.storage
        .from("avatars")
        .remove(avatarPaths);

      if (avatarRemoveError) {
        throw new Error(`Failed to remove avatar files: ${avatarRemoveError.message}`);
      }
    }

    await Promise.all([
      deleteWhereMatchesEither(adminClient, "blocked_users", `blocker_id.eq.${user.id},blocked_id.eq.${user.id}`),
      deleteWhereEquals(adminClient, "city_messages", "sender_id", user.id),
      deleteWhereEquals(adminClient, "group_messages", "sender_id", user.id),
      deleteWhereEquals(adminClient, "message_reactions", "user_id", user.id),
      deleteWhereMatchesEither(adminClient, "messages", `sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
      deleteWhereMatchesEither(adminClient, "notifications", `user_id.eq.${user.id},actor_id.eq.${user.id}`),
      deleteWhereMatchesEither(adminClient, "profile_views", `viewer_id.eq.${user.id},viewed_id.eq.${user.id}`),
      deleteWhereMatchesEither(adminClient, "email_notification_log", `sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
      deleteWhereEquals(adminClient, "user_roles", "user_id", user.id),
    ]);

    const { error: profileDeleteError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (profileDeleteError) {
      throw new Error(`Failed to delete profile: ${profileDeleteError.message}`);
    }

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      throw new Error(`Failed to delete auth user: ${deleteUserError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to delete account",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});