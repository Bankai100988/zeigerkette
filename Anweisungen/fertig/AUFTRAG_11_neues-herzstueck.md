# Auftrag 11: Neues Herzstück (Rechnen und Zeichnen) mit Sicherheitsnetz

Lies zuerst die CLAUDE.md in diesem Ordner und halte dich an die Regeln dort.

## Ordner für Anweisungen (gilt für alle Aufträge)
- Alle Aufträge liegen im Ordner `Anweisungen`.
- Ist ein Auftrag fertig, wird seine Datei in den Unterordner
  `Anweisungen/fertig` verschoben. Das machst du selbst, sofort nach der
  Umsetzung und dem Prüfen. Du wartest damit NICHT auf das Ja des Vaters.

## Zuerst: Zustand prüfen und selbst speichern
- Mit `git status` prüfen, ob alles gespeichert ist.
- Gibt es ungespeicherte Änderungen, speichere sie jetzt selbst, ohne zu
  fragen: `git add -A` und `git commit -m "Zwischenstand vor Schritt 11"`
  (nur lokal).
- Nur wenn beim Speichern etwas schiefgeht, kurz melden und warten.

## Ziel
Auf dem Tablet (HONOR Pad 9, Chrome) hängt sich das Programm schon bei der
ersten Nutzung auf, sogar das ganze Gerät. Das Programm muss jederzeit flüssig
bleiben, egal welche Einstellungen das Kind wählt. Dafür wird das Herzstück
(Rechnen, Spur-Speicher, Zeichnen) neu geschrieben und ein Sicherheitsnetz in
drei Stufen eingebaut. Die Bedienung bleibt, wie sie ist.

Arbeite sorgfältig. Plane zuerst kurz, dann baue. Lieber gründlich als schnell.

## Diagnose (warum es jetzt hängt)
Gefunden beim Lesen des aktuellen Codes:
1. `zeichneBild()` malt in JEDEM Bild alle Spuren komplett neu. Bei bis zu
   50 000 Punkten pro Stab und 8 Stäben sind das bis zu 400 000
   Linienstücke pro Bild. Das ist die Hauptursache.
2. `MAX_ZEITSCHRITT = 1/240` und `MAX_ZEITSPRUNG = 0.1`, dazu Gesamt-Tempo
   bis 3000: Bis zu ca. 720 Rechenschritte pro Bild, jeder Schritt legt pro
   Stab einen neuen Punkt an. Die Spur ist in ca. 1 Sekunde voll. Auch bei
   normalem Tempo ist sie nach ca. 3,5 Minuten voll.
3. `punkteBegrenzen()` nutzt `splice(0, …)` auf Listen mit 50 000 Einträgen,
   und das in jedem Bild.
4. Jeder Punkt ist ein eigenes Objekt `{x, y}`. `ketteEchtBerechnen()` legt in
   jedem Rechenschritt ein neues Array mit neuen Objekten an. In jedem
   Rechenschritt wird `parseFloat(regler.value)` aus der Seite gelesen. Das
   erzeugt sehr viel Speichermüll und Aufräum-Pausen.
5. Die Zeichenfläche nutzt die volle `devicePixelRatio` des Tablets (sehr
   viele Pixel).

## Was bleibt (nicht verändern)
- Aussehen und Aufbau der Leiste, alle Knöpfe, Regler, die Farbwahl, die
  Lesbarkeits-Logik, die PWA-Dateien (bis auf die Cache-Version, siehe unten).
- Alle Bereiche und Startwerte, so wie sie jetzt im Code stehen: Länge 0–200,
  Tempo 0–1000, Gesamt-Tempo 0–3000, Startwerte der ersten zwei Stäbe, Werte
  neuer Stäbe, Startfarben, 1 bis 8 Stäbe.
- Die Bedeutung der Werte: `BASIS_PIXEL_PRO_LAENGE`, Tempo 100 = eine Umdrehung
  in 2 Sekunden, Gesamt-Tempo 100 = normal.
- Das Verhalten: relative Drehung, Drehrichtung ohne Springen, Spur an/aus mit
  Lücke (keine Linie über die Lücke), Löschen, „+" und „−", automatischer
  Bildausschnitt mit weichem Nachziehen (nie größer als Standard), Pause.
- Das Kind darf keinen Unterschied in der Bedienung merken. Es soll nur
  flüssiger laufen.

## Das neue Herzstück

### A. Werte zwischenspeichern, kein Müll in der Schleife
- Jeder Stab speichert `laenge`, `tempo`, `richtung`, `farbe` als einfache
  Zahlen/Texte. Sie werden nur bei den Ereignissen der Regler und Knöpfe
  (`input`, `click`) aktualisiert. In der Rechen- und Zeichenschleife werden
  KEINE Werte aus der Seite (DOM) gelesen. Dasselbe gilt für das Gesamt-Tempo.
- In der Rechenschleife werden keine neuen Objekte oder Arrays angelegt. Die
  Kette (Gelenkpunkte) wird in ein vorher angelegtes `Float64Array`
  geschrieben.
- Die DOM wird pro Bild nicht verändert (Ausnahme: die FPS-Anzeige, siehe J,
  höchstens ca. 4-mal pro Sekunde).

### B. Spur-Speicher als Ringpuffer
- Jeder Stab hat einen festen Speicher `Float32Array` für x/y-Paare, der beim
  Anlegen des Stabs einmal erzeugt wird und nie wächst (Ringpuffer: Ist er
  voll, überschreibt der neue Punkt den ältesten. Kein `splice`, kein
  Verschieben).
- Kapazität: 50 000 Punkte pro Stab (Konstante oben im Code). Die Lücke
  (Spur aus/an) wird als besonderer Wert gespeichert (zum Beispiel `NaN`).
- Ausdünnen: Ein neuer Punkt wird nur gespeichert, wenn er auf dem Bildschirm
  mindestens ca. 1 Pixel (CSS-Pixel bei der aktuellen Skala) vom zuletzt
  gespeicherten Punkt entfernt ist. Die Spitze rechnet trotzdem in jedem
  Schritt weiter, nur das Speichern wird ausgelassen.
- Gesamtobergrenze des Speichers: Alle Spuren zusammen belegen höchstens
  ca. 4 MB. Wird ein Stab entfernt, wird sein Speicher freigegeben.

### C. Spur-Ebene: dazumalen statt neu malen
- Es gibt eine zweite, versteckte Zeichenfläche (Spur-Ebene, ein
  `OffscreenCanvas` oder ein nicht angezeigtes `canvas`), so groß wie die
  sichtbare Zeichenfläche.
- In jedem Bild werden NUR die neu gespeicherten Punkte als Linienstücke auf
  die Spur-Ebene gemalt (pro Stab ein einziger `beginPath`/`stroke`).
- Das sichtbare Bild besteht pro Bild nur aus: Hintergrund füllen,
  Spur-Ebene mit `drawImage` darüberlegen, Stäbe und Punkte zeichnen.
- Kein Schatten, kein Weichzeichner, keine Transparenz in der Spur.

### D. Komplett neu malen nur, wenn nötig (schrittweise)
- Die Spur-Ebene wird nur dann aus den gespeicherten Punkten neu aufgebaut,
  wenn sich die Ansicht ändert: Bildausschnitt (Skala) hat sich verändert,
  Fenstergröße, Auflösung (siehe F), Farbe eines Stabs, Stab entfernt.
- Löschen: Spur-Ebene einfach leeren, kein Neuaufbau.
- Der Neuaufbau geschieht schrittweise über mehrere Bilder (innerhalb des
  Zeitbudgets, siehe E), nie in einem Rutsch. Solange er läuft, wird das alte
  Bild der Spur-Ebene weiter angezeigt.
- Während der Bildausschnitt weich gleitet: Die vorhandene Spur-Ebene wird
  beim Darüberlegen nur passend gestreckt (um die Mitte skaliert, Verhältnis
  aktuelle Skala zu der Skala, mit der die Ebene gemalt wurde). Erst wenn die
  Skala ca. 0,3 Sekunden praktisch stillsteht, wird die Ebene einmal scharf
  neu aufgebaut.
- Farbwahl: Während man im Farbfeld zieht, höchstens ca. alle 150 ms einen
  Neuaufbau anstoßen. Ein laufender Neuaufbau wird dann neu begonnen.

### E. Zeitbudget pro Bild (Sicherheitsnetz Stufe 1)
- Rechnen und Dazumalen zusammen dürfen pro Bild höchstens ca. 6 ms dauern,
  der schrittweise Neuaufbau zusätzlich höchstens ca. 4 ms. Prüfe dazu
  regelmäßig `performance.now()` (zum Beispiel alle 64 Rechenschritte bzw.
  alle paar tausend Punkte beim Neuaufbau).
- Ist das Budget verbraucht, wird die restliche Bewegungszeit dieses Bildes
  verworfen (nicht aufgeschoben, damit sich kein Rückstand aufstaut). Das
  Programm läuft dann bei extremen Werten etwas langsamer als eingestellt, aber
  es hängt nie.
- Zusätzliche feste Grenze: höchstens ca. 2000 Rechenschritte pro Bild. Wären
  es mehr, wird der einzelne Rechenschritt entsprechend größer (die Linie
  wird dann bei extremen Werten etwas eckiger).
- `MAX_ZEITSPRUNG` bleibt bei 0,1 s.
- Kein einzelnes Bild darf durch dein Programm länger als ca. 16 ms Arbeit
  verursachen.

### F. Auflösung begrenzen
- Die Zeichenflächen nutzen höchstens eine Pixeldichte von 1,5
  (`Math.min(devicePixelRatio, 1.5)`, Konstante oben im Code). Der Wächter
  (G) kann sie weiter senken.

### G. Wächter (Sicherheitsnetz Stufe 2)
- Misst laufend die Bildrate (gleitender Mittelwert über ca. 2 Sekunden).
- Liegt sie ca. 3 Sekunden lang unter 30 Bildern pro Sekunde, schaltet er eine
  Stufe herunter:
  - Stufe 1: Pixeldichte 1,0
  - Stufe 2: Alle Spuren ausdünnen (jeden zweiten gespeicherten Punkt
    weglassen) und die Kapazität pro Stab halbieren
  - Stufe 3: Pixeldichte 0,75
- Liegt sie ca. 10 Sekunden lang über 50 Bildern pro Sekunde, darf er die
  Pixeldichte wieder eine Stufe anheben (das Ausdünnen bleibt).
- Nach jedem Wechsel ca. 3 Sekunden Ruhezeit, bevor er wieder misst.
- Für das Kind unsichtbar, kein Hinweis.

### H. Notbremse (Sicherheitsnetz Stufe 3)
- Auslöser: Trotz Stufe 3 liegt die Bildrate ca. 5 Sekunden lang unter 15
  Bildern pro Sekunde, ODER es gibt innerhalb von 10 Sekunden drei Bilder mit
  mehr als 500 ms Abstand (während die Seite sichtbar ist).
- Dann hält das Programm selbst an (wie Pause) und zeigt ein großes Fenster
  über der Zeichenfläche: großes Symbol ⏸ und kurzer Text „Puh, zu viel!".
  Darunter zwei große Knöpfe: „Weiter" und „Spuren löschen und weiter".
- Alle Einstellungen bleiben erhalten. Solange das Fenster offen ist, wird
  nichts gerechnet und nichts neu aufgebaut. Das Bild bleibt stehen.
- Nach „Weiter" werden die Messwerte des Wächters zurückgesetzt, ca. 5
  Sekunden Ruhezeit.
- Fingergroß, deutsch, kaum Text, im Stil der übrigen Knöpfe.

### Ausnahmen für Wächter und Notbremse
- Ist die Seite nicht sichtbar (`visibilitychange`, App im Hintergrund), wird
  nicht gemessen. Beim Zurückkommen werden die Messwerte zurückgesetzt.
- In den ersten ca. 3 Sekunden nach dem Start wird nicht gemessen.
- Pause durch das Kind zählt nicht als langsam.

### I. Sonstiges
- `requestAnimationFrame` läuft weiter wie bisher. Ist das Programm pausiert
  und ändert sich nichts, darf das Neuzeichnen des sichtbaren Bildes
  ausgelassen werden.
- Bei einer Änderung der Fenstergröße: Zeichenflächen anpassen und Spur-Ebene
  schrittweise neu aufbauen (D).

### J. Versteckte Messanzeige
- Nur wenn die Adresse `?fps` enthält (zum Beispiel `index.html?fps`), zeigt
  eine kleine Anzeige in einer Ecke: Bilder pro Sekunde, Rechenschritte pro
  Bild, gespeicherte Punkte gesamt, Wächter-Stufe, Pixeldichte. Ohne `?fps`
  ist davon nichts zu sehen.
- Nur für Tests: Mit `?stress` wird pro Bild künstlich Rechenzeit verbraucht
  (zum Beispiel ca. 80 ms Warteschleife), damit man Wächter und Notbremse
  ausprobieren kann. Ohne `?stress` passiert das nie.

## Aufbau des Codes
- Lege das JavaScript in eine eigene Datei `app.js` im Hauptordner (die
  `index.html` wird dadurch übersichtlicher). Die Registrierung des Service
  Workers darf in der `index.html` bleiben.
- Gliedere `app.js` in klar benannte Abschnitte mit kurzen deutschen
  Kommentaren: Einstellungen, Stäbe und Bedienung, Farbwahl, Spur-Speicher,
  Rechnen, Zeichnen und Spur-Ebene, Wächter und Notbremse, Messanzeige,
  Hauptschleife.
- Alle wichtigen Zahlen (Budgets, Grenzen, Schwellen) als Konstanten oben.
- In `sw.js`: `./app.js` in die Dateiliste aufnehmen und die Cache-Version
  erhöhen (zum Beispiel `zeigerkette-v2`). Alle Pfade bleiben relativ.

## Zusätzlich in der CLAUDE.md
Füge vor dem Abschnitt „Datenschutz" einen neuen Abschnitt ein:

## Leistung (feste Regeln)
- Die Spuren werden nie in jedem Bild komplett neu gemalt. Neue Stücke werden
  auf die Spur-Ebene dazugemalt. Ein Neuaufbau geschieht nur bei einer
  Änderung der Ansicht und schrittweise.
- In der Rechen- und Zeichenschleife werden keine Werte aus der Seite gelesen
  und keine neuen Objekte angelegt.
- Zeitbudget pro Bild, Wächter und Notbremse bleiben immer eingebaut und
  dürfen nicht abgeschwächt werden.
- Jede neue Funktion wird mit gebremstem Prozessor (Chrome, 6-fach) und
  `?fps` geprüft, bevor sie fertig ist.

Ergänze außerdem im Abschnitt „Technik" in der Zeile zur PWA `app.js` als
Programmdatei. Sonst nichts in der CLAUDE.md ändern.

## Prüfen (gründlich, mit Zahlen)
Teste wie beim PWA-Auftrag in einem Chrome mit leerem Testprofil (nicht dem
Profil des Vaters) über einen lokalen Server und steuere ihn über das
DevTools-Protokoll.
- Tablet nachstellen: Fenster ca. 1280 × 800, Pixeldichte 2, Prozessor
  6-fach gebremst (`Emulation.setCPUThrottlingRate`).
- Seite mit `?fps` öffnen. Miss in jedem Fall Bildrate (Mittel und
  schlechtestes Bild) und den JavaScript-Speicher
  (`Performance.getMetrics`, `JSHeapUsedSize`) am Anfang und am Ende.

Fälle:
1. **Normal:** 2 Stäbe mit Startwerten, 3 Minuten.
2. **Schlimmster Fall:** 8 Stäbe, alle Spuren an, verschiedene Längen, alle
   Tempi 1000, Gesamt-Tempo 3000, 3 Minuten.
3. **Bildausschnitt:** Im schlimmsten Fall mehrmals Längen auf 200 und
   zurück ziehen.
4. **Farbwahl:** Mit vollen Spuren im Farbfeld hin und her ziehen.
5. **Löschen, „+", „−", Richtung, Spur an/aus, Pause** mit vollen Spuren.
6. **Notbremse:** Mit `?fps&stress` öffnen. Der Wächter schaltet herunter, dann
   erscheint „Puh, zu viel!". Beide Knöpfe funktionieren.

Ziele mit 6-fach gebremstem Prozessor:
- Fälle 1 bis 5: im Mittel mindestens 30 Bilder pro Sekunde, kein Bild über
  ca. 100 ms, die Notbremse wird NICHT ausgelöst.
- Der Speicher wächst nach dem Füllen der Spuren nicht weiter an.
- Das Verhalten (Muster, Drehrichtung, Lücken, Bildausschnitt) sieht aus wie
  vorher. Vergleiche dazu ein Bildschirmfoto mit der alten Version bei
  Startwerten.
- Keine Fehler in der Konsole. Mit Doppelklick auf `index.html` läuft es auch.

Wird ein Ziel nicht erreicht, verbessere den Code und teste erneut. Klappt es
nach zwei Versuchen nicht, melde die Zahlen und frage den Vater.
Beende am Ende Test-Server und Test-Browser und prüfe, dass nichts weiterläuft.

## Abschluss
- Geändert oder angelegt werden nur: `index.html`, `app.js` (neu), `sw.js`
  (Dateiliste und Version), die CLAUDE.md (wie beschrieben) und das
  Verschieben dieser Auftrags-Datei.
- Sobald alles umgesetzt und geprüft ist, verschiebe diese Auftrags-Datei
  (`AUFTRAG_11_neues-herzstueck.md`) selbst nach `Anweisungen/fertig`.
- Speichere den Stand selbst, ohne zu fragen:
  `git add -A` und `git commit -m "Schritt 11: neues Herzstueck mit Sicherheitsnetz"`.
- Hochladen (`git push`) NUR, wenn der Vater es im Übergabetext für diesen
  Auftrag ausdrücklich erlaubt hat und alle Ziele erreicht sind. Nie mit
  `--force`.
- Commit-Texte enthalten keine Namen oder persönlichen Daten.
- Zum Schluss in einfachen Sätzen sagen: was jetzt anders ist, die
  gemessenen Zahlen (vorher/nachher, wenn möglich) als kleine Tabelle, ob
  die Notbremse im Stresstest funktioniert hat, ob gespeichert und ob
  hochgeladen wurde.
