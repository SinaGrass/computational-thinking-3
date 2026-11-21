# PROMPT.md – T5

## Aufgabe 1: Orte im Umkreis

**Prompt:**
Aufgabe 1 – Orte im Umkreis. Die Karte zeigt nur die Orte im Umkreis um den Zoompunkt.
Den Radius stellt man mit einem Slider ein.
`export function orteImUmkreis(orte, zentrum, radiusKm) { … }` in `entfernung.js`.
Die Orte bewegen sich beim Slider nicht, sondern verschwinden nach und nach.

Mitgegeben: `projektion.js`, `orte.json`, `karte.js`, `entfernung.js`.

**Ergebnis:**
- `entfernung.js`: `orteImUmkreis` mit `filter` und `entfernung`. Das Original-Array bleibt unverändert.
-  Es werden nur die Orte im Umkreis gezeichnet.

**Geprüft / angepasst:**
- Zuerst war die Karte leer. Die Konsole meldete, dass `entfernung.js` keinen Export `orteImUmkreis` hat. Ich habe die Funktion ergänzt.
- Dann fehlte der Slider in der `index.html` (`null` bei `addEventListener`). Nach dem Einfügen lief es.
- Die Orte verschwinden nach und nach, ohne sich zu verschieben.

## Aufgabe 2: Orte nach Entfernung auflisten

**Prompt:**
Aufgabe 2 – Orte nach Entfernung auflisten
Beschreibung: Unter der Karte steht eine Liste der Orte im Umkreis. Der
nächste Ort steht oben, mit Entfernung in km.
// entfernung.js
export function nachEntfernung(orte, zentrum) { … }
<ol id=“liste"></ol>
- Nur nachEntfernung kommt in entfernung.js dazu


Diese Aufgaben habe ich in der Werkstatt im Unterricht gemacht.

## T4-Erweiterungen nach T5 holen

**Prompt:**
Teile meinen T4-Code in Module auf. Funktionen, die nur rechnen, kommen in ein Modul mit
`export`. Funktionen, die Slider lesen oder ins DOM schreiben, bleiben in `karte.js`.
Die Karte soll aussehen wie in T4, dazu kommen Umkreis und Liste.

**Ergebnis:**
- `kreis.js`: `kreisRadius`, `kreisFarbe`
- `geometrie.js`: Geometrie-Helfer
- `beschriftung.js`: `platziereNamen`, jetzt mit `orte` als Parameter
- `berechneAusschnitt` entfällt, weil `zoomeAusschnitt` aus `projektion.js` dasselbe macht
- `karte.js` bleibt für Slider, SVG und Liste

**Geprüft / angepasst:**
- Ich hab im Browser getestet: Kreise, Namen, Zoom, Umkreis und Liste funktionieren.
- Und Diff gelesen und committet.

## Liste nach Zoom-Ausschnitt filtern

**Prompt:**
Die Liste soll nur Orte zeigen, die im aktuellen Zoom-Ausschnitt liegen.

**Ergebnis:**
Neue Funktion `orteImAusschnitt(orte, ausschnitt)` in `projektion.js`. In `karte.js` läuft
die Reihenfolge Umkreis, dann Ausschnitt, dann Sortierung nach Entfernung.

**Geprüft / angepasst:**
- Fehler "does not provide an export named 'orteImAusschnitt'", weil die Funktion in
  `projektion.js` noch fehlte. Nach dem Ergänzen lief es.