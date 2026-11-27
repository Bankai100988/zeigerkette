# Auftrag 13: Neue Bereiche 0–100 und exakte Zahleneingabe

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen, speichere sie selbst, ohne zu fragen:
  `git add -A` und `git commit -m "Zwischenstand vor Schritt 13"` (nur lokal).

## Ziel
Alle Regler gehen von 0 bis 100 und starten bei 50. Rechts neben jedem Regler
steht die Zahl. Tippt man darauf, öffnet sich ein großes Ziffernfeld der App,
mit dem man den Wert genau eingeben kann.

## Teil A: Neue Bereiche und Bedeutung der Werte
Gilt für alle Stäbe und das Gesamt-Tempo:
- Alle Regler: 0 bis 100, ganze Zahlen.
- Startwert überall 50: Länge und Tempo der ersten zwei Stäbe, jedes neu
  hinzugefügten Stabs und das Gesamt-Tempo. Die Spur-Startwerte bleiben wie
  bisher (Stab 1 aus, alle anderen an).
- **Länge:** proportional. 0 ist wirklich 0, Länge 1 entspricht 3 Pixeln bei
  Standardansicht, Länge 100 also 300 Pixeln. Der automatische Bildausschnitt
  bleibt: Bis zu einer Gesamtlänge der Kette von 100 gilt die Standardansicht,
  darüber wird die Ansicht weich kleiner (nie größer als Standard).
- **Tempo eines Stabs:** proportional. 0 ist Stillstand, 100 ist
  15 Umdrehungen pro Sekunde (bei Gesamt-Tempo 50), 50 also 7,5.
  Richtung und relative Drehung bleiben wie bisher.
- **Gesamt-Tempo:** 0 ist Stillstand, 50 ist normal (×1), 100 ist ×50.
  Übernimm die Kurve dazwischen genau so, wie sie in
  `demos/tempo-demo.html` für die Variante ×50 programmiert ist. Der Vater
  hat sie mit dir abgestimmt. Ergänzt der Vater im Übergabetext eine andere
  Kurve, gilt seine Angabe.
- Alle diese Zahlen als Konstanten oben in `app.js`.

## Teil B: Zahl neben jedem Regler
- Rechts neben jedem Regler (Länge, Tempo jedes Stabs und Gesamt-Tempo) steht
  ein Zahlenfeld mit dem aktuellen Wert (Breite für 3 Ziffern,
  mindestens ca. 48 px hoch, gut lesbar, sieht antippbar aus).
- Regler und Zahl sind immer gleich: Bewegt man den Regler, ändert sich die
  Zahl sofort, und umgekehrt.
- Das Zahlenfeld ist ein Knopf, KEIN Eingabefeld (`<input>`), damit sich auf
  dem Tablet nie die Android-Tastatur öffnet.

## Teil C: Eigenes Ziffernfeld
- Ein Tipp auf ein Zahlenfeld öffnet ein Fenster über der Zeichenfläche
  (ähnlich wie die Farbwahl):
  - Überschrift, zum Beispiel „Stab 2 – Tempo" oder „Gesamt-Tempo"
  - große Anzeige des Werts
  - Tasten 1–9, 0, ⌫ (letzte Ziffer löschen) und „OK" (schließt)
  - Jede Taste mindestens ca. 64 px, gut mit dem Finger zu treffen
- Die erste Ziffer nach dem Öffnen ersetzt den alten Wert. Höchstens 3
  Ziffern. Ist die Zahl größer als 100, wird sie sofort auf 100 gesetzt.
- Alles wirkt sofort: Jede getippte Ziffer ändert Wert, Regler und Bild
  gleich (kein „Übernehmen" nötig). Leere Anzeige zählt als 0.
- Schließen mit „OK", mit einem Tipp außerhalb des Fensters oder (am PC) mit
  Enter bzw. Escape. Der aktuelle Wert bleibt dabei stehen.
- Am PC: Solange das Fenster offen ist, funktionieren die Zifferntasten
  (auch Ziffernblock) und die Rücktaste.
- Es ist immer nur ein Fenster offen (Ziffernfeld oder Farbwahl). Wird ein
  Stab per „−" entfernt, schließt sich ein dazugehöriges Ziffernfeld.
- Die Stäbe drehen im Hintergrund weiter.
- Pointer Events für Maus und Finger, `touch-action: manipulation`, kein
  Text markieren.

## Teil D: Leiste breiter
- Die Leiste rechts wird breiter, damit Regler und Zahlenfelder bequem
  passen. Regel: Die Zeichenfläche soll möglichst quadratisch sein. Die Leiste
  bekommt den übrigen Platz, aber mindestens ca. 340 px und höchstens ca.
  480 px.
- Nichts darf über den Rand ragen, kein waagerechter Rollbalken (Regeln aus
  Auftrag 8 gelten weiter). Hochformat wie bisher.

## Teil E: Kleinigkeiten
- `favicon.ico`-Meldung abstellen: In der `index.html` ein Symbol angeben
  (`<link rel="icon" href="icons/icon-192.png">`).
- Cache-Version in `sw.js` um eins erhöhen.

## Zusätzlich in der CLAUDE.md
1. Ersetze im Abschnitt „Bedienung (feste Regeln)" die Zeile(n) zu den
   Wertebereichen von Länge und Geschwindigkeit durch:
   - Alle Regler gehen von 0 bis 100, Startwert 50. Länge 1 = 3 Pixel
     (Standardansicht), Tempo 100 = 15 Umdrehungen pro Sekunde,
     Gesamt-Tempo 50 = normal, 100 = ×50. Länge und Tempo sind proportional.
   - Neben jedem Regler steht die Zahl. Eingabe über das eigene Ziffernfeld
     der App, nie über die Tastatur des Systems.
2. Ergänze im Abschnitt „Leistung (feste Regeln)":
   - Linien werden in kurzen Pfaden gemalt (nicht ein langer Pfad pro Stab),
     und pro Bild gilt ein Längenbudget für gemalte Linien. Beides ist für die
     Grafikkarte nötig und darf nicht „vereinfacht" werden.
Sonst nichts in der CLAUDE.md ändern.

## Was sich NICHT ändert
Herzstück, Spur-Ebene, Zeitbudget, Wächter, Notbremse, Farbwahl, Richtung,
Spur, Löschen, „+"/„−", PWA. Die Leistungsregeln aus der CLAUDE.md gelten.

## Was NICHT gebaut wird
Kein Speichern von Einstellungen oder Bildern (kommt im nächsten Auftrag),
kein Zoomen mit Fingern, kein „Überrasch mich". Die Demo-Datei bleibt, wie
sie ist.

## Prüfen
- Startwerte: alle 50, Zahlen stimmen mit den Reglern überein.
- Regler bewegen → Zahl folgt. Zahl tippen → Ziffernfeld, Eingabe wirkt
  sofort, 150 wird zu 100, ⌫ und OK funktionieren, Tipp daneben schließt.
- Am PC: Ziffern, Rücktaste, Enter, Escape.
- Länge 0 und Tempo 0 funktionieren. Gesamt-Tempo 0 steht still, 100 ist
  sehr schnell und flüssig.
- Mit Chrome-Geräteansicht (Touch) prüfen: Es öffnet sich keine
  System-Tastatur.
- Leiste: kein Überstand, kein waagerechter Rollbalken, mit 2 und 8 Stäben,
  Fenster schmal und breit.
- Leistung wie in der CLAUDE.md vorgeschrieben: 6-fach gebremster Prozessor,
  `?fps`, schlimmster Fall (8 Stäbe, alle Spuren an, alle Werte 100) ca.
  2 Minuten: flüssig, Notbremse wird nicht ausgelöst. Zahlen im Bericht nennen.
- Keine Fehler in der Konsole (auch kein `favicon.ico` mehr).
- Test-Server und Test-Browser am Ende beenden.

## Abschluss
- Geändert werden nur `index.html`, `app.js`, `sw.js` (Version), die
  CLAUDE.md (wie beschrieben) und das Verschieben dieser Auftrags-Datei.
- Diese Auftrags-Datei (`AUFTRAG_13_zahleneingabe.md`) selbst nach
  `Anweisungen/fertig` verschieben.
- Selbst speichern: `git add -A` und
  `git commit -m "Schritt 13: Bereiche 0-100 und Ziffernfeld"` (nur lokal,
  KEIN `git push`).
- In 3 bis 5 einfachen Sätzen sagen, was jetzt zu sehen ist, welche
  Gesamt-Tempo-Kurve verwendet wurde und die Messzahlen.
