export type YouTubeTrack = {
  videoId: string;
  title: string;
  artist: string;
  duration: number;
  artwork: string;
};

/**
 * Fetches track list for a YouTube playlist via the /api/youtube-playlist endpoint.
 */
export async function getYouTubePlaylist({
  data,
}: {
  data: { playlistId: string };
}): Promise<YouTubeTrack[]> {
  const res = await fetch(`/api/youtube-playlist?id=${encodeURIComponent(data.playlistId)}`);
  if (!res.ok) return [];
  return res.json() as Promise<YouTubeTrack[]>;
}

