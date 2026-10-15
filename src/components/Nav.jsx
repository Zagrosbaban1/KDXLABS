import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CONTACT, NAV } from "../data.js";
import { Mark } from "./primitives.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { useSectionLink, useSite } from "../site-context.jsx";

export default function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const sectionLink = useSectionLink();
  const { goTo, c } = useSite();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* close the drawer whenever the route changes */
  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (n) =>
    n.to ? location.pathname === n.to : location.pathname === "/" && activeSection === n.section;

  const itemProps = (n) =>
    n.to
      ? { as: Link, to: n.to, onClick: () => setMenuOpen(false) }
      : { as: "a", ...sectionLink(n.section), onClick: (e) => {
          e.preventDefault();
          setMenuOpen(false);
          goTo(n.section);
        } };

  const renderItem = (n, className) => {
    const { as: As, ...rest } = itemProps(n);
    return (
      <As
        key={n.id}
        className={className ? `${className} ${isActive(n) ? "is-active" : ""}` : isActive(n) ? "is-active" : ""}
        aria-current={isActive(n) ? "true" : undefined}
        {...rest}
      >
        {c.nav[n.id]}
      </As>
    );
  };

  return (
    <>
      <a className="kdx-skip" {...sectionLink("main")}>
        {c.ui.skipToContent}
      </a>

      <header className={`kdx-nav ${scrolled ? "is-stuck" : ""} ${menuOpen ? "is-open" : ""}`}>
        <span
          className="kdx-progress"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />

        <Link className="kdx-brand" to="/" aria-label={c.ui.brandHome}>
          <Mark variant={scrolled && !menuOpen ? "blue" : "white"} className="kdx-brand-mark" />
          <span className="kdx-brand-word">KDX Labs</span>
        </Link>

        <nav className="kdx-nav-links" aria-label={c.ui.sections}>
          {NAV.map((n) => renderItem(n))}
        </nav>

        <LanguageToggle className="kdx-nav-lang" />

        <a className="kdx-nav-cta" {...sectionLink("contact")}>
          {c.ui.startConversation}
        </a>

        <button
          type="button"
          className="kdx-burger"
          aria-expanded={menuOpen}
          aria-controls="kdx-drawer"
          aria-label={menuOpen ? c.ui.closeMenu : c.ui.openMenu}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        id="kdx-drawer"
        className={`kdx-drawer ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="kdx-drawer-links" aria-label={c.ui.sections}>
          {NAV.map((n) => renderItem(n))}
          <a
            {...sectionLink("contact")}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              goTo("contact");
            }}
          >
            {c.ui.contact}
          </a>
        </nav>
        <div className="kdx-drawer-foot">
          <LanguageToggle className="kdx-drawer-lang" />
          <a dir="ltr" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a dir="ltr" href={`tel:${CONTACT.phoneDial}`}>{CONTACT.phoneDisplay}</a>
          <span>{c.ui.languages}</span>
        </div>
      </div>
    </>
  );
}
