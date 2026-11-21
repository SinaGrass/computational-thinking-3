// Platzierung der Ortsnamen (aus T3/T4) als eigenes Modul.
// Nur reine Funktionen: platziereNamen bekommt orte, Größe und Ausschnitt
// als Parameter und gibt die Plätze zurück. Gezeichnet wird in karte.js.

import { lonZuX, latZuY } from "./projektion.js";
import { kreisRadius } from "./kreis.js";
import {
  aufgeblaeht,
  rechteckeUeberlappen,
  abstandPunktRechteck,
  abstandPunktStrecke,
  streckenKreuzen,
  streckeTrifftRechteck,
} from "./geometrie.js";

// Schriftgröße der Ortsnamen (wird auch im SVG verwendet, darum exportiert)
export const SCHRIFTGROESSE = 11;
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

// Platziert die Namen aller übergebenen Orte für eine Karte der Größe breite x hoehe
// und gibt zurück, wo jeder Name (und ggf. seine Linie) steht (Map: Ort -> Platzierung).
// Der Schlüssel der Map ist das Ort-Objekt selbst, darum muss karte.js
// beim Nachschlagen dieselben Objekte benutzen, die sie hier übergeben hat.
export function platziereNamen(orte, breite, hoehe, ausschnitt) {
  // Kreise (Mittelpunkt und Radius, genau wie beim Zeichnen)
  const kreise = new Map();
  for (const ort of orte) {
    kreise.set(ort, {
      x: lonZuX(ort.lon, breite, ausschnitt),
      y: latZuY(ort.lat, hoehe, ausschnitt),
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
  // danach alle anderen, jeweils in der Reihenfolge der Liste
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
