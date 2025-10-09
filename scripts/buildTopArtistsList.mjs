import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const artists = [
  "Taylor Swift",
  "The Weeknd",
  "Drake",
  "Billie Eilish",
  "Adele",
  "Ed Sheeran",
  "Bad Bunny",
  "SZA",
  "Ariana Grande",
  "Post Malone",
  "Doja Cat",
  "Kendrick Lamar",
  "Justin Bieber",
  "Miley Cyrus",
  "Harry Styles",
  "BTS",
  "Olivia Rodrigo",
  "Dua Lipa",
  "Travis Scott",
  "Metro Boomin",
  "Lil Baby",
  "Rihanna",
  "Bruno Mars",
  "Shakira",
  "Rema",
  "ICE SPICE",
  "Kanye West",
  "Peso Pluma",
  "Rosalía",
  "The Chainsmokers",
  "Kygo",
  "Calvin Harris",
  "David Guetta",
  "Martin Garrix",
  "Tame Impala",
  "Glass Animals",
  "Coldplay",
  "Imagine Dragons",
  "The 1975",
  "Queen",
  "Eminem",
  "21 Savage",
  "Future",
  "Bad Bunny",
  "Nicki Minaj",
  "Snoop Dogg",
  "Chance the Rapper",
  "Tyler, The Creator",
  "Jack Harlow",
  "Frank Ocean",
  "Khalid",
  "Sam Smith",
  "Charlie Puth",
  "Laufey",
  "Noah Kahan",
  "Luke Combs",
  "Morgan Wallen",
  "Zach Bryan",
  "Dan + Shay",
  "Kacey Musgraves",
  "BLACKPINK",
  "Beyoncé",
  "Paramore",
  "Arctic Monkeys",
  "Hozier",
  "Lana Del Rey",
  "The Kid LAROI",
  "Marshmello",
  "DJ Snake",
  "Alan Walker",
  "Avicii",
  "Maroon 5",
  "Selena Gomez",
  "Camila Cabello",
  "Charlie XCX",
  "Lorde",
  "Halsey",
  "Phoebe Bridgers",
  "Conan Gray",
  "Joji",
  "Lil Nas X",
  "Cardi B",
  "Megan Thee Stallion",
  "Doja Cat",
  "Latto",
  "Rauw Alejandro",
  "J Balvin",
  "Ozuna",
  "Daddy Yankee",
  "Karol G",
  "Anitta",
  "Feid",
  "Shawn Mendes",
  "Jason Derulo",
  "OneRepublic",
  "Chainsmokers",
  "Imagine Dragons",
  "The Killers",
  "Michael Jackson",
  "Elton John"
];

// ---------- Fetch IDs ----------
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

async function getToken() {
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" })
  });
  const { access_token } = await r.json();
  return access_token;
}

async function getArtistId(name, token) {
  const q = encodeURIComponent(name);
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=artist&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  const a = data.artists?.items?.[0];
  return a ? { id: a.id, name: a.name } : null;
}

async function buildList() {
  const token = await getToken();
  const list = [];
  for (const n of artists) {
    const entry = await getArtistId(n, token);
    if (entry) {
      list.push(entry);
      console.log(`✔︎ ${entry.name}`);
    } else {
      console.warn(`⚠️ Not found: ${n}`);
    }
    await new Promise((r) => setTimeout(r, 200)); // rate‑limit
  }
  fs.writeFileSync(
    "./data/popularArtists.json",
    JSON.stringify(list, null, 2)
  );
  console.log(`\n✅  Saved ${list.length} artists → data/popularArtists.json`);
}

buildList();