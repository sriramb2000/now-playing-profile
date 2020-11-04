import fetch from "isomorphic-unfetch";
import { stringify } from "querystring";

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const Authorization = `Basic ${basic}`;

async function getAuthorizationToken() {
  const url = new URL("https://accounts.spotify.com/api/token");
  const body = stringify({
    grant_type: "refresh_token",
    refresh_token,
  });
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Authorization,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).then((r) => r.json());

  return `Bearer ${response.access_token}`;
}

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
export async function nowPlaying() {
  const Authorization = await getAuthorizationToken();
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization,
    },
  });
  const { status } = response;
  if (status === 204) {
    return {};
  } else if (status === 200) {
    const data = await response.json();
    return data;
  }
}

const SAVED_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/tracks`;
export async function lastSaved() {
  const Authorization = await getAuthorizationToken();
  const body = stringify({
    limit: 1,
    offset: 0
  });
  const response = await fetch(`${SAVED_TRACKS_ENDPOINT}?${body}`, {
    headers: {
      Authorization,
    }
  });
  const { status } = response;
  if (status === 204) {
    return {};
  } else if (status === 200) {
    const data = await response.json();
    data.item = (data.items && data.items[0] && data.items[0].track) || {};
    return data;
  }
}

const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists`;
export async function topArtist(timeRange='short_term') {
  const Authorization = await getAuthorizationToken();
  const body = stringify({
    limit: 1,
    offset: Math.floor(Math.random()*10),
    time_range: timeRange
  });
  const response = await fetch(`${TOP_ARTISTS_ENDPOINT}?${body}`, {
    headers: {
      Authorization,
    }
  });
  const { status } = response;
  if (status === 204) {
    return {};
  } else if (status === 200) {
    const data = await response.json();
    data.item = (data.items && data.items[0]) || {};
    return data;
  }
}

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
export async function topTracks(timeRange='short_term') {
  const Authorization = await getAuthorizationToken();
  const body = stringify({
    limit: 1,
    offset: Math.floor(Math.random()*10),
    time_range: timeRange
  });
  const response = await fetch(`${TOP_TRACKS_ENDPOINT}?${body}`, {
    headers: {
      Authorization,
    }
  });
  const { status } = response;
  if (status === 204) {
    return {};
  } else if (status === 200) {
    const data = await response.json();
    data.item = (data.items && data.items[0]) || {};
    return data;
  }
}