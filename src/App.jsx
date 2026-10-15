import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import ContactFooter from "./components/ContactFooter.jsx";
import { CONTACT } from "./data.js";
import { prefersReducedMotion } from "./components/primitives.jsx";
import { useSite } from "./site-context.jsx";

export default function App() {
  const location = useLocation();
  const { toast, scrollToId, c } = useSite();
  const [showTools, setShowTools] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const rootRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTools(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      window.setTimeout(() => scrollToId(target), 60);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, location.state, scrollToId]);

  /* reveals, re-run per page so a newly mounted page animates in */
  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll("[data-reveal]:not(.is-in)") ?? [];
    if (prefersReducedMotion()) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [location.pathname]);

  return (
    <div className={`kdx ${loaded ? "is-loaded" : ""}`} ref={rootRef}>
      <Nav activeSection={activeSection} />

      <main id="main" key={location.pathname} className="kdx-page">
        <Outlet context={{ setActiveSection }} />
      </main>

      <ContactFooter />

      <div className={`kdx-toast ${toast ? "is-in" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span aria-hidden="true">✓</span>
            {toast}
          </>
        )}
      </div>

      <div className={`kdx-tools ${showTools && activeSection !== "contact" ? "is-in" : ""}`}>
        <a
          className="kdx-tool kdx-tool-wa"
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label={c.ui.whatsappAria}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.18 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z"
            />
          </svg>
          <span>{c.ui.whatsapp}</span>
        </a>
        <button
          type="button"
          className="kdx-tool kdx-tool-top"
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
          aria-label={c.ui.backToTop}
        >
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </div>
  );
}
