import { useEffect, useState } from "react";

const shayaris = [
  "तेरी यादें अब भी रात की खामोशी में धड़कती हैं, जैसे पुराने गानों में छुपी कोई धुन।",
  "मोहब्बत का सफर था, तू मंज़िल बनकर रह गया और हम रास्ते में ही खो गए।",
  "कुछ रिश्ते ऐसे होते हैं जो वक़्त की धूल में भी खोते नहीं, बस दिल के कोने में बस जाते हैं।",
  "तेरे जाने के बाद भी ये दिल तुझी से मोहब्बत करता है, शायद आदत से ज़्यादा वफ़ा है।",
  "रातें गुज़र जाती हैं, पर तेरी कमी सुबह तक रहती है, जैसे कोई अधूरा ख्वाब।",
  "एक तेरा इंतज़ार था, जो उम्र भर कंवारा रह गया और मोहब्बत बूढ़ी हो गई।",
  "तेरी आँखों में डूबने का ख्वाब अब भी पूरा नहीं हुआ, शायद किसी और जनम का वादा था।",
  "मोहब्बत में धोखा मिला तो क्या, हम तो फिर भी तुझे चाहते रहे, बेपनाह और बेशर्त।",
  "वो लम्हा कभी वापस नहीं आएगा जब तू मेरे पास था और दुनिया दूर लगती थी।",
  "दिल तोड़ कर जाने वाले, कभी मोहब्बत का मतलब समझ पाओगे जब तुम्हें भी कोई यूँ ही छोड़ जाएगा।",
];

const TRANSITION_MS = 700;
const DISPLAY_MS = 15000;

export function ShayariTicker() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [phase, setPhase] = useState<"hold" | "exit">("hold");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = window.setInterval(() => {
      setPhase("exit");
    }, DISPLAY_MS);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const timer = window.setTimeout(() => {
      setCurrent(next);
      setNext((n) => (n + 1) % shayaris.length);
      setPhase("hold");
    }, TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [phase, next]);

  const base =
    "font-display text-[15px] leading-relaxed tracking-wide text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)] transition-all duration-700 ease-in-out";

  return (
    <div
      aria-live="polite"
      className="relative mx-auto h-14 w-full max-w-lg px-6 text-center"
    >
      <p
        className={`absolute inset-x-6 top-0 ${base} ${
          mounted && phase === "hold" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        {shayaris[current]}
      </p>
      <p
        className={`absolute inset-x-6 top-0 ${base} ${
          mounted && phase === "exit" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {shayaris[next]}
      </p>
    </div>
  );
}
