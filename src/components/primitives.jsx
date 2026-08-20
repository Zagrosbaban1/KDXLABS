import { useEffect, useRef, useState } from "react";
import { MARK_WHITE, MARK_BLUE } from "../assets.js";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------- logomark ---------------------------- */
export function Mark({ variant = "white", className = "" }) {
  return (
    <img
      src={variant === "blue" ? MARK_BLUE : MARK_WHITE}
      alt=""
      aria-hidden="true"
      className={`kdx-mark ${className}`}
    />
  );
}

/* --------------------------- radar motif --------------------------- */
export function Radar({ spin = true }) {
  const rings = [46, 108, 178, 256, 342, 436];
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className="kdx-radar" viewBox="-460 -460 920 920" aria-hidden="true">
      <g className="kdx-radar-static">
        {rings.map((r) => (
          <circle key={r} cx="0" cy="0" r={r} />
        ))}
        {spokes.map((a) => (
          <line
            key={a}
            x1="0"
            y1="0"
            x2={440 * Math.cos((a * Math.PI) / 180)}
            y2={440 * Math.sin((a * Math.PI) / 180)}
          />
        ))}
      </g>
      <g className={spin ? "kdx-radar-sweep" : undefined}>
        <line x1="0" y1="0" x2="440" y2="0" className="kdx-sweep-arm" />
        <circle cx="0" cy="0" r="46" className="kdx-sweep-core" />
      </g>
    </svg>
  );
}

/* --------------------------- count-up value ------------------------- */
/* Counts from zero to `value` the first time it scrolls into view.
   Reduced motion gets the final number immediately, never a blank. */
export function Counter({ value, suffix = "", duration = 1100 }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));
  const ref = useRef(null);
  const done = useRef(prefersReducedMotion());

  useEffect(() => {
    if (done.current) return;
    const node = ref.current;
    if (!node) return;

    let frame;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || done.current) return;
        done.current = true;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(eased * value));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}
