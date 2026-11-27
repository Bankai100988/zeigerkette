# Auftrag 10: Zu GitHub hochladen und mit GitHub Pages veröffentlichen

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ausdrückliche Erlaubnis des Vaters (gilt NUR für diesen Auftrag)
Der Vater erlaubt dir in DIESEM Auftrag ausdrücklich:
- `git push` zum Repository `Bankai100988/zeigerkette` (öffentlich),
- GitHub Pages für dieses Repository einzuschalten.
Für spätere Aufträge gilt weiter die Regel aus der CLAUDE.md: Hochladen nur,
wenn der Vater es in dem jeweiligen Auftrag ausdrücklich sagt.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben.

## Ziel
Das Programm ist unter einer Internet-Adresse erreichbar, sodass der Vater es
auf dem Tablet öffnen und als App installieren kann. Erwartete Adresse:
`https://bankai100988.github.io/zeigerkette/`

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen, speichere sie selbst, ohne zu fragen:
  `git add -A` und `git commit -m "Zwischenstand vor Schritt 10"` (nur lokal).

## Schritt 1: Sicherheitsprüfung vor dem Hochladen
Das Repository ist öffentlich. Alles, was hochgeladen wird, ist für jeden
sichtbar und lässt sich schwer wieder entfernen. Prüfe deshalb vorher, ohne
etwas zu verändern:
1. **Persönliche Daten:** Suche in allen Dateien, die im Repository liegen
   (`git ls-files`), nach Namen, E-Mail-Adressen, Telefonnummern, Fotos,
   Pfaden wie `C:\Users\...`, Tokens, Passwörtern und Schlüsseln. Es darf
   nichts Persönliches vom Kind oder von der Familie vorkommen.
2. **Nicht hochladen:** `.claude/settings.local.json` darf nicht im
   Repository sein (`git ls-files .claude` prüfen). Ist sie dort oder in der
   Historie, STOPPE und melde es dem Vater.
3. **Autor in den Commits:** Zeige mit `git log --format="%an <%ae>" | sort -u`,
   welche Namen und E-Mail-Adressen in den Commits stehen. Diese werden
   öffentlich sichtbar.
   - Ist es eine GitHub-Adresse der Form `…@users.noreply.github.com`, ist
     alles in Ordnung.
   - Ist es eine echte E-Mail-Adresse, STOPPE vor dem Hochladen, nenne dem
     Vater die Adresse und frage, ob das so bleiben soll. Ändere von dir aus
     nichts an Autor oder Historie.
4. **Dateiliste:** Gib dem Vater kurz die Liste der Dateien, die
   hochgeladen werden (`git ls-files`).
Gibt es bei 1 bis 3 ein Problem, STOPPE, melde es und warte.

## Schritt 2: CLAUDE.md ergänzen
Füge in der CLAUDE.md im Abschnitt „Technik" genau diese Zeile hinzu:
- Veröffentlicht über GitHub Pages (Zweig `main`, Hauptordner) unter
  `https://bankai100988.github.io/zeigerkette/`. Hochladen und Veröffentlichen
  nur, wenn der Vater es im Auftrag ausdrücklich sagt.
Sonst nichts ändern. (Den Namen des Zweigs prüfst du in Schritt 3. Heißt er
nicht `main`, passe das Wort in dieser Zeile an.)

## Schritt 3: Hochladen
1. Prüfe `git remote -v`: Das Ziel muss `Bankai100988/zeigerkette` auf GitHub
   sein. Prüfe den Zweig mit `git branch --show-current`.
2. Verschiebe diese Auftrags-Datei (`AUFTRAG_10_veroeffentlichen.md`) nach
   `Anweisungen/fertig`.
3. Speichere: `git add -A` und
   `git commit -m "Schritt 10: Veroeffentlichung vorbereitet"` (nur lokal).
4. Lade hoch: `git push origin <Zweig>`.
   - Wird der Push abgelehnt, weil auf GitHub schon etwas anderes liegt
     (zum Beispiel die README), versuche einmal `git pull --rebase origin
     <Zweig>` und dann erneut `git push`. Gibt es Konflikte, STOPPE und
     melde sie.
   - NIEMALS `--force` oder `--force-with-lease` verwenden. Nie Historie
     umschreiben.
   - Schlägt die Anmeldung bei GitHub fehl (Fehler zu Authentifizierung oder
     Berechtigung), STOPPE und sag dem Vater genau, was die Meldung war.
   - Wird dir `git push` von einer Berechtigungsprüfung blockiert, melde das
     dem Vater (er muss dann die Erlaubnis in den Einstellungen freigeben).
     Versuche nicht, Einstellungen oder Schutzregeln selbst zu ändern oder
     zu umgehen.

## Schritt 4: GitHub Pages einschalten
1. Prüfe, ob das GitHub-Werkzeug `gh` installiert und angemeldet ist
   (`gh auth status`). Gib dabei keine Zugangsdaten oder Tokens aus.
2. Ist Pages schon eingeschaltet? Prüfe mit
   `gh api repos/Bankai100988/zeigerkette/pages`. Wenn ja, kontrolliere, dass
   Quelle = Zweig (`main`) und Ordner = `/` ist, und ändere nur, wenn es
   abweicht.
3. Wenn nicht eingeschaltet: Schalte es ein mit
   `gh api -X POST repos/Bankai100988/zeigerkette/pages -f "source[branch]=main" -f "source[path]=/"`
   (Zweigname wie in Schritt 3).
4. Ist `gh` nicht installiert oder nicht angemeldet, oder wird der Befehl
   blockiert oder schlägt fehl: STOPPE bei diesem Schritt und schreibe dem
   Vater eine kurze Anleitung zum Einschalten per Hand (GitHub im Browser →
   Repository → Settings → Pages → „Deploy from a branch" → `main` / `/ (root)`
   → Save). Das Hochladen aus Schritt 3 bleibt gültig.

## Schritt 5: Prüfen, ob es online ist
1. Warte, bis GitHub die Seite gebaut hat. Das dauert meist 1 bis 3 Minuten.
   Prüfe etwa alle 20 Sekunden (höchstens ca. 5 Minuten), zum Beispiel mit
   `gh api repos/Bankai100988/zeigerkette/pages/builds/latest` (Status
   `built`) oder indem du die Adresse abrufst.
2. Rufe diese Adressen ab (zum Beispiel mit `curl -I`) und prüfe, dass sie
   Status 200 liefern:
   - `https://bankai100988.github.io/zeigerkette/`
   - `https://bankai100988.github.io/zeigerkette/manifest.webmanifest`
   - `https://bankai100988.github.io/zeigerkette/sw.js`
   - `https://bankai100988.github.io/zeigerkette/icons/icon-192.png`
   - `https://bankai100988.github.io/zeigerkette/icons/icon-512.png`
3. Wenn möglich, prüfe wie beim PWA-Test mit einem leeren Test-Chrome-Profil
   (nicht mit dem normalen Profil des Vaters), dass auf der Live-Adresse der
   Service Worker „activated" ist und das Manifest ohne Fehler erkannt wird.
   Beende danach den Test-Browser wieder.
4. Stimmt die Adresse nicht mit der erwarteten überein (zum Beispiel wegen
   Groß-/Kleinschreibung), korrigiere die Zeile in der CLAUDE.md, speichere
   und lade noch einmal hoch.
5. Prüfe am Ende, dass nichts im Hintergrund weiterläuft.

## Was NICHT gemacht wird
- Kein `--force`, keine Änderung an Historie, Autor oder Einstellungen des
  Vaters (außer dem Einschalten von Pages).
- Keine Änderung an `index.html` oder anderen Programmdateien.
- Keine Änderung der Repository-Sichtbarkeit (bleibt öffentlich).
- Keine Zugangsdaten, Tokens oder E-Mail-Adressen in Antworten ausgeben.
- Kein Löschen von Dateien oder Branches auf GitHub.

## Abschluss
- Zum Schluss in 3 bis 5 einfachen Sätzen sagen:
  - ob alles hochgeladen und Pages eingeschaltet ist,
  - die genaue Adresse, unter der das Programm jetzt erreichbar ist,
  - was die Prüfung ergeben hat,
  - und den nächsten Schritt für den Vater: die Adresse auf dem Tablet in
    Chrome öffnen und über das Menü ⋮ „App installieren" bzw. „Zum
    Startbildschirm hinzufügen" wählen.
- Hat etwas nicht geklappt, sage genau, an welchem Schritt es hing und was
  der Vater tun muss.
- Der Stand ist bereits lokal gespeichert (Schritt 3). Entstehen später in
  diesem Auftrag noch Änderungen (zum Beispiel die korrigierte
  Adresse), speichere und lade sie mit hoch.
