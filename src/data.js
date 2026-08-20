/* ------------------------------------------------------------------ *
 *  KDX LABS — the things that are NOT language.
 *
 *  All prose moved to src/content/en.js and src/content/ckb.js when the
 *  site went bilingual. What is left here is shared by both languages:
 *  contact endpoints, the ids that tie a service to its translation,
 *  the map's geometry, and the timeline's numbering.
 *
 *  Anything marked  // TODO: confirm  is a placeholder we filled in to
 *  give the section shape — replace it with the real figure before the
 *  site goes live.
 * ------------------------------------------------------------------ */

export const CONTACT = {
  email: "hello@kdxlabs.net", // TODO: confirm the mailbox exists on the .net domain
  phoneDisplay: "+964 750 605 9330",
  phoneDial: "+9647506059330",
  whatsapp: "9647506059330", // digits only, no + or spaces
  web: "kdxlabs.net",
  webUrl: "https://kdxlabs.net",
  jobsUrl: "https://kdxjobs.com",
  /* the office line is prose — it lives in content/*.js under details.officeValue */
};

/* `to` is a route of its own; `section` scrolls to a block on the home
   page. Labels come from content: c.nav[id]. */
export const NAV = [
  { id: "about", to: "/about" },
  { id: "services", section: "services" },
  { id: "work", section: "work" },
  { id: "approach", section: "approach" },
  { id: "faq", section: "faq" },
  { id: "game", to: "/game" },
];

/* ---- the ops room game ----------------------------------------------
   Tuning, not language, so it lives here. These numbers decide whether
   the demo is honest: AGENTS × (1000 / AGENT_MS) is the automated
   shift's documents-per-second ceiling, and it has to be comfortably
   above the arrival rate or the automated shift builds a backlog too —
   which is realistic, but is not what this page is arguing. GAP_END is
   the tightest arrival gap, reached at the end of the shift, and is
   deliberately faster than a person can sustain by hand. */
export const GAME = {
  SHIFT_MS: 30000, // one shift
  TICK_MS: 100, // clock resolution
  SLA_MS: 5000, // a document older than this breaches
  /* Tuned against a simulation of the real tick loop, not by eye. The
     arrival rate has to exceed what a person can sustain or the demo
     makes no point: at ~620ms→210ms the shift lands ~75 documents, and
     a fast player clicking every 450ms can physically reach about 60 of
     them — so even a good player finishes behind, which is the honest
     result. Loosen these and the page starts flattering the player. */
  GAP_START: 620, // ms between arrivals at the start of a shift
  GAP_END: 210, // …and at the end
  /* AGENTS × (1000 / AGENT_MS) = 6 docs/sec, above the ~4.8/sec peak
     arrival rate, so the automated shift clears everything and never
     breaches. Drop it below the peak and automation builds a backlog
     too — true to life, but not what this page is demonstrating. */
  AGENTS: 3, // automated workers
  AGENT_MS: 500, // ms per document, per worker
  DOC_TYPES: 4, // must match content game.docTypes length
  VISIBLE: 12, // cards rendered before the queue collapses to a count
  BACKLOG_WARN: 6, // backlog at which the counter turns amber
};

/* Order of the five services. Names, roles, bodies and tags come from
   content: c.services.items[id]. */
export const SERVICE_IDS = ["recruitment", "social", "software", "ai", "data"];

/* KDX Labs was founded in 2026, so every milestone is from the first
   year — which is why these are numbered rather than dated.
   TODO: confirm the order. */
export const TIMELINE_START = "2026";

/* Only the first entry has actually happened. The rest are where we are
   going, not where we have been, so they carry step "00" and future:
   true — which renders them greyed, with an "In the future" label,
   instead of claiming them as history. Titles and bodies come from
   content: c.timeline.items[i]. Promote one by giving it its real
   number and deleting its `future` line. */
export const TIMELINE_STEPS = [
  { step: "01" },
  { step: "00", future: true },
  { step: "00", future: true },
  { step: "00", future: true },
];

/* Headline figures under the map; labels come from
   c.coverage.stats[i].label. TODO: confirm before launch. */
export const COVERAGE_VALUES = [
  { value: 3, suffix: "" },
  { value: 3, suffix: "" },
  { value: 1, suffix: "" },
];

/* ------------------------------ the map ---------------------------- */
/* Governorates of the Kurdistan Region. `path` names an export from
   assets.js; names, blurbs and focus lists come from c.regions[id]. */

export const GOVERNORATES = [
  {
    id: "duhok",
    path: "DUHOK_PATH",
    city: { x: 301.4, y: 43.5 },
    label: { x: 254, y: 46, anchor: "end" },
    leader: [292, 43.5, 260, 46],
  },
  {
    id: "erbil",
    path: "ERBIL_PATH",
    hq: true,
    city: { x: 374.5, y: 101.4 },
    label: { x: 399, y: 108, anchor: "start" },
    leader: null,
  },
  {
    id: "sulaymaniyah",
    path: "SULAYMANIYAH_PATH",
    city: { x: 476.3, y: 155.6 },
    label: { x: 538, y: 160, anchor: "start" },
    leader: [484, 155.6, 532, 160],
  },
];

/* Cities outside the region, shown for orientation only. Names come
   from c.mapCities[id]. */
export const MAP_CITIES = [
  { id: "mosul", x: 310.8, y: 88.1, lx: 298, ly: 92, anchor: "end" },
  { id: "baghdad", x: 400.0, y: 347.2, lx: 414, ly: 352, anchor: "start" },
  { id: "basra", x: 644.3, y: 587.2, lx: 632, ly: 591, anchor: "end" },
];
