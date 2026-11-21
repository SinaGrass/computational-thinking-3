// Kleine Geometrie-Helfer für die Namensplatzierung (aus T3/T4).
// Nur reine Funktionen: Sie rechnen mit ihren Parametern und ändern nichts.
// Rechteck: { x0, y0, x1, y1 }, Strecke: { x1, y1, x2, y2 }

export function aufgeblaeht(r, d) {
  return { x0: r.x0 - d, y0: r.y0 - d, x1: r.x1 + d, y1: r.y1 + d };
}

export function rechteckeUeberlappen(a, b) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

// Abstand eines Punkts zum Rechteck (0, wenn der Punkt im Rechteck liegt)
export function abstandPunktRechteck(px, py, r) {
  const dx = Math.max(r.x0 - px, 0, px - r.x1);
  const dy = Math.max(r.y0 - py, 0, py - r.y1);
  return Math.hypot(dx, dy);
}

// Abstand eines Punkts zu einer Strecke
export function abstandPunktStrecke(px, py, s) {
  const dx = s.x2 - s.x1;
  const dy = s.y2 - s.y1;
  const laenge2 = dx * dx + dy * dy;
  let t = laenge2 === 0 ? 0 : ((px - s.x1) * dx + (py - s.y1) * dy) / laenge2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (s.x1 + t * dx), py - (s.y1 + t * dy));
}

// Ohne export: bleibt in diesem Modul.
function kreuzprodukt(ax, ay, bx, by, cx, cy) {
  return (by - ay) * (cx - ax) - (bx - ax) * (cy - ay);
}

// Kreuzen sich zwei Strecken?
export function streckenKreuzen(s, t) {
  const d1 = kreuzprodukt(s.x1, s.y1, s.x2, s.y2, t.x1, t.y1);
  const d2 = kreuzprodukt(s.x1, s.y1, s.x2, s.y2, t.x2, t.y2);
  const d3 = kreuzprodukt(t.x1, t.y1, t.x2, t.y2, s.x1, s.y1);
  const d4 = kreuzprodukt(t.x1, t.y1, t.x2, t.y2, s.x2, s.y2);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

// Berührt oder durchquert eine Strecke ein Rechteck?
export function streckeTrifftRechteck(s, r) {
  const imRechteck = (x, y) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
  if (imRechteck(s.x1, s.y1) || imRechteck(s.x2, s.y2)) {
    return true;
  }
  const kanten = [
    { x1: r.x0, y1: r.y0, x2: r.x1, y2: r.y0 },
    { x1: r.x1, y1: r.y0, x2: r.x1, y2: r.y1 },
    { x1: r.x1, y1: r.y1, x2: r.x0, y2: r.y1 },
    { x1: r.x0, y1: r.y1, x2: r.x0, y2: r.y0 },
  ];
  return kanten.some((k) => streckenKreuzen(s, k));
}
