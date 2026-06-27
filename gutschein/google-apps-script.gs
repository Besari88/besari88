/**
 * Hegart Studio – Gutschein Sync (Google Apps Script Backend)
 * ------------------------------------------------------------
 * Macht aus einer Google-Tabelle die gemeinsame Datenbank für mehrere Geräte.
 *
 * EINRICHTUNG (einmalig, ca. 5 Minuten):
 *  1. Neue Google-Tabelle erstellen (sheets.new) und benennen, z. B. "Hegart Gutscheine".
 *  2. Menü: Erweiterungen → Apps Script.
 *  3. Den gesamten Code in dieser Datei in den Editor einfügen (Code.gs ersetzen) und speichern.
 *  4. Oben rechts: Bereitstellen → Neue Bereitstellung → Typ: Web-App.
 *       - Ausführen als: Ich
 *       - Zugriff: Jeder (mit dem Link)
 *     → Bereitstellen, Zugriff autorisieren.
 *  5. Die angezeigte Web-App-URL (endet auf /exec) kopieren.
 *  6. In der Gutschein-App: Tab "Verlauf" → "Google-Tabelle (Sync)" → URL einfügen → "Verbinden".
 *  7. Dieselbe URL auf allen 2–3 Geräten eintragen. Fertig.
 *
 * Die Tabelle "Gutscheine" wird automatisch mit Kopfzeile angelegt.
 */

// >>> WICHTIG: hier denselben geheimen Token eintragen, den du auch in der App eingibst.
// Ersetze den Platzhalter durch deinen eigenen Token (z. B. das in der App generierte 'hegart-...').
var SECRET = 'DEIN-GEHEIMER-TOKEN';

// >>> Trage hier die ID deiner Google-Tabelle ein.
// Sie steht in der Tabellen-URL zwischen /d/ und /edit:
//   https://docs.google.com/spreadsheets/d/  DIESE-ID  /edit
var SHEET_ID = 'HIER-DEINE-SHEET-ID';

var SHEET_NAME = 'Gutscheine';
var HEADERS = ['id','leistung','betrag','waehrung','empfaenger','gueltigBis','tpl','status','createdAt','eingeloestAt'];

function authOK_(token) { return SECRET && String(token||'') === SECRET; }

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); }
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); }
  return sh;
}

function rows_(sh) {
  var v = sh.getDataRange().getValues();
  v.shift(); // header
  return v.filter(function(r){ return r[0]; }).map(function(r){
    var o = {}; HEADERS.forEach(function(h,i){ o[h] = r[i]==null ? '' : String(r[i]); }); return o;
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function nextId_(sh) {
  var yr = new Date().getFullYear(), max = 0;
  rows_(sh).forEach(function(r){
    var m = /HS-(\d{4})-(\d+)/.exec(r.id);
    if (m && Number(m[1]) === yr) max = Math.max(max, Number(m[2]));
  });
  return 'HS-' + yr + '-' + ('000' + (max + 1)).slice(-4);
}

function doGet(e) {
  if (!authOK_(e && e.parameter && e.parameter.token)) return json_({ ok: false, error: 'unauthorized' });
  var sh = getSheet_();
  var action = (e && e.parameter && e.parameter.action) || 'list';
  if (action === 'get') {
    var id = e.parameter.id;
    var hit = rows_(sh).filter(function(x){ return x.id === id; })[0] || null;
    return json_({ ok: true, rec: hit });
  }
  return json_({ ok: true, rows: rows_(sh) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (!authOK_(body.token)) return json_({ ok: false, error: 'unauthorized' });
    var sh = getSheet_();
    var action = body.action;

    if (action === 'save') {
      var rec = body.rec || {};
      var all = rows_(sh);
      var idx = rec.id ? indexOfId_(all, rec.id) : -1;
      if (idx < 0) {
        if (!rec.id) rec.id = nextId_(sh);
        rec.status = rec.status || 'aktiv';
        rec.createdAt = rec.createdAt || new Date().toISOString();
        rec.eingeloestAt = rec.eingeloestAt || '';
        sh.appendRow(HEADERS.map(function(h){ return rec[h] != null ? rec[h] : ''; }));
      } else {
        var ex = all[idx];
        ['leistung','betrag','waehrung','empfaenger','gueltigBis','tpl'].forEach(function(k){
          if (rec[k] != null) ex[k] = rec[k];
        });
        sh.getRange(idx + 2, 1, 1, HEADERS.length).setValues([HEADERS.map(function(h){ return ex[h] != null ? ex[h] : ''; })]);
        rec.id = ex.id;
      }
      return json_({ ok: true, rec: rows_(sh).filter(function(x){ return x.id === rec.id; })[0] });
    }

    if (action === 'redeem') {
      var all2 = rows_(sh);
      var i2 = indexOfId_(all2, body.id);
      if (i2 < 0) return json_({ ok: false, error: 'not_found' });
      if (all2[i2].status === 'eingeloest') return json_({ ok: true, already: true, rec: all2[i2] });
      all2[i2].status = 'eingeloest';
      all2[i2].eingeloestAt = new Date().toISOString();
      sh.getRange(i2 + 2, 1, 1, HEADERS.length).setValues([HEADERS.map(function(h){ return all2[i2][h] != null ? all2[i2][h] : ''; })]);
      return json_({ ok: true, rec: all2[i2] });
    }

    if (action === 'get') {
      var hit2 = rows_(sh).filter(function(x){ return x.id === body.id; })[0] || null;
      return json_({ ok: true, rec: hit2 });
    }

    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function indexOfId_(arr, id) {
  for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return i;
  return -1;
}
