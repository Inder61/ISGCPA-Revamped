import { useEffect, useMemo, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext";

const POPUP_SESSION_KEY = "isgLeadPopupDismissed";

function phoneToWhatsapp(phoneHref: string) {
  return phoneHref.replace("tel:", "").replace(/[^\d]/g, "");
}

export function LeadPopup() {
  const { siteContact } = useSiteContent();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const whatsappNumber = useMemo(() => phoneToWhatsapp(siteContact.phoneHref), [siteContact.phoneHref]);
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Hello ISG Consulting, I would like to book a free consultation."
      )}`
    : "#contact";
  const mailHref = `mailto:${siteContact.email}?subject=${encodeURIComponent(
    "Free consultation request"
  )}&body=${encodeURIComponent(
    "Hello ISG Consulting,\n\nI would like to book a free consultation for my accounting needs."
  )}`;

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(POPUP_SESSION_KEY) === "true";
    setDismissed(wasDismissed);

    if (wasDismissed) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible]);

  function closePopup() {
    sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    setVisible(false);
    setDismissed(true);
  }

  function openPopup() {
    sessionStorage.removeItem(POPUP_SESSION_KEY);
    setDismissed(false);
    setVisible(true);
  }

  return (
    <>
      {visible ? (
        <div className="lead-popup-backdrop" role="presentation">
          <aside
            className="lead-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-popup-title"
          >
            <button
              type="button"
              className="lead-popup__close"
              onClick={closePopup}
              aria-label="Close consultation popup"
            >
              ×
            </button>

            <div className="lead-popup__visual" aria-hidden="true">
              <img src="/lead-popup-accounting.jpg" alt="" />
              <div className="lead-popup__visual-shade" />
            </div>

            <div className="lead-popup__content">
              <div className="lead-popup__logo-wrap">
                <img
                  className="lead-popup__logo"
                  src="/isg-logo.png"
                  alt="ISG CPA Professional Corporation"
                />
              </div>
              <p className="lead-popup__eyebrow">Need accounting help?</p>
              <h2 id="lead-popup-title">Schedule a free consultation.</h2>
              <p>
                Get a clear next step for your tax, bookkeeping, payroll, or CRA question from a
                Canadian accounting team.
              </p>

              <div className="lead-popup__actions" aria-label="Contact options">
                <a className="btn btn--gold" href={whatsappHref} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <a className="btn btn--outline-dark" href={mailHref}>
                  Email
                </a>
                <a className="btn btn--primary-solid" href={siteContact.phoneHref}>
                  Call
                </a>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {dismissed && !visible ? (
        <button type="button" className="lead-popup-tab" onClick={openPopup}>
          Free consultation
        </button>
      ) : null}
    </>
  );
}
