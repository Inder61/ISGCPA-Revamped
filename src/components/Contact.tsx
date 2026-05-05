import { FormEvent, useMemo, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext";
import { getSupabase } from "../lib/supabase";

const OTHER_INQUIRY = "Other / General inquiry";

export function Contact() {
  const { services, siteContact } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mailNotifyWarn, setMailNotifyWarn] = useState(false);

  const serviceOptions = useMemo(
    () => [...services.map((s) => s.title), OTHER_INQUIRY],
    [services]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(false);
    setSubmitError(null);
    setMailNotifyWarn(false);
    const sb = getSupabase();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const serviceInterest = String(fd.get("service") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitError("Please fill in your name, email, and message.");
      return;
    }

    if (!sb) {
      setSubmitError("Form cannot send: Supabase is not configured.");
      return;
    }

    setBusy(true);
    const { error } = await sb.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      service_interest: serviceInterest || null,
      message,
    });

    if (error) {
      setBusy(false);
      setSubmitError(error.message || "Could not send your message. Please try again.");
      return;
    }

    const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
    if (web3Key) {
      try {
        const w3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `Website contact: ${name}`,
            from_name: name,
            name,
            email,
            replyto: email,
            phone: phone || "",
            service_interest: serviceInterest || "",
            message,
          }),
        });
        const w3Json = (await w3Res.json()) as { success?: boolean; message?: string };
        if (!w3Res.ok || !w3Json.success) {
          console.error("Web3Forms notify failed:", w3Json.message ?? w3Res.status);
          setMailNotifyWarn(true);
        }
      } catch (err) {
        console.error("Web3Forms notify failed:", err);
        setMailNotifyWarn(true);
      }
    }

    setBusy(false);

    setSent(true);
    form.reset();
  }

  const mailHref = `mailto:${siteContact.email}`;

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-heading">
      <div className="contact__grid">
        <aside className="contact__aside">
          <div>
            <p className="section__label" style={{ color: "var(--color-gold)", marginBottom: "0.5rem" }}>
              Contact
            </p>
            <h2 id="contact-heading" className="contact__aside-title">
              Begin with a confidential introduction.
            </h2>
            <p className="contact__aside-lead">
              Share a brief note on your situation. We respond within one business day — often sooner.
            </p>
          </div>
          <div className="contact__detail">
            <strong>Office</strong>
            {siteContact.officeLine}
          </div>
          <div className="contact__detail">
            <strong>Telephone</strong>
            <a href={siteContact.phoneHref}>{siteContact.phoneDisplay}</a>
          </div>
          <div className="contact__detail">
            <strong>Email</strong>
            <a href={mailHref}>{siteContact.email}</a>
          </div>
        </aside>

        <div className="contact__form-wrap">
          <form className="contact-form" onSubmit={(e) => void handleSubmit(e)} noValidate>
            <div className="contact-form__row">
              <label>
                Full name
                <input name="name" type="text" autoComplete="name" required disabled={busy} />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required disabled={busy} />
              </label>
            </div>
            <label>
              Phone
              <input name="phone" type="tel" autoComplete="tel" disabled={busy} />
            </label>
            <label>
              Service interest
              <select name="service" defaultValue="" disabled={busy}>
                <option value="" disabled>
                  Select a service
                </option>
                {serviceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea name="message" rows={5} required placeholder="How can we help?" disabled={busy} />
            </label>
            {submitError ? (
              <p className="contact-form__error" role="alert">
                {submitError}
              </p>
            ) : null}
            {sent && !submitError ? (
              <>
                <p className="contact-form__success" role="status">
                  Thank you — your message has been sent. We will reply shortly.
                </p>
                {mailNotifyWarn ? (
                  <p className="contact-form__warn" role="status">
                    We saved your message, but the instant email alert did not go through. We may still
                    reply from our inbox — or reach us by phone or email on the left.
                  </p>
                ) : null}
              </>
            ) : null}
            <button type="submit" className="btn btn--primary-solid contact-form__submit" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
