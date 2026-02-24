/**
 * DevCta — Card de bifurcação pós-hero
 * Direciona integradores/devs para a página correta sem interromper o fluxo do cliente final
 */

import { ArrowUpRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function DevCta() {
  return (
    <section className="sgo-dev-cta">
      <div className="sgo-dev-cta-inner">
        <div className="sgo-dev-cta-icon">
          <Code2 size={20} />
        </div>
        <div className="sgo-dev-cta-content">
          <span className="sgo-dev-cta-eyebrow">{siteData.devCta.eyebrow}</span>
          <h3 className="sgo-dev-cta-title">{siteData.devCta.title}</h3>
          <p className="sgo-dev-cta-desc">{siteData.devCta.description}</p>
        </div>
        <Link to={siteData.devCta.link} className="sgo-dev-cta-btn">
          {siteData.devCta.cta}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
