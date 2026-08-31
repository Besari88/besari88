/**
 * KONTROLL I PERKOHSHEM I KONFIGURIMIT — hapet ne shfletues:
 *   https://<faqja>/api/diagnose
 *
 * Pergjigjet me tekst te thjeshte: cfare eshte ne rregull dhe cfare jo.
 * Nuk shfaq asnje sekret — vetem gjatesine e celesit dhe adresat, te cilat
 * jane tashme publike ne faqe.
 *
 * FSHIJENI KETE FILE PASI FORMULARI TE PUNOJE:
 *   rm functions/api/diagnose.js && npx wrangler pages deploy . --project-name=ake-personal
 */

const line = (ok, text) => `${ok ? '  OK   ' : '  JO   '}${text}`;

async function brevo(env, path) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    headers: { 'api-key': (env.BREVO_API_KEY || '').trim(), accept: 'application/json' },
  });
  let body = null;
  try { body = await res.json(); } catch { /* pergjigje jo-JSON */ }
  return { status: res.status, body };
}

export async function onRequestGet({ env }) {
  const out = ['AKE — kontroll i konfigurimit', '='.repeat(46), ''];
  const key  = (env.BREVO_API_KEY || '').trim();
  const to   = (env.MAIL_TO   || '').trim();
  const from = (env.MAIL_FROM || '').trim();
  let verdict = [];

  // ---- 1. Variablat ----
  out.push('1. VARIABLAT E MJEDISIT');
  out.push(line(!!key,  `BREVO_API_KEY  ${key ? `e vendosur (${key.length} shenja)` : 'MUNGON'}`));
  out.push(line(!!to,   `MAIL_TO        ${to   || 'MUNGON'}`));
  out.push(line(!!from, `MAIL_FROM      ${from || 'MUNGON'}`));
  out.push('');

  if (!key || !to || !from) {
    verdict.push('Vendosni variablat qe mungojne me:');
    verdict.push('  npx wrangler pages secret put <EMRI> --project-name=ake-personal');
    verdict.push('pastaj beni deploy perseri.');
    out.push('PERFUNDIM', '-'.repeat(46), ...verdict);
    return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  // ---- 2. Celesi API ----
  out.push('2. CELESI API');
  let acc;
  try { acc = await brevo(env, '/account'); }
  catch (e) {
    out.push(line(false, `nuk u arrit Brevo: ${e.message}`));
    out.push('', 'PERFUNDIM', '-'.repeat(46), 'Rrjeti nuk e arriti api.brevo.com.');
    return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  if (acc.status === 200) {
    out.push(line(true, `i vlefshem — llogaria: ${acc.body?.companyName || acc.body?.email || 'e panjohur'}`));
  } else if (acc.status === 401) {
    out.push(line(false, 'Brevo ktheu 401 — celesi eshte i gabuar, i fshire, ose i kufizuar me IP'));
    verdict.push('Krijoni celes te ri: Brevo → Settings → SMTP & API → API keys,');
    verdict.push('pastaj: npx wrangler pages secret put BREVO_API_KEY --project-name=ake-personal');
  } else {
    out.push(line(false, `Brevo ktheu ${acc.status}: ${JSON.stringify(acc.body).slice(0, 200)}`));
  }
  out.push('');

  // ---- 3. Derguesi ----
  if (acc.status === 200) {
    out.push('3. DERGUESI (MAIL_FROM)');
    const senders = await brevo(env, '/senders');
    const list = senders.body?.senders || [];
    const exact = list.some((s) => (s.email || '').toLowerCase() === from.toLowerCase());

    const domain = from.split('@')[1] || '';
    const doms = await brevo(env, '/senders/domains');
    const dl = doms.body?.domains || [];
    const domOk = dl.some((d) =>
      (d.domain || '').toLowerCase() === domain.toLowerCase() && (d.authenticated || d.verified));

    out.push(line(exact, exact
      ? `${from} eshte derguesi i verifikuar`
      : `${from} NUK figuron nder derguesit e verifikuar`));
    out.push(line(domOk, domOk
      ? `domain-i ${domain} eshte i verifikuar`
      : `domain-i ${domain} NUK eshte i verifikuar`));

    if (!exact && !domOk) {
      verdict.push(`Brevo nuk lejon dergim nga ${from} sepse as adresa as domain-i`);
      verdict.push('nuk jane verifikuar.');
      verdict.push('');
      verdict.push('ZGJIDHJA E SHPEJTE (per te provuar tani):');
      verdict.push('  Vendosni si MAIL_FROM email-in me te cilin hapet llogaria e Brevo-s —');
      verdict.push('  ai eshte i verifikuar automatikisht:');
      verdict.push('    npx wrangler pages secret put MAIL_FROM --project-name=ake-personal');
      verdict.push('');
      verdict.push('ZGJIDHJA E DUHUR (per prodhim):');
      verdict.push(`  Brevo → Senders, Domains & Dedicated IPs → shtoni ${domain}`);
      verdict.push('  dhe vendosni record-et DNS qe ju jep (DKIM + kodi i Brevo-s).');
      verdict.push(`  Pastaj ktheni MAIL_FROM ne ${from}.`);
    }
    out.push('');
  }

  if (!verdict.length) {
    verdict.push('Gjithcka duket ne rregull. Nese formulari ende deshton,');
    verdict.push('dergoni nje mesazh dhe shikoni Functions → Real-time logs.');
  }
  out.push('PERFUNDIM', '-'.repeat(46), ...verdict, '',
           'Fshijeni kete kontroll pasi te mbaroje puna:',
           '  rm functions/api/diagnose.js');

  return new Response(out.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
  });
}
