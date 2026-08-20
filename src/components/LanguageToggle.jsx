import { useSite } from "../site-context.jsx";

/* A segmented switch, not a dropdown. With exactly two languages a
   dropdown hides half the choice behind a click and gives no clue what
   the other option even is — this shows both at once and slides a pill
   between them, so the current state and the alternative are visible in
   the same glance.

   Each half is a real <button> in a radiogroup, so it is reachable by
   Tab and answerable by Space or Enter. Each is labelled in its own
   language and marked with its own `lang` attribute, which is what stops
   a screen reader reading "کوردی" with an English voice. */
export default function LanguageToggle({ className = "" }) {
  const { lang, setLang, languages, c } = useSite();

  return (
    <div
      className={`kdx-lang ${className}`}
      role="radiogroup"
      aria-label={c.ui.switchLanguage}
    >
      <span className="kdx-lang-pill" data-index={languages.findIndex((l) => l.id === lang)} aria-hidden="true" />
      {languages.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          className={`kdx-lang-option ${l.id === lang ? "is-on" : ""}`}
          aria-checked={l.id === lang}
          tabIndex={l.id === lang ? 0 : -1}
          lang={l.htmlLang}
          onClick={() => setLang(l.id)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              const i = languages.findIndex((x) => x.id === lang);
              const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
              setLang(languages[(i + step + languages.length) % languages.length].id);
            }
          }}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
