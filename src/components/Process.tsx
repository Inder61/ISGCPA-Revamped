import { useSiteContent } from "../context/SiteContentContext";

export function Process() {
  const { processSection, processSteps } = useSiteContent();

  return (
    <section className="section process" id="process" aria-labelledby="process-heading">
      <header className="section__header">
        <p className="section__label">{processSection.sectionLabel}</p>
        <h2 id="process-heading" className="section__title">
          {processSection.sectionTitle}
        </h2>
      </header>
      <div className="process__track">
        {processSteps.map((step) => (
          <div key={step.id} className="process__step">
            <p className="process__num" aria-hidden>
              {step.stepNumber}
            </p>
            <h3 className="process__step-title">{step.title}</h3>
            <p className="process__step-text">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
