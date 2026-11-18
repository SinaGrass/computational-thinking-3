## T4

### 1. Wie funktionieren Ausschnitt und Zoom?

Ein Ausschnitt ist ein Objekt mit vier Grenzen in Grad: `{ west, ost, nord, sued }`.
`lonZuX` und `latZuY` rechnen einen Ort relativ zu diesem Ausschnitt in Pixel um.
West liegt bei x = 0, Ost bei x = breite, Nord bei y = 0 und Süd bei y = hoehe.
Ohne dritten Parameter gilt die Konstante `AUSSCHNITT`.

Der Zoom-Slider (1 bis 9) gibt einen Zoomfaktor. `berechneAusschnitt(zoom)` teilt
die Weltgröße (360° × 180°) durch den Zoomfaktor. Der Ausschnitt wird so um den
`ZOOMPUNKT` (Schwäbisch Gmünd) gelegt, dass der Zoompunkt im Ausschnitt denselben
relativen Anteil behält wie auf der ganzen Welt. Deshalb bleibt er auf der Karte
am selben Pixel. Breite und Höhe werden durch denselben Faktor geteilt, weswegen dann
das 2:1-Format erhalten bleibt.
`zeichnen()` berechnet bei jeder Slider-Bewegung den Ausschnitt neu und gibt ihn an
`platziereNamen`, `lonZuX` und `latZuY` weiter.

### 2. Welche Stolpersteine gab es bei der Umsetzung?

- Nach Aufgabe 1 war nur noch ein Teil der Karte zu sehen (Gmünd, Stuttgart, Berlin).
  Ich konnte nicht mehr zu der ganzen Karte wechseln. in Aufgabe 2 mit dem Zoom Slider hat sich dann alles
  sinnvoll ergeben, da ich dann wieder die ganze Karte hatte.
- Die Konsole zeigt viele Meldungen "Kein freier Platz für den Namen gefunden".
  Orte außerhalb des Ausschnitts haben Koordinaten außerhalb der Zeichenfläche,
  und für sie findet die Namensplatzierung keinen Platz.
- `platziereNamen` und `zeichnen` riefen `lonZuX` und `latZuY` ohne Ausschnitt auf.
  Dann hätte der Slider nichts bewirkt. Der Ausschnitt muss an beiden Stellen
  durchgereicht werden.

### 3. Was ist mir unklar geblieben?

- Warum liegt der Ausschnitt bei Zoom 9 etwas anders als mein fester `AUSSCHNITT`
  aus Aufgabe 1? (Weil der Zoompunkt seinen Anteil behält und nicht in der Mitte liegt.)
- Soll man die Orte außerhalb des Ausschnitts gar nicht zeichnen und nicht platzieren?
- Wird die Konstante `AUSSCHNITT` jetzt noch gebraucht, oder nur noch als Standardwert?
