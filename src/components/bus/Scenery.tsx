import { useMemo } from "react";
import type { Stop } from "@/data/journey";

/** Builds a tiling SVG band as a CSS url(). Kept intentionally naive/hand-drawn. */
function band(inner: string, w = 400, h = 200) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${inner}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function hills(color: string, big: boolean) {
  const d = big
    ? "M0,200 L0,120 C40,60 80,52 120,96 C160,140 190,60 240,74 C290,88 320,40 360,88 L400,120 L400,200 Z"
    : "M0,200 L0,150 C50,120 90,132 140,150 C190,168 240,118 300,140 C340,155 370,146 400,158 L400,200 Z";
  return band(`<path d='${d}' fill='${color}'/>`);
}

function trees(color: string, count: number) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = (i * 400) / Math.max(count, 1) + ((i * 37) % 19);
    const h = 46 + ((i * 23) % 40);
    s += `<path d='M${x},200 L${x},${200 - h}' stroke='${color}' stroke-width='3'/>`;
    s += `<ellipse cx='${x}' cy='${200 - h}' rx='${12 + (i % 5) * 2}' ry='${14 + (i % 4) * 3}' fill='${color}'/>`;
  }
  return band(s);
}

function buildings(color: string, count: number) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = (i * 400) / Math.max(count, 1);
    const w = 26 + ((i * 13) % 22);
    const h = 50 + ((i * 29) % 70);
    s += `<rect x='${x}' y='${200 - h}' width='${w}' height='${h}' fill='${color}'/>`;
    for (let k = 0; k < 3; k++)
      s += `<rect x='${x + 5 + k * 8}' y='${208 - h}' width='4' height='6' fill='rgba(255,235,190,0.5)'/>`;
  }
  return band(s);
}

function poles(color: string, count: number, lamp: boolean) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = (i * 400) / Math.max(count, 1) + 10;
    s += `<path d='M${x},200 L${x},40' stroke='${color}' stroke-width='4'/>`;
    s += `<path d='M${x - 16},52 L${x + 16},52' stroke='${color}' stroke-width='3'/>`;
    s += `<path d='M${x + 16},56 C${x + 120},70 ${x + 260},70 ${x + 400},56' stroke='${color}' stroke-width='1.6' fill='none' opacity='0.7'/>`;
    if (lamp)
      s += `<ellipse cx='${x + 14}' cy='46' rx='9' ry='6' fill='rgba(255,214,130,0.85)'/>`;
  }
  return band(s);
}

export function Scenery({
  stop,
  moving,
  speed,
}: {
  stop: Stop;
  moving: boolean;
  speed: number; // 0 = parked, 1 = full road speed
}) {
  const p = stop.palette;
  const layers = useMemo(
    () => ({
      far: hills(p.hillFar, true),
      near: hills(p.hillNear, false),
      tree: trees(p.hillNear, stop.density.trees),
      built: buildings(p.ground, stop.density.buildings),
      pole: poles(p.ground, stop.density.poles, stop.density.lamps > 3),
    }),
    [p.hillFar, p.hillNear, p.ground, stop.density],
  );

  const dur = (base: number) => `${base / Math.max(speed, 0.06)}s`;

  return (
    <div
      className="window-portal absolute right-0 top-[2%] h-[84%] w-[34%] overflow-hidden md:w-[22%]"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(${p.skyTop}, ${p.skyBottom})` }}
      />
      <div
        className="scene-layer absolute inset-x-0 bottom-[18%] h-[62%] opacity-90"
        style={{ backgroundImage: layers.far, animationDuration: dur(70) }}
      />
      <div
        className="scene-layer absolute inset-x-0 bottom-[14%] h-[52%]"
        style={{ backgroundImage: layers.near, animationDuration: dur(36) }}
      />
      <div
        className="scene-layer absolute inset-x-0 bottom-[12%] h-[46%] opacity-95"
        style={{ backgroundImage: layers.built, animationDuration: dur(18) }}
      />
      <div
        className="scene-layer absolute inset-x-0 bottom-[10%] h-[54%]"
        style={{ backgroundImage: layers.tree, animationDuration: dur(9) }}
      />
      <div
        className="scene-layer absolute inset-x-0 bottom-[6%] h-[70%]"
        style={{ backgroundImage: layers.pole, animationDuration: dur(4.5) }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[16%]"
        style={{ background: `linear-gradient(${p.ground}, oklch(0.3 0.03 50))` }}
      />
      {/* motion blur while travelling */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: moving ? 0.45 : 0,
          backdropFilter: "blur(1.4px)",
          WebkitBackdropFilter: "blur(1.4px)",
        }}
      />
      {stop.weather === "rain" && <div className="rain-veil absolute inset-0" />}
      {(stop.weather === "haze" || stop.weather === "rain") && (
        <div className="absolute inset-0 bg-gradient-to-t from-cream/25 via-cream/10 to-cream/35" />
      )}
      {stop.weather === "night" && (
        <div className="absolute inset-0 bg-[oklch(0.2_0.04_265)]/35" />
      )}
      {/* glass */}
      <div className="window-glass pointer-events-none absolute inset-0" />
    </div>
  );
}
