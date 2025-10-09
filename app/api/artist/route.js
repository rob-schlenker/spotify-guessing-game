import { NextResponse } from "next/server";

let access_token = null;
let token_expires_at = 0;

async function getSpotifyToken() {
  // Use cached version if still valid
  const now = Date.now();
  if (access_token && now < token_expires_at) {
    return access_token;
  }

  // Otherwise fetch a new one
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!tokenResponse.ok) {
    console.error("Spotify token request failed:", tokenResponse.status);
    throw new Error("Failed to get Spotify token");
  }

  const tokenData = await tokenResponse.json();

  // Cache the token in memory
  access_token = tokenData.access_token;
  token_expires_at = now + tokenData.expires_in * 1000; // convert sec → ms

  return access_token;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const artistId = searchParams.get("artistId");

  if (!artistId) {
    return NextResponse.json({ error: "Missing artistId" }, { status: 400 });
  }

  try {
    const token = await getSpotifyToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!spotifyRes.ok) {
      return NextResponse.json(
        { error: "Spotify API failed" },
        { status: spotifyRes.status }
      );
    }

    const data = await spotifyRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}