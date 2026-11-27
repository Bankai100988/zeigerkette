# Auftrag 8: Leiste rechts aufräumen (Layout-Fehler beheben)

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
  - `git commit -m "Zwischenstand vor Schritt 8"`
  - Nur lokal, KEIN `git push`.
- Danach direkt mit dem Auftrag weitermachen.
- Nur wenn beim Speichern etwas schiefgeht, kurz melden und warten.

## Ziel
Die Leiste rechts sieht wieder sauber aus. Nichts ragt über den Rand, nichts
wird abgeschnitten, und es gibt kein seitliches Scrollen.

## Was auf dem Screenshot des Vaters falsch ist
(Der Vater zeigt dir den Screenshot. Hier die Fehler in Worten:)
1. Der Knopf „Spur" ragt rechts aus dem Block heraus und ist abgeschnitten.
2. Unten in der Leiste gibt es einen waagerechten Rollbalken. Die Leiste ist
   also breiter als ihr Platz.
3. Der senkrechte Rollbalken liegt über dem Inhalt und verdeckt den rechten
   Rand der Blöcke.
4. Die Kopfzeile der Blöcke ist zu eng: Die Knöpfe sitzen ganz rechts, und
   rechts davon ist zu wenig Platz.
5. Bei einem Stab mit sehr dunkler Farbe (hier dunkelblau) sind Überschrift
   und Knöpfe auf dem dunklen Hintergrund kaum lesbar.

## Was gebaut wird (nur Aussehen, keine neuen Funktionen)

### Breite und Rollen
- Nichts in der Leiste darf breiter sein als die Leiste selbst. Verwende
  überall `box-sizing: border-box` und lasse Elemente nicht über ihren
  Block hinausragen.
- Kein waagerechtes Scrollen in der Leiste (`overflow-x: hidden`). Es scrollt
  nur senkrecht.
- Der senkrechte Rollbalken darf den Inhalt nicht überdecken: Reserviere ihm
  Platz (`scrollbar-gutter: stable`) und mache ihn dünn und dezent, oder gib
  der Leiste rechts genug Innenabstand.
- Die Breite der Leiste passt sich dem Fenster an (zum Beispiel zwischen ca.
  280 px und 360 px). Auch bei schmaler Leiste muss alles hineinpassen.

### Kopfzeile jedes Blocks
- Alles steht in einer Zeile: links die Überschrift („Stab 1"), danach die
  Knöpfe, so wie sie schon da sind (Farbknopf, falls schon vorhanden, dann
  „Richtung", dann „Spur").
- Die Knöpfe werden ein Stück nach links geschoben: Sie stehen nicht mehr ganz
  am rechten Rand, sondern die Gruppe endet mit einem Abstand von ca. 16 px
  zum rechten Rand des Blocks. Zwischen Überschrift und den Knöpfen ist
  genug Platz, die Überschrift wird nicht gequetscht.
- Zwischen den Knöpfen ca. 8 px Abstand. Alle Knöpfe bleiben mindestens ca.
  48 px hoch und breit.
- Der Knopf „Spur" ist vollständig sichtbar, mit Rand innerhalb des Blocks.
- Passt es bei sehr schmaler Leiste trotzdem nicht in eine Zeile, darf die
  Kopfzeile auf zwei Zeilen umbrechen. Bei normaler Breite bleibt es eine
  Zeile.

### Regler im Block
- Die Regler „Länge" und „Tempo" (Beschriftung links, Regler rechts) füllen die
  Breite des Blocks und haben rechts ebenfalls ca. 16 px Abstand zum Rand.
- Beschriftungen und Regler stehen in den Blöcken sauber untereinander, die
  Regler beginnen an der gleichen Stelle.

### Untere Knöpfe (immer sichtbar)
- Gesamt-Tempo, Stäbe „− 3 +", Start/Pause und Löschen bleiben wie sie sind,
  passen aber ebenfalls in die Breite, ohne zu überstehen. Gleicher Abstand
  zum Rand wie die Blöcke.

### Lesbarkeit bei dunklen Farben
- Ist die Farbe eines Stabs sehr dunkel (wenig Helligkeit), wird nur in der
  Leiste die Überschrift, der Rahmen von „Richtung" und die Schrift auf dem
  Knopf „Spur" aufgehellt oder mit passender Schriftfarbe dargestellt, damit
  man sie lesen kann. Der Stab selbst und seine Spur behalten genau ihre
  echte Farbe.
- Die Schrift auf dem gefüllten Knopf „Spur" wird automatisch schwarz oder weiß,
  je nachdem, welche besser lesbar ist.
- Ein kleiner farbiger Punkt oder Streifen am Block zeigt weiterhin die echte
  Farbe.

## Was sich NICHT ändert
Alle Funktionen, Werte, Bereiche und Einstellungen bleiben wie sie sind. Es
werden keine neuen Funktionen gebaut. Keine Änderung an der Zeichenfläche, an
der Berechnung oder an der Geschwindigkeit.

## Prüfen
- index.html im Browser öffnen, mit 3 und mit 8 Stäben.
- Kein waagerechter Rollbalken in der Leiste. Der senkrechte Rollbalken
  überdeckt nichts.
- Der Knopf „Spur" ist in jedem Block vollständig sichtbar, die Knöpfe sitzen
  mit Abstand zum rechten Rand.
- Fenster schmaler und breiter ziehen (auch ungefähr in der Größe des
  Tablets): Alles bleibt innerhalb der Leiste.
- Einen Stab auf eine sehr dunkle Farbe stellen (falls die Farbwahl schon da
  ist) oder den Wert im Code testweise setzen: Überschrift und Knöpfe bleiben
  lesbar, die Spur bleibt in ihrer echten Farbe.
- Alle Funktionen gehen weiter: Regler, Richtung, Spur, „+", „−", Pause,
  Löschen, Gesamt-Tempo.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` ändern (und das Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_08_leiste-aufraeumen.md`) selbst nach `Anweisungen/fertig`.
- Dann speichere den Stand selbst, ohne zu fragen:
  - `git add -A` (nimmt auch das Verschieben der Auftrags-Datei mit)
  - `git commit -m "Schritt 8: Leiste aufgeraeumt"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
- Zum Schluss in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist, dass
  die Datei verschoben und der Stand gespeichert wurde. Hochgeladen wurde
  nichts.
