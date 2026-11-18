# Sapore Restaurant – sapore-restaurant.fr

Kopje statike (HTML/CSS) e faqes së ndërtuar më parë me Hostinger AI Builder.
Nuk ka nevojë për server, PHP apo databazë: çdo hosting statik falas funksionon.

## Struktura
- `index.html`, `menu.html`, `a-propos.html`, `contact.html` – faqet në frëngjisht
- `en/` – faqet në anglisht
- `assets/` – CSS, fonte, foto dhe `site.js` (animacionet, menuja mobile, forma)

Forma „Envoyer" hap programin e email-it të vizitorit me mesazhin drejtuar
`reserve@sapore-restaurant.fr`.

## Publikimi në Netlify (falas)
1. netlify.com → Add new site → Import from GitHub → zgjidh këtë repo.
2. Base directory: `sapore-restaurant` · Build command: (bosh) · Publish directory: `sapore-restaurant`.
3. Domain management → Add domain → `sapore-restaurant.fr`.
4. Te Hostinger → Domains → sapore-restaurant.fr → DNS, vendos:
   - `A` @ → `75.2.60.5`
   - `CNAME` www → `<emri-i-faqes>.netlify.app`
   (fshi rekordet e vjetra `A`/`CNAME` për @ dhe www; MX-të e email-it mos i prek)
