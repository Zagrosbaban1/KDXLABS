import { Fragment, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { NAV, SERVICE_IDS } from "../data.js";
import { Counter, Radar, prefersReducedMotion } from "../components/primitives.jsx";
import CompareChart from "../components/CompareChart.jsx";
import { useSectionLink, useSite } from "../site-context.jsx";

const GRADIENTS = 8;
const wordOffsets = (lines) =>
  lines.reduce((acc, line) => [...acc, acc[acc.length - 1] + line.length], [0]);

export default function Home() {
  const { setActiveSection } = useOutletContext();
  const sectionLink = useSectionLink();
  const { nameRef, startEnquiry, c, t } = useSite();
  const services = SERVICE_IDS.map((id) => ({ id, ...c.services.items[id] }));
  const slides = c.hero.slides;
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setSlide((i) => (i + 1) % slides.length), 5000);
    return () => window.clearInterval(id);
  }, [paused, slide, slides.length]);

  /* which section the nav should highlight */
  useEffect(() => {
    const ids = [...NAV.filter((n) => n.section).map((n) => n.section), "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
        else if (window.scrollY < window.innerHeight * 0.6) setActiveSection("");
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [setActiveSection]);

  return (
    <>
      {/* hero */}
      <section className="kdx-hero" id="top">
        <div className="kdx-hero-radar">
          <Radar />
        </div>

        <div className="kdx-hero-inner">

          <p className="kdx-hero-badge kdx-in" style={{ "--d": "0.05s" }}>
            <span className="kdx-hero-badge-radar" aria-hidden="true" />
            {c.hero.badge}
          </p>

          <div className="kdx-hero-copy">
            <span className="kdx-rule kdx-in" style={{ "--d": "0.15s" }} />
            <div
              className="kdx-slides"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {slides.map((sl, si) => {
                const offsets = wordOffsets(sl.headline);
                const Tag = si === 0 ? "h1" : "div";
                return (
                  <div
                    key={si}
                    className={`kdx-slide ${si === slide ? "is-active" : ""}`}
                    aria-hidden={si === slide ? undefined : true}
                  >
                    <Tag className="kdx-h1">
                      {sl.headline.map((line, li) => (
                        <span key={li}>
                          {line.map((word, wi) => {
                            const n = offsets[li] + wi;
                            return (
                              <Fragment key={`${word}-${wi}`}>
                                <span
                                  className={`kdx-word kdx-word-${(n % GRADIENTS) + 1}`}
                                  style={{ "--w": n }}
                                >
                                  {word}
                                </span>{" "}
                              </Fragment>
                            );
                          })}
                        </span>
                      ))}
                    </Tag>
                    <p className="kdx-lede">{sl.lede}</p>
                  </div>
                );
              })}
            </div>
            <div className="kdx-hero-actions kdx-in" style={{ "--d": "0.65s" }}>
              <a className="kdx-btn" {...sectionLink("contact", { focus: nameRef })}>
                {c.hero.primary}
              </a>
              <a className="kdx-btn kdx-btn-ghost" {...sectionLink("services")}>
                {c.hero.secondary}
              </a>
            </div>

            <p className="kdx-hero-note kdx-in" style={{ "--d": "0.75s" }}>
              {c.hero.note}
            </p>
            <div className="kdx-slide-dots kdx-in" style={{ "--d": "0.85s" }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === slide ? "is-on" : ""}
                  aria-label={t(c.hero.slideAria, { n: i + 1 })}
                  aria-pressed={i === slide}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* about, in brief */}
      <section className="kdx-sec kdx-about-band">
        <div className="kdx-wrap">
          <div className="kdx-about-band-grid">
            <div data-reveal>
              <p className="kdx-eyebrow kdx-eyebrow-blue">{c.about.eyebrow}</p>
              <h2 className="kdx-h2">{c.about.heading}</h2>
              <p className="kdx-sec-lede">{c.about.lead}</p>
              <Link className="kdx-svc-cta kdx-about-band-cta" to="/about">
                {c.about.moreLink} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="kdx-about-band-mission" data-reveal>
              <p className="kdx-eyebrow kdx-eyebrow-blue">{c.mission.label}</p>
              <p className="kdx-mission-text">{c.mission.statement}</p>
            </div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className="kdx-sec kdx-services" id="services">
        <div className="kdx-wrap">
          <div className="kdx-sec-head" data-reveal>
            <p className="kdx-eyebrow kdx-eyebrow-blue">{c.services.eyebrow}</p>
            <h2 className="kdx-h2">{c.services.heading}</h2>
            <p className="kdx-sec-lede">{c.services.lede}</p>
          </div>

          <ul className="kdx-svc-list">
            {services.map((s) => (
              <li className="kdx-svc" key={s.id} data-reveal>
                <div className="kdx-svc-head">
                  <h3 className="kdx-svc-name">{s.name}</h3>
                  <p className="kdx-svc-role">{s.role}</p>
                </div>
                <div className="kdx-svc-body">
                  <p>{s.body}</p>
                  <ul className="kdx-tags">
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <button type="button" className="kdx-svc-cta" onClick={() => startEnquiry(s.name)}>
                    {t(c.services.ask, { name: s.name })} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="kdx-consult" data-reveal>
            <p className="kdx-eyebrow">{c.services.consultEyebrow}</p>
            <p>
              <strong>{c.services.consultLead}</strong> {c.services.consultBody}
            </p>
          </div>
        </div>
      </section>

      <CompareChart />

      {/* why us */}
      <section className="kdx-sec kdx-why">
        <div className="kdx-wrap">
          <div className="kdx-sec-head" data-reveal>
            <p className="kdx-eyebrow kdx-eyebrow-blue">{c.why.eyebrow}</p>
            <h2 className="kdx-h2">{c.why.heading}</h2>
          </div>
          <div className="kdx-reasons">
            {c.why.items.map((r, i) => (
              <article className="kdx-reason" key={r.title} data-reveal data-stagger style={{ "--s": i }}>
                <span className="kdx-reason-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* approach */}
      <section className="kdx-sec kdx-approach" id="approach">
        <div className="kdx-wrap">
          <div className="kdx-sec-head" data-reveal>
            <p className="kdx-eyebrow kdx-eyebrow-blue">{c.approach.eyebrow}</p>
            <h2 className="kdx-h2">{c.approach.heading}</h2>
          </div>

          <ol className="kdx-stages">
            {c.approach.stages.map((s, i) => (
              <li key={s.n} data-reveal data-stagger style={{ "--s": i }}>
                <span className="kdx-stage-n">{s.n}</span>
                <div className="kdx-stage-copy">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="kdx-approach-cta" data-reveal>
            <p>{c.approach.cta}</p>
            <a className="kdx-btn kdx-btn-blue" {...sectionLink("contact", { focus: nameRef })}>
              {c.approach.ctaButton}
            </a>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="kdx-sec kdx-faq" id="faq">
        <div className="kdx-wrap">
          <div className="kdx-sec-head" data-reveal>
            <p className="kdx-eyebrow kdx-eyebrow-blue">{c.faq.eyebrow}</p>
            <h2 className="kdx-h2">{c.faq.heading}</h2>
          </div>

          <div className="kdx-faq-list">
            {c.faq.items.map((f) => (
              <details className="kdx-faq-item" key={f.q} data-reveal>
                <summary>
                  <span>{f.q}</span>
                  <span className="kdx-faq-icon" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <p className="kdx-faq-more" data-reveal>
            {c.faq.moreLead}{" "}
            <a {...sectionLink("contact", { focus: nameRef })}>{c.faq.moreLink}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
