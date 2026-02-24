/**
 * How It Works Section — Passos de uso do SGO
 */

import { siteData } from "@/content/siteData";

export function HowItWorks() {
  return (
    <section className="sgo-how" id="como-funciona">
      <div className="sgo-section-header">
        <h2 className="sgo-section-title">{siteData.howItWorks.title}</h2>
        <p className="sgo-section-subtitle">{siteData.howItWorks.subtitle}</p>
      </div>

      <div className="sgo-how-timeline">
        {siteData.howItWorks.steps.map((step) => (
          <div key={step.number} className="sgo-how-step">
            <div className="sgo-how-step-number">{step.number}</div>
            <div className="sgo-how-step-content">
              <h3 className="sgo-how-step-title">{step.title}</h3>
              <p className="sgo-how-step-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
