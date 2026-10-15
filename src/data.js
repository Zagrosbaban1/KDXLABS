export const CONTACT = {
  email: "hello@kdxlabs.net", // TODO: confirm the mailbox exists on the .net domain
  phoneDisplay: "+964 750 605 9330",
  phoneDial: "+9647506059330",
  whatsapp: "9647506059330", // digits only, no + or spaces
  web: "kdxlabs.net",
  webUrl: "https://kdxlabs.net",
  jobsUrl: "https://kdxjobs.com",
  /* POST endpoint for the enquiry form (Formspree, Web3Forms, your own API). Empty = open the visitor's mail app instead. */
  formEndpoint: "",
  /* the base line is prose, it lives in content/*.js under details.baseValue */
};

export const NAV = [
  { id: "about", to: "/about" },
  { id: "services", section: "services" },
  { id: "approach", section: "approach" },
  { id: "faq", section: "faq" },
  { id: "game", to: "/game" },
];

/* documents per second one fast, focused person clears, for the by-hand line in the comparison chart */
export const MANUAL_PER_SEC = 1.5;

export const GAME = {
  SHIFT_MS: 30000, // one shift
  TICK_MS: 100, // clock resolution
  SLA_MS: 5000, // a document older than this breaches
  GAP_START: 620, // ms between arrivals at the start of a shift
  GAP_END: 210, // …and at the end
  AGENTS: 3, // automated workers
  AGENT_MS: 500, // ms per document, per worker
  DOC_TYPES: 4, // must match content game.docTypes length
  VISIBLE: 12, // cards rendered before the queue collapses to a count
  BACKLOG_WARN: 6, // backlog at which the counter turns amber
};

export const SERVICE_IDS = ["ai", "data", "software", "social", "recruitment"];

export const TIMELINE_START = "2026";

export const TIMELINE_STEPS = [
  { step: "01" },
  { step: "00", future: true },
  { step: "00", future: true },
];

export const COVERAGE_VALUES = [
  { value: 18, suffix: "" },
  { value: 3, suffix: "" },
  { value: 1, suffix: "" },
];

/* the map */

export const GOVERNORATES = [
  {
    id: "duhok",
    featured: true,
    city: { x: 301.4, y: 43.5 },
    label: { x: 254, y: 46, anchor: "end" },
    leader: [292, 43.5, 260, 46],
  },
  {
    id: "erbil",
    featured: true,
    hq: true,
    city: { x: 374.5, y: 101.4 },
    label: { x: 399, y: 108, anchor: "start" },
    leader: null,
  },
  {
    id: "sulaymaniyah",
    featured: true,
    city: { x: 476.3, y: 155.6 },
    label: { x: 538, y: 160, anchor: "start" },
    leader: [484, 155.6, 532, 160],
  },
  { id: "nineveh", label: { x: 265.2, y: 115.1 } },
  { id: "kirkuk", label: { x: 380, y: 178 } },
  { id: "salahaddin", label: { x: 348.4, y: 243.4 } },
  { id: "diyala", label: { x: 449.7, y: 296.9 } },
  { id: "baghdad", label: { x: 401.9, y: 348.3 } },
  { id: "anbar", label: { x: 203.6, y: 375.4 } },
  { id: "wasit", label: { x: 496.7, y: 402.7 } },
  { id: "babil", label: { x: 424, y: 398 } },
  { id: "karbala", label: { x: 350, y: 421 } },
  { id: "maysan", label: { x: 591.5, y: 469.4 } },
  { id: "qadisiyyah", label: { x: 449.9, y: 470.0 } },
  { id: "dhiqar", label: { x: 540.9, y: 526.9 } },
  { id: "najaf", label: { x: 359.6, y: 534.9 } },
  { id: "basra", label: { x: 616.5, y: 596.8 } },
  { id: "muthanna", label: { x: 471.7, y: 614.2 } },
];
