/**
 * Logjika e formularit — e perbashket per te dyja rruget e Cloudflare:
 *   - Workers  → thirret nga src/index.js
 *   - Pages    → thirret nga functions/api/kontakt.js
 * Mbahet ne nje vend te vetem qe validimi te mos ndryshoje nga njera te tjetra.
 *
 * KONFIGURIMI (variabla mjedisi, te vendosura si Secret):
 *   BREVO_API_KEY, MAIL_TO, MAIL_FROM
 */

const MAX_LEN = 5000;

/** Heq CR/LF — mbrojtje kunder header injection. */
const clean = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function reply(request, status, message, redirectTo) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify({ ok: status < 400, message }), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  if (status < 400 && redirectTo) return Response.redirect(redirectTo, 303);
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Fehler</title>` +
    `<p style="font-family:sans-serif;padding:2rem">${esc(message)}</p>` +
    `<p style="font-family:sans-serif;padding:0 2rem"><a href="/#kontakt">Zurück zum Formular</a></p>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

async function sendMail(env, { vorname, nachname, email, telefon, nachricht }) {
  const body = [
    'Neue Anfrage über ake-personal.de',
    '='.repeat(44), '',
    `Name:     ${vorname} ${nachname}`,
    `E-Mail:   ${email}`,
    `Telefon:  ${telefon || '—'}`,
    '', 'Nachricht:', nachricht || '—',
  ].join('\n');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: env.MAIL_FROM, name: 'AKE Website' },
      to: [{ email: env.MAIL_TO }],
      replyTo: { email, name: `${vorname} ${nachname}`.trim() },
      subject: 'Neue Anfrage über ake-personal.de',
      textContent: body,
    }),
  });

  if (!res.ok) throw new Error(`Brevo ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

export async function handleContact(request, env) {
  const origin = new URL(request.url).origin;

  if (!env.BREVO_API_KEY || !env.MAIL_TO || !env.MAIL_FROM) {
    console.error('Mungojne variablat: BREVO_API_KEY / MAIL_TO / MAIL_FROM');
    return reply(request, 500, 'Der Versand ist derzeit nicht konfiguriert. Bitte rufen Sie uns an.');
  }

  let form;
  try { form = await request.formData(); }
  catch { return reply(request, 400, 'Ungültige Anfrage.'); }

  // Honeypot: pergjigju me sukses qe boti te mos mesoje asgje.
  if (clean(form.get('website'))) {
    return reply(request, 200, 'Vielen Dank für Ihre Nachricht.', `${origin}/danke.html`);
  }

  const data = {
    vorname:   clean(form.get('vorname')),
    nachname:  clean(form.get('nachname')),
    email:     clean(form.get('email')),
    telefon:   clean(form.get('telefon')),
    nachricht: String(form.get('nachricht') ?? '').trim(),
  };

  const errors = [];
  if (!data.vorname)  errors.push('Vorname fehlt.');
  if (!data.nachname) errors.push('Nachname fehlt.');
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(data.email)) errors.push('E-Mail-Adresse ungültig.');
  if (data.nachricht.length > MAX_LEN) errors.push('Nachricht zu lang.');
  if (errors.length) return reply(request, 422, `Bitte prüfen Sie Ihre Eingaben: ${errors.join(' ')}`);

  try { await sendMail(env, data); }
  catch (err) {
    console.error('Dërgimi dështoi:', err.message);
    return reply(request, 502,
      'Die Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie an info@ake-personal.de.');
  }

  return reply(request, 200,
    'Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns in der Regel innerhalb von 24 Stunden.',
    `${origin}/danke.html`);
}
