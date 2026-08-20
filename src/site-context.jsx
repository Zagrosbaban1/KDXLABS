import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { prefersReducedMotion } from "./components/primitives.jsx";
import { DEFAULT_LANG, LANGUAGES, fill, getPack, isLang } from "./content/index.js";

/* ------------------------------------------------------------------ *
 *  Everything shared between the pages: the chosen language, the
 *  enquiry the visitor is part-way through writing, the copy toast,
 *  and scrolling to a section that may well live on the other page.
 * ------------------------------------------------------------------ */

const DRAFT_KEY = "kdx-enquiry-draft";
const LANG_KEY = "kdx-lang";

/* Remembered choice first, then what the browser asks for, then English.
   Read once, synchronously, so the first paint is already in the right
   language and direction — a flash of the wrong script is worse than a
   slightly later paint. */
function initialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* private mode — fall through to the browser's preference */
  }
  try {
    const wanted = navigator.languages || [navigator.language];
    for (const tag of wanted) {
      const base = String(tag).toLowerCase();
      /* ckb is Sorani; ku is Kurdish unqualified, which here means Sorani */
      if (base.startsWith("ckb") || base.startsWith("ku")) return "ckb";
      if (base.startsWith("en")) return "en";
    }
  } catch {
    /* no navigator — server render or an odd embed */
  }
  return DEFAULT_LANG;
}

export const EMPTY_FIELDS = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

const SiteContext = createContext(null);

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
};

export function SiteProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [lang, setLangState] = useState(initialLang);
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);

  const nameRef = useRef(null);

  const c = useMemo(() => getPack(lang), [lang]);

  /* copy() is memoised with no deps so its identity stays stable across
     renders; it reads the toast wording through a ref so a language
     change still reaches it */
  const toastTemplate = useRef(c.ui.copiedToast);
  toastTemplate.current = c.ui.copiedToast;

  /* ---- the language is a document-level fact ----
     <html lang> and <html dir> drive the font stack, the RTL layout, the
     browser's own hyphenation and spellcheck, and what a screen reader
     switches its voice to. Setting them on <html> rather than a wrapper
     div is what makes all of that work. */
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("lang", c.meta.htmlLang);
    el.setAttribute("dir", c.meta.dir);
    return () => {};
  }, [c]);

  const setLang = useCallback((next) => {
    if (!isLang(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* the switch still works for this visit, it just will not persist */
    }
  }, []);

  /* c.form.errName etc. are already-translated strings; t() is only for
     the ones carrying {tokens} */
  const t = useCallback((template, values) => fill(template, values), []);

  /* ---- restore a half-written enquiry ---- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved && Object.values(saved).some((v) => String(v).trim())) {
        setFields({ ...EMPTY_FIELDS, ...saved });
        setDraftRestored(true);
      }
    } catch {
      /* private mode, or someone hand-edited storage — start fresh */
    }
  }, []);

  /* ---- and keep it saved as they type ---- */
  useEffect(() => {
    const hasContent = Object.values(fields).some((v) => String(v).trim());
    try {
      if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* nothing to do — the form still works without persistence */
    }
  }, [fields]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---- scrolling to a section, wherever it lives ----
     Sections belong to the home page. Asking for one from /about routes
     home first and hands the target over so the page can scroll on arrival. */
  const scrollToId = useCallback((id, focusRef) => {
    const run = () => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      const offset = window.innerWidth < 760 ? 64 : 76;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      if (focusRef) {
        window.setTimeout(() => focusRef.current?.focus({ preventScroll: true }), 620);
      }
    };
    window.setTimeout(run, 0);
  }, []);

  const goTo = useCallback(
    (id, opts = {}) => {
      /* the contact footer is on every page, so it never needs a route change */
      const onThisPage = id === "top" || id === "contact" || location.pathname === "/";
      if (onThisPage) {
        scrollToId(id, opts.focus);
      } else {
        navigate("/", { state: { scrollTo: id } });
      }
    },
    [location.pathname, navigate, scrollToId]
  );

  const startEnquiry = useCallback(
    (serviceName) => {
      setSent(false);
      setFields((f) => ({ ...f, service: serviceName }));
      scrollToId("contact", nameRef);
    },
    [scrollToId]
  );

  const copy = useCallback(async (text, what) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try */
      }
      document.body.removeChild(ta);
    }
    setToast(fill(toastTemplate.current, { what }));
  }, []);

  const clearDraft = useCallback(() => {
    setFields(EMPTY_FIELDS);
    setErrors({});
    setDraftRestored(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      lang, setLang, languages: LANGUAGES, c, t, dir: c.meta.dir,
      fields, setFields, errors, setErrors,
      sent, setSent, toast, setToast,
      draftRestored, clearDraft,
      nameRef, goTo, scrollToId, startEnquiry, copy,
    }),
    [lang, setLang, c, t, fields, errors, sent, toast, draftRestored, clearDraft, goTo, scrollToId, startEnquiry, copy]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/* Anchor-style props for anything that jumps to a section. */
export function useSectionLink() {
  const { goTo } = useSite();
  return (id, extra) => ({
    href: `#${id}`,
    onClick: (e) => {
      e.preventDefault();
      goTo(id, extra);
    },
  });
}
