import { useEffect, useRef, useState } from "react";
import {
  IRAQ_PATH,
  DUHOK_PATH,
  ERBIL_PATH,
  SULAYMANIYAH_PATH,
} from "../assets.js";
import { GOVERNORATES, MAP_CITIES } from "../data.js";
import { useSite } from "../site-context.jsx";

const PATHS = { DUHOK_PATH, ERBIL_PATH, SULAYMANIYAH_PATH };

/* The map is a real control, not a picture: every governorate is a button
   in a radio group. Pointer users hover, keyboard users arrow between
   regions, and the panel beside it reports the selection either way.

   Drawing order matters — shapes first, then markers, then labels last.
   Labels sit partly outside their own region, so anything painted after
   them would cover them up. */
export default function CoverageMap({ selected, onSelect, prefersReducedMotion }) {
  const { c, t } = useSite();
  const [hovered, setHovered] = useState(null);
  const [drawn, setDrawn] = useState(prefersReducedMotion);
  const svgRef = useRef(null);
  const regionRefs = useRef({});

  useEffect(() => {
    if (drawn) return;
    const node = svgRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [drawn]);

  const active = hovered ?? selected;

  const move = (fromId, step) => {
    const i = GOVERNORATES.findIndex((g) => g.id === fromId);
    const next = GOVERNORATES[(i + step + GOVERNORATES.length) % GOVERNORATES.length];
    onSelect(next.id);
    regionRefs.current[next.id]?.focus();
  };

  const onKeyDown = (e, id) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(id, 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(id, -1);
    }
  };

  return (
    <svg
      ref={svgRef}
      className={`kdx-map ${drawn ? "is-drawn" : ""}`}
      viewBox="0 0 700 711"
      role="group"
      aria-label={c.coverage.mapAria}
    >
      <path className="kdx-map-base" d={IRAQ_PATH} />

      {/* --- layer 1: the interactive regions --- */}
      <g className="kdx-gov-layer" role="radiogroup" aria-label={c.coverage.governorate}>
        {GOVERNORATES.map((g, i) => (
          <path
            key={g.id}
            ref={(el) => (regionRefs.current[g.id] = el)}
            className={`kdx-gov-shape ${active === g.id ? "is-active" : ""} ${
              selected === g.id ? "is-selected" : ""
            }`}
            style={{ "--i": i }}
            d={PATHS[g.path]}
            role="radio"
            tabIndex={selected === g.id ? 0 : -1}
            aria-checked={selected === g.id}
            aria-label={t(c.coverage.governorateAria, { name: c.regions[g.id].name })}
            onMouseEnter={() => setHovered(g.id)}
            onMouseLeave={() => setHovered((h) => (h === g.id ? null : h))}
            onFocus={() => setHovered(g.id)}
            onBlur={() => setHovered((h) => (h === g.id ? null : h))}
            onClick={() => onSelect(g.id)}
            onKeyDown={(e) => onKeyDown(e, g.id)}
          />
        ))}
      </g>

      {/* --- layer 2: markers and leader lines --- */}
      <g className="kdx-map-marks" aria-hidden="true">
        {MAP_CITIES.map((city) => (
          <circle key={city.id} className="kdx-map-dot" cx={city.x} cy={city.y} r="3.6" />
        ))}

        {GOVERNORATES.map((g) => (
          <g key={g.id}>
            {g.leader && (
              <line
                className="kdx-map-leader"
                x1={g.leader[0]}
                y1={g.leader[1]}
                x2={g.leader[2]}
                y2={g.leader[3]}
              />
            )}
            {g.hq ? (
              <g className="kdx-map-hq">
                <circle className="kdx-map-pulse" cx={g.city.x} cy={g.city.y} r="10" />
                <circle className="kdx-map-ring" cx={g.city.x} cy={g.city.y} r="17" />
                <circle className="kdx-map-hq-dot" cx={g.city.x} cy={g.city.y} r="6.5" />
              </g>
            ) : (
              <circle className="kdx-gov-dot" cx={g.city.x} cy={g.city.y} r="4.2" />
            )}
          </g>
        ))}
      </g>

      {/* --- layer 3: labels, drawn last so nothing covers them --- */}
      <g className="kdx-map-labels" aria-hidden="true">
        {MAP_CITIES.map((city) => (
          <text
            key={city.id}
            className="kdx-map-label"
            x={city.lx}
            y={city.ly}
            textAnchor={city.anchor}
          >
            {c.mapCities[city.id]}
          </text>
        ))}

        {GOVERNORATES.map((g) => (
          <text
            key={g.id}
            className={`kdx-gov-label ${g.hq ? "is-hq" : ""} ${
              active === g.id ? "is-active" : ""
            }`}
            x={g.label.x}
            y={g.label.y}
            textAnchor={g.label.anchor}
          >
            {c.regions[g.id].name}
          </text>
        ))}
      </g>
    </svg>
  );
}
