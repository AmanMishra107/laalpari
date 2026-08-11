export type QueueTrack = {
  uri: string;
  title: string;
  artist: string;
  duration: number;
  preview: string | null;
};

/**
 * Fetches the track list for a Spotify playlist via the /api/playlist serverless route.
 * The server-side route handles Spotify embed page scraping (avoids CORS).
 */
export async function getPlaylistTracks({
  data,
}: {
  data: { playlistId: string };
}): Promise<QueueTrack[]> {
  const res = await fetch(`/api/playlist?id=${encodeURIComponent(data.playlistId)}`);
  if (!res.ok) return [];
  return res.json() as Promise<QueueTrack[]>;
}

/** Album artwork for a Spotify track URI, via the /api/artwork serverless route. */
export async function getTrackArtwork({
  data,
}: {
  data: { uri: string };
}): Promise<string | null> {
  const res = await fetch(`/api/artwork?uri=${encodeURIComponent(data.uri)}`);
  if (!res.ok) return null;
  const json = (await res.json()) as { url?: string | null };
  return json.url ?? null;
}
