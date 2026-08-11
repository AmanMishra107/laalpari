import type { VercelRequest, VercelResponse } from "@vercel/node";

export type YouTubeTrack = {
  videoId: string;
  title: string;
  artist: string;
  duration: number;
  artwork: string;
};

export async function parseYouTubePlaylist(playlistId: string): Promise<YouTubeTrack[]> {
  const res = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!match?.[1]) return [];

  let root: unknown;
  try {
    root = JSON.parse(match[1]);
  } catch {
    return [];
  }

  const out: YouTubeTrack[] = [];
  const seen = new Set<string>();
  const cleanTitle = (raw: string) =>
    (raw.split(/\s[|–]\s|\s-\s/)[0] ?? raw).replace(/\s*\([^)]*\)\s*$/, "").trim() || raw;
  const push = (videoId: string, title: string, artist: string, duration: number) => {
    if (seen.has(videoId)) return;
    seen.add(videoId);
    out.push({
      videoId,
      title: cleanTitle(title),
      artist,
      duration,
      artwork: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });
  };

  const parseClock = (s?: string) => {
    if (!s) return 0;
    const parts = s.split(":").map(Number);
    if (parts.some((n) => Number.isNaN(n))) return 0;
    return parts.reduce((acc, n) => acc * 60 + n, 0) * 1000;
  };

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const obj = node as Record<string, unknown>;

    const r = obj["playlistVideoRenderer"] as
      | {
          videoId?: string;
          title?: { runs?: { text?: string }[] };
          shortBylineText?: { runs?: { text?: string }[] };
          lengthSeconds?: string;
        }
      | undefined;
    if (r?.videoId) {
      push(
        r.videoId,
        r.title?.runs?.[0]?.text ?? "Unknown",
        r.shortBylineText?.runs?.[0]?.text ?? "YouTube",
        Number(r.lengthSeconds ?? 0) * 1000,
      );
    }

    const l = obj["lockupViewModel"] as
      | {
          contentId?: string;
          contentType?: string;
          metadata?: {
            lockupMetadataViewModel?: {
              title?: { content?: string };
              metadata?: {
                contentMetadataViewModel?: {
                  metadataRows?: { metadataParts?: { text?: { content?: string } }[] }[];
                };
              };
            };
          };
          contentImage?: {
            thumbnailViewModel?: {
              overlays?: {
                thumbnailBottomOverlayViewModel?: {
                  badges?: { thumbnailBadgeViewModel?: { text?: string } }[];
                };
              }[];
            };
          };
        }
      | undefined;
    if (l?.contentId && l.contentType === "LOCKUP_CONTENT_TYPE_VIDEO") {
      const meta = l.metadata?.lockupMetadataViewModel;
      const artist =
        meta?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text
          ?.content ?? "YouTube";
      const badgeText = l.contentImage?.thumbnailViewModel?.overlays
        ?.map((o) => o.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text)
        .find((t) => t && /^\d+(:\d+)+$/.test(t));
      push(l.contentId, meta?.title?.content ?? "Unknown", artist, parseClock(badgeText));
    }

    Object.values(obj).forEach(walk);
  };
  walk(root);
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json([]);
  }
  const tracks = await parseYouTubePlaylist(id);
  return res.status(200).json(tracks);
}
