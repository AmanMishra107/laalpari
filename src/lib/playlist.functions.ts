import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type QueueTrack = {
  uri: string;
  title: string;
  artist: string;
  duration: number;
  preview: string | null;
};

/**
 * Reads the public Spotify embed page for a playlist and returns its track list.
 * No OAuth needed — this powers next/previous inside the embed player.
 */
export const getPlaylistTracks = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ playlistId: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<QueueTrack[]> => {
    const res = await fetch(`https://open.spotify.com/embed/playlist/${data.playlistId}`, {
      headers: { "user-agent": "Mozilla/5.0", "accept-language": "en" },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    );
    if (!match?.[1]) return [];
    try {
      const json = JSON.parse(match[1]) as {
        props?: {
          pageProps?: {
            state?: {
              data?: {
                entity?: {
                  trackList?: Array<{
                    uri: string;
                    title: string;
                    subtitle: string;
                    duration: number;
                    audioPreview?: { url?: string };
                  }>;
                };
              };
            };
          };
        };
      };
      const list = json.props?.pageProps?.state?.data?.entity?.trackList ?? [];
      return list.map((t) => ({
        uri: t.uri,
        title: t.title,
        artist: t.subtitle,
        duration: t.duration,
        preview: t.audioPreview?.url ?? null,
      }));
    } catch {
      return [];
    }
  });
