import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Fetches the Spotify embed page for a playlist and returns its track list as JSON.
 * Running server-side avoids the CORS restriction on open.spotify.com/embed.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json([]);
  }

  try {
    const response = await fetch(
      `https://open.spotify.com/embed/playlist/${id}`,
      { headers: { "user-agent": "Mozilla/5.0", "accept-language": "en" } },
    );
    if (!response.ok) return res.status(200).json([]);

    const html = await response.text();
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    );
    if (!match?.[1]) return res.status(200).json([]);

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
    return res.status(200).json(
      list.map((t) => ({
        uri: t.uri,
        title: t.title,
        artist: t.subtitle,
        duration: t.duration,
        preview: t.audioPreview?.url ?? null,
      })),
    );
  } catch {
    return res.status(200).json([]);
  }
}
