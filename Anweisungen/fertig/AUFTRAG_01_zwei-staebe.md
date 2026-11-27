# Auftrag 1: Zwei drehende Stäbe

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ziel
Auf dem Bildschirm drehen sich zwei Stäbe, die aneinanderhängen. Man kann
Länge und Tempo jedes Stabs mit großen Reglern ändern und alles anhalten.
Das Kind soll in den ersten Sekunden etwas Sichtbares haben und gleich
ausprobieren können.

## Was gebaut wird
Eine einzige Datei: `index.html` (HTML, CSS und JavaScript darin). Kein
Framework, keine Internet-Dateien.

### Bild
- Eine Zeichenfläche (Canvas), die den Bildschirm füllt. Sie passt sich der
  Fenstergröße an (auch beim Drehen des Tablets).
- Der Drehpunkt von Stab 1 liegt in der Mitte der Zeichenfläche.
- Stab 1 hängt am Drehpunkt. Stab 2 hängt am Ende von Stab 1 und dreht sich
  zusätzlich mit.
- Stäbe als dicke Linien mit rundem Ende, dazu je ein Punkt am Gelenk und an
  der Spitze. Stab 1 hat eine feste Farbe (Orange), Stab 2 eine andere feste
  Farbe (Blau). Dunkler Hintergrund.

### Bedienung
Große Bedienfläche, am besten ein Streifen unten (Querformat) mit zwei Blöcken
nebeneinander:
- Block „Stab 1" (Orange) und Block „Stab 2" (Blau), je mit:
  - Regler „Länge" (0 bis 100)
  - Regler „Tempo" (0 bis 100)
- Ein großer Knopf „Start / Pause" (zeigt ▶ oder ⏸).
- Alle Regler und Knöpfe mindestens ca. 48 px hoch, gut mit dem Finger zu
  treffen. Beschriftungen auf Deutsch, kaum Text.
- Änderungen wirken sofort.

### Verhalten
- Startwerte: Stab 1: Länge 50, Tempo 20. Stab 2: Länge 30, Tempo 60.
  Beide drehen im Uhrzeigersinn. Das Programm startet sofort drehend.
- Länge und Tempo sind proportional. Länge 50 ist genau halb so lang wie
  Länge 100. Tempo 50 ist genau halb so schnell wie Tempo 100.
- Länge 100 entspricht einer festen Größe: Beide Stäbe mit Länge 100 zusammen
  müssen noch ganz in die Zeichenfläche passen. Der Maßstab bleibt fest. Eine
  automatische Anpassung des Bildausschnitts kommt später.
- Tempo 100 = eine volle Umdrehung in 2 Sekunden. Tempo 0 = Stab steht still.
- Die Drehung hängt an der echten Zeit (nicht an der Bildrate), damit es auf
  PC und Tablet gleich schnell läuft.
- Bei „Pause" friert alles ein. Bei „Start" läuft es von dort weiter.
- Länge 0 und Tempo 0 sind erlaubt. Nichts darf kaputtgehen.

## Was NICHT gebaut wird (kommt in späteren Schritten)
Keine Spur, keine Drehrichtungs-Knöpfe, kein dritter Stab, kein Zoomen, keine
Zahleneingabe, keine Offline-Funktion (PWA), kein Speichern, kein Name/Logo.

## Prüfen
- Datei im Browser am PC öffnen (Doppelklick auf index.html reicht).
- Prüfen: Beide Stäbe drehen. Regler ändern Länge und Tempo sofort. Pause und
  Start funktionieren. Fenster verkleinern und vergrößern funktioniert.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Keine weiteren Dateien anlegen, außer `index.html`.
- NICHT zu GitHub hochladen.
- Am Ende in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist und wie man
  es ausprobiert. Dann vorschlagen, den Stand lokal zu speichern (git commit)
  und auf die Antwort des Vaters warten.
