import { decades } from "@/data/decades";

export function DecadeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Select a decade"
      className="flex max-w-full items-center gap-1 overflow-x-auto"
    >
      {decades.map((d) => {
        const active = d.id === value;
        return (
          <button
            key={d.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(d.id)}
            className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
              active
                ? "bg-lalpari text-cream"
                : "text-ink/60 hover:text-ink underline-offset-4 hover:underline"
            }`}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
