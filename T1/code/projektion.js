function lonToX(lon, breite) {
  const x = ((lon + 180) / 360) * breite;
  return x;
}

const x = lonToX(-180, 720);
console.log(x);


function latToY(lat, hoehe) {
  const y = ((90 - lat) / 180) * hoehe;
  return y;
}

const y = latToY(90, 360);
console.log(y);

//Austesten
// console.log(latToY(30, 360));
// console.log(latToY(-40, 360));


const orte = [
  { name: "Berlin", lat: 52.52, lon: 13.40 },
  { name: "Chicago", lat: 41.88, lon: -87.62 },
  { name: "London", lat: 51.51, lon: -0.13 },
  { name: "Paris", lat: 48.85, lon: 2.35 },
  { name: "New York", lat: 40.71, lon: -74.01 }
];

// console.log(orte);

//um zu wissen wo diese Orte auf der Karte liegen (Koordinaten in Pixel umrechnen)
// for (const ort of orte) {
//   console.log(ort.name, lonToX(ort.lon, 720), latToY(ort.lat, 360));
// }

//3. Funktion
function noerdlichsterOrt(orte) {
  let bisherNoerdlichster = orte[0];

  for (const ort of orte) {
    if (ort.lat > bisherNoerdlichster.lat) {
      bisherNoerdlichster = ort;
    }
  }

  return bisherNoerdlichster;
}

console.log(noerdlichsterOrt(orte).name);