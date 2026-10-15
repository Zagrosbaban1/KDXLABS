import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GAME } from "../data.js";
import { Radar, prefersReducedMotion } from "../components/primitives.jsx";
import { useSectionLink, useSite } from "../site-context.jsx";

function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSchedule(seed) {
  const rand = mulberry32(seed);
  const items = [];
  let at = 400;
  let id = 0;
  while (at < GAME.SHIFT_MS) {
    items.push({ id: id++, at, type: Math.floor(rand() * GAME.DOC_TYPES) });
    const progress = at / GAME.SHIFT_MS;
    const gap = GAME.GAP_START + (GAME.GAP_END - GAME.GAP_START) * progress;
    at += gap * (0.7 + rand() * 0.6);
  }
  return items;
}

const emptyRun = () => ({ processed: 0, breached: 0, handledMs: 0, perSecond: [] });

export default function Game() {
  const { c, t, nameRef } = useSite();
  const sectionLink = useSectionLink();
  const g = c.game;

  /* one workload for the whole visit */
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const schedule = useMemo(() => buildSchedule(seed), [seed]);

  const [phase, setPhase] = useState("intro"); // intro | manual | handoff | auto | result
  const [elapsed, setElapsed] = useState(0);
  const [queue, setQueue] = useState([]);
  const [live, setLive] = useState(emptyRun());
  const [runs, setRuns] = useState({ manual: null, auto: null });

  /* mutable game state, the tick reads and writes this, React renders it */
  const state = useRef({ startedAt: 0, spawned: 0, credit: 0, run: emptyRun(), queue: [] });
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const running = phase === "manual" || phase === "auto";

  const begin = useCallback((next) => {
    state.current = { startedAt: performance.now(), spawned: 0, credit: 0, run: emptyRun(), queue: [] };
    setQueue([]);
    setLive(emptyRun());
    setElapsed(0);
    setPhase(next);
  }, []);

  /* the process action, the only thing the player does in shift one */
  const process = useCallback(
    (id) => {
      const s = state.current;
      const idx = s.queue.findIndex((item) => item.id === id);
      if (idx === -1) return;
      const [item] = s.queue.splice(idx, 1);
      const now = performance.now() - s.startedAt;
      s.run.processed += 1;
      s.run.handledMs += now - item.at;
      const bucket = Math.floor(now / 1000);
      s.run.perSecond[bucket] = (s.run.perSecond[bucket] || 0) + 1;
      setQueue([...s.queue]);
      setLive({ ...s.run, perSecond: [...s.run.perSecond] });
    },
    []
  );

  /* the clock */
  useEffect(() => {
    if (!running) return undefined;
    const auto = phase === "auto";

    const id = window.setInterval(() => {
      const s = state.current;
      const now = performance.now() - s.startedAt;

      /* arrivals due since the last tick */
      while (s.spawned < schedule.length && schedule[s.spawned].at <= now) {
        s.queue.push({ ...schedule[s.spawned] });
        s.spawned += 1;
      }

      /* SLA breaches leave the queue and are counted against the shift */
      for (let i = s.queue.length - 1; i >= 0; i -= 1) {
        if (now - s.queue[i].at > GAME.SLA_MS) {
          s.queue.splice(i, 1);
          s.run.breached += 1;
        }
      }

      /* the automated shift clears work itself, at a steady rate */
      if (auto) {
        s.credit += (GAME.TICK_MS / GAME.AGENT_MS) * GAME.AGENTS;
        while (s.credit >= 1 && s.queue.length) {
          const item = s.queue.shift();
          s.credit -= 1;
          s.run.processed += 1;
          s.run.handledMs += now - item.at;
          const bucket = Math.floor(now / 1000);
          s.run.perSecond[bucket] = (s.run.perSecond[bucket] || 0) + 1;
        }
        if (!s.queue.length) s.credit = Math.min(s.credit, 1);
      }

      setQueue([...s.queue]);
      setLive({ ...s.run, perSecond: [...s.run.perSecond] });
      setElapsed(Math.min(now, GAME.SHIFT_MS));

      if (now >= GAME.SHIFT_MS) {
        window.clearInterval(id);
        const finished = { ...s.run, perSecond: [...s.run.perSecond] };
        setRuns((prev) => ({ ...prev, [auto ? "auto" : "manual"]: finished }));
        setPhase(auto ? "result" : "handoff");
      }
    }, GAME.TICK_MS);

    return () => window.clearInterval(id);
  }, [running, phase, schedule]);

  const secondsLeft = Math.max(0, Math.ceil((GAME.SHIFT_MS - elapsed) / 1000));
  const avgOf = (run) => (run && run.processed ? Math.round(run.handledMs / run.processed) / 1000 : 0);

  return (
    <>
      {/* page head */}
      <header className="kdx-page-head">
        <div className="kdx-page-head-radar" aria-hidden="true">
          <Radar spin={!reduced} />
        </div>
        <div className="kdx-wrap kdx-page-head-inner">
          <p className="kdx-eyebrow kdx-in" style={{ "--d": "0.05s" }}>
            {g.eyebrow}
          </p>
          <h1 className="kdx-page-title kdx-in" style={{ "--d": "0.15s" }}>
            {g.heading}
          </h1>
          <p className="kdx-page-lede kdx-in" style={{ "--d": "0.3s" }}>
            {g.lede}
          </p>
        </div>
      </header>

      <section className="kdx-sec kdx-game-sec">
        <div className="kdx-wrap">
          {/* the machine */}
          <div className={`kdx-game ${running ? "is-running" : ""} ${phase === "auto" ? "is-auto" : ""}`}>
            {/* HUD */}
            <div className="kdx-game-hud">
              <p className="kdx-game-shift">
                <span className={`kdx-game-dot ${running ? "is-live" : ""}`} aria-hidden="true" />
                {phase === "auto" || phase === "result"
                  ? g.autoLong
                  : phase === "intro"
                    ? g.howToTitle
                    : g.manualLong}
              </p>
              {running && (
                <p className="kdx-game-clock">
                  <span className="kdx-game-clock-label">{g.timeLeft}</span>
                  <strong>{t(g.seconds, { n: secondsLeft })}</strong>
                </p>
              )}
            </div>

            {/* live dashboard: the data-analytics half of the pitch */}
            <dl className="kdx-game-stats">
              <div>
                <dt>{g.stats.processed}</dt>
                <dd className="kdx-game-stat-good">{live.processed}</dd>
              </div>
              <div>
                <dt>{g.stats.backlog}</dt>
                <dd className={queue.length > GAME.BACKLOG_WARN ? "kdx-game-stat-warn" : ""}>{queue.length}</dd>
              </div>
              <div>
                <dt>{g.stats.breached}</dt>
                <dd className={live.breached ? "kdx-game-stat-bad" : ""}>{live.breached}</dd>
              </div>
              <div>
                <dt>{g.stats.avg}</dt>
                <dd>{t(g.seconds, { n: avgOf(live).toFixed(1) })}</dd>
              </div>
            </dl>

            <Throughput data={live.perSecond} label={g.chartLabel} seconds={GAME.SHIFT_MS / 1000} />

            {/* the queue */}
            {phase === "intro" && (
              <div className="kdx-game-panel">
                <ol className="kdx-game-how">
                  {g.howTo.map((step, i) => (
                    <li key={i}>{t(step, { sla: GAME.SLA_MS / 1000 })}</li>
                  ))}
                </ol>
                <p className="kdx-game-fair">{g.fairNote}</p>
                <button type="button" className="kdx-btn" onClick={() => begin("manual")}>
                  {g.start}
                </button>
              </div>
            )}

            {phase === "handoff" && (
              <div className="kdx-game-panel">
                <h2 className="kdx-game-panel-title">{g.handoffHeading}</h2>
                <p>{g.handoffBody}</p>
                <button type="button" className="kdx-btn" onClick={() => begin("auto")}>
                  {g.deploy}
                </button>
              </div>
            )}

            {running && (
              <>
                <p className="kdx-game-queue-label">
                  {g.queueLabel}
                  {phase === "auto" && (
                    <span className="kdx-game-agents">
                      {g.agentsLabel}: <strong>{GAME.AGENTS}</strong>
                    </span>
                  )}
                </p>
                <ul className="kdx-game-queue" aria-label={g.liveAria}>
                  {queue.slice(0, GAME.VISIBLE).map((item) => {
                    const age = (elapsed - item.at) / 1000;
                    const urgency = Math.min(1, age / (GAME.SLA_MS / 1000));
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`kdx-game-doc ${urgency > 0.66 ? "is-urgent" : ""}`}
                          style={{ "--urgency": urgency.toFixed(2) }}
                          onClick={() => process(item.id)}
                          disabled={phase === "auto"}
                          aria-label={t(g.processAria, {
                            type: g.docTypes[item.type],
                            secs: Math.max(0, age).toFixed(0),
                          })}
                        >
                          <span className="kdx-game-doc-type">{g.docTypes[item.type]}</span>
                          <span className="kdx-game-doc-age" aria-hidden="true">
                            {Math.max(0, age).toFixed(1)}s
                          </span>
                          <span className="kdx-game-doc-bar" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                  {!queue.length && <li className="kdx-game-empty">{g.queueEmpty}</li>}
                </ul>
                {queue.length > GAME.VISIBLE && (
                  <p className="kdx-game-overflow">{t(g.queueOverflow, { n: queue.length - GAME.VISIBLE })}</p>
                )}
              </>
            )}

            {phase === "result" && (
              <Result
                g={g}
                t={t}
                runs={runs}
                avgOf={avgOf}
                onReplay={() => begin("manual")}
                sectionLink={sectionLink}
                nameRef={nameRef}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Throughput({ data, label, seconds }) {
  const dense = Array.from({ length: seconds }, (_, i) => data[i] || 0);
  const peak = Math.max(4, ...dense);
  const pts = dense
    .map((v, i) => {
      const x = (i / (seconds - 1)) * 100;
      const y = 100 - (v / peak) * 100;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <figure className="kdx-game-chart">
      <figcaption>{label}</figcaption>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={label}>
        <line x1="0" y1="100" x2="100" y2="100" className="kdx-game-chart-axis" />
        <polyline points={pts} className="kdx-game-chart-line" />
      </svg>
    </figure>
  );
}

/* results */
function Result({ g, t, runs, avgOf, onReplay, sectionLink, nameRef }) {
  const { manual, auto } = runs;
  if (!manual || !auto) return null;

  const rows = [
    { label: g.resultProcessed, m: manual.processed, a: auto.processed, better: "high" },
    { label: g.resultBreached, m: manual.breached, a: auto.breached, better: "low" },
    {
      label: g.resultAvg,
      m: avgOf(manual).toFixed(1),
      a: avgOf(auto).toFixed(1),
      better: "low",
      unit: true,
    },
  ];

  const gained = auto.processed - manual.processed;
  const saved = manual.breached - auto.breached;

  return (
    <div className="kdx-game-result">
      <h2 className="kdx-game-panel-title">{g.resultHeading}</h2>
      <p className="kdx-game-result-lead">{g.resultLead}</p>

      <table className="kdx-game-table">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">{g.manualLabel}</th>
            <th scope="col">{g.autoLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.unit ? t(g.seconds, { n: r.m }) : r.m}</td>
              <td className="kdx-game-table-auto">{r.unit ? t(g.seconds, { n: r.a }) : r.a}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="kdx-game-verdict">
        {gained > 0 ? t(g.verdictBetter, { n: gained, b: Math.max(0, saved) }) : g.verdictEqual}
      </p>

      <p className="kdx-game-closing">{g.closingLead}</p>

      <div className="kdx-game-actions">
        <a className="kdx-btn" {...sectionLink("contact", { focus: nameRef })}>
          {g.cta}
        </a>
        <button type="button" className="kdx-btn kdx-btn-outline" onClick={onReplay}>
          {g.replay}
        </button>
      </div>
    </div>
  );
}
