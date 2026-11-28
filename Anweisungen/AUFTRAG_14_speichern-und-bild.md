# Auftrag 14: Muster speichern (Bibliothek) und Bild exportieren

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen, speichere sie selbst, ohne zu fragen:
  `git add -A` und `git commit -m "Zwischenstand vor Schritt 14"` (nur lokal).

## Ziel
1. Man kann die aktuellen Einstellungen mit einem Vorschaubild in einer
   Bibliothek „Meine Muster" speichern und später wieder laden. Beim Laden
   beginnt die Zeichnung von vorn.
2. Man kann die aktuelle Zeichnung als PNG-Bild exportieren, ohne Stäbe.

## Datenschutz (sehr wichtig)
- Alles bleibt ausschließlich auf dem jeweiligen Gerät. Nichts wird
  hochgeladen, nichts geht ins Internet, keine Konten, keine Analyse.
- Gespeichert wird nur in der IndexedDB des Browsers (lokaler Speicher).
- Keine Namen oder persönlichen Daten in Einträgen oder Dateinamen.

## Teil A: Knöpfe in der Leiste
- Im unteren, immer sichtbaren Bereich der Leiste kommt eine Zeile mit drei
  großen Knöpfen dazu (Symbol plus ein kurzes Wort):
  - „💾 Speichern"
  - „📚 Muster" (öffnet die Bibliothek)
  - „🖼 Bild" (exportiert die Zeichnung)
- Fingergroß (mindestens ca. 48 px), Stil wie die übrigen Knöpfe, nichts darf
  über den Rand ragen (Regeln aus Auftrag 8 gelten weiter).

## Teil B: Speichern
- Ein Tipp auf „Speichern" legt einen neuen Eintrag an mit:
  - `version` (Zahl, zum Beispiel 1, für spätere Änderungen am Format)
  - `datum` (Zeitpunkt des Speicherns)
  - `einstellungen`: Gesamt-Tempo und für jeden Stab Länge, Tempo, Richtung,
    Farbe und Spur an/aus
  - `vorschau`: ein Vorschaubild (siehe unten) als Bild-Blob
- Vorschaubild: ca. 300 × 300 Pixel, dunkler Hintergrund wie im Programm,
  nur die Spuren, KEINE Stäbe. Am einfachsten aus der vorhandenen
  Spur-Ebene verkleinert kopieren (quadratischer Ausschnitt um die Mitte),
  nicht neu aus allen Punkten rechnen. Läuft gerade ein Neuaufbau der
  Spur-Ebene, warte, bis er fertig ist.
- Danach erscheint für ca. 1,5 Sekunden ein kurzer Hinweis „✓ Gespeichert".
- Beim ersten Speichern einmal `navigator.storage.persist()` aufrufen, damit
  der Browser den Speicher möglichst dauerhaft behält (ohne Meldung an das
  Kind, Ergebnis egal).
- Höchstens 300 Einträge. Ist die Bibliothek voll, erscheint statt des
  Speicherns kurz der Hinweis „Bibliothek voll" mit Symbol.
- Ist IndexedDB nicht verfügbar (zum Beispiel in manchen Browsern beim
  Doppelklick auf die Datei), sind „Speichern" und „Muster" ausgegraut. Das
  Programm läuft trotzdem normal.

## Teil C: Bibliothek „Meine Muster"
- Ein Tipp auf „Muster" öffnet ein großes Fenster über der Zeichenfläche mit
  der Überschrift „Meine Muster" und einem großen ✕ zum Schließen.
- Darin ein Raster mit den Vorschaubildern, neueste zuerst. Jede Kachel ist
  mindestens ca. 140 px groß, darunter klein das Datum (zum Beispiel
  „28.11. 11:45"). Das Fenster lässt sich senkrecht scrollen.
- Ist die Bibliothek leer: großes Symbol 📚 und „Noch keine Muster".
- **Laden:** Ein Tipp auf ein Vorschaubild
  - setzt die Anzahl der Stäbe und alle Werte (Länge, Tempo, Richtung,
    Farbe, Spur an/aus) und das Gesamt-Tempo, inklusive Reglern und
    Zahlenknöpfen,
  - stellt alle Stäbe in die Startstellung (alle Winkel 0, wie beim
    Programmstart),
  - löscht die Spuren und setzt den Bildausschnitt zurück,
  - schließt die Bibliothek und startet den Ablauf (nicht pausiert).
  So entsteht dasselbe Muster wieder von vorn.
- **Löschen:** Jede Kachel hat oben rechts ein ✕ (mindestens ca. 48 px). Ein
  Tipp darauf fragt nach: „Wirklich löschen?" mit den Knöpfen „Ja" und
  „Nein". Erst bei „Ja" wird der Eintrag gelöscht.
- Geladene Werte werden geprüft, damit nichts kaputtgehen kann: 1 bis 8
  Stäbe, alle Werte auf 0 bis 100 begrenzt, Richtung 1 oder −1, gültige
  Farbe. Ungültiges wird durch Startwerte ersetzt. Ein kaputter Eintrag darf
  das Programm nie anhalten.
- Vorschaubilder als Objekt-URLs anzeigen und diese beim Schließen wieder
  freigeben (Speicher).
- Es ist immer nur ein Fenster offen (Bibliothek, Ziffernfeld, Farbwahl oder
  Notbremse). Die Stäbe drehen im Hintergrund weiter.

## Teil D: Bild exportieren
- Ein Tipp auf „Bild" malt die aktuelle Zeichnung neu als PNG:
  - Größe 2048 × 2048 Pixel.
  - Dunkler Hintergrund wie im Programm.
  - Nur die Spuren, KEINE Stäbe, keine Gelenkpunkte.
  - Ausschnitt: alle gespeicherten Spurpunkte, mittig, mit ca. 5 % Rand.
  - Neu aus den gespeicherten Punkten gemalt (nicht vom Bildschirm kopiert),
    mit Lücken und den Farben der Stäbe. Die Linienbreite wirkt im Verhältnis
    wie auf dem Bildschirm.
- Leistung (Regeln aus der CLAUDE.md): Zu Beginn eine Kopie der Punkte
  anlegen, dann schrittweise über mehrere Bilder malen, mit Zeitbudget pro
  Bild und kurzen Pfaden. Das Programm darf dabei nicht ruckeln. Während des
  Exports zeigt der Knopf „Bild" einen kleinen Fortschritt (zum Beispiel
  „🖼 …"), ein zweiter Tipp wird ignoriert.
- Danach als Datei herunterladen, Dateiname
  `zeigerkette-JJJJ-MM-TT-hh-mm.png`. Am PC landet sie im Download-Ordner, auf
  dem Tablet ebenfalls im Download-Ordner (Galerie).
- Gibt es noch keine Spur, ist „Bild" ausgegraut.
- Hinweis „✓ Bild gespeichert" für ca. 1,5 Sekunden.

## Teil E: Sonstiges
- Alles in `app.js`, keine neuen Programmdateien. Cache-Version in `sw.js`
  um eins erhöhen.
- Keine Änderung am Herzstück außer dem, was für Laden (Startstellung) und
  Export nötig ist. Zeitbudget, Wächter und Notbremse bleiben unverändert.

## Zusätzlich in der CLAUDE.md
1. Ergänze im Abschnitt „Datenschutz" diese Zeile:
   - Die Bibliothek „Meine Muster" liegt nur lokal in der IndexedDB des
     Geräts. Nichts davon wird hochgeladen oder geteilt.
2. Ersetze im Abschnitt „Stand" die Aufzählung durch eine aktuelle Fassung:
   Etappe 1 fertig, dazu Zahleneingabe (0–100), Bibliothek „Meine Muster"
   und Bild-Export.
Sonst nichts in der CLAUDE.md ändern.

## Was NICHT gebaut wird
Keine Namen für Muster, kein Teilen, keine Cloud, kein Video, kein Zoomen mit
Fingern, kein „Überrasch mich", kein Import/Export der Bibliothek als Datei.

## Prüfen
Teste wie in Auftrag 11 in einem separaten Chrome mit leerem Testprofil über
einen lokalen Server, gesteuert über das DevTools-Protokoll (dort lässt sich
der Prozessor bremsen). Nicht im Profil des Vaters testen. Die Downloads des
Testprofils in einen Temp-Ordner lenken.
- Speichern: 3 Muster speichern, Seite neu laden: Alle 3 sind noch da, mit
  Vorschaubild und Datum, neueste zuerst.
- Laden: Ein Muster laden: Werte, Regler, Zahlen, Farben, Richtungen,
  Stab-Anzahl stimmen, die Zeichnung beginnt von vorn. Gleiches Muster zweimal
  laden: Es entsteht beide Male dasselbe Bild (Bildschirmfoto nach gleicher
  Zeit vergleichen).
- Löschen: ✕ → „Nein" lässt den Eintrag stehen, „Ja" löscht ihn.
- Leer: Alle löschen → „Noch keine Muster".
- Kaputter Eintrag: Einen Eintrag mit unsinnigen Werten direkt in die
  IndexedDB schreiben und laden → Programm läuft weiter mit Startwerten.
- Export: PNG ist 2048 × 2048, dunkler Hintergrund, keine Stäbe, alles
  sichtbar, Lücken richtig. Ohne Spur ist „Bild" grau.
- Leistung: 6-fach gebremster Prozessor, `?fps`, schlimmster Fall (8 Stäbe,
  alle Spuren an, alle Werte 100): Export starten und Bibliothek mit ca. 50
  Einträgen öffnen und scrollen. Es bleibt flüssig, die Notbremse kommt
  nicht. Zahlen im Bericht nennen.
- Doppelklick auf `index.html`: Programm läuft. Sind Speichern/Muster dort
  nicht möglich, sind die Knöpfe grau, und es gibt keine Fehler.
- Kurz in Firefox prüfen, dass Speichern, Laden und Export funktionieren.
- Keine Fehler in der Konsole.
- Am Ende: Test-Server und Test-Browser beenden, Testprofil, Testeinträge und
  heruntergeladene Testbilder im Temp-Ordner löschen.

## Abschluss
- Geändert werden nur `index.html` (falls nötig), `app.js`, `sw.js`
  (Version), die CLAUDE.md (wie beschrieben) und das Verschieben dieser
  Auftrags-Datei.
- Diese Auftrags-Datei (`AUFTRAG_14_speichern-und-bild.md`) selbst nach
  `Anweisungen/fertig` verschieben.
- Selbst speichern: `git add -A` und
  `git commit -m "Schritt 14: Bibliothek Meine Muster und Bild-Export"` (nur
  lokal, KEIN `git push`).
- In 3 bis 5 einfachen Sätzen sagen, was jetzt zu sehen ist, wie man es
  benutzt, und die Messzahlen nennen.
