import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT, NAV, SERVICE_IDS } from "../data.js";
import { Mark } from "./primitives.jsx";
import FooterTree from "./FooterTree.jsx";
import { useSectionLink, useSite } from "../site-context.jsx";

export default function ContactFooter() {
  const {
    fields, setFields, errors, setErrors,
    sent, setSent, draftRestored, clearDraft,
    nameRef, copy, c, t,
  } = useSite();
  const services = SERVICE_IDS.map((id) => ({ id, name: c.services.items[id].name }));
  const sectionLink = useSectionLink();
  const messageRef = useRef(null);
  const [copied, setCopied] = useState("");
  const [sending, setSending] = useState(false);
  const [sentDirect, setSentDirect] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  const setField = (key) => (e) => {
    const value = e.target.value;
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const messageBody = useMemo(
    () =>
      [
        `${c.form.mailName}: ${fields.name || "-"}`,
        `${c.form.mailCompany}: ${fields.company || "-"}`,
        `${c.form.mailEmail}: ${fields.email || "-"}`,
        `${c.form.mailPhone}: ${fields.phone || "-"}`,
        `${c.form.mailService}: ${fields.service || c.form.notSure}`,
        "",
        fields.message,
      ].join("\n"),
    [fields, c]
  );

  const validate = () => {
    const next = {};
    if (!fields.name.trim()) next.name = c.form.errName;
    if (!fields.email.trim() && !fields.phone.trim()) next.email = c.form.errContact;
    else if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim()))
      next.email = c.form.errEmail;
    if (fields.message.trim().length < 10) next.message = c.form.errMessage;
    setErrors(next);
    return next;
  };

  const send = async () => {
    const next = validate();
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`kdx-${first}`)?.focus();
      return;
    }
    const who = fields.company || fields.name;
    const subject = fields.service
      ? t(c.form.mailSubjectService, { service: fields.service, who })
      : t(c.form.mailSubjectPlain, { who });

    if (CONTACT.formEndpoint) {
      setSending(true);
      setSendFailed(false);
      try {
        const res = await fetch(CONTACT.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...fields, subject, _subject: subject }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setSentDirect(true);
        setSent(true);
        clearDraft();
        return;
      } catch {
        setSendFailed(true);
      } finally {
        setSending(false);
      }
    }
    setSentDirect(false);
    try {
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(messageBody)}`;
    } catch {
      /* the copy fallback below covers this */
    }
    setSent(true);
  };

  const sendWhatsApp = () => {
    const next = validate();
    if (Object.keys(next).length) {
      document.getElementById(`kdx-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    window.open(
      `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
        `${c.form.whatsappGreeting}\n\n${messageBody}`
      )}`,
      "_blank",
      "noopener"
    );
  };

  const doCopy = (text, key, what) => {
    copy(text, what);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 2200);
  };

  const resetEnquiry = () => {
    setSent(false);
    setSentDirect(false);
    setSendFailed(false);
    clearDraft();
    window.setTimeout(() => nameRef.current?.focus(), 60);
  };

  const pickService = (name) =>
    setFields((f) => ({ ...f, service: f.service === name ? "" : name }));

  return (
    <footer className="kdx-contact" id="contact">
      <div className="kdx-wrap kdx-contact-inner">
        <p className="kdx-eyebrow" data-reveal>
          {c.form.eyebrow}
        </p>
        <h2 className="kdx-h2 kdx-contact-h" data-reveal>
          {c.form.heading}
        </h2>

        <div className="kdx-contact-grid">
          <div className="kdx-form" data-reveal>
            {sent ? (
              <div className="kdx-sent" role="status">
                <h3>{sentDirect ? c.form.sentDirectHeading : c.form.sentHeading}</h3>
                <p>
                  {sentDirect
                    ? c.form.sentDirectBody
                    : t(c.form.sentBody, { email: CONTACT.email })}
                </p>
                {sendFailed && !sentDirect && <p className="kdx-err">{c.form.errSend}</p>}
                <div className="kdx-form-actions">
                  {!sentDirect && (
                    <button
                      type="button"
                      className="kdx-btn kdx-btn-sm kdx-btn-blue"
                      onClick={() => doCopy(messageBody, "message", c.form.copyLabelMessage)}
                    >
                      {copied === "message" ? c.ui.copied : c.form.copyMessage}
                    </button>
                  )}
                  <button
                    type="button"
                    className="kdx-btn kdx-btn-sm kdx-btn-ghost"
                    onClick={resetEnquiry}
                  >
                    {c.form.writeAnother}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="kdx-field-row">
                  <div className="kdx-field">
                    <label htmlFor="kdx-name">{c.form.nameLabel}</label>
                    <input
                      id="kdx-name"
                      ref={nameRef}
                      autoComplete="name"
                      value={fields.name}
                      onChange={setField("name")}
                      placeholder={c.form.namePlaceholder}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "kdx-name-err" : undefined}
                    />
                    {errors.name && (
                      <p className="kdx-err" id="kdx-name-err">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="kdx-field">
                    <label htmlFor="kdx-company">
                      {c.form.companyLabel} <span className="kdx-opt">{c.form.optional}</span>
                    </label>
                    <input
                      id="kdx-company"
                      autoComplete="organization"
                      value={fields.company}
                      onChange={setField("company")}
                      placeholder={c.form.companyPlaceholder}
                    />
                  </div>
                </div>

                <div className="kdx-field-row">
                  <div className="kdx-field">
                    <label htmlFor="kdx-email">{c.form.emailLabel}</label>
                    <input
                      id="kdx-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={setField("email")}
                      placeholder={c.form.emailPlaceholder}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "kdx-email-err" : undefined}
                    />
                    {errors.email && (
                      <p className="kdx-err" id="kdx-email-err">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="kdx-field">
                    <label htmlFor="kdx-phone">{c.form.phoneLabel}</label>
                    <input
                      id="kdx-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={setField("phone")}
                      placeholder={c.form.phonePlaceholder}
                    />
                  </div>
                </div>
                <p className="kdx-hint">{c.form.eitherIsEnough}</p>

                <div className="kdx-field">
                  <span className="kdx-label">
                    {c.form.serviceLabel} <span className="kdx-opt">{c.form.optional}</span>
                  </span>
                  <div className="kdx-chips" role="group" aria-label={c.form.serviceAria}>
                    {services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`kdx-chip kdx-chip-light ${fields.service === s.name ? "is-on" : ""}`}
                        aria-pressed={fields.service === s.name}
                        onClick={() => pickService(s.name)}
                      >
                        {s.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`kdx-chip kdx-chip-light ${fields.service === c.form.notSure ? "is-on" : ""}`}
                      aria-pressed={fields.service === c.form.notSure}
                      onClick={() => pickService(c.form.notSure)}
                    >
                      {c.form.notSure}
                    </button>
                  </div>
                </div>

                <div className="kdx-field">
                  <label htmlFor="kdx-message">{c.form.messageLabel}</label>
                  <textarea
                    id="kdx-message"
                    ref={messageRef}
                    rows={4}
                    value={fields.message}
                    onChange={setField("message")}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send();
                    }}
                    placeholder={c.form.messagePlaceholder}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "kdx-message-err" : undefined}
                  />
                  {errors.message && (
                    <p className="kdx-err" id="kdx-message-err">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="kdx-form-actions">
                  <button type="button" className="kdx-btn kdx-btn-blue" onClick={send} disabled={sending}>
                    {sending ? c.form.sending : c.form.send}
                  </button>
                  <button type="button" className="kdx-btn kdx-btn-ghost" onClick={sendWhatsApp}>
                    {c.form.sendWhatsApp}
                  </button>
                </div>

                {sendFailed && (
                  <p className="kdx-err" role="alert">
                    {c.form.errSend}
                  </p>
                )}

                {draftRestored ? (
                  <p className="kdx-saved" role="status">
                    <span>{c.form.draftKept}</span>
                    <button type="button" onClick={clearDraft}>
                      {c.form.clearDraft}
                    </button>
                  </p>
                ) : (
                  <p className="kdx-form-note">{c.form.replyNote}</p>
                )}
              </>
            )}
          </div>

          <div className="kdx-details" data-reveal>
            <dl className="kdx-contact-rows">
              <div>
                <dt>{c.details.email}</dt>
                <dd dir="ltr">
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  <button
                    type="button"
                    className="kdx-copy"
                    onClick={() => doCopy(CONTACT.email, "email", c.form.copyLabelEmail)}
                  >
                    {copied === "email" ? c.ui.copied : c.ui.copy}
                  </button>
                </dd>
              </div>
              <div>
                <dt>{c.details.phone}</dt>
                <dd dir="ltr">
                  <a href={`tel:${CONTACT.phoneDial}`}>{CONTACT.phoneDisplay}</a>
                  <button
                    type="button"
                    className="kdx-copy"
                    onClick={() => doCopy(CONTACT.phoneDisplay, "phone", c.form.copyLabelPhone)}
                  >
                    {copied === "phone" ? c.ui.copied : c.ui.copy}
                  </button>
                </dd>
              </div>
              <div>
                <dt>{c.details.web}</dt>
                <dd dir="ltr">
                  <a href={CONTACT.webUrl} target="_blank" rel="noreferrer">
                    {CONTACT.web}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{c.details.base}</dt>
                <dd>{c.details.baseValue}</dd>
              </div>
            </dl>

            <a
              className="kdx-btn kdx-btn-sm kdx-btn-ghost kdx-details-wa"
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              {c.details.whatsappCta}
            </a>

            <Mark variant="white" className="kdx-details-mark" />
          </div>
        </div>

        <div className="kdx-contact-foot">
          <FooterTree />
          <nav className="kdx-foot-links" aria-label={c.ui.sections}>
            {NAV.map((n) =>
              n.to ? (
                <Link key={n.id} to={n.to}>
                  {c.nav[n.id]}
                </Link>
              ) : (
                <a key={n.id} {...sectionLink(n.section)}>
                  {c.nav[n.id]}
                </a>
              )
            )}
          </nav>
          <span className="kdx-foot-meta">
            {t(c.details.footMeta, { year: new Date().getFullYear() })}
          </span>
          <button type="button" className="kdx-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            {c.ui.backToTop} <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
