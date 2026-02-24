/**
 * Página /devs — Para integradores e vibe-coders
 * Foco: quem já entrega Chatwoot, IA, automações e quer adicionar o SGO ao stack
 */

import { AlertCircle, Boxes, Sparkles, Github, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function DevsPage() {
  const { devs } = siteData;

  return (
    <div className="sgo-page">

      {/* Hero */}
      <div className="sgo-page-hero">
        <h1 className="sgo-page-title">{devs.hero.title}</h1>
        <p className="sgo-page-subtitle">{devs.hero.subtitle}</p>
      </div>

      {/* O problema que o integrador conhece bem */}
      <section className="sgo-page-section">
        <h2 className="sgo-page-section-title">
          <AlertCircle size={24} className="inline-block mr-2 text-primary" />
          {devs.problem.title}
        </h2>
        <p className="sgo-page-section-subtitle">{devs.problem.subtitle}</p>
        <div className="sgo-grid-3">
          {devs.problem.items.map((item, i) => (
            <div key={i} className="sgo-tech-card sgo-tech-card--problem">
              <h3 className="sgo-tech-card-title">{item.title}</h3>
              <p className="sgo-tech-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que muda com o SGO */}
      <section className="sgo-page-section">
        <h2 className="sgo-page-section-title">
          <Boxes size={24} className="inline-block mr-2 text-primary" />
          {devs.solution.title}
        </h2>
        <p className="sgo-page-section-subtitle">{devs.solution.subtitle}</p>
        <div className="sgo-grid-2">
          {devs.solution.items.map((item, i) => (
            <div key={i} className="sgo-tech-card">
              <h3 className="sgo-tech-card-title">{item.title}</h3>
              <p className="sgo-tech-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="sgo-page-section">
        <h2 className="sgo-page-section-title">
          <Github size={24} className="inline-block mr-2 text-primary" />
          {devs.quickStart.title}
        </h2>
        <div className="sgo-code-block">
          {devs.quickStart.steps.map((step, i) => (
            <div key={i} className="sgo-code-line">
              <span className="sgo-code-prompt">$</span> {step}
            </div>
          ))}
        </div>
      </section>

      {/* IA-friendly */}
      <section className="sgo-page-section sgo-ai-section">
        <h2 className="sgo-page-section-title">
          <Sparkles size={24} className="inline-block mr-2 text-primary" />
          {devs.aiFriendly.title}
        </h2>
        <p className="sgo-ai-desc">{devs.aiFriendly.description}</p>
        <ul className="sgo-ai-benefits">
          {devs.aiFriendly.benefits.map((benefit, i) => (
            <li key={i} className="sgo-ai-benefit">
              <span className="sgo-ai-bullet">→</span> {benefit}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA final — GitHub */}
      <section className="sgo-page-section sgo-github-cta">
        <h2 className="sgo-github-cta-title">{devs.githubCta.title}</h2>
        <p className="sgo-github-cta-desc">{devs.githubCta.description}</p>
        <div className="sgo-github-cta-actions">
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
      </section>

    </div>
  );
}
