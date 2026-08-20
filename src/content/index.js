/* ------------------------------------------------------------------ *
 *  The language packs, and the guard that keeps them in step.
 *
 *  Adding a third language means: a new file with the same shape, one
 *  line in PACKS below, and nothing else. The switcher, the <html lang>
 *  and dir attributes, and the font stack all read from meta.
 * ------------------------------------------------------------------ */

import en from "./en.js";
import ckb from "./ckb.js";

export const PACKS = { en, ckb };

/* order matters — this is the order they appear in the switcher */
export const LANGUAGES = [en.meta, ckb.meta];

export const DEFAULT_LANG = "en";

export const isLang = (id) => Object.prototype.hasOwnProperty.call(PACKS, id);

export const getPack = (id) => PACKS[isLang(id) ? id : DEFAULT_LANG];

/* Fill {tokens} in a string: t(c.about.timelineIntro, { year: "2026" }) */
export function fill(template, values = {}) {
  if (typeof template !== "string") return template;
  return template.replace(/\{(\w+)\}/g, (whole, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : whole
  );
}

/* ---- development-only shape check ----
   Two hand-maintained translation files drift the moment someone adds a
   key to one and forgets the other — and the failure is silent: the UI
   just renders `undefined`. This walks both packs at startup and says
   exactly which path is missing, extra, a different length, or has lost
   a {placeholder}. It is stripped from production builds by the
   import.meta.env.DEV guard. */
if (import.meta.env.DEV) {
  const problems = [];

  const tokens = (s) => (String(s).match(/\{(\w+)\}/g) || []).sort().join(",");

  const walk = (a, b, path) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return problems.push(`${path}: should be an array`);
      if (a.length !== b.length) {
        problems.push(`${path}: ${a.length} items in en, ${b.length} in ckb`);
        return;
      }
      a.forEach((item, i) => walk(item, b[i], `${path}[${i}]`));
      return;
    }
    if (a && typeof a === "object") {
      if (!b || typeof b !== "object") return problems.push(`${path}: missing in ckb`);
      Object.keys(a).forEach((k) =>
        k in b ? walk(a[k], b[k], `${path}.${k}`) : problems.push(`${path}.${k}: missing in ckb`)
      );
      Object.keys(b).forEach((k) => {
        if (!(k in a)) problems.push(`${path}.${k}: extra in ckb, not in en`);
      });
      return;
    }
    if (typeof a === "string" && tokens(a) !== tokens(b)) {
      problems.push(`${path}: placeholders differ — en has "${tokens(a)}", ckb has "${tokens(b)}"`);
    }
  };

  /* meta is expected to differ, everything else is not */
  const { meta: _enMeta, ...enBody } = en;
  const { meta: _ckbMeta, ...ckbBody } = ckb;
  walk(enBody, ckbBody, "content");

  if (problems.length) {
    console.warn(
      `[i18n] ${problems.length} difference(s) between en.js and ckb.js:\n  ` +
        problems.join("\n  ")
    );
  }
}
