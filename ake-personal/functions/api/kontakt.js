/**
 * Cloudflare PAGES Function — mbeshtjelles i holle.
 * Rruga: POST /api/kontakt
 *
 * E gjithe logjika rri te ../../src/contact.js, e njejta qe perdor edhe
 * Worker-i (src/index.js). Keshtu validimi nuk ndryshon nga njera rruge
 * te tjetra.
 *
 * Nese projekti pritet si WORKER (wrangler deploy), ky file nuk perdoret —
 * dhe .assetsignore e mban jashte file-ve publike.
 */
import { handleContact } from '../../src/contact.js';

export const onRequestPost = ({ request, env }) => handleContact(request, env);

export const onRequestGet = () =>
  new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
