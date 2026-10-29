# Termin 2

```markdown

1. Was tut dein Skript?
Das Skript liest 12 Orte mit Namen, Breitengrad und Längengrad aus der Datei `orte.json` ein. 
Für jeden Ort rechnet es aus den Koordinaten eine x- und eine y-Position auf einer 720×360 großen Fläche aus (Längengrad → x, Breitengrad → y). 
Am Ende schreibt es eine Karte als `karte.svg`: ein heller Hintergrund mit einem Kreis und dem Namen für jeden Ort.
Dann sieht man die Jahresdurchschnittstemperatur an Größe und Farbe des Kreises. Je weiter sie von 0 °C entfernt ist, desto größer ist der Kreis (Radius = Betrag der Temperatur). 
Orte über 0 Grad sind rot, Orte unter 0 Grad blau.
Orte ohne Temperatur (Nullinsel, Prüfpunkt Ost, Prüfpunkt Nord) werden nicht weggelassen, sondern als kleiner grauer Punkt mit festem Radius 4 gezeichnet. So bleiben sie sichtbar, aber man erkennt sofort, dass für sie keine Temperatur vorliegt.

2. Welche Stelle hättest du auch anders lösen können? Wie?
Radius: Ich habe den Betrag der Temperatur direkt als Radius in Pixeln benutzt (`Math.abs(ort.temperatur)`), zum Beispiel -7.5 → 7.5 px. Das ist einfach, hat aber einen Nachteil: Orte nahe 0 °C bekommen einen winzigen Kreis, und bei genau 0 °C wäre er unsichtbar. Man hätte einen Mindestradius setzen können, zum Beispiel mit `Math.max(Math.abs(ort.temperatur), 2)`. Oder man hätte den Wert skalieren können, zum Beispiel mal 1.5, damit die Unterschiede besser sichtbar sind.
Farbe: Ich hätte dem rot und blau noch Abstufungen von hell bis dunkel geben können, um zusätzlich zur Größe die Intensität der Kälte bzw. Hitze darzustellen. Ein dunkles Rot wäre zum Beispiel sehr heiß gewesen und helles Rot etwas über 0 Grad. 
Orte ohne Temperatur: Ich habe sie als kleinen grauen Punkt mit Radius 4 gezeichnet, damit sie sichtbar bleiben und man sieht, dass kein Wert vorliegt. Man hätte sie auch gar nicht zeichnen können. Oder man hätte in `orte.json` den Wert 0 eintragen können, dann wären sie aber wie echte Orte mit 0 °C erschienen, und das wäre falsch gewesen. Deshalb habe ich mich für den grauen Punkt entschieden.

3. Warum hast du es so gelöst?
Feld: Ich habe die Temperatur genommen, weil sie sich bei meinen Orten stark unterscheidet (zum Beispiel Spitzbergen und Rio de Janeiro) und es positive und negative Werte gibt. Dazu passt die Farbe mit zwei Richtungen: warm ist rot, kalt ist blau. Die Größe zeigt, wie extrem der Wert ist. Bei zum Beispiel Einwohnerzahl oder Entfernung gibt es keine Richtung, da wäre die Farbe nur Dekoration gewesen.
Radius: Mit `Math.abs` war es eine einzige Zeile. Das Vorzeichen steckt schon in der Farbe, also muss der Radius nur die Stärke zeigen.
Farbe: Ich habe nur zwei Farben benutzt, weil die Größe schon zeigt, wie extrem die Temperatur ist. Abstufungen von hell bis dunkel hätten dasselbe noch einmal gezeigt. Die Farbe muss deshalb nur sagen, ob es warm oder kalt ist, und dafür reichen Rot und Blau. Außerdem war es mit einer einzigen `if`-Prüfung im Code einfach umzusetzen.
Orte ohne Temperatur: Nullinsel, Prüfpunkt Ost und Prüfpunkt Nord sind keine echten Städte und haben keine Temperatur. Ohne Kreis wären sie von der Karte verschwunden. Mit dem Wert 0 hätten sie wie echte Orte mit 0 °C ausgesehen, und das wäre falsch gewesen. Mit dem Grau sieht man sie nun zwar, aber sie zeigen logischerweise keinen Wert.

4. Was fiel dir schwer bei der Aufgabe?
`orte.json` einlesen: Mir war nicht klar, wie `readFileSync` und `JSON.parse` zusammenhängen und wo das Ergebnis gespeichert wird. Erst als ich verstanden habe, dass `readFileSync` nur den Text liest und `JSON.parse` daraus Daten macht, die in `orte` landen, hat es für mich Sinn ergeben.
Überblick behalten: Bei den vielen kleinen Schritten, die ich machen wollte (Daten, Einlesen, Radius, Farbe, graue Punkte) habe ich den Überblick verloren, was schon fertig ist, was noch fehlt und in welcher Reihenfolge es am meisten Sinn macht es einzubauen. Geholfen hat mir, in kleinen Schritten zu arbeiten und nach jedem Schritt `karte.svg` neu zu laden, um zu sehen, ob es klappt.
Graue Punkte: Die grauen Punkte waren zuerst nicht auf der Karte zu sehen, und ich wusste lange nicht, warum. Schließlich habe ich entdeckt, dass in `orte.json` `null` stand, mein Code aber mit `=== undefined` geprüft hat. Ich war mir eigentlich sicher, in `orte.json` `undefined` verwendet zu haben, deshalb hat es eine Weile gedauert, bis ich den Unterschied zwischen beiden Werten gefunden hatte. Inzwischen weiß ich, dass JSON kein `undefined` kennt: Dort kann nur `null` stehen oder das Feld fehlt komplett.

5. Was ist dir unklar geblieben?
`require("fs")`: Unklar geblieben ist mir, was `fs` genau ist und warum man es ganz oben einbinden muss. Ich weiß, dass ich damit Dateien lesen und schreiben kann, aber nicht, was im Hintergrund passiert.
Einsetzen mit `${...}`: Unklar geblieben ist mir, wie die Variablen in den SVG-Text kommen. Ich habe es benutzt und es funktioniert, aber ich kann nicht sicher sagen, was die Backticks dabei anders machen als normale Anführungszeichen.
Die langen Zahlen: Warum erscheinen beim Ausgeben Zahlen wie `378.36580000000004`, obwohl ich nichts so Langes gerechnet habe. 
Ok, nach einer kleinen Recherche weiß ich jetzt, dass Computer Zahlen binär speichern und manche Dezimalzahlen dabei nicht exakt darstellen können. Deshalb entsteht bei `lonZuX` für Stuttgart `378.36580000000004` statt `378.3658`. Unklar ist mir noch, warum genau bestimmte Zahlen ungenau werden und andere nicht.
```