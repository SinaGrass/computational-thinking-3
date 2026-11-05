## T3

1. Welche Verbesserung habt ihr gewählt, und warum diese?

Ich habe die überlappenden Ortsnamen auf der Karte verbessert. Bei Berlin, Schwäbisch Gmünd und Stuttgart, bei Nullinsel und Prüfpunkt Ost und bei Spitzbergen und Prüfpunkt Nord lagen Namen übereinander oder auf Kreisen. Man konnte sie nicht lesen und nicht sicher einem Ort zuordnen. Das hat mich beim Ansehen der Karte am meisten gestört. Eine Legende für Farbe und Größe der Kreise hätte ich ebenfalls sinnvoll gefunden, aber ohne lesbare Namen war die Karte nicht brauchbar, deshalb kam das zuerst.

2. Woran habt ihr geprüft, ob sie stimmt? Hat es gestimmt?

Vor dem Prompt habe ich eine Spezifikation geschrieben: Kein Name darf auf einem Kreis liegen (auch nicht auf dem eigenen) oder auf einem anderen Namen, nichts darf aus dem Bild laufen, und jeder Name muss seinem Ort zuzuordnen sein, bei den sieben engen Orten durch eine Linie. Daraus habe ich acht Ja/Nein-Prüfkriterien gemacht, zum Beispiel "Liegt bei keinem der 12 Orte ein Name auf einem Kreis?" oder "Läuft node projektion.js ohne Fehlermeldung?". Danach habe ich die neue karte.svg Punkt für Punkt durchgegangen und mit meiner alten Karte karte-vorher.svg und der orte.json aus T2 verglichen, um zu sehen, dass sich Kreise und Daten nicht verändert haben. Alle acht Kriterien waren mit Ja zu beantworten, es hat also gestimmt.