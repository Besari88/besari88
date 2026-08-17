<?php
/**
 * kontakt.php — pranon formularin nga kontakt.html dhe dërgon email.
 *
 * KËRKESA: hosting me PHP 7.4+ dhe funksionin mail() të aktivizuar
 * (pothuajse çdo hosting gjerman: IONOS, Strato, All-Inkl, Hetzner, Netcup).
 *
 * KONFIGURIM: ndrysho vetëm konstantet më poshtë.
 *
 * SHËNIM I RËNDËSISHËM: mail() shpesh përfundon në spam sepse serveri nuk ka
 * SPF/DKIM për domain-in. Zgjidhja e sigurt është PHPMailer me SMTP —
 * shih README.md, seksioni 6.
 */

declare(strict_types=1);

// ───────── Konfigurimi ─────────
const MAIL_TO       = 'info@ake-personal.de';        // ku vijnë mesazhet
const MAIL_FROM     = 'noreply@ake-personal.de';     // DUHET të jetë në domain-in tuaj
const MAIL_SUBJECT  = 'Neue Anfrage über ake-personal.de';
const REDIRECT_OK   = 'danke.html';                  // përdoret vetëm pa JavaScript
const MAX_LEN       = 5000;

// ───────── Ndihmës ─────────
function wantsJson(): bool {
    return isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json');
}

function respond(int $code, string $message): never {
    http_response_code($code);
    if (wantsJson()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $code < 400, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!DOCTYPE html><meta charset="utf-8">'
           . '<title>' . ($code < 400 ? 'Danke' : 'Fehler') . '</title>'
           . '<p style="font-family:sans-serif;padding:2rem">' . htmlspecialchars($message, ENT_QUOTES) . '</p>'
           . '<p style="font-family:sans-serif;padding:0 2rem"><a href="kontakt.html">Zurück zum Formular</a></p>';
    }
    exit;
}

/** Heq CR/LF — mbrojtje kundër header injection në Subject/From. */
function clean(string $v): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));
}

// ───────── 1. Vetëm POST ─────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, 'Methode nicht erlaubt.');
}

// ───────── 2. Honeypot ─────────
if (!empty($_POST['website'])) {
    // Bot: përgjigju me sukses që të mos mësojë asgjë.
    respond(200, 'Vielen Dank für Ihre Nachricht.');
}

// ───────── 3. Rate limiting i thjeshtë (një mesazh / 30 sek / IP) ─────────
$lockFile = sys_get_temp_dir() . '/ake_' . md5($_SERVER['REMOTE_ADDR'] ?? 'cli');
if (is_file($lockFile) && (time() - (int) filemtime($lockFile)) < 30) {
    respond(429, 'Bitte warten Sie einen Moment, bevor Sie erneut senden.');
}
@touch($lockFile);

// ───────── 4. Leximi dhe validimi ─────────
$vorname    = clean((string) ($_POST['vorname']   ?? ''));
$nachname   = clean((string) ($_POST['nachname']  ?? ''));
$email      = clean((string) ($_POST['email']     ?? ''));
$telefon    = clean((string) ($_POST['telefon']   ?? ''));
$nachricht  = trim((string)  ($_POST['nachricht'] ?? ''));

$errors = [];
if ($vorname === '')                                         $errors[] = 'Vorname fehlt.';
if ($nachname === '')                                        $errors[] = 'Nachname fehlt.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))              $errors[] = 'E-Mail-Adresse ungültig.';
if (mb_strlen($nachricht) > MAX_LEN)                         $errors[] = 'Nachricht zu lang.';

if ($errors) {
    respond(422, 'Bitte prüfen Sie Ihre Eingaben: ' . implode(' ', $errors));
}

// ───────── 5. Ndërtimi i email-it ─────────
$body = "Neue Anfrage über ake-personal.de\n"
      . str_repeat('=', 44) . "\n\n"
      . "Name:      {$vorname} {$nachname}\n"
      . "E-Mail:    {$email}\n"
      . "Telefon:   " . ($telefon ?: '—') . "\n\n"
      . "Nachricht:\n" . ($nachricht ?: '—') . "\n\n"
      . str_repeat('-', 44) . "\n"
      . "Gesendet:  " . date('d.m.Y H:i:s') . "\n"
      . "IP:        " . ($_SERVER['REMOTE_ADDR'] ?? '—') . "\n";

$subject = MAIL_SUBJECT;

$headers = [
    'From: AKE Website <' . MAIL_FROM . '>',
    'Reply-To: ' . $vorname . ' ' . $nachname . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = mail(
    MAIL_TO,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers),
    '-f' . MAIL_FROM
);

if (!$sent) {
    error_log('[ake-personal] mail() fehlgeschlagen für ' . $email);
    respond(500, 'Die Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an.');
}

// ───────── 6. Sukses ─────────
if (wantsJson()) {
    respond(200, 'Vielen Dank! Ihre Nachricht ist bei uns eingegangen.');
}
header('Location: ' . REDIRECT_OK, true, 303);
exit;
