# Auftrag 4: Mehr Länge, mehr Tempo und Gesamt-Tempo

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen
- Mit `git status` prüfen, ob alles gespeichert ist (Schritt 3).
- Wenn es ungespeicherte Änderungen gibt, kurz melden und auf die Antwort des
  Vaters warten. Sonst direkt weiter.

## Ziel
Die Regler für Länge und Tempo gehen doppelt so weit (bis 200). Damit auch
lange Ketten komplett sichtbar bleiben, passt sich der Bildausschnitt weich
an. Dazu kommt ein Regler für das Gesamt-Tempo, mit dem man alles zusammen
schneller oder langsamer machen kann.

## Teil A: Regler bis 200
- Die Regler „Länge" und „Tempo" jedes Stabs gehen von 0 bis 200 (vorher 0 bis
  100).
- Alles bleibt proportional: Länge 100 ist halb so lang wie Länge 200. Tempo 100
  ist halb so schnell wie Tempo 200.
- Tempo 100 bedeutet weiterhin eine volle Umdrehung in 2 Sekunden, Tempo 200
  also eine Umdrehung pro Sekunde.
- Die Startwerte bleiben genau wie jetzt (Stab 1: Länge 50, Tempo 20. Stab 2:
  Länge 30, Tempo 60).
- Es bleiben genau zwei Stäbe.

## Teil B: Automatischer Bildausschnitt
Damit lange Ketten nicht aus dem Bild laufen, passt sich die Ansicht an.

- Bezugsgröße ist die Gesamtlänge der Kette (Länge Stab 1 + Länge Stab 2),
  aber mindestens 200. Das heißt: Solange die Gesamtlänge höchstens 200 ist,
  sieht alles genauso aus wie bisher. Erst darüber wird die Ansicht kleiner.
- Die Ansicht wird kleiner, die Stäbe werden NICHT gekürzt. Die Proportionen
  bleiben erhalten (Länge 100 ist immer halb so lang wie Länge 200).
- Die Kette plus ein kleiner Rand (ca. 5 %) muss immer ganz in die
  Zeichenfläche passen.
- Die Anpassung geschieht weich (animiert) und nicht ruckartig, zum Beispiel
  durch gleitendes Nachziehen über ca. 0,3 bis 0,5 Sekunden. Sie hängt an der
  echten Zeit und nicht an der Bildrate.
- Die Spuren bleiben in ihren echten Koordinaten gespeichert (nicht als Bild)
  und wachsen bzw. schrumpfen mit der Ansicht mit. Die Linienbreite der Spur
  und der Stäbe bleibt auf dem Bildschirm gleich dick.
- Wird die Ansicht beim Verkleinern der Kette wieder größer, ist das auch
  weich animiert, aber nie größer als der bisherige Standard.

## Teil C: Regler „Gesamt-Tempo"
- Ein Regler „Gesamt-Tempo" in der Leiste rechts, unten bei den Knöpfen
  „Start / Pause" und „Löschen" (immer sichtbar), groß und fingerfreundlich.
- Bereich 0 bis 200, Startwert 100. 100 ist das normale Tempo, 50 ist halb so
  schnell, 200 doppelt so schnell, 0 steht still.
- Er wirkt auf alle Stäbe gleichzeitig, indem die ganze Zeit schneller oder
  langsamer läuft. Das Verhältnis der Stäbe zueinander ändert sich dadurch
  nicht, und das Muster bleibt dasselbe, es wird nur schneller oder langsamer
  gezeichnet.
- Die Spur bleibt auch bei hohem Gesamt-Tempo glatt.

## Damit es nicht hängt
- Die Bewegung wird weiter in kleinen Zeitschritten gerechnet (höchstens ca.
  1/240 Sekunde pro Schritt, jetzt auch für hohes Tempo nötig).
- Ist seit dem letzten Bild sehr viel Zeit vergangen (zum Beispiel nach einem
  Tab-Wechsel), begrenze die nachgerechnete Zeit auf höchstens 0,1 Sekunden.
- Die Grenze von ca. 50 000 Punkten pro Spur bleibt.

## Zusätzlich in der CLAUDE.md
Ersetze in der CLAUDE.md genau diese Zeile:
- Länge und Geschwindigkeit sind Werte von 0 bis 100 und proportional
  (50 ist halb so viel wie 100).
durch:
- Länge und Geschwindigkeit sind Werte von 0 bis 200 und proportional
  (100 ist halb so viel wie 200).
Sonst nichts in der CLAUDE.md ändern.

## Was sich NICHT ändert
Farben, Startwerte, die relative Drehung der Stäbe, die Spur-Knöpfe und
Löschen, Start/Pause und das Aussehen der Leiste bleiben wie sie sind.

## Was NICHT gebaut wird (kommt später)
Keine Drehrichtungs-Knöpfe, kein dritter Stab, kein Zoomen und Verschieben mit
Fingern oder Maus, keine Zahleneingabe, keine Offline-Funktion (PWA), kein
Speichern von Mustern.

## Prüfen
- index.html im Browser öffnen.
- Länge von Stab 1 und Stab 2 auf 200 ziehen: Die Ansicht wird weich kleiner,
  alles bleibt sichtbar, nichts springt. Wieder zurückziehen: Die Ansicht wird
  weich größer, aber nie größer als vorher.
- Tempo bis 200 ausprobieren: Die Spur bleibt glatt.
- Gesamt-Tempo auf 0, 50, 100 und 200 stellen: Alles wird gemeinsam langsamer
  oder schneller, bei 0 steht alles still.
- Start/Pause und Löschen funktionieren wie vorher.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` und die eine Zeile in der CLAUDE.md ändern (und das
  Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_04_mehr-bereich-und-gesamttempo.md`) selbst nach
  `Anweisungen/fertig`.
- Dann in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist, und dass die
  Datei verschoben wurde. Vorschlagen, den Stand lokal zu speichern, und auf
  die Antwort des Vaters warten. Erst bei seinem Ja:
  - `git add -A`
  - `git commit -m "Schritt 4: Bereich bis 200, Bildausschnitt, Gesamt-Tempo"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
