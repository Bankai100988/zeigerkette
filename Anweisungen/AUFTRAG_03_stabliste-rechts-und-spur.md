# Auftrag 3: Stab-Liste rechts und Spuren zeichnen

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen
- Mit `git status` prüfen, ob alles gespeichert ist (Schritt 2).
- Wenn es ungespeicherte Änderungen gibt, kurz melden und auf die Antwort des
  Vaters warten. Sonst direkt weiter.

## Teil A: Stab-Liste am rechten Bildschirmrand
Die Bedienung zieht vom unteren Streifen in eine Leiste am rechten Rand.

- Die Zeichenfläche (Canvas) füllt den Rest links daneben. Der Drehpunkt von
  Stab 1 liegt in der Mitte der Zeichenfläche (nicht mehr in der Mitte des
  ganzen Fensters).
- Die Leiste rechts ist ca. 300 bis 340 px breit, hat einen etwas helleren
  dunklen Hintergrund und kann bei Bedarf nach unten gescrollt werden.
- Die Leiste ist eine Liste mit einem Block pro Stab, von oben nach unten:
  Stab 1 (Orange), Stab 2 (Blau).
- Jeder Block hat:
  - eine farbige Überschrift „Stab 1" / „Stab 2"
  - Regler „Länge" (0 bis 100)
  - Regler „Tempo" (0 bis 100)
  - einen Knopf „Spur" zum Ein- und Ausschalten (siehe Teil B)
- Ganz unten in der Leiste, immer sichtbar: ein großer Knopf „Start / Pause"
  (▶ / ⏸) und ein großer Knopf „Löschen" (siehe Teil B).
- Alles weiterhin groß und fingerfreundlich (mindestens ca. 48 px hoch),
  deutsche Beschriftungen, kaum Text.
- Die Liste soll später leicht um weitere Stäbe erweiterbar sein. Baue die
  Blöcke deshalb aus einer Liste (Schleife) und nicht als Einzelcode pro Stab.
  Es bleiben aber vorerst genau zwei Stäbe.
- Hochformat: Wenn das Fenster höher als breit ist, rutscht die Leiste nach
  unten unter die Zeichenfläche.

## Teil B: Spuren zeichnen
Die Spitze der Stäbe soll eine Linie hinterlassen können.

- Jeder Stab hat einen Knopf „Spur" (an/aus). Man sieht an Farbe oder
  Beschriftung, ob er an ist (zum Beispiel gefüllt = an, nur Rand = aus).
- Startwerte: Spur von Stab 2 ist AN, Spur von Stab 1 ist AUS.
- Die Spur eines Stabs ist die Linie, die seine Spitze (sein freies Ende)
  zeichnet. Sie hat dieselbe Farbe wie der Stab. Dünne Linie (ca. 2 px),
  runde Enden.
- Die Spur wird als Liste von Punkten gespeichert (nicht als fertiges Bild),
  damit sie später beim Zoomen mitwächst. Pro Stab eine eigene Liste.
- Punkte werden nur gesammelt, solange die Spur des Stabs an ist und das
  Programm nicht pausiert.
- Damit die Linien auch bei hohem Tempo glatt sind und keine Ecken haben,
  rechne die Bewegung in kleinen Zeitschritten (höchstens ca. 1/120 Sekunde
  pro Schritt) und setze in jedem Schritt einen Punkt.
- Begrenzung: höchstens ca. 50 000 Punkte pro Stab. Ist die Grenze erreicht,
  fallen die ältesten Punkte weg. Das Programm darf nie langsam werden oder
  hängen.
- Wird die Spur ausgeschaltet, bleibt die schon gezeichnete Linie stehen. Es
  kommen nur keine neuen Punkte dazu.
- Der Knopf „Löschen" entfernt alle Spuren (aller Stäbe). Die Stäbe drehen
  weiter, und neue Spuren beginnen sofort wieder.
- Die Spur wird hinter den Stäben gezeichnet, die Stäbe bleiben gut sichtbar.
- Wenn man Länge oder Tempo ändert, bleibt die alte Spur stehen und die neue
  Linie hängt sich einfach an. Nichts wird neu berechnet.
- Der Maßstab bleibt fest wie bisher (kein automatischer Bildausschnitt, kommt
  später).

## Was sich NICHT ändert
Farben, Startwerte (Länge und Tempo), die relative Drehung der Stäbe und die
Zeit-Berechnung bleiben wie sie sind.

## Was NICHT gebaut wird (kommt später)
Keine Drehrichtungs-Knöpfe, kein dritter Stab, kein Zoomen, kein automatischer
Bildausschnitt, keine Zahleneingabe, keine Offline-Funktion (PWA), kein
Speichern von Mustern, kein Name/Logo.

## Prüfen
- index.html im Browser öffnen.
- Beide Stäbe drehen, die Leiste ist rechts, die Zeichenfläche daneben.
- Stab 2 zeichnet eine blaue Spur. Spur an/aus pro Stab funktioniert.
- Pause hält auch das Zeichnen an. „Löschen" räumt auf.
- Tempo hoch stellen: Die Linie bleibt glatt und es ruckelt nicht.
- Fenster verkleinern und ins Hochformat ziehen: Die Leiste rutscht nach unten.
- Kurz auf Fehler in der Browser-Konsole schauen.

## Abschluss
- Nur `index.html` ändern (und das Verschieben dieser Auftrags-Datei).
- NICHT zu GitHub hochladen.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_03_stabliste-rechts-und-spur.md`) selbst nach
  `Anweisungen/fertig`. Gibt es den Ordner noch nicht, lege ihn an.
- Dann in 2 bis 3 einfachen Sätzen sagen, was jetzt zu sehen ist, und dass die
  Datei verschoben wurde. Vorschlagen, den Stand lokal zu speichern, und auf
  die Antwort des Vaters warten. Erst bei seinem Ja:
  - `git add -A` (nimmt auch das Verschieben mit)
  - `git commit -m "Schritt 3: Stab-Liste rechts und Spuren"`
  - Nur lokal, KEIN `git push`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
