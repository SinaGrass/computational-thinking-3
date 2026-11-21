// T5: Karte mit Umkreis, Liste nach Entfernung und der Namensplatzierung aus T4.
// Hier bleibt nur, was Slider liest oder ins DOM schreibt.
// Alles, was nur rechnet, liegt in Modulen.

import { lonZuX, latZuY, zoomeAusschnitt } from "./projektion.js";
import { entfernung, orteImUmkreis, nachEntfernung } from "./entfernung.js";
import { kreisRadius, kreisFarbe } from "./kreis.js";
import { platziereNamen, SCHRIFTGROESSE } from "./beschriftung.js";

const AUSSCHNITT = { west: -180, ost: 180, nord: 90, sued: -90 };
const ZOOMPUNKT = { lat: 48.8, lon: 9.79 }; // Schwäbisch Gmünd

// Prüffälle, Ergebnis vorher bekannt. Stehen lassen, sie kosten nichts.
const gmuend = { lat: 48.8, lon: 9.79 };
const stuttgart = { lat: 48.7758, lon: 9.1829 };
console.log("Gmünd → Stuttgart:", entfernung(gmuend, stuttgart).toFixed(1), "km, erwartet 44.6");

const response = await fetch("orte.json");
const orte = await response.json();

console.log("Radius 0:", orteImUmkreis(orte, ZOOMPUNKT, 0).map((ort) => ort.name), "erwartet nur Gmünd");
console.log("Radius 50:", orteImUmkreis(orte, ZOOMPUNKT, 50).map((ort) => ort.name), "erwartet Gmünd, Stuttgart");
console.log("Reihenfolge:", nachEntfernung(orte, ZOOMPUNKT).map((ort) => ort.id).join(", "));
console.log("orte unverändert:", orte.map((ort) => ort.id).join(", "));

const sliderBreite = document.querySelector("#breite");
const sliderZoom = document.querySelector("#zoom");
const sliderRadius = document.querySelector("#radius");
const radiusWert = document.querySelector("#radiusWert");
const karte = document.querySelector("#karte");
const liste = document.querySelector("#liste");

function zeichnen() {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;
  const faktor = 2 ** Number(sliderZoom.value); // 0 → 1×, 1 → 2×, 7 → 128×
  const ausschnitt = zoomeAusschnitt(AUSSCHNITT, ZOOMPUNKT, faktor);
  const radius = Number(sliderRadius.value);
  const imUmkreis = orteImUmkreis(orte, ZOOMPUNKT, radius);
  const orteNachEntfernung = nachEntfernung(imUmkreis, ZOOMPUNKT);

  radiusWert.textContent = radius + " km";

  // Namen nur für die Orte im Umkreis platzieren.
  // Die Map benutzt die Ort-Objekte aus imUmkreis als Schlüssel,
  // darum zeichnen wir unten auch aus imUmkreis.
  const beschriftungen = platziereNamen(imUmkreis, breite, hoehe, ausschnitt);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

  for (const ort of imUmkreis) {
    const x = lonZuX(ort.lon, breite, ausschnitt);
    const y = latZuY(ort.lat, hoehe, ausschnitt);
    const b = beschriftungen.get(ort);
    const linieSvg = b.linie
      ? `
  <line x1="${b.linie.x1.toFixed(2)}" y1="${b.linie.y1.toFixed(2)}" x2="${b.linie.x2.toFixed(2)}" y2="${b.linie.y2.toFixed(2)}" stroke="#555" stroke-width="0.8"/>`
      : "";
    svg += `
  <circle cx="${x}" cy="${y}" r="${kreisRadius(ort)}" fill="${kreisFarbe(ort)}" fill-opacity="0.6"/>${linieSvg}
  <text x="${b.textX.toFixed(2)}" y="${b.textY.toFixed(2)}" text-anchor="${b.anker}" font-family="sans-serif" font-size="${SCHRIFTGROESSE}">${ort.name}</text>`;
  }

  svg += `
</svg>`;

  karte.innerHTML = svg;

  // Wie beim SVG: Text sammeln, dann einmal ins DOM schreiben.
  let listenElemente = "";
  for (const ort of orteNachEntfernung) {
    listenElemente += `<li>${ort.name} – ${ort.km.toFixed(1)} km</li>`;
  }
  liste.innerHTML = listenElemente;
}

sliderBreite.addEventListener("input", zeichnen);
sliderZoom.addEventListener("input", zeichnen);
sliderRadius.addEventListener("input", zeichnen);

zeichnen();
