/**
 * Página Documentação — Referência técnica organizada
 */

import { Book, Server, Puzzle, Code } from "lucide-react";
import { siteData } from "@/content/siteData";

const iconMap = [Server, Puzzle, Code, Book];

export function DocsPage() {
  return (
    <div className="sgo-page">
      <div className="sgo-page-hero">
        <h1 className="sgo-page-title">{siteData.docs.hero.title}</h1>
        <p className="sgo-page-subtitle">{siteData.docs.hero.subtitle}</p>
      </div>

      <div className="sgo-docs-grid">
        {siteData.docs.sections.map((section, i) => {
          const Icon = iconMap[i];
          return (
            <div key={i} className="sgo-docs-section">
              <div className="sgo-docs-section-header">
                <Icon className="sgo-docs-icon" size={28} />
                <h2 className="sgo-docs-section-title">{section.title}</h2>
              </div>
              <ul className="sgo-docs-list">
                {section.items.map((item, j) => (
                  <li key={j} className="sgo-docs-item">
                    <span className="sgo-docs-bullet">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="sgo-docs-cta">
        <p className="sgo-docs-cta-text">{siteData.docs.cta}</p>
      </div>
    </div>
  );
}
