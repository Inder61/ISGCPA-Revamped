import { useSiteContent } from "../context/SiteContentContext";

export function Footer() {
  const { services, siteContact } = useSiteContent();
  const mailHref = `mailto:${siteContact.email}`;

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__col">
          <p className="footer__brand">
            {siteContact.brandPrimary}
            <span>{siteContact.brandAccent}</span>
          </p>
          <p className="footer__tagline">{siteContact.footerTagline}</p>
        </div>
        <div className="footer__col">
          <h3>Firm</h3>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#process">Process</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#services">Resources</a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h3>Services</h3>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <a href="#services">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col">
          <h3>Contact</h3>
          <ul>
            <li>{siteContact.addressShort}</li>
            <li>
              <a href={siteContact.phoneHref}>{siteContact.phoneDisplay}</a>
            </li>
            <li>
              <a href={mailHref}>{siteContact.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>
          © {new Date().getFullYear()} {siteContact.copyrightEntity}. All rights reserved.
        </span>
        <span>{siteContact.legalFooterLine}</span>
      </div>
    </footer>
  );
}
