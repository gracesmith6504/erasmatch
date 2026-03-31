import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type DeleteAccountBody = {
  userId?: string;
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

    const { data: existingProfile, error: profileFetchError } = await adminClient
      .from("profiles")
      .select("deleted_at, email, name, bio, avatar_url, onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    if (profileFetchError) {
      throw profileFetchError;
    }

    if (existingProfile) {
      const { error: profileUpdateError } = await adminClient
        .from("profiles")
        .update({
          deleted_at: new Date().toISOString(),
          email: null,
          name: null,
          bio: null,
          avatar_url: null,
          onboarding_complete: false,
        })
        .eq("id", user.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }
    }

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id, true);

    if (deleteUserError) {
      if (existingProfile) {
        const { error: restoreError } = await adminClient
          .from("profiles")
          .update(existingProfile)
          .eq("id", user.id);

        if (restoreError) {
          console.error("Failed to restore profile after delete failure:", restoreError);
        }
      }

      throw deleteUserError;
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