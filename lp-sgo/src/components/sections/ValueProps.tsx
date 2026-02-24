/**
 * Value Props Section — Três pilares do SGO
 */

import { ShieldCheck, Layers, Code2 } from "lucide-react";
import { siteData } from "@/content/siteData";

const iconMap = {
  "shield-check": ShieldCheck,
  "layers": Layers,
  "code": Code2,
};

export function ValueProps() {
  return (
    <section className="sgo-value" id="valor">
      <div className="sgo-section-header">
        <h2 className="sgo-section-title">{siteData.value.title}</h2>
        <p className="sgo-section-subtitle">{siteData.value.subtitle}</p>
      </div>

      <div className="sgo-value-grid">
        {siteData.value.items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <div key={item.id} className="sgo-value-card">
              <div className="sgo-value-card-header">
                <span className="sgo-value-card-id">{item.id}</span>
                <Icon className="sgo-value-card-icon" size={32} />
              </div>
              <div className="sgo-value-card-label">{item.label}</div>
              <h3 className="sgo-value-card-title">{item.title}</h3>
              <p className="sgo-value-card-desc">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
