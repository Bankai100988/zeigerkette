# Auftrag 12b: Demo um Tempo 15 Umdrehungen pro Sekunde erweitern

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen. Gibt es ungespeicherte Änderungen, speichere sie
  selbst: `git add -A` und `git commit -m "Zwischenstand vor Schritt 12b"`
  (nur lokal).

## Was geändert wird
Nur die Datei `demos/tempo-demo.html`:
- In der Reihe „Tempo 100 =" kommt ein vierter Knopf dazu:
  „D": 15 Umdrehungen pro Sekunde.
- Die Reihe „Gesamt-Tempo 100 =" bleibt mit ×5, ×20 und ×50.
- Startauswahl der Demo: Tempo „D" und Gesamt-Tempo „×50".
- Sehr hohe Geschwindigkeiten müssen weiter flüssig laufen. Das Zeitbudget pro
  Bild gilt weiter. Ist es erreicht, wird die restliche Bewegungszeit
  verworfen (die Demo läuft dann langsamer als eingestellt, hängt aber nie).
- Die Anzeigezeile „Stab 1 dreht sich … mal pro Sekunde" zeigt auch große
  Werte richtig an (ohne Nachkommastelle ab 100).

## Was NICHT gemacht wird
Keine Änderung am eigentlichen Programm (`index.html`, `app.js`, `sw.js`)
oder an der CLAUDE.md. Kein Hochladen zu GitHub.

## Prüfen
- Demo per Doppelklick öffnen, Variante D mit ×5, ×20 und ×50 ausprobieren,
  alle Tempi auf 100: flüssig, keine Fehler in der Konsole.

## Abschluss
- Diese Auftrags-Datei (`AUFTRAG_12b_tempo-demo-15.md`) selbst nach
  `Anweisungen/fertig` verschieben.
- Selbst speichern: `git add -A` und
  `git commit -m "Schritt 12b: Demo mit Tempo 15 pro Sekunde"` (nur lokal,
  KEIN `git push`).
- In 1 bis 2 Sätzen sagen, was neu ist.
