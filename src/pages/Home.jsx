import { Fragment, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { CONTACT, NAV, SERVICE_IDS } from "../data.js";
import { Counter, Radar } from "../components/primitives.jsx";
import { useSectionLink, useSite } from "../site-context.jsx";

/* The hero headline arrives from the language pack as lines of words —
   see `hero.headline` in content/en.js and content/ckb.js. Each word gets
   a running index across the whole headline so the stylesheet can hand it
   its own gradient (.kdx-word-N). The index wraps at eight because that is
   how many gradients exist, and the white/green/red pattern repeats
   cleanly on a cycle of eight — which matters because the two languages
   do not have the same number of words. */
const GRADIENTS = 8;
const wordOffsets = (lines) =>
  lines.reduce((acc, line) => [...acc, acc[acc.length - 1] + line.length], [0]);

export default function Home() {
  const { setActiveSection } = useOutletContext();
  const sectionLink = useSectionLink();
  const { nameRef, startEnquiry, c, t } = useSite();
  const services = SERVICE_IDS.map((id) => ({ id, ...c.services.items[id] }));
  const heroLines = c.hero.headline;
  const heroOffset = wordOffsets(heroLines);

  /* ---- which section the nav should highlight ---- */
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
      {/* ----------------------------- hero ------------------------------ */}
      <section className="kdx-hero" id="top">
        <div className="kdx-hero-radar">
          <Radar />
        </div>

        <div className="kdx-hero-inner">
          {/* a quiet instrument label in the top-right corner: a miniature
              of the big radar, sweep arm and all, then the words */}
          <p className="kdx-hero-badge kdx-in" style={{ "--d": "0.05s" }}>
            <span className="kdx-hero-badge-radar" aria-hidden="true" />
            {c.hero.badge}
          </p>

          <div className="kdx-hero-copy">
            <span className="kdx-rule kdx-in" style={{ "--d": "0.15s" }} />
            <h1 className="kdx-h1">
              {heroLines.map((line, li) => (
                <span key={li}>
                  {line.map((word, wi) => {
                    /* --w is the word's position across the whole headline,
                       which is what staggers the cascade. The space is a
                       sibling text node, not part of the span: the words are
                       inline-block so they can be transformed, and an
                       inline-block swallows a trailing space, which would
                       run the headline together and remove every point the
                       line is allowed to wrap at. */
                    const n = heroOffset[li] + wi;
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
            </h1>
            <p className="kdx-lede kdx-in" style={{ "--d": "0.55s" }}>
              {c.hero.lede}
            </p>
            <div className="kdx-hero-actions kdx-in" style={{ "--d": "0.65s" }}>
              <a className="kdx-btn" {...sectionLink("contact", { focus: nameRef })}>
                {c.hero.primary}
              </a>
              <a className="kdx-btn kdx-btn-ghost" {...sectionLink("services")}>
                {c.hero.secondary}
              </a>
            </div>
            {/* risk reversal, right where the decision happens: the two facts
                that remove the cost of clicking live next to the button that
                asks for the click */}
            <p className="kdx-hero-note kdx-in" style={{ "--d": "0.75s" }}>
              {c.hero.note}
            </p>

          </div>
        </div>
      </section>

      {/* ------------------------- about, in brief ------------------------ */}
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

      {/* ---------------------------- services ---------------------------- */}
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

      {/* ----------------------------- work ------------------------------- */}
      <section className="kdx-sec kdx-work" id="work">
        <div className="kdx-wrap">
          <div className="kdx-sec-head" data-reveal>
            <p className="kdx-eyebrow kdx-eyebrow-blue">{c.work.eyebrow}</p>
            <h2 className="kdx-h2">{c.work.heading}</h2>
          </div>

          <article className="kdx-product" data-reveal>
            <div className="kdx-product-radar" aria-hidden="true">
              <Radar spin={false} />
            </div>
            <div className="kdx-product-inner">
              <p className="kdx-eyebrow">{c.work.productEyebrow}</p>
              <h3 className="kdx-product-name">{c.work.productName}</h3>
              <p>{c.work.productBody}</p>
              <dl className="kdx-stats">
                {c.work.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>
              <div className="kdx-product-actions">
                <a
                  className="kdx-btn kdx-btn-sm kdx-btn-blue"
                  href={CONTACT.jobsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.work.visit} <span aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  className="kdx-btn kdx-btn-sm kdx-btn-outline"
                  onClick={() => startEnquiry("Recruitment")}
                >
                  {c.work.hire}
                </button>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* --------------------------- why us ------------------------------- */}
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

      {/* --------------------------- approach ----------------------------- */}
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

      {/* ------------------------------ faq ------------------------------- */}
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
