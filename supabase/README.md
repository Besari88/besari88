# Workload Planner — Member Tag Email Notifications

When you tag a team member on a task (**Aufgabe**) or kanban card (**Karte**), they
receive an email. The tagging UI lives in the app (`index.html`); the actual email
is sent by a **Supabase Edge Function** (`send-tag-notification`) using
[Resend](https://resend.com).

## How it works

1. Each member has an **E-Mail** field (set it in the *Mitarbeiter hinzufügen* /
   *Mitarbeiter bearbeiten* dialog). Members without an email can still be tagged,
   but they won't get a notification (shown with a ⚠ in the app).
2. In a task's detail panel or a card's detail modal, use **🔔 Mitarbeiter taggen**
   to add members, then **Save** (*Änderungen speichern* / *Speichern*).
3. On save, the app emails any *newly* added member via the edge function.

## One-time deployment

You need the [Supabase CLI](https://supabase.com/docs/guides/cli) and a free
[Resend](https://resend.com) account with a **verified sending domain**.

```bash
# 1. Log in and link to your project (project ref is in your Supabase URL:
#    https://xffncclkylksidlepwyo.supabase.co  ->  ref = xffncclkylksidlepwyo)
supabase login
supabase link --project-ref xffncclkylksidlepwyo

# 2. Set secrets (these stay on the server, never in the HTML)
supabase secrets set RESEND_API_KEY=re_your_resend_key
supabase secrets set FROM_EMAIL="Workload Planner <noreply@your-verified-domain.com>"
# optional: a link button shown in the email
supabase secrets set APP_URL="https://your-app-url.example"

# 3. Deploy the function. --no-verify-jwt is required because the app calls it
#    with the public (publishable) Supabase key, not a logged-in user JWT.
supabase functions deploy send-tag-notification --no-verify-jwt
```

That's it. The function endpoint the app calls is:

```
https://xffncclkylksidlepwyo.supabase.co/functions/v1/send-tag-notification
```

## Testing without a custom domain

Resend gives you `onboarding@resend.dev` as a default sender that can only deliver
to **your own** Resend account email. To send to real team addresses you must
verify your own domain in Resend and set `FROM_EMAIL` to an address on it.

## Quick local test of the endpoint

```bash
curl -X POST \
  "https://xffncclkylksidlepwyo.supabase.co/functions/v1/send-tag-notification" \
  -H "Content-Type: application/json" \
  -d '{"to":"you@example.com","memberName":"Alex","taggedBy":"Admin","itemType":"Aufgabe","itemName":"Test","note":"Hallo!"}'
```

If you see `{"ok":true,...}` and an email arrives, the integration is live.
Until the function is deployed, tagging still works in the app (it records the tag
and logs the activity); only the email delivery is skipped.
