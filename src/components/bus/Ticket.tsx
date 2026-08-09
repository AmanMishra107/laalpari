import { stops, type Stop } from "@/data/journey";

export function Ticket({
  stop,
  index,
  onSecret,
}: {
  stop: Stop;
  index: number;
  onSecret: () => void;
}) {
  const date = new Date().toLocaleDateString("en-GB");
  return (
    <div className="ticket-paper w-[10.5rem] rotate-[-1.2deg] px-2.5 py-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-ink/60">
          ST · MH ROADWAYS
        </span>
        <span className="font-mono text-[7px] tracking-[0.2em] text-ink/40">ST-06</span>
      </div>
      <p className="mt-1 font-display text-[13px] leading-none font-bold text-lalpari">
        {stops[0]!.name} → {stop.name}
      </p>
      <dl className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-[2px] font-mono text-[7.5px] uppercase tracking-[0.14em] text-ink/55">
        <dt>Passenger</dt>
        <dd className="text-right text-ink/80">WINDOW SEAT</dd>
        <dt>Date</dt>
        <dd className="text-right text-ink/80">{date}</dd>
        <dt>Stage</dt>
        <dd className="text-right text-ink/80">{String(index + 1).padStart(2, "0")}/06</dd>
        <dt>Fare</dt>
        <dd className="text-right text-ink/80">₹ {stop.fareTo}</dd>
      </dl>
      <button
        onClick={onSecret}
        className="mt-1.5 w-full border-t border-dashed border-ink/25 pt-1 text-left font-mono text-[7px] tracking-[0.2em] text-ink/35 hover:text-lalpari"
      >
        तिकीट जपून ठेवा.
      </button>
    </div>
  );
}
