## T5

### 1. Wohin hast du deine Erweiterungen aus T4 gelegt, in ein Modul oder in `karte.js`, und warum?

Ich habe mich an die Regel aus dem Wochenauftrag gehalten: Was nur rechnet, kommt in ein
Modul. Was einen Slider liest oder ins DOM schreibt, bleibt in `karte.js`.

- Die Kreisgröße und die Farbe nach Temperatur sind jetzt in `kreis.js`. Die Funktionen
  bekommen einen Ort und geben nur einen Wert zurück, deshalb gehören sie in ein Modul.
- Die Geometrie-Helfer für die Namen (Abstände, Überlappungen, Strecken) liegen in
  `geometrie.js`. Nur `kreuzprodukt` hat kein `export`, weil es nur dort gebraucht wird.
- `platziereNamen` liegt in `beschriftung.js`. In T4 hat die Funktion einfach die globale
  Liste `orte` benutzt. Das ging nicht mehr, weil ein Modul nur mit seinen Parametern
  rechnen soll. Deshalb bekommt sie jetzt `orte`, die Größe und den Ausschnitt übergeben.
  Dadurch kann ich ihr auch nur die Orte im Umkreis geben.
- `berechneAusschnitt` habe ich nicht mehr übernommen, weil `zoomeAusschnitt` in
  `projektion.js` schon dasselbe macht. Der Zoompunkt bleibt dort auch an seiner Stelle.
- `orteImAusschnitt` für den Filter der Liste habe ich in `projektion.js` gelegt. Die Funktion
  rechnet nur mit dem Ausschnitt und fasst nichts im DOM an.
- In `karte.js` ist alles geblieben, was die Slider liest oder etwas anzeigt: die Slider,
  das SVG und die Liste.

### 2. Warum stehen `lonZuX` und `latZuY` nicht mehr in `karte.js`?

Die beiden Funktionen rechnen nur mit dem, was man ihnen übergibt, und haben mit dem DOM
nichts zu tun. Außerdem brauche ich sie jetzt an zwei Stellen: in `karte.js` zum Zeichnen
und in `beschriftung.js` für die Position der Kreise. `karte.js` startet beim Laden direkt
(`fetch`, `querySelector`, `zeichnen()`). Wenn `beschriftung.js` etwas aus `karte.js`
importieren würde, bräuchten sich beide Dateien gegenseitig. 

### 3. Was ist dir unklar geblieben?

- Die Karte zeichnet weiter auch Orte außerhalb des Zoom-Ausschnitts. Sie liegen außerhalb
  der Zeichenfläche und sind nicht sichtbar. Die Konsole zeigt dafür "Kein freier Platz für
  den Namen gefunden". Ich weiß nicht, ob ich diese Orte besser ganz herausfiltern sollte.
