import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const headerClass = [
    "header",
    solid ? "header--solid" : "header--transparent",
  ].join(" ");

  return (
    <header className={headerClass}>
      <div className="header__inner">
        <a className="header__brand" href="#top" onClick={() => setMenuOpen(false)}>
          <img
            className="header__logo"
            src="/isg-logo.png"
            alt="ISG CPA Professional Corporation"
            width={220}
            height={62}
          />
        </a>

        <nav
          id="primary-nav"
          className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}
          aria-label="Primary"
        >
          <ul className="header__links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--gold header__cta" href="#contact" onClick={() => setMenuOpen(false)}>
            Get Started
          </a>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden />
          <span aria-hidden />
          <span aria-hidden />
        </button>
      </div>
    </header>
  );
}
