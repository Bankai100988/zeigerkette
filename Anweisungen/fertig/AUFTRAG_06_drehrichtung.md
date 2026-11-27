# Auftrag 6: Drehrichtung wechseln

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
  - `git commit -m "Zwischenstand vor Schritt 6"`
  - Nur lokal, KEIN `git push`.
- Danach direkt mit dem Auftrag weitermachen.
- Nur wenn beim Speichern etwas schiefgeht, kurz melden und warten.

## Ziel
Jeder Stab hat einen Knopf, mit dem man seine Drehrichtung wechselt
(Uhrzeigersinn oder dagegen). Das ist der letzte Punkt der Grundversion
(Etappe 1).

## Wichtig: Bestehendes unverändert lassen
Alle Werte, Bereiche, Startwerte und Einstellungen, die der Vater zuletzt
angepasst hat, bleiben genau so, wie sie jetzt im Programm stehen.

## Was gebaut wird

### Der Knopf
- In jedem Stab-Block gibt es einen Knopf „Richtung". Er steht in der
  Kopfzeile des Blocks, neben dem Knopf „Spur" (damit der Block nicht höher
  wird).
- Der Knopf zeigt die aktuelle Richtung mit einem Pfeil: ↻ (im Uhrzeigersinn)
  oder ↺ (gegen den Uhrzeigersinn). Ein Tipp wechselt die Richtung.
- Fingergroß (mindestens ca. 48 px), deutsche Beschriftung, kaum Text.
- Jeder Stab hat seine eigene Richtung. Alle Stäbe starten im Uhrzeigersinn,
  auch neu hinzugefügte Stäbe.
- Wird ein Stab entfernt und später neu hinzugefügt, beginnt er wieder im
  Uhrzeigersinn.

### Verhalten
- Die Drehrichtung wirkt auf die eigene Drehung des Stabs (so wie bisher
  rechnet jeder Stab relativ zum vorherigen). Gegen den Uhrzeigersinn heißt:
  Das Tempo des Stabs wird rückwärts gerechnet.
- Beim Wechsel darf nichts springen: Der Stab dreht von seiner aktuellen
  Stellung aus einfach in die andere Richtung weiter. Dafür merkt sich jeder
  Stab seinen eigenen Drehwinkel und zählt ihn pro Zeitschritt weiter
  (Winkel = Winkel + Richtung * Tempo * Zeitschritt). Er wird nicht jedes Mal
  neu aus „Tempo mal Gesamtzeit" berechnet. Prüfe, ob das schon so ist, und
  ändere es nur, wenn es nötig ist. Das gilt auch für das Ändern von Tempo
  und Gesamt-Tempo: Auch dabei darf kein Stab springen.
- Die Spur läuft beim Wechsel einfach weiter, ohne Lücke oder Sprung.
- Start/Pause, Löschen, Gesamt-Tempo, Stäbe hinzufügen/entfernen und der
  automatische Bildausschnitt funktionieren wie bisher.

## Zusätzlich in der CLAUDE.md
Ersetze den Abschnitt „Stand" am Ende der CLAUDE.md (die Überschrift „## Stand"
und alles darunter) durch:

## Stand
- Etappe 1 (Grundversion) ist fertig: bis zu 8 Stäbe, Regler für Länge und
  Tempo, Drehrichtung, Spur pro Stab, Start/Pause, Löschen, Gesamt-Tempo und
  automatischer Bildausschnitt.
- Erledigte Aufträge liegen in `Anweisungen/fertig`.

Sonst nichts in der CLAUDE.md ändern.

## Was NICHT gebaut wird (kommt später, Etappe 2)
Kein Zoomen und Verschieben mit Fingern oder Maus, keine Zahleneingabe, keine
Offline-Funktion (PWA), kein Speichern von Mustern, kein Name/Logo, keine
Spurfarben-Auswahl, kein „Überrasch mich".

## Prüfen
- index.html im Browser öffnen.
- Bei jedem Stab den Knopf „Richtung" tippen: Der Pfeil wechselt zwischen ↻ und
  ↺, der Stab dreht in die andere Richtung weiter, ohne zu springen.
- Mehrere Stäbe mit unterschiedlichen Richtungen: Die Muster ändern sich
  sichtbar. Die Spur läuft ohne Sprung weiter.
- Ein neuer Stab startet im Uhrzeigersinn (↻).
- Tempo-Regler und Gesamt-Tempo während des Laufens verstellen: Es springt
  nichts.
- Pause, Löschen, „+" und „−" funktionieren wie vorher.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` und der Abschnitt „Stand" in der CLAUDE.md ändern (und das
  Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_06_drehrichtung.md`) selbst nach `Anweisungen/fertig`.
- Dann speichere den Stand selbst, ohne zu fragen:
  - `git add -A` (nimmt auch das Verschieben der Auftrags-Datei mit)
  - `git commit -m "Schritt 6: Drehrichtung pro Stab, Etappe 1 fertig"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
- Zum Schluss in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist, dass
  die Datei verschoben und der Stand gespeichert wurde. Hochgeladen wurde
  nichts.
