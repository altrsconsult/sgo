/**
 * Pricing Section — Modelo transparente
 */

import { siteData } from "@/content/siteData";

export function PricingSection() {
  return (
    <section className="sgo-pricing" id="modelo">
      <div className="sgo-section-header">
        <h2 className="sgo-section-title">{siteData.pricing.title}</h2>
        <p className="sgo-section-subtitle">{siteData.pricing.subtitle}</p>
        <p className="sgo-section-desc">{siteData.pricing.description}</p>
        {'highlight' in siteData.pricing && (
          <span className="sgo-pricing-highlight">{(siteData.pricing as any).highlight}</span>
        )}
      </div>

      <div className="sgo-pricing-grid">
        {siteData.pricing.models.map((model) => (
          <div key={model.id} className="sgo-pricing-card">
            <div className="sgo-pricing-card-header">
              <span className="sgo-pricing-card-label">{model.label}</span>
              <h3 className="sgo-pricing-card-title">{model.title}</h3>
            </div>

            <ul className="sgo-pricing-card-items">
              {model.items.map((item, i) => (
                <li key={i} className="sgo-pricing-card-item">
                  <span className="sgo-pricing-card-bullet">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="sgo-pricing-card-highlight">
              {model.highlight}
            </div>
          </div>
        ))}
      </div>

      <div className="sgo-pricing-note">
        <span className="sgo-pricing-note-icon">💡</span>
        <p>{siteData.pricing.note}</p>
      </div>
    </section>
  );
}
