import { useState } from "react";
import { Link } from "react-router-dom";
import {
  COVERAGE_VALUES,
  GOVERNORATES,
  TIMELINE_START,
  TIMELINE_STEPS,
} from "../data.js";
import CoverageMap from "../components/CoverageMap.jsx";
import { Counter, Radar, prefersReducedMotion } from "../components/primitives.jsx";
import { useSectionLink, useSite } from "../site-context.jsx";

export default function About() {
  const [region, setRegion] = useState("erbil");
  const sectionLink = useSectionLink();
  const { nameRef, c, t } = useSite();

  const serviceName = (id) => c.services.items[id]?.name ?? "";
  /* geometry from data.js, words from the language pack, joined on id */
  const activeGeo = GOVERNORATES.find((g) => g.id === region) ?? GOVERNORATES[0];
  const activeRegion = { ...activeGeo, ...c.regions[activeGeo.id] };
  const timeline = TIMELINE_STEPS.map((step, i) => ({ ...step, ...c.timeline.items[i] }));
  const coverageStats = COVERAGE_VALUES.map((v, i) => ({ ...v, ...c.coverage.stats[i] }));

  return (
    <>
      {/* ---------------------------- page head --------------------------- */}
      <header className="kdx-page-head">
        <div className="kdx-page-head-radar" aria-hidden="true">
          <Radar />
        </div>
        <div className="kdx-wrap kdx-page-head-inner">
          <p className="kdx-eyebrow kdx-in" style={{ "--d": "0.05s" }}>
            {c.about.eyebrow}
          </p>
          <h1 className="kdx-page-title kdx-in" style={{ "--d": "0.15s" }}>
            {c.about.heading}
          </h1>
          <p className="kdx-page-lede kdx-in" style={{ "--d": "0.3s" }}>
            {c.about.lead}
          </p>
        </div>
      </header>

      {/* ------------------------- mission & vision ----------------------- */}
      <section className="kdx-sec kdx-mv">
        <div className="kdx-wrap">
          <div className="kdx-mv-grid">
            <article className="kdx-mv-card" data-reveal>
              <p className="kdx-eyebrow kdx-eyebrow-blue">{c.mission.label}</p>
              <h2 className="kdx-mv-statement">{c.mission.statement}</h2>
              <p>{c.mission.body}</p>
            </article>

            <article className="kdx-mv-card is-vision" data-reveal data-stagger style={{ "--s": 1 }}>
              <p className="kdx-eyebrow">{c.vision.label}</p>
              <h2 className="kdx-mv-statement">{c.vision.statement}</h2>
              <p>{c.vision.body}</p>
            </article>
          </div>

          <div className="kdx-commitments" data-reveal>
            <p className="kdx-eyebrow kdx-eyebrow-blue">{c.commitmentsEyebrow}</p>
            <ul>
              {c.commitments.map((item, i) => (
                <li key={item} data-reveal data-stagger style={{ "--s": i }}>
                  <span className="kdx-commit-mark" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------ story ----------------------------- */}
      <section className="kdx-sec kdx-about-sec">
        <div className="kdx-wrap">
          <p className="kdx-eyebrow kdx-eyebrow-blue" data-reveal>
            {c.about.storyEyebrow}
          </p>
          <h2 className="kdx-h2" data-reveal>
            {c.about.storyHeading}
          </h2>

          <div className="kdx-about-story">
            {c.about.story.map((para, i) => (
              <div key={i} data-reveal data-stagger style={{ "--s": i }}>
                <p>{para}</p>
              </div>
            ))}
          </div>

          <p className="kdx-eyebrow kdx-eyebrow-blue kdx-why-label" data-reveal>
            {c.about.disciplinesEyebrow}
          </p>
          <div className="kdx-disciplines">
            {c.disciplines.map((d, i) => (
              <article className="kdx-discipline" key={d.name} data-reveal data-stagger style={{ "--s": i }}>
                <h3>{d.name}</h3>
                <p>{d.body}</p>
                <ul className="kdx-tags">
                  {d.services.map((id) => (
                    <li key={id}>{serviceName(id)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="kdx-eyebrow kdx-eyebrow-blue kdx-why-label" data-reveal>
            {c.about.timelineEyebrow}
          </p>
          <p className="kdx-timeline-intro" data-reveal>
            {t(c.about.timelineIntro, { year: TIMELINE_START })}
          </p>
          <ol className="kdx-timeline">
            {timeline.map((item, i) => (
              /* keyed on the title, not the step — the future entries all
                 share step "00" */
              <li
                key={item.title}
                className={item.future ? "is-future" : ""}
                data-reveal
                data-stagger
                style={{ "--s": i }}
              >
                <span className="kdx-timeline-step">{item.step}</span>
                <div className="kdx-timeline-copy">
                  <h3>
                    {item.title}
                    {item.future && (
                      <span className="kdx-timeline-future">{c.timeline.futureLabel}</span>
                    )}
                  </h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------- coverage ---------------------------- */}
      <section className="kdx-sec kdx-coverage-sec">
        <div className="kdx-wrap">
          <div className="kdx-coverage" data-reveal>
            <div className="kdx-coverage-map">
              <CoverageMap
                selected={region}
                onSelect={setRegion}
                prefersReducedMotion={prefersReducedMotion()}
              />
            </div>
            <div className="kdx-coverage-copy">
              <p className="kdx-eyebrow kdx-eyebrow-blue">{c.coverage.eyebrow}</p>
              <h3 className="kdx-coverage-h">{c.coverage.heading}</h3>
              <p>{c.coverage.body}</p>

              <div className="kdx-region-panel" aria-live="polite">
                <div className="kdx-region-fade" key={activeRegion.id}>
                  <h4 className="kdx-region-name">
                    {activeRegion.name}
                    {activeRegion.hq && (
                      <span className="kdx-region-flag">{c.coverage.ourOffice}</span>
                    )}
                  </h4>
                  <p>{activeRegion.blurb}</p>
                  <ul className="kdx-tags">
                    {activeRegion.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="kdx-region-hint">{c.coverage.hint}</p>

              <a className="kdx-svc-cta kdx-coverage-cta" {...sectionLink("contact", { focus: nameRef })}>
                {c.coverage.cta} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <dl className="kdx-coverage-stats" data-reveal>
            {coverageStats.map((s) => (
              <div key={s.label}>
                <dt>
                  <Counter value={s.value} suffix={s.suffix} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------- closing ----------------------------- */}
      <section className="kdx-sec kdx-about-why">
        <div className="kdx-wrap">
          <div className="kdx-approach-cta" data-reveal>
            <p>{c.about.closingLead}</p>
            <Link className="kdx-btn kdx-btn-blue" to="/" state={{ scrollTo: "work" }}>
              {c.about.closingButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
