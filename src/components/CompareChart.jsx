import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GAME, MANUAL_PER_SEC } from "../data.js";
import { Counter, prefersReducedMotion } from "./primitives.jsx";
import { useSite } from "../site-context.jsx";

const W = 720;
const H = 392;
const M = { l: 52, r: 28, t: 24, b: 64 };

/* One shift, the same arrivals the Ops Room game uses, handled two ways.
   Documents arrive faster as the shift goes on; a person clears them at a
   steady rate, the automated workers at a higher one. */
function simulate() {
  const T = GAME.SHIFT_MS / 1000;
  const dt = 0.25;
  const autoRate = (GAME.AGENTS * 1000) / GAME.AGENT_MS;
  let waitM = 0;
  let waitA = 0;
  let arrived = 0;
  let doneM = 0;
  let doneA = 0;
  const manual = [[0, 0]];
  const auto = [[0, 0]];
  for (let t = dt; t <= T + 1e-9; t += dt) {
    const gap = GAME.GAP_START + (GAME.GAP_END - GAME.GAP_START) * (t / T);
    const arr = (dt * 1000) / gap;
    arrived += arr;
    waitM += arr;
    waitA += arr;
    const sm = Math.min(waitM, MANUAL_PER_SEC * dt);
    const sa = Math.min(waitA, autoRate * dt);
    waitM -= sm;
    waitA -= sa;
    doneM += sm;
    doneA += sa;
    manual.push([t, waitM]);
    auto.push([t, waitA]);
  }
  return {
    T,
    manual,
    auto,
    arrived: Math.round(arrived),
    doneM: Math.round(doneM),
    doneA: Math.round(doneA),
    waitM: Math.round(waitM),
    waitA: Math.round(waitA),
  };
}

export default function CompareChart() {
  const { c } = useSite();
  const k = c.compare;
  const sim = useMemo(simulate, []);
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(prefersReducedMotion);

  useEffect(() => {
    if (drawn) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [drawn]);

  const peak = Math.max(...sim.manual.map((p) => p[1]));
  const yMax = Math.max(10, Math.ceil(peak / 10) * 10);
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;
  const x = (t) => M.l + (t / sim.T) * iw;
  const y = (v) => M.t + ih - (v / yMax) * ih;
  const line = (pts) => pts.map(([t, v], i) => `${i ? "L" : "M"}${x(t).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const manualPath = line(sim.manual);
  const autoPath = line(sim.auto);
  const areaPath = `${manualPath} L${x(sim.T)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const yTicks = [0, 1, 2, 3, 4].map((i) => Math.round((yMax / 4) * i));
  const xTicks = [0, 10, 20, 30].filter((s) => s <= sim.T);
  const end = sim.manual[sim.manual.length - 1];

  return (
    <section className="kdx-sec kdx-compare" id="compare">
      <div className="kdx-wrap">
        <header className="kdx-sec-head" data-reveal>
          <p className="kdx-eyebrow">{k.eyebrow}</p>
          <h2 className="kdx-h2">{k.heading}</h2>
          <p className="kdx-sec-lede">{k.lede}</p>
        </header>

        <div className={`kdx-cmp ${drawn ? "is-drawn" : ""}`} ref={ref}>
          <figure className="kdx-cmp-chart" dir="ltr">
            <figcaption className="kdx-cmp-legend">
              <span className="is-manual">{k.manual}</span>
              <span className="is-auto">{k.auto}</span>
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={k.chartAria}>
              <defs>
                <linearGradient id="kdx-cmp-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ff9e9e" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#ff9e9e" stopOpacity="0" />
                </linearGradient>
              </defs>

              {yTicks.map((v) => (
                <g key={v}>
                  <line className="kdx-cmp-grid" x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
                  <text className="kdx-cmp-tick" x={M.l - 12} y={y(v) + 4} textAnchor="end">
                    {v}
                  </text>
                </g>
              ))}
              {xTicks.map((s) => (
                <text key={s} className="kdx-cmp-tick" x={x(s)} y={H - M.b + 26} textAnchor="middle">
                  {s}
                </text>
              ))}
              <text className="kdx-cmp-axis" x={M.l + iw / 2} y={H - 6} textAnchor="middle">
                {k.xLabel}
              </text>
              <text className="kdx-cmp-axis" x={M.l} y={14} textAnchor="start">
                {k.yLabel}
              </text>

              <path className="kdx-cmp-area" d={areaPath} fill="url(#kdx-cmp-area)" />
              <path className="kdx-cmp-line is-manual" d={manualPath} pathLength="1" />
              <path className="kdx-cmp-line is-auto" d={autoPath} pathLength="1" />

              <g className="kdx-cmp-ends">
                <circle className="is-manual" cx={x(end[0])} cy={y(end[1])} r="6" />
                <circle className="is-auto" cx={x(end[0])} cy={y(0)} r="6" />
              </g>
            </svg>
          </figure>

          <div className="kdx-cmp-side">
            <article className="kdx-cmp-card is-manual">
              <p className="kdx-cmp-card-label">{k.manual}</p>
              <p className="kdx-cmp-big" dir="ltr">
                <Counter value={sim.doneM} />
                <span> / {sim.arrived}</span>
              </p>
              <p className="kdx-cmp-card-note">{k.handled}</p>
              <p className="kdx-cmp-small">
                <strong>
                  <Counter value={sim.waitM} />
                </strong>{" "}
                {k.stillWaiting}
              </p>
            </article>

            <article className="kdx-cmp-card is-auto">
              <p className="kdx-cmp-card-label">{k.auto}</p>
              <p className="kdx-cmp-big" dir="ltr">
                <Counter value={sim.doneA} />
                <span> / {sim.arrived}</span>
              </p>
              <p className="kdx-cmp-card-note">{k.handled}</p>
              <p className="kdx-cmp-small">
                <strong>
                  <Counter value={sim.waitA} />
                </strong>{" "}
                {k.stillWaiting}
              </p>
            </article>
          </div>
        </div>

        <div className="kdx-cmp-foot" data-reveal>
          <p className="kdx-cmp-note">{k.note}</p>
          <Link className="kdx-btn" to="/game">
            {k.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
