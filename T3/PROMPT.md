(Tool: Claude, neuer Chat)

## Prompt
Du hilfst mir bei einer kleinen Verbesserung an einem JavaScript-Skript (läuft mit Node.js).

## Kontext
Das Skript `projektion.js` liest 12 Orte aus `orte.json` (je `id`, `name`, `lat`, `lon`, bei 9 Orten zusätzlich `temperatur`) und schreibt daraus eine Karte `karte.svg` (720 × 360 px). Jeder Ort ist ein Kreis: Die Größe zeigt den Betrag der Jahresdurchschnittstemperatur, Rot bedeutet über 0 °C, Blau unter 0 °C. Drei Orte (Nullinsel, Prüfpunkt Ost, Prüfpunkt Nord) haben keine Temperatur und sind kleine graue Punkte. Neben jedem Kreis steht der Ortsname als Text.

Problem: Einige Namen überlappen sich oder liegen auf Kreisen, sodass man sie nicht lesen oder keinem Ort zuordnen kann. Besonders betroffen sind Berlin, Schwäbisch Gmünd und Stuttgart sowie Nullinsel und Prüfpunkt Ost sowie Spitzbergen und Prüfpunkt Nord.

## Aufgabe
Ändere nur die Platzierung der Ortsnamen:
- Kein Ortsname darf auf einem Kreis liegen (auch nicht auf dem eigenen) und kein Ortsname auf einem anderen Namen. Die Namen dürfen dafür verschoben werden.
- Bei den sieben oben genannten Orten wird jeder Name mit einer kleinen Linie vom Kreisrand zum Namen verbunden, damit man die Zuordnung eindeutig erkennt. Bei den übrigen Orten genügt es, wenn der Name nah an seinem Kreis steht.
- Kein Name darf aus dem Bild (720 × 360 px) laufen, auch nicht am rechten Rand (Sydney, Tokyo).
- Keine Linie darf einen anderen Namen kreuzen.

## Nicht ändern
Position, Größe und Farbe der Kreise, die Daten in `orte.json` und die Namen der Orte. Mach nur diese eine Änderung und nichts nebenbei.

## Prüfkriterien
1. Liegt bei keinem der 12 Orte ein Name auf einem Kreis (auch nicht auf dem eigenen)? --> Ja
2. Überlappt kein Name einen anderen Namen? --> Ja
3. Sind bei Berlin, Gmünd, Stuttgart, Nullinsel, Prüfpunkt Ost, Spitzbergen und Prüfpunkt Nord Name und Kreis durch eine Linie vom Kreisrand zum Namen verbunden, sodass man sie eindeutig zuordnen kann? --> Ja
4. Kreuzt keine Linie einen anderen Namen? --> Ja 
5. Liegen alle Namen vollständig im Bild (720 × 360 px), auch Sydney und Tokyo am rechten Rand? --> Ja
6. Sind Position, Größe und Farbe aller 12 Kreise unverändert? --> Ja
7. Ist `orte.json` unverändert? --> Ja 
8. Läuft `node projektion.js` ohne Fehlermeldung und schreibt eine neue `karte.svg`? --> Ja

## Ausgabe
- Die vollständige geänderte `projektion.js`, sodass ich die Datei ersetzen kann.
- Ein kurzer Kommentar über jeder neuen oder geänderten Stelle, was sie tut.
- Ein paar Sätze dazu, wie du die Breite der Texte bestimmst und wie du die Positionen der Namen wählst.


Beigefügt: projektion.js und orte.json im Stand vor der Änderung.