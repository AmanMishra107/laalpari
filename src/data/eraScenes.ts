import era1 from "@/assets/era-1.png.asset.json";
import era2 from "@/assets/era-2.png.asset.json";
import era3 from "@/assets/era-3.png.asset.json";
import era4 from "@/assets/era-4.png.asset.json";
import era5 from "@/assets/era-5.webp.asset.json";
import era6 from "@/assets/era-6.webp.asset.json";

/** One hand-painted bus scene per stop / era, in journey order (60s → 10s). */
export const eraScenes: { url: string; alt: string }[] = [
  { url: era1.url, alt: "1960s: a young man by the window of a red ST bus at Pune stand, valve radio on the table" },
  { url: era2.url, alt: "1970s: bus interior rolling through green hills, transistor radio on the seat" },
  { url: era3.url, alt: "1980s: Lal Pari interior with a Philips transistor and passengers reading Loksatta" },
  { url: era4.url, alt: "1990s: a couple by the window with a radio-cassette player and a Nadeem-Shravan tape" },
  { url: era5.url, alt: "2000s: a family sharing earphones from an MP3 player at sunset" },
  { url: era6.url, alt: "2010s: a family at night arriving in Satara, sharing earphones from a smartphone" },
];
