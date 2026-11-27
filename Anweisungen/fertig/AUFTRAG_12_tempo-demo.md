# Auftrag 12: Demo-Seite zum Ausprobieren der Geschwindigkeiten

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen, speichere sie selbst, ohne zu fragen:
  `git add -A` und `git commit -m "Zwischenstand vor Schritt 12"` (nur lokal).

## Hintergrund
Im nächsten Schritt bekommen alle Regler den Bereich 0 bis 100 (Startwert 50).
Vorher wollen Vater und Sohn ausprobieren, wie schnell sich das anfühlen soll.
Dafür gibt es eine eigene kleine Demo-Seite. Das richtige Programm
(`index.html`, `app.js`) wird in diesem Auftrag NICHT verändert.

## Was gebaut wird
Eine einzelne Datei `demos/tempo-demo.html` (HTML, CSS und JavaScript in
einer Datei, nichts aus dem Internet). Sie gehört nicht zur App: nicht in
`sw.js` eintragen, nicht von der App aus verlinken.

### Aufbau
- Links eine Zeichenfläche, rechts eine Leiste. Dunkler Hintergrund und
  Farben wie im Programm (Stab 1 Orange, Stab 2 Blau, Stab 3 Grün).
- Genau 3 Stäbe, jeder dreht sich relativ zum vorherigen (wie im Programm).
- Jeder Stab hat in der Leiste die Regler „Länge" und „Tempo" (0 bis 100,
  Startwert 50), mit der Zahl daneben (nur Anzeige, noch keine Eingabe).
- Ein Regler „Gesamt-Tempo" (0 bis 100, Startwert 50).
- Knöpfe „Start / Pause" und „Löschen".
- Nur Stab 3 zeichnet eine Spur (fest, kein Knopf nötig).
- Länge: 1 entspricht 3 Pixeln. Passt die Kette nicht ins Bild, wird die
  Ansicht automatisch kleiner (einfach, darf sofort springen).
- Alles groß und fingerfreundlich, deutsche Beschriftungen, kaum Text.

### Die Varianten zum Vergleichen
Oben in der Leiste zwei Reihen mit großen Auswahlknöpfen. Der gewählte Knopf
ist deutlich hervorgehoben. Beim Umschalten wird die Spur gelöscht, alle
Regler-Werte bleiben.

**Reihe 1: „Tempo 100 ="** (wie schnell sich ein Stab bei Tempo 100 dreht,
bei Gesamt-Tempo 50):
- Knopf „A": 1 Umdrehung pro Sekunde
- Knopf „B": 2 Umdrehungen pro Sekunde
- Knopf „C": 4 Umdrehungen pro Sekunde
Tempo ist proportional: Tempo 50 ist halb so schnell wie Tempo 100, Tempo 0
steht still. Startauswahl: B.

**Reihe 2: „Gesamt-Tempo 100 ="** (wie viel schneller alles bei Gesamt-Tempo
100 läuft):
- Knopf „×5", Knopf „×20", Knopf „×50"
Rechnung für den Faktor `f` bei Reglerwert `g` (0 bis 100) und gewähltem
Höchstwert `M`:
- `g = 0` → `f = 0` (Stillstand)
- sonst `f = M ^ ((g − 50) / 50)`
Also: 50 = normal (×1), 100 = ×M, 25 ≈ ×1/√M, 1 ≈ fast still.
Startauswahl: ×20.

### Anzeige zur Orientierung
Unter den Varianten eine kleine Zeile: „Stab 1 dreht sich … mal pro Sekunde"
(für den aktuellen Wert von Stab 1 und das aktuelle Gesamt-Tempo, eine
Nachkommastelle). Mehr Text nicht.

### Leistung (feste Regeln aus der CLAUDE.md beachten)
- Spur auf eine versteckte Ebene dazumalen, nicht in jedem Bild neu malen.
- Kurze Pfade (wie in `app.js`), Rechenschritte mit Zeitbudget pro Bild.
- Keine Werte aus der Seite in der Schleife lesen.
- Die Demo darf einfacher sein als das Programm (kein Wächter, keine
  Notbremse nötig), muss aber auch bei Tempo 100, Variante C und ×50
  flüssig bleiben.

## Was NICHT gemacht wird
Keine Änderung an `index.html`, `app.js`, `sw.js`, `manifest.webmanifest`
oder der CLAUDE.md. Kein Hochladen zu GitHub.

## Prüfen
- `demos/tempo-demo.html` per Doppelklick im Browser öffnen.
- Alle 3 × 3 Varianten kurz durchschalten, Regler bewegen, Pause, Löschen.
- Extremfall (alle Tempi 100, Variante C, ×50) läuft flüssig.
- Keine Fehler in der Konsole.

## Abschluss
- Verschiebe diese Auftrags-Datei (`AUFTRAG_12_tempo-demo.md`) selbst nach
  `Anweisungen/fertig`.
- Speichere selbst: `git add -A` und
  `git commit -m "Schritt 12: Demo-Seite fuer Geschwindigkeiten"` (nur lokal,
  KEIN `git push`).
- Sag dem Vater in 2 bis 3 einfachen Sätzen, wie er die Demo öffnet und was
  er vergleichen kann.
