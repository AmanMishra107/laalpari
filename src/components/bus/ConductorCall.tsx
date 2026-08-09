export function ConductorCall({ text }: { text: string | null }) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute left-1/2 top-[14%] z-40 -translate-x-1/2 transition-all duration-500 ${
        text ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <span className="rounded-full border border-lalpari/30 bg-cream/90 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-lalpari shadow-[0_10px_30px_-18px_oklch(0.3_0.1_30)]">
        {text ?? ""}
      </span>
    </div>
  );
}
