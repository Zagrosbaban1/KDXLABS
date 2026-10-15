import { useMemo } from "react";

/* a small seeded generator so the tree is the same on every render */
function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* canopy: cx, cy, r */
const BLOBS = [
  [400, 118, 74],
  [322, 150, 64],
  [478, 150, 64],
  [250, 192, 56],
  [550, 192, 56],
  [352, 92, 46],
  [448, 92, 46],
  [400, 58, 40],
  [202, 232, 38],
  [598, 232, 38],
  [400, 190, 52],
];

const BRANCHES = [
  ["M398 300 C370 270 330 250 290 200", 14],
  ["M402 300 C430 270 470 250 510 200", 14],
  ["M400 292 C398 240 402 200 400 140", 12],
  ["M352 252 C330 232 300 226 256 234", 7],
  ["M300 208 C282 182 262 162 238 150", 6],
  ["M448 252 C470 232 500 226 544 234", 7],
  ["M500 208 C518 182 538 162 562 150", 6],
  ["M400 202 C370 172 345 150 330 108", 6],
  ["M400 192 C430 162 455 140 470 98", 6],
  ["M400 150 C390 122 392 96 400 68", 5],
];

/* night on the right of the trunk, a spring day on the left */
const NIGHT = {
  blob: ["#2b34c4", "#3641da", "#4453ff"],
  hi: "#6d78ff",
  leaf: ["#2f3ad2", "#4453ff", "#5d69ff", "#7d88ff", "#9ba5ff", "#c7ccff"],
  trunk: "url(#kdx-tree-trunk)",
  branch: "url(#kdx-tree-branch)",
  bark: "rgba(11, 11, 16, 0.35)",
  grass: "#4453ff",
};
const DAY = {
  blob: ["#2f8a46", "#3f9d4f", "#58b868"],
  hi: "#a6e58f",
  leaf: ["#3f9d4f", "#58b868", "#7fcf7f", "#a7e69a", "#ffc2d6", "#ff9fbf", "#ffe1ea", "#ffffff"],
  trunk: "url(#kdx-day-trunk)",
  branch: "url(#kdx-day-branch)",
  bark: "rgba(60, 30, 10, 0.4)",
  grass: "#58b868",
};

const FLOWERS = [
  [232, "#ff9fbf", 14],
  [258, "#ffffff", 20],
  [288, "#ffd166", 12],
  [318, "#ff9fbf", 18],
  [346, "#ffffff", 13],
  [214, "#ffd166", 11],
];

const MIRROR = "translate(800 0) scale(-1 1)";

function Body({ p, leaves, day }) {
  return (
    <g className={day ? "kdx-day" : undefined}>
      <ellipse
        cx={day ? 330 : 470}
        cy="252"
        rx="270"
        ry="205"
        fill={day ? "url(#kdx-day-glow)" : "url(#kdx-tree-glow)"}
      />

      <g className="kdx-tree-grass" style={{ "--grass": p.grass }}>
        {day ? (
          <>
            <path d="M300 456 q4 -22 12 -34 M308 456 q0 -18 -6 -28 M316 456 q6 -16 16 -22" />
            <path d="M230 456 q3 -14 9 -22 M262 456 q-3 -18 -10 -26 M200 456 q4 -12 10 -20" />
          </>
        ) : (
          <>
            <path d="M486 456 q-4 -22 -12 -34 M478 456 q0 -18 6 -28 M470 456 q-6 -16 -16 -22" />
            <path d="M570 456 q-3 -14 -9 -22 M538 456 q3 -18 10 -26 M600 456 q-4 -12 -10 -20" />
          </>
        )}
      </g>
      {day &&
        FLOWERS.map(([x, c, h]) => (
          <g key={x}>
            <path d={`M${x} 456 L${x} ${456 - h}`} stroke="#3f9d4f" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx={x} cy={456 - h} r="4.2" fill={c} />
            <circle cx={x} cy={456 - h} r="1.5" fill="#ffd166" />
          </g>
        ))}

      <path
        d="M346 456 C376 452 390 440 392 416 C393 392 390 364 388 336 L412 336 C410 364 407 392 408 416 C410 440 424 452 454 456 Z"
        fill={p.trunk}
      />
      <path
        d="M394 446 C396 410 392 380 391 350 M406 446 C404 410 408 380 409 350"
        fill="none"
        stroke={p.bark}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <g transform="translate(0 46)">
        <g className="kdx-tree-sway">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={p.branch}>
            {BRANCHES.map(([d, w]) => (
              <path key={d} d={d} strokeWidth={w} />
            ))}
          </g>

          <g className="kdx-tree-canopy">
            {BLOBS.map(([cx, cy, r], i) => (
              <circle key={`b${i}`} cx={cx} cy={cy} r={r} fill={p.blob[i % 3]} opacity="0.86" />
            ))}
            {BLOBS.map(([cx, cy, r], i) => (
              <circle key={`h${i}`} cx={cx - r * 0.18} cy={cy - r * 0.2} r={r * 0.62} fill={p.hi} opacity="0.34" />
            ))}
            {leaves.map((l) => (
              <ellipse
                key={l.key}
                cx={l.x.toFixed(1)}
                cy={l.y.toFixed(1)}
                rx={l.rx.toFixed(1)}
                ry={l.ry.toFixed(1)}
                fill={p.leaf[Math.floor(l.c * p.leaf.length)]}
                opacity={l.o.toFixed(2)}
                transform={`rotate(${l.rot} ${l.x.toFixed(1)} ${l.y.toFixed(1)})`}
              />
            ))}
            {leaves.slice(0, 9).map((l, i) => (
              <circle
                key={`s${i}`}
                className="kdx-tree-spark"
                cx={l.x.toFixed(1)}
                cy={l.y.toFixed(1)}
                r="3"
                style={{ animationDelay: `${((i * 7) % 5) * 0.8}s` }}
              />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
}

/* the moon (night) or the sun (day), the light it throws, and the pool it makes */
function Sky({ day, mirrored }) {
  return (
    <g transform={mirrored ? MIRROR : undefined}>
      {day ? (
        <g className="kdx-sun">
          <circle className="kdx-moon-halo" cx="700" cy="80" r="110" fill="url(#kdx-sun-halo)" />
          <g className="kdx-sun-rays" stroke="#ffd98a" strokeWidth="2.6" strokeLinecap="round">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={700 + Math.cos(a) * 42}
                  y1={80 + Math.sin(a) * 42}
                  x2={700 + Math.cos(a) * 58}
                  y2={80 + Math.sin(a) * 58}
                />
              );
            })}
          </g>
          <circle cx="700" cy="80" r="31" fill="#ffe08a" />
          <circle cx="700" cy="80" r="23" fill="#fff4c4" />
        </g>
      ) : (
        <g className="kdx-moon">
          <circle className="kdx-moon-halo" cx="700" cy="80" r="92" fill="url(#kdx-moon-halo)" />
          <circle cx="700" cy="80" r="31" fill="#f1f3ff" mask="url(#kdx-moon-mask)" />
          <circle cx="620" cy="46" r="1.8" className="kdx-tree-spark" style={{ animationDelay: "0.6s" }} />
          <circle cx="758" cy="148" r="1.6" className="kdx-tree-spark" style={{ animationDelay: "2.1s" }} />
          <circle cx="662" cy="132" r="1.4" className="kdx-tree-spark" style={{ animationDelay: "3.2s" }} />
          <circle cx="768" cy="40" r="1.7" className="kdx-tree-spark" style={{ animationDelay: "1.4s" }} />
          <circle cx="600" cy="100" r="1.3" className="kdx-tree-spark" style={{ animationDelay: "2.7s" }} />
        </g>
      )}
      <polygon
        className="kdx-moon-beam"
        points="690,100 724,106 548,452 432,444"
        fill={day ? "url(#kdx-sun-beam)" : "url(#kdx-moon-beam)"}
      />
      <ellipse cx="468" cy="424" rx="92" ry="66" fill={day ? "url(#kdx-sun-pool)" : "url(#kdx-moon-pool)"} />
      <ellipse cx="420" cy="454" rx="215" ry="30" fill={day ? "url(#kdx-sun-pool)" : "url(#kdx-moon-pool)"} />
    </g>
  );
}

/* a woman sitting against the trunk */
function Girl({ look, mirrored }) {
  return (
    <g className="kdx-woman" transform={mirrored ? MIRROR : undefined}>
      <ellipse cx="458" cy="457" rx="52" ry="4.5" fill="#000" opacity="0.38" />
      <ellipse cx="503" cy="452" rx="10" ry="4.5" fill={look.shoe} />
      <path d="M470 421 L497 450" stroke={look.pants2} strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M435 447 L470 421" stroke={look.pants} strokeWidth="15" strokeLinecap="round" fill="none" />
      <circle cx="434" cy="445" r="9" fill={look.pants} />
      <path d="M434 443 C433 434 430 420 428 406" stroke={look.top} strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M429 405 L431 392" stroke={look.skin} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M431 407 C438 418 450 424 466 419" stroke={look.sleeve} strokeWidth="7.5" strokeLinecap="round" fill="none" />
      <circle cx="468.5" cy="419" r="3.6" fill={look.skin} />
      <circle cx="433" cy="381" r="11.5" fill={look.skin} />
      <path d="M420.5 383 C418 366 430 357 442 361 C449 364 451 372 447.5 377 C443 372 436 369 431 372 C427 374 425 378 424.5 385 Z" fill={look.hair} />
      <path d="M421 378 C414 392 416 405 424 413 C430 416 434 413 433 408 C427 403 425 394 428 384 Z" fill={look.hair} />
      <path d="M424 372 C428 366 436 364 442 366" stroke={look.hairHi} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {look.flower && (
        <g>
          <circle cx="425" cy="371" r="3.6" fill="#ff9fbf" />
          <circle cx="425" cy="371" r="1.3" fill="#ffd166" />
        </g>
      )}
      <path d="M436 443 L468 418" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" fill="none" />
      <path d="M470 418 L496 447" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" fill="none" />
      <path d="M433 408 C441 417 452 422 465 417" stroke={look.rim} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" fill="none" />
      <path d="M440 372 C444 376 444 384 441 389" stroke="#fff3e6" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" fill="none" />
      <path d="M424 380 C422 392 424 402 427 408" stroke={look.back} strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />
    </g>
  );
}

const NIGHT_GIRL = {
  shoe: "#2b34c4",
  pants: "#e6e9ff",
  pants2: "#cfd5ff",
  top: "#ff9e9e",
  sleeve: "#f08585",
  skin: "#e8b48f",
  hair: "#1b1a2e",
  hairHi: "#3d3b63",
  rim: "#ffe3e3",
  back: "#7d88ff",
};
const DAY_GIRL = {
  shoe: "#3f9d4f",
  pants: "#fffdf4",
  pants2: "#e3f3d8",
  top: "#ffd166",
  sleeve: "#f2b84b",
  skin: "#d49a73",
  hair: "#3a2314",
  hairHi: "#8a5a36",
  rim: "#fff4cf",
  back: "#ffe9a6",
  flower: true,
};

export default function FooterTree() {
  const leaves = useMemo(() => {
    const rand = mulberry32(2026);
    const out = [];
    BLOBS.forEach(([cx, cy, r], bi) => {
      const n = 14 + Math.round(r / 6);
      for (let i = 0; i < n; i += 1) {
        const a = rand() * Math.PI * 2;
        const d = Math.sqrt(rand()) * r * 1.05;
        out.push({
          x: cx + Math.cos(a) * d,
          y: cy + Math.sin(a) * d,
          rx: 6 + rand() * 7,
          ry: 3 + rand() * 3.5,
          rot: Math.round(rand() * 180),
          c: rand(),
          o: 0.55 + rand() * 0.45,
          key: `${bi}-${i}`,
        });
      }
    });
    return out;
  }, []);

  return (
    <div className="kdx-footer-tree" aria-hidden="true" data-reveal>
      <svg viewBox="0 0 800 460" focusable="false">
        <defs>
          <linearGradient id="kdx-tree-trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8f9aff" />
            <stop offset="1" stopColor="#2b34c4" />
          </linearGradient>
          <linearGradient id="kdx-tree-branch" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#4453ff" />
            <stop offset="1" stopColor="#9ba5ff" />
          </linearGradient>
          <linearGradient id="kdx-day-trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c99a6e" />
            <stop offset="1" stopColor="#6b4429" />
          </linearGradient>
          <linearGradient id="kdx-day-branch" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#8a5a3c" />
            <stop offset="1" stopColor="#c4986e" />
          </linearGradient>

          <radialGradient id="kdx-tree-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#4453ff" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#4453ff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#4453ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kdx-day-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#bff0b0" stopOpacity="0.34" />
            <stop offset="0.6" stopColor="#ffe9a6" stopOpacity="0.12" />
            <stop offset="1" stopColor="#ffe9a6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="kdx-moon-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#dfe3ff" stopOpacity="0.5" />
            <stop offset="0.35" stopColor="#9ba5ff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#4453ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kdx-sun-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0.75" />
            <stop offset="0.35" stopColor="#ffd166" stopOpacity="0.3" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="kdx-moon-beam" gradientUnits="userSpaceOnUse" x1="705" y1="100" x2="480" y2="440">
            <stop offset="0" stopColor="#dfe3ff" stopOpacity="0.18" />
            <stop offset="0.7" stopColor="#cfd5ff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#cfd5ff" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="kdx-sun-beam" gradientUnits="userSpaceOnUse" x1="705" y1="100" x2="480" y2="440">
            <stop offset="0" stopColor="#fff1c2" stopOpacity="0.3" />
            <stop offset="0.7" stopColor="#ffe9a6" stopOpacity="0.14" />
            <stop offset="1" stopColor="#ffe9a6" stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id="kdx-moon-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#e6e9ff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#e6e9ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kdx-sun-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff1c2" stopOpacity="0.42" />
            <stop offset="1" stopColor="#fff1c2" stopOpacity="0" />
          </radialGradient>
          <mask id="kdx-moon-mask">
            <rect x="640" y="20" width="130" height="130" fill="#fff" />
            <circle cx="715" cy="68" r="27" fill="#000" />
          </mask>

          <linearGradient id="kdx-seam-day" gradientUnits="userSpaceOnUse" x1="352" y1="0" x2="448" y2="0">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <linearGradient id="kdx-seam-night" gradientUnits="userSpaceOnUse" x1="352" y1="0" x2="448" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id="kdx-mask-day" maskUnits="userSpaceOnUse" x="-300" y="-200" width="1400" height="900">
            <rect x="-300" y="-200" width="1400" height="900" fill="url(#kdx-seam-day)" />
          </mask>
          <mask id="kdx-mask-night" maskUnits="userSpaceOnUse" x="-300" y="-200" width="1400" height="900">
            <rect x="-300" y="-200" width="1400" height="900" fill="url(#kdx-seam-night)" />
          </mask>
        </defs>

        <Sky day mirrored />
        <Sky />

        <g mask="url(#kdx-mask-day)">
          <Body p={DAY} leaves={leaves} day />
        </g>
        <g mask="url(#kdx-mask-night)">
          <Body p={NIGHT} leaves={leaves} />
        </g>

        <Girl look={DAY_GIRL} mirrored />
        <Girl look={NIGHT_GIRL} />

        {/* petals on the left, leaves on the right, drifting down */}
        <g className="kdx-tree-fall is-day">
          <ellipse className="f1" cx="270" cy="236" rx="6" ry="3.4" />
          <ellipse className="f2" cx="330" cy="222" rx="5.5" ry="3" />
          <ellipse className="f3" cx="210" cy="262" rx="6" ry="3.4" />
          <ellipse className="f4" cx="370" cy="250" rx="5" ry="2.8" />
        </g>
        <g className="kdx-tree-fall">
          <ellipse className="f1" cx="500" cy="230" rx="7" ry="3.5" />
          <ellipse className="f2" cx="420" cy="260" rx="8" ry="4" />
          <ellipse className="f3" cx="560" cy="250" rx="7" ry="3.5" />
          <ellipse className="f4" cx="460" cy="212" rx="6" ry="3" />
        </g>
      </svg>
    </div>
  );
}
