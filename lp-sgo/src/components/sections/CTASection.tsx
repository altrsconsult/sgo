/**
 * CTA Section — Escolha seu caminho
 */

import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function CTASection() {
  return (
    <section className="sgo-cta" id="comecar">
      <div className="sgo-section-header">
        <h2 className="sgo-section-title">{siteData.cta.title}</h2>
        <p className="sgo-section-subtitle">{siteData.cta.subtitle}</p>
      </div>

      <div className="sgo-cta-grid">
        {siteData.cta.options.map((option) => {
          const isExternal = option.link.startsWith("http");
          const Component = isExternal ? "a" : Link;
          const props = isExternal
            ? { href: option.link, target: "_blank", rel: "noopener noreferrer" }
            : { to: option.link };

          return (
            <Component key={option.id} {...props} className="sgo-cta-card">
              <div className="sgo-cta-card-header">
                <h3 className="sgo-cta-card-title">{option.title}</h3>
                <ArrowUpRight className="sgo-cta-card-icon" size={20} />
              </div>
              <p className="sgo-cta-card-desc">{option.description}</p>
              <div className="sgo-cta-card-footer">
                <span className="sgo-cta-card-link">{option.cta}</span>
              </div>
            </Component>
          );
        })}
      </div>
    </section>
  );
}
