import { ArrowUpRight } from "lucide-react";
import { useLiveViewers } from "@/hooks/useLiveViewers";

export function TopBar({
  clock,
  connected,
  onConnect,
}: {
  clock: string;
  connected: boolean;
  onConnect: () => void;
}) {
  const travelling = useLiveViewers();

  return (
    <div className="topbar-glass flex h-9 w-full items-center gap-4 px-4">
      <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums text-white/90">
        {clock}
      </span>

      <div className="flex flex-1 items-center justify-center gap-2">
        <span
          className="size-2 rounded-full bg-[oklch(0.78_0.19_145)] shadow-[0_0_8px_2px_oklch(0.78_0.19_145/0.55)]"
          aria-hidden
        />
        <span className="text-[12px] font-semibold text-white tabular-nums">{travelling}</span>
        <span className="text-[12px] text-white/70">travelling</span>
      </div>

      <button
        onClick={onConnect}
        className="flex shrink-0 items-center gap-1.5 text-[12px] text-white/85 transition-colors hover:text-white"
      >
        <span className="grid size-4 place-items-center rounded-full bg-white/90 text-[9px] font-bold text-black">
          S
        </span>
        {connected ? "Connected" : "Spotify"}
        <ArrowUpRight className="size-3 opacity-70" />
      </button>
    </div>
  );
}
