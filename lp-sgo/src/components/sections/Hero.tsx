/**
 * Hero Section — SGO LP
 * Headline massiva + subtexto + CTAs
 */

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function Hero() {
  return (
    <section className="sgo-hero" id="hero">
      <div className="sgo-hero-bg">
        <div className="sgo-hero-grid" />
        <div className="sgo-hero-blur sgo-hero-blur--primary" />
        <div className="sgo-hero-blur sgo-hero-blur--secondary" />
      </div>

      <div className="sgo-hero-lines">
        <div className="sgo-hero-line sgo-hero-line--left" />
        <div className="sgo-hero-line sgo-hero-line--right" />
      </div>

      <div className="sgo-hero-inner">
        <div className="sgo-hero-badge">{siteData.hero.badge}</div>
        
        <h1 className="sgo-hero-title">
          <span className="sgo-hero-title-part">{siteData.hero.headline.part1}</span>
          <span className="sgo-hero-title-accent">{siteData.hero.headline.part2}</span>
          <span className="sgo-hero-title-accent">{siteData.hero.headline.part3}</span>
        </h1>

        <div className="sgo-hero-divider" />

        <p className="sgo-hero-subtitle">
          <span className="sgo-hero-slash">//</span> {siteData.hero.subtitle}
        </p>

        <div className="sgo-hero-ctas">
          <a href={siteData.altrsHomeUrl} target="_blank" rel="noopener noreferrer" className="sgo-btn sgo-btn--primary">
            {siteData.hero.ctaPrimary}
            <ArrowDownRight size={18} />
          </a>
          <a href="#como-funciona" className="sgo-btn sgo-btn--secondary">
            {siteData.hero.ctaSecondary}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      <div className="sgo-hero-scroll-hint">
        <span>Scroll</span>
        <div className="sgo-hero-scroll-line" />
      </div>
    </section>
  );
}
