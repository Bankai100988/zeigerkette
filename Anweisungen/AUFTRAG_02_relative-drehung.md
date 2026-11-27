# Auftrag 2: Stab 2 dreht sich zusätzlich zu Stab 1

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Gibt es den Ordner noch nicht, lege ihn an.
- Liegt `AUFTRAG_01_zwei-staebe.md` noch außerhalb von `Anweisungen/fertig`,
  verschiebe ihn jetzt dorthin (Schritt 1 ist ja fertig).

## Zuerst: Stand von Schritt 1 speichern
Bevor du irgendetwas änderst, speichere den jetzigen Stand lokal:
- `git add -A` (alles, auch die Aufträge, damit nichts fehlt)
- `git commit -m "Schritt 1: zwei drehende Staebe"`
- Das ist nur ein lokaler Commit. KEIN `git push`.
- Wenn schon alles gespeichert ist oder etwas nicht klappt, kurz melden und
  nicht weitermachen, bis der Vater antwortet.

## Problem
Wenn beide Stäbe das gleiche Tempo haben, wirkt Stab 2 eingefroren (er bleibt
immer im gleichen Winkel zu Stab 1). Das liegt daran, dass jeder Stab sein
Tempo einzeln von der Waagerechten aus rechnet.

## Gewünschtes Verhalten
Jeder Stab dreht sich relativ zum vorherigen Stab:
- Der Winkel von Stab 1 ist: Winkel1 = Tempo1 * Zeit.
- Der Winkel von Stab 2 ist: Winkel2 = Winkel1 + Tempo2 * Zeit.
  (Stab 2 dreht sich also zusätzlich zur Drehung von Stab 1.)
- Allgemein: Der Winkel eines Stabs ist der Winkel des Stabs davor plus seine
  eigene Drehung.

Beispiele zum Prüfen (beide im Uhrzeigersinn):
- Tempo 1 = 20, Tempo 2 = 20: Stab 2 dreht sich sichtbar doppelt so schnell
  wie Stab 1 (er friert NICHT ein).
- Tempo 1 = 0, Tempo 2 = 50: Stab 1 steht still, Stab 2 kreist um das Ende
  von Stab 1.
- Tempo 1 = 50, Tempo 2 = 0: Beide bewegen sich wie ein steifer Arm.

## Was sich NICHT ändert
Aussehen, Farben, Regler, Startwerte, Start/Pause und die Zeit-Berechnung
bleiben wie sie sind. Länge und Tempo bleiben proportional (50 = halb so viel
wie 100). Keine neuen Funktionen.

## Zusätzlich in der CLAUDE.md
Füge im Abschnitt „Bedienung (feste Regeln)" genau diese eine Zeile hinzu:
- Jeder Stab dreht sich relativ zum vorherigen Stab (sein Tempo kommt zur
  Drehung des Stabs davor dazu).
Sonst nichts in der CLAUDE.md ändern.

## Prüfen
- index.html im Browser öffnen und die drei Beispiele oben ausprobieren.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` und die eine Zeile in der CLAUDE.md ändern, sonst nichts
  (außer dem Verschieben der Auftrags-Dateien, siehe oben und unten).
- NICHT zu GitHub hochladen.
- Am Ende in 2 bis 3 einfachen Sätzen sagen, was jetzt anders ist. Dann
  vorschlagen, auch diesen neuen Stand lokal zu speichern, und auf die Antwort
  des Vaters warten. Erst bei seinem Ja:
  - Diese Auftrags-Datei (`AUFTRAG_02_relative-drehung.md`) nach
    `Anweisungen/fertig` verschieben.
  - `git add -A`
  - `git commit -m "Schritt 2: Stab dreht sich relativ zum vorherigen"`
  - Wieder nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
