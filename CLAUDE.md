# Zeigerketten-Spirograph (Repository: zeigerkette)

## Worum es geht
Mehrere Stäbe (Zeiger) hängen aneinander und drehen sich mit unterschiedlicher
Länge und Geschwindigkeit. Die Spitze des letzten Stabs zeichnet Muster, die man
live verändern kann. (Fachwort: Epizykel. Mit zwei Stäben ist es ein Spirograph.)

Ein Vater baut das zusammen mit seinem Sohn (9 Jahre). Der Sohn liefert die Ideen.
Es soll Spaß machen und nie wie Hausaufgaben wirken. Der Vater ist kein
Programmierer und lernt GitHub dabei.

## Ziele
- Man sieht sofort etwas Schönes, auch ohne Vorkenntnisse.
- Ein 9-jähriges Kind kann es allein bedienen und damit experimentieren.
- Nebenbei entsteht ein Gefühl für Drehung, Geschwindigkeit und Verhältnisse.

## Technik
- Web-App (später PWA) mit HTML, JavaScript und Canvas. Keine Frameworks, keine
  Build-Werkzeuge.
- Entwickelt wird am Windows-PC (Browser-Test). Benutzt wird es auf einem
  Android-Tablet (HONOR Pad 9, 12,1 Zoll, Chrome, Touch).
- Es soll später auch ohne Internet laufen. Deshalb: keine Dateien aus dem
  Internet laden (keine CDN-Links, keine externen Schriften).
- Veröffentlicht wird später über GitHub Pages.
- PWA: `app.js` (das Programm selbst), `manifest.webmanifest`, `sw.js` und
  der Ordner `icons/` gehören zum Programm. Alle Pfade sind relativ, weil es unter `/zeigerkette/`
  veröffentlicht wird. Kommt eine neue Datei dazu, die das Programm braucht,
  muss sie in der Dateiliste oben in `sw.js` stehen. Ändert sich diese
  Liste, die Versionsnummer des Caches in `sw.js` erhöhen.
- Veröffentlicht über GitHub Pages (Zweig `main`, Hauptordner) unter
  `https://bankai100988.github.io/zeigerkette/`. Hochladen und Veröffentlichen
  nur, wenn der Vater es im Auftrag ausdrücklich sagt.

## Bedienung (feste Regeln)
- Große Knöpfe und Regler, die man mit dem Finger trifft (mindestens ca. 48 px).
- Kaum Text. Alle Beschriftungen auf Deutsch.
- Alles wirkt sofort, es gibt keinen „Übernehmen"-Knopf.
- Nichts kann kaputtgehen: Jede Einstellung ist erlaubt.
- Alle Regler gehen von 0 bis 100, Startwert 50. Länge 1 = 3 Pixel
  (Standardansicht), Länge ist proportional. Tempo: 0 = Stillstand,
  50 = 2 Umdrehungen pro Sekunde, 100 = 15 Umdrehungen pro Sekunde (dazwischen
  nicht linear, wie in `demos/tempo-demo.html`). Gesamt-Tempo 50 = normal,
  100 = ×50.
- Neben jedem Regler steht die Zahl. Eingabe über das eigene Ziffernfeld
  der App, nie über die Tastatur des Systems.
- Jeder Stab bekommt automatisch eine eigene Startfarbe und kann seine Farbe
  mit dem Farbwähler (Farbfeld und Helligkeitsregler) ändern. Die Farbe gilt
  für Stab und Spur zusammen.
- Jeder Stab dreht sich relativ zum vorherigen Stab (sein Tempo kommt zur
  Drehung des Stabs davor dazu).

## Arbeitsregeln für Claude Code
- Nur das tun, was in der Auftrags-Datei steht. Keine zusätzlichen Dateien,
  Funktionen oder Änderungen ohne Auftrag. Bei Unklarheit nachfragen
  (höchstens 1 bis 2 Fragen auf einmal).
- Ein Schritt nach dem anderen. Lieber klein und fertig als groß und halb.
- NICHTS zu GitHub hochladen (kein push) und nichts veröffentlichen, solange
  der Vater es nicht ausdrücklich sagt.
- Am Ende jedes Schritts vorschlagen, den Stand zu speichern (git commit).
  Der Vater entscheidet.
- Kurz und einfach schreiben, so dass auch ein Kind es versteht. Fachwörter
  erklären.

## Leistung (feste Regeln)
- Die Spuren werden nie in jedem Bild komplett neu gemalt. Neue Stücke werden
  auf die Spur-Ebene dazugemalt. Ein Neuaufbau geschieht nur bei einer
  Änderung der Ansicht und schrittweise.
- In der Rechen- und Zeichenschleife werden keine Werte aus der Seite gelesen
  und keine neuen Objekte angelegt.
- Zeitbudget pro Bild, Wächter und Notbremse bleiben immer eingebaut und
  dürfen nicht abgeschwächt werden.
- Linien werden in kurzen Pfaden gemalt (nicht ein langer Pfad pro Stab),
  und pro Bild gilt ein Längenbudget für gemalte Linien. Beides ist für die
  Grafikkarte nötig und darf nicht „vereinfacht" werden.
- Jede neue Funktion wird mit gebremstem Prozessor (Chrome, 6-fach) und
  `?fps` geprüft, bevor sie fertig ist.

## Datenschutz
Keine Namen, Fotos oder persönlichen Daten des Kindes in Code, Dateien,
Kommentaren oder Commit-Texten. Das Repository ist öffentlich.

## Etappen (Überblick, nur zur Orientierung, nicht ohne Auftrag bauen)
1. Grundversion: 1 bis 3 Stäbe, Regler für Länge und Tempo, Drehrichtung, Spur
   mit Knopf an/aus, Start/Pause, Spuren löschen, automatischer Bildausschnitt.
2. Mehr Spielraum: Name, Zahleneingabe, Zoomen, bis 8 Stäbe, Farben,
   „Überrasch mich".
3. Behalten und teilen: Muster speichern, PNG-Export.
4. Ideen für später: Fourier-Zeichnen, Zahnrad-Spirograph, Android-App.

## Stand
- Etappe 1 (Grundversion) ist fertig: bis zu 8 Stäbe, Regler für Länge und
  Tempo, Drehrichtung, Spur pro Stab, Start/Pause, Löschen, Gesamt-Tempo und
  automatischer Bildausschnitt.
- Erledigte Aufträge liegen in `Anweisungen/fertig`.
