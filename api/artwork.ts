import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Returns album artwork URL for a Spotify track URI via the public oEmbed endpoint.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { uri } = req.query;
  if (!uri || typeof uri !== "string") {
    return res.status(400).json({ url: null });
  }

  try {
    const id = uri.split(":").pop();
    if (!id) return res.status(200).json({ url: null });

    const response = await fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${id}`,
      { headers: { "user-agent": "Mozilla/5.0" } },
    );
    if (!response.ok) return res.status(200).json({ url: null });

    const json = (await response.json()) as { thumbnail_url?: string };
    return res.status(200).json({ url: json.thumbnail_url ?? null });
  } catch {
    return res.status(200).json({ url: null });
  }
}
