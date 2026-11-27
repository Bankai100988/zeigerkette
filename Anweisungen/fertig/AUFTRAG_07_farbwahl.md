# Auftrag 7: Farbe der Stäbe und Spuren einstellen

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
  - `git commit -m "Zwischenstand vor Schritt 7"`
  - Nur lokal, KEIN `git push`.
- Danach direkt mit dem Auftrag weitermachen.
- Nur wenn beim Speichern etwas schiefgeht, kurz melden und warten.

## Ziel
Jeder Stab bekommt eine einstellbare Farbe. Die Farbe gilt für den Stab und
seine Spur zusammen. Die Auswahl sieht aus wie der klassische Windows-
Farbwähler (siehe Beschreibung unten) und lässt sich mit dem Finger bedienen.

## Wichtig: Bestehendes unverändert lassen
Alle Werte, Bereiche, Startwerte und Einstellungen, die der Vater zuletzt
angepasst hat, bleiben genau so, wie sie jetzt im Programm stehen. Die
Startfarben der Stäbe bleiben die bisherigen (Orange, Blau, Grün, Pink, Gelb,
Türkis, Rot, Violett).

## Was gebaut wird

### Der Farbknopf
- In der Kopfzeile jedes Stab-Blocks gibt es einen Farbknopf: ein farbiges
  Feld in der aktuellen Farbe des Stabs, mit einem hellen Rand. Er steht neben
  „Richtung" und „Spur".
- Mindestens ca. 48 px groß, fingerfreundlich. Passt die Kopfzeile nicht mehr
  in eine Zeile, darf sie auf zwei Zeilen umbrechen. Die Knöpfe bleiben
  trotzdem groß genug.
- Ein Tipp darauf öffnet die Farbwahl für diesen Stab.

### Die Farbwahl (wie auf dem Bild des Vaters)
Ein Fenster, das über der Zeichenfläche neben der Leiste erscheint
(Überschrift „Farbe", dazu der Stabname). Es besteht aus drei Teilen:

1. **Farbfeld** (groß, rechteckig, links):
   - Waagerecht läuft der Farbton durch den Regenbogen: Rot, Gelb, Grün,
     Türkis, Blau, Pink/Magenta, wieder Rot.
   - Senkrecht nimmt die Sättigung nach unten ab: oben kräftige Farbe, ganz
     unten Grau.
   - Das Feld wird immer in mittlerer Helligkeit gezeichnet (HSL mit
     Helligkeit 50 %), unabhängig vom Helligkeitsregler.
   - Ein kleines Fadenkreuz (Kreuz oder Ring) zeigt die gewählte Stelle.
   - Tippen oder Ziehen im Feld ändert Farbton und Sättigung sofort.
2. **Helligkeitsregler** (schmaler senkrechter Streifen rechts neben dem Feld):
   - Oben Weiß, in der Mitte die reine Farbe aus dem Feld, unten Schwarz. Der
     Verlauf passt sich an die gewählte Stelle im Feld an.
   - Ein kleines Dreieck neben dem Streifen zeigt die aktuelle Helligkeit.
   - Tippen oder Ziehen ändert die Helligkeit sofort.
3. **Schließen-Knopf** „✕" (groß, deutlich sichtbar). Ein Tipp außerhalb des
   Fensters schließt es ebenfalls. Es gibt keinen „Übernehmen"-Knopf.

### Größe und Bedienung
- Das Farbfeld ist so groß, dass man mit dem Finger gut trifft (etwa 280 px
  breit und 200 px hoch oder größer, wenn Platz ist). Der Helligkeitsstreifen
  ist ca. 48 px breit.
- Bedienung per Zeiger-Ereignisse (Pointer Events), damit Maus und Finger
  gleich funktionieren. Während man im Feld oder auf dem Streifen zieht, darf
  die Seite nicht scrollen oder mitwackeln (`touch-action: none`).
- Alles wirkt sofort und live: Stab, Spur, Farbknopf und Überschrift des Blocks
  nehmen die neue Farbe gleich an, während man zieht.
- Es ist immer nur eine Farbwahl offen. Die Stäbe drehen im Hintergrund weiter.
- Beim Öffnen steht das Fadenkreuz und der Streifen auf der aktuellen Farbe
  des Stabs (Farbe in Farbton, Sättigung und Helligkeit umrechnen).
- Deutsche Beschriftungen, kaum Text.

### Verhalten
- Die Farbe gehört zum Stab: Der Stab, sein Gelenk-Punkt, die Spitze, die
  Überschrift des Blocks, der Farbknopf und die gesamte Spur dieses Stabs
  nutzen sie. Ändert man die Farbe, bekommt auch die schon gezeichnete Spur
  des Stabs die neue Farbe.
- Jede Farbe ist erlaubt, auch sehr dunkle. Nichts kann kaputtgehen. Der
  Hintergrund bleibt unverändert dunkel.
- Ein neu hinzugefügter Stab bekommt die Startfarbe seiner Position (wie
  bisher). Wird ein Stab entfernt, ist auch seine Farbe weg. Die Farben der
  anderen Stäbe bleiben.
- Ist die Farbwahl für einen Stab offen und dieser Stab wird per „−" entfernt,
  schließt sich das Fenster.
- Start/Pause, Löschen, Gesamt-Tempo, Richtung, Spur, Stäbe hinzufügen/
  entfernen und der Bildausschnitt funktionieren wie bisher.
- Keine Speicherung der Farben über das Neuladen hinaus (Speichern kommt
  später).

## Zusätzlich in der CLAUDE.md
Ersetze in der CLAUDE.md diese Zeile:
- Jeder Stab hat automatisch eine eigene, feste Farbe.
durch:
- Jeder Stab bekommt automatisch eine eigene Startfarbe und kann seine Farbe
  mit dem Farbwähler (Farbfeld und Helligkeitsregler) ändern. Die Farbe gilt
  für Stab und Spur zusammen.
Sonst nichts in der CLAUDE.md ändern.

## Was NICHT gebaut wird (kommt später)
Kein Farbverlauf in der Spur, keine verblassende Spur, kein „Überrasch mich",
kein Zoomen und Verschieben, keine Zahleneingabe, keine Offline-Funktion
(PWA), kein Speichern von Mustern, kein Name/Logo.

## Prüfen
- index.html im Browser öffnen.
- Beim Stab den Farbknopf tippen: Die Farbwahl öffnet sich, das Fadenkreuz
  steht an der richtigen Stelle.
- Im Farbfeld ziehen: Stab, Spur, Überschrift und Knopf ändern live die Farbe.
- Helligkeitsregler ziehen: Die Farbe wird heller bis Weiß und dunkler bis
  Schwarz.
- Ganz unten im Feld: Grau. Ganz oben: kräftige Farbe.
- Mit der Maus und, wenn möglich, mit Touch (Chrome-Entwicklerwerkzeuge,
  Geräte-Ansicht) ausprobieren: Ziehen scrollt die Seite nicht.
- Schließen mit ✕ und mit Tipp daneben.
- Mehrere Stäbe: Jeder hat seine eigene Farbe. „+" gibt die Startfarbe der
  Position, „−" schließt eine offene Farbwahl des entfernten Stabs.
- Richtung, Spur, Pause, Löschen und Gesamt-Tempo funktionieren weiter.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` und die eine Zeile in der CLAUDE.md ändern (und das
  Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_07_farbwahl.md`) selbst nach `Anweisungen/fertig`.
- Dann speichere den Stand selbst, ohne zu fragen:
  - `git add -A` (nimmt auch das Verschieben der Auftrags-Datei mit)
  - `git commit -m "Schritt 7: Farbwahl fuer Staebe und Spuren"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
- Zum Schluss in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist, dass
  die Datei verschoben und der Stand gespeichert wurde. Hochgeladen wurde
  nichts.
