/**
 * Comparison Section — SGO vs. Desenvolvimento Tradicional
 */

import { X, Check } from "lucide-react";
import { siteData } from "@/content/siteData";

export function Comparison() {
  return (
    <section className="sgo-comparison" id="comparacao">
      <div className="sgo-section-header">
        <h2 className="sgo-section-title">{siteData.comparison.title}</h2>
        {siteData.comparison.subtitle && (
          <p className="sgo-section-subtitle">{siteData.comparison.subtitle}</p>
        )}
      </div>

      <div className="sgo-comparison-grid">
        <div className="sgo-comparison-col sgo-comparison-col--problem">
          <h3 className="sgo-comparison-title">{siteData.comparison.traditional.title}</h3>
          <ul className="sgo-comparison-list">
            {siteData.comparison.traditional.items.map((item, i) => (
              <li key={i} className="sgo-comparison-item">
                <X className="sgo-comparison-icon sgo-comparison-icon--negative" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sgo-comparison-col sgo-comparison-col--solution">
          <h3 className="sgo-comparison-title">{siteData.comparison.sgo.title}</h3>
          <ul className="sgo-comparison-list">
            {siteData.comparison.sgo.items.map((item, i) => (
              <li key={i} className="sgo-comparison-item">
                <Check className="sgo-comparison-icon sgo-comparison-icon--positive" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
