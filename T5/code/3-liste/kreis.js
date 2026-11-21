// Aussehen eines Ortskreises, berechnet aus der Temperatur (aus T4).
// Nur reine Funktionen: kein DOM, kein Slider.

// Radius in px: Betrag der Temperatur, ohne Messwert ein kleiner fester Kreis.
export function kreisRadius(ort) {
  if (ort.temperatur === null) {
    return 4;
  }
  return Math.abs(ort.temperatur);
}

// Rot bei Plusgraden, blau bei Minusgraden, grau ohne Messwert.
export function kreisFarbe(ort) {
  if (ort.temperatur === null) {
    return "#999999";
  }
  if (ort.temperatur < 0) {
    return "#2980b9";
  }
  return "#c0392b";
}
