/**
 * Header — Navegação fixa com logo e links
 */

import { Link, useLocation } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function Header() {
  const location = useLocation();

  return (
    <header className="lp-sgo-header">
      <div className="lp-sgo-header-inner">
        <Link to="/" className="lp-sgo-logo">
          {siteData.siteName}
          <span className="lp-sgo-logo-dot">.</span>
        </Link>

        <nav className="lp-sgo-nav">
          {siteData.nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`lp-sgo-nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <a href={siteData.portalUrl} target="_blank" rel="noopener noreferrer" className="lp-sgo-nav-cta">
            Acessar Portal
          </a>
        </nav>
      </div>
    </header>
  );
}
