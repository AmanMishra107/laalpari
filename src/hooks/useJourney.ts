import { useCallback, useEffect, useRef, useState } from "react";
import { stops } from "@/data/journey";

export type Phase = "intro" | "resting" | "accel" | "cruise" | "brake" | "arriving";

const TIMING: Record<Exclude<Phase, "intro" | "resting">, number> = {
  accel: 750,
  cruise: 1100,
  brake: 750,
  arriving: 550,
};

export function useJourney() {
  const [phase, setPhase] = useState<Phase>("resting");
  const [index, setIndex] = useState(0);
  /** stop we are driving toward, null while resting */
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [announce, setAnnounce] = useState<string | null>(null);
  const [reverseTrip, setReverseTrip] = useState(false);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((res) => {
        const t = setTimeout(res, ms);
        timers.current.push(t);
      }),
    [],
  );

  const showAnnounce = useCallback(
    (text: string) => {
      setAnnounce(text);
      const t = setTimeout(() => setAnnounce(null), 3200);
      timers.current.push(t);
    },
    [],
  );

  const depart = useCallback(() => {
    setPhase("resting");
    showAnnounce(stops[0]!.announce);
  }, [showAnnounce]);

  const travelTo = useCallback(
    async (target: number, opts?: { skip?: boolean }) => {
      if (busy.current) return;
      if (target === index || target < 0 || target > stops.length - 1) return;
      busy.current = true;
      const step = target > index ? 1 : -1;
      setDirection(step);
      if (step === -1) setReverseTrip(true);

      const legs = opts?.skip ? [target] : rangeTo(index, target, step);
      let from = index;
      for (const leg of legs) {
        setNextIndex(leg);
        setPhase("accel");
        await wait(TIMING.accel);
        setPhase("cruise");
        await wait(opts?.skip ? TIMING.cruise * 1.4 : TIMING.cruise);
        setPhase("brake");
        await wait(TIMING.brake);
        setIndex(leg);
        setNextIndex(null);
        setPhase("arriving");
        showAnnounce(stops[leg]!.announce);
        await wait(TIMING.arriving);
        setPhase("resting");
        from = leg;
      }
      void from;
      busy.current = false;
    },
    [index, showAnnounce, wait],
  );

  const restart = useCallback(() => {
    void travelTo(0);
  }, [travelTo]);

  const moving = phase === "accel" || phase === "cruise" || phase === "brake";

  return {
    phase,
    moving,
    index,
    nextIndex,
    direction,
    announce,
    reverseTrip,
    stop: stops[index]!,
    depart,
    travelTo,
    restart,
  };
}

function rangeTo(from: number, to: number, step: 1 | -1) {
  const out: number[] = [];
  for (let i = from + step; step === 1 ? i <= to : i >= to; i += step) out.push(i);
  return out;
}
