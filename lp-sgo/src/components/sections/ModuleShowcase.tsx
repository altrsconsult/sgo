/**
 * Module Showcase Section — Exemplos de módulos
 */

import { UserPlus, Users, BarChart3, Zap, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

const iconMap = {
  "user-plus": UserPlus,
  "users": Users,
  "bar-chart": BarChart3,
  "zap": Zap,
  "code-2": Code2,
};

export function ModuleShowcase() {
  return (
    <section className="sgo-modules" id="modulos">
      <div className="sgo-section-header">
        <h2 className="sgo-section-title">{siteData.modules.title}</h2>
        <p className="sgo-section-subtitle">{siteData.modules.subtitle}</p>
        <p className="sgo-section-desc">{siteData.modules.description}</p>
      </div>

      <div className="sgo-modules-grid">
        {siteData.modules.examples.map((module, i) => {
          const Icon = iconMap[module.icon as keyof typeof iconMap];
          return (
            <div key={i} className="sgo-module-card">
              <Icon className="sgo-module-icon" size={28} />
              <h3 className="sgo-module-name">{module.name}</h3>
              <p className="sgo-module-desc">{module.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="sgo-modules-cta">
        <Link to="/devs" className="sgo-link-inline">
          {siteData.modules.cta} →
        </Link>
      </div>
    </section>
  );
}
