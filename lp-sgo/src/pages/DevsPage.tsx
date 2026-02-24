/**
 * Página /devs — Landing page para integradores e desenvolvedores
 * Hero com mesmo peso visual da home — pode ser destino direto de campanha
 */

import { AlertCircle, Boxes, Sparkles, Github, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function DevsPage() {
  const { devs } = siteData;

  return (
    <div className="sgo-home">

      {/* Hero — mesmo peso visual da home */}
      <section className="sgo-hero" id="hero-devs">
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
          <div className="sgo-hero-badge">{devs.hero.badge}</div>

          <h1 className="sgo-hero-title">
            <span className="sgo-hero-title-part">{devs.hero.headline.part1}</span>
            <span className="sgo-hero-title-accent">{devs.hero.headline.part2}</span>
            <span className="sgo-hero-title-accent">{devs.hero.headline.part3}</span>
          </h1>

          <div className="sgo-hero-divider" />

          <p className="sgo-hero-subtitle">
            <span className="sgo-hero-slash">//</span> {devs.hero.subtitle}
          </p>

          <div className="sgo-hero-ctas">
            <a
              href={devs.hero.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="sgo-btn sgo-btn--primary"
            >
              <Github size={18} />
              {devs.hero.ctaPrimary}
              <ArrowDownRight size={18} />
            </a>
            <a href="#problema" className="sgo-btn sgo-btn--secondary">
              {devs.hero.ctaSecondary}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <div className="sgo-hero-scroll-hint">
          <span>Scroll</span>
          <div className="sgo-hero-scroll-line" />
        </div>
      </section>

      {/* O problema que o integrador conhece bem */}
      <section className="sgo-value" id="problema">
        <div className="sgo-section-header">
          <h2 className="sgo-section-title">{devs.problem.title}</h2>
          <p className="sgo-section-subtitle">{devs.problem.subtitle}</p>
        </div>
        <div className="sgo-value-grid">
          {devs.problem.items.map((item, i) => (
            <div key={i} className="sgo-value-card sgo-value-card--problem">
              <div className="sgo-value-card-header">
                <span className="sgo-value-card-id">0{i + 1}</span>
                <AlertCircle className="sgo-value-card-icon" size={32} />
              </div>
              <h3 className="sgo-value-card-title">{item.title}</h3>
              <p className="sgo-value-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que muda com o SGO */}
      <section className="sgo-value sgo-value--alt" id="solucao">
        <div className="sgo-section-header">
          <h2 className="sgo-section-title">{devs.solution.title}</h2>
          <p className="sgo-section-subtitle">{devs.solution.subtitle}</p>
        </div>
        <div className="sgo-value-grid">
          {devs.solution.items.map((item, i) => (
            <div key={i} className="sgo-value-card">
              <div className="sgo-value-card-header">
                <span className="sgo-value-card-id">0{i + 1}</span>
                <Boxes className="sgo-value-card-icon" size={32} />
              </div>
              <h3 className="sgo-value-card-title">{item.title}</h3>
              <p className="sgo-value-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="sgo-how" id="quickstart">
        <div className="sgo-section-header">
          <h2 className="sgo-section-title">{devs.quickStart.title}</h2>
          <p className="sgo-section-subtitle">Docker Desktop + pnpm — ambiente completo em minutos</p>
        </div>
        <div className="sgo-dev-code-block">
          {devs.quickStart.steps.map((step, i) => (
            <div key={i} className="sgo-dev-code-line">
              <span className="sgo-dev-code-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="sgo-dev-code-prompt">$</span>
              <span className="sgo-dev-code-text">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* IA-friendly */}
      <section className="sgo-value" id="ia">
        <div className="sgo-section-header">
          <h2 className="sgo-section-title">{devs.aiFriendly.title}</h2>
        </div>
        <div className="sgo-ai-feature">
          <p className="sgo-ai-desc">{devs.aiFriendly.description}</p>
          <ul className="sgo-ai-benefits">
            {devs.aiFriendly.benefits.map((benefit, i) => (
              <li key={i} className="sgo-ai-benefit">
                <span className="sgo-ai-bullet">→</span> {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA final — GitHub */}
      <section className="sgo-cta-final-dev" id="github">
        <div className="sgo-cta-final-dev-inner">
          <h2 className="sgo-cta-final-dev-title">{devs.githubCta.title}</h2>
          <p className="sgo-cta-final-dev-desc">{devs.githubCta.description}</p>
          <div className="sgo-cta-final-dev-actions">
            <a
              href={devs.githubCta.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="sgo-btn sgo-btn--primary"
            >
              <Github size={18} />
              {devs.githubCta.cta}
              <ArrowUpRight size={16} />
            </a>
            <Link to={devs.githubCta.ctaSecondaryLink} className="sgo-btn sgo-btn--secondary">
              {devs.githubCta.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
