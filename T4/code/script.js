console.log("test");

const BREITE_SVG = 720;
const HOEHE_SVG = 360;

const sliderBreite = document.querySelector("#breite");
console.log(sliderBreite);

// Aufgabe 2: zweiter Slider
const sliderZoom = document.querySelector("#zoom");

const AUSSCHNITT = { west: -10, ost: 30, nord: 65, sued: 45 };

function lonZuX(lon, breite, ausschnitt = AUSSCHNITT) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

function latZuY(lat, hoehe, ausschnitt = AUSSCHNITT) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}

// Aufgabe 2: Zoompunkt und Berechnung des Ausschnitts
const ZOOMPUNKT = { lat: 48.8, lon: 9.79 };

function berechneAusschnitt(zoom, zoompunkt = ZOOMPUNKT) {
  const breiteGrad = 360 / zoom;
  const hoeheGrad = 180 / zoom;

  // Relative Position des Zoompunkts auf der ganzen Welt (0 bis 1)
  const anteilX = (zoompunkt.lon + 180) / 360;
  const anteilY = (90 - zoompunkt.lat) / 180;

  // Ausschnitt so aufbauen, dass der Zoompunkt denselben Anteil behält
  const west = zoompunkt.lon - anteilX * breiteGrad;
  const nord = zoompunkt.lat + anteilY * hoeheGrad;

  return {
    west,
    ost: west + breiteGrad,
    nord,
    sued: nord - hoeheGrad,
  };
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

// const text = fs.readFileSync("orte.json", "utf8");
// const orte = JSON.parse(text);

const responseOrte = await fetch("orte.json");
const orte = await responseOrte.json();
console.log(orte);


for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  console.log(ort.name, "→ x:", x, "y:", y);
}

// (aus T3): Platzierung der Ortsnamen 

// Schriftgröße der Ortsnamen (wird auch im SVG verwendet)
const SCHRIFTGROESSE = 11;
// Höhe des Textfelds: 9 px über und 3 px unter der Grundlinie (Oberlängen, Umlaut-Punkte, Unterlängen)
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
const ZEICHENBREITEN = {};
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
    summe += ZEICHENBREITEN[z] ?? 0.6;
  }
  return summe * SCHRIFTGROESSE * 1.15 + 2;
}

// --- kleine Geometrie-Helfer ---
// Rechteck: { x0, y0, x1, y1 }, Strecke: { x1, y1, x2, y2 }

function aufgeblaeht(r, d) {
  return { x0: r.x0 - d, y0: r.y0 - d, x1: r.x1 + d, y1: r.y1 + d };
}

function rechteckeUeberlappen(a, b) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

// Abstand eines Punkts zum Rechteck (0, wenn der Punkt im Rechteck liegt)
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
  let t = laenge2 === 0 ? 0 : ((px - s.x1) * dx + (py - s.y1) * dy) / laenge2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (s.x1 + t * dx), py - (s.y1 + t * dy));
}

function kreuzprodukt(ax, ay, bx, by, cx, cy) {
  return (by - ay) * (cx - ax) - (bx - ax) * (cy - ay);
}

// Kreuzen sich zwei Strecken?
function streckenKreuzen(s, t) {
  const d1 = kreuzprodukt(s.x1, s.y1, s.x2, s.y2, t.x1, t.y1);
  const d2 = kreuzprodukt(s.x1, s.y1, s.x2, s.y2, t.x2, t.y2);
  const d3 = kreuzprodukt(t.x1, t.y1, t.x2, t.y2, s.x1, s.y1);
  const d4 = kreuzprodukt(t.x1, t.y1, t.x2, t.y2, s.x2, s.y2);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

// Berührt oder durchquert eine Strecke ein Rechteck?
function streckeTrifftRechteck(s, r) {
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

// Mögliche Richtungen vom Kreismittelpunkt zum Namen (Grad, 0 = rechts, 90 = unten).
// Die Reihenfolge ist die Vorliebe: erst rechts, dann links, dann schräg, dann oben/unten.
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
    textX: anker === "start" ? box.x0 : anker === "end" ? box.x1 : (box.x0 + box.x1) / 2,
    textY: y0 + TEXT_OBEN,
    // Linie vom Kreisrand (nicht vom Mittelpunkt) zum Anker
    linie: mitLinie
      ? { x1: kreis.x + kreis.r * ux, y1: kreis.y + kreis.r * uy, x2: ax, y2: ay }
      : null,
  };
}

// Platziert alle Namen für eine Karte der Größe breite x hoehe und gibt zurück,
// wo jeder Name (und ggf. seine Linie) steht. Weil sich die Karte mit dem Slider
// ändert, wird das bei jedem Zeichnen neu berechnet.
// (Aufgabe 2): dritter Parameter ausschnitt
function platziereNamen(breite, hoehe, ausschnitt) {
  // Kreise (Mittelpunkt und Radius, genau wie beim Zeichnen)
  const kreise = new Map();
  for (const ort of orte) {
    kreise.set(ort, {
      x: lonZuX(ort.lon, breite, ausschnitt), // NEU (Aufgabe 2)
      y: latZuY(ort.lat, hoehe, ausschnitt), // NEU (Aufgabe 2)
      r: kreisRadius(ort),
    });
  }

  const beschriftungen = new Map(); // Ort -> gewählte Platzierung

  // Prüft einen Vorschlag gegen alle Kreise und alle schon platzierten Namen und Linien
  function vorschlagPasst(ort, v) {
    const rand = 2;
    const imBild = (r) =>
      r.x0 >= rand && r.y0 >= rand && r.x1 <= breite - rand && r.y1 <= hoehe - rand;
    if (!imBild(v.box)) {
      return false;
    }

    // Name darf auf keinem Kreis liegen (auch nicht auf dem eigenen)
    for (const k of kreise.values()) {
      if (abstandPunktRechteck(k.x, k.y, v.box) < k.r + 1.5) {
        return false;
      }
    }

    // Name darf keinen anderen Namen und keine andere Linie berühren
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
  const reihenfolge = [
    ...orte.filter((o) => ORTE_MIT_LINIE.includes(o.name)),
    ...orte.filter((o) => !ORTE_MIT_LINIE.includes(o.name)),
  ];

  for (const ort of reihenfolge) {
    const kreis = kreise.get(ort);
    const textBr = textBreite(ort.name);
    const mitLinie = ORTE_MIT_LINIE.includes(ort.name);
    const abstaende = mitLinie ? ABSTAENDE_MIT_LINIE : ABSTAENDE_OHNE_LINIE;

    // Kleinster Abstand zuerst, innerhalb eines Abstands die Richtungen nach Vorliebe
    let gewaehlt = null;
    suche: for (const abstand of abstaende) {
      for (const grad of WINKEL) {
        const v = vorschlag(kreis, textBr, grad, abstand, mitLinie);
        if (vorschlagPasst(ort, v)) {
          gewaehlt = v;
          break suche;
        }
      }
    }
    if (gewaehlt === null) {
      console.warn("Kein freier Platz für den Namen gefunden:", ort.name);
      gewaehlt = vorschlag(kreis, textBr, 0, abstaende[0], mitLinie);
    }
    beschriftungen.set(ort, gewaehlt);
  }

  return beschriftungen;
}

// ===== Ende der neuen Platzierung =====

function zeichnen() {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;
  // (Aufgabe 2): Zoom lesen und Ausschnitt berechnen
  const zoom = Number(sliderZoom.value);
  const ausschnitt = berechneAusschnitt(zoom);
  console.log("zeichnen");

  //Positionen der Namen (und Linien) für die aktuelle Kartengröße und den Ausschnitt
  const beschriftungen = platziereNamen(breite, hoehe, ausschnitt);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

  // for (const ort of orte) {
  //   const x = lonZuX(ort.lon, BREITE_SVG);
  //   const y = latZuY(ort.lat, HOEHE_SVG);
  //   svg += `
  //   <circle cx="${x}" cy="${y}" r="4" fill="#c0392b"/>
  //   <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
  // }

  for (const ort of orte) {
    const x = lonZuX(ort.lon, breite, ausschnitt); // NEU (Aufgabe 2)
    const y = latZuY(ort.lat, hoehe, ausschnitt); // NEU (Aufgabe 2)
    let radius = Math.abs(ort.temperatur);
    let farbe = "#c0392b";
    if (ort.temperatur < 0) {
      farbe = "#2980b9";
    }
    if (ort.temperatur === null) {
      radius = 4;
      farbe = "#999999";
    }
    // Position des Namens (und ggf. Linie) aus der Platzierung oben
    const b = beschriftungen.get(ort);
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

  document.querySelector("#karte").innerHTML = svg;
}




sliderBreite.addEventListener("input", zeichnen);
sliderZoom.addEventListener("input", zeichnen); // NEU (Aufgabe 2)
zeichnen();
