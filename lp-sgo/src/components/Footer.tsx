/**
 * Rodapé da LP SGO — empresa, link site oficial, contato
 */

import { Link } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function Footer() {
  return (
    <footer className="lp-sgo-footer">
      <div className="lp-sgo-footer-inner">
        <div className="lp-sgo-footer-brand">
          <span className="lp-sgo-footer-company">{siteData.footer.company}<span className="lp-sgo-footer-dot">.</span></span>
          <p className="lp-sgo-footer-desc">{siteData.footer.description}</p>
        </div>
        <div className="lp-sgo-footer-links">
          <a href={siteData.altrsHomeUrl} target="_blank" rel="noopener noreferrer" className="lp-sgo-footer-link">
            {siteData.footer.linkSite}
          </a>
          <Link to="/devs" className="lp-sgo-footer-link">
            Para Devs
          </Link>
          <Link to="/docs" className="lp-sgo-footer-link">
            Documentação
          </Link>
        </div>
        <p className="lp-sgo-footer-contact">{siteData.footer.contact}</p>
      </div>
    </footer>
  );
}
