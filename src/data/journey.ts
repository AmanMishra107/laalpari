export type Weather = "clear" | "haze" | "rain" | "dusk" | "night";

export type Memory = {
  /** left % / top % inside the poster */
  x: number;
  y: number;
  glyph: string;
  label: string;
  reply: string;
};

export type Stop = {
  id: string;
  /** stop number, 1-indexed */
  no: number;
  name: string;
  nameMr: string;
  noMr: string;
  /** decades reachable from this stop (first one is the default) */
  decadeIds: string[];
  eraLabel: string;
  mood: string;
  lineMr: string;
  announce: string;
  /** era-defining listening device */
  tech: string;
  weather: Weather;
  fareTo: string;
  palette: {
    skyTop: string;
    skyBottom: string;
    hillFar: string;
    hillNear: string;
    ground: string;
    glow: string;
  };
  density: {
    buildings: number;
    trees: number;
    poles: number;
    lamps: number;
  };
  memories: Memory[];
};

export const stops: Stop[] = [
  {
    id: "pune",
    no: 1,
    name: "PUNE",
    nameMr: "पुणे",
    noMr: "थांबा ०१",
    decadeIds: ["60s"],
    eraLabel: "60s",
    mood: "The beginning.",
    lineMr: "प्रवास सुरू झाला.",
    announce: "पुणे... पुणे...",
    tech: "OLD RADIO",
    weather: "clear",
    fareTo: "0.00",
    palette: {
      skyTop: "oklch(0.88 0.08 78)",
      skyBottom: "oklch(0.95 0.06 88)",
      hillFar: "oklch(0.72 0.05 96)",
      hillNear: "oklch(0.62 0.07 92)",
      ground: "oklch(0.55 0.06 70)",
      glow: "oklch(0.86 0.15 84)",
    },
    density: { buildings: 9, trees: 3, poles: 7, lamps: 0 },
    memories: [
      { x: 12, y: 62, glyph: "◉", label: "Radio", reply: "आजची सकाळ. विविध भारती." },
      { x: 26, y: 78, glyph: "▤", label: "Newspaper", reply: "आजचा पेपर." },
    ],
  },
  {
    id: "katraj",
    no: 2,
    name: "KATRAJ",
    nameMr: "कात्रज",
    noMr: "थांबा ०२",
    decadeIds: ["70s"],
    eraLabel: "70s",
    mood: "The city disappears.",
    lineMr: "शहर मागे राहिलं.",
    announce: "कात्रज... पुढचा थांबा...",
    tech: "TRANSISTOR",
    weather: "haze",
    fareTo: "8.00",
    palette: {
      skyTop: "oklch(0.78 0.11 68)",
      skyBottom: "oklch(0.9 0.09 78)",
      hillFar: "oklch(0.6 0.07 140)",
      hillNear: "oklch(0.5 0.08 145)",
      ground: "oklch(0.48 0.07 60)",
      glow: "oklch(0.8 0.16 66)",
    },
    density: { buildings: 4, trees: 9, poles: 8, lamps: 1 },
    memories: [
      { x: 18, y: 55, glyph: "▭", label: "Transistor", reply: "बॅटरी संपत आलीये." },
      { x: 33, y: 72, glyph: "◠", label: "Tea glass", reply: "एक कटिंग." },
    ],
  },
  {
    id: "shirwal",
    no: 3,
    name: "SHIRWAL",
    nameMr: "शिरवळ",
    noMr: "थांबा ०३",
    decadeIds: ["80s"],
    eraLabel: "80s",
    mood: "The journey becomes longer.",
    lineMr: "रस्ता लांबतोय.",
    announce: "शिरवळ...",
    tech: "CASSETTE",
    weather: "clear",
    fareTo: "12.50",
    palette: {
      skyTop: "oklch(0.74 0.14 58)",
      skyBottom: "oklch(0.88 0.11 72)",
      hillFar: "oklch(0.62 0.08 128)",
      hillNear: "oklch(0.52 0.09 120)",
      ground: "oklch(0.5 0.09 62)",
      glow: "oklch(0.79 0.17 58)",
    },
    density: { buildings: 2, trees: 7, poles: 9, lamps: 1 },
    memories: [
      { x: 15, y: 58, glyph: "▥", label: "Cassette", reply: "PLAY SIDE A." },
      { x: 30, y: 80, glyph: "✂", label: "Paper ticket", reply: "तिकीट जपून ठेवा." },
    ],
  },
  {
    id: "wai",
    no: 4,
    name: "WAI",
    nameMr: "वाई",
    noMr: "थांबा ०४",
    decadeIds: ["90s"],
    eraLabel: "90s",
    mood: "The window seat era.",
    lineMr: "खिडकीतून जग वेगळंच दिसतं.",
    announce: "वाई...",
    tech: "WALKMAN",
    weather: "rain",
    fareTo: "18.00",
    palette: {
      skyTop: "oklch(0.55 0.04 200)",
      skyBottom: "oklch(0.74 0.04 180)",
      hillFar: "oklch(0.48 0.07 158)",
      hillNear: "oklch(0.38 0.08 152)",
      ground: "oklch(0.42 0.1 40)",
      glow: "oklch(0.83 0.16 88)",
    },
    density: { buildings: 1, trees: 11, poles: 6, lamps: 2 },
    memories: [
      { x: 16, y: 50, glyph: "❖", label: "Window", reply: "खिडकी उघडी ठेवायची?" },
      { x: 34, y: 66, glyph: "◎", label: "Headphones", reply: "RADIO ON." },
    ],
  },
  {
    id: "koregaon",
    no: 5,
    name: "KOREGAON",
    nameMr: "कोरेगाव",
    noMr: "थांबा ०५",
    decadeIds: ["00s"],
    eraLabel: "00s",
    mood: "The world begins changing.",
    lineMr: "काही गोष्टी बदलल्या.",
    announce: "कोरेगाव...",
    tech: "CD / NOKIA",
    weather: "dusk",
    fareTo: "24.50",
    palette: {
      skyTop: "oklch(0.42 0.09 292)",
      skyBottom: "oklch(0.68 0.12 42)",
      hillFar: "oklch(0.42 0.05 250)",
      hillNear: "oklch(0.34 0.05 260)",
      ground: "oklch(0.36 0.05 50)",
      glow: "oklch(0.82 0.15 72)",
    },
    density: { buildings: 6, trees: 5, poles: 8, lamps: 4 },
    memories: [
      { x: 20, y: 54, glyph: "▯", label: "Nokia", reply: "१ मिस्ड कॉल." },
      { x: 36, y: 74, glyph: "◍", label: "VCD shop", reply: "टॉप १० हिट्स." },
    ],
  },
  {
    id: "satara",
    no: 6,
    name: "SATARA",
    nameMr: "सातारा",
    noMr: "थांबा ०६",
    decadeIds: ["10s", "20s"],
    eraLabel: "TODAY",
    mood: "Arrival.",
    lineMr: "प्रवास संपला. गाणी नाही.",
    announce: "सातारा... शेवटचा थांबा.",
    tech: "SMARTPHONE",
    weather: "night",
    fareTo: "31.00",
    palette: {
      skyTop: "oklch(0.22 0.05 265)",
      skyBottom: "oklch(0.35 0.07 285)",
      hillFar: "oklch(0.28 0.04 265)",
      hillNear: "oklch(0.22 0.04 270)",
      ground: "oklch(0.24 0.03 60)",
      glow: "oklch(0.85 0.14 92)",
    },
    density: { buildings: 10, trees: 3, poles: 6, lamps: 9 },
    memories: [
      { x: 22, y: 52, glyph: "▮", label: "Smartphone", reply: "डाउनलोड केलेली गाणी." },
      { x: 38, y: 70, glyph: "✦", label: "Depot light", reply: "शेवटचा थांबा." },
    ],
  },
];

export function stopIndexOfDecade(decadeId: string): number {
  const i = stops.findIndex((s) => s.decadeIds.includes(decadeId));
  return i === -1 ? 0 : i;
}
