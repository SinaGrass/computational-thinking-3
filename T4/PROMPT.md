### AUFGABE 1
Ich arbeite an einem Kartenwerkzeug in JavaScript (läuft im Browser). Die Karte ist ein SVG. Zwei Funktionen rechnen Koordinaten in Pixel um: lonZuX (Längengrad → x) und latZuY (Breitengrad → y). Bisher zeigt die Karte immer die ganze Welt.

## Aufgabe
Beide Funktionen sollen einen dritten Parameter `ausschnitt` bekommen. Ein Ausschnitt ist ein Objekt mit vier Grenzen in Grad: { west, ost, nord, sued }.
- lonZuX: west liegt bei x = 0, ost liegt bei x = breite.
- latZuY: nord liegt bei y = 0, sued liegt bei y = hoehe.
- Wird kein Ausschnitt übergeben, soll die Konstante AUSSCHNITT benutzt werden.
- Der Ausschnitt ist 40 Grad breit und 20 Grad hoch, passt also zum 2:1-Format der Karte.

## Prüfwerte
Mit AUSSCHNITT = { west: -10, ost: 30, nord: 65, sued: 45 }:
- lonZuX(-10, 720) → 0 und lonZuX(30, 720) → 720
- latZuY(65, 360) → 0 und latZuY(45, 360) → 360
- Schwäbisch Gmünd (lat 48.8, lon 9.79): x ≈ 356.22 und y ≈ 291.6 (bei 720 × 360)
Mit der ganzen Welt { west: -180, ost: 180, nord: 90, sued: -90 } als Ausschnitt:
- Nullinsel (lat 0, lon 0) → x = 360, y = 180

## Ausgabe
- Nur die zwei geänderten Funktionen und die Zeile AUSSCHNITT, kein anderer Code.
- Ein bis zwei Sätze, was du geändert hast.
- Ein Satz dazu, was mit Orten passiert, die außerhalb des Ausschnitts liegen.

## Mein aktueller Code
```js
const AUSSCHNITT = { west: -10, ost: 30, nord: 65, sued: 45 };

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}
```
Hinweis: Im Abschnitt „Mein aktueller Code“ steht die Zeile `const AUSSCHNITT = ...`. 
Die gab es in meinem Code vorher noch nicht. 
Sie war als Vorgabe gedacht, welchen Ausschnitt ich haben will.