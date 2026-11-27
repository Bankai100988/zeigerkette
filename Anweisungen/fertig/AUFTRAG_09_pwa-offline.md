# Auftrag 9: Tablet-Version (PWA) – Offline und Startbildschirm

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen, speichere sie jetzt selbst, ohne zu
  fragen:
  - `git add -A`
  - `git commit -m "Zwischenstand vor Schritt 9"`
  - Nur lokal, KEIN `git push`.
- Danach direkt mit dem Auftrag weitermachen.
- Nur wenn beim Speichern etwas schiefgeht, kurz melden und warten.

## Ziel
Das Programm wird eine installierbare Web-App (PWA):
- Es läuft nach dem ersten Laden auch ohne Internet.
- Auf dem Android-Tablet (HONOR Pad 9, Chrome) liegt es als Symbol auf dem
  Startbildschirm und startet wie eine App, ohne Browser-Leiste.
- Es wird später über GitHub Pages veröffentlicht, unter einer Adresse wie
  `https://bankai100988.github.io/zeigerkette/`. Das ist ein Unterordner, nicht
  die Hauptadresse einer Domain. Deshalb müssen ALLE Pfade relativ sein
  (zum Beispiel `./sw.js`, nie `/sw.js`).

## Wichtig: Bestehendes unverändert lassen
Alle Funktionen, Werte, Bereiche, Startwerte und das Aussehen bleiben genau so,
wie sie jetzt im Programm stehen. Dieser Auftrag fügt nur die Tablet-Technik
hinzu.

## Was gebaut wird

### 1. Manifest: `manifest.webmanifest`
Neue Datei im Hauptordner mit:
- `name`: „Zeigerketten-Spirograph" (Arbeitstitel, der Name wird später mit dem
  Sohn gewählt und dann hier geändert)
- `short_name`: „Zeigerkette"
- `start_url`: `./`
- `scope`: `./`
- `display`: `standalone`
- `background_color` und `theme_color`: der dunkle Hintergrundton des
  Programms
- `lang`: `de`
- `icons`: die Symbole aus Punkt 2 (192 und 512 Pixel, dazu ein „maskable"
  Symbol 512 Pixel)

### 2. Symbole im Ordner `icons/`
Ein einfaches, kindgerechtes Symbol: dunkler Hintergrund, zwei aneinander
hängende Stäbe (orange und blau wie im Programm) und eine kleine bunte
Spirallinie als Spur. KEIN Text, keine Namen, keine Fotos, keine persönlichen
Daten.
- `icons/icon-192.png` (192 × 192)
- `icons/icon-512.png` (512 × 512)
- `icons/icon-maskable-512.png` (512 × 512): das Motiv liegt in der sicheren
  Mitte (ca. 60 % der Fläche), der Hintergrund füllt das ganze Bild bis zum
  Rand, weil Android die Ecken abschneidet.
- `icons/apple-touch-icon.png` (180 × 180)
- Erzeuge die Bilder selbst mit einem kleinen Skript (Python mit Pillow oder
  Node, was verfügbar ist). Das Skript legst du NICHT im Projektordner ab.
  Lege im Projekt nur die fertigen PNG-Dateien ab.
- Prüfe, dass es echte PNG-Dateien in der richtigen Größe sind.

### 3. Service Worker: `sw.js`
Neue Datei im Hauptordner. Er sorgt dafür, dass die App offline läuft.
- Beim Installieren speichert er alle Dateien, die das Programm braucht, in
  einem Cache: `./` (die Startseite), `./index.html`,
  `./manifest.webmanifest` und die Symbole in `icons/`. Die Liste steht
  gut sichtbar oben in der Datei, damit man neue Dateien leicht ergänzen kann.
- Cache-Name mit Versionsnummer, zum Beispiel `zeigerkette-v1`.
- Beim Aktivieren löscht er alte Caches mit anderem Namen.
- Abrufe (`fetch`) für Dateien der eigenen Seite (gleiche Adresse):
  Zuerst im Netz holen (damit man mit Internet immer die neueste Version
  bekommt) und die Antwort im Cache aktualisieren. Klappt das Netz nicht
  (offline), die Datei aus dem Cache liefern. Wird die Startseite (Navigation)
  offline geöffnet, liefere die gecachte `index.html`.
- Nur GET-Anfragen der eigenen Adresse behandeln, alles andere durchlassen.
- Mit `skipWaiting` und `clients.claim`, damit eine neue Version sich ohne
  Umwege durchsetzt.
- Keine externen Adressen (keine CDN, keine Schriften, keine Analyse). Das
  Programm lädt nichts aus dem Internet außer den eigenen Dateien.

### 4. Änderungen in `index.html`
- Im `<head>`:
  - `<link rel="manifest" href="manifest.webmanifest">`
  - `<meta name="theme-color" content="…">` (dunkler Ton wie im Manifest)
  - `<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">`
  - Ein Viewport-Tag, falls noch nicht vorhanden
    (`width=device-width, initial-scale=1`)
- Den Service Worker registrieren, mit relativem Pfad und abgesichert:
  nur wenn `'serviceWorker' in navigator`, in `try/catch`, damit es beim
  einfachen Öffnen der Datei (ohne Server) keine Fehler gibt:
  `navigator.serviceWorker.register('./sw.js')`
- Kleine Tablet-Verbesserungen, damit sich die App wie eine App anfühlt und
  nichts versehentlich passiert (nur CSS, keine neue Funktion):
  - `overscroll-behavior: none` (kein „Herunterziehen zum Neuladen")
  - `-webkit-tap-highlight-color: transparent`
  - `user-select: none` für Knöpfe und Beschriftungen (kein versehentliches
    Markieren von Text beim langen Tippen)
  - `touch-action: manipulation` für Knöpfe (kein Doppeltipp-Zoom)
  - Die Regler und die Farbwahl (falls schon vorhanden) behalten ihr Verhalten.

## Zusätzlich in der CLAUDE.md
Füge im Abschnitt „Technik" genau diese Zeile hinzu:
- PWA: `manifest.webmanifest`, `sw.js` und der Ordner `icons/` gehören zum
  Programm. Alle Pfade sind relativ, weil es unter `/zeigerkette/`
  veröffentlicht wird. Kommt eine neue Datei dazu, die das Programm braucht,
  muss sie in der Dateiliste oben in `sw.js` stehen. Ändert sich diese
  Liste, die Versionsnummer des Caches in `sw.js` erhöhen.
Sonst nichts in der CLAUDE.md ändern.

## Was NICHT gebaut wird
Keine neuen Funktionen im Programm, kein Name/Logo mit Text, keine
Push-Nachrichten, keine Anmeldung, keine Speicherung von Mustern, kein
Hochladen und kein Veröffentlichen (das macht der Vater selbst).

## Prüfen
1. **Dateien:** Im Hauptordner liegen jetzt `index.html`,
   `manifest.webmanifest`, `sw.js` und `icons/` mit den vier PNG-Dateien.
   Prüfe, dass die Manifest-Datei gültiges JSON ist und alle Symbole darin
   wirklich existieren.
2. **Pfade:** Suche im Code nach Pfaden, die mit `/` beginnen oder auf eine
   feste Domain zeigen. Es darf keine geben (außer `//` in Kommentaren).
3. **Lokal testen mit einem kleinen Server:**
   - Starte im Projektordner einen einfachen lokalen Server, zum Beispiel
     `python -m http.server 8080`, und öffne `http://localhost:8080/` im
     Browser. Ein Service Worker funktioniert nur über `localhost` oder
     `https`, nicht beim Doppelklick auf die Datei.
   - Im Browser (Entwicklerwerkzeuge, Reiter „Anwendung"/„Application"):
     Das Manifest wird ohne Fehler erkannt, die Symbole werden angezeigt, der
     Service Worker steht auf „activated" (aktiv).
   - Offline-Test: Im Reiter „Netzwerk" „Offline" einschalten und die Seite
     neu laden. Das Programm startet und läuft normal (Stäbe, Regler, Spur).
   - Danach „Offline" wieder ausschalten.
   - Stoppe den lokalen Server am Ende wieder. Es darf nichts im Hintergrund
     weiterlaufen.
4. **Doppelklick-Test:** `index.html` direkt per Doppelklick öffnen: Das
   Programm läuft weiter normal, und es gibt keinen roten Fehler in der
   Konsole.
5. Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur die genannten Dateien anlegen oder ändern: `index.html`,
  `manifest.webmanifest`, `sw.js`, `icons/` (vier PNG-Dateien) und die eine
  Zeile in der CLAUDE.md (und das Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_09_pwa-offline.md`) selbst nach `Anweisungen/fertig`.
- Dann speichere den Stand selbst, ohne zu fragen:
  - `git add -A` (nimmt auch das Verschieben der Auftrags-Datei mit)
  - `git commit -m "Schritt 9: PWA fuer Tablet (offline, Startbildschirm)"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
- Zum Schluss in 2 bis 3 einfachen Sätzen sagen, was jetzt fertig ist, dass
  die Datei verschoben und der Stand gespeichert wurde und dass noch nichts
  hochgeladen wurde. Nenne außerdem in einem Satz, dass der Vater jetzt
  Teil 2 (hochladen mit `git push` und GitHub Pages einschalten) selbst
  machen kann.
