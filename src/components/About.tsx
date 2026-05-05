import { useEffect, useId, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext";

export function About() {
  const { aboutSection, aboutFeatures, aboutAccordion } = useSiteContent();
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  useEffect(() => {
    if (aboutAccordion.length === 0) {
      setOpenId(null);
      return;
    }
    setOpenId((prev) => {
      if (prev && aboutAccordion.some((a) => a.id === prev)) return prev;
      return aboutAccordion[0].id;
    });
  }, [aboutAccordion]);

  return (
    <section className="section about" id="about" aria-labelledby="about-heading">
      <div className="about__grid">
        <div className="about__story">
          <p className="section__label">{aboutSection.sectionLabel}</p>
          <h2 id="about-heading" className="about__story-title">
            {aboutSection.storyTitle}
          </h2>
          <p className="about__story-text">{aboutSection.storyText}</p>
          <ul className="about__list">
            {aboutFeatures.map((item) => (
              <li key={item.id}>
                <span className="about__check" aria-hidden />
                {item.bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="about__why">
          <h3 className="about__why-title">{aboutSection.accordionHeading}</h3>
          <div className="accordion">
            {aboutAccordion.map((item) => {
              const panelId = `${baseId}-${item.id}`;
              const expanded = openId === item.id;
              return (
                <div key={item.id} className="accordion__item">
                  <button
                    type="button"
                    className="accordion__trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    id={`${panelId}-btn`}
                    onClick={() => setOpenId(expanded ? null : item.id)}
                  >
                    <span>{item.title}</span>
                    <span aria-hidden>+</span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${panelId}-btn`}
                    hidden={!expanded}
                    className="accordion__panel"
                  >
                    {expanded ? <div className="accordion__panel-inner">{item.body}</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
