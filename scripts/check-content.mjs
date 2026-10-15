import en from "../src/content/en.js";
import ckb from "../src/content/ckb.js";
import ar from "../src/content/ar.js";

const tokens = (s) => (String(s).match(/\{(\w+)\}/g) || []).sort().join(",");
const looseLength = (path) => /^content\.hero\.slides\[\d+\]\.headline\[\d+\]$/.test(path);

function compare(other, lang) {
  const problems = [];
  const walk = (a, b, path) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return problems.push(`${path}: should be an array`);
      if (looseLength(path)) return b.forEach((item, i) => walk(a[i] ?? "", item, `${path}[${i}]`));
      if (a.length !== b.length) return problems.push(`${path}: ${a.length} items in en, ${b.length} in ${lang}`);
      return a.forEach((item, i) => walk(item, b[i], `${path}[${i}]`));
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
    if (typeof b !== "string" || !b.trim()) problems.push(`${path}: empty in ${lang}`);
    else if (typeof a === "string" && tokens(a) !== tokens(b)) {
      problems.push(`${path}: placeholders differ: en has "${tokens(a)}", ${lang} has "${tokens(b)}"`);
    }
  };
  const { meta: _a, ...enBody } = en;
  const { meta: _b, ...otherBody } = other;
  walk(enBody, otherBody, "content");
  return problems;
}

let failed = false;
for (const [pack, lang] of [[ckb, "ckb"], [ar, "ar"]]) {
  const problems = compare(pack, lang);
  if (problems.length) {
    failed = true;
    console.error(`\n${lang}.js does not match en.js (${problems.length}):\n  ${problems.join("\n  ")}`);
  }
}
if (failed) process.exit(1);
console.log("content check passed: en, ckb and ar have the same keys and placeholders");
