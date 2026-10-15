import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { prefersReducedMotion } from "./components/primitives.jsx";
import { DEFAULT_LANG, LANGUAGES, fill, getPack, isLang } from "./content/index.js";

const DRAFT_KEY = "kdx-enquiry-draft";
const LANG_KEY = "kdx-lang";

function initialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* private mode, fall through to the browser's preference */
  }
  try {
    const wanted = navigator.languages || [navigator.language];
    for (const tag of wanted) {
      const base = String(tag).toLowerCase();
      /* ckb is Sorani; ku is Kurdish unqualified, which here means Sorani */
      if (base.startsWith("ckb") || base.startsWith("ku")) return "ckb";
      if (base.startsWith("en")) return "en";
      if (base.startsWith("ar")) return "ar";
    }
  } catch {
    /* no navigator, server render or an odd embed */
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

  const toastTemplate = useRef(c.ui.copiedToast);
  toastTemplate.current = c.ui.copiedToast;

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("lang", c.meta.htmlLang);
    el.setAttribute("dir", c.meta.dir);
    document.title = c.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", c.meta.description);
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

  const t = useCallback((template, values) => fill(template, values), []);

  /* restore a half-written enquiry */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved && Object.values(saved).some((v) => String(v).trim())) {
        setFields({ ...EMPTY_FIELDS, ...saved });
        setDraftRestored(true);
      }
    } catch {
      /* private mode, or someone hand-edited storage, start fresh */
    }
  }, []);

  /* and keep it saved as they type */
  useEffect(() => {
    const hasContent = Object.values(fields).some((v) => String(v).trim());
    try {
      if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* nothing to do, the form still works without persistence */
    }
  }, [fields]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

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
