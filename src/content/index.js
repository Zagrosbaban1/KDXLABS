import en from "./en.js";
import ckb from "./ckb.js";
import ar from "./ar.js";

export const PACKS = { en, ckb, ar };

/* order matters, this is the order they appear in the switcher */
export const LANGUAGES = [en.meta, ckb.meta, ar.meta];

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

if (import.meta.env.DEV) {
  const tokens = (s) => (String(s).match(/\{(\w+)\}/g) || []).sort().join(",");

  const looseLength = (path) => /^content\.hero\.slides\[\d+\]\.headline\[\d+\]$/.test(path);

  const compare = (other, lang) => {
    const problems = [];

    const walk = (a, b, path) => {
      if (Array.isArray(a)) {
        if (!Array.isArray(b)) return problems.push(`${path}: should be an array`);
        if (looseLength(path)) {
          b.forEach((item, i) => walk(a[i] ?? "", item, `${path}[${i}]`));
          return;
        }
        if (a.length !== b.length) {
          problems.push(`${path}: ${a.length} items in en, ${b.length} in ${lang}`);
          return;
        }
        a.forEach((item, i) => walk(item, b[i], `${path}[${i}]`));
        return;
      }
      if (a && typeof a === "object") {
        if (!b || typeof b !== "object") return problems.push(`${path}: missing in ${lang}`);
        Object.keys(a).forEach((k) =>
          k in b ? walk(a[k], b[k], `${path}.${k}`) : problems.push(`${path}.${k}: missing in ${lang}`)
        );
        Object.keys(b).forEach((k) => {
          if (!(k in a)) problems.push(`${path}.${k}: extra in ${lang}, not in en`);
        });
        return;
      }
      if (typeof a === "string" && tokens(a) !== tokens(b)) {
        problems.push(`${path}: placeholders differ: en has "${tokens(a)}", ${lang} has "${tokens(b)}"`);
      }
    };

    /* meta is expected to differ, everything else is not */
    const { meta: _enMeta, ...enBody } = en;
    const { meta: _otherMeta, ...otherBody } = other;
    walk(enBody, otherBody, "content");

    if (problems.length) {
      console.warn(
        `[i18n] ${problems.length} difference(s) between en.js and ${lang}.js:\n  ${problems.join("\n  ")}`
      );
    }
  };

  compare(ckb, "ckb");
  compare(ar, "ar");
}
