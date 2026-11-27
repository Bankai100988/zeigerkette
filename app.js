// Zeigerketten-Spirograph: das ganze Programm.
// Abschnitte: Einstellungen, Stäbe und Bedienung, Farbwahl, Spur-Speicher,
// Rechnen, Zeichnen und Spur-Ebene, Wächter und Notbremse, Messanzeige,
// Hauptschleife.
(function () {
  "use strict";

  // =====================================================================
  // Einstellungen
  // =====================================================================
  var REGLER_MAX = 100;             // Alle Regler gehen von 0 bis 100 (ganze Zahlen)
  var REGLER_START = 50;            // Startwert aller Regler
  var BASIS_PIXEL_PRO_LAENGE = 3;   // Länge 1 = 3 Pixel (Standardansicht), Länge 100 = 300 Pixel
  var MAX_UMDREHUNG_PRO_SEK = 15;   // Tempo 100 = 15 Umdrehungen pro Sekunde (bei Gesamt-Tempo 50)
  var MITTE_UMDREHUNG_PRO_SEK = 2;  // Tempo 50 = 2 Umdrehungen pro Sekunde (bei Gesamt-Tempo 50)
  var GESAMT_TEMPO_NORMAL = 50;     // Gesamt-Tempo 50 = normal (x1)
  var GESAMT_TEMPO_MAX_FAKTOR = 50; // Gesamt-Tempo 100 = x50
  var MAX_ZEITSCHRITT = 1 / 240;    // Höchstens so viele Sekunden pro Rechenschritt
  var MAX_ZEITSPRUNG = 0.1;         // Mehr Zeit pro Bild wird gekappt (z. B. nach Tab-Wechsel)
  var MAX_SCHRITTE_PRO_BILD = 2000; // Feste Grenze, sonst wird der Einzelschritt größer
  var MINDEST_BEZUGSLAENGE = 100;   // Bis zu dieser Gesamtlänge gilt die Standardansicht
  var RAND_ANTEIL = 1.05;           // ca. 5 % Rand um die Kette herum
  var SKALA_ZEITKONSTANTE = 0.15;   // Wie schnell die Ansicht weich nachzieht
  var SKALA_EINRASTEN = 0.003;      // So nah am Ziel rastet die Skala ein (0,3 %)
  var SKALA_RUHE_MS = 300;          // So lange muss die Skala stillstehen bis zum scharfen Neuaufbau
  var MIN_STAEBE = 1;
  var MAX_STAEBE = 8;

  // Spur-Speicher
  var MAX_PUNKTE_PRO_STAB = 50000;
  var MAX_SPUR_BYTES = 4 * 1024 * 1024; // Alle Spuren zusammen höchstens ca. 4 MB
  var BYTES_PRO_PUNKT = 8;              // x und y als Float32 (je 4 Byte)
  var MIN_PUNKT_ABSTAND_PX = 1;         // Neuer Punkt erst ab ca. 1 Pixel Abstand

  // Zeitbudget pro Bild (Sicherheitsnetz Stufe 1)
  var BUDGET_RECHNEN_MS = 6;     // Rechnen + Dazumalen
  var BUDGET_AUFBAU_MS = 4;      // Schrittweiser Neuaufbau zusätzlich
  var PRUEFEN_ALLE_SCHRITTE = 16;
  var AUFBAU_PAKET = 128;        // So viele Linienstücke, dann Uhr prüfen
  // Lange Linienzüge in kurze Pfade teilen. Ein langer Pfad mit sich kreuzenden
  // Linien kostet die Grafikkarte sehr viel Zeit (gemessen: bis 250 ms pro Bild),
  // kurze Pfade fast nichts. Das Aussehen bleibt gleich (runde Enden).
  var MAX_STUECKE_PRO_PFAD = 64;
  var MAX_PFAD_LAENGE_PX = 256;  // Gerätepixel (grob gemessen: |dx| + |dy|)
  // Linienlänge pro Bild (Gerätepixel), damit die Grafikkarte nicht überlastet wird.
  var BUDGET_LINIE_RECHNEN_PX = 100000; // Rechnen + Dazumalen (gemessen: ca. 70 000 laufen flüssig)
  var BUDGET_LINIE_AUFBAU_PX = 50000;   // Neuaufbau zusätzlich (mindestens 1 Paket)
  var FARB_AUFBAU_ABSTAND_MS = 150;

  // Auflösung
  var MAX_PIXELDICHTE = 1.5;
  var WAECHTER_DICHTEN = [MAX_PIXELDICHTE, 1.0, 1.0, 0.75]; // je Wächter-Stufe 0 bis 3

  // Wächter (Stufe 2) und Notbremse (Stufe 3)
  var MESS_FENSTER_MS = 2000;   // Gleitender Mittelwert der Bildrate
  var START_RUHE_MS = 3000;     // Nach dem Start nicht messen
  var LANGSAM_FPS = 30;
  var LANGSAM_DAUER_MS = 3000;
  var SCHNELL_FPS = 50;
  var SCHNELL_DAUER_MS = 10000;
  var WECHSEL_RUHE_MS = 3000;
  var NOT_FPS = 15;
  var NOT_DAUER_MS = 5000;
  var HAENGER_MS = 500;
  var HAENGER_ANZAHL = 3;
  var HAENGER_FENSTER_MS = 10000;
  var WEITER_RUHE_MS = 5000;

  // Messanzeige und Testmodus
  var ANZEIGE_ABSTAND_MS = 250; // höchstens 4-mal pro Sekunde
  var STRESS_MS = 80;

  var HINTERGRUND = "#14141f";

  // Feste Startfarbe je Position in der Kette (1. Stab, 2. Stab, ...).
  var FARBEN = [
    "#ff9800", // 1 Orange
    "#2196f3", // 2 Blau
    "#4caf50", // 3 Grün
    "#e91e63", // 4 Pink
    "#ffeb3b", // 5 Gelb
    "#00bcd4", // 6 Türkis
    "#f44336", // 7 Rot
    "#9c27b0"  // 8 Violett
  ];

  // Startwerte der ersten zwei Stäbe (bleiben wie bisher).
  var ANFANGS_WERTE = [
    { laenge: REGLER_START, tempo: REGLER_START, spur: false },
    { laenge: REGLER_START, tempo: REGLER_START, spur: true }
  ];
  // Werte für jeden neu hinzugefügten Stab.
  var NEUER_STAB_WERTE = { laenge: REGLER_START, tempo: REGLER_START, spur: true };

  var adressTeile = new URLSearchParams(location.search);
  var MESSANZEIGE_AN = adressTeile.has("fps");
  var STRESS_AN = adressTeile.has("stress");

  // =====================================================================
  // Gemeinsamer Zustand
  // =====================================================================
  var buehne = document.getElementById("bühne");
  var canvas = document.getElementById("zeichenflaeche");
  var ctx = canvas.getContext("2d", { alpha: false });
  var stabListe = document.getElementById("stab-liste");
  var knopfStartPause = document.getElementById("start-pause");
  var knopfLoeschen = document.getElementById("loeschen");
  var reglerGesamtTempo = document.getElementById("gesamt-tempo");
  var knopfStabMinus = document.getElementById("stab-minus");
  var knopfStabPlus = document.getElementById("stab-plus");
  var anzeigeStabAnzahl = document.getElementById("stab-anzahl");

  var läuft = true;
  var staebe = [];
  var gesamtTempo = gesamtTempoFaktor(parseFloat(reglerGesamtTempo.value)); // 1 = normal
  var gesamtLaenge = 0;      // Summe aller Längen (für den Bildausschnitt)
  var aktuelleSkala = 1;
  var buehneBreite = 1;      // CSS-Pixel, nur beim Größenwechsel gelesen
  var buehneHoehe = 1;
  var pixeldichte = 1;
  var canvasPw = 1;          // Größe der Zeichenfläche in Gerätepixeln
  var canvasPh = 1;
  var waechterStufe = 0;
  var neuZeichnen = true;    // Sichtbares Bild muss neu gemalt werden (für die Pause)
  var aufbauWunsch = false;  // Spur-Ebene soll neu aufgebaut werden
  var farbAufbauWartet = false;
  var letzterFarbAufbau = -1e9;

  // Wie viele Punkte ein Stab höchstens speichert (passt immer in MAX_SPUR_BYTES).
  var spurKapazitaet = Math.min(
    MAX_PUNKTE_PRO_STAB,
    Math.floor(MAX_SPUR_BYTES / (MAX_STAEBE * BYTES_PRO_PUNKT))
  );

  // =====================================================================
  // Stäbe und Bedienung
  // =====================================================================

  // Gesamt-Tempo-Kurve (wie in demos/tempo-demo.html, Variante x50):
  // 0 = Stillstand, sonst Faktor = Höchstfaktor hoch ((Wert - Normal) / Normal).
  // 50 = x1, 100 = x50, 25 = ca. x0,14. Wird nur bei Änderung berechnet.
  function gesamtTempoFaktor(wert) {
    if (wert <= 0) {
      return 0;
    }
    return Math.pow(GESAMT_TEMPO_MAX_FAKTOR, (wert - GESAMT_TEMPO_NORMAL) / GESAMT_TEMPO_NORMAL);
  }

  // Winkelgeschwindigkeit eines Stabs aus Tempo und Richtung (nur bei Änderung).
  // Tempo-Kurve: 0 = Stillstand, 50 = 2 pro Sekunde, 100 = 15 pro Sekunde.
  // Von 0 bis 50 gleichmäßig, von 50 bis 100 im gleichen Verhältnis steigend.
  function umdrehungenProSek(tempo) {
    var mitte = REGLER_MAX / 2;
    if (tempo <= mitte) {
      return MITTE_UMDREHUNG_PRO_SEK * tempo / mitte;
    }
    return MITTE_UMDREHUNG_PRO_SEK *
      Math.pow(MAX_UMDREHUNG_PRO_SEK / MITTE_UMDREHUNG_PRO_SEK, (tempo - mitte) / mitte);
  }

  function omegaBerechnen(stab) {
    stab.omega = stab.richtung * umdrehungenProSek(stab.tempo) * Math.PI * 2;
  }

  // Verbindet Regler und Zahlenknopf: beide zeigen immer denselben Wert.
  // "beiAenderung(wert)" wird nach jeder Änderung aufgerufen.
  function zahlenReglerVerbinden(regler, knopf, titelFunktion, besitzer, beiAenderung) {
    var r = { regler: regler, knopf: knopf, besitzer: besitzer, wert: 0 };
    r.setzen = function (v) {
      v = Math.max(0, Math.min(REGLER_MAX, Math.round(v)));
      r.wert = v;
      regler.value = String(v);
      knopf.textContent = String(v);
      beiAenderung(v);
    };
    regler.min = "0";
    regler.max = String(REGLER_MAX);
    regler.step = "1";
    regler.addEventListener("input", function () {
      r.setzen(parseFloat(regler.value));
    });
    knopf.addEventListener("click", function () {
      ziffernOeffnen(r, titelFunktion());
    });
    r.wert = Math.max(0, Math.min(REGLER_MAX, Math.round(parseFloat(regler.value))));
    knopf.textContent = String(r.wert);
    return r;
  }

  function gesamtLaengeBerechnen() {
    var summe = 0;
    for (var i = 0; i < staebe.length; i++) {
      summe += staebe[i].laenge;
    }
    gesamtLaenge = summe;
  }

  // Baut einen Stab-Block (DOM) an der gegebenen Position auf und gibt das
  // dazugehörige Stab-Objekt zurück. Wird beim Start und beim Hinzufügen benutzt.
  function stabErzeugen(index, laengeStart, tempoStart, spurStart) {
    var id = index + 1;
    var farbe = FARBEN[index % FARBEN.length];

    var block = document.createElement("div");
    block.className = "block";

    var titelZeile = document.createElement("div");
    titelZeile.className = "titel-zeile";

    var titel = document.createElement("p");
    titel.className = "block-titel";
    titel.textContent = "Stab " + id;
    titelZeile.appendChild(titel);

    var kopfKnoepfe = document.createElement("div");
    kopfKnoepfe.className = "kopf-knoepfe";

    var richtungKnopf = document.createElement("button");
    richtungKnopf.className = "richtung-knopf";
    richtungKnopf.textContent = "↻";
    kopfKnoepfe.appendChild(richtungKnopf);

    var spurKnopf = document.createElement("button");
    spurKnopf.className = "spur-knopf";
    spurKnopf.textContent = "Spur";
    kopfKnoepfe.appendChild(spurKnopf);

    var farbKnopf = document.createElement("button");
    farbKnopf.className = "farb-knopf";
    kopfKnoepfe.appendChild(farbKnopf);

    titelZeile.appendChild(kopfKnoepfe);
    block.appendChild(titelZeile);

    var zeileLaenge = document.createElement("div");
    zeileLaenge.className = "regler-zeile";
    var labelLaenge = document.createElement("label");
    labelLaenge.textContent = "Länge";
    labelLaenge.setAttribute("for", "laenge-" + id);
    var reglerLaenge = document.createElement("input");
    reglerLaenge.type = "range";
    reglerLaenge.min = "0";
    reglerLaenge.max = String(REGLER_MAX);
    reglerLaenge.value = String(laengeStart);
    reglerLaenge.id = "laenge-" + id;
    var zahlLaenge = document.createElement("button");
    zahlLaenge.className = "zahl-knopf";
    zeileLaenge.appendChild(labelLaenge);
    zeileLaenge.appendChild(reglerLaenge);
    zeileLaenge.appendChild(zahlLaenge);
    block.appendChild(zeileLaenge);

    var zeileTempo = document.createElement("div");
    zeileTempo.className = "regler-zeile";
    var labelTempo = document.createElement("label");
    labelTempo.textContent = "Tempo";
    labelTempo.setAttribute("for", "tempo-" + id);
    var reglerTempo = document.createElement("input");
    reglerTempo.type = "range";
    reglerTempo.min = "0";
    reglerTempo.max = String(REGLER_MAX);
    reglerTempo.value = String(tempoStart);
    reglerTempo.id = "tempo-" + id;
    var zahlTempo = document.createElement("button");
    zahlTempo.className = "zahl-knopf";
    zeileTempo.appendChild(labelTempo);
    zeileTempo.appendChild(reglerTempo);
    zeileTempo.appendChild(zahlTempo);
    block.appendChild(zeileTempo);

    stabListe.appendChild(block);

    var stab = {
      block: block,
      titelElement: titel,
      spurKnopf: spurKnopf,
      richtungKnopf: richtungKnopf,
      farbKnopf: farbKnopf,
      // Zwischengespeicherte Werte (nur bei Reglern/Knöpfen geändert):
      laenge: parseFloat(reglerLaenge.value),
      tempo: parseFloat(reglerTempo.value),
      richtung: 1, // 1 = im Uhrzeigersinn, -1 = dagegen
      omega: 0,
      farbe: farbe,
      spurAn: false,
      winkelEigen: 0,
      spur: spurSpeicherAnlegen(spurKapazitaet)
    };
    omegaBerechnen(stab);

    function spurAnzeigeAktualisieren() {
      if (stab.spurAn) {
        spurKnopf.classList.add("an");
      } else {
        spurKnopf.classList.remove("an");
      }
    }

    zahlenReglerVerbinden(reglerLaenge, zahlLaenge, function () {
      return "Stab " + id + " – Länge";
    }, stab, function (v) {
      stab.laenge = v;
      gesamtLaengeBerechnen();
      neuZeichnen = true;
    });

    zahlenReglerVerbinden(reglerTempo, zahlTempo, function () {
      return "Stab " + id + " – Tempo";
    }, stab, function (v) {
      stab.tempo = v;
      omegaBerechnen(stab);
    });

    spurKnopf.addEventListener("click", function () {
      stab.spurAn = !stab.spurAn;
      if (stab.spurAn) {
        // Lücke merken, damit keine Linie über die Pause hinweg gezogen wird.
        lueckeSpeichern(stab.spur);
      }
      spurAnzeigeAktualisieren();
    });

    richtungKnopf.addEventListener("click", function () {
      stab.richtung = -stab.richtung;
      omegaBerechnen(stab);
      richtungKnopf.textContent = stab.richtung === 1 ? "↻" : "↺";
    });

    farbKnopf.addEventListener("click", function () {
      farbwahlOeffnen(stab);
    });

    stab.spurAn = spurStart;
    spurAnzeigeAktualisieren();
    farbeAnwenden(stab, farbe);

    return stab;
  }

  function stabKnoepfeAktualisieren() {
    anzeigeStabAnzahl.textContent = String(staebe.length);
    knopfStabPlus.disabled = staebe.length >= MAX_STAEBE;
    knopfStabMinus.disabled = staebe.length <= MIN_STAEBE;
  }

  function stabHinzufuegen() {
    if (staebe.length >= MAX_STAEBE) {
      return;
    }
    var index = staebe.length;
    var stab = stabErzeugen(index, NEUER_STAB_WERTE.laenge, NEUER_STAB_WERTE.tempo, NEUER_STAB_WERTE.spur);
    staebe.push(stab);
    gesamtLaengeBerechnen();
    stabKnoepfeAktualisieren();
    stabListe.scrollTop = stabListe.scrollHeight;
    neuZeichnen = true;
  }

  function stabEntfernen() {
    if (staebe.length <= MIN_STAEBE) {
      return;
    }
    var stab = staebe.pop();
    if (aktiverFarbStab === stab) {
      farbwahlSchliessen();
    }
    if (ziffernRegler && ziffernRegler.besitzer === stab) {
      ziffernSchliessen();
    }
    stabListe.removeChild(stab.block);
    stab.spur = null; // Speicher freigeben
    gesamtLaengeBerechnen();
    stabKnoepfeAktualisieren();
    aufbauWunsch = true; // Seine Spur muss aus dem Bild verschwinden
    neuZeichnen = true;
  }

  function spurenLoeschen() {
    for (var i = 0; i < staebe.length; i++) {
      spurLeeren(staebe[i].spur);
    }
    ebeneLeeren(ebene);
    if (aufbau) {
      ebeneLeeren(aufbau);
    }
    neuZeichnen = true;
  }

  knopfStartPause.addEventListener("click", function () {
    läuft = !läuft;
    knopfStartPause.textContent = läuft ? "⏸" : "▶";
    neuZeichnen = true;
  });

  knopfLoeschen.addEventListener("click", spurenLoeschen);
  knopfStabPlus.addEventListener("click", stabHinzufuegen);
  knopfStabMinus.addEventListener("click", stabEntfernen);

  zahlenReglerVerbinden(reglerGesamtTempo, document.getElementById("gesamt-tempo-zahl"), function () {
    return "Gesamt-Tempo";
  }, null, function (v) {
    gesamtTempo = gesamtTempoFaktor(v);
  });

  // =====================================================================
  // Farbwahl
  // =====================================================================
  var farbwahlPopup = document.getElementById("farbwahl");
  var farbwahlTitel = document.getElementById("farbwahl-titel");
  var farbwahlSchliessenKnopf = document.getElementById("farbwahl-schliessen");
  var feldCanvas = document.getElementById("farbfeld-canvas");
  var feldCtx = feldCanvas.getContext("2d");
  var FELD_BREITE = feldCanvas.width;
  var FELD_HOEHE = feldCanvas.height;
  var streifenCanvas = document.getElementById("helligkeit-canvas");
  var streifenCtx = streifenCanvas.getContext("2d");
  var STREIFEN_BREITE = streifenCanvas.width;
  var STREIFEN_HOEHE = streifenCanvas.height;

  var aktiverFarbStab = null;
  var aktuellerHue = 0;   // 0 bis 360
  var aktuellerSat = 1;   // 0 bis 1
  var aktuellerLight = 0.5; // 0 bis 1

  function hexZuHsl(hex) {
    var r = parseInt(hex.substr(1, 2), 16) / 255;
    var g = parseInt(hex.substr(3, 2), 16) / 255;
    var b = parseInt(hex.substr(5, 2), 16) / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;

    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / d + 2;
      } else {
        h = (r - g) / d + 4;
      }
      h *= 60;
    }
    return { h: h, s: s, l: l };
  }

  function farbeZuHsl(farbe) {
    if (farbe.charAt(0) === "#") {
      return hexZuHsl(farbe);
    }
    var treffer = /^hsl\(([\-\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)$/.exec(farbe);
    if (treffer) {
      return {
        h: parseFloat(treffer[1]),
        s: parseFloat(treffer[2]) / 100,
        l: parseFloat(treffer[3]) / 100
      };
    }
    return { h: 0, s: 0, l: 0.5 };
  }

  function hslZuCss(h, s, l) {
    var hNorm = ((h % 360) + 360) % 360;
    return "hsl(" + hNorm.toFixed(1) + "," + (s * 100).toFixed(1) + "%," + (l * 100).toFixed(1) + "%)";
  }

  var LESBARKEITS_SCHWELLE = 0.55; // Ab hier gilt eine Farbe als gut lesbar

  // Setzt die echte Farbe eines Stabs (für Stab und Spur) und berechnet dazu
  // eine aufgehellte "Lesefarbe" für Überschrift/Knopf-Rahmen in der Leiste,
  // falls die echte Farbe sehr dunkel ist. Der Stab selbst behält immer seine
  // echte Farbe.
  function farbeAnwenden(stab, farbe) {
    stab.farbe = farbe;
    var hsl = farbeZuHsl(farbe);
    var lesehelligkeit = Math.max(hsl.l, LESBARKEITS_SCHWELLE);
    var lesefarbe = hslZuCss(hsl.h, hsl.s, lesehelligkeit);
    var spurText = hsl.l > LESBARKEITS_SCHWELLE ? "#000" : "#fff";
    stab.block.style.setProperty("--farbe", farbe);
    stab.block.style.setProperty("--lesefarbe", lesefarbe);
    stab.block.style.setProperty("--spur-text", spurText);
  }

  function farbfeldZeichnen() {
    var w = FELD_BREITE;
    var h = FELD_HOEHE;

    var hueGrad = feldCtx.createLinearGradient(0, 0, w, 0);
    var hueStufen = [0, 60, 120, 180, 240, 300, 360];
    for (var i = 0; i < hueStufen.length; i++) {
      hueGrad.addColorStop(i / (hueStufen.length - 1), "hsl(" + hueStufen[i] + ",100%,50%)");
    }
    feldCtx.fillStyle = hueGrad;
    feldCtx.fillRect(0, 0, w, h);

    var grauGrad = feldCtx.createLinearGradient(0, 0, 0, h);
    grauGrad.addColorStop(0, "rgba(128,128,128,0)");
    grauGrad.addColorStop(1, "rgba(128,128,128,1)");
    feldCtx.fillStyle = grauGrad;
    feldCtx.fillRect(0, 0, w, h);

    var x = (aktuellerHue / 360) * w;
    var y = (1 - aktuellerSat) * h;
    feldCtx.beginPath();
    feldCtx.arc(x, y, 8, 0, Math.PI * 2);
    feldCtx.strokeStyle = "#000";
    feldCtx.lineWidth = 3;
    feldCtx.stroke();
    feldCtx.beginPath();
    feldCtx.arc(x, y, 8, 0, Math.PI * 2);
    feldCtx.strokeStyle = "#fff";
    feldCtx.lineWidth = 1.5;
    feldCtx.stroke();
  }

  function helligkeitZeichnen() {
    var w = STREIFEN_BREITE;
    var h = STREIFEN_HOEHE;

    var grad = streifenCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#fff");
    grad.addColorStop(0.5, "hsl(" + aktuellerHue + "," + (aktuellerSat * 100) + "%,50%)");
    grad.addColorStop(1, "#000");
    streifenCtx.fillStyle = grad;
    streifenCtx.fillRect(0, 0, w, h);

    var y = (1 - aktuellerLight) * h;
    streifenCtx.beginPath();
    streifenCtx.moveTo(0, y - 7);
    streifenCtx.lineTo(9, y);
    streifenCtx.lineTo(0, y + 7);
    streifenCtx.closePath();
    streifenCtx.fillStyle = "#fff";
    streifenCtx.fill();
    streifenCtx.strokeStyle = "#000";
    streifenCtx.lineWidth = 1;
    streifenCtx.stroke();
  }

  function farbeAusWahlAktualisieren() {
    if (!aktiverFarbStab) {
      return;
    }
    farbeAnwenden(aktiverFarbStab, hslZuCss(aktuellerHue, aktuellerSat, aktuellerLight));
    // Die Spur bekommt die neue Farbe über einen Neuaufbau (höchstens alle 150 ms).
    farbAufbauWartet = true;
    neuZeichnen = true;
  }

  function farbwahlOeffnen(stab) {
    ziffernSchliessen(); // immer nur ein Fenster offen
    aktiverFarbStab = stab;
    farbwahlTitel.textContent = "Farbe – " + stab.titelElement.textContent;
    var hsl = farbeZuHsl(stab.farbe);
    aktuellerHue = hsl.h;
    aktuellerSat = hsl.s;
    aktuellerLight = hsl.l;
    farbfeldZeichnen();
    helligkeitZeichnen();
    farbwahlPopup.hidden = false;
  }

  function farbwahlSchliessen() {
    farbwahlPopup.hidden = true;
    aktiverFarbStab = null;
  }

  farbwahlSchliessenKnopf.addEventListener("click", farbwahlSchliessen);

  document.addEventListener("pointerdown", function (e) {
    if (farbwahlPopup.hidden) {
      return;
    }
    if (farbwahlPopup.contains(e.target)) {
      return;
    }
    if (e.target.classList && e.target.classList.contains("farb-knopf")) {
      return;
    }
    farbwahlSchliessen();
  });

  var ziehtImFeld = false;
  function feldZeigerVerarbeiten(e) {
    var rect = feldCanvas.getBoundingClientRect();
    var x = Math.max(0, Math.min(FELD_BREITE, e.clientX - rect.left));
    var y = Math.max(0, Math.min(FELD_HOEHE, e.clientY - rect.top));
    aktuellerHue = (x / FELD_BREITE) * 360;
    aktuellerSat = 1 - y / FELD_HOEHE;
    farbfeldZeichnen();
    helligkeitZeichnen();
    farbeAusWahlAktualisieren();
  }
  feldCanvas.addEventListener("pointerdown", function (e) {
    ziehtImFeld = true;
    feldCanvas.setPointerCapture(e.pointerId);
    feldZeigerVerarbeiten(e);
  });
  feldCanvas.addEventListener("pointermove", function (e) {
    if (ziehtImFeld) {
      feldZeigerVerarbeiten(e);
    }
  });
  feldCanvas.addEventListener("pointerup", function () { ziehtImFeld = false; });
  feldCanvas.addEventListener("pointercancel", function () { ziehtImFeld = false; });

  var ziehtImStreifen = false;
  function streifenZeigerVerarbeiten(e) {
    var rect = streifenCanvas.getBoundingClientRect();
    var y = Math.max(0, Math.min(STREIFEN_HOEHE, e.clientY - rect.top));
    aktuellerLight = 1 - y / STREIFEN_HOEHE;
    helligkeitZeichnen();
    farbeAusWahlAktualisieren();
  }
  streifenCanvas.addEventListener("pointerdown", function (e) {
    ziehtImStreifen = true;
    streifenCanvas.setPointerCapture(e.pointerId);
    streifenZeigerVerarbeiten(e);
  });
  streifenCanvas.addEventListener("pointermove", function (e) {
    if (ziehtImStreifen) {
      streifenZeigerVerarbeiten(e);
    }
  });
  streifenCanvas.addEventListener("pointerup", function () { ziehtImStreifen = false; });
  streifenCanvas.addEventListener("pointercancel", function () { ziehtImStreifen = false; });

  // =====================================================================
  // Ziffernfeld (eigene Zifferntasten, nie die Tastatur des Systems)
  // =====================================================================
  var ziffernPopup = document.getElementById("ziffernfeld");
  var ziffernTitel = document.getElementById("ziffernfeld-titel");
  var ziffernAnzeige = document.getElementById("ziffernfeld-anzeige");
  var ziffernTasten = document.getElementById("ziffernfeld-tasten");
  var ziffernRegler = null;   // Welcher Regler gerade eingegeben wird (oder null)
  var ziffernText = "";       // Eingetippte Ziffern
  var ziffernErste = true;    // Die nächste Ziffer ersetzt den alten Wert
  var ZIFFERN_MAX_STELLEN = 3;

  function ziffernAnwenden() {
    ziffernAnzeige.textContent = ziffernText;
    ziffernRegler.setzen(ziffernText === "" ? 0 : parseInt(ziffernText, 10));
  }

  function ziffernOeffnen(regler, titel) {
    farbwahlSchliessen(); // immer nur ein Fenster offen
    ziffernRegler = regler;
    ziffernText = String(regler.wert);
    ziffernErste = true;
    ziffernTitel.textContent = titel;
    ziffernAnzeige.textContent = ziffernText;
    ziffernPopup.hidden = false;
  }

  function ziffernSchliessen() {
    ziffernPopup.hidden = true;
    ziffernRegler = null;
  }

  function ziffernTippen(ziffer) {
    if (!ziffernRegler) {
      return;
    }
    if (ziffernErste) {
      ziffernText = ziffer;
      ziffernErste = false;
    } else if (ziffernText.length < ZIFFERN_MAX_STELLEN) {
      ziffernText += ziffer;
    }
    var zahl = parseInt(ziffernText, 10);
    if (zahl > REGLER_MAX) {
      zahl = REGLER_MAX;
    }
    ziffernText = String(zahl); // ohne führende Nullen, höchstens 100
    ziffernAnwenden();
  }

  function ziffernLoeschen() {
    if (!ziffernRegler) {
      return;
    }
    ziffernErste = false;
    ziffernText = ziffernText.slice(0, -1);
    ziffernAnwenden();
  }

  ziffernTasten.addEventListener("pointerdown", function (e) {
    var taste = e.target.closest ? e.target.closest("button") : null;
    if (!taste) {
      return;
    }
    e.preventDefault(); // kein Markieren, kein Fokus
    var art = taste.getAttribute("data-taste");
    if (art === "ok") {
      ziffernSchliessen();
    } else if (art === "weg") {
      ziffernLoeschen();
    } else {
      ziffernTippen(art);
    }
  });

  document.addEventListener("pointerdown", function (e) {
    if (ziffernPopup.hidden || ziffernPopup.contains(e.target)) {
      return;
    }
    if (e.target.classList && e.target.classList.contains("zahl-knopf")) {
      return; // der Knopf öffnet gleich das Feld für seinen Regler
    }
    ziffernSchliessen();
  });

  document.addEventListener("keydown", function (e) {
    if (ziffernPopup.hidden) {
      return;
    }
    if (e.key.length === 1 && e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      ziffernTippen(e.key);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      ziffernLoeschen();
    } else if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      ziffernSchliessen();
    }
  });

  // =====================================================================
  // Spur-Speicher (Ringpuffer)
  // =====================================================================
  // Jeder Stab hat einen festen Speicher für x/y-Paare. Ist er voll,
  // überschreibt der neue Punkt den ältesten. Punkte werden mit fortlaufenden
  // Nummern angesprochen: "geschrieben" = Nummer des nächsten Punkts,
  // "aeltester" = Nummer des ältesten noch gültigen Punkts.
  // Eine Lücke (Spur aus/an) ist ein Punkt mit dem Wert NaN.
  // Ein "Linienstück k" verbindet Punkt k-1 mit Punkt k.

  function spurSpeicherAnlegen(kapazitaet) {
    return {
      daten: new Float32Array(kapazitaet * 2),
      kap: kapazitaet,
      geschrieben: 0,
      aeltester: 0,
      letzteX: NaN,   // zuletzt gespeicherter Punkt (NaN = Lücke oder leer)
      letzteY: NaN,
      gemaltBis: 0,      // Linienstücke bis hier sind auf der Spur-Ebene
      aufbauNeuBis: 0,   // ... bis hier auf der Neuaufbau-Ebene (neue Stücke)
      aufbauAltBis: 0,   // ... alte Stücke beim Neuaufbau: nächstes Stück
      aufbauAltEnde: 0   // ... alte Stücke beim Neuaufbau: bis hier
    };
  }

  function spurSchreiben(sp, x, y) {
    var i = (sp.geschrieben % sp.kap) * 2;
    sp.daten[i] = x;
    sp.daten[i + 1] = y;
    sp.geschrieben++;
    if (sp.geschrieben - sp.aeltester > sp.kap) {
      sp.aeltester = sp.geschrieben - sp.kap;
    }
  }

  // Speichert einen Punkt, aber nur, wenn er weit genug vom letzten entfernt ist.
  function spurPunktSpeichern(sp, x, y, minAbstand2) {
    var dx = x - sp.letzteX;
    var dy = y - sp.letzteY;
    if (dx * dx + dy * dy < minAbstand2) {
      return false; // zu nah (bei NaN ist der Vergleich falsch => wird gespeichert)
    }
    spurSchreiben(sp, x, y);
    sp.letzteX = x;
    sp.letzteY = y;
    return true;
  }

  function lueckeSpeichern(sp) {
    if (sp.letzteX === sp.letzteX) { // nicht NaN: letzter Eintrag ist ein echter Punkt
      spurSchreiben(sp, NaN, NaN);
      sp.letzteX = NaN;
      sp.letzteY = NaN;
    }
  }

  function spurLeeren(sp) {
    sp.aeltester = sp.geschrieben;
    sp.letzteX = NaN;
    sp.letzteY = NaN;
    sp.gemaltBis = sp.geschrieben;
    sp.aufbauNeuBis = sp.geschrieben;
    sp.aufbauAltBis = sp.geschrieben;
    sp.aufbauAltEnde = sp.geschrieben;
  }

  // Wächter-Stufe 2: jeden zweiten Punkt weglassen und den Speicher halbieren.
  function spurenAusduennen() {
    spurKapazitaet = Math.floor(spurKapazitaet / 2);
    for (var s = 0; s < staebe.length; s++) {
      var alt = staebe[s].spur;
      var neu = spurSpeicherAnlegen(spurKapazitaet);
      var letzte = alt.geschrieben - 1;
      for (var k = alt.aeltester; k < alt.geschrieben; k++) {
        var i = (k % alt.kap) * 2;
        var x = alt.daten[i];
        // Lücken und der neueste Punkt bleiben immer erhalten.
        if (x !== x || (k - alt.aeltester) % 2 === 0 || k === letzte) {
          spurSchreiben(neu, x, alt.daten[i + 1]);
        }
      }
      neu.letzteX = alt.letzteX;
      neu.letzteY = alt.letzteY;
      neu.gemaltBis = neu.geschrieben; // die Spur-Ebene zeigt das schon
      staebe[s].spur = neu;
    }
    aufbauWunsch = true;
  }

  function punkteGesamt() {
    var summe = 0;
    for (var i = 0; i < staebe.length; i++) {
      summe += staebe[i].spur.geschrieben - staebe[i].spur.aeltester;
    }
    return summe;
  }

  // =====================================================================
  // Rechnen
  // =====================================================================
  // Gelenkpunkte der Kette (x0, y0, x1, y1, ...) in Längen-Einheiten.
  // Vorher angelegt, damit in der Schleife kein Speichermüll entsteht.
  var kette = new Float64Array((MAX_STAEBE + 1) * 2);

  function ketteBerechnen() {
    var x = 0;
    var y = 0;
    var winkelAbsolut = 0;
    kette[0] = 0;
    kette[1] = 0;
    for (var i = 0; i < staebe.length; i++) {
      var stab = staebe[i];
      winkelAbsolut += stab.winkelEigen;
      x += stab.laenge * Math.cos(winkelAbsolut);
      y += stab.laenge * Math.sin(winkelAbsolut);
      kette[i * 2 + 2] = x;
      kette[i * 2 + 3] = y;
    }
  }

  function rechenSchritt(dt, minAbstand2) {
    var i;
    for (i = 0; i < staebe.length; i++) {
      var stab = staebe[i];
      var w = stab.winkelEigen + stab.omega * dt;
      if (w > 1e6 || w < -1e6) {
        w = w % (Math.PI * 2); // große Zahlen klein halten (gleicher Winkel)
      }
      stab.winkelEigen = w;
    }
    ketteBerechnen();
    for (i = 0; i < staebe.length; i++) {
      if (staebe[i].spurAn) {
        spurPunktSpeichern(staebe[i].spur, kette[i * 2 + 2], kette[i * 2 + 3], minAbstand2);
      }
    }
  }

  // Bewegt die Kette um "bewegungsSekunden" weiter, innerhalb des Zeitbudgets.
  // Gibt die Zahl der ausgeführten Rechenschritte zurück.
  function bewegen(bewegungsSekunden, startZeit) {
    var anzahl = Math.ceil(bewegungsSekunden / MAX_ZEITSCHRITT);
    if (anzahl > MAX_SCHRITTE_PRO_BILD) {
      anzahl = MAX_SCHRITTE_PRO_BILD; // Einzelschritt wird größer
    }
    if (anzahl < 1) {
      anzahl = 1;
    }
    var teil = bewegungsSekunden / anzahl;
    var pixelProEinheit = BASIS_PIXEL_PRO_LAENGE * aktuelleSkala;
    var minAbstand = MIN_PUNKT_ABSTAND_PX / pixelProEinheit;
    var minAbstand2 = minAbstand * minAbstand;

    var s = 0;
    while (s < anzahl) {
      rechenSchritt(teil, minAbstand2);
      s++;
      if (s % PRUEFEN_ALLE_SCHRITTE === 0) {
        // Neue Stücke gleich dazumalen, dann die echte Zeit prüfen.
        neueStueckeMalen();
        if (performance.now() - startZeit > BUDGET_RECHNEN_MS ||
            linienPxImBild > BUDGET_LINIE_RECHNEN_PX) {
          break; // Rest der Bewegungszeit verwerfen, nicht aufschieben
        }
      }
    }
    return s;
  }

  // Ziel-Skala: so klein, dass die ganze Kette (mit Rand) hineinpasst. Nie über 1.
  function zielSkalaBerechnen() {
    var bezugslänge = Math.max(gesamtLaenge, MINDEST_BEZUGSLAENGE);
    var benötigterRadius = bezugslänge * BASIS_PIXEL_PRO_LAENGE * RAND_ANTEIL;
    var verfügbarerRadius = Math.min(buehneBreite, buehneHoehe) / 2;
    return Math.max(0.001, Math.min(1, verfügbarerRadius / benötigterRadius));
  }

  var skalaRuhigSeit = 0;
  var skalaBewegt = false;

  function skalaNachziehen(deltaSekunden, jetzt) {
    var ziel = zielSkalaBerechnen();
    var vorher = aktuelleSkala;
    if (deltaSekunden > 0) {
      var anteil = 1 - Math.exp(-deltaSekunden / SKALA_ZEITKONSTANTE);
      aktuelleSkala += (ziel - aktuelleSkala) * anteil;
    }
    if (Math.abs(ziel - aktuelleSkala) <= SKALA_EINRASTEN * ziel) {
      aktuelleSkala = ziel; // eingerastet: steht jetzt wirklich still
    }
    skalaBewegt = aktuelleSkala !== vorher;
    if (skalaBewegt) {
      skalaRuhigSeit = jetzt;
      neuZeichnen = true;
    }
    // Steht die Skala lange genug still, die Spur-Ebene einmal scharf neu malen.
    var zielEbene = aufbau || ebene;
    if (!skalaBewegt && jetzt - skalaRuhigSeit >= SKALA_RUHE_MS &&
        zielEbene.skala !== aktuelleSkala) {
      aufbauWunsch = true;
    }
  }

  // =====================================================================
  // Zeichnen und Spur-Ebene
  // =====================================================================
  // Die Spur-Ebene ist eine versteckte Zeichenfläche. Neue Linienstücke werden
  // nur dazugemalt. Ein Neuaufbau (z. B. nach Zoom) wird schrittweise in eine
  // zweite Ebene gemalt und dann getauscht.
  function ebeneAnlegen() {
    var c = document.createElement("canvas");
    return {
      canvas: c,
      ctx: c.getContext("2d"),
      skala: 1,
      dichte: 1,
      breite: 1,
      hoehe: 1,
      pw: 1,     // Größe in Gerätepixeln (zwischengespeichert)
      ph: 1,
      faktor: 1, // Gerätepixel pro Längen-Einheit
      mx: 0,     // Mitte in Gerätepixeln
      my: 0,
      linie: 2
    };
  }

  // Größe und Maßstab einer Ebene festlegen und sie leeren.
  function ebeneVorbereiten(e) {
    e.skala = aktuelleSkala;
    e.dichte = pixeldichte;
    e.breite = buehneBreite;
    e.hoehe = buehneHoehe;
    var w = Math.max(1, Math.floor(e.breite * e.dichte));
    var h = Math.max(1, Math.floor(e.hoehe * e.dichte));
    if (e.pw !== w || e.ph !== h || e.canvas.width !== w || e.canvas.height !== h) {
      e.canvas.width = w;   // Größe ändern leert die Fläche
      e.canvas.height = h;
    } else {
      e.ctx.setTransform(1, 0, 0, 1, 0, 0);
      e.ctx.clearRect(0, 0, w, h);
    }
    e.pw = w;
    e.ph = h;
    e.faktor = BASIS_PIXEL_PRO_LAENGE * e.skala * e.dichte;
    e.mx = e.breite * e.dichte / 2;
    e.my = e.hoehe * e.dichte / 2;
    e.linie = 2 * e.dichte;
    e.ctx.setTransform(1, 0, 0, 1, 0, 0);
    e.ctx.lineCap = "round";
    e.ctx.lineJoin = "round";
    e.ctx.lineWidth = e.linie;
  }

  function ebeneLeeren(e) {
    e.ctx.clearRect(0, 0, e.pw, e.ph);
  }

  var ebene = ebeneAnlegen();  // wird angezeigt
  var aufbau = null;           // wird gerade neu aufgebaut (oder null)
  var ersatzEbene = null;      // freie Ebene zum Wiederverwenden
  var aufbauStabNr = 0;
  var linienPxImBild = 0;  // in diesem Bild gemalte Linienlänge

  // Malt die Linienstücke a bis b-1 eines Stabs auf eine Ebene (in kurzen Pfaden).
  function streckeMalen(e, sp, farbe, a, b) {
    if (a < sp.aeltester + 1) {
      a = sp.aeltester + 1;
    }
    if (a >= b) {
      return 0;
    }
    var c = e.ctx;
    var f = e.faktor;
    var mx = e.mx;
    var my = e.my;
    var d = sp.daten;
    var ende = sp.kap * 2;
    var i = ((a - 1) % sp.kap) * 2;
    var x = d[i];
    var y = d[i + 1];
    var offen = x === x;
    c.strokeStyle = farbe;
    c.beginPath();
    if (offen) {
      c.moveTo(mx + x * f, my + y * f);
    }
    i += 2;
    if (i >= ende) {
      i = 0;
    }
    var imPfad = 0;
    var pfadLaenge = 0;
    var summe = 0;
    var px = mx + x * f;
    var py = my + y * f;
    for (var k = a; k < b; k++) {
      x = d[i];
      y = d[i + 1];
      i += 2;
      if (i >= ende) {
        i = 0;
      }
      if (x !== x) {
        offen = false; // Lücke
        continue;
      }
      var nx = mx + x * f;
      var ny = my + y * f;
      if (offen) {
        var dx = nx - px;
        var dy = ny - py;
        pfadLaenge += (dx < 0 ? -dx : dx) + (dy < 0 ? -dy : dy);
        c.lineTo(nx, ny);
        imPfad++;
        if (imPfad >= MAX_STUECKE_PRO_PFAD || pfadLaenge >= MAX_PFAD_LAENGE_PX) {
          summe += pfadLaenge;
          // Pfad abschließen und am selben Punkt einen neuen beginnen.
          c.stroke();
          c.beginPath();
          c.moveTo(nx, ny);
          imPfad = 0;
          pfadLaenge = 0;
        }
      } else {
        c.moveTo(nx, ny);
        offen = true;
      }
      px = nx;
      py = ny;
    }
    c.stroke();
    linienPxImBild += summe + pfadLaenge;
    return b - a;
  }

  // Nur die neuen Linienstücke dazumalen.
  function neueStueckeMalen() {
    var anzahl = 0;
    for (var i = 0; i < staebe.length; i++) {
      var stab = staebe[i];
      var sp = stab.spur;
      anzahl += streckeMalen(ebene, sp, stab.farbe, sp.gemaltBis, sp.geschrieben);
      sp.gemaltBis = sp.geschrieben;
      if (aufbau) {
        anzahl += streckeMalen(aufbau, sp, stab.farbe, sp.aufbauNeuBis, sp.geschrieben);
        sp.aufbauNeuBis = sp.geschrieben;
      }
    }
    if (anzahl > 0) {
      neuZeichnen = true;
    }
  }

  function aufbauStarten() {
    aufbauWunsch = false;
    if (!aufbau) {
      aufbau = ersatzEbene || ebeneAnlegen();
      ersatzEbene = null;
    }
    ebeneVorbereiten(aufbau);
    for (var i = 0; i < staebe.length; i++) {
      var sp = staebe[i].spur;
      sp.aufbauNeuBis = sp.geschrieben;     // ab jetzt kommen neue Stücke direkt dazu
      sp.aufbauAltBis = sp.aeltester + 1;   // die alten werden nach und nach gemalt
      sp.aufbauAltEnde = sp.geschrieben;
    }
    aufbauStabNr = 0;
  }

  // Ein Stück des Neuaufbaus malen, bis die Frist abläuft.
  function aufbauFortsetzen(frist) {
    if (!aufbau) {
      return;
    }
    // Mindestens ein Paket pro Bild, damit der Neuaufbau immer vorankommt.
    var aufbauLinienGrenze = linienPxImBild + BUDGET_LINIE_AUFBAU_PX;
    while (aufbauStabNr < staebe.length) {
      var stab = staebe[aufbauStabNr];
      var sp = stab.spur;
      if (sp.aufbauAltBis < sp.aeltester + 1) {
        sp.aufbauAltBis = sp.aeltester + 1; // inzwischen überschrieben
      }
      if (sp.aufbauAltBis >= sp.aufbauAltEnde) {
        aufbauStabNr++;
        continue;
      }
      if (performance.now() >= frist || linienPxImBild >= aufbauLinienGrenze) {
        return; // im nächsten Bild weiter
      }
      var bis = Math.min(sp.aufbauAltBis + AUFBAU_PAKET, sp.aufbauAltEnde);
      streckeMalen(aufbau, sp, stab.farbe, sp.aufbauAltBis, bis);
      sp.aufbauAltBis = bis;
    }
    // Fertig: neue Ebene anzeigen, alte aufheben.
    ersatzEbene = ebene;
    ebene = aufbau;
    aufbau = null;
    for (var i = 0; i < staebe.length; i++) {
      staebe[i].spur.gemaltBis = staebe[i].spur.aufbauNeuBis;
    }
    neuZeichnen = true;
  }

  // Sichtbares Bild: Hintergrund, Spur-Ebene, Stäbe und Punkte.
  function sichtbaresBildMalen() {
    var w = canvasPw;
    var h = canvasPh;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = HINTERGRUND;
    ctx.fillRect(0, 0, w, h);

    var mx = buehneBreite * pixeldichte / 2;
    var my = buehneHoehe * pixeldichte / 2;

    // Spur-Ebene passend gestreckt (um die Mitte) darüberlegen.
    var g = (aktuelleSkala * pixeldichte) / (ebene.skala * ebene.dichte);
    if (g === 1 && ebene.mx === mx && ebene.my === my) {
      ctx.drawImage(ebene.canvas, 0, 0);
    } else {
      ctx.drawImage(ebene.canvas, mx - ebene.mx * g, my - ebene.my * g,
        ebene.pw * g, ebene.ph * g);
    }

    var f = BASIS_PIXEL_PRO_LAENGE * aktuelleSkala * pixeldichte;
    ketteBerechnen();
    ctx.lineCap = "round";
    ctx.lineWidth = 8 * pixeldichte;
    var i;
    for (i = 0; i < staebe.length; i++) {
      ctx.strokeStyle = staebe[i].farbe;
      ctx.beginPath();
      ctx.moveTo(mx + kette[i * 2] * f, my + kette[i * 2 + 1] * f);
      ctx.lineTo(mx + kette[i * 2 + 2] * f, my + kette[i * 2 + 3] * f);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(mx, my, 6 * pixeldichte, 0, Math.PI * 2);
    ctx.fill();
    for (i = 0; i < staebe.length; i++) {
      ctx.fillStyle = staebe[i].farbe;
      ctx.beginPath();
      ctx.arc(mx + kette[i * 2 + 2] * f, my + kette[i * 2 + 3] * f, 7 * pixeldichte, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Zeichenfläche an Bühnengröße und Pixeldichte anpassen (nur bei Änderungen).
  function passeAn() {
    buehneBreite = Math.max(1, buehne.clientWidth);
    buehneHoehe = Math.max(1, buehne.clientHeight);
    var geraet = window.devicePixelRatio || 1;
    pixeldichte = Math.min(geraet, MAX_PIXELDICHTE, WAECHTER_DICHTEN[waechterStufe]);
    canvasPw = Math.max(1, Math.floor(buehneBreite * pixeldichte));
    canvasPh = Math.max(1, Math.floor(buehneHoehe * pixeldichte));
    canvas.width = canvasPw;
    canvas.height = canvasPh;
    canvas.style.width = buehneBreite + "px";
    canvas.style.height = buehneHoehe + "px";
    aufbauWunsch = true;
    neuZeichnen = true;
  }

  window.addEventListener("resize", passeAn);
  window.addEventListener("orientationchange", passeAn);

  // =====================================================================
  // Wächter und Notbremse
  // =====================================================================
  var notbremseFenster = document.getElementById("notbremse");
  var knopfNotWeiter = document.getElementById("notbremse-weiter");
  var knopfNotLoeschen = document.getElementById("notbremse-loeschen");

  var notbremseAktiv = false;
  var seiteSichtbar = !document.hidden;
  var messenAb = 0;           // vorher wird nicht gemessen
  var ruheBis = 0;            // Ruhezeit nach einem Wechsel
  var messungZuruecksetzen = false;
  var langsamSeit = -1;
  var schnellSeit = -1;
  var sehrLangsamSeit = -1;
  var ausgeduennt = false;

  // Zeitpunkte der letzten Bilder (Ringspeicher) für die Bildrate.
  var BILD_ZEITEN_ANZAHL = 1024;
  var bildZeiten = new Float64Array(BILD_ZEITEN_ANZAHL);
  var bildZeitenKopf = 0;
  var bildZeitenVoll = 0;
  var haengerZeiten = new Float64Array(HAENGER_ANZAHL);
  var haengerAnzahl = 0;

  function bildZeitMerken(jetzt) {
    bildZeiten[bildZeitenKopf] = jetzt;
    bildZeitenKopf = (bildZeitenKopf + 1) % BILD_ZEITEN_ANZAHL;
    if (bildZeitenVoll < BILD_ZEITEN_ANZAHL) {
      bildZeitenVoll++;
    }
  }

  // Bildrate über die letzten ca. 2 Sekunden (-1 = noch zu wenig Werte).
  function bildrate(jetzt) {
    var anzahl = 0;
    var aeltesteZeit = jetzt;
    var i = bildZeitenKopf;
    for (var n = 0; n < bildZeitenVoll; n++) {
      i = (i - 1 + BILD_ZEITEN_ANZAHL) % BILD_ZEITEN_ANZAHL;
      var t = bildZeiten[i];
      if (jetzt - t > MESS_FENSTER_MS) {
        break;
      }
      aeltesteZeit = t;
      anzahl++;
    }
    var spanne = jetzt - aeltesteZeit;
    if (anzahl < 2 || spanne < 500) {
      return -1;
    }
    return (anzahl - 1) * 1000 / spanne;
  }

  function messwerteZuruecksetzen() {
    bildZeitenVoll = 0;
    haengerAnzahl = 0;
    langsamSeit = -1;
    schnellSeit = -1;
    sehrLangsamSeit = -1;
  }

  function stufeWechseln(neueStufe, jetzt) {
    waechterStufe = neueStufe;
    if (waechterStufe >= 2 && !ausgeduennt) {
      ausgeduennt = true;
      spurenAusduennen();
    }
    passeAn(); // neue Pixeldichte, Spur-Ebene wird neu aufgebaut
    ruheBis = jetzt + WECHSEL_RUHE_MS;
    messwerteZuruecksetzen();
  }

  function notbremseZiehen() {
    notbremseAktiv = true;
    notbremseFenster.hidden = false;
  }

  function notbremseLoesen() {
    notbremseAktiv = false;
    notbremseFenster.hidden = true;
    messwerteZuruecksetzen();
    ruheBis = performance.now() + WEITER_RUHE_MS;
    neuZeichnen = true;
  }

  knopfNotWeiter.addEventListener("click", notbremseLoesen);
  knopfNotLoeschen.addEventListener("click", function () {
    spurenLoeschen();
    notbremseLoesen();
  });

  document.addEventListener("visibilitychange", function () {
    seiteSichtbar = !document.hidden;
    if (seiteSichtbar) {
      messungZuruecksetzen = true;
    }
  });

  // Wird in jedem Bild aufgerufen. Für das Kind unsichtbar.
  function waechterMessen(jetzt, abstandMs) {
    if (messungZuruecksetzen) {
      messungZuruecksetzen = false;
      messwerteZuruecksetzen();
      bildZeitMerken(jetzt);
      return; // der lange Abstand nach dem Zurückkommen zählt nicht
    }
    bildZeitMerken(jetzt);

    if (!seiteSichtbar || !läuft || notbremseAktiv || jetzt < messenAb) {
      langsamSeit = -1;
      schnellSeit = -1;
      sehrLangsamSeit = -1;
      return;
    }

    // Hänger: drei Bilder mit über 500 ms Abstand innerhalb von 10 Sekunden.
    if (abstandMs > HAENGER_MS) {
      haengerZeiten[haengerAnzahl % HAENGER_ANZAHL] = jetzt;
      haengerAnzahl++;
      if (haengerAnzahl >= HAENGER_ANZAHL) {
        var aeltester = haengerZeiten[haengerAnzahl % HAENGER_ANZAHL];
        if (jetzt - aeltester <= HAENGER_FENSTER_MS) {
          notbremseZiehen();
          return;
        }
      }
    }

    if (jetzt < ruheBis) {
      return;
    }
    var fps = bildrate(jetzt);
    if (fps < 0) {
      return;
    }

    if (fps < LANGSAM_FPS) {
      if (langsamSeit < 0) {
        langsamSeit = jetzt;
      } else if (jetzt - langsamSeit >= LANGSAM_DAUER_MS && waechterStufe < 3) {
        stufeWechseln(waechterStufe + 1, jetzt);
        return;
      }
    } else {
      langsamSeit = -1;
    }

    if (fps > SCHNELL_FPS && waechterStufe > 0) {
      if (schnellSeit < 0) {
        schnellSeit = jetzt;
      } else if (jetzt - schnellSeit >= SCHNELL_DAUER_MS) {
        // Pixeldichte eine Stufe anheben (das Ausdünnen bleibt).
        stufeWechseln(waechterStufe === 3 ? 2 : 0, jetzt);
        return;
      }
    } else {
      schnellSeit = -1;
    }

    if (waechterStufe === 3 && fps < NOT_FPS) {
      if (sehrLangsamSeit < 0) {
        sehrLangsamSeit = jetzt;
      } else if (jetzt - sehrLangsamSeit >= NOT_DAUER_MS) {
        notbremseZiehen();
      }
    } else {
      sehrLangsamSeit = -1;
    }
  }

  // =====================================================================
  // Messanzeige (nur mit ?fps in der Adresse)
  // =====================================================================
  var messAnzeige = null;
  var anzeigeZuletzt = 0;
  var anzeigeBilder = 0;
  var anzeigeSchritte = 0;
  var anzeigeGroessterAbstand = 0;
  var anzeigeGroessteArbeit = 0;
  var anzeigeGroessteLinie = 0;
  var teilZeiten = new Float64Array(4); // Rechnen+Malen, Rest-Malen, Neuaufbau, Bild (je größter Wert)

  function teilZeitMerken(nr, ms) {
    if (ms > teilZeiten[nr]) {
      teilZeiten[nr] = ms;
    }
  }

  if (MESSANZEIGE_AN) {
    messAnzeige = document.createElement("div");
    messAnzeige.id = "messanzeige";
    buehne.appendChild(messAnzeige);
  }

  function messAnzeigeAktualisieren(jetzt, abstandMs, schritte, arbeitMs) {
    if (!messAnzeige) {
      return;
    }
    anzeigeBilder++;
    anzeigeSchritte += schritte;
    if (abstandMs > anzeigeGroessterAbstand) {
      anzeigeGroessterAbstand = abstandMs;
    }
    if (arbeitMs > anzeigeGroessteArbeit) {
      anzeigeGroessteArbeit = arbeitMs;
    }
    if (jetzt - anzeigeZuletzt < ANZEIGE_ABSTAND_MS) {
      return;
    }
    var fps = bildrate(jetzt);
    messAnzeige.textContent =
      "FPS " + (fps < 0 ? "-" : fps.toFixed(1)) +
      " | Schritte/Bild " + Math.round(anzeigeSchritte / anzeigeBilder) +
      " | Punkte " + punkteGesamt() +
      " | Stufe " + waechterStufe +
      " | Dichte " + pixeldichte +
      " | max Abstand " + Math.round(anzeigeGroessterAbstand) + " ms" +
      " | max Arbeit " + anzeigeGroessteArbeit.toFixed(1) + " ms" +
      " (R " + teilZeiten[0].toFixed(1) + " M " + teilZeiten[1].toFixed(1) +
      " A " + teilZeiten[2].toFixed(1) + " B " + teilZeiten[3].toFixed(1) + ")" +
      " | Linie " + Math.round(anzeigeGroessteLinie / 1000) + "k px" +
      (aufbau ? " | Neuaufbau" : "") +
      (notbremseAktiv ? " | NOTBREMSE" : "");
    anzeigeZuletzt = jetzt;
    anzeigeBilder = 0;
    anzeigeSchritte = 0;
    anzeigeGroessterAbstand = 0;
    anzeigeGroessteArbeit = 0;
    teilZeiten.fill(0);
    anzeigeGroessteLinie = 0;
  }

  // =====================================================================
  // Hauptschleife
  // =====================================================================
  var letzterZeitpunkt = -1;

  function bild(zeitpunkt) {
    requestAnimationFrame(bild);

    var abstandMs = letzterZeitpunkt < 0 ? 0 : zeitpunkt - letzterZeitpunkt;
    letzterZeitpunkt = zeitpunkt;
    waechterMessen(zeitpunkt, abstandMs);

    if (notbremseAktiv) {
      // Nichts rechnen, nichts neu aufbauen: das Bild bleibt stehen.
      messAnzeigeAktualisieren(zeitpunkt, abstandMs, 0, 0);
      return;
    }

    var start = performance.now();
    var deltaSekunden = Math.min(abstandMs / 1000, MAX_ZEITSPRUNG);
    skalaNachziehen(deltaSekunden, zeitpunkt);

    if (farbAufbauWartet && zeitpunkt - letzterFarbAufbau >= FARB_AUFBAU_ABSTAND_MS) {
      farbAufbauWartet = false;
      letzterFarbAufbau = zeitpunkt;
      aufbauWunsch = true;
    }
    var aufbauGestartet = false;
    if (aufbauWunsch) {
      aufbauStarten(); // ein laufender Neuaufbau beginnt von vorn
      aufbauGestartet = true;
    }

    // Rechnen und Dazumalen (zusammen höchstens BUDGET_RECHNEN_MS)
    var schritte = 0;
    linienPxImBild = 0;
    var bewegungsSekunden = läuft ? deltaSekunden * gesamtTempo : 0;
    if (bewegungsSekunden > 0) {
      schritte = bewegen(bewegungsSekunden, start);
      neuZeichnen = true;
    }
    var t1 = performance.now();
    neueStueckeMalen();
    var t2 = performance.now();

    // Schrittweiser Neuaufbau (zusätzlich höchstens BUDGET_AUFBAU_MS)
    // (Nicht im selben Bild wie der Start: das Vorbereiten der Ebene kostet schon Zeit.)
    if (aufbau && !aufbauGestartet) {
      aufbauFortsetzen(performance.now() + BUDGET_AUFBAU_MS);
      neuZeichnen = true;
    }
    var t3 = performance.now();

    // In der Pause ohne Änderung muss das Bild nicht neu gemalt werden.
    if (neuZeichnen) {
      sichtbaresBildMalen();
      neuZeichnen = false;
    }

    var t4 = performance.now();
    var arbeitMs = t4 - start;
    if (messAnzeige) {
      teilZeitMerken(0, t1 - start);
      teilZeitMerken(1, t2 - t1);
      teilZeitMerken(2, t3 - t2);
      teilZeitMerken(3, t4 - t3);
      if (linienPxImBild > anzeigeGroessteLinie) {
        anzeigeGroessteLinie = linienPxImBild;
      }
    }

    if (STRESS_AN) {
      // Nur zum Testen: künstlich Rechenzeit verbrauchen.
      var bis = performance.now() + STRESS_MS;
      while (performance.now() < bis) { /* warten */ }
    }

    messAnzeigeAktualisieren(zeitpunkt, abstandMs, schritte, arbeitMs);
  }

  // ---- Start ----
  ANFANGS_WERTE.forEach(function (werte, index) {
    staebe.push(stabErzeugen(index, werte.laenge, werte.tempo, werte.spur));
  });
  gesamtLaengeBerechnen();
  stabKnoepfeAktualisieren();
  passeAn();
  aktuelleSkala = zielSkalaBerechnen();
  ebeneVorbereiten(ebene);
  aufbauWunsch = false;
  messenAb = performance.now() + START_RUHE_MS;
  requestAnimationFrame(bild);
})();
