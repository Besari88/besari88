/**
 * Hyrja e Worker-it (Cloudflare Workers me static assets).
 *
 *   POST /api/kontakt  → formulari
 *   çdo gjë tjetër     → file-t statikë përmes binding-ut ASSETS
 *
 * Header-at e sigurisë vendosen KETU, jo te `_headers`. Arsyeja: `_headers`
 * eshte konvente e Pages-it; duke i vendosur ne kod, ato zbatohen sigurt
 * pavaresisht se si e pret Cloudflare projektin. File-i `_headers` mbetet ne
 * projekt per rastin kur perdoret Pages.
 */
import { handleContact } from './contact.js';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // Faqja nuk ngarkon asgje nga jashte. Nese shtoni Google Maps ose Analytics,
  // kjo rreshte duhet zgjeruar, perndryshe bllokohen pa asnje mesazh.
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
    "script-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/kontakt') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
      }
      return handleContact(request, env);
    }

    const res = await env.ASSETS.fetch(request);

    // Response-i i aseteve eshte immutable — duhet klonuar per te shtuar header-a.
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);

    // Cache: asetet kane emra fikse, ndaj HTML-ja nuk duhet cache-uar gjate.
    if (url.pathname.startsWith('/assets/')) {
      out.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (out.headers.get('content-type')?.includes('text/html')) {
      out.headers.set('Cache-Control', 'no-cache, must-revalidate');
    }
    return out;
  },
};
