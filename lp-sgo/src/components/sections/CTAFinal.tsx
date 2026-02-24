/**
 * CTA Final — Comercial pós-conteúdo
 */

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { siteData } from "@/content/siteData";

export function CTAFinal() {
  return (
    <section className="sgo-cta-final" id="contato">
      <div className="sgo-cta-final-inner">
        <div className="sgo-cta-final-header">
          <h2 className="sgo-cta-final-title">{siteData.ctaFinal.title}</h2>
          <p className="sgo-cta-final-subtitle">{siteData.ctaFinal.subtitle}</p>
          <p className="sgo-cta-final-desc">{siteData.ctaFinal.description}</p>
        </div>

        <div className="sgo-cta-final-benefits">
          {siteData.ctaFinal.benefits.map((benefit, i) => (
            <div key={i} className="sgo-cta-final-benefit">
              <CheckCircle2 className="sgo-cta-final-benefit-icon" size={20} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="sgo-cta-final-action">
          <a 
            href={siteData.ctaFinal.ctaLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sgo-btn sgo-btn--primary sgo-btn--large"
          >
            {siteData.ctaFinal.cta}
            <ArrowUpRight size={20} />
          </a>
          <p className="sgo-cta-final-note">{siteData.ctaFinal.note}</p>
        </div>
      </div>
    </section>
  );
}
