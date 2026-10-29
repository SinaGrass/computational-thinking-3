# Termin 1

```markdown

1. Was tut dein Skript?
Mein Skript rechnet Grad in Pixel um.
Dafür gibt es die Funktion lonToX, die Längengrade bekommt und Pixel zurückgibt,
und die Funktion latToY, die Breitengrade bekommt und Pixel zurückgibt.
Außerdem gibt es ein Array mit 5 verschiedenen Orten.
Die Funktion noerdlichsterOrt geht die Breitengrade durch und gibt den nördlichsten Ort zurück.
Beim Test kam Berlin raus, das stimmte mit meiner Lösung von Hand überein, die ich davor aufgeschrieben hatte. Ich habe die fünf Breitengrade verglichen, Berlin hat den größten.
2. Welche Stelle hättest du auch anders lösen können? Wie?
Bei latToY habe ich (90 - lat) geschrieben. Man hätte auch (-lat + 90) schreiben können. Das Ergebnis ist das gleiche, nur kürzer geschrieben.
Die Orte hätte ich auch als einfache Listen (["Berlin", 52.52, 13.40]) statt als Objekte ({ name: ..., lat: ..., lon: ... }) anlegen können.
3. Warum hast du es so gelöst?
Bei latToY habe ich (90 - lat) genommen, weil das Ergebnis dann kürzer geschrieben ist. Und ich hab mir ausgesucht was ich lebsbarer finde. 
Bei den Orten fand ich es so einfach übersichtlicher, um auf einem Blick zu sehen welcher Wert zu was gehört.
4. Was fiel dir schwer bei der Aufgabe?
Ich hatte erst die umgedrehte Richtung bei latToY (oben ist +90) nicht auf dem Schirm und das man das dann bei der Berechnung beachten muss durch das minus.
Und bei der if Bedingung das richtige Muster zu finden und die Bausteine richtig anzuordnen. Habe es dann mit einem Sprung verglichen, und konnte es mir so ganz gut herleiten und übertragen.
if (Sprung> besterSprung) {
  besterSprung = sprung;
}
5. Was ist dir unklar geblieben?
```

Frage 2 und 3 sind die wichtigen. Fast alles, was ihr baut, hätte auch anders
umgesetzt werden können — Bildgröße fest oder übergeben, Rückgabe als Objekt, Array oder
als zwei Zahlen, Reihenfolge `lat, lon` oder `lon, lat`. 
**Es geht darum eine Entscheidung bewusst zu treffen.**

Frage 5 bewertet euch nicht schlechter. Es kann vorkommen, dass in gemeinsamer Arbeit Dinge unklar sind. Funktionen, Logik, etc. Dies sollt ihr hier benennen, falls ihr was nicht verstanden habt.