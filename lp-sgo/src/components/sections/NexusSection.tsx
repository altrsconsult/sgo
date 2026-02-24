/**
 * Nexus Section — Gestão remota opcional
 */

import { siteData } from "@/content/siteData";

export function NexusSection() {
  return (
    <section className="sgo-nexus" id="nexus">
      <div className="sgo-nexus-inner">
        <div className="sgo-nexus-header">
          <h2 className="sgo-nexus-title">{siteData.nexus.title}</h2>
          <p className="sgo-nexus-subtitle">{siteData.nexus.subtitle}</p>
        </div>

        <p className="sgo-nexus-desc">{siteData.nexus.description}</p>

        <div className="sgo-nexus-features">
          {siteData.nexus.features.map((feature, i) => (
            <div key={i} className="sgo-nexus-feature">
              <span className="sgo-nexus-feature-bullet">→</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="sgo-nexus-note">
          <span className="sgo-nexus-note-label">// Importante</span>
          <p>{siteData.nexus.note}</p>
        </div>
      </div>
    </section>
  );
}
