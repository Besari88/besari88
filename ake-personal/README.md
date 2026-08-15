# AKE Personal — rindërtim nga Wix në HTML/CSS/JS

Projekt i plotë për të hequr faqen nga Wix dhe për ta pritur në server-in tuaj.
Pa framework, pa build-step, pa varësi të jashtme — vetëm file statikë që i
ngarkoni me FTP.

> **E RËNDËSISHME:** Përmbajtja aktuale është **shabllon**. Faqja `ake-personal.de`
> nuk arrihej dot nga mjedisi ku u ndërtua ky projekt (proxy i bllokoi lidhjen),
> prandaj tekstet, adresa, telefoni, emrat dhe të dhënat e Impressum-it janë
> **placeholder** dhe duhen zëvendësuar me ato realet nga Wix.
> Çdo vend që duhet ndryshuar është shënuar me `<span class="todo">…</span>` ose
> me komentin `PLOTËSO`.

---

## 1. Çfarë ka brenda

```
ake-personal/
├── index.html              Faqja kryesore
├── leistungen.html         Shërbimet (5 shërbime me ankera)
├── fuer-unternehmen.html   Për firmat — proces, kalkulim kostoje
├── stellenangebote.html    Vendet e punës me filtra (JS)
├── ueber-uns.html          Rreth nesh, vlerat, ekipi
├── kontakt.html            Formular + të dhëna kontakti
├── danke.html              Faqja pas dërgimit të formularit
├── impressum.html          Impressum (§ 5 DDG)
├── datenschutz.html        Datenschutzerklärung (DSGVO)
├── 404.html                Faqja e gabimit
├── kontakt.php             Pranon formularin, dërgon email
├── .htaccess               HTTPS, redirects, cache, siguri
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css       I gjithë stili (design tokens në krye)
    ├── js/main.js          Nav, filtra, akordeon, formular
    ├── data/jobs.json      Vendet e punës — përditësohen KËTU
    └── img/                Fotot dhe favicon
```

**Madhësia totale:** rreth 90 KB pa foto. Për krahasim, një faqe Wix ngarkon
zakonisht 2–5 MB JavaScript.

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

### Faza 2 — Mbushja e përmbajtjes (~3 orë)

5. Zëvendësoni në të gjitha faqet:
   - `Musterstraße 1` / `00000 Musterstadt` → adresa reale
   - `+49 000 0000000` → telefoni real (edhe te `href="tel:..."`, pa hapësira: `tel:+4930123456`)
   - `info@ake-personal.de` → email-i real
   - Tekstet e seksioneve → tekstet tuaja nga Faza 1

   Truk: gjeni e zëvendësoni në të gjitha file-t njëherësh:
   ```bash
   cd ake-personal
   grep -rl "Musterstadt" . | xargs sed -i 's/Musterstadt/Qyteti juaj/g'
   ```

6. Vendosni fotot te `assets/img/` dhe shtoni `<img>` aty ku duhet.
   Konvertojini në WebP para ngarkimit (te [squoosh.app](https://squoosh.app)) —
   kursen 60–80 % nga madhësia.

7. Ndryshoni ngjyrat: hapni `assets/css/style.css`, rreshtat 10–20.
   Ndryshoni vetëm `--c-brand` dhe `--c-accent` — gjithë faqja përshtatet vetë.

8. **Impressum + Datenschutz:** kopjoni tekstin real. Nëse s'jeni i sigurt,
   gjenerojeni te [e-recht24.de](https://www.e-recht24.de/impressum-generator.html).
   Në Gjermani një Impressum i gabuar sjell *Abmahnung* me kosto reale — mos e lini
   për në fund.

### Faza 3 — Vendet e punës

9. Hapni `assets/data/jobs.json` dhe futni vendet reale. Struktura:
   ```json
   {
     "id": "AKE-1001",
     "titel": "Produktionshelfer (m/w/d)",
     "ort": "Berlin",
     "branche": "Produktion",
     "art": "Vollzeit",
     "tags": ["Schichtarbeit", "Übernahme geplant"]
   }
   ```
   Filtrat (branche/ort) mbushen **automatikisht** nga ky file — nuk prekni HTML.
   Kur doni një vend të ri: shtoni një objekt, ngarkoni file-in, gati.

### Faza 4 — Formulari i kontaktit

10. Zgjidhni njërën:
    - **Me PHP** (rekomandohet nëse hosting-u ka PHP — shih seksionin 6)
    - **Pa PHP:** hapni llogari falas te [Formspree](https://formspree.io) dhe
      te `kontakt.html` ndryshoni `action="kontakt.php"` → `action="https://formspree.io/f/KODI_JUAJ"`

### Faza 5 — Testimi lokal

11. ```bash
    cd ake-personal
    python3 -m http.server 8000
    ```
    Hapni `http://localhost:8000`. **Duhet server** — `jobs.json` nuk ngarkohet
    nëse hapni file-in direkt me `file://`.

12. Kontrolloni: menuja në telefon, filtrat e punëve, formularin, të gjitha linqet.

### Faza 6 — Ngarkimi në server

13. Shih seksionin 5.

### Faza 7 — Kalimi i domain-it

14. Shih seksionin 8. **Mos e fshini Wix-in derisa e reja të punojë.**

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
- [ ] Të gjitha tekstet zëvendësuar (kërko `Muster` në projekt — nuk duhet të ketë rezultate)
- [ ] Adresa, telefoni, email-i realë kudo (edhe te `tel:` dhe JSON-LD te `index.html`)
- [ ] Impressum i plotë dhe i saktë
- [ ] Datenschutzerklärung e kontrolluar
- [ ] Fotot e ngarkuara, të optimizuara, me `alt` përshkrues
- [ ] Vendet e punës te `jobs.json`
- [ ] Logo dhe favicon të vërteta

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

**Vend i ri pune:** hapni `assets/data/jobs.json`, shtoni objektin, ngarkoni.

**Ndryshim teksti:** hapni file-in `.html` përkatës, ndryshoni, ngarkoni.

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
| Nxjerrja e përmbajtjes nga Wix | ju | 2 orë |
| Mbushja e teksteve dhe fotove | ju / unë | 3–4 orë |
| Impressum + Datenschutz | ju + jurist | 1 orë |
| Vendet e punës | ju | 30 min |
| Formulari + testim | ju / unë | 1 orë |
| Ngarkimi në server | ju | 1 orë |
| Kalimi i DNS-it + redirects | ju | 1 orë + pritje |
| **Totali** | | **~10 orë punë** |

---

## 12. Hapi tjetër

Dërgomëni:

1. **Tekstet reale** nga çdo faqe e Wix-it (kopjo-ngjit mjafton)
2. **Të dhënat e kontaktit**: adresa, telefoni, email-i, orari
3. **Impressum-in** ekzistues fjalë për fjalë
4. **Logon** dhe ngjyrat e markës (ose një screenshot i faqes aktuale)
5. **Listën e URL-ve të vjetra** për redirects

Me këto, e mbush projektin me përmbajtjen tuaj dhe faqja bëhet gati për ngarkim.
