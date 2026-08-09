import { getAccessToken } from "./auth";

const BASE = "https://api.spotify.com/v1";

export type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  artists: string;
  artwork: string | null;
  durationMs: number;
  externalUrl: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  const token = await getAccessToken();
  if (!token) throw new Error("not_authenticated");
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`spotify_error_${res.status}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

type RawTrack = {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
  external_urls?: { spotify?: string };
};

export function normalize(raw: RawTrack): SpotifyTrack {
  return {
    id: raw.id,
    uri: raw.uri,
    name: raw.name,
    artists: raw.artists.map((a) => a.name).join(", "),
    artwork: raw.album?.images?.[0]?.url ?? null,
    durationMs: raw.duration_ms,
    externalUrl: raw.external_urls?.spotify ?? `https://open.spotify.com/track/${raw.id}`,
  };
}

export async function searchTrack(title: string, artist: string) {
  const q = encodeURIComponent(`track:${title} artist:${artist}`);
  const data = await request<{ tracks: { items: RawTrack[] } }>(
    `/search?q=${q}&type=track&limit=1&market=from_token`,
  );
  const item = data?.tracks?.items?.[0];
  if (item) return normalize(item);
  const loose = await request<{ tracks: { items: RawTrack[] } }>(
    `/search?q=${encodeURIComponent(`${title} ${artist}`)}&type=track&limit=1&market=from_token`,
  );
  const alt = loose?.tracks?.items?.[0];
  return alt ? normalize(alt) : null;
}

export async function getMe() {
  return request<{ id: string; display_name: string | null; product: string }>("/me");
}

export async function getPlaybackState() {
  return request<{
    is_playing: boolean;
    progress_ms: number;
    item: RawTrack | null;
    shuffle_state: boolean;
    repeat_state: "off" | "context" | "track";
  }>("/me/player");
}

export async function playUris(uris: string[], deviceId?: string) {
  await request(`/me/player/play${deviceId ? `?device_id=${deviceId}` : ""}`, {
    method: "PUT",
    body: JSON.stringify({ uris }),
  });
}

export async function playContext(contextUri: string, offset?: number, deviceId?: string) {
  await request(`/me/player/play${deviceId ? `?device_id=${deviceId}` : ""}`, {
    method: "PUT",
    body: JSON.stringify({
      context_uri: contextUri,
      ...(offset !== undefined ? { offset: { position: offset } } : {}),
    }),
  });
}

export async function transferPlayback(deviceId: string, play = false) {
  await request(`/me/player`, {
    method: "PUT",
    body: JSON.stringify({ device_ids: [deviceId], play }),
  });
}


export const searchUrl = (title: string, artist: string) =>
  `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`;
