import { useSiteContent } from "../context/SiteContentContext";

export function Hero() {
  const { hero, heroStats } = useSiteContent();

  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hero__panel hero__panel--dark">
        <p className="hero__eyebrow">{hero.eyebrow}</p>
        <h1 id="hero-heading" className="hero__title">
          <em>{hero.headlineItalic}</em> {hero.headlinePlain}
        </h1>
        <p className="hero__lead">{hero.lead}</p>
        <div className="hero__actions">
          <a className="btn btn--gold" href={hero.ctaPrimaryHref}>
            {hero.ctaPrimaryText}
          </a>
          <a className="btn btn--outline-light" href={hero.ctaSecondaryHref}>
            {hero.ctaSecondaryText}
          </a>
        </div>
      </div>
      <div className="hero__panel hero__panel--stats" role="list">
        {heroStats.map((stat) => (
          <div key={stat.id} className="hero__stat" role="listitem">
            <span className="hero__stat-value">{stat.value}</span>
            <span className="hero__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
