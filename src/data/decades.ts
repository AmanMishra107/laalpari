export type Track = {
  title: string;
  artist: string;
  /** Optional explicit Spotify track ID. When absent, the track is resolved via search. */
  spotifyId?: string;
};

export type Decade = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  routeLabel: string;
  route: string;
  departure: string;
  description: string;
  /** Optional Spotify playlist ID powering this decade. */
  playlistId?: string;
  tracks: Track[];
};


export const decades: Decade[] = [
  {
    id: "60s",
    label: "60s",
    title: "Golden Highway",
    subtitle: "Black & white roads, technicolor hearts",
    routeLabel: "ROUTE 60s",
    route: "MUMBAI → NASHIK",
    departure: "06:15",
    description: "Slow ghats, transistor radio, morning fog.",
    playlistId: "6mx7rVYF6ed2JTMegQ8SY0",

    tracks: [
      { title: "Lag Ja Gale", artist: "Lata Mangeshkar" },
      { title: "Aaja Aaja Main Hoon Pyar Tera", artist: "Mohammed Rafi" },
      { title: "Yeh Raat Yeh Chandni Phir Kahan", artist: "Sahir Ludhianvi" },
      { title: "Gaata Rahe Mera Dil", artist: "Kishore Kumar" },
      { title: "Aap Ki Nazron Ne Samjha", artist: "Lata Mangeshkar" },
      { title: "Ehsaan Tera Hoga Mujh Par", artist: "Mohammed Rafi" },
    ],
  },
  {
    id: "70s",
    label: "70s",
    title: "Radio Window",
    subtitle: "Dust, disco and diesel",
    routeLabel: "ROUTE 70s",
    route: "PUNE → KOLHAPUR",
    departure: "09:40",
    description: "Bell bottoms at the bus stand.",
    playlistId: "1arIwnl806bdxvrgTEuvLw",
    tracks: [
      { title: "Dum Maro Dum", artist: "Asha Bhosle" },
      { title: "Mere Sapno Ki Rani", artist: "Kishore Kumar" },
      { title: "Yeh Sham Mastani", artist: "Kishore Kumar" },
      { title: "Kabhi Kabhie Mere Dil Mein", artist: "Mukesh" },
      { title: "Piya Tu Ab To Aaja", artist: "Asha Bhosle" },
      { title: "Chura Liya Hai Tumne", artist: "Asha Bhosle" },
    ],
  },
  {
    id: "80s",
    playlistId: "37i9dQZF1DX3NU3NvyoJUz",
    label: "80s",
    title: "Chai Stop Classics",
    subtitle: "Cassette rewound with a pencil",
    routeLabel: "ROUTE 80s",
    route: "NASHIK → AURANGABAD",
    departure: "13:05",
    description: "Twenty minutes halt. Vada pav and Kishore.",
    tracks: [
      { title: "Tum Se Milke", artist: "Shabbir Kumar" },
      { title: "Ek Do Teen", artist: "Alka Yagnik" },
      { title: "Dekha Ek Khwab", artist: "Kishore Kumar" },
      { title: "Tujhe Dekha To", artist: "Lata Mangeshkar" },
      { title: "Yaad Aa Rahi Hai", artist: "Lata Mangeshkar" },
      { title: "Sagar Kinare", artist: "Kishore Kumar" },
    ],
  },
  {
    id: "90s",
    playlistId: "0Gd0yQzB6wttuaLlawHlYI",
    label: "90s",
    title: "Last Seat Legends",
    subtitle: "The window seat anthem era",
    routeLabel: "ROUTE 90s",
    route: "MUMBAI → PUNE",
    departure: "20:47",
    description: "Kumar Sanu on a rattling last seat.",
    tracks: [
      { title: "Mujhse Mohabbat Ka Ikrar", artist: "Kumar Sanu" },
      { title: "Pehla Nasha", artist: "Udit Narayan" },
      { title: "Aaye Ho Meri Zindagi Mein", artist: "Udit Narayan" },
      { title: "Dheere Dheere Se Meri Zindagi", artist: "Kumar Sanu" },
      { title: "Tadap Tadap", artist: "KK" },
      { title: "Chura Ke Dil Mera", artist: "Kumar Sanu" },
      { title: "Jaadu Teri Nazar", artist: "Udit Narayan" },
    ],
  },
  {
    id: "00s",
    playlistId: "6wVv6RynspgsuFVpzUigDu",
    label: "00s",
    title: "College Bus",
    subtitle: "Nokia ringtone nostalgia",
    routeLabel: "ROUTE 00s",
    route: "PUNE → SATARA",
    departure: "17:20",
    description: "Shared earphones, one song, two friends.",
    tracks: [
      { title: "Kal Ho Naa Ho", artist: "Sonu Nigam" },
      { title: "Tum Se Hi", artist: "Mohit Chauhan" },
      { title: "Bheegi Bheegi", artist: "James" },
      { title: "Yeh Ishq Hai", artist: "Shreya Ghoshal" },
      { title: "Kabhi Kabhi Aditi", artist: "Rashid Ali" },
      { title: "Woh Lamhe", artist: "Atif Aslam" },
    ],
  },
  {
    id: "10s",
    playlistId: "37i9dQZF1DWVDvBpGQbzXj",
    label: "10s",
    title: "Window Seat Diaries",
    subtitle: "Headphones in, world out",
    routeLabel: "ROUTE 10s",
    route: "MUMBAI → RATNAGIRI",
    departure: "22:10",
    description: "Night bus, ghat turns, playlist on repeat.",
    tracks: [
      { title: "Ilahi", artist: "Arijit Singh" },
      { title: "Agar Tum Saath Ho", artist: "Arijit Singh" },
      { title: "Phir Le Aya Dil", artist: "Arijit Singh" },
      { title: "Kabira", artist: "Tochi Raina" },
      { title: "Moh Moh Ke Dhaage", artist: "Papon" },
      { title: "Tum Hi Ho", artist: "Arijit Singh" },
    ],
  },
  {
    id: "20s",
    label: "20s",
    title: "New Route",
    subtitle: "Same window, new songs",
    routeLabel: "ROUTE 20s",
    route: "PUNE → MUMBAI",
    departure: "05:30",
    description: "The road changed. The seat didn't.",
    tracks: [
      { title: "Kesariya", artist: "Arijit Singh" },
      { title: "Tere Vaaste", artist: "Varun Jain" },
      { title: "Apna Bana Le", artist: "Arijit Singh" },
      { title: "Heeriye", artist: "Jasleen Royal" },
      { title: "Chaleya", artist: "Arijit Singh" },
      { title: "Satranga", artist: "Arijit Singh" },
    ],
  },
];

export const defaultDecadeId = "60s";

export function getDecade(id: string): Decade {
  return decades.find((d) => d.id === id) ?? decades[0]!;
}
