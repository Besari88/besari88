// Supabase Edge Function: send-tag-notification
// Sends an email to a team member when they are tagged on a task (Aufgabe) or
// kanban card (Karte) in the Workload Planner.
//
// Deploy:
//   supabase functions deploy send-tag-notification --no-verify-jwt
// Secrets required (set once):
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//   supabase secrets set FROM_EMAIL="Workload Planner <noreply@your-verified-domain.com>"
//   # optional: a base URL shown as a button in the email
//   supabase secrets set APP_URL="https://your-app-url.example"
//
// The FROM_EMAIL domain must be verified in your Resend account.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Workload Planner <onboarding@resend.dev>";
const APP_URL = Deno.env.get("APP_URL") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { to, memberName, taggedBy, itemType, itemName, note, details, action } = await req.json();

    if (!to || typeof to !== "string") {
      return new Response(JSON.stringify({ error: "Missing recipient 'to'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const kind = esc(itemType || "Aufgabe");
    const name = esc(itemName || "");
    const by = esc(taggedBy || "Ein Teammitglied");
    const who = esc(memberName || "");
    const noteHtml = note
      ? `<p style="margin:0 0 8px;color:#555;font-size:13px"><strong>Notiz:</strong> ${esc(note)}</p>`
      : "";
    let detailsHtml = "";
    if (details && typeof details === "object") {
      const rows = Object.keys(details)
        .filter((k) => details[k] !== undefined && details[k] !== null && String(details[k]) !== "")
        .map(
          (k) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:12px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;color:#1a1a1a;font-size:13px">${esc(String(details[k]))}</td></tr>`,
        )
        .join("");
      if (rows) {
        detailsHtml = `<table style="border-collapse:collapse;margin:4px 0 4px">${rows}</table>`;
      }
    }
    const buttonHtml = APP_URL
      ? `<p style="margin:18px 0 0"><a href="${esc(APP_URL)}" style="display:inline-block;background:#4A90E2;color:#fff;text-decoration:none;font-size:13px;font-weight:500;padding:9px 18px;border-radius:8px">Im Arbeitsplan öffnen</a></p>`
      : "";

    const isAssign = action === "assigned";
    const subject = isAssign
      ? `Neue ${kind} für dich: "${itemName || kind}"`
      : `Du wurdest bei "${itemName || kind}" getaggt`;
    const heading = isAssign ? "📋 Neue Aufgabe für dich" : "🔔 Du wurdest getaggt";
    const intro = isAssign
      ? `<strong>${by}</strong> hat eine neue ${kind} <strong>${name}</strong> für dich erstellt.`
      : `<strong>${by}</strong> hat dich bei der ${kind} <strong>${name}</strong> getaggt.`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 12px">${heading}</h2>
        <p style="margin:0 0 8px;font-size:14px">Hallo ${who || "zusammen"},</p>
        <p style="margin:0 0 12px;font-size:14px">${intro}</p>
        ${detailsHtml}
        ${noteHtml}
        ${buttonHtml}
        <hr style="border:none;border-top:1px solid #eee;margin:22px 0 12px">
        <p style="margin:0;color:#999;font-size:11px">Workload Planner — automatische Benachrichtigung</p>
      </div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });

    const body = await resendRes.text();
    if (!resendRes.ok) {
      console.error("Resend error:", body);
      return new Response(JSON.stringify({ error: "Email send failed", detail: body }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, detail: body }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
