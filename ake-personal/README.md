# AKE – Agentur für Karriere und Entwicklung — rindërtim nga Wix në HTML/CSS/JS

Projekt i plotë për të hequr faqen nga Wix dhe për ta pritur në server-in tuaj.
Pa framework, pa build-step, pa varësi të jashtme — vetëm file statikë që i
ngarkoni me FTP.

> **Gjendja:** tekstet, ngjyrat, struktura dhe të dhënat e kontaktit janë marrë
> nga screenshot-et e faqes aktuale. Ende mungojnë: fotot, orari i punës, të dhënat
> ligjore të Impressum-it dhe disa tekste që në faqen origjinale janë të kopjuara
> gabimisht. Çdo vend i tillë është shënuar me `<span class="todo">…</span>` ose me
> komentin `PLOTËSO` në kod.

---

## 1. Çfarë ka brenda

```
ake-personal/
├── index.html          Faqja kryesore — një faqe e vetme me seksione:
│                       hero, Leistungen, Anerkennung, Jobs & Bewerbungen,
│                       Behörden & Visa, Übersetzungen, Kontakt
├── danke.html          Faqja pas dërgimit të formularit
├── impressum.html      Impressum (§ 5 DDG)
├── datenschutz.html    Datenschutzerklärung (DSGVO)
├── 404.html            Faqja e gabimit
├── kontakt.php         Pranon formularin, dërgon email
├── .htaccess           HTTPS, redirects, cache, siguri
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css   I gjithë stili (design tokens në krye)
    ├── js/main.js      Nav, scroll-spy, akordeon, validim formulari
    └── img/            logo.svg, logo-invers.svg, logo-full.svg,
                         hero.svg, favicon.svg
```

**Madhësia totale:** rreth 80 KB pa foto. Për krahasim, një faqe Wix ngarkon
zakonisht 2–5 MB JavaScript.

## Struktura e faqes

Faqja origjinale është një **one-pager** me seksione, prandaj u rindërtua ashtu.
Menuja lidhet me ankera (`#leistungen`, `#anerkennung`, `#bewerbungen`,
`#behoerden`, `#uebersetzungen`) dhe gjatë scroll-it seksioni aktual theksohet vetë.

**Rekomandim për Google:** më vonë ia vlen t'i ndani seksionet kryesore në faqe
më vete (`anerkennung.html`, `uebersetzungen.html`, `visum-aufenthalt.html`).
Kërkimet si „Anerkennung ausländischer Abschlüsse Singen" renditen shumë më mirë
me një faqe të dedikuar sesa me një ankor brenda një faqeje të gjatë.

---

## 2. Përse ia vlen të largoheni nga Wix

| | Wix | Ky projekt |
|---|---|---|
| Kosto vjetore | ~150–400 € | vetëm hosting, ~30–60 € |
| Shpejtësia | 2–5 s ngarkim | < 0.5 s |
| PageSpeed | zakonisht 40–70 | 95–100 |
| Kontrolli mbi kodin | asnjë | i plotë |
| Transferim te tjetër server | i pamundur | kopjo folderin |
| Cookie-banner | i detyrueshëm | nuk nevojitet |
| Google Fonts (problem DSGVO) | po | jo — fonte sistemi |

---

## 3. Plani i punës — hap pas hapi

### Faza 1 — Nxjerrja e përmbajtjes nga Wix (ju, ~2 orë)

1. Hapni faqen aktuale dhe **kopjoni çdo tekst** në një dokument (Word ose Google Docs),
   faqe pas faqeje.
2. Shkarkoni fotot: klikoni me të djathtën → *Ruaj imazhin*. Ose nga
   Wix: *Media Manager* → *Download*.
3. Kopjoni **fjalë për fjalë** Impressum-in dhe Datenschutz-in ekzistues.
4. Shkruani listën e **të gjitha URL-ve të vjetra**. Merrini nga:
   - Google: kërkoni `site:ake-personal.de`
   - Google Search Console → *Pages*
   - Wix → *SEO Tools* → *Site Pages*

   Kjo listë është kritike për hapin 5 (redirects) — pa të, humbisni renditjen në Google.

### Faza 2 — Fotot dhe pamja (~2 orë)

5. Të dhënat e kontaktit janë **tashmë** të futura (Hegaustraße 23, 78224 Singen,
   +49 178 3486195, info@ake-personal.de). Kontrollojini një herë dhe korrigjoni
   nëse ka ndryshuar diçka. Gjejini me:
   ```bash
   grep -rn "Hegaustra\|3486195\|info@ake-personal" *.html
   ```

6. **Logoja — e vendosur.** Është konvertuar nga `AKE_Logo_Final.ai` (i cili
   është PDF brenda) në SVG vektorial. Tri variante:

   | File | Përdorimi |
   |---|---|
   | `logo.svg` | header — vetëm shenja AKE, pa nëntitull |
   | `logo-invers.svg` | footer — petroli i kthyer në të bardhë |
   | `logo-full.svg` | lockup i plotë me nëntitullin, për print/OG |

   Nëntitulli „Agentur für Karriere und Entwicklung" në header është **tekst**,
   jo pjesë e figurës — kështu mbetet i lexueshëm dhe i kërkueshëm.

   Lartësia rregullohet në një vend: `.logo__img { height: 42px }` te `style.css`.

7. **Grafika nën hero** është `assets/img/hero.svg` — e gjeneruar, ~4 KB, e pastër
   në çdo ekran. Ilustrimi qëndron **në të djathtë** me qëllim, që shiriti i
   besueshmërisë majtas të mos e mbulojë.

   Nëse doni një foto reale: ruajeni si `assets/img/hero.webp`, ndryshoni emrin
   te `.hero-band` në `style.css`, dhe zgjidhni një foto me hapësirë të lirë majtas.
   Konvertojeni në WebP te [squoosh.app](https://squoosh.app) — kursen 60–80 %.

8. **Ngjyrat janë marrë drejtpërdrejt nga file-i i logos** (`style.css`, krye):

   | Token | Vlera | Nga |
   |---|---|---|
   | `--c-brand` | `#034c4d` | petroli i shkronjave |
   | `--c-accent` | `#f6921e` | portokallia e nëntitullit |
   | `--c-flag-red` | `#eb2027` | figura e mesit |
   | `--c-flag-yellow` | `#f7e738` | figura e djathtë |
   | `--c-teal` | `#4fbebf` | shiritat turkez të faqes |
   | `--c-mint` | `#ddf3f3` | sfondi i seksionit të shërbimeve |

9. **Impressum + Datenschutz.** Impressum-i tani ka vetëm bazat (emri, adresa,
   telefoni, email-i). Në fund të tij ka një kuti me listën e saktë të asaj që
   mbetet: emri ligjor + forma juridike, personi përgjegjës, Handelsregister,
   USt-IdNr., Aufsichtsbehörde dhe pyetja për RDG.
   Nëse s'jeni i sigurt, gjenerojeni te
   [e-recht24.de](https://www.e-recht24.de/impressum-generator.html).
   Në Gjermani një Impressum i gabuar sjell *Abmahnung* me kosto reale.

### Faza 3 — Tri vende për t'u kontrolluar

Tekstet janë kopjuar **fjalë për fjalë** nga faqja aktuale, përfshirë tri vende
ku origjinali duket se ka gabime. Nuk i ndryshova vetë — vendosni ju:

| Vendi | Çfarë ndodh te faqja aktuale |
|---|---|
| Anerkennung, hapi 4 „Maßnahmen zur Schließung der Lücke und zur Anpassung" | teksti është identik me hapin 3 |
| Jobs & Bewerbungen, karta e 4-t | „Familie & Sozialdienste" përsëritet nga seksioni i shërbimeve |
| Jobs & Bewerbungen, teksti hyrës | thotë **„AnerkennungPlus"**, jo AKE |
| Anerkannte Berufe | „Academic Qualifications" në anglisht, mes dy të tjerave në gjermanisht |

9. Seksioni i përkthimeve: në screenshot dukeshin Deutsch, Englisch, Französisch,
   Spanisch, Italienisch, Albanisch — kishte edhe një rresht më poshtë që nuk
   dukej i plotë. Kopjoni bllokun `<div class="lang-card">` për secilën që mungon.

10. **Formulari** është kopjuar saktësisht si i juaji: Vorname\*, Nachname\*,
    Email\*, Phone, Ihre Nachricht. Faqja juaj nuk ka checkbox pëlqimi për
    Datenschutz; unë vendosa vetëm një rresht teksti me link. Në Gjermani
    checkbox-i është varianti më i sigurt — nëse e doni, shtoni:
    ```html
    <div class="check">
      <input type="checkbox" id="datenschutz" name="datenschutz" required>
      <label for="datenschutz">Ich habe die
        <a href="datenschutz.html">Datenschutzerklärung</a> gelesen und stimme zu.</label>
    </div>
    ```
    dhe te `kontakt.php` shtoni `if (!isset($_POST['datenschutz'])) $errors[] = '…';`

### Faza 4 — Formulari i kontaktit

11. Zgjidhni njërën:
    - **Me PHP** (rekomandohet nëse hosting-u ka PHP — shih seksionin 6)
    - **Pa PHP:** hapni llogari falas te [Formspree](https://formspree.io) dhe
      te `kontakt.html` ndryshoni `action="kontakt.php"` → `action="https://formspree.io/f/KODI_JUAJ"`

### Faza 5 — Testimi lokal

12. ```bash
    cd ake-personal
    python3 -m http.server 8000
    ```
    Hapni `http://localhost:8000`. Përdorni server, jo `file://`.

13. Kontrolloni: menuja në telefon, ankerat e menusë, formularin, të gjitha linqet.

### Faza 6 — Ngarkimi në server

14. Shih seksionin 5.

### Faza 7 — Kalimi i domain-it

15. Shih seksionin 8. **Mos e fshini Wix-in derisa e reja të punojë.**

---

## 4. Çfarë ju duhet të blini

**Hosting** (~3–6 €/muaj). Kërkesat: PHP 7.4+, SSL falas (Let's Encrypt), akses FTP.

Opsione të mira në Gjermani:

| Ofrues | Çmimi | Shënim |
|---|---|---|
| **All-Inkl.com** (Privat) | ~5 €/muaj | Mbështetje shumë e mirë, PHP + email |
| **Netcup** (Webhosting 1000) | ~3 €/muaj | Raport i shkëlqyer çmim/performancë |
| **Hetzner** (Level 9) | ~4 €/muaj | Serverë në Gjermani, DSGVO-friendly |
| **IONOS** | ~1 € vitin e parë | Pastaj shtrenjtohet |
| **Cloudflare Pages / Netlify** | falas | Pa PHP — formulari duhet Formspree |

Për një faqe kaq të vogël edhe paketa më e lirë mjafton.

---

## 5. Ngarkimi në server

### Varianti A — FTP (më i thjeshti)

1. Shkarkoni [FileZilla](https://filezilla-project.org/) (falas).
2. Lidhuni me të dhënat nga hosting-u (Host / User / Password / Port 21 ose 22).
3. Hyni te folderi rrënjë — zakonisht quhet `httpdocs`, `public_html` ose `www`.
4. Ngarkoni **përmbajtjen** e folderit `ake-personal/` (jo folderin vetë).
5. Sigurohuni që `.htaccess` u ngarkua — FileZilla i fsheh file-t me pikë:
   *Server → Force showing hidden files*.

### Varianti B — rsync (nga terminali)

```bash
rsync -avz --delete \
  --exclude 'README.md' \
  ake-personal/ user@server.de:/var/www/html/
```

### Pas ngarkimit

- Aktivizoni SSL në panelin e hosting-ut (zakonisht një klik: "Let's Encrypt").
- Hapni faqen: duhet të kalojë vetë në `https://`.
- Testoni `https://www.ake-personal.de/kontakt` (pa `.html`) — nëse punon,
  `.htaccess` është aktiv.

---

## 6. Formulari me PHP

`kontakt.php` është gati. Ndryshoni vetëm rreshtat në krye:

```php
const MAIL_TO   = 'info@ake-personal.de';     // ku vijnë mesazhet
const MAIL_FROM = 'noreply@ake-personal.de';  // DUHET në domain-in tuaj
```

Ka brenda: honeypot kundër spam-it, rate-limit 30 sekonda/IP, validim serveri,
mbrojtje nga header-injection dhe përgjigje JSON për formularin me JavaScript.

### Nëse email-et shkojnë në spam

`mail()` i PHP-së dështon shpesh sepse serveri nuk ka SPF/DKIM. Zgjidhja e sigurt
është SMTP me PHPMailer:

```bash
composer require phpmailer/phpmailer
```

Pastaj zëvendësoni bllokun `mail(...)` te `kontakt.php`:

```php
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';

$m = new PHPMailer(true);
$m->isSMTP();
$m->Host       = 'smtp.ihr-hoster.de';
$m->SMTPAuth   = true;
$m->Username   = 'noreply@ake-personal.de';
$m->Password   = 'FJALEKALIMI';   // më mirë nga variabël mjedisi
$m->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$m->Port       = 465;
$m->CharSet    = 'UTF-8';

$m->setFrom(MAIL_FROM, 'AKE Personal Website');
$m->addAddress(MAIL_TO);
$m->addReplyTo($email, $name);
$m->Subject = $subject;
$m->Body    = $body;
$m->send();
```

Shtoni edhe një **SPF record** te DNS-i:
```
TXT   @   v=spf1 include:_spf.ihr-hoster.de ~all
```

---

## 6b. Cloudflare (pa PHP)

Cloudflare i pret të dyja format. Projekti i mbulon të dyja, me **të njëjtën
logjikë** te `src/contact.js` — ndryshon vetëm mbështjellësi:

| | Workers | Pages |
|---|---|---|
| Hyrja | `src/index.js` | `functions/api/kontakt.js` |
| Konfigurimi | `wrangler.jsonc` | — |
| Deploy | `npx wrangler deploy` | `npx wrangler pages deploy .` |
| Header-at | në kod (`src/index.js`) | `_headers` |

**Cloudflare tani i drejton projektet e reja te Workers.** Nëse te dashboard-i
shihni „Configure your Worker project" dhe komandën `npx wrangler deploy`,
jeni në rrugën e Workers-it — dhe `wrangler.jsonc` është aty për këtë.

### Workers — konfigurimi te dashboard-i

| Fusha | Vlera |
|---|---|
| Project name | `ake-personal` |
| Build command | bosh |
| Deploy command | `npx wrangler deploy` |
| **Path** | **`ake-personal`** ← jo `/` |

`Path` duhet të tregojë te folderi ku ndodhet `wrangler.jsonc`. Me `/` komanda
dështon me „no config file found".

### Kodi burimor jashtë publikut — dy mekanizma të ndryshëm

Kjo është një kurth: **Workers** dhe **Pages** i fshehin file-t në mënyra
krejt të ndryshme, dhe secili e injoron mekanizmin e tjetrit.

| | Workers | Pages |
|---|---|---|
| Mekanizmi | `.assetsignore` | rregullat `404` te `_redirects` |
| Çfarë ndodh pa të | file-t nuk ngarkohen fare | file-t ngarkohen **dhe shërbehen** |

Pages i ngarkon të gjithë file-t si asete statike dhe nuk e lexon fare
`.assetsignore`. Prandaj te `_redirects` janë rregullat që kthejnë 404 për
`/src/*`, `/wrangler.jsonc`, `/kontakt.php`, `/.htaccess` dhe `/README.md`.

Pas çdo deploy-i te Pages, kontrollojini një herë në shfletues — duhet të
kthejnë faqen 404:

```
https://<faqja>/src/contact.js
https://<faqja>/kontakt.php
https://<faqja>/wrangler.jsonc
```

Sekrete në to nuk ka (ato janë variabla mjedisi), por kodi burimor nuk ka pse
të jetë i lexueshëm.

### `.assetsignore`

Kodi burimor nuk duhet të dalë publik. Ky file mban jashtë `src/`, `functions/`,
`wrangler.jsonc`, `kontakt.php`, `.htaccess` dhe `README.md`. Pa të, çdo vizitor
do të mund të hapte `/src/contact.js`.

---

## 6c. Email-i

Cloudflare Pages e pret faqen falas dhe, ndryshe nga GitHub Pages, mund të
ekzekutojë kod në server. Prandaj formulari punon pa hosting me PHP.

**Kujdes:** Cloudflare **nuk dërgon vetë email** — Workers nuk kanë SMTP.
Duhet një API email-i. Këtu përdoret **Brevo**: kompani franceze, serverë në BE,
jep Auftragsverarbeitungsvertrag sipas Art. 28 DSGVO, falas deri në 300 email/ditë.
Një ofrues amerikan (Resend, SendGrid) do të kërkonte klauzola standarde
kontraktuale dhe një seksion më shumë te Datenschutzerklärung.

### Çfarë ka në projekt

| File | Roli |
|---|---|
| `functions/api/kontakt.js` | pranon POST-in te `/api/kontakt` dhe dërgon email-in |
| `_headers` | header-at e sigurisë dhe cache-i (zëvendëson `.htaccess`) |
| `_redirects` | ridrejtimet 301 nga URL-të e vjetra të Wix-it |

`.htaccess` dhe `kontakt.php` mbeten në projekt për rastin e hosting-ut me PHP —
Cloudflare i injoron.

### Hapat

1. **Brevo** → llogari falas → *Settings → SMTP & API → API keys* → krijo çelës.
   Verifiko domain-in `ake-personal.de` te *Senders & Domains* (shtohen dy-tri
   record-e DNS). Pa këtë verifikim email-et bien në spam.

2. **Cloudflare** → *Workers & Pages* → *Create* → *Pages* → lidh repo-n e GitHub-it.
   Build command: bosh. Output directory: `/` (ose emri i folderit).

3. **Settings → Environment variables** (të tria si *Secret*, jo tekst i thjeshtë):

   | Emri | Vlera |
   |---|---|
   | `BREVO_API_KEY` | çelësi nga hapi 1 |
   | `MAIL_TO` | `info@ake-personal.de` |
   | `MAIL_FROM` | `noreply@ake-personal.de` |

   Pa këto, funksioni kthen 500 dhe e shkruan shkakun te *Functions → Real-time logs*.

4. **Custom domain** → shtoni `ake-personal.de`. Nëse DNS-i është te Cloudflare,
   record-et shtohen vetë dhe SSL vjen falas.

5. **Marrja e email-it.** Nëse `info@ake-personal.de` s'ka ende kuti postare,
   aktivizoni **Cloudflare Email Routing** (falas): e përcjell te Gmail-i juaj.
   Kjo është vetëm për *marrje* — dërgimin e bën Brevo.

### Testimi lokal

```bash
npx wrangler pages dev .
```

Hap `http://localhost:8788`. Për të testuar dërgimin realisht, vendosni çelësat
te një file `.dev.vars` (mos e futni në Git).

### Nëse doni PHP në vend të kësaj

Te `index.html` ndryshoni një rresht:

```html
<form ... action="kontakt.php" ...>
```

Të dyja anët presin të njëjtat fusha, ndaj asgjë tjetër nuk ndryshon.

### Mbrojtja nga spam-i

Formulari ka honeypot (fushë e fshehur që e mbushin vetëm botet) dhe validim
në server. Nëse spam-i bëhet problem, shtoni **Cloudflare Turnstile** — captcha
falas, pa cookies, e pranueshme nga pikëpamja e DSGVO-së.

---

## 7. Nëse serveri është nginx

`.htaccess` nuk lexohet. Vendosni këtë te konfigurimi i site-it:

```nginx
server {
    listen 443 ssl http2;
    server_name www.ake-personal.de;
    root /var/www/ake-personal;
    index index.html;

    # URL të pastra: /kontakt → /kontakt.html
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    error_page 404 /404.html;

    # Cache
    location ~* \.(css|js|woff2|svg|webp|avif|jpg|jpeg|png|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.html$ {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Siguri
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # PHP për formularin
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}

# Redirect HTTP → HTTPS dhe pa-www → www
server {
    listen 80;
    server_name ake-personal.de www.ake-personal.de;
    return 301 https://www.ake-personal.de$request_uri;
}
server {
    listen 443 ssl http2;
    server_name ake-personal.de;
    return 301 https://www.ake-personal.de$request_uri;
}
```

---

## 8. Kalimi i domain-it nga Wix (pjesa më delikate)

**Rregulli i artë: mos e anuloni Wix-in para se e reja të jetë online dhe e testuar.**

Rendi i saktë:

1. **Ngarkoni faqen e re** te hosting-u i ri dhe testojeni në një adresë të
   përkohshme (çdo hosting jep një si `ake-personal.kunde123.all-inkl.de`).
2. **Ulni TTL-në** e DNS-it në 300 sekonda — 24 orë përpara ndryshimit.
   Kjo bën që ndryshimi të hyjë në fuqi brenda minutash, jo orësh.
3. **Ndryshoni DNS-in.** Ku është regjistruar domain-i?
   - **Te Wix:** Wix → *Domains* → *Advanced* → ndryshoni A record dhe CNAME.
     Ose më mirë: transferojeni domain-in te një regjistrues normal
     (INWX, Netcup, IONOS) — kërkon një *Auth-Code* nga Wix.
   - **Te një regjistrues tjetër:** ndryshoni direkt aty:
     ```
     A      @      <IP e serverit tuaj>
     CNAME  www    ake-personal.de.
     ```
4. **Prisni 1–24 orë** derisa DNS-i të përhapet. Kontrolloni te
   [dnschecker.org](https://dnschecker.org).
5. **Aktivizoni SSL** te hosting-u i ri sapo DNS-i të tregojë atje.
6. **Vendosni redirects** te `.htaccess` për të gjitha URL-të e vjetra (Faza 1, pika 4).
   Kjo është arsyeja pse ajo listë ishte e rëndësishme.
7. **Testoni gjithçka** për 2–3 ditë: faqet, formularin, SSL, mobile.
8. **Ruani email-et!** Nëse email-i `@ake-personal.de` shkonte përmes Wix,
   duhet të krijoni kutitë e reja te hosting-u i ri dhe të ndryshoni MX records
   **para** se të anuloni Wix — përndryshe humbni email-et hyrëse.
9. **Vetëm tani** anuloni abonimin e Wix.

### Pas kalimit

- Google Search Console → shtoni pronën e re → dërgoni `sitemap.xml`.
- Kontrolloni **Coverage** për 2 javë; nëse dalin 404, shtoni redirect.
- Renditja në Google mund të lëvizë pak 1–2 javë; me redirects të sakta rikthehet.

---

## 9. Lista përfundimtare e kontrollit

**Përmbajtja**
- [ ] Të gjitha `class="todo"` plotësuar (kërko `todo` në projekt — nuk duhet të mbetet asnjë)
- [ ] Tre tekstet e kopjuara gabimisht janë rishkruar (Faza 3)
- [ ] Adresa, telefoni, email-i të verifikuar (edhe te `tel:` dhe JSON-LD te `index.html`)
- [ ] Impressum i plotë — sidomos pika për RDG (shih shënimin brenda faqes)
- [ ] Datenschutzerklärung e kontrolluar nga jurist
- [ ] Fotot e ngarkuara, të optimizuara, me `alt` përshkrues
- [ ] Logo dhe favicon të vërteta
- [ ] Vendosur si trajtohet dyqani (shih seksionin për shportën)

**Teknike**
- [ ] Faqja hapet me `https://`
- [ ] `www` dhe pa-`www` çojnë në të njëjtin vend
- [ ] Formulari dërgon email dhe email-i mbërrin (jo në spam)
- [ ] `/kontakt` pa `.html` funksionon
- [ ] Faqja 404 shfaqet
- [ ] Menuja punon në telefon
- [ ] Filtrat e vendeve të punës punojnë
- [ ] `sitemap.xml` me datat e sotme
- [ ] PageSpeed Insights > 90 (duhet të jetë ~100)

**Migrimi**
- [ ] Redirects nga URL-të e vjetra
- [ ] MX records të ruajtura (email!)
- [ ] Search Console e konfiguruar, sitemap i dërguar
- [ ] Backup i faqes së vjetër i ruajtur
- [ ] Wix i anuluar — **në fund**

---

## 10. Mirëmbajtja

**Ndryshim teksti:** hapni file-in `.html` përkatës, ndryshoni, ngarkoni.

**Shërbim i ri në formular:** shtoni një `<option>` te `#leistung` në `kontakt.html`.

**Ngjyra të reja:** `assets/css/style.css`, rreshtat 10–20.

**Backup:** kopjoni folderin një herë në muaj. Meqë gjithçka është file, mjafton
një ZIP. Ose mbajeni në Git — atëherë çdo ndryshim ruhet automatikisht.

**Nëse doni panel administrimi** (për të mos prekur kodin), më vonë mund të shtohet
[Decap CMS](https://decapcms.org/) ose [TinaCMS](https://tina.io/) — punon me
file statikë, pa databazë, falas.

---

## 11. Vlerësim kohe

| Faza | Kush | Kohë |
|---|---|---|
| Fotot dhe logoja | ju | 1 orë |
| Tekstet që mungojnë (Faza 3) | ju | 1 orë |
| Impressum + Datenschutz + kontrolli RDG | ju + jurist | 2 orë |
| Vendimi për dyqanin | ju | 30 min |
| Formulari + testim | ju / unë | 1 orë |
| Ngarkimi në server | ju | 1 orë |
| Kalimi i DNS-it + redirects | ju | 1 orë + pritje |
| **Totali** | | **~10 orë punë** |

---

## 12. Hapi tjetër

Dërgomëni:

1. **Logon origjinale** si file SVG ose PNG me sfond transparent — figura e ngjitur
   në bisedë nuk mund të ruhej si file, prandaj aty është një zëvendësues
2. **Fotot reale** nëse i doni në vend të grafikave të gjeneruara
3. **Impressum-in** ekzistues fjalë për fjalë (emri ligjor i firmës, HRB, USt-IdNr.,
   Geschäftsführer)
4. **Listën e URL-ve të vjetra** për redirects — kur t'ju vijë radha
5. Përgjigje për **dyqanin** (shih më poshtë)

## Dyqani (ikona e shportës)

Faqja aktuale ka një ikonë shporte me „0" — pra Wix Stores është aktiv.
Kjo **nuk kalon dot** në HTML statik: një dyqan i vërtetë kërkon pagesa, porosi
dhe faturim. Tre rrugë:

| Zgjidhja | Kosto | Kur ka kuptim |
|---|---|---|
| **Hiqe fare** | 0 € | Nëse shporta nuk përdoret realisht (kishte 0 artikuj) |
| **Stripe Payment Links** | 1,5 % + 0,25 € për pagesë | Nëse shisni disa shërbime me çmim fiks (p.sh. „Përkthim i noterizuar 60 €") — merrni një link nga Stripe dhe e vendosni si buton normal |
| **Shopify Lite / Ecwid** | ~9–15 €/muaj | Nëse ka shumë produkte dhe ju duhet menaxhim stoku |

Për një agjenci shërbimesh, **Stripe Payment Links** është zakonisht zgjidhja e
duhur: mbetet HTML statik, pa server, pa mirëmbajtje.

## Fontet

Faqja origjinale përdor fonte të Wix-it (një sans gjeometrik + një serif).
Këtu janë zëvendësuar me fonte sistemi, sepse Google Fonts në Gjermani kërkon
pëlqim cookie (gjykata e Mynihut, 2022) dhe ka sjellë valë *Abmahnung*.

Nëse doni fontet origjinale, **vetë-strehojini**: shkarkoni `.woff2`,
vendosini te `assets/fonts/`, shtoni `@font-face` te `style.css` dhe ndryshoni
`--font-sans` / `--font-serif`. Kështu nuk shkon asnjë IP te Google.
