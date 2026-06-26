# Hegart Studio – Gutschein Generator

Eine eigenständige Web-App (eine einzige `index.html`) zum schnellen Erstellen, Teilen und Verifizieren von Gutscheinen.

## Funktionen

- **Erstellen** – Leistung und Betrag eingeben, die elegante Gutschein-Vorschau aktualisiert sich live. Jeder Gutschein erhält einen **QR-Code** mit eindeutigem Verifizierungs-Code.
- **Teilen** – Drucken / PDF, als Bild herunterladen, E-Mail, WhatsApp und „Teilen".
  - Am **Handy**: teilt das Bild direkt (Web Share) an WhatsApp, E-Mail usw.
  - Am **Desktop**: lädt das Bild herunter und öffnet den Kanal mit vorbereitetem Text.
- **Verlauf** – alle erstellten Gutscheine, gespeichert im Browser (localStorage). Erneut öffnen, teilen oder löschen.
- **Verifizieren** – Kamera starten, QR-Code scannen, alle Daten ansehen und als **„Eingelöst"** markieren (oder schließen).

## Technik

- Reines HTML/CSS/JS, keine Build-Tools, keine Server.
- QR-Erzeugung: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT), inline eingebettet.
- QR-Scannen: [jsQR](https://github.com/cozmo/jsQR) (Apache-2.0), inline eingebettet.
- Schriften: Cormorant Garamond + Jost (Google Fonts).
- Daten bleiben **lokal auf dem Gerät** (localStorage) – keine Datenübertragung.

## Nutzung

Einfach `index.html` im Browser öffnen.

> **Hinweis zur Kamera:** Der QR-Scan benötigt eine sichere Verbindung (HTTPS). Über GitHub Pages funktioniert das automatisch; lokal per `file://` ist der Kamerazugriff je nach Browser eingeschränkt.

## Veröffentlichen über GitHub Pages

1. Repository-Einstellungen → **Pages** → Branch auswählen (z. B. `main`) → Speichern.
2. Die App ist dann erreichbar unter `https://<benutzername>.github.io/gutschein/`.
