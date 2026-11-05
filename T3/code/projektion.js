const fs = require("fs"); // ganz oben

const BREITE_SVG = 720;
const HOEHE_SVG = 360;

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

// const orte = [
//   { name: "Nullinsel", lat: 0, lon: 0 },
//   { name: "Prüfpunkt Ost", lat: 0, lon: 10 },
//   { name: "Schwäbisch Gmünd", lat: 48.8, lon: 9.79 },
//   { name: "Stuttgart", lat: 48.7758, lon: 9.1829 },
//   { name: "Kapstadt", lat: -33.92, lon: 18.42 },
//   { name: "Spitzbergen", lat: 78.22, lon: 15.63 },
//   { name: "Prüfpunkt Nord", lat: 78.22, lon: 25.63 },
//   { name: "NYC", lat: 40.69, lon: -74.1443092 },
// ];

const text = fs.readFileSync("orte.json", "utf8");
const orte = JSON.parse(text);

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  console.log(ort.name, "→ x:", x, "y:", y);
}

// ===== NEU: Platzierung der Ortsnamen =====

// Schriftgröße der Ortsnamen (wird auch im SVG verwendet)
const SCHRIFTGROESSE = 11;
// Höhe des Textfelds: 9 px über und 3 px unter der Grundlinie (Oberlängen, Umlaut-Punkte, Unterlängen)
// UNKLAR: Wie kommt man auf genau 9 und 3 Pixel für die Texthöhe?
const TEXT_OBEN = 9;
const TEXT_UNTEN = 3;

// Diese Orte bekommen eine Linie vom Kreisrand zum Namen
const ORTE_MIT_LINIE = [
  "Berlin",
  "Schwäbisch Gmünd",
  "Stuttgart",
  "Nullinsel",
  "Prüfpunkt Ost",
  "Spitzbergen",
  "Prüfpunkt Nord",
];

// Radius wie in der Zeichenschleife unten (nur gelesen, nicht verändert)
function kreisRadius(ort) {
  if (ort.temperatur === null) {
    return 4;
  }
  return Math.abs(ort.temperatur);
}

// Zeichenbreiten (in Schriftgrößen) einer üblichen Sans-Serif-Schrift (Arial/Helvetica-Werte)
// UNKLAR: Was ist dieses leere Objekt {} und wie wird es unten Buchstabe für Buchstabe gefüllt?
const ZEICHENBREITEN = {};
// UNKLAR: Was bedeutet const [breite, zeichen] mit den eckigen Klammern, und warum kann man einen Text wie "ijl" mit for ... of Buchstabe für Buchstabe durchgehen?
for (const [breite, zeichen] of [
  [0.222, "ijl"],
  [0.278, " ft.,I"],
  [0.333, "r-"],
  [0.5, "ckvxyzsJ"],
  [0.556, "abdeghnopquäöü0123456789L"],
  [0.611, "FTZß"],
  [0.667, "ABEKPSVXY"],
  [0.722, "CDHNRUw"],
  [0.778, "GOQ"],
  [0.833, "mM"],
  [0.944, "W"],
]) {
  for (const z of zeichen) {
    ZEICHENBREITEN[z] = breite;
  }
}

// Geschätzte Textbreite in px. Der Zuschlag von 15 % + 2 px sorgt dafür, dass die Schätzung
// eher zu groß als zu klein ist (breitere Schriften wie DejaVu Sans passen dann auch noch).
function textBreite(name) {
  let summe = 0;
  for (const z of name) {
    // UNKLAR: Was macht das ?? und warum 0.6 als Ersatzwert?
    summe += ZEICHENBREITEN[z] ?? 0.6;
  }
  return summe * SCHRIFTGROESSE * 1.15 + 2;
}

// --- kleine Geometrie-Helfer ---
// Rechteck: { x0, y0, x1, y1 }, Strecke: { x1, y1, x2, y2 }

// UNKLAR: Was heißt "aufgebläht" und warum gibt die Funktion ein neues Rechteck zurück, statt das alte zu ändern?
function aufgeblaeht(r, d) {
  return { x0: r.x0 - d, y0: r.y0 - d, x1: r.x1 + d, y1: r.y1 + d };
}

// UNKLAR: Warum reichen genau diese vier Vergleiche, um zu wissen, ob sich zwei Rechtecke überlappen?
function rechteckeUeberlappen(a, b) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

// Abstand eines Punkts zum Rechteck (0, wenn der Punkt im Rechteck liegt)
// UNKLAR: Wie entsteht aus Math.max und Math.hypot der Abstand zum Rechteck?
function abstandPunktRechteck(px, py, r) {
  const dx = Math.max(r.x0 - px, 0, px - r.x1);
  const dy = Math.max(r.y0 - py, 0, py - r.y1);
  return Math.hypot(dx, dy);
}

// Abstand eines Punkts zu einer Strecke
function abstandPunktStrecke(px, py, s) {
  const dx = s.x2 - s.x1;
  const dy = s.y2 - s.y1;
  const laenge2 = dx * dx + dy * dy;
  // UNKLAR: Was bedeutet diese Schreibweise mit ? und : (a === 0 ? 0 : ...)?
  // UNKLAR: Was ist t, und warum wird es mit Math.max und Math.min auf 0 bis 1 begrenzt?
  let t = laenge2 === 0 ? 0 : ((px - s.x1) * dx + (py - s.y1) * dy) / laenge2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (s.x1 + t * dx), py - (s.y1 + t * dy));
}

// UNKLAR: Was berechnet das Kreuzprodukt hier, und wie sagt es, auf welcher Seite einer Linie ein Punkt liegt?
function kreuzprodukt(ax, ay, bx, by, cx, cy) {
  return (by - ay) * (cx - ax) - (bx - ax) * (cy - ay);
}

// Kreuzen sich zwei Strecken?
// UNKLAR: Warum bedeutet d1 * d2 < 0 && d3 * d4 < 0, dass sich die Strecken kreuzen?
function streckenKreuzen(s, t) {
  const d1 = kreuzprodukt(s.x1, s.y1, s.x2, s.y2, t.x1, t.y1);
  const d2 = kreuzprodukt(s.x1, s.y1, s.x2, s.y2, t.x2, t.y2);
  const d3 = kreuzprodukt(t.x1, t.y1, t.x2, t.y2, s.x1, s.y1);
  const d4 = kreuzprodukt(t.x1, t.y1, t.x2, t.y2, s.x2, s.y2);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

// Berührt oder durchquert eine Strecke ein Rechteck?
function streckeTrifftRechteck(s, r) {
  // UNKLAR: Was bedeutet die Pfeil-Schreibweise (x, y) => ... und warum wird sie in einer Konstanten gespeichert?
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
  // UNKLAR: Was macht .some(...) und was bedeutet (k) => ... ?
  return kanten.some((k) => streckenKreuzen(s, k));
}

// --- Kreise (Mittelpunkt und Radius, genau wie beim Zeichnen) ---
// UNKLAR: Was ist eine Map, und wie unterscheidet sie sich von einem Array oder einem Objekt (.set und .get)?
const kreise = new Map();
for (const ort of orte) {
  kreise.set(ort, {
    x: lonZuX(ort.lon, BREITE_SVG),
    y: latZuY(ort.lat, HOEHE_SVG),
    r: kreisRadius(ort),
  });
}

// Mögliche Richtungen vom Kreismittelpunkt zum Namen (Grad, 0 = rechts, 90 = unten).
// Die Reihenfolge ist die Vorliebe: erst rechts, dann links, dann schräg, dann oben/unten.
// UNKLAR: Warum genau diese Winkel in genau dieser Reihenfolge, und warum zeigt 90 Grad nach unten?
const WINKEL = [
  0, 180, -30, 30, -150, 150, -60, 60, -120, 120, -90, 90,
  -15, 15, -165, 165, -45, 45, -135, 135, -75, 75, -105, 105,
];
// Abstand zwischen Kreisrand und Name bzw. Linienende (px), vom kleinsten zum größten
const ABSTAENDE_MIT_LINIE = [12, 18, 26, 36, 48];
const ABSTAENDE_OHNE_LINIE = [2, 5, 9, 14, 20, 28, 38];
// Luft zwischen Linienende und Textfeld
const LUECKE = 2;

// Baut einen Platzierungsvorschlag für einen Namen: Textfeld, Textposition und ggf. Linie
function vorschlag(kreis, breite, grad, abstand, mitLinie) {
  // UNKLAR: Wie werden aus Winkel und Abstand mit Math.cos und Math.sin die Koordinaten des Ankerpunkts (ax, ay)?
  const w = (grad * Math.PI) / 180;
  const ux = Math.cos(w);
  const uy = Math.sin(w);
  // Ankerpunkt: Dort endet die Linie bzw. dort "hängt" das Textfeld
  const ax = kreis.x + (kreis.r + abstand) * ux;
  const ay = kreis.y + (kreis.r + abstand) * uy;

  let x0;
  let anker;
  if (ux > 0.3) {
    x0 = ax + LUECKE; // Name rechts vom Anker, linksbündig
    anker = "start";
  } else if (ux < -0.3) {
    x0 = ax - LUECKE - breite; // Name links vom Anker, rechtsbündig
    anker = "end";
  } else {
    x0 = ax - breite / 2; // Name mittig über/unter dem Anker
    anker = "middle";
  }

  const hoehe = TEXT_OBEN + TEXT_UNTEN;
  let y0;
  if (uy > 0.3) {
    y0 = ay + LUECKE; // Name unterhalb
  } else if (uy < -0.3) {
    y0 = ay - LUECKE - hoehe; // Name oberhalb
  } else {
    y0 = ay - hoehe / 2; // Name auf Höhe des Ankers
  }

  const box = { x0, y0, x1: x0 + breite, y1: y0 + hoehe };
  return {
    box,
    anker,
    // UNKLAR: Wie liest man diese verschachtelte Bedingung mit zwei ? und zwei : ?
    textX: anker === "start" ? box.x0 : anker === "end" ? box.x1 : (box.x0 + box.x1) / 2,
    textY: y0 + TEXT_OBEN,
    // Linie vom Kreisrand (nicht vom Mittelpunkt) zum Anker
    linie: mitLinie
      ? { x1: kreis.x + kreis.r * ux, y1: kreis.y + kreis.r * uy, x2: ax, y2: ay }
      : null,
  };
}

// UNKLAR: Warum eine Map mit dem ganzen Ort als Schlüssel und nicht zum Beispiel ein Array?
const beschriftungen = new Map(); // Ort -> gewählte Platzierung

// Prüft einen Vorschlag gegen alle Kreise und alle schon platzierten Namen und Linien
function vorschlagPasst(ort, v) {
  const rand = 2;
  const imBild = (r) =>
    r.x0 >= rand && r.y0 >= rand && r.x1 <= BREITE_SVG - rand && r.y1 <= HOEHE_SVG - rand;
  if (!imBild(v.box)) {
    return false;
  }

  // Name darf auf keinem Kreis liegen (auch nicht auf dem eigenen)
  // UNKLAR: Was liefert .values() bei einer Map, und warum wird hier nicht kreise selbst durchlaufen?
  for (const k of kreise.values()) {
    if (abstandPunktRechteck(k.x, k.y, v.box) < k.r + 1.5) {
      return false;
    }
  }

  // Name darf keinen anderen Namen und keine andere Linie berühren
  // UNKLAR: Was bedeutet const [anderer, b] beim Durchlaufen einer Map?
  for (const [anderer, b] of beschriftungen) {
    if (rechteckeUeberlappen(aufgeblaeht(v.box, 3), b.box)) {
      return false;
    }
    if (b.linie && streckeTrifftRechteck(b.linie, aufgeblaeht(v.box, 1.5))) {
      return false;
    }
  }

  if (v.linie) {
    // Linie muss im Bild bleiben
    // UNKLAR: Was macht const { x1, y1, x2, y2 } = v.linie; mit den geschweiften Klammern?
    const { x1, y1, x2, y2 } = v.linie;
    if (!imBild({ x0: Math.min(x1, x2), y0: Math.min(y1, y2), x1: Math.max(x1, x2), y1: Math.max(y1, y2) })) {
      return false;
    }
    // Linie darf keinen fremden Kreis schneiden (sonst wäre unklar, wohin sie gehört)
    for (const [anderer, k] of kreise) {
      if (anderer !== ort && abstandPunktStrecke(k.x, k.y, v.linie) < k.r + 0.25) {
        return false;
      }
    }
    // Linie darf keinen fremden Namen und keine fremde Linie kreuzen
    for (const [anderer, b] of beschriftungen) {
      if (streckeTrifftRechteck(v.linie, aufgeblaeht(b.box, 1.5))) {
        return false;
      }
      if (b.linie && streckenKreuzen(v.linie, b.linie)) {
        return false;
      }
    }
  }
  return true;
}

// Orte mit Linie zuerst platzieren (sie haben die engsten Platzverhältnisse),
// danach alle anderen, jeweils in der Reihenfolge der Datei
// UNKLAR: Was bedeuten die drei Punkte (...) vor orte.filter, und was macht .filter(...)?
const reihenfolge = [
  ...orte.filter((o) => ORTE_MIT_LINIE.includes(o.name)),
  ...orte.filter((o) => !ORTE_MIT_LINIE.includes(o.name)),
];

for (const ort of reihenfolge) {
  const kreis = kreise.get(ort);
  const breite = textBreite(ort.name);
  const mitLinie = ORTE_MIT_LINIE.includes(ort.name);
  const abstaende = mitLinie ? ABSTAENDE_MIT_LINIE : ABSTAENDE_OHNE_LINIE;

  // Kleinster Abstand zuerst, innerhalb eines Abstands die Richtungen nach Vorliebe
  let gewaehlt = null;
  // UNKLAR: Was bedeutet "suche:" vor der Schleife, und was macht break suche; weiter unten?
  suche: for (const abstand of abstaende) {
    for (const grad of WINKEL) {
      const v = vorschlag(kreis, breite, grad, abstand, mitLinie);
      if (vorschlagPasst(ort, v)) {
        gewaehlt = v;
        break suche;
      }
    }
  }
  if (gewaehlt === null) {
    console.warn("Kein freier Platz für den Namen gefunden:", ort.name);
    gewaehlt = vorschlag(kreis, breite, 0, abstaende[0], mitLinie);
  }
  beschriftungen.set(ort, gewaehlt);
}

// ===== Ende der neuen Platzierung =====

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE_SVG}" height="${HOEHE_SVG}">
  <rect width="${BREITE_SVG}" height="${HOEHE_SVG}" fill="#f4f1ea" stroke="#222"/>`;

// for (const ort of orte) {
//   const x = lonZuX(ort.lon, BREITE_SVG);
//   const y = latZuY(ort.lat, HOEHE_SVG);
//   svg += `
//   <circle cx="${x}" cy="${y}" r="4" fill="#c0392b"/>
//   <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
// }

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  let radius = Math.abs(ort.temperatur);
  let farbe = "#c0392b";
  if (ort.temperatur < 0) {
    farbe = "#2980b9";
  }
  if (ort.temperatur === null) {
    radius = 4;
    farbe = "#999999";
  }
  // NEU: Position des Namens (und ggf. Linie) aus der Platzierung oben
  const b = beschriftungen.get(ort);
  // UNKLAR: Was bedeutet b.linie ? `...` : "" (Bedingung mit ? und :), und was passiert, wenn es keine Linie gibt?
  // UNKLAR: Was macht .toFixed(2) bei den Zahlen?
  const linieSvg = b.linie
    ? `
  <line x1="${b.linie.x1.toFixed(2)}" y1="${b.linie.y1.toFixed(2)}" x2="${b.linie.x2.toFixed(2)}" y2="${b.linie.y2.toFixed(2)}" stroke="#555" stroke-width="0.8"/>`
    : "";
  svg += `
  <circle cx="${x}" cy="${y}" r="${radius}" fill="${farbe}" fill-opacity="0.6"/>${linieSvg}
  <text x="${b.textX.toFixed(2)}" y="${b.textY.toFixed(2)}" text-anchor="${b.anker}" font-family="sans-serif" font-size="${SCHRIFTGROESSE}">${ort.name}</text>`;
}

svg += `
</svg>`;

fs.writeFileSync("karte.svg", svg);