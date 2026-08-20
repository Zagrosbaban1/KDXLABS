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
  email: "hello@kdxlabs.com",
  phoneDisplay: "+964 000 000 0000", // TODO: confirm
  phoneDial: "+9640000000000", // TODO: confirm
  whatsapp: "9640000000000", // TODO: confirm — digits only, no + or spaces
  web: "kdxlabs.com",
  webUrl: "https://kdxlabs.com",
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
];

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
