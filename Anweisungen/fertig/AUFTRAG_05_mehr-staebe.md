# Auftrag 5: Mehr Stäbe hinzufügen

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen (zum Beispiel die vom Vater angepassten
  Geschwindigkeiten), speichere sie jetzt selbst, ohne zu fragen:
  - `git add -A`
  - `git commit -m "Zwischenstand: Geschwindigkeiten angepasst"`
  - Nur lokal, KEIN `git push`.
- Danach direkt mit dem Auftrag weitermachen.
- Nur wenn beim Speichern etwas schiefgeht, kurz melden und warten.

## Ziel
Man kann weitere Stäbe hinzufügen. Alle Stäbe stehen in der Leiste rechts
untereinander. Jeder hängt am Ende des vorherigen. Je mehr Stäbe, desto
verrückter die Muster.

## Wichtig: Bestehendes unverändert lassen
Alle Werte, Bereiche und Startwerte, die der Vater zuletzt angepasst hat
(Reglerbereiche, Tempo-Skalierung, Gesamt-Tempo und so weiter), bleiben genau
so, wie sie jetzt im Programm stehen. Nichts davon wird zurückgesetzt oder
geändert.

## Was gebaut wird

### Stäbe hinzufügen und entfernen
- Es gibt 1 bis 8 Stäbe. Beim Start sind es wie bisher 2.
- Unten in der Leiste, immer sichtbar (bei Start/Pause, Löschen und
  Gesamt-Tempo), eine Zeile mit zwei großen Knöpfen und der Anzahl dazwischen:
  „−  3  +" (Beschriftung zum Beispiel „Stäbe"). Ein Tipp auf „+" fügt einen
  Stab hinzu, ein Tipp auf „−" entfernt den letzten Stab.
- „+" ist ausgegraut, wenn schon 8 Stäbe da sind. „−" ist ausgegraut, wenn nur
  noch 1 Stab da ist. Nichts kann kaputtgehen.
- Ein neuer Stab wird immer ganz unten an die Kette gehängt, also an das Ende
  des bisher letzten Stabs.
- Wird ein Stab entfernt, verschwindet auch seine Spur. Die Spuren der anderen
  Stäbe bleiben.

### Die Liste
- Die Blöcke stehen untereinander, von oben nach unten in der Reihenfolge der
  Kette: Stab 1, Stab 2, Stab 3 und so weiter.
- Jeder Block hat genau wie bisher: farbige Überschrift („Stab 3"), Regler
  „Länge", Regler „Tempo" und den Knopf „Spur" (an/aus).
- Mit vielen Stäben wird die Leiste länger. Sie lässt sich nach unten
  scrollen, während die Knöpfe unten fest stehen bleiben.
- Wird ein Stab hinzugefügt, scrollt die Liste so, dass der neue Block
  sichtbar ist.
- Mache die Blöcke etwas kompakter, damit mehr davon auf den Bildschirm passen
  (zum Beispiel Überschrift und Spur-Knopf in einer Zeile). Die Bedienelemente
  bleiben trotzdem fingergroß (mindestens ca. 48 px).
- Baue die Blöcke weiter aus einer Liste (Schleife), nicht als Einzelcode.

### Werte eines neuen Stabs
- Länge 20, Tempo 80, Drehung im Uhrzeigersinn, Spur AN.
- Die Spur-Einstellung der anderen Stäbe wird nicht verändert.

### Farben
Jeder Stab hat eine feste eigene Farbe, die zu seiner Position gehört, in
dieser Reihenfolge (gut sichtbar auf dunklem Hintergrund):
1. Orange, 2. Blau (diese beiden bleiben wie jetzt), 3. Grün, 4. Pink,
5. Gelb, 6. Türkis, 7. Rot, 8. Violett.
Die Spur hat die Farbe ihres Stabs.

### Verhalten der Kette
- Jeder Stab dreht sich relativ zum vorherigen Stab (wie bisher): Der Winkel
  eines Stabs ist der Winkel des Stabs davor plus seine eigene Drehung.
- Die Spur eines Stabs ist die Linie, die sein freies Ende zeichnet.
- Der automatische Bildausschnitt rechnet mit der Gesamtlänge aller Stäbe
  zusammen. Alles bleibt sichtbar, die Anpassung geschieht weich wie bisher.
- Die Begrenzung von ca. 50 000 Punkten pro Spur bleibt. Die Bewegung wird
  weiter in kleinen Zeitschritten gerechnet. Auch mit 8 Stäben und mehreren
  Spuren darf das Programm nicht ruckeln oder hängen. Wenn es nötig ist,
  zeichne die Spuren effizient (zum Beispiel jede Spur als einen einzigen
  Linienzug).
- Start/Pause, Löschen und Gesamt-Tempo funktionieren für alle Stäbe.

## Was NICHT gebaut wird (kommt später)
Keine Drehrichtungs-Knöpfe, kein Zoomen und Verschieben mit Fingern oder Maus,
keine Zahleneingabe, keine Offline-Funktion (PWA), kein Speichern von Mustern,
kein Name/Logo, keine Spurfarben-Auswahl.

## Prüfen
- index.html im Browser öffnen: Es sind 2 Stäbe, alles wie vorher.
- Mehrmals „+" tippen bis 8: Die Blöcke erscheinen untereinander, die Farben
  stimmen, die Liste scrollt, „+" wird bei 8 grau.
- „−" tippen bis 1: Stäbe verschwinden von unten, „−" wird bei 1 grau.
- Bei einem neuen Stab die Regler und den Spur-Knopf ausprobieren.
- Alle Stäbe lang einstellen: Der Bildausschnitt wird weich kleiner.
- Mit 8 Stäben und mehreren Spuren: Es läuft flüssig. Löschen und Pause
  funktionieren.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` ändern (und das Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_05_mehr-staebe.md`) selbst nach `Anweisungen/fertig`.
- Dann speichere den Stand selbst, ohne zu fragen:
  - `git add -A` (nimmt auch das Verschieben der Auftrags-Datei mit)
  - `git commit -m "Schritt 5: bis zu 8 Staebe"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
- Zum Schluss in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist, dass
  die Datei verschoben und der Stand gespeichert wurde. Hochgeladen wurde
  nichts.
