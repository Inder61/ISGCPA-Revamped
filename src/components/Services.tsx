import { useSiteContent } from "../context/SiteContentContext";

export function Services() {
  const { servicesSection, services } = useSiteContent();

  return (
    <section className="section services" id="services" aria-labelledby="services-heading">
      <header className="section__header">
        <p className="section__label">{servicesSection.sectionLabel}</p>
        <h2 id="services-heading" className="section__title">
          {servicesSection.sectionTitle}
        </h2>
      </header>
      <div className="services__grid">
        {services.map((s, i) => (
          <article key={s.id} className="service-card">
            <span className="service-card__index" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="service-card__title">{s.title}</h3>
            <p className="service-card__desc">{s.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
