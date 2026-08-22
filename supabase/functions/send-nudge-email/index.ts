/**
 * send-nudge-email — Sends reminder emails for unread direct messages.
 *
 * Called hourly by a pg_cron job.  The function:
 *   1. Calls find_pending_nudges() to discover eligible recipients
 *   2. Sends a branded email via Resend for each recipient
 *   3. Logs every nudged message_id to message_nudge_log to prevent re-sends
 *
 * Auth: service_role JWT required (same pattern as send-welcome-email).
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.erasmatch.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

// ─── helpers ────────────────────────────────────────────────────────

/** HTML-escape user-supplied strings to prevent injection. */
function esc(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Format an array of sender names into a readable string. */
function formatSenders(names: string[]): string {
  const safe = names.map(esc)
  if (safe.length === 1) return safe[0]
  if (safe.length === 2) return `${safe[0]} and ${safe[1]}`
  const rest = safe.length - 2
  return `${safe[0]}, ${safe[1]}, and ${rest} other${rest > 1 ? "s" : ""}`
}

// ─── email template ─────────────────────────────────────────────────

function buildEmailHtml(
  firstName: string,
  headline: string,
  bodyText: string,
  ctaUrl: string,
  ctaLabel: string
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Navy header -->
          <tr>
            <td style="background-color:#1e293b;padding:36px 40px 32px 40px;text-align:center;">
              <h1 style="margin:0 0 6px 0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                <span style="color:#3B82F6;">Eras</span><span style="color:#22C55E;">Match</span>
              </h1>
              <p style="margin:0 0 20px 0;font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:2px;text-transform:uppercase;">YOUR ERASMUS NETWORK</p>
              <h2 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">
                💬 ${headline}
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 36px 0 36px;">
              <p style="margin:0 0 16px 0;font-size:17px;line-height:1.5;color:#111827;">
                Hey ${firstName}! 👋
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#374151;">
                ${bodyText}
              </p>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td align="center" style="padding:0 36px 28px 36px;">
              <a href="${ctaUrl}" style="display:inline-block;background-color:#22C55E;color:#ffffff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:0.2px;">
                ${ctaLabel} &rarr;
              </a>
            </td>
          </tr>

          <!-- Nudge copy -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7280;background-color:#f0fdf4;padding:14px 16px;border-radius:10px;">
                💡 <strong>Tip:</strong> Replying quickly helps you make connections before you even arrive. The first week is easier when you already know someone!
              </p>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <p style="margin:0;font-size:15px;line-height:1.5;color:#374151;">
                Happy connecting,<br>
                <span style="color:#6B7280;">The ErasMatch team</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 24px 36px;border-top:1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#9CA3AF;">
                      <span style="color:#3B82F6;">Eras</span><span style="color:#22C55E;">Match</span>
                    </p>
                    <p style="margin:0 0 4px 0;font-size:12px;color:#9CA3AF;">
                      <a href="https://www.erasmatch.com?utm_source=erasmatch&utm_medium=email&utm_campaign=nudge_unread&utm_content=footer" style="color:#9CA3AF;text-decoration:none;">erasmatch.com</a>
                    </p>
                    <p style="margin:0;font-size:11px;color:#D1D5DB;">
                      You received this because someone sent you a message on ErasMatch.
                      <a href="https://www.erasmatch.com/profile?utm_source=erasmatch&utm_medium=email&utm_campaign=nudge_unread&utm_content=email_prefs" style="color:#D1D5DB;text-decoration:underline;">Email preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── main handler ───────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ── Auth: service_role only ──────────────────────────────────────
    const authHeader = req.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    try {
      const token = authHeader.slice(7)
      const payloadB64 = token.split(".")[1]
      const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/")
      const payload = JSON.parse(atob(b64))
      if (payload.role !== "service_role") {
        return new Response(
          JSON.stringify({ error: "Forbidden: service_role required" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }
    } catch {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // ── Supabase client (service role for cross-user queries) ────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // ── 1. Find pending nudges ──────────────────────────────────────
    const { data: nudges, error: rpcError } = await supabase.rpc(
      "find_pending_nudges"
    )

    if (rpcError) {
      console.error("find_pending_nudges error:", rpcError)
      return new Response(JSON.stringify({ error: rpcError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!nudges || nudges.length === 0) {
      console.log("No pending nudges found")
      return new Response(
        JSON.stringify({ sent: 0, message: "No pending nudges" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`Found ${nudges.length} recipient(s) to nudge`)

    // ── 2. Send emails + log ────────────────────────────────────────
    let sent = 0
    let failed = 0

    for (const nudge of nudges) {
      try {
        const firstName = esc(
          (nudge.receiver_name || "there").split(" ")[0]
        )
        const senderNames: string[] = nudge.sender_names || ["Someone"]
        const count: number = Number(nudge.unread_count) || 1

        // Build subject + copy
        let subject: string
        let headline: string
        let bodyText: string
        let ctaLabel: string

        if (count === 1) {
          const rawSender = senderNames[0] || "Someone"
          const safeSender = esc(rawSender)
          // Strip CR/LF from subject to prevent header injection
          subject = `${rawSender.replace(/[\r\n]+/g, " ")} sent you a message`
          headline = `${safeSender} sent you a message`
          bodyText = `You have an unread message from <strong>${safeSender}</strong> on ErasMatch. Don't leave them hanging, tap below to reply!`
          ctaLabel = "Read &amp; Reply"
        } else {
          subject = `You have ${count} unread messages on ErasMatch`
          headline = `You have ${count} unread messages`
          const sendersStr = formatSenders(senderNames)
          bodyText = `You have messages waiting from <strong>${sendersStr}</strong>. Tap below to catch up!`
          ctaLabel = "Open Messages"
        }

        const ctaUrl =
          "https://www.erasmatch.com/messages?utm_source=erasmatch&utm_medium=email&utm_campaign=nudge_unread"

        // Send via Resend
        const emailResult = await resend.emails.send({
          from: "ErasMatch <team@erasmatch.com>",
          to: [nudge.receiver_email],
          reply_to: "erasmatchbusiness@gmail.com",
          subject,
          headers: { "X-Entity-Ref-ID": nudge.receiver_id },
          tags: [
            { name: "email_type", value: "nudge_unread" },
            { name: "unread_count", value: String(count) },
          ],
          html: buildEmailHtml(firstName, headline, bodyText, ctaUrl, ctaLabel),
        })

        console.log(`Nudge email sent to ${nudge.receiver_id}:`, emailResult)

        // Log every message we nudged about (prevents re-nudging)
        const logRows = (nudge.message_ids as string[]).map(
          (mid: string) => ({
            receiver_id: nudge.receiver_id,
            message_id: mid,
          })
        )

        const { error: logError } = await supabase
          .from("message_nudge_log")
          .insert(logRows)

        if (logError) {
          // Non-fatal — the email was sent, but we might re-nudge later.
          // The UNIQUE constraint on message_id will prevent true duplicates.
          console.error("Failed to log nudge:", logError)
        }

        sent++
      } catch (err) {
        console.error(`Failed to nudge ${nudge.receiver_id}:`, err)
        failed++
      }
    }

    const summary = { sent, failed, total: nudges.length }
    console.log("Nudge run complete:", summary)

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Nudge email error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
