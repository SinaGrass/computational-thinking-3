// T2 — Theorieblock: JSON ist Text, kein JavaScript.

// 1) JavaScript verzeiht das hier alles:
const jsObjekt = {
  name: "Gmünd",     // Kommentar erlaubt
  lat: 48.8,
  lon: 9.79,         // Komma am Ende erlaubt
};
console.log("JavaScript:", jsObjekt.name);

// 2) JSON verzeiht nichts davon. Derselbe Ort, diesmal als Text.
const text = `{
  "name": "Gmünd",
  "lat": 48.8,
  "lon": 9.79
}`; //Schlüssel in Anführungszeichen ("name"), Kein Komma nach dem letzten Eintrag, Keine Kommentare --> dann geht es. Ich hab nur das Komma
// am Ende des letzten Eintrags entfernt, und dann ging es.

const daten = JSON.parse(text);
console.log("JSON:", daten.name);
