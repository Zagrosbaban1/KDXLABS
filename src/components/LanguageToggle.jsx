import { useSite } from "../site-context.jsx";

export default function LanguageToggle({ className = "" }) {
  const { lang, setLang, languages, c } = useSite();

  return (
    <div
      className={`kdx-lang ${className}`}
      role="radiogroup"
      aria-label={c.ui.switchLanguage}
    >
      <span
        className="kdx-lang-pill"
        style={{ "--i": languages.findIndex((l) => l.id === lang), "--n": languages.length }}
        aria-hidden="true"
      />
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
